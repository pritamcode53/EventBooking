using Npgsql;
using System.IO;

public class DbInitializer
{
    private readonly string _connectionString;

    public DbInitializer(string connectionString)
    {
        _connectionString = connectionString;
    }

    public void Initialize()
    {
        var migrationFiles = Directory.GetFiles("Migrations", "*.sql");
        using var conn = new NpgsqlConnection(_connectionString);
        conn.Open();

        foreach (var file in migrationFiles.OrderBy(f => f)) // ensures order by filename
        {
            var sql = File.ReadAllText(file);
            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.ExecuteNonQuery();
        }
    }
}