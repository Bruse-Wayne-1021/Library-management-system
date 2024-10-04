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

        // getProduct

        //public async Task<List<Book>> GetBookAsync()
        //{
        //    var product=new List<Book>();
        //    using (SqlConnection  sqlConnection=new SqlConnection(_connectionString))
        //    {
        //        SqlCommand sqlCommand=new SqlCommand()
        //    }
        //}
    }
}
