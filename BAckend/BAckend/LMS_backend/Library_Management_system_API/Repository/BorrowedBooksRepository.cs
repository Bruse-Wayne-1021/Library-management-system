using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Model.ResponseModel;
using Library_Management_system_API.Models;
using Microsoft.Data.SqlClient;

namespace Library_Management_system_API.Repository
{
    public class BorrowedBooksRepository
    {
        private readonly string _ConnectionString;

        public BorrowedBooksRepository(IConfiguration configuration)
        {
            _ConnectionString = configuration.GetConnectionString("DBConnection");
        }

        public async Task<int> AddNewBorrowedBookAsync(BorrowedBookRequestModel borrowedBookRequestModel)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                string query = "INSERT INTO BorrowedBooks (UserNicNumber, Bookname, bookIsbn, BorrowedDate, duedate) " +
                               "VALUES (@UserNicNumber, @Bookname, @bookIsbn, @BorrowedDate, @duedate); " +
                               "SELECT SCOPE_IDENTITY();";

                using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
                {
                    sqlCommand.Parameters.AddWithValue("@UserNicNumber", borrowedBookRequestModel.UserNicNumber);
                    sqlCommand.Parameters.AddWithValue("@Bookname", borrowedBookRequestModel.Bookname);
                    sqlCommand.Parameters.AddWithValue("@bookIsbn", borrowedBookRequestModel.bookIsbn);
                    sqlCommand.Parameters.AddWithValue("@BorrowedDate", borrowedBookRequestModel.BorrowedDate);
                    sqlCommand.Parameters.AddWithValue("@duedate", borrowedBookRequestModel.duedate);

                    sqlConnection.Open();
                    var id = await sqlCommand.ExecuteScalarAsync();
                    return Convert.ToInt32(id);
                }
            }
        }

        public async Task<List<BorrowedBooksResponseModel>> getAllBorrowedBooksDetailsAsync()
        {
            var borrowedBooksDetails = new List<BorrowedBooksResponseModel>();

            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("SELECT * FROM BorrowedBooks", sqlConnection))
                {
                    sqlConnection.Open();
                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var book = new BorrowedBooksResponseModel
                            {
                                Id = (int)reader["Id"],  // Correct column name for Id
                                UserNicNumber = reader["UserNicNumber"].ToString(),
                                Bookname = reader["Bookname"].ToString(),
                                bookIsbn = (int)reader["bookIsbn"],
                                BorrowedDate = (DateTime)reader["BorrowedDate"],
                                duedate = (DateTime)reader["duedate"] // Use the correct column name for the due date
                            };
                            borrowedBooksDetails.Add(book);
                        }
                    }
                }
            }
            return borrowedBooksDetails;
        }



    }


}

