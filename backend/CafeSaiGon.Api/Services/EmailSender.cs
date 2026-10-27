using System.Net;
using System.Net.Mail;
using System.Text;

namespace CafeSaiGon.Api.Services;

// The project uses the .NET built-in SMTP client to avoid adding new NuGet dependencies.
// For a larger production deployment, consider MailKit or a transactional email service.
public sealed class EmailSender(IConfiguration configuration)
{
    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(configuration["Smtp:Host"]) &&
        !string.IsNullOrWhiteSpace(configuration["Smtp:Username"]) &&
        !string.IsNullOrWhiteSpace(configuration["Smtp:Password"]) &&
        !string.IsNullOrWhiteSpace(configuration["Smtp:From"]);

    public async Task SendVerificationCodeAsync(string to, string code)
    {
        if (!IsConfigured)
            throw new InvalidOperationException("SMTP is not configured.");

        var host = configuration["Smtp:Host"]!;
        var port = int.TryParse(configuration["Smtp:Port"], out var configuredPort) ? configuredPort : 587;
        if (port != 587 && port != 25 && port != 2525)
            throw new InvalidOperationException("Use an SMTP STARTTLS port such as 587.");

        using var smtp = new SmtpClient(host, port)
        {
            EnableSsl = true, // STARTTLS is required; never send credentials over cleartext.
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(configuration["Smtp:Username"], configuration["Smtp:Password"]),
            DeliveryMethod = SmtpDeliveryMethod.Network,
            Timeout = 15000
        };
        using var message = new MailMessage
        {
            From = new MailAddress(configuration["Smtp:From"]!, "Cà Phê Sài Gòn", Encoding.UTF8),
            Subject = "Mã xác thực tài khoản - Cà Phê Sài Gòn",
            SubjectEncoding = Encoding.UTF8,
            BodyEncoding = Encoding.UTF8,
            IsBodyHtml = false,
            Body = $"Xin chào,\n\nMã xác thực tài khoản Cà Phê Sài Gòn của bạn là: {code}\n\nMã có hiệu lực trong 10 phút và chỉ dùng một lần. Không chia sẻ mã này với bất kỳ ai.\n\nNếu bạn không đăng ký tài khoản, hãy bỏ qua email này.\n\nCà Phê Sài Gòn"
        };
        message.To.Add(new MailAddress(to));
        await smtp.SendMailAsync(message);
    }
}
