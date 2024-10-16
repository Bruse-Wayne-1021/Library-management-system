namespace Library_Management_system_API.Models
{
    public class BookRequest
    {
        public int Id { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserNicNumber { get; set; }
        public DateTime RequestedDate { get; set; }
        public int Isbn { get; set; }
        public string BookName { get; set; }
        public bool Status { get; set; }
    }
}
