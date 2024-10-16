using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Model.ResponseModel;
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


        [HttpPost]
        public async Task<IActionResult> AddBorrowedBook([FromBody] BorrowedBookRequestModel borrowedBookRequestModel)
        {
            if (borrowedBookRequestModel == null)
            {
                return BadRequest("Invalid book request.");
            }

            var id = await _borrowedBooksRepository.AddNewBorrowedBookAsync(borrowedBookRequestModel);
            return CreatedAtAction(nameof(AddBorrowedBook), new { id }, borrowedBookRequestModel);
        }
    }
}
