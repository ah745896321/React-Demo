using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TypeController : ControllerBase
{
    private readonly DbService _db;
    public TypeController(DbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rows = await _db.QueryAsync("SELECT TypeId, TypeName, TypeNote FROM XpType ORDER BY TypeId");
        return Ok(ApiResult<object>.Ok(rows));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TypeDto req)
    {
        await _db.ExecuteAsync(
            "INSERT INTO XpType (TypeId, TypeName, TypeNote) VALUES (@TypeId, @TypeName, @TypeNote)",
            new { req.TypeId, req.TypeName, req.TypeNote });
        return Ok(ApiResult<string>.Ok(req.TypeId, "新增成功"));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] TypeDto req)
    {
        await _db.ExecuteAsync(
            "UPDATE XpType SET TypeName=@TypeName, TypeNote=@TypeNote WHERE TypeId=@TypeId",
            new { TypeId = id, req.TypeName, req.TypeNote });
        return Ok(ApiResult<string>.Ok("", "更新成功"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _db.ExecuteAsync("DELETE FROM XpType WHERE TypeId=@TypeId", new { TypeId = id });
        return Ok(ApiResult<string>.Ok("", "刪除成功"));
    }
}
