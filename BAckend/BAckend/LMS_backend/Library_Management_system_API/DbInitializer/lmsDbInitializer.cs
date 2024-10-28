using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Library_Management_system_API.DbInitializer
{
    public class lmsDbInitializer
    {
        private readonly string _connectionString;
        private string _database;

        public lmsDbInitializer(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBConnection");
            _database = GetDataBaseName();
        }

        public async Task<string> CreateTable()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            using (SqlCommand command = new SqlCommand(@"
                -- Books table creation
                IF NOT EXISTS (
                    SELECT * FROM sys.tables t 
                    JOIN sys.schemas s ON t.schema_id = s.schema_id
                    WHERE s.name = 'dbo' AND t.name = 'Books'
                )
                BEGIN
                    CREATE TABLE Books
                    (
                        BookId INT PRIMARY KEY IDENTITY(1,1),
                        Title NVARCHAR(50) NOT NULL,
                        Publisher NVARCHAR(50) NOT NULL,
                        BookCopies INT,
                        Isbn INT NOT NULL UNIQUE
                    );
                END
                    
                IF NOT EXISTS ( 
                    SELECT * FROM sys.tables t  
                    JOIN sys.schemas s ON t.schema_id = s.schema_id 
                    WHERE s.name = 'dbo' AND t.name = 'Admin'
                )
                BEGIN 
                    CREATE TABLE Admin 
                    (
                        AdminId INT PRIMARY KEY IDENTITY(1,1),
                        AdminName NVARCHAR(50) NOT NULL,
                        NIC NVARCHAR(50) NOT NULL,
                        Password NVARCHAR(50) NOT NULL
                    );
                END

                IF NOT EXISTS (
                    SELECT * FROM sys.tables t 
                    JOIN sys.schemas s ON t.schema_id = s.schema_id
                    WHERE s.name = 'dbo' AND t.name = 'Images'
                )
                BEGIN
                    CREATE TABLE Images (
                        ImageId INT IDENTITY(1,1) PRIMARY KEY, 
                        ImagePath NVARCHAR(MAX) NOT NULL,      
                        Isbn INT NOT NULL,                      
                        FOREIGN KEY (Isbn) REFERENCES Books(Isbn)
                    );
                END

                IF NOT EXISTS (
                    SELECT * FROM sys.tables t 
                    JOIN sys.schemas s ON t.schema_id = s.schema_id
                    WHERE s.name = 'dbo' AND t.name = 'Member'
                )
                BEGIN
                    CREATE TABLE Member
                    (
                        Nic NVARCHAR(50) PRIMARY KEY NOT NULL,
                        Id INT IDENTITY(1,1),
                        FirstName NVARCHAR(50) NOT NULL,
                        LastName NVARCHAR(50) NOT NULL,
                        Email NVARCHAR(50),
                        PhoneNumber NVARCHAR(15) NOT NULL,
                        Password NVARCHAR(50) NOT NULL,
                        JoinDate DATE NOT NULL
                    );
                END

                IF NOT EXISTS (
                    SELECT * FROM sys.tables t 
                    JOIN sys.schemas s ON t.schema_id = s.schema_id
                    WHERE s.name = 'dbo' AND t.name = 'BookRequest'
                )
                BEGIN
                    CREATE TABLE BookRequest
                    (
                        Id INT PRIMARY KEY IDENTITY(1,1),
                        UserFirstName NVARCHAR(50) NOT NULL,
                        UserNicNumber NVARCHAR(50) NOT NULL,
                        UserLastName NVARCHAR(50) NOT NULL,
                        RequestedDate DATE NOT NULL,
                        Isbn INT NOT NULL,
                        BookName NVARCHAR(50) NOT NULL,
                        Status BIT NOT NULL,
                        FOREIGN KEY (UserNicNumber) REFERENCES Member(Nic),
                        FOREIGN KEY (Isbn) REFERENCES Books(Isbn)
                    );
                END
                
                IF NOT EXISTS (
                    SELECT * FROM sys.tables t 
                    JOIN sys.schemas s ON t.schema_id = s.schema_id
                    WHERE s.name = 'dbo' AND t.name = 'BorrowedHistory'
                )
                BEGIN
                    CREATE TABLE BorrowedHistory
                    (
                        Id INT PRIMARY KEY IDENTITY (1,1),
                        UserNicNumber NVARCHAR(50) NOT NULL,
                        UserFirstName NVARCHAR(50) NOT NULL,
                        UserLastName NVARCHAR(50) NOT NULL,
                        BorrowedDate DATE NOT NULL,
                        ReturnedDate DATE,
                        BookName NVARCHAR(50) NOT NULL,
                        BookIsbn INT NOT NULL
                    );
                END;

                IF NOT EXISTS (
                    SELECT * FROM sys.tables t 
                    JOIN sys.schemas s ON t.schema_id = s.schema_id
                    WHERE s.name = 'dbo' AND t.name = 'BorrowedBooks'
                )
                BEGIN
                    CREATE TABLE BorrowedBooks
                    (
                        Id INT PRIMARY KEY IDENTITY (1,1),
                        UserNicNumber NVARCHAR(50) NOT NULL,
                        Bookname NVARCHAR(50) NOT NULL,
                        BookIsbn INT NOT NULL,
                        BorrowedDate DATE NOT NULL,
                        DueDate DATE NOT NULL,
                        FOREIGN KEY (UserNicNumber) REFERENCES Member(Nic),
                        FOREIGN KEY (BookIsbn) REFERENCES Books(Isbn) 
                    );
                END
            ", connection))
            {
                await connection.OpenAsync();
                try
                {
                    await command.ExecuteNonQueryAsync();
                    return $"{_database} tables created successfully.";
                }
                catch (Exception ex)
                {
                    // Log the error (use a logging framework or write to console for simplicity)
                    return $"Error creating tables: {ex.Message}";
                }
            }
        }

        private string GetDataBaseName()
        {
            var builder = new SqlConnectionStringBuilder(_connectionString);
            return builder.InitialCatalog; // This gets the database name
        }
    }
}
