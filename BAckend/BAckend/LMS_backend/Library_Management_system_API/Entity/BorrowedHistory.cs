namespace Library_Management_system_API.Models
{
    public class BorrowedHistory
    {
        public int Id { get; set; }
        public  int UserNicNumber { get; set; }
        public string Bookname { get; set; }
        public int bookIsbn { get; set; }
        public DateTime BorrowedDate { get; set; }
        public DateTime ReturnedDate { get; set; }

    }
}
