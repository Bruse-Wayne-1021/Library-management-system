﻿namespace Library_Management_system_API.Model.RequestModel
{
    public class BookRequestModel
    {
        public int Bookid { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public DateTime RequestedDate { get; set; }
        public int UserNicNumber { get; set; }
        public string Bookname { get; set; }

        public bool Status { get; set; }
    }
}
