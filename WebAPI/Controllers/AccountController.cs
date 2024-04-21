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
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager,RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _roleManager = roleManager;
        }

        [Authorize(Roles ="Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            var user = new IdentityUser
            {
                UserName = model.UserName
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


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            IdentityUser? user = await _userManager.FindByNameAsync(model.Username);

            if(user  == null)
            {
                return BadRequest("Login Inválido.");
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
        private async Task<string> CreateTokenAsync(IdentityUser user)
        {
            var role = await _userManager.GetRolesAsync(user) ;
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.Role, role.First())
            };

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


