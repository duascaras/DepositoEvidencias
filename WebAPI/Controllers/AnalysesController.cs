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
            // Verifique se o usuário existe
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // Verifique se o item existe
            var item = await _context.Items.FindAsync(itemId);
            if (item == null)
            {
                return NotFound("Item não encontrado.");
            }

            // Gere uma string aleatória para o código
            string code = GenerateRandomCode();

            // Defina a data de expiração para 1 hora a partir do momento atual
            DateTimeOffset expireDate = DateTimeOffset.Now.AddHours(1);

            // Crie um novo objeto UserItemCode
            var userItemCode = new UserItemCode
            {
                User = user,
                Item = item,
                Code = code,
                ExpireDate = expireDate
            };

            // Adicione o objeto ao contexto do banco de dados e salve as alterações
            _context.UserItemCodes.Add(userItemCode);
            await _context.SaveChangesAsync();

            // Retorne o código gerado
            return Ok(new { Code = code });

        }
        private string GenerateRandomCode()
        {
            // Aqui você pode implementar a lógica para gerar uma string aleatória, por exemplo:
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


            // Verifique se o usuário autenticado existe
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return NotFound("Usuário autenticado não encontrado.");
            }

            // Obtém o item correspondente ao código
            
            if (userItemCode.Item == null)
            {
                return NotFound("Item associado ao código não encontrado.");
            }


            // Crie uma nova análise com os IDs do usuário, do item e do usuário autenticado
            var newAnalysis = new Analysis
            {
                AuthorizedUser = userItemCode.User,
                Item = userItemCode.Item,
                WrittenUser = currentUser,
                Laudo = "null",
                AnalysisType = "null",
                CreatedDate = DateTime.Now,
                IsFinished = false,
                IsConfirmed = false
            };

            // Adicione a nova análise ao contexto do banco de dados e salve as alterações
            _context.Analyses.Add(newAnalysis);
            await _context.SaveChangesAsync();

            // Retorne a análise recém-criada
            return Ok(newAnalysis);
        }









    }

}

