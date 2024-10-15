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
        public async Task<IActionResult> addNewBookimage(ImageRequestModel imageRequest)
        {
            var data=await _bookImageRepository.AddNewBookImgAsync(imageRequest);
            return View(data);
        }


    }
}
