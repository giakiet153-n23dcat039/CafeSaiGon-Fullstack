using CafeSaiGon.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CafeSaiGon.Api.Controllers;
[ApiController,Route("api/admin/users"),Authorize(Roles="Admin")]
public class AdminUsersController(CafeDbContext db):ControllerBase {
 [HttpGet("staff-pending")]
 public async Task<IActionResult> Pending()=>Ok(await db.Users.Where(x=>x.Role=="Staff"&&!x.Approved).Select(x=>new{x.Id,x.Email,x.FullName,x.EmailConfirmed,x.CreatedUtc}).ToListAsync());
 [HttpPut("{id:int}/approve")]
 public async Task<IActionResult> Approve(int id){var u=await db.Users.FindAsync(id);if(u==null||u.Role!="Staff")return NotFound();if(!u.EmailConfirmed)return BadRequest(new {message="Nhân viên chưa xác thực email."});u.Approved=true;await db.SaveChangesAsync();return Ok(new {u.Id,u.Approved});}
}
