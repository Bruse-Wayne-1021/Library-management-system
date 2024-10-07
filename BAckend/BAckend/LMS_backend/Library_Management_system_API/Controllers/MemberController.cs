using Microsoft.AspNetCore.Mvc;
using Library_Management_system_API.Models;
using Library_Management_system_API.Repository;

namespace Library_Management_system_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MemberController : ControllerBase
    {
        private readonly MemberRepository _memberRepository;


        public MemberController(MemberRepository memberRepository)
        {
            _memberRepository = memberRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddMember([FromBody] Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var memberId = await _memberRepository.CreateMemberAsync(member);
                return Ok(new { Id = memberId, Message = "Member added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMemberById(int id)
        {
            var member = await _memberRepository.GetMemberByIdAsync(id);
            if (member == null)
            {
                return NotFound();
            }
            return Ok(member);
        }

        [HttpGet("get-all-members")]

        public async Task<IActionResult> GetAllMember()
        {
            var member=await _memberRepository.GetAllMembersAsync();
            return Ok(member);
        }
    }
}
