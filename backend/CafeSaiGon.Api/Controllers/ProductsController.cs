using CafeSaiGon.Api.Data;
using CafeSaiGon.Api.DTOs;
using CafeSaiGon.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace CafeSaiGon.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(CafeDbContext db) : ControllerBase
{
    // GET /api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll() =>
        Ok(await db.Products.AsNoTracking().OrderBy(x => x.Id).ToListAsync());

    // GET /api/products/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var product = await db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return product is null ? NotFound(new { message = "Không tìm thấy sản phẩm." }) : Ok(product);
    }

    // POST /api/products
    [Authorize(Roles="Admin"),HttpPost]
    public async Task<ActionResult<Product>> Create([FromBody] ProductRequest request)
    {
        if (!HasRequiredText(request)) return BadRequest(new { message = "Tên, danh mục và khối lượng không được để trống." });
        var product = new Product();
        CopyFields(product, request);
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    // PUT /api/products/{id}
    [Authorize(Roles="Admin"),HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductRequest request)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound(new { message = "Không tìm thấy sản phẩm." });
        if (!HasRequiredText(request)) return BadRequest(new { message = "Tên, danh mục và khối lượng không được để trống." });
        CopyFields(product, request);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/products/{id}
    [Authorize(Roles="Admin"),HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound(new { message = "Không tìm thấy sản phẩm." });
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static bool HasRequiredText(ProductRequest request) =>
        !string.IsNullOrWhiteSpace(request.Name) &&
        !string.IsNullOrWhiteSpace(request.Category) &&
        !string.IsNullOrWhiteSpace(request.Weight);

    private static void CopyFields(Product dest, ProductRequest request)
    {
        dest.Name = request.Name.Trim();
        dest.Category = request.Category.Trim();
        dest.Emoji = request.Emoji.Trim();
        dest.Weight = request.Weight.Trim();
        dest.Price = request.Price;
        dest.Roast = request.Roast.Trim();
        dest.Flavor = request.Flavor.Trim();
        dest.Desc = request.Desc.Trim();
        dest.BestFor = request.BestFor.Trim();
        dest.ImageName = request.ImageName.Trim();
    }
}
