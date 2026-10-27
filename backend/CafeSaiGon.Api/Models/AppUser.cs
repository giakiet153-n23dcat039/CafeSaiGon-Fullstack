namespace CafeSaiGon.Api.Models;
public class AppUser
{
 public int Id {get;set;}
 public string Email {get;set;} = "";
 public string FullName {get;set;} = "";
 public string PasswordHash {get;set;} = "";
 public string Role {get;set;} = "Customer";
 public bool EmailConfirmed {get;set;}
 public bool Approved {get;set;}
 public int FailedAttempts {get;set;}
 public DateTime? LockoutEndUtc {get;set;}
 public string? VerificationTokenHash {get;set;}
 public DateTime? VerificationExpiresUtc {get;set;}
 // One-time email verification code. Legacy link fields above are kept for existing data.
 public string? EmailCodeHash {get;set;}
 public DateTime? EmailCodeExpiresUtc {get;set;}
 public DateTime? EmailCodeSentUtc {get;set;}
 public int EmailCodeAttemptCount {get;set;}
 public DateTime? EmailCodeSendWindowUtc {get;set;}
 public int EmailCodeSendCount {get;set;}
 public DateTime CreatedUtc {get;set;} = DateTime.UtcNow;
}
