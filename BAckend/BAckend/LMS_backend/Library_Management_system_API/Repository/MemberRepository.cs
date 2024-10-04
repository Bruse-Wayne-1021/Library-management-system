using Library_Management_system_API.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Identity.Client;

namespace Library_Management_system_API.Repository
{
    public class MemberRepository
    {
        private readonly string _connectionString;

        public MemberRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBConnection");
        }

        public async Task<string>createMemberAsync(Member member)
        {
            using (SqlConnection sqlConnection =new SqlConnection (_connectionString))
            {
                SqlCommand sqlCommand=new SqlCommand("INSERT INTO Member()")
            }
        }
    }
}
