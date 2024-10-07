namespace Library_Management_system_API.Models
{
    public class Member
    {
         public int  Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? Nic {  get; set; }
        public string? Email { get; set; }
        public int PhoneNumber {  get; set; }
        //public DateOnly JoinDate { get; set; }
    }
}
