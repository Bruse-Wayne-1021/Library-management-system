using Library_Management_system_API.Model.RequestModel;
using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_system_API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class BookimageController : Controller
    {
        private readonly BookImageRepository _bookImageRepository;

        public BookimageController(BookImageRepository bookImageRepository)
        {
            _bookImageRepository = bookImageRepository;
        }


        //add new book image
        [HttpPost]
        public async Task<IActionResult> AddBookImage([FromBody] ImageRequestModel imageRequestModel)
        {
            // Log the incoming request for debugging
            Console.WriteLine($"Received ImagePath: {imageRequestModel?.ImagePath}, Isbn: {imageRequestModel?.Isbn}");

            if (imageRequestModel == null ||
                string.IsNullOrWhiteSpace(imageRequestModel.ImagePath) ||
                imageRequestModel.Isbn <= 0)
            {
                return BadRequest("Invalid image data.");
            }

            try
            {
                await _bookImageRepository.AddNewBookImgAsync(imageRequestModel);
                return Ok("Image added successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here for brevity)
                return StatusCode(500, "An error occurred while adding the image: " + ex.Message);
            }
        }



    }
}
