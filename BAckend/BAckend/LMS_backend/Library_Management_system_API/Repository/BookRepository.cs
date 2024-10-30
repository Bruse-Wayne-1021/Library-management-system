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
                    "INSERT INTO Books (Title, Publisher, BookCopies, Isbn,Genres) " +
                    "VALUES(@Title, @Publisher, @BookCopies, @Isbn,@Genre); SELECT SCOPE_IDENTITY();", connection);

                sqlCommand.Parameters.AddWithValue("@Title", book.Title);
                sqlCommand.Parameters.AddWithValue("@Publisher", book.Publisher);
                sqlCommand.Parameters.AddWithValue("@BookCopies", book.BookCopies);
                sqlCommand.Parameters.AddWithValue("@Isbn", book.Isbn);
                sqlCommand.Parameters.AddWithValue("@Genre", book.Genre);

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
                        Isbn = (int)reader["Isbn"],
                        Genre = reader["Genres"].ToString()


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
                        Genre = reader["Genres"].ToString(),

                        Images = new List<string> { reader["ImagePath"].ToString() }
                    });
                }
            }
            return booksImage;
        }



   

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
                    return result > 0; 
                }
            }
        }


        public async Task<bool> DeleteByIsbnAsync(int isbn)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                await sqlConnection.OpenAsync();
                using (SqlTransaction transaction = sqlConnection.BeginTransaction())
                {
                    try
                    {
                        
                        using (SqlCommand sqlCommand = new SqlCommand("DELETE FROM Images WHERE Isbn = @Isbn", sqlConnection, transaction))
                        {
                            sqlCommand.Parameters.AddWithValue("@Isbn", isbn);
                            await sqlCommand.ExecuteNonQueryAsync();
                        }

                      
                        using (SqlCommand sqlCommand = new SqlCommand("DELETE FROM Books WHERE Isbn = @Isbn", sqlConnection, transaction))
                        {
                            sqlCommand.Parameters.AddWithValue("@Isbn", isbn);
                            var result = await sqlCommand.ExecuteNonQueryAsync();

                          
                            transaction.Commit();
                            return result > 0;
                        }
                    }
                    catch (Exception ex)
                    {
                        
                        transaction.Rollback();
                      
                        Console.WriteLine(ex.Message);
                        return false;
                    }
                }
            }
        }


        // Method to edit book details
        //public async Task<bool> EditBookDetailsAsync(Book book)
        //{
        //    using (SqlConnection connection = new SqlConnection(_connectionString))
        //    {
        //        using (SqlCommand command = new SqlCommand(
        //            "UPDATE Books SET Title = @Title, Publisher = @Publisher, BookCopies = @BookCopies, Genres = @Genre WHERE Isbn = @Isbn", connection))
        //        {
        //            command.Parameters.AddWithValue("@Title", book.Title);
        //            command.Parameters.AddWithValue("@Publisher", book.Publisher);
        //            command.Parameters.AddWithValue("@BookCopies", book.BookCopies);
        //            command.Parameters.AddWithValue("@Genre", book.Genre);
        //            command.Parameters.AddWithValue("@Isbn", book.Isbn);

        //            await connection.OpenAsync();
        //            var result = await command.ExecuteNonQueryAsync();
        //            return result > 0;  
        //        }
        //    }
        //}











    }
}
