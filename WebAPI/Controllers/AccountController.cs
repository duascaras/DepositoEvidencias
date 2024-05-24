using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        [HttpPut("edit-user")]
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

        [HttpPut("edit-password-admin")]
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

        [HttpPut("edit-password-user")]
        public async Task<IActionResult> EditUserPasswordOwn(EditOwnerPasswordModel model)
        {
            var authUser = await _userManager.GetUserAsync(User);
            if (authUser == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            var passwordVerificationResult = _userManager.PasswordHasher.VerifyHashedPassword(authUser, authUser.PasswordHash, model.CurrentPassword);
            if (passwordVerificationResult != PasswordVerificationResult.Success)
            {
                return BadRequest("A senha atual está incorreta.");
            }

            if (model.NewPassword != model.ConfirmedPassword)
            {
                return BadRequest("A nova senha e a confirmação precisam ser iguais.");
            }

            // Tentar alterar a senha do usuário
            var changePasswordResult = await _userManager.ChangePasswordAsync(authUser, model.CurrentPassword, model.NewPassword);
            if (!changePasswordResult.Succeeded)
            {
                return BadRequest("Erro ao redefinir senha.");
            }

            return Ok("Senha alterada com sucesso.");
        }

        // A ver se continuará assim
        // Talvez eu junte o inativar com o edit-user, depende de o que ficar melhor no front
        // Ficaria igual o edit do item
        [HttpPut("desativar-ativar-usuario")]
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
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        [HttpGet("get-users-active")]
        public async Task<IActionResult> GetAllUsers(int pageNumber = 1, int pageSize = 5)
        {
            var usersQuery = _userManager.Users.Where(user => user.IsActive);

            var totalUsers = await usersQuery.CountAsync();
            var users = await usersQuery.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            var userDetailsList = new List<object>();

            foreach (var user in users)
            {
                var userRole = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
                var userDetails = new
                {
                    user.Id,
                    user.UserName,
                    Role = userRole
                };
                userDetailsList.Add(userDetails);
            }

            return Ok(new
            {
                TotalUsers = totalUsers,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Users = userDetailsList
            });
        }

        [HttpGet("get-users-inactive")]
        public async Task<IActionResult> GetAllUsersInactive(int pageNumber = 1, int pageSize = 5)
        {
            var usersQuery = _userManager.Users.Where(user => !user.IsActive);

            var totalUsers = await usersQuery.CountAsync();
            var users = await usersQuery.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            var userDetailsList = new List<object>();

            foreach (var user in users)
            {
                var userRole = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
                var userDetails = new
                {
                    user.Id,
                    user.UserName,
                    Role = userRole
                };
                userDetailsList.Add(userDetails);
            }

            return Ok(new
            {
                TotalUsers = totalUsers,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Users = userDetailsList
            });
        }

        [HttpGet("get-user/{id}")]
        public async Task<ActionResult<ExtendedIdentityUser>> GetUser(string id)
        {
            
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            
            var userDetails = new
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles
            };

            return Ok(userDetails);
        }
    }
}


