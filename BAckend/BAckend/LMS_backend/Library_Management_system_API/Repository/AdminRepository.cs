﻿using Library_Management_system_API.Model.ResponseModel;
using Library_Management_system_API.Models;
using Microsoft.Data.SqlClient;

namespace Library_Management_system_API.Repository
{
    public class AdminRepository
    {
        private readonly string _ConnectionString;

        public AdminRepository(IConfiguration configuration)
        {
            _ConnectionString = configuration.GetConnectionString("DBConnection");
        }

        public async Task<AdminResponsemodel> GetAdminByIdAsync(int id)
        {
            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("SELECT * FROM Admin ", sqlConnection))
                {
                  
                    sqlCommand.Parameters.AddWithValue("@AdminId", id);

                    await sqlConnection.OpenAsync();

                    SqlDataReader reader = await sqlCommand.ExecuteReaderAsync();

                    if (reader.Read())
                    {
                        return new AdminResponsemodel
                        {
                            AdminId = (int)reader["AdminId"],
                            AdminName = reader["AdminName"] != DBNull.Value ? reader["AdminName"].ToString() : string.Empty,  
                            NIC = reader["NIC"] != DBNull.Value ? reader["NIC"].ToString() : string.Empty,
                            Password = reader["Password"] != DBNull.Value ? reader["Password"].ToString() : string.Empty
                        };
                    }

                  
                    return null;
                }
            }
        }


        public async Task<List<Admin>> GetAdminAsync()
        {

            var admin = new List<Admin>();
            using (SqlConnection sqlConnection = new SqlConnection(_ConnectionString))
            {
                SqlCommand sqlCommand = new SqlCommand("SELECT * FROM Admin", sqlConnection);
                await sqlConnection.OpenAsync();
                SqlDataReader reader = await sqlCommand.ExecuteReaderAsync();
                while (reader.Read())
                {
                    admin.Add(new Admin
                    {
                        AdminId = (int)reader["AdminId"],
                        AdminName = reader["AdminName"].ToString(),
                        NIC = reader["NIC"].ToString(),
                        Password = reader["Password"].ToString()
                    });
                }
                return admin;
            }
        }

    }
}