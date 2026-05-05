using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class XpProgController : ControllerBase
{
    private readonly DbService _db;
    public XpProgController(DbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rows = await _db.QueryAsync("SELECT Id as ProgId, Name as ProgName, Note as ProgNote, Url as ProgUrl, Icon as ProgIcon FROM XpProg ORDER BY Id");
        return Ok(ApiResult<object>.Ok(rows));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProgDto req)
    {
        await _db.ExecuteAsync(
            "INSERT INTO XpProg (Id, Name, Note, Url, Icon) VALUES (@Id, @Name, @Note, @Url, @Icon)",
            new { Id = req.ProgId, Name = req.ProgName, Note = req.ProgNote, Url = req.ProgUrl, Icon = req.ProgIcon });
        return Ok(ApiResult<string>.Ok(req.ProgId, "新增成功"));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ProgDto req)
    {
        await _db.ExecuteAsync(
            "UPDATE XpProg SET Name=@Name, Note=@Note, Url=@Url, Icon=@Icon WHERE Id=@Id",
            new { Id = id, Name = req.ProgName, Note = req.ProgNote, Url = req.ProgUrl, Icon = req.ProgIcon });
        return Ok(ApiResult<string>.Ok("", "更新成功"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _db.ExecuteAsync("DELETE FROM XpProg WHERE Id=@Id", new { Id = id });
        return Ok(ApiResult<string>.Ok("", "刪除成功"));
    }
}
