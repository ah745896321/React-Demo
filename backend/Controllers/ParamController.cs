using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ParamController : ControllerBase
{
    private readonly DbService _db;
    public ParamController(DbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? typeId = null)
    {
        string sql;
        object? param = null;
        if (!string.IsNullOrEmpty(typeId))
        {
            sql = "SELECT ParamId, TypeId, ParamName, ParamValue, SortNo FROM XpParam WHERE TypeId=@TypeId ORDER BY SortNo, ParamId";
            param = new { TypeId = typeId };
        }
        else
        {
            sql = "SELECT ParamId, TypeId, ParamName, ParamValue, SortNo FROM XpParam ORDER BY TypeId, SortNo, ParamId";
        }
        var rows = await _db.QueryAsync(sql, param);
        return Ok(ApiResult<object>.Ok(rows));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ParamDto req)
    {
        var newId = Guid.NewGuid().ToString("N")[..8].ToUpper();
        await _db.ExecuteAsync(
            "INSERT INTO XpParam (ParamId, TypeId, ParamName, ParamValue, SortNo) VALUES (@ParamId, @TypeId, @ParamName, @ParamValue, @SortNo)",
            new { ParamId = newId, req.TypeId, req.ParamName, req.ParamValue, req.SortNo });
        return Ok(ApiResult<string>.Ok(newId, "新增成功"));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ParamDto req)
    {
        await _db.ExecuteAsync(
            "UPDATE XpParam SET TypeId=@TypeId, ParamName=@ParamName, ParamValue=@ParamValue, SortNo=@SortNo WHERE ParamId=@ParamId",
            new { ParamId = id, req.TypeId, req.ParamName, req.ParamValue, req.SortNo });
        return Ok(ApiResult<string>.Ok("", "更新成功"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _db.ExecuteAsync("DELETE FROM XpParam WHERE ParamId=@ParamId", new { ParamId = id });
        return Ok(ApiResult<string>.Ok("", "刪除成功"));
    }
}
