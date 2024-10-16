using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Models;
using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_system_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordController : ControllerBase
    {
        private readonly BorrowedHistoryRepository _borrowedHistoryRepository;

        public RecordController(BorrowedHistoryRepository borrowedHistoryRepository)
        {
            _borrowedHistoryRepository = borrowedHistoryRepository;
        }

        [HttpPost] 
        public async Task<IActionResult> AddRecord([FromBody]BorrowedHistoryRequestModel borrowedHistoryRequestModel)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var data = await _borrowedHistoryRepository.AddBorrowedHistoryAsync(borrowedHistoryRequestModel);
                return Ok(data);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]

        public async Task<IActionResult> GetallRecords()
        {
            var data = await _borrowedHistoryRepository.GetAllRecords();
            return Ok(data);
        
          
        }
    }
}
