using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Model.ResponseModel;
using Library_Management_system_API.Models;
using Microsoft.Data.SqlClient;

namespace Library_Management_system_API.Repository
{
    public class BookImageRepository
    {
        private readonly string _connectionString;

        public BookImageRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBConnection");
        }

        // add new book image
        public async Task<int> AddNewBookImgAsync(ImageRequestModel imageRequestModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand(
                    "INSERT INTO Images (ImagePath, Isbn) VALUES (@ImagePath, @Isbn);", connection);

                sqlCommand.Parameters.AddWithValue("@ImagePath", imageRequestModel.ImagePath);
                sqlCommand.Parameters.AddWithValue("@Isbn", imageRequestModel.Isbn);

                await connection.OpenAsync();

               var id= await sqlCommand.ExecuteNonQueryAsync(); 
                return Convert.ToInt32(id);
                
            }
        }

        //get image by id

        public async Task<List<Image>> GetImageByidAsync(int Isbn)
        {
            var image=new List<Image>();
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("SELECT * FROM Images Where Isbn=@Isbn", sqlConnection);
                sqlCommand.Parameters.AddWithValue("@Isbn", Isbn);
                await sqlConnection.OpenAsync();
                SqlDataReader reader = sqlCommand.ExecuteReader();
                if (reader.Read())
                {
                    image.Add(new Image
                    {
                        ImageId = (int)reader["ImageId"],
                        ImagePath = reader["ImagePath"].ToString(),
                        Isbn = (int)reader["Isbn"]
                    });
                }
                return image;
            }
        }

       

     

    }
}
