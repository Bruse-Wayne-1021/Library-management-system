using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_system_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookRequestController : ControllerBase
    {
        private readonly BookRequestRepository _BookRequestRepository;

        public BookRequestController(BookRequestRepository bookRequestRepository)
        {
            _BookRequestRepository=bookRequestRepository;
        }


        [HttpPost]

        public async Task<IActionResult>AddNewRequest(BookRequestModel bookRequestModel)
        {
            var data=await _BookRequestRepository.BookRequestAsync(bookRequestModel);
            return Ok(data);
        }
    }
}
