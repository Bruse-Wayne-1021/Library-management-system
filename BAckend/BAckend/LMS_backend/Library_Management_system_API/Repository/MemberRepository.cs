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
                    "INSERT INTO Member (FirstName, LastName, Nic, Email, PhoneNumber, JoinDate, Password) " +
                    "OUTPUT INSERTED.Id " +
                    "VALUES (@FirstName, @LastName, @Nic, @Email, @PhoneNumber, @JoinDate, @Password)",
                    sqlConnection);

                sqlCommand.Parameters.AddWithValue("@FirstName", member.FirstName);
                sqlCommand.Parameters.AddWithValue("@LastName", member.LastName);
                sqlCommand.Parameters.AddWithValue("@Nic", member.Nic);
                sqlCommand.Parameters.AddWithValue("@Email", member.Email);
                sqlCommand.Parameters.AddWithValue("@PhoneNumber", member.PhoneNumber);
                sqlCommand.Parameters.AddWithValue("@JoinDate", member.JoinDate);
                sqlCommand.Parameters.AddWithValue("@Password", member.Password); // Fixed capitalization

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
                        Nic = reader["Nic"].ToString(),
                        Email = reader["Email"].ToString(),
                        PhoneNumber = reader["PhoneNumber"].ToString(),
                        JoinDate = ((DateTime)reader["JoinDate"])
                    };
                }
                return null;
            }
        }

        //get all members
        public async Task<List<Member>> GetAllMembersAsync()
        {

            var member = new List<Member>();
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("SELECT * FROM Member", sqlConnection);
                await sqlConnection.OpenAsync();
                SqlDataReader reader = await sqlCommand.ExecuteReaderAsync();
                while (reader.Read())
                {
                    member.Add(new Member
                    {
                        Id = (int)reader["Id"],
                        FirstName = reader["FirstName"].ToString(),
                        LastName = reader["LastName"].ToString(),
                        Nic = reader["Nic"].ToString(),
                        Email = reader["Email"].ToString(),
                        PhoneNumber = reader["PhoneNumber"].ToString()

                    });
                }
                return member;
            }
        }
        //delete member
        public async Task<bool> DeleteMembersAsync(int id)
        {
            using SqlConnection sqlConnection = new SqlConnection(_connectionString);
            {
                SqlCommand sqlCommand = new SqlCommand("DELETE FROM Member WHERE Id = @Id", sqlConnection);
                sqlCommand.Parameters.AddWithValue("@Id", id);

                await sqlConnection.OpenAsync();
                var result = await sqlCommand.ExecuteNonQueryAsync();
                return result > 0;
            }

        }

        //update user details 

        public async Task<bool> UpdateMemebrAsync(int id, Member member)
        {
            using SqlConnection sqlConnection = new SqlConnection(_connectionString);
            {
                SqlCommand sqlCommand = new SqlCommand("UPDATE Member SET FirstName=@FirstName,LastName=@LastName,Email=@Email,PhoneNumber=@PhoneNumber,password=@password WHERE Id = @Id", sqlConnection);

                sqlCommand.Parameters.AddWithValue("@FirstName", member.FirstName);
                sqlCommand.Parameters.AddWithValue("@LastName", member.LastName);
                sqlCommand.Parameters.AddWithValue("@Email", member.Email);
                sqlCommand.Parameters.AddWithValue("@PhoneNumber", member.PhoneNumber);
                sqlCommand.Parameters.AddWithValue("@password", member.Password);
                sqlCommand.Parameters.AddWithValue("@Id", id);

                await sqlConnection.OpenAsync();
                var result = await sqlCommand.ExecuteNonQueryAsync();
                return result > 0;
            }
        }

        public async Task<Member> Login(string nic, string password)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("SELECT * FROM Member WHERE Nic=@Nic AND Password=@Password", sqlConnection))
                {

                    sqlCommand.Parameters.AddWithValue("@Nic", nic);
                    sqlCommand.Parameters.AddWithValue("@Password", password);

                    await sqlConnection.OpenAsync();

                    SqlDataReader sqlDataReader = await sqlCommand.ExecuteReaderAsync();

                    if (sqlDataReader.Read())
                    {

                        return new Member
                        {
                            Nic = sqlDataReader["Nic"].ToString(),
                            FirstName = sqlDataReader["FirstName"].ToString(),
                            LastName = sqlDataReader["LastName"].ToString(),
                            Email = sqlDataReader["Email"].ToString(),
                            PhoneNumber = sqlDataReader["PhoneNumber"].ToString(),
                            Password = sqlDataReader["Password"].ToString(),
                            JoinDate = (DateTime)sqlDataReader["JoinDate"]
                        };
                    }
                    else
                    {

                        return null;
                    }
                }
            }
        }



    }
}
