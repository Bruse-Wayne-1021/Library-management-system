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
        //add new member
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
        //get memeber by id
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


        //get all members
        [HttpGet("get-all-members")]
        public async Task<IActionResult> GetAllMember()
        {
            var member=await _memberRepository.GetAllMembersAsync();
            return Ok(member);
        }

        //delete member by id

        [HttpDelete("{id}")]

        public async Task<IActionResult>DeleteMember(int id)
        {
            var result=await _memberRepository.DeleteMembersAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        //update member

        [HttpPut("id")]

        public async Task<IActionResult>UpdateMembers(int id, Member member)
        {

              var update=await _memberRepository.UpdateMemebrAsync(member);
            var updatedmember = await _memberRepository.GetMemberByIdAsync(id);
            return Ok(updatedmember);

        }
    }
}
