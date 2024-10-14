using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Model.ResponseModel;
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

        public async Task<int>AddBorrowedBooksAsync(BorrowedBookRequestModel borrowedBookRequestModel)
        {
            using(SqlConnection sqlConnection=new SqlConnection(_ConnectionString))
            {
              
                using(SqlCommand sqlCommand=new SqlCommand("INSERT into BorrowedBooks (UserNicNumber,Bookname,bookIsbn,BorrowedDate,duedate) " +
                    "values(@UserNicNumber,@Bookname,@bookIsbn,@BorrowedDate,@duedate)",sqlConnection))
                {
                    sqlCommand.Parameters.AddWithValue("@UserNicNumber",borrowedBookRequestModel.UserNicNumber);
                    sqlCommand.Parameters.AddWithValue("@Bookname",borrowedBookRequestModel.Bookname);
                    sqlCommand.Parameters.AddWithValue("@bookIsbn",borrowedBookRequestModel.bookIsbn);
                    sqlCommand.Parameters.AddWithValue("@BorrowedDate",borrowedBookRequestModel.BorrowedDate);
                    sqlCommand.Parameters.AddWithValue("@duedate",borrowedBookRequestModel.duedate);

                    sqlConnection.Open();
                    var id = await sqlCommand.ExecuteScalarAsync();
                    return Convert.ToInt32(id);
                }
            }
        }

        public async Task<List<BorrowedBooksResponseModel>> gelAllBorrowedBooksDetailsAsync()
        {
            var borrowedBooksDetails =new List<BorrowedBooksResponseModel>();

            using (SqlConnection sqlConnection=new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("SELECT * FROM BorrowedBooks",sqlConnection))
                {
                    sqlConnection.Open();
                    SqlDataReader reader = sqlCommand.ExecuteReader();
                    while (reader.Read())
                    {
                        var book = new BorrowedBooksResponseModel
                        {
                            Id = (int)reader[""],
                            UserNicNumber = (int)reader["UserNicNumber"],
                            Bookname = reader["Bookname"].ToString(),
                            bookIsbn = reader["bookIsbn"].ToString(),
                            BorrowedDate = (DateOnly)reader["BorrowedDate"],
                            duedate = (DateOnly)reader["BorrowedDate"]
                        };
                        borrowedBooksDetails.Add(book);
                    }
                }
                return borrowedBooksDetails;
            }
        }


    }
}
