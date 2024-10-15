using Library_Management_system_API.Models;

namespace Library_Management_system_API.Model.ResponseModel
{
    public class BookImageResponse
    {
        public int BookId { get; set; }
        public string? Title { get; set; }
        public string? Publisher { get; set; }
        public int BookCopies { get; set; }
        public int Isbn { get; set; }

         public List<string> Images { get; set; }
    }
}
