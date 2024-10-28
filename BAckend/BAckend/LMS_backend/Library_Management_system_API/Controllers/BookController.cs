using Library_Management_system_API.Model.ResponseModel;
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
        private readonly BookImageRepository _bookImageRepository;

        public BookController(BookRepository bookRepository, BookImageRepository bookImageRepository)
        {
            _bookRepository = bookRepository;
            _bookImageRepository = bookImageRepository;
        }
        //add book
        [HttpPost("add-new-book")]
        public async Task<IActionResult> CreateNewMember([FromBody]Book book)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var bookid = await _bookRepository.AddNewBookAsync(book);
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
            var bookwithImages=await _bookRepository.GetAllBooksWithImagesAsync();
            return Ok(bookwithImages);
        }


        [HttpGet]
        public async Task<ActionResult<List<BookImageResponse>>> GetAllBooksWithImages()
        {
            var booksWithImages = await _bookRepository.GetAllBooksWithImagesAsync();
            return Ok(booksWithImages);
        }

        [HttpPut("{isbn}")]
        public async Task<IActionResult> UpdateCopies(int isbn, [FromBody] int bookCopies)
        {
            var success = await _bookRepository.UpdateCopiesAsync(isbn, bookCopies);

            if (success)
            {
                return Ok(new { message = "Book copies updated successfully." });
            }

            return BadRequest(new { message = "Failed to update book copies." });
        }


        [HttpDelete("{isbn}")]
        public async Task<IActionResult> DeleteBooks(int isbn)
        {
            var success = await _bookRepository.DeleteByIsbnAsync(isbn);
            if (success)
                return Ok(new { message = "Book deleted successfully." });
            else
                return BadRequest(new { message = "Unable to delete the book. Check for related records or constraints." });
        }








    }
}
