using CafeSaiGon.Api.Data;
using CafeSaiGon.Api.Models;
using CafeSaiGon.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddDbContext<CafeDbContext>(options => options.UseSqlite(
    builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<EmailSender>();
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("email-otp", context => RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 20,
            Window = TimeSpan.FromMinutes(10),
            QueueLimit = 0,
            AutoReplenishment = true
        }));
});

// Development ONLY: store the generated JWT key outside the source project.
// Production: always provide Jwt__Key via a secret manager or environment.
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) && builder.Environment.IsDevelopment())
{
    var secretsDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "CafeSaiGonDev");
    Directory.CreateDirectory(secretsDir);
    var keyFile = Path.Combine(secretsDir, "jwt.key");
    if (!File.Exists(keyFile))
    {
        File.WriteAllText(keyFile, Convert.ToBase64String(RandomNumberGenerator.GetBytes(48)));
        if (!OperatingSystem.IsWindows()) File.SetUnixFileMode(keyFile, UnixFileMode.UserRead | UnixFileMode.UserWrite);
    }
    jwtKey = File.ReadAllText(keyFile).Trim();
}
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32)
    throw new InvalidOperationException("Set Jwt__Key as a secret of at least 32 bytes.");

builder.Configuration["Jwt:Key"] = jwtKey;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "CafeSaiGon",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "CafeSaiGonWeb",
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});
builder.Services.AddAuthorization();
builder.Services.AddCors(options => options.AddPolicy("React", policy => policy
    .WithOrigins(builder.Configuration["Frontend:Origin"] ?? "http://localhost:3000", "http://127.0.0.1:3000")
    .AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseRouting();
app.UseCors("React");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CafeDbContext>();
    await db.Database.MigrateAsync();
    if (!await db.Users.AnyAsync(u => u.Role == "Admin"))
    {
        var email = app.Configuration["BootstrapAdmin:Email"]?.Trim().ToLowerInvariant();
        var password = app.Configuration["BootstrapAdmin:Password"];
        var devGenerated = false;
        if (app.Environment.IsDevelopment() && string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(password))
        {
            email = "admin@cafesaigon.com";
            password = Convert.ToBase64String(RandomNumberGenerator.GetBytes(18));
            devGenerated = true;
        }
        if (!string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(password))
        {
            if (password.Length < 12) throw new InvalidOperationException("Admin password must have at least 12 characters.");
            if (await db.Users.AnyAsync(u => u.Email == email))
                throw new InvalidOperationException("Bootstrap admin email is already used by another account.");
            var admin = new AppUser { Email = email, FullName = "Quản trị viên", Role = "Admin", Approved = true, EmailConfirmed = true };
            admin.PasswordHash = new PasswordHasher<AppUser>().HashPassword(admin, password);
            db.Users.Add(admin);
            await db.SaveChangesAsync();
            if (devGenerated)
            {
                // Shown only ONCE on first launch. Not stored in code or in the project archive.
                Console.WriteLine("\n========== FIRST RUN: DEVELOPMENT ADMIN ==========");
                Console.WriteLine($"Email: {email}");
                Console.WriteLine($"Temporary password: {password}");
                Console.WriteLine("SAVE THIS PASSWORD; it will not be printed again.");
                Console.WriteLine("===============================================\n");
            }
        }
        else if (!app.Environment.IsDevelopment())
        {
            throw new InvalidOperationException("Production requires BootstrapAdmin__Email and BootstrapAdmin__Password when no admin exists.");
        }
    }
}
app.Run();
