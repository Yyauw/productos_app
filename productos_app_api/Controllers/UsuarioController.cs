using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using productos_app_api.Data;
using productos_app_api.DTOs;
using productos_app_api.Models;
using productos_app_api.Services;
using BCrypt.Net;

namespace productos_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly JwtService _jwtService;
        public UsuarioController(AppDbContext dbContext, JwtService jwtService)
        {
            this.dbContext = dbContext;
            _jwtService = jwtService;
        }


        //****************************************ENDPOINTS USUARIOS****************************************//

        // **************************************************
        // ************  OBTENER TODO LOS USUARIOS  **************
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetUsuarios()
        {
            var usuarios = dbContext.Usuarios.ToList();
            // Lógica para obtener la lista de usuarios
            return Ok(usuarios);
        }

        // **************************************************
        // ************  LOGIN USUARIO  **************
        [HttpPost("login")]
        public IActionResult LoginUsuario([FromBody] LoginDto loginDto)
        {
            //VERIFICA QUE LOS DATOS SEAN VALIDOS
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //VALIDACION MEDIANTE BCRYPT
            var usuario = dbContext.Usuarios.FirstOrDefault(u => u.Email == loginDto.Email);
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, usuario.Password))
            {
                return Unauthorized("Credenciales inválidas");
            }
            var token = _jwtService.GenerateToken(usuario);
            return Ok(new { msg = "login exitoso", token });
        }

        // **************************************************
        // ************  REGISTRO USUARIO  **************
        [HttpPost("registro")]
        public IActionResult CreateUsuario([FromBody] Usuario nuevoUsuario)
        {
            //ENCRIPTAMOS LA CONTRASEÑA
            var claveEncriptada = BCrypt.Net.BCrypt.HashPassword(nuevoUsuario.Password);

            // Lógica para crear un nuevo usuario
            var usuarioAAgregar = new Usuario
            {
                Nombre = nuevoUsuario.Nombre,
                Email = nuevoUsuario.Email,
                Password = claveEncriptada,
                Rol = nuevoUsuario.Rol
            };
            dbContext.Usuarios.Add(usuarioAAgregar);
            dbContext.SaveChanges();
            var token = _jwtService.GenerateToken(usuarioAAgregar);
            return Ok(new { msg = "registro exitoso", token });
        }


    }
}
