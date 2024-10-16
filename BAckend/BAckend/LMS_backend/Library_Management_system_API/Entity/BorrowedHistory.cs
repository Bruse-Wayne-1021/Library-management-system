namespace Library_Management_system_API.Models
{
    public class BorrowedHistory
    {
        public int Id { get; set; }
        public string UserNicNumber { get; set; }  // Changed to string
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string BookName { get; set; }       // Corrected capitalization to match SQL table
        public int BookIsbn { get; set; }          // Corrected capitalization to match SQL table
        public DateTime BorrowedDate { get; set; }
        public DateTime ReturnedDate { get; set; }
    }
}
