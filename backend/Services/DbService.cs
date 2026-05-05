using MySqlConnector;

namespace backend.Services;

public class DbService
{
    private readonly string _connStr;

    public DbService(IConfiguration config)
    {
        _connStr = config.GetConnectionString("Default")!;
    }

    public MySqlConnection CreateConnection() => new MySqlConnection(_connStr);

    public async Task<List<Dictionary<string, object?>>> QueryAsync(string sql, object? parameters = null)
    {
        await using var conn = CreateConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand(sql, conn);

        if (parameters != null)
        {
            foreach (var prop in parameters.GetType().GetProperties())
                cmd.Parameters.AddWithValue($"@{prop.Name}", prop.GetValue(parameters));
        }

        var result = new List<Dictionary<string, object?>>();
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var row = new Dictionary<string, object?>();
            for (int i = 0; i < reader.FieldCount; i++)
                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
            result.Add(row);
        }
        return result;
    }

    public async Task<int> ExecuteAsync(string sql, object? parameters = null)
    {
        await using var conn = CreateConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand(sql, conn);

        if (parameters != null)
        {
            foreach (var prop in parameters.GetType().GetProperties())
                cmd.Parameters.AddWithValue($"@{prop.Name}", prop.GetValue(parameters));
        }

        return await cmd.ExecuteNonQueryAsync();
    }
}
