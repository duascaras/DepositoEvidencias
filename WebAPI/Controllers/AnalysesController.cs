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

        [Authorize(Roles = "Admin,ItemCreator")]
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

        [Authorize(Roles = "Admin,ItemAnalyzer")]
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

        [Authorize(Roles = "Admin,ItemAnalyzer")]
        [HttpPut("Edit-Analysis/{id}")]
        public async Task<IActionResult> EditAnalysis([FromRoute] int id, [FromBody] EditAnalysisModel model)
        {

            // Busca a análise pelo ID
            var analysis = await _context.Analyses.FindAsync(id);
            if (analysis == null)
            {
                return BadRequest("Análise não encontrada.");
            }

            if (analysis.IsFinished)
            {
                return BadRequest("Esta análise já foi finalizada e não pode ser editada.");
            }

            var authUser = await _userManager.GetUserAsync(User);
            if (authUser == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            if (analysis.WrittenUser != authUser)
            {
                return BadRequest("Você não tem permissão para editar esta análise.");
            }

            // Atualiza os campos da análise com base nos dados fornecidos no modelo
            analysis.Laudo = model.Laudo;
            analysis.AnalysisType = model.AnalysisType;

            await _context.SaveChangesAsync();

            return Ok(analysis);
        }

        [Authorize(Roles = "Admin,ItemAnalyzer")]
        [HttpPut("Send-Analysis/{analysisId}")]
        public async Task<IActionResult> SendAnalysis([FromRoute] int analysisId)
        {
            var analysis = await _context.Analyses.FirstOrDefaultAsync(a => a.Id == analysisId);

            if (analysis == null)
            {
                return BadRequest("Análise não encontrada.");
            }

            var authUser = await _userManager.GetUserAsync(User);
            if (authUser == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            if (analysis.WrittenUser != authUser)
            {
                return BadRequest("Você não tem permissão para editar esta análise.");
            }

            analysis.IsFinished = true;
            analysis.SentDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(analysis);
        }

        [Authorize(Roles = "Admin,ItemCreator")]
        [HttpPut("Confirm-Analysis/{analysisId}")]
        public async Task<IActionResult> ConfirmAnalysis([FromRoute] int analysisId)
        {
            var analysis = await _context.Analyses
                             .Include(a => a.Item)
                             .FirstOrDefaultAsync(a => a.Id == analysisId);


            if (analysis == null)
            {
                return BadRequest("Análise não encontrada.");
            }

            var authUser = await _userManager.GetUserAsync(User);
            if (authUser == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            analysis.IsConfirmed = true;
            analysis.ConfirmedUser = authUser;
            analysis.ConfirmationDate = DateTime.UtcNow;

            if (analysis.Item == null)
            {
                return BadRequest("Item não encontrado.");
            }

            //Analisar se devemos colocar a logica para excluir o "Code" gerado, para limpar o banco.
            analysis.Item.InAnalysis = false;
            await _context.SaveChangesAsync();

            return Ok(analysis);
        }

        [Authorize(Roles = "Admin,ItemCreator")]
        [HttpGet("Analysis-pending-confirmed")]
        public async Task<ActionResult<IEnumerable<Analysis>>> GetFinishedAnalysis([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            var totalPending = await _context.Analyses.CountAsync(a => a.IsFinished && !a.IsConfirmed);

            var pendingAnalysis = await _context.Analyses
                .Where(a => a.IsFinished && !a.IsConfirmed)
                .OrderBy(a => a.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    Id = a.Id,
                    ItemId = a.Item.Name,
                    WrittenUserId = a.WrittenUser.UserName
                })
                .ToListAsync();

            var result = PaginatedResult<object>.Create(totalPending, pendingAnalysis);

            return Ok(result);
        }

        [Authorize(Roles = "Admin,ItemCreator,ItemAnalyzer")]
        [HttpGet("Analysis-detail/{id}")]
        public async Task<ActionResult<Analysis>> GetAnalysis(int id)
        {
            var analysis = await _context.Analyses
                .Where(a => a.Id == id)
                .Select(a => new
                {
                    Id = a.Id,
                    CreatedDate = a.CreatedDate,
                    AuthorizedUser = a.AuthorizedUser.UserName,
                    WrittenUserId = a.WrittenUser.UserName,
                    ItemId = a.Item.Name,
                    Laudo = a.Laudo,
                    AnalysisType = a.AnalysisType,
                    SentData = a.SentDate
                })
                .FirstOrDefaultAsync();

            if (analysis == null)
            {
                return BadRequest("Análise não encontrada.");
            }

            return Ok(analysis);
        }

        [Authorize(Roles = "Admin,ItemCreator,ItemAnalyzer")]
        [HttpGet("Analysis-confirmed")]
        public async Task<ActionResult<PaginatedResult<Analysis>>> GetConfirmedAnalysis([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            var totalConfirmed = await _context.Analyses.CountAsync(a => a.IsConfirmed);

            var confirmedAnalysis = await _context.Analyses
                .Where(a => a.IsConfirmed)
                .OrderBy(a => a.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    Id = a.Id,
                    ItemId = a.Item.Name,
                    WrittenUserId = a.WrittenUser.UserName,
                    ConfirmedUserId = a.ConfirmedUser.UserName
                })
                .ToListAsync();

            var result = PaginatedResult<object>.Create(totalConfirmed, confirmedAnalysis);

            return Ok(result);
        }

        [Authorize(Roles = "Admin,ItemCreator,ItemAnalyzer")]
        [HttpGet("Typing-analysis")]
        public async Task<ActionResult<PaginatedResult<Analysis>>> GetTypingAnalysis([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            var totalTyping = await _context.Analyses.CountAsync(a => !a.IsFinished);

            var typingAnalysis = await _context.Analyses
                .Where(a => !a.IsFinished)
                .OrderBy(a => a.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    Id = a.Id,
                    ItemId = a.Item.Name,
                    WrittenUserId = a.WrittenUser.UserName
                })
                .ToListAsync();

            var result = PaginatedResult<object>.Create(totalTyping, typingAnalysis);

            return Ok(result);
        }
    }
}



