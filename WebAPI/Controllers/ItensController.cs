using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
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

        [Authorize(Roles = "Admin,ItemCreator")]
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
                CreateDate = DateTime.UtcNow,
                IsActive = true,
                InAnalysis = false
            };

            _context.Items.Add(newItem);
            await _context.SaveChangesAsync();

            return Ok("Item criado com sucesso.");
        }

        [Authorize(Roles = "Admin,ItemCreator")]
        [HttpPut("edit/{id}")]
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
            item.ChangeDate = DateTime.UtcNow;
            item.ChangeUser = user;
            item.IsActive = model.IsActive;

            await _context.SaveChangesAsync();

            return Ok("Item atualizado com sucesso.");
        }

        [Authorize(Roles = "Admin,ItemCreator,ItemAnalyzer")]
        [HttpGet("exibir-itens")]
        public async Task<ActionResult<PaginatedResult<Item>>> GetActiveItems([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            // Calcula o total de itens ativos
            var totalItems = await _context.Items.CountAsync(i => i.IsActive && !i.InAnalysis);

            // Obtém os itens paginados
            var activeItems = await _context.Items
                .Where(i => i.IsActive && !i.InAnalysis)
                .OrderBy(i => i.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new
                {
                    Id = i.Id,
                    Name = i.Name,
                    UserName = i.User.UserName
                })
                .ToListAsync();

            // Cria o resultado paginado
            var result = PaginatedResult<object>.Create(totalItems, activeItems);

            // Retorna o resultado paginado
            return Ok(result);
        }

        [Authorize(Roles = "Admin,ItemCreator")]
        [HttpGet("exibir-itens-inativos")]
        public async Task<ActionResult<PaginatedResult<Item>>> GetInactiveItems([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            var totalItems = await _context.Items.CountAsync(i => !i.IsActive);

            var inactiveItems = await _context.Items
                .Where(i => !i.IsActive)
                .OrderBy(i => i.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new
                {
                    Id = i.Id,
                    Name = i.Name,
                    UserName = i.User.UserName 
                })
                .ToListAsync();

            var result = PaginatedResult<object>.Create(totalItems, inactiveItems);

            return Ok(result);
        }

        [Authorize(Roles = "Admin,ItemCreator,ItemAnalyzer")]
        [HttpGet("exibir-item/{id}")]
        public async Task<ActionResult<Item>> GetAnalysis(int id)
        {
            var item = await _context.Items
                .Where(i => i.Id == id)
                .Select(i => new
                {
                    Id = i.Id,
                    UserId = i.User.UserName,
                    Name = i.Name,
                    Code = i.Code,
                    CreateDate = i.CreateDate,
                    IsActive = i.IsActive,
                    ChangeDate = i.ChangeDate,
                    ChangeUserId = i.ChangeUser.UserName
                    
                })
                .FirstOrDefaultAsync();

            if (item == null)
            {
                return BadRequest("Item não encontrado.");
            }

            return Ok(item);
        }

        [Authorize(Roles = "Admin,ItemCreator,ItemAnalyzer")]
        [HttpGet("exibir-itens-inAnalysis")]
        public async Task<ActionResult<PaginatedResult<Item>>> GetInAnalysisItems([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            var totalItems = await _context.Items.CountAsync(i => i.InAnalysis);

            var inAnalysisItems = await _context.Items
                .Where(i => i.InAnalysis)
                .OrderBy(i => i.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new
                {
                    Id = i.Id,
                    Name = i.Name,
                    UserName = i.User.UserName
                })
                .ToListAsync();

            var result = PaginatedResult<object>.Create(totalItems, inAnalysisItems);

            return Ok(result);
        }
    }

}

