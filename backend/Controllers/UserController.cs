using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly DbService _db;

    public UserController(DbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rows = await _db.QueryAsync(@"
            SELECT USER_ID as UserId, USER_ACC as UserAcc, USER_CHT_NAME as UserChtName,
                   USER_ENG_NAME as UserEngName, USER_EMAIL as UserEmail,
                   USER_DEPTID as UserDeptId, USER_GROUPID as UserGroupId,
                   `LOCK`, PwdChange
            FROM SYS001
            ORDER BY USER_ACC");
        return Ok(ApiResult<object>.Ok(rows));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var rows = await _db.QueryAsync(@"
            SELECT USER_ID as UserId, USER_ACC as UserAcc, USER_CHT_NAME as UserChtName,
                   USER_ENG_NAME as UserEngName, USER_EMAIL as UserEmail,
                   USER_DEPTID as UserDeptId, USER_GROUPID as UserGroupId,
                   `LOCK`, PwdChange
            FROM SYS001 WHERE USER_ID=@Id", new { Id = id });

        if (rows.Count == 0)
            return Ok(ApiResult<object>.Fail("使用者不存在"));
        return Ok(ApiResult<object>.Ok(rows[0]));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserSaveRequest req)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);
        var newId = Guid.NewGuid().ToString("N")[..10].ToUpper();
        await _db.ExecuteAsync(@"
            INSERT INTO SYS001 (USER_ID, USER_ACC, USER_CHT_NAME, USER_ENG_NAME,
                USER_EMAIL, USER_DEPTID, USER_GROUPID, USER_PWD, `LOCK`, PwdChange, ERROR_TIME)
            VALUES (@Id, @Acc, @Cht, @Eng, @Email, @Dept, @Group, @Pwd, 'N', 'N', 0)",
            new { Id = newId, Acc = req.UserAcc, Cht = req.UserChtName, Eng = req.UserEngName,
                  Email = req.UserEmail, Dept = req.UserDeptId, Group = req.UserGroupId, Pwd = hash });
        return Ok(ApiResult<string>.Ok(newId, "新增成功"));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UserSaveRequest req)
    {
        await _db.ExecuteAsync(@"
            UPDATE SYS001 SET USER_CHT_NAME=@Cht, USER_ENG_NAME=@Eng,
                USER_EMAIL=@Email, USER_DEPTID=@Dept, USER_GROUPID=@Group
            WHERE USER_ID=@Id",
            new { Id = id, Cht = req.UserChtName, Eng = req.UserEngName,
                  Email = req.UserEmail, Dept = req.UserDeptId, Group = req.UserGroupId });
        return Ok(ApiResult<string>.Ok("", "更新成功"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _db.ExecuteAsync("DELETE FROM SYS001 WHERE USER_ID=@Id", new { Id = id });
        return Ok(ApiResult<string>.Ok("", "刪除成功"));
    }

    [HttpPatch("{id}/lock")]
    public async Task<IActionResult> ToggleLock(string id, [FromQuery] string locked)
    {
        await _db.ExecuteAsync("UPDATE SYS001 SET `LOCK`=@Lock WHERE USER_ID=@Id",
            new { Lock = locked, Id = id });
        return Ok(ApiResult<string>.Ok("", "更新成功"));
    }
}
