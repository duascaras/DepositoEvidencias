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
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            var user = new IdentityUser
            {
                UserName = model.UserName
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                //await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok();
            }

            return BadRequest("Senha invalida");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            IdentityUser? user = await _userManager.FindByNameAsync(model.Username);

            if(user  == null)
            {
                return BadRequest("Login Invalido");
            }

            var result = await _signInManager.PasswordSignInAsync(
                model.Username, model.Password, model.RememberMe, false);

            if (result.Succeeded)
            {
                string token = CreateToken(user);
                return Ok(token);
            }

            return BadRequest("Login invalido");
        }
        private string CreateToken(IdentityUser user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!)
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


