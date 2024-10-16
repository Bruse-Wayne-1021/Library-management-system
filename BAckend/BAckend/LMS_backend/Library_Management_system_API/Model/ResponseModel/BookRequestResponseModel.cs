namespace Library_Management_system_API.Model.ResponseModel
{
    public class BookRequestResponseModel
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public DateTime RequestedDate { get; set; }
        public string UserNicNumber { get; set; }
        public string Bookname { get; set; }

        public bool Status { get; set; }
    }
}
