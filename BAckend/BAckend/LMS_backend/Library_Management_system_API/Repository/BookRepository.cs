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
        public async Task<int> AddnewBookAsync(Book book)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("INSERT INTO books (Title,Publisher,BookCopies,Isbn) " +
                    "VALUES(@Title,@Publisher,@BookCopies,@Isbn)SELECT SCOPE_IDENTITY();", connection);

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
                SqlCommand sqlCommand = new SqlCommand("SELECT * FROM books", sqlConnection);
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

        public async Task<List<BookImageResponse>> GetAllBooksWithIMgAsync()
        {
            var booksImage = new List<BookImageResponse>();
            using SqlConnection sqlConnection = new SqlConnection(_connectionString);

            {
                SqlCommand sqlCommand = new SqlCommand("SELECT * FROM books INNER JOIN Images  on books.Id = Images.BookId;", sqlConnection);
                await sqlConnection.OpenAsync();
                SqlDataReader reader = await sqlCommand.ExecuteReaderAsync();
                while (reader.Read())
                {

                    var bookimage = await _bookImageRepository.GetImageByidAsync((int)reader["Id"]);
                    booksImage.Add(new BookImageResponse
                    {
                        Title = reader["Title"].ToString(),
                        Publisher = reader["Publisher"].ToString(),
                        BookCopies = (int)reader["BookCopies"],
                        Isbn = (int)reader["Isbn"],
                        BookImages = bookimage

                    });

                }
            }
            return booksImage;

        }

        // get books with images by id
        public async Task<BookImageResponse> GetBookImagesByid(int id)
        {
            var images= new List<BookImageResponse>();
            using (SqlConnection SQLconnection = new SqlConnection(_connectionString))
            {
                SqlCommand _sqlCommand = new SqlCommand("SELECT * FROM books INNER JOIN Images  on books.Id = Images.BookId;", SQLconnection);
                await SQLconnection.OpenAsync();
                SqlDataReader sqlDataReader = await _sqlCommand.ExecuteReaderAsync();
                if (sqlDataReader.Read())
                {
                    var bookimage=await _bookImageRepository.GetImageByidAsync(id);
                    return new BookImageResponse
                    {
                        Title = sqlDataReader["Title"].ToString(),
                        Publisher = sqlDataReader["Publisher"].ToString(),
                        BookCopies = (int)sqlDataReader["BookCopies"],
                        Isbn = (int)sqlDataReader["Isbn"],
                        BookImages = bookimage
                    };
                }
                return null;
                
            }
        }








    }
}
