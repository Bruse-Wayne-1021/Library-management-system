
using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Cors;

namespace Library_Management_system_API
{
    public class Program
    {
        public static void Main(string[] args)
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
            builder.Services.AddSingleton<MemberRepository>();
            builder.Services.AddSingleton<BookRepository>();
            builder.Services.AddSingleton<BookImageRepository>();

            var app = builder.Build();

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
