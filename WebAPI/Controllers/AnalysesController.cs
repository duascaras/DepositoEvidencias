﻿using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Roles = "Admin")]
        [HttpPost("Edit-Analysis/{id}")]
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

            // Salva as alterações no banco de dados
            _context.Analyses.Update(analysis);
            await _context.SaveChangesAsync();

            return Ok(analysis);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Sent-Analysis/{analysisId}")]
        public async Task<IActionResult> SentAnalysis([FromRoute] int analysisId)
        {
            var analysis = await _context.Analyses.FindAsync(analysisId);
            if (analysis == null)
            {
                return NotFound("Análise não encontrada.");
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

            // Salva as alterações no banco de dados
           

            var item = await _context.Items.FindAsync(analysis.Item);
            if (item != null)
            {
                item.InAnalysis = false;
                await _context.SaveChangesAsync();
                _context.Analyses.Update(analysis);
                await _context.SaveChangesAsync();
            }


            return Ok(analysis);
        }





    }

}

