namespace Library_Management_system_API.Models
{
    public class Book
    {
        public int Id {  get; set; }
        public string? Title { get; set; }
        public string? Publisher {  get; set; }
        public int BookCopies { get; set; }
        public int  Isbn { get; set; }
        public int Genre { get; set; }
      
    }
}