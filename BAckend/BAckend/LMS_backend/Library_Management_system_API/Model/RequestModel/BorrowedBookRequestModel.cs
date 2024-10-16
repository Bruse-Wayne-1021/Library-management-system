namespace Library_Management_system_API.Model.RequestModel
{
    public class BorrowedBookRequestModel
    {
        public string UserNicNumber { get; set; }
        public string Bookname { get; set; }
        public int bookIsbn { get; set; }
        public DateTime BorrowedDate { get; set; }
        public DateTime duedate { get; set; }
    }
}
