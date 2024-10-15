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


        [HttpGet("get-admin-by-id")]
        public async Task<IActionResult>GetadminDetails(int id)
        {
            var data=await _adminRepository.GetAdminByIdAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

    }



}
