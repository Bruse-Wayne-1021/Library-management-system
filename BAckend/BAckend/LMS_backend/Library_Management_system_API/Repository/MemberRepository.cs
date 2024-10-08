using Library_Management_system_API.Models;
using Microsoft.Data.SqlClient;

namespace Library_Management_system_API.Repository
{
    public class MemberRepository
    {
        private readonly string _connectionString;

        public MemberRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBConnection");
        }


        //create new members
        public async Task<int> CreateMemberAsync(Member member) 
        {
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand(
                    "INSERT INTO Member (FirstName, LastName, Nic, Email, PhoneNumber) " +
                    "OUTPUT INSERTED.Id " +
                    "VALUES (@FirstName, @LastName, @Nic, @Email, @PhoneNumber)",
                    sqlConnection);

                sqlCommand.Parameters.AddWithValue("@FirstName", member.FirstName);
                sqlCommand.Parameters.AddWithValue("@LastName", member.LastName);
                sqlCommand.Parameters.AddWithValue("@Nic", member.Nic);
                sqlCommand.Parameters.AddWithValue("@Email", member.Email);
                sqlCommand.Parameters.AddWithValue("@PhoneNumber", member.PhoneNumber);
                //sqlCommand.Parameters.AddWithValue("@JoinDate", member.JoinDate);

                await sqlConnection.OpenAsync();
                var id = await sqlCommand.ExecuteScalarAsync();
                return Convert.ToInt32(id);
            }
        }

        //get members by id

        public async Task<Member> GetMemberByIdAsync(int id)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("SELECT * FROM Member WHERE Id = @Id", sqlConnection);
                sqlCommand.Parameters.AddWithValue("@Id", id);

                await sqlConnection.OpenAsync();
                SqlDataReader reader = await sqlCommand.ExecuteReaderAsync();
                if (reader.Read())
                {
                    return new Member
                    {
                        Id = (int)reader["Id"],
                        FirstName = reader["FirstName"].ToString(),
                        LastName = reader["LastName"].ToString(),
                        Nic = reader["Nic"] != DBNull.Value ? (int)reader["Nic"] : null,
                        Email = reader["Email"].ToString(),
                        PhoneNumber = (int)reader["PhoneNumber"],
                        //JoinDate = DateOnly.FromDateTime((DateTime)reader["JoinDate"])
                    };
                }
                return null;
            }
        }

        //get all members
        public async Task<List<Member>> GetAllMembersAsync()
        {

            var member= new List<Member>();
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand =new SqlCommand("SELECT * FROM Member",sqlConnection);
                await sqlConnection.OpenAsync();
                SqlDataReader reader=await sqlCommand.ExecuteReaderAsync();
                while (reader.Read())
                {
                    member.Add(new Member
                    {
                        Id = (int)reader["Id"],
                        FirstName = reader["FirstName"].ToString(),
                        LastName = reader["LastName"].ToString(),
                        Nic = reader["Nic"] != DBNull.Value ? (int)reader["Nic"] : null,
                        Email = reader["Email"].ToString(),
                        PhoneNumber = (int)reader["PhoneNumber"],

                    });
                }
                return member;
            }
        }
        //delete member
        public async Task<bool>DeleteMembersAsync(int id)
        {
            using SqlConnection sqlConnection = new SqlConnection(_connectionString);
            {
                SqlCommand sqlCommand = new SqlCommand("DELETE FROM Member WHERE Id = @Id", sqlConnection);
                sqlCommand.Parameters.AddWithValue("@Id",id);

                await sqlConnection.OpenAsync();
                var result=await sqlCommand.ExecuteNonQueryAsync();
                return result > 0;
            }

        }

        //update user details 

        public async Task<bool>UpdateMemebrAsync(Member member)
        {
            using SqlConnection sqlConnection=new SqlConnection(_connectionString);
            {
                SqlCommand sqlCommand = new SqlCommand("UPDATE Member SET FirstName=@FirstName,LastName=@LastName,Email=@Email,PhoneNumber=@PhoneNumber WHERE Id = @Id", sqlConnection);
                
                    sqlCommand.Parameters.AddWithValue("@FirstName", member.FirstName);
                    sqlCommand.Parameters.AddWithValue("@LastName",member.LastName);
                    sqlCommand.Parameters.AddWithValue("@Email",member.Email);
                    sqlCommand.Parameters.AddWithValue("@PhoneNumber", member.PhoneNumber);

                    await sqlConnection.OpenAsync();
                    var result= await sqlCommand.ExecuteNonQueryAsync();
                    return result > 0;
            }
        }



    }
}
