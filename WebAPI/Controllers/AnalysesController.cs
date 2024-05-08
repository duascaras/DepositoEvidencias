using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Context;
using WebAPI.Entities;
using WebAPI.Model;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalysesController : ControllerBase
    {
        private readonly ApiDbContext _context;
        private readonly UserManager<ExtendedIdentityUser> _userManager;

        public AnalysesController(ApiDbContext context, UserManager<ExtendedIdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("GenerateCode/{userId}/{itemId}")]
        public async Task<IActionResult> GenerateCode([FromRoute] string userId, [FromRoute] int itemId)
        {
            //verifique se o usuário existe
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            //verifique se o item existe
            var item = await _context.Items.FindAsync(itemId);
            if (item == null)
            {
                return NotFound("Item não encontrado.");
            }

            string code = GenerateRandomCode();

            //define uma data que expira o codigo daqui 1h
            DateTime expireDate = DateTime.UtcNow.AddHours(1);

            var userItemCode = new UserItemCode
            {
                User = user,
                Item = item,
                Code = code,
                ExpireDate = expireDate
            };

            //adiciona no banco
            _context.UserItemCodes.Add(userItemCode);
            await _context.SaveChangesAsync();

            return Ok(new { Code = code });

        }
        private string GenerateRandomCode()
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Create-Analysis/{id}")]
        public async Task<IActionResult> CreateAnalysisByCode([FromRoute] string id, [FromBody] CreateAnalysisModel model)
        {
            var userItemCode = await _context.UserItemCodes
                                .Include(uic => uic.User)
                                .Include(uic => uic.Item)
                                .FirstOrDefaultAsync(uic => uic.Code == model.Code);

            if (userItemCode == null)
            {
                return NotFound("Código inválido.");
            }

            if (userItemCode.ExpireDate <= DateTime.UtcNow)
            {
                return BadRequest("O código expirou.");
            }

            // Verifica se a propriedade "InAnalysis" já está definida como true
            var item = await _context.Items.FindAsync(userItemCode.Item.Id);
            if (item.InAnalysis)
            {
                return BadRequest("O item já está em análise.");
            }


            //precisa verififcar o usuario autenticado
            var authUser = await _userManager.GetUserAsync(User);
            if (authUser == null)
            {
                return NotFound("Usuário autenticado não encontrado.");
            }

            var analysis = new Analysis
            {
                AuthorizedUser = userItemCode.User,
                Item = userItemCode.Item,
                WrittenUser = authUser,
                //Laudo = "null",
                //AnalysisType = "null",
                CreatedDate = DateTime.UtcNow,
                IsFinished = false,
                IsConfirmed = false
            };

            //cria a analise no banco
            _context.Analyses.Add(analysis);
            await _context.SaveChangesAsync();

            // Atualiza a propriedade "InAnalysis" para true na tabela de items
            item.InAnalysis = true;
            _context.Entry(item).Property(x => x.InAnalysis).IsModified = true;
            await _context.SaveChangesAsync();

            return Ok(analysis);
        }

    }

}

