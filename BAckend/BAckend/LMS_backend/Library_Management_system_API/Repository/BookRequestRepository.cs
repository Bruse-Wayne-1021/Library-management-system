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


        public async Task<int> BookRequestAsync(BookRequestModel bookRequestModel)
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


        //public async Task<List<BookRequestResponseModel>> GetBookRequestsAsync()
        //{
        //    var bookRequests = new List<BookRequestResponseModel>();
        //    using (SqlConnection sqlConnection=new SqlConnection(_ConnectionString))
        //    {
        //        using (SqlCommand sqlCommand = new SqlCommand("SELECT * FROM BookRequest ", sqlConnection))
        //        {
        //            sqlConnection.Open();
        //            SqlDataReader reader = sqlCommand.ExecuteReader();
        //            while (reader.Read())
        //            {
        //                var bookRequestModel = new BookRequestResponseModel
        //                {
        //                    Id=(int)reader["id"],
        //                    UserID=(int)reader["user_id"],

        //                };
                        
        //            }
        //        }
        //    }

        //}


    }
}
