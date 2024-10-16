namespace Library_Management_system_API.Model.ResponseModel
{
    public class HistoryResponseModel
    {
        public int Id { get; set; }
        public string UserNicNumber { get; set; }  
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string BookName { get; set; }       
        public int BookIsbn { get; set; }          
        public DateTime BorrowedDate { get; set; }
        public DateTime ReturnedDate { get; set; }
    }
}
