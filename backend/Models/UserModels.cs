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
    public string ProgNote { get; set; } = "";
    public string ProgUrl { get; set; } = "";
    public string ProgIcon { get; set; } = "";
}

public class TypeDto
{
    public string TypeId { get; set; } = "";
    public string TypeName { get; set; } = "";
    public string TypeNote { get; set; } = "";
}

public class ParamDto
{
    public string ParamId { get; set; } = "";
    public string TypeId { get; set; } = "";
    public string ParamName { get; set; } = "";
    public string ParamValue { get; set; } = "";
    public int SortNo { get; set; }
}
