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
        public async Task<int>AddNewBookImgAsync(ImageRequestModel imageRequestModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("INSERT INTO Images(ImagePath,BookId) VALUES(@ImagePath,@BookId)",connection);
                sqlCommand.Parameters.AddWithValue("@ImagePath", imageRequestModel.ImagePath);
                sqlCommand.Parameters.AddWithValue("@BookId",imageRequestModel.BookId);

                await connection.OpenAsync();
                var id=await sqlCommand.ExecuteScalarAsync();
                return Convert.ToInt32(id);

            }
        }


        //get image by id

        public async Task<List<Image>> GetImageByidAsync(int bookid)
        {
            var image=new List<Image>();
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("SELECT * FROM Images Where BookId=@BookId", sqlConnection);
                sqlCommand.Parameters.AddWithValue("@BookId",bookid);
                await sqlConnection.OpenAsync();
                SqlDataReader reader = sqlCommand.ExecuteReader();
                if (reader.Read())
                {
                    image.Add(new Image
                    {
                        ImageId = (int)reader["ImageId"],
                        ImagePath = reader["ImageId"].ToString(),
                        BookId = (int)reader["ImageId"]
                    });
                }
                return image;
            }
        }

       

     

    }
}
