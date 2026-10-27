using CafeSaiGon.Api.Data;
using CafeSaiGon.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CafeSaiGon.Api.Controllers;
public record OrderLine(int ProductId,int Quantity);
public record CreateOrderRequest([Required] string CustomerName,[Required] string Phone,[Required] string Address,string Note,List<OrderLine> Items);
public record OrderStatusRequest(string Status);
[ApiController,Route("api/orders"),Authorize]
public class OrdersController(CafeDbContext db):ControllerBase {
 int UserId=>int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
 bool Admin=>User.IsInRole("Admin");
 bool Staff=>User.IsInRole("Staff");
 [Authorize(Roles="Customer"),HttpPost]
 public async Task<IActionResult> Create(CreateOrderRequest req){
  if(req.Items==null||req.Items.Count==0||req.Items.Any(x=>x.Quantity<1||x.Quantity>100)||string.IsNullOrWhiteSpace(req.Address)||string.IsNullOrWhiteSpace(req.Phone))return BadRequest(new {message="Thông tin phiếu không hợp lệ."});
  var ids=req.Items.Select(x=>x.ProductId).Distinct().ToList();var products=await db.Products.Where(x=>ids.Contains(x.Id)).ToDictionaryAsync(x=>x.Id);
  if(products.Count!=ids.Count)return BadRequest(new {message="Sản phẩm không tồn tại."});
  var order=new CafeOrder{CustomerId=UserId,CustomerName=req.CustomerName,Phone=req.Phone,Address=req.Address,Note=req.Note??"",Items=req.Items.Select(x=>new CafeOrderItem{ProductId=x.ProductId,Quantity=x.Quantity,ProductName=products[x.ProductId].Name,UnitPrice=products[x.ProductId].Price}).ToList()};
  db.Orders.Add(order);await db.SaveChangesAsync();return Ok(new {order.Id,order.Status});
 }
 [HttpGet]
 public async Task<IActionResult> List(){
  var q=db.Orders.Include(x=>x.Items).AsNoTracking().AsQueryable();
  if(!Admin && !Staff)q=q.Where(x=>x.CustomerId==UserId);
  if(Staff)q=q.Where(x=>x.Status!="PendingApproval");
  return Ok(await q.OrderByDescending(x=>x.Id).Select(x=>new{x.Id,x.CustomerId,x.StaffId,x.CustomerName,x.Phone,x.Address,x.Note,x.Status,x.CreatedUtc,Items=x.Items.Select(i=>new{i.Id,i.ProductId,i.ProductName,i.Quantity,i.UnitPrice}).ToList(),Total=x.Items.Sum(i=>i.UnitPrice*i.Quantity)}).ToListAsync());
 }
 [Authorize(Roles="Admin"),HttpPut("{id:int}/approve")]
 public async Task<IActionResult> Approve(int id){var o=await db.Orders.FindAsync(id);if(o==null)return NotFound();if(o.Status!="PendingApproval")return Conflict(new {message="Phiếu đã được xử lý."});o.Status="Approved";o.ApprovedUtc=DateTime.UtcNow;await db.SaveChangesAsync();return Ok(new {o.Id,o.Status});}
 [Authorize(Roles="Staff,Admin"),HttpPut("{id:int}/status")]
 public async Task<IActionResult> Status(int id,OrderStatusRequest req){var o=await db.Orders.FindAsync(id);if(o==null)return NotFound();if(o.Status=="PendingApproval")return Conflict(new {message="Admin chưa duyệt phiếu."});
  var next=o.Status switch {"Approved"=>"Processing","Processing"=>"Completed",_=>""};
  if(Staff && o.Status=="Processing" && o.StaffId.HasValue && o.StaffId.Value!=UserId)return Forbid();
  if(req.Status!=next)return BadRequest(new {message="Trạng thái chuyển không hợp lệ."});
  o.Status=next;if(Staff)o.StaffId=UserId;await db.SaveChangesAsync();return Ok(new{o.Id,o.Status});
 }
 [HttpGet("{id:int}/receipt.txt")]
 public async Task<IActionResult> Receipt(int id){var o=await db.Orders.Include(x=>x.Items).FirstOrDefaultAsync(x=>x.Id==id);if(o==null)return NotFound();if(!Admin&&!Staff&&o.CustomerId!=UserId)return Forbid();if(Staff&&o.Status=="PendingApproval")return Forbid();
  var sb=new StringBuilder();sb.AppendLine("CÀ PHÊ SÀI GÒN - PHIẾU ĐƠN HÀNG").AppendLine($"Mã phiếu: #{o.Id}").AppendLine($"Ngày tạo: {o.CreatedUtc:dd/MM/yyyy HH:mm} UTC").AppendLine($"Trạng thái: {o.Status}").AppendLine($"Khách hàng: {o.CustomerName}").AppendLine($"Điện thoại: {o.Phone}").AppendLine($"Địa chỉ nhận: {o.Address}").AppendLine("---------------------------------");
  foreach(var i in o.Items)sb.AppendLine($"{i.ProductName} x{i.Quantity}: {i.UnitPrice*i.Quantity:N0} VND");sb.AppendLine($"TỔNG CỘNG: {o.Items.Sum(x=>x.UnitPrice*x.Quantity):N0} VND").AppendLine($"Ghi chú: {o.Note}");
  return File(new UTF8Encoding(true).GetBytes(sb.ToString()),"text/plain; charset=utf-8",$"phieu-hang-{id}.txt");
 }
}
