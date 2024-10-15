namespace Library_Management_system_API.Model.RequestModel
{
    public class HistoryRequestModel
    {
        public int UserNicNumber { get; set; }
        public string Bookname { get; set; }
        public int bookIsbn { get; set; }
        public DateTime BorrowedDate { get; set; }
        public DateTime duedate { get; set; }
    }
}
