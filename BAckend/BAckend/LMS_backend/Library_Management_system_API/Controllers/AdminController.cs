using Library_Management_system_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_system_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminRepository _adminRepository;

        public AdminController(AdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }


        //[HttpGet("get-admin-by-id")]
        //public async Task<IActionResult>GetadminDetails()
        //{
        //    var data=await _adminRepository.GetAdminByIdAsync();
        //    if (data == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(data);
        //}
        [HttpGet]

        public async Task<IActionResult> GetAdmin()
        {
            var data = await _adminRepository.GetAdminAsync();
            return Ok(data);
        }


        [HttpGet("LOGIN")]

        public async Task<IActionResult> login(string nic, string password)
        {
            try
            {
                var data = await _adminRepository.LoginAdminasync(nic, password);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }



}
