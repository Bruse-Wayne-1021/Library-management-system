using Microsoft.AspNetCore.Identity;

namespace Library_Management_system_API.Models
{
    public class Member
    {
         public int  Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Nic {  get; set; }
        public string? Email { get; set; }
        public  string? PhoneNumber {  get; set; }
       // public DateOnly JoinDate { get; set; }

        public string? password { get; set; }
    }
}
