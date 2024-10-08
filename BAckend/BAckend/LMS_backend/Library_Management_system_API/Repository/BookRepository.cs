using Library_Management_system_API.Models;
using Microsoft.Data.SqlClient;

namespace Library_Management_system_API.Repository
{
    public class BookRepository
    {
        private readonly string _connectionString;

        public BookRepository (IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBConnection");

        }


        //ADD NEW BOOK
        public async Task<int>AddnewBookAsync(Book book)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("INSERT INTO books (Title,Publisher,BookCopies,Isbn) " +
                    "VALUES(@Title,@Publisher,@BookCopies,@Isbn)SELECT SCOPE_IDENTITY();",connection);

                sqlCommand.Parameters.AddWithValue("@Title",book.Title);
                sqlCommand.Parameters.AddWithValue("@Publisher",book.Publisher);
                sqlCommand.Parameters.AddWithValue("@BookCopies",book.BookCopies);
                sqlCommand.Parameters.AddWithValue("@Isbn",book.Isbn);

                await connection.OpenAsync();
                var id=await sqlCommand.ExecuteScalarAsync();
                return Convert.ToInt32(id);

            }

        }


     
    }
}
