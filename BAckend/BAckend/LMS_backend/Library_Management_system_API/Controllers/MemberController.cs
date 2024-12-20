﻿using Microsoft.AspNetCore.Mvc;
using Library_Management_system_API.Models;
using Library_Management_system_API.Repository;
using Microsoft.Data.SqlClient;

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
        [HttpPost]
        public async Task<IActionResult> AddMember([FromBody] Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // This will return detailed validation error info
            }

            try
            {
                var memberId = await _memberRepository.CreateMemberAsync(member);
                return Ok(new { Id = memberId, Message = "Member added successfully" });
            }
            catch (SqlException sqlEx)
            {
                // Log sqlEx for database-specific errors
                return StatusCode(500, $"Database error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Log ex for general server errors
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
            var member = await _memberRepository.GetAllMembersAsync();
            return Ok(member);
        }

        //delete member by id

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteMember(int id)
        {
            var result = await _memberRepository.DeleteMembersAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        //update member
        [HttpPut("{nic}")]
        public async Task<IActionResult> UpdateMemberByNic(string nic, Member member)
        {
            try
            {
                // First, check if the member exists by NIC
                var existingMember = await _memberRepository.GetMemberByNicAsync(nic);
                if (existingMember == null)
                {
                    return NotFound("Member not found.");
                }

                // If member exists, perform the update
                var userUpdate = await _memberRepository.UpdateMemberAsync(nic, member);
                if (userUpdate)
                {
                    return Ok("Member updated successfully.");
                }
                else
                {
                    return BadRequest("Member update failed.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("login")]

        public async Task<IActionResult> LoginMember(string nic, string password)
        {
            try
            {
                var data = await _memberRepository.Login(nic, password);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
