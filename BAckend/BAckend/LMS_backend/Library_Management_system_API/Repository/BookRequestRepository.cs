using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Model.ResponseModel;
using Library_Management_system_API.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Data.SqlClient;

namespace Library_Management_system_API.Repository
{
    public class BookRequestRepository
    {
        private readonly string _ConnectionString;


        public BookRequestRepository(IConfiguration configuration)
        {
            _ConnectionString = configuration.GetConnectionString("DBConnection");
        }


        public async Task<int> AddnewBookRequestAsync(BookRequestModel bookRequestModel)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {

                using (SqlCommand sqlCommand = new SqlCommand("INSERT INTO BookRequest (UserID,UserNicNumber,Bookname,RequestedDate,Status" +
                    " VALUES(@UserID,UserFirstName,@UserLastName,@UserNicNumber,@Bookname,@RequestedDate,@Status)"
                    , sqlConnection))
                {
                    sqlCommand.Parameters.AddWithValue("@UserID", bookRequestModel.UserID);
                    sqlCommand.Parameters.AddWithValue("@UserNicNumber", bookRequestModel.UserNicNumber);
                    sqlCommand.Parameters.AddWithValue("@Bookname", bookRequestModel.Bookname);
                    sqlCommand.Parameters.AddWithValue("@RequestedDate", bookRequestModel.RequestedDate);
                    sqlCommand.Parameters.AddWithValue("@Status", false);


                    sqlConnection.Open();
                    var id = await sqlCommand.ExecuteScalarAsync();
                    return Convert.ToInt32(id);
                }
            }
        }


        public async Task<List<BookRequestResponseModel>> GetBookRequestsAsync()
        {
            var bookRequests = new List<BookRequestResponseModel>();
            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("SELECT * FROM BookRequest", sqlConnection))
                {
                    await sqlConnection.OpenAsync();
                    SqlDataReader reader = await sqlCommand.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        var bookRequestModel = new BookRequestResponseModel
                        {
                            Id = reader["id"] != DBNull.Value ? (int)reader["id"] : 0,
                            UserID = reader["UserID"] != DBNull.Value ? (int)reader["UserID"] : 0,
                            RequestedDate = (DateOnly)reader["RequestedDate"],
                            UserNicNumber = (int)reader["UserNicNumber"],
                            Bookname = reader["Bookname"] != DBNull.Value ? reader["Bookname"].ToString() : string.Empty,
                            Status=(bool)reader["status"]

                        };

                        bookRequests.Add(bookRequestModel);
                    }

                    reader.Close();
                }
            }

            return bookRequests;
        }

    
        public async Task<bool>UpdateStatusAsync(int id,BookRequestModel bookRequestModel)
        {
            using (SqlConnection sqlConnection=new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("UPDATE BookRequest SET Status=@Status WHERE UserID=@UserID ", sqlConnection))
                {
                    await sqlConnection.OpenAsync();
                    sqlCommand.Parameters.AddWithValue("UserID", bookRequestModel.UserID);
                    sqlCommand.Parameters.AddWithValue("Status", bookRequestModel.Status= true);

                    var result=await sqlCommand.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }


    }
}
