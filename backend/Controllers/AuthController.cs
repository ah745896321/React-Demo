using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DbService _db;
    private readonly JwtService _jwt;

    public AuthController(DbService db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    // Original system uses a reversible obfuscation: each ASCII byte → [random char][hex], 3 chars per byte
    private static string DecodePwd(string encoded)
    {
        var sb = new StringBuilder();
        for (int i = 0; i + 2 < encoded.Length; i += 3)
            sb.Append((char)Convert.ToInt32(encoded.Substring(i + 1, 2), 16));
        return sb.ToString();
    }

    private static string EncodePwd(string plain)
    {
        var rnd = new Random();
        var sb = new StringBuilder();
        foreach (byte b in Encoding.ASCII.GetBytes(plain))
        {
            char noise = (char)0;
            while (true)
            {
                noise = (char)(int)Math.Floor(rnd.NextDouble() * 122);
                if ((noise >= '0' && noise <= '9') || (noise >= 'A' && noise <= 'Z') || (noise >= 'a' && noise <= 'z'))
                    break;
            }
            sb.Append(noise + b.ToString("X2"));
        }
        return sb.ToString();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var rows = await _db.QueryAsync(
            "SELECT USER_ID, USER_ACC as UserId, USER_ENG_NAME as UserName, USER_PWD as Pwd, `LOCK`, PwdChange, ERROR_TIME FROM SYS001 WHERE USER_ACC = @Account",
            new { Account = req.Account });

        if (rows.Count == 0)
            return Ok(ApiResult<LoginResponse>.Fail("帳號或密碼錯誤"));

        var row = rows[0];

        if (row["LOCK"]?.ToString() == "Y")
            return Ok(ApiResult<LoginResponse>.Fail("帳號已被鎖定"));

        var storedPwd = row["Pwd"]?.ToString() ?? "";
        var decoded = DecodePwd(storedPwd);
        if (decoded != req.Password)
        {
            var errorTime = Convert.ToInt32(row["ERROR_TIME"] ?? 0);
            if (errorTime >= 4)
                await _db.ExecuteAsync("UPDATE SYS001 SET `LOCK`='Y' WHERE USER_ACC=@Account", new { Account = req.Account });
            await _db.ExecuteAsync("UPDATE SYS001 SET ERROR_TIME=ERROR_TIME+1 WHERE USER_ACC=@Account", new { Account = req.Account });
            return Ok(ApiResult<LoginResponse>.Fail("帳號或密碼錯誤"));
        }

        await _db.ExecuteAsync("UPDATE SYS001 SET ERROR_TIME=0 WHERE USER_ACC=@Account", new { Account = req.Account });

        var userId = row["USER_ID"]?.ToString() ?? "";
        var userName = row["UserName"]?.ToString() ?? "";
        var token = _jwt.GenerateToken(userId, req.Account, userName);

        return Ok(ApiResult<LoginResponse>.Ok(new LoginResponse
        {
            Token = token,
            UserName = userName,
            UserId = userId
        }));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
        var userAcc = User.FindFirst(ClaimTypes.Name)?.Value;

        var rows = await _db.QueryAsync(
            "SELECT USER_PWD as Pwd FROM SYS001 WHERE USER_ACC=@Account",
            new { Account = userAcc });

        if (rows.Count == 0)
            return Ok(ApiResult<string>.Fail("使用者不存在"));

        var storedPwd = rows[0]["Pwd"]?.ToString() ?? "";
        if (DecodePwd(storedPwd) != req.OldPassword)
            return Ok(ApiResult<string>.Fail("舊密碼錯誤"));

        await _db.ExecuteAsync(
            "UPDATE SYS001 SET USER_PWD=@Pwd, PwdChange='N' WHERE USER_ACC=@Account",
            new { Pwd = EncodePwd(req.NewPassword), Account = userAcc });

        return Ok(ApiResult<string>.Ok("密碼修改成功"));
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            UserAcc = User.FindFirst(ClaimTypes.Name)?.Value,
            UserName = User.FindFirst("UserName")?.Value,
        });
    }
}
