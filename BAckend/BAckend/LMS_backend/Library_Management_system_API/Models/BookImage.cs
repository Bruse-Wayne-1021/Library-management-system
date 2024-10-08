namespace Library_Management_system_API.Models
{
    public class BookImage
    {
        public int BookId { get; set; }
        public string? Title { get; set; }
        public string? Publisher { get; set; }
        public int BookCopies { get; set; }
        public int Isbn { get; set; }

        public List<Image>BookImages { get; set; }
    }
}
