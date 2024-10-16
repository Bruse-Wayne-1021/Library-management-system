namespace Library_Management_system_API.Model.RequestModel
{
    public class BorrowedHistoryRequestModel
    {
        public string UserNicNumber { get; set; }  
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string BookName { get; set; }       
        public int BookIsbn { get; set; }          
        public DateTime BorrowedDate { get; set; }
        public DateTime ReturnedDate { get; set; }
    }
}
