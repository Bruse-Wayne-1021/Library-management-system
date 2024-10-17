using Library_Management_system_API.Model.ResponseModel;
using Library_Management_system_API.Models;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Data.SqlClient;

namespace Library_Management_system_API.Repository
{
    public class BookRepository
    {
        private readonly string _connectionString;
        private readonly BookImageRepository _bookImageRepository;

        public BookRepository(IConfiguration configuration, BookImageRepository bookImageRepository)
        {
            _connectionString = configuration.GetConnectionString("DBConnection");
            _bookImageRepository = bookImageRepository;
        }


        //ADD NEW BOOK
        public async Task<int> AddNewBookAsync(Book book)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand(
                    "INSERT INTO Books (Title, Publisher, BookCopies, Isbn) " +
                    "VALUES(@Title, @Publisher, @BookCopies, @Isbn); SELECT SCOPE_IDENTITY();", connection);

                sqlCommand.Parameters.AddWithValue("@Title", book.Title);
                sqlCommand.Parameters.AddWithValue("@Publisher", book.Publisher);
                sqlCommand.Parameters.AddWithValue("@BookCopies", book.BookCopies);
                sqlCommand.Parameters.AddWithValue("@Isbn", book.Isbn);

                await connection.OpenAsync();
                var id = await sqlCommand.ExecuteScalarAsync();
                return Convert.ToInt32(id);
            }
        }


        //get all books

        public async Task<List<Book>> GetallBookAsync()
        {
            var books = new List<Book>();
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("SELECT * FROM Books", sqlConnection);
                await sqlConnection.OpenAsync();
                SqlDataReader reader = sqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    books.Add(new Book
                    {
                        Title = reader["Title"].ToString(),
                        Publisher = reader["Publisher"].ToString(),
                        BookCopies = (int)reader["BookCopies"],
                        Isbn = (int)reader["Isbn"]
                    });
                }
                return books;
            }
        }


        //get all bike with images

        public async Task<List<BookImageResponse>> GetAllBooksWithImagesAsync()
        {
            var booksImage = new List<BookImageResponse>();
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand(
                    "SELECT Books.*, Images.ImagePath FROM Books " +
                    "INNER JOIN Images ON Books.Isbn = Images.Isbn;", sqlConnection);

                await sqlConnection.OpenAsync();
                SqlDataReader reader = await sqlCommand.ExecuteReaderAsync();

                while (reader.Read())
                {
                    booksImage.Add(new BookImageResponse
                    {
                        Title = reader["Title"].ToString(),
                        Publisher = reader["Publisher"].ToString(),
                        BookCopies = (int)reader["BookCopies"],
                        Isbn = (int)reader["Isbn"],
                        Images = new List<string> { reader["ImagePath"].ToString() }
                    });
                }
            }
            return booksImage;
        }
        // get books with images by id
        //public async Task<BookImageResponse> GetBookImagesByid(int id)
        //{
        //    var images= new List<BookImageResponse>();
        //    using (SqlConnection SQLconnection = new SqlConnection(_connectionString))
        //    {
        //        SqlCommand _sqlCommand = new SqlCommand("SELECT * FROM Books INNER JOIN Images  on Books.Id = Images.BookId;", SQLconnection);
        //        await SQLconnection.OpenAsync();
        //        SqlDataReader sqlDataReader = await _sqlCommand.ExecuteReaderAsync();
        //        if (sqlDataReader.Read())
        //        {
        //            var bookimage=await _bookImageRepository.GetImageByidAsync(id);
        //            return new BookImageResponse
        //            {
        //                Title = sqlDataReader["Title"].ToString(),
        //                Publisher = sqlDataReader["Publisher"].ToString(),
        //                BookCopies = (int)sqlDataReader["BookCopies"],
        //                Isbn = (int)sqlDataReader["Isbn"],
        //                Images = bookimage
        //            };
        //        }
        //        return null;

        //    }
        //}

        public async Task<bool> UpdateCopiesAsync(int isbn, int bookCopies)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("UPDATE Books SET BookCopies = @BookCopies WHERE Isbn = @Isbn", sqlConnection))
                {
                    sqlCommand.Parameters.AddWithValue("@BookCopies", bookCopies);
                    sqlCommand.Parameters.AddWithValue("@Isbn", isbn);

                    await sqlConnection.OpenAsync();
                    var result = await sqlCommand.ExecuteNonQueryAsync();
                    return result > 0; // Return true if the update was successful
                }
            }
        }









    }
}
