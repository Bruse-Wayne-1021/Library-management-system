﻿namespace Library_Management_system_API.Models
{
    public class BorrowedBooks
    {
        public int Id { get; set; }
        public int UserNicNumber { get; set; }
        public string Bookname { get; set; }
        public string bookIsbn { get; set; }
        public DateOnly BorrowedDate { get; set; }
        public DateOnly duedate { get; set; }

    }
}
