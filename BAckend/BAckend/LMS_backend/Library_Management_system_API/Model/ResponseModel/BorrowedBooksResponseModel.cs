namespace Library_Management_system_API.Model.ResponseModel
{
    public class BorrowedBooksResponseModel
    {
        public int Id { get; set; }
        public string UserNicNumber { get; set; }
        public string Bookname { get; set; }
        public int bookIsbn { get; set; }
        public DateTime BorrowedDate { get; set; }
        public DateTime duedate { get; set; }
    }
}
