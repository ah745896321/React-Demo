namespace backend.Models;

public class UserDto
{
    public string UserId { get; set; } = "";
    public string UserAcc { get; set; } = "";
    public string UserChtName { get; set; } = "";
    public string UserEngName { get; set; } = "";
    public string UserEmail { get; set; } = "";
    public string UserDeptId { get; set; } = "";
    public string UserGroupId { get; set; } = "";
    public string Lock { get; set; } = "N";
    public string PwdChange { get; set; } = "N";
}

public class UserSaveRequest
{
    public string UserId { get; set; } = "";
    public string UserAcc { get; set; } = "";
    public string UserChtName { get; set; } = "";
    public string UserEngName { get; set; } = "";
    public string UserEmail { get; set; } = "";
    public string UserDeptId { get; set; } = "";
    public string UserGroupId { get; set; } = "";
    public string Password { get; set; } = "";
}

public class RoleDto
{
    public string RoleId { get; set; } = "";
    public string RoleName { get; set; } = "";
    public string RoleNote { get; set; } = "";
}

public class ProgDto
{
    public string ProgId { get; set; } = "";
    public string ProgName { get; set; } = "";
    public string ProgUrl { get; set; } = "";
    public int Sort { get; set; }
    public string Icon { get; set; } = "";
    public string ParentId { get; set; } = "";
}

public class TypeDto
{
    public string TypeId { get; set; } = "";
    public string TypeName { get; set; } = "";
    public string Note { get; set; } = "";
}

public class ParamDto
{
    public string ParamId { get; set; } = "";
    public string ParamClass { get; set; } = "";
    public string ParamNo { get; set; } = "";
    public string ParamName { get; set; } = "";
    public string Color { get; set; } = "";
    public int Sort { get; set; }
}
