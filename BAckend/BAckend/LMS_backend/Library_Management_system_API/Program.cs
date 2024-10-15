
using Library_Management_system_API.DbInitializer;
using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Cors;
using Microsoft.OpenApi.Writers;
using System.Collections.Immutable;

namespace Library_Management_system_API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
           //add cors policy
            builder.Services.AddCors(opt =>
            {
                opt.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

            builder.Services.AddSingleton<lmsDbInitializer>();
            builder.Services.AddSingleton<MemberRepository>();
            builder.Services.AddSingleton<BookRepository>();
            builder.Services.AddSingleton<BookImageRepository>();
            builder.Services.AddSingleton<BookRequestRepository>();
            builder.Services.AddSingleton<BorrowedBooksRepository>();
            builder.Services.AddSingleton<AdminRepository>();
            builder.Services.AddSingleton<BorrowedHistoryRepository>();


            var app = builder.Build();


            using (var scope = app.Services.CreateScope())
            {
                var dbSet = scope.ServiceProvider.GetRequiredService<lmsDbInitializer>();
                var result = await dbSet.CreateTable();

            }
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            
            //enable cors

            app.UseCors("AllowAll");

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
