using Library_Management_system_API.Models;
using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Library_Management_system_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookRequestController : ControllerBase
    {
        private readonly BookRequestRepository _bookRequestRepository;

        public BookRequestController(BookRequestRepository bookRequestRepository)
        {
            _bookRequestRepository = bookRequestRepository;
        }

        [HttpPost]
        public async Task<IActionResult> RequestBook([FromBody] BookRequest bookRequest)
        {
            if (bookRequest == null)
            {
                return BadRequest("Invalid book request.");
            }

            // Enforce correct RequestedDate on server side
            bookRequest.RequestedDate = DateTime.Now;

            var id = await _bookRequestRepository.AddNewBookRequestAsync(bookRequest);
            return CreatedAtAction(nameof(RequestBook), new { id }, bookRequest);
        }


        [HttpGet]
        public async Task<IActionResult> GetBookRequests()
        {
            var requests = await _bookRequestRepository.GetBookRequestsAsync();
            return Ok(requests);
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateStatus(int id)
        //{
        //    var result = await _bookRequestRepository.UpdateStatusAsync(id);
        //    if (result)
        //    {
        //        return NoContent();
        //    }

        //    return NotFound();
        //}

        [HttpDelete("{id}")]

        public async Task<IActionResult>DeleteRequest(int id)
        {
            var data= await _bookRequestRepository.DeleteRequestAsync(id);
            return Ok(data);
        }
    }
}
