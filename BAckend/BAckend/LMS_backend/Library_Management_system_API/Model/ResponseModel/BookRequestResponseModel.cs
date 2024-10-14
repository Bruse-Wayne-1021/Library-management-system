namespace Library_Management_system_API.Model.ResponseModel
{
    public class BookRequestResponseModel
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public DateOnly RequestedDate { get; set; }
        public int UserNicNumber { get; set; }
        public string Bookname { get; set; }

        public bool Status { get; set; }
    }
}
