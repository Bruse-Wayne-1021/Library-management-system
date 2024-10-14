namespace Library_Management_system_API.Models
{
    public class BookRequest
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public DateOnly RequestedDate { get; set; }
        public int UserNicNumber { get; set; }
        public string Bookname { get; set; }
        
        public bool Status { get; set; }


    }
}
