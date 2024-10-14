namespace Library_Management_system_API.Repository
{
    public class BorrowedHistoryRepository
    {
        private readonly  string  _ConnectionString;

        public BorrowedHistoryRepository(IConfiguration configuration)
        {
            _ConnectionString = configuration.GetConnectionString("DBConnection");
        }

       

    }
}
