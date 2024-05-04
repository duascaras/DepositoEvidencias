using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebAPI.Entities;
using WebAPI.Model;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ExtendedIdentityUser> _userManager;
        private readonly SignInManager<ExtendedIdentityUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<ExtendedIdentityUser> userManager, SignInManager<ExtendedIdentityUser> signInManager,RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _roleManager = roleManager;
        }

        //[Authorize(Roles ="Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            var user = new ExtendedIdentityUser
            {
                UserName = model.UserName,
                IsActive = true
                
            };

            if (string.IsNullOrEmpty(model.RoleName))
            {
                return BadRequest("A role é obrigatoria."); 
            }

            if (!await _roleManager.RoleExistsAsync(model.RoleName))
            {
                return BadRequest($"A role '{model.RoleName}' não existe.");
            }

            if (await _userManager.FindByNameAsync(model.UserName) != null)
            {
                return BadRequest("Usuario já cadastrado.");
            }

            try
            {
                await _userManager.CreateAsync(user, model.Password);
                await _userManager.AddToRoleAsync(user, model.RoleName);
                
            }
            catch 
            {
                return BadRequest("Senha Inválida.");
            }

            return Ok("criado e adicionado a role");

        }

        [Authorize(Roles = "Admin")]
        [HttpPost("edit-user")]
        public async Task<IActionResult> EditUser(EditUserModel model)
        {
            ExtendedIdentityUser user = await _userManager.FindByNameAsync(model.Username);
            var userRoles = await _userManager.GetRolesAsync(user);

            if (user == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            if (!await _roleManager.RoleExistsAsync(model.RoleName))
            {
                return BadRequest($"A role '{model.RoleName}' não existe.");
            }
            if (userRoles.Contains(model.RoleName))
            {
                return BadRequest("Escolha uma role diferente da atual.");
            }
            //remove atual
            var roles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, roles);

            //adiciona a nova
            await _userManager.AddToRoleAsync(user, model.RoleName);
            

            return Ok("Role do usuário atualizada com sucesso.");
        }

        [HttpPost("edit-password")]
        public async Task<IActionResult> EditUserPassword(EditUserPasswordModel model)
        {
            
            // Encontrar o usuário pelo nome de usuário
            ExtendedIdentityUser user = await _userManager.FindByNameAsync(model.Username);

            if (user == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            // Verificar se a nova senha e a senha confirmada correspondem
            if (model.NewPassword != model.ConfirmedPassword)
            {
                return BadRequest("A nova senha e a confirmação de senha não correspondem.");
            }

            // Verificar se a nova senha é fornecida
            if (string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest("Nova senha não fornecida.");
            }

            // Gerar um token de redefinição de senha
            string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Redefinir a senha
            var resetPasswordResult = await _userManager.ResetPasswordAsync(user, resetToken, model.NewPassword);

            // Verificar se a redefinição de senha foi bem-sucedida
            if (!resetPasswordResult.Succeeded)
            {
                return BadRequest("Erro ao redefinir a senha.");
            }

            // Se chegou até aqui, a senha do usuário foi atualizada com sucesso
            return Ok("Senha do usuário atualizada com sucesso.");
        }

        //A ver se continuará assim
        //Talvez eu junte o inativar com o edit-user, depende de o que ficar melhor no front
        //Ficaria igual o edit do item
        [HttpPost("desativar-ativar-usuario")]
        public async Task<IActionResult> ToggleUserActivation(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return BadRequest("Usuário não encontrado.");
            }

            user.IsActive = !user.IsActive;

            var result = await _userManager.UpdateAsync(user);

            if (user.IsActive)
            {
                return Ok("Usuário ativado com sucesso.");
            }
            else
            {
                return Ok("Usuário inativado com sucesso.");
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            ExtendedIdentityUser? user = await _userManager.FindByNameAsync(model.Username);

            if(user  == null)
            {
                return BadRequest("Login Inválido.");
            }

            if (!user.IsActive)
            {
                return BadRequest("Usuário não está ativo.");
            }

            var result = await _signInManager.PasswordSignInAsync(
                model.Username, model.Password, model.RememberMe, false);

            if (result.Succeeded)
            {
                string token = await CreateTokenAsync(user);
                return Ok(token);
            }

            return BadRequest("Login Inválido.");
        }
        private async Task<string> CreateTokenAsync(ExtendedIdentityUser user)
        {
            var role = await _userManager.GetRolesAsync(user);
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
            };

            if (role.Any())
            {
                claims.Add(new Claim(ClaimTypes.Role, role.First()));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!)); ;

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }


    }
}


