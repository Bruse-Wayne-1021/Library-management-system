using Library_Management_system_API.Models;
using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_system_API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class BookController : Controller
    {
        private readonly BookRepository _bookRepository;

        public BookController(BookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }
        //add book
        [HttpPost("add-new -book")]
        public async Task<IActionResult> CreateNewMember([FromBody]Book book)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var bookid = await _bookRepository.AddnewBookAsync(book);
                return Ok(new { Id = bookid, Message = "Book added successfully" });

            }catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("Get-all-books")]
        public async Task<IActionResult> GetAllbooks()
        {
            var book=await _bookRepository.GetallBookAsync();
            return Ok(book);
        }

        [HttpGet("get-all-books-with-images")]
        public async Task<IActionResult> GetAllBookWithImages()
        {
            var bookwithImages=await _bookRepository.GetAllBooksWithIMgAsync();
            return Ok(bookwithImages);
        }

        
    }
}
