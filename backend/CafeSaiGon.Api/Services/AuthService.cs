using CafeSaiGon.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CafeSaiGon.Api.Services;
public class AuthService(IConfiguration cfg, ILogger<AuthService> logger)
{
 readonly PasswordHasher<AppUser> hasher = new();
 public string HashPassword(AppUser u,string password) => hasher.HashPassword(u,password);
 public bool VerifyPassword(AppUser u,string password) => hasher.VerifyHashedPassword(u,u.PasswordHash,password) != PasswordVerificationResult.Failed;
 public string Jwt(AppUser u) {
  var key = cfg["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key. Configure JWT_KEY environment variable.");
  if (Encoding.UTF8.GetByteCount(key)<32) throw new InvalidOperationException("JWT key requires at least 32 bytes");
  var claims=new[]{new Claim(JwtRegisteredClaimNames.Sub,u.Id.ToString()),new Claim(ClaimTypes.NameIdentifier,u.Id.ToString()),new Claim(ClaimTypes.Email,u.Email),new Claim(ClaimTypes.Role,u.Role)};
  return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(issuer:cfg["Jwt:Issuer"]??"CafeSaiGon",audience:cfg["Jwt:Audience"]??"CafeSaiGonWeb",claims:claims,expires:DateTime.UtcNow.AddHours(8),signingCredentials:new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),SecurityAlgorithms.HmacSha256)));
 }
 public static string NewEmailCode() => RandomNumberGenerator.GetInt32(0,1_000_000).ToString("D6");
 public string HashEmailCode(string email,string code) {
  var key=cfg["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key");
  var input=Encoding.UTF8.GetBytes($"cafesaigon-email-otp:v1:{email}:{code}");
  return Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes(key),input));
 }
 public bool MatchesEmailCode(string email,string code,string? storedHash) {
  if(storedHash is null || !System.Text.RegularExpressions.Regex.IsMatch(code ?? "", "^[0-9]{6}$"))return false;
  var computed=HashEmailCode(email,code);
  return CryptographicOperations.FixedTimeEquals(Convert.FromHexString(storedHash),Convert.FromHexString(computed));
 }
}
