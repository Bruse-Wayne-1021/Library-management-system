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
            var data=await _BookRequestRepository.AddnewBookRequestAsync(bookRequestModel);
            return Ok(data);
        }

        [HttpGet("get-all-request")]
        public async Task<IActionResult> getAllRequest()
        {
            var data = await _BookRequestRepository.GetBookRequestsAsync();
            return Ok(data);
        }


        [HttpPut("Accecpt-request")]
        //public async Task<IActionResult>UpdateStatus(int id)
        //{
        //    var data=await _BookRequestRepository.UpdateStatusAsync(id);
        //    return Ok(data);
        //}


    }
}
