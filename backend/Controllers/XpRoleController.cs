using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class XpRoleController : ControllerBase
{
    private readonly DbService _db;
    public XpRoleController(DbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rows = await _db.QueryAsync("SELECT Id as RoleId, Name as RoleName, Note as RoleNote FROM XpRole ORDER BY Name");
        return Ok(ApiResult<object>.Ok(rows));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] RoleDto req)
    {
        var newId = Guid.NewGuid().ToString("N")[..8].ToUpper();
        await _db.ExecuteAsync("INSERT INTO XpRole (Id, Name, Note) VALUES (@Id, @Name, @Note)",
            new { Id = newId, Name = req.RoleName, Note = req.RoleNote });
        return Ok(ApiResult<string>.Ok(newId, "新增成功"));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] RoleDto req)
    {
        await _db.ExecuteAsync("UPDATE XpRole SET Name=@Name, Note=@Note WHERE Id=@Id",
            new { Id = id, Name = req.RoleName, Note = req.RoleNote });
        return Ok(ApiResult<string>.Ok("", "更新成功"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _db.ExecuteAsync("DELETE FROM XpRole WHERE Id=@Id", new { Id = id });
        return Ok(ApiResult<string>.Ok("", "刪除成功"));
    }

    [HttpGet("{roleId}/progs")]
    public async Task<IActionResult> GetRoleProgs(string roleId)
    {
        var rows = await _db.QueryAsync(
            "SELECT ProgId, AuthStr FROM XpRoleProg WHERE RoleId=@RoleId",
            new { RoleId = roleId });
        return Ok(ApiResult<object>.Ok(rows));
    }

    [HttpPost("{roleId}/progs")]
    public async Task<IActionResult> SaveRoleProgs(string roleId, [FromBody] List<Dictionary<string, string>> progs)
    {
        await _db.ExecuteAsync("DELETE FROM XpRoleProg WHERE RoleId=@RoleId", new { RoleId = roleId });
        foreach (var prog in progs)
        {
            await _db.ExecuteAsync(
                "INSERT INTO XpRoleProg (RoleId, ProgId, AuthStr) VALUES (@RoleId, @ProgId, @AuthStr)",
                new { RoleId = roleId, ProgId = prog["progId"], AuthStr = prog["authStr"] });
        }
        return Ok(ApiResult<string>.Ok("", "儲存成功"));
    }
}
