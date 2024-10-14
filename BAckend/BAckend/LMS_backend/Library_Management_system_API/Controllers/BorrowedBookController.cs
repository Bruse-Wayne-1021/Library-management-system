using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_system_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BorrowedBookController : ControllerBase
    {
        private readonly BorrowedBooksRepository _borrowedBooksRepository;

        public BorrowedBookController (BorrowedBooksRepository borrowedBooksRepository)
        {
            _borrowedBooksRepository = borrowedBooksRepository;
        }


        [HttpPost("add-new-BorrowedBook")]
        public async Task<IActionResult> AddBorrowedBook(BorrowedBookRequestModel borrowedBookRequestModel)
        {
            var data=await _borrowedBooksRepository.AddBorrowedBooksAsync(borrowedBookRequestModel);
            return Ok(data);
        }
    }
}
