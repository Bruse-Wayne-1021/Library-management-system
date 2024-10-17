using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Model.ResponseModel;
using Microsoft.Data.SqlClient;

namespace Library_Management_system_API.Repository
{
    public class BorrowedHistoryRepository
    {
        private readonly string _ConnectionString;

        public BorrowedHistoryRepository(IConfiguration configuration)
        {
            _ConnectionString = configuration.GetConnectionString("DBConnection");
        }

        public async Task<int> AddBorrowedHistoryAsync(BorrowedHistoryRequestModel borrowedHistoryRequestModel)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("INSERT into BorrowedHistory " +
                    "(UserNicNumber, UserFirstName, UserLastName, BookName, BookIsbn, BorrowedDate, ReturnedDate) " +
                    "VALUES(@UserNicNumber, @UserFirstName, @UserLastName, @BookName, @BookIsbn, @BorrowedDate, @ReturnedDate)", sqlConnection))
                {
                    sqlCommand.Parameters.AddWithValue("@UserNicNumber", borrowedHistoryRequestModel.UserNicNumber);
                    sqlCommand.Parameters.AddWithValue("@UserFirstName", borrowedHistoryRequestModel.UserFirstName);
                    sqlCommand.Parameters.AddWithValue("@UserLastName", borrowedHistoryRequestModel.UserLastName);
                    sqlCommand.Parameters.AddWithValue("@BookName", borrowedHistoryRequestModel.BookName); 
                    sqlCommand.Parameters.AddWithValue("@BookIsbn", borrowedHistoryRequestModel.BookIsbn);  
                    sqlCommand.Parameters.AddWithValue("@BorrowedDate", borrowedHistoryRequestModel.BorrowedDate);
                    sqlCommand.Parameters.AddWithValue("@ReturnedDate", borrowedHistoryRequestModel.ReturnedDate);

                    await sqlConnection.OpenAsync();
                    var id = await sqlCommand.ExecuteScalarAsync();
                    return Convert.ToInt32(id);
                }
            }
        }

        public async Task<List<HistoryResponseModel>> GetAllRecords()
        {
            var record = new List<HistoryResponseModel>();

            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                await sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand("SELECT * FROM BorrowedHistory", sqlConnection))
                {
                    SqlDataReader reader = await sqlCommand.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        record.Add(new HistoryResponseModel
                        {
                            Id = (int)reader["Id"],
                            UserNicNumber = reader["UserNicNumber"].ToString(), 
                            UserFirstName = reader["UserFirstName"].ToString(),
                            UserLastName = reader["UserLastName"].ToString(),
                            BookName = reader["BookName"].ToString(),             
                            BookIsbn = (int)reader["BookIsbn"],                  
                            BorrowedDate = (DateTime)reader["BorrowedDate"],
                          //  ReturnedDate =(DateTime) reader["ReturnedDate"] 
                               
                        });
                    }

                    return record;
                }
            }
        }
    }
}
