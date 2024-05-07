using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebAPI.Context;
using WebAPI.Entities;
using WebAPI.Model;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItensController : ControllerBase
    {
        private readonly ApiDbContext _context;
        private readonly UserManager<ExtendedIdentityUser> _userManager;

        public ItensController(ApiDbContext context, UserManager<ExtendedIdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("create-item")]
        public async Task<IActionResult> CreateItem(ItemCreateModel model)
        {
            var user = await _userManager.GetUserAsync(User);
            var existingItem = await _context.Items.FirstOrDefaultAsync(i => i.Code == model.Code);

            if (existingItem != null)
            {
               return BadRequest("Código já existente.");
            }

            var newItem = new Item
            {
                User = user,
                Name = model.Name,
                Code = model.Code,
                CreateDate = DateTime.Now,
                IsActive = true,
                InAnalysis = false
            };

            _context.Items.Add(newItem);
            await _context.SaveChangesAsync();

            return Ok("Item criado com sucesso.");
        }

        [HttpPost("edit/{Id}")]
        public async Task<IActionResult> EditItem([FromRoute] int id, ItemEditModel model)
        {
            var user = await _userManager.GetUserAsync(User);

            Item? item = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
            {
                return NotFound("Item não encontrado.");
            }
            
            // Verifica se o novo código já está em uso por outro item
            if (model.Code != item.Code)
            {
                var codeExists = await _context.Items.AnyAsync(i => i.Code == model.Code);
                if (codeExists)
                {
                    return BadRequest("Código já existente.");
                }
            }

            item.Name = model.Name;
            item.Code = model.Code;
            item.ChangeDate = DateTime.Now;
            item.ChangeUser = user;
            item.IsActive = model.IsActive;

            await _context.SaveChangesAsync();

            return Ok("Item atualizado com sucesso.");
        }

        [HttpGet("exibir-itens")]
        public async Task<ActionResult<IEnumerable<Item>>> GetItens()
        {
            return await _context.Items.Include(x => x.User).ToListAsync();
        }

    }
}
