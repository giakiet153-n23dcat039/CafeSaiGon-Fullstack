using CafeSaiGon.Api.Data;
using CafeSaiGon.Api.Models;
using CafeSaiGon.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace CafeSaiGon.Api.Controllers;

public record SignupRequest([Required, EmailAddress] string Email, [Required, MinLength(8)] string Password,
    [Required] string FullName, bool ApplyAsStaff = false);
public record LoginRequest(string Email, string Password);
public record VerifyCodeRequest([Required, EmailAddress] string Email,
    [Required, RegularExpression("^[0-9]{6}$", ErrorMessage = "Mã phải gồm đúng 6 chữ số.")] string Code);
public record ResendCodeRequest([Required, EmailAddress] string Email);

[ApiController]
[Route("api/auth")]
public class AuthController(CafeDbContext db, AuthService auth, EmailSender sender,
    ILogger<AuthController> logger) : ControllerBase
{
    private const int CodeLifetimeMinutes = 10;
    private const int ResendCooldownSeconds = 60;
    private const int MaxCodeAttempts = 5;
    private const int MaxCodesPer24Hours = 5;

    [HttpPost("register")]
    [EnableRateLimiting("email-otp")]
    public async Task<IActionResult> Register(SignupRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(req.FullName) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Vui lòng nhập đủ họ tên và mật khẩu." });
        if (await db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { message = "Email đã được đăng ký. Nếu chưa xác thực, hãy chọn Nhập mã / Gửi lại mã." });
        if (!sender.IsConfigured)
            return StatusCode(503, new { message = "Chưa cấu hình máy chủ gửi email (SMTP). Xem HUONG_DAN_EMAIL_OTP.md." });

        var user = new AppUser
        {
            Email = email,
            FullName = req.FullName.Trim(),
            Role = req.ApplyAsStaff ? "Staff" : "Customer",
            Approved = !req.ApplyAsStaff
        };
        user.PasswordHash = auth.HashPassword(user, req.Password);
        var code = AuthService.NewEmailCode();
        PrepareNewCode(user, code, DateTime.UtcNow);

        // An SMTP error does not leave an unusable pending account in the database.
        try { await sender.SendVerificationCodeAsync(email, code); }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to deliver registration verification email");
            return StatusCode(503, new { message = "Không gửi được email. Kiểm tra cấu hình SMTP hoặc thử lại sau." });
        }
        db.Users.Add(user);
        try { await db.SaveChangesAsync(); }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Email vừa được đăng ký. Hãy thử đăng nhập hoặc gửi lại mã." });
        }
        return Ok(new { message = "Mã xác thực gồm 6 chữ số đã được gửi đến email. Mã có hiệu lực 10 phút.", email });
    }

    [HttpPost("verify-email")]
    [EnableRateLimiting("email-otp")]
    public async Task<IActionResult> Verify(VerifyCodeRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);
        if (user == null)
            return BadRequest(new { message = "Mã không hợp lệ hoặc đã hết hạn." });
        if (user.EmailConfirmed)
            return Ok(new { message = "Email đã được xác thực. Bạn có thể đăng nhập." });
        if (user.EmailCodeHash == null || !user.EmailCodeExpiresUtc.HasValue || user.EmailCodeExpiresUtc.Value <= DateTime.UtcNow)
            return BadRequest(new { message = "Mã đã hết hạn hoặc chưa được gửi. Hãy chọn Gửi lại mã." });
        if (user.EmailCodeAttemptCount >= MaxCodeAttempts)
            return StatusCode(429, new { message = "Nhập sai quá 5 lần. Vui lòng yêu cầu mã mới." });

        if (!auth.MatchesEmailCode(user.Email, req.Code, user.EmailCodeHash))
        {
            user.EmailCodeAttemptCount++;
            if (user.EmailCodeAttemptCount >= MaxCodeAttempts)
            {
                user.EmailCodeHash = null;
                user.EmailCodeExpiresUtc = null;
            }
            await db.SaveChangesAsync();
            return BadRequest(new { message = user.EmailCodeAttemptCount >= MaxCodeAttempts
                ? "Bạn đã nhập sai 5 lần. Hãy yêu cầu mã mới."
                : $"Mã không đúng. Bạn còn {MaxCodeAttempts - user.EmailCodeAttemptCount} lần thử." });
        }

        user.EmailConfirmed = true;
        user.EmailCodeHash = null;
        user.EmailCodeExpiresUtc = null;
        user.EmailCodeAttemptCount = 0;
        user.VerificationTokenHash = null; // Retire any legacy email-link token.
        user.VerificationExpiresUtc = null;
        await db.SaveChangesAsync();
        return Ok(new { message = user.Role == "Staff"
            ? "Email đã xác thực. Tài khoản nhân viên cần Admin phê duyệt trước khi đăng nhập."
            : "Xác thực email thành công! Bạn có thể đăng nhập." });
    }

    [HttpPost("resend-code")]
    [EnableRateLimiting("email-otp")]
    public async Task<IActionResult> ResendCode(ResendCodeRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);
        const string neutralMessage = "Nếu email này có tài khoản chưa xác thực, chúng tôi sẽ gửi mã đến hộp thư.";
        if (user == null || user.EmailConfirmed)
            return Ok(new { message = neutralMessage });
        if (!sender.IsConfigured)
            return StatusCode(503, new { message = "Chưa cấu hình SMTP. Hãy thiết lập thông tin email gửi trước." });

        var now = DateTime.UtcNow;
        if (user.EmailCodeSentUtc.HasValue && (now - user.EmailCodeSentUtc.Value).TotalSeconds < ResendCooldownSeconds)
            return StatusCode(429, new { message = "Bạn vừa nhận mã. Vui lòng đợi 60 giây trước khi gửi lại." });
        if (user.EmailCodeSendWindowUtc.HasValue && (now - user.EmailCodeSendWindowUtc.Value).TotalHours < 24
            && user.EmailCodeSendCount >= MaxCodesPer24Hours)
            return StatusCode(429, new { message = "Đã đạt giới hạn 5 mã trong 24 giờ. Vui lòng thử lại sau." });

        var code = AuthService.NewEmailCode();
        // Only replace the previous code after SMTP confirms acceptance.
        try { await sender.SendVerificationCodeAsync(email, code); }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to resend verification email");
            return StatusCode(503, new { message = "Không gửi được mã. Kiểm tra kết nối SMTP rồi thử lại." });
        }
        PrepareNewCode(user, code, now);
        await db.SaveChangesAsync();
        return Ok(new { message = neutralMessage });
    }

    private void PrepareNewCode(AppUser user, string code, DateTime now)
    {
        if (!user.EmailCodeSendWindowUtc.HasValue || (now - user.EmailCodeSendWindowUtc.Value).TotalHours >= 24)
        {
            user.EmailCodeSendWindowUtc = now;
            user.EmailCodeSendCount = 0;
        }
        user.EmailCodeSendCount++;
        user.EmailCodeHash = auth.HashEmailCode(user.Email, code);
        user.EmailCodeSentUtc = now;
        user.EmailCodeExpiresUtc = now.AddMinutes(CodeLifetimeMinutes);
        user.EmailCodeAttemptCount = 0;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var email = (req.Email ?? "").Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(x => x.Email == email);
        if (user == null) return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
        if (user.LockoutEndUtc > DateTime.UtcNow)
            return StatusCode(429, new { message = "Đăng nhập bị tạm khóa. Vui lòng thử lại sau." });
        if (!auth.VerifyPassword(user, req.Password ?? ""))
        {
            user.FailedAttempts++;
            if (user.FailedAttempts >= 3)
            {
                user.FailedAttempts = 0;
                user.LockoutEndUtc = DateTime.UtcNow.AddMinutes(15);
            }
            await db.SaveChangesAsync();
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng. Sau 3 lần sai sẽ tạm khóa 15 phút." });
        }
        if (!user.EmailConfirmed) return StatusCode(403, new { message = "Vui lòng nhập mã xác thực email trước khi đăng nhập." });
        if (user.Role == "Staff" && !user.Approved)
            return StatusCode(403, new { message = "Tài khoản nhân viên đang chờ Admin duyệt." });
        user.FailedAttempts = 0;
        user.LockoutEndUtc = null;
        await db.SaveChangesAsync();
        return Ok(new { token = auth.Jwt(user), user = new { user.Id, user.Email, user.FullName, user.Role } });
    }

    [Authorize, HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await db.Users.FindAsync(id);
        return user == null ? Unauthorized() : Ok(new { user.Id, user.Email, user.FullName,
            user.Role, user.EmailConfirmed, user.Approved });
    }
}
