using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Library_Management_system_API.DbInitializer
{
    public class lmsDbInitializer
    {
        private readonly string _connectionString;
        private string _Database;
        public lmsDbInitializer(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBConnection");
            _Database = this.GetDataBaseName();
        }

        public async Task<string> CreateTable()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand command = new SqlCommand(@" 
                 USE LMS_Database;

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
                        Isbn NVARCHAR(50)
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
                        AdminId INT PRIMARY KEY IDENTITY(1,1), -- Added missing comma here
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
                    CREATE TABLE Images
                    (
                        ImageId INT PRIMARY KEY IDENTITY(1,1),
                        ImagePath NVARCHAR(MAX) NOT NULL,
                        BookId INT NOT NULL,
                        FOREIGN KEY (BookId) REFERENCES Books(BookId)
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
                        Id int IDENTITY(1,1),
                        FirstName NVARCHAR(50) NOT NULL,
                        LastName NVARCHAR(50) NOT NULL,
                        Email NVARCHAR(50),
                        PhoneNumber NVARCHAR(15) NOT NULL,
                        Password NVARCHAR(50) NOT NULL
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
                        BookId INT NOT NULL,
                        BookName NVARCHAR(50) NOT NULL,
                        Status BIT NOT NULL,
                        FOREIGN KEY (UserNicNumber) REFERENCES Member(Nic),
                        FOREIGN KEY (BookId) REFERENCES Books(BookId)
                    );
                END
"



                , connection);

                await connection.OpenAsync();
                try
                {
                    var result = await command.ExecuteNonQueryAsync();
                    return _Database + "tables Created";
                }
                catch (Exception ex)
                {
                    return "";
                }


            }
        }

        public string GetDataBaseName()
        {
            string[] parts = _connectionString.Split(';');

            foreach (var part in parts)
            {
                if (part.Trim().StartsWith("DataBase=", StringComparison.OrdinalIgnoreCase))
                {
                    _Database = part.Substring("DataBase=".Length).Trim();
                };

            }
            return _Database;
        }
    }

    
}


//JoinDate DATE NOT NULL,
//                    Password NVARCHAR(50) NOT NULL