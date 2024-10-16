using Library_Management_system_API.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Library_Management_system_API.Repository
{
    public class BookRequestRepository
    {
        private readonly string _ConnectionString;

        public BookRequestRepository(IConfiguration configuration)
        {
            _ConnectionString = configuration.GetConnectionString("DBConnection");
        }

        public async Task<int> AddNewBookRequestAsync(BookRequest bookRequest)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand(
                    "INSERT INTO BookRequest (Isbn, UserNicNumber, UserFirstName, UserLastName, BookName, RequestedDate, Status) " +
                    "VALUES (@Isbn, @UserNicNumber, @UserFirstName, @UserLastName, @BookName, @RequestedDate, @Status); SELECT SCOPE_IDENTITY();", sqlConnection))
                {
                    sqlCommand.Parameters.AddWithValue("@Isbn", bookRequest.Isbn);
                    sqlCommand.Parameters.AddWithValue("@UserNicNumber", bookRequest.UserNicNumber);
                    sqlCommand.Parameters.AddWithValue("@UserFirstName", bookRequest.UserFirstName);
                    sqlCommand.Parameters.AddWithValue("@UserLastName", bookRequest.UserLastName);
                    sqlCommand.Parameters.AddWithValue("@BookName", bookRequest.BookName);
                    sqlCommand.Parameters.AddWithValue("@RequestedDate", bookRequest.RequestedDate);
                    sqlCommand.Parameters.AddWithValue("@Status", false);

                    sqlConnection.Open();
                    var id = await sqlCommand.ExecuteScalarAsync();
                    return Convert.ToInt32(id);
                }
            }
        }

        public async Task<List<BookRequest>> GetBookRequestsAsync()
        {
            var bookRequests = new List<BookRequest>();

            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("SELECT * FROM BookRequest", sqlConnection))
                {
                    await sqlConnection.OpenAsync();
                    using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            bookRequests.Add(new BookRequest
                            {
                                Id = reader["Id"] != DBNull.Value ? (int)reader["Id"] : 0,
                                UserFirstName = reader["UserFirstName"] != DBNull.Value ? reader["UserFirstName"].ToString() : string.Empty,
                                UserLastName = reader["UserLastName"] != DBNull.Value ? reader["UserLastName"].ToString() : string.Empty,
                                UserNicNumber = reader["UserNicNumber"] != DBNull.Value ? reader["UserNicNumber"].ToString() : string.Empty,
                                RequestedDate = reader["RequestedDate"] != DBNull.Value ? ((DateTime)reader["RequestedDate"]).Date : DateTime.MinValue,
                                Isbn = reader["Isbn"] != DBNull.Value ? (int)reader["Isbn"] : 0,
                                BookName = reader["BookName"] != DBNull.Value ? reader["BookName"].ToString() : string.Empty,
                                Status = reader["Status"] != DBNull.Value ? (bool)reader["Status"] : false
                            });
                        }
                    }
                }
            }

            return bookRequests;
        }

        public async Task<bool> UpdateStatusAsync(int id)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand(
                    "UPDATE BookRequest SET Status = @Status WHERE Id = @Id", sqlConnection))
                {
                    await sqlConnection.OpenAsync();
                    sqlCommand.Parameters.AddWithValue("@Id", id);
                    sqlCommand.Parameters.AddWithValue("@Status", true);

                    var result = await sqlCommand.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }
    }
}
