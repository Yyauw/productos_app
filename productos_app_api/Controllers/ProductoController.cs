using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using productos_app_api.Data;
using productos_app_api.DTOs;
using productos_app_api.Models;

namespace productos_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        public ProductoController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        //****************************************ENDPOINTS PRODUCTOS****************************************//

        // **************************************************
        // ************  OBTENER TODO LOS PRODUCTOS  **************
        [HttpGet]
        public async Task<IActionResult> GetProductos()
        {
            //HACEMOS "POPULATE" AL PRODUCTO
            var productos = await dbContext.Productos
                .Include(p => p.UsuarioCreacion)
                .Include(p => p.UsuarioModificacion)
                .Select(p => new ProductoDto
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    Precio = p.Precio,
                    Estado = p.Estado,
                    UsuarioCreacionId = p.UsuarioCreacionId,
                    UsuarioCreacion = p.UsuarioCreacion == null ? null : new UsuarioDto
                    {
                        Id = p.UsuarioCreacion.Id,
                        Nombre = p.UsuarioCreacion.Nombre,
                        Email = p.UsuarioCreacion.Email
                    },
                    FechaCreacion = p.FechaCreacion,
                    UsuarioModificacionId = p.UsuarioModificacionId,
                    FechaModificacion = p.FechaModificacion
                })
                .ToListAsync();

            return Ok(productos);
        }

        // **************************************************
        // ************  OBTENER PRODUCTO POR ID  **************
        [HttpGet("{id}")]
        public IActionResult GetProducto(string id)
        {
            // VERIFICAMOS SI EXISTE
            if (!Guid.TryParse(id, out Guid productoId))
                return BadRequest("ID inválido");

            //HACEMOS "POPULATE" AL PRODUCTO
            var producto = dbContext.Productos
            .Include(p => p.UsuarioCreacion)
            .Include(p => p.UsuarioModificacion)
            .Where(p => p.Id == productoId)
            .Select(p => new ProductoDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                Precio = p.Precio,
                Estado = p.Estado,
                UsuarioCreacionId = p.UsuarioCreacionId,
                UsuarioCreacion = p.UsuarioCreacion == null ? null : new UsuarioDto
                {
                    Id = p.UsuarioCreacion.Id,
                    Nombre = p.UsuarioCreacion.Nombre,
                    Email = p.UsuarioCreacion.Email
                },
                FechaCreacion = p.FechaCreacion,
                UsuarioModificacionId = p.UsuarioModificacionId,
                FechaModificacion = p.FechaModificacion
            })
            .FirstOrDefault();
            if (producto == null)
            {
                return NotFound();
            }
            return Ok(producto);
        }

        // **************************************************
        // ************  CREAR PRODUCTO  **************
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateProducto([FromBody] ProductoACrearDto nuevoProducto)
        {
            //OBTIENE EL ID DEL USUARIO DESDE EL TOKEN
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            Guid userId = Guid.Parse(userIdClaim);

            //VERIFICA QUE LOS DATOS SEAN VALIDOS
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Lógica para crear un nuevo producto
            var productoAAgregar = new Producto
            {
                Nombre = nuevoProducto.Nombre,
                Descripcion = nuevoProducto.Descripcion,
                Precio = nuevoProducto.Precio,
                Estado = nuevoProducto.Estado,
                UsuarioCreacionId = userId,
                FechaCreacion = DateTime.Now
            };
            dbContext.Productos.Add(productoAAgregar);
            dbContext.SaveChanges();

            return Ok(new { msg = "producto agregado", data = productoAAgregar });
        }

        // **************************************************
        // ************  ACTUALIZAR PRODUCTO  **************
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateProducto(string id, [FromBody] ProductoACrearDto productoActualizado)
        {
            //OBTIENE EL ID DEL USUARIO DESDE EL TOKEN
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            Guid userId = Guid.Parse(userIdClaim);

            //VERIFICA QUE LOS DATOS SEAN VALIDOS
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //BUSCAMPOS EL PRODUCTO A ACTUALIZAR
            var productoExistente = dbContext.Productos.Find(Guid.Parse(id));
            if (productoExistente == null)
            {
                return NotFound();
            }
            //ACTUALIZA LOS CAMPOS DEL PRODUCTO
            productoExistente.Nombre = productoActualizado.Nombre;
            productoExistente.Descripcion = productoActualizado.Descripcion;
            productoExistente.Precio = productoActualizado.Precio;
            productoExistente.Estado = productoActualizado.Estado;
            productoExistente.UsuarioModificacionId = userId;
            productoExistente.FechaModificacion = DateTime.Now;

            dbContext.SaveChanges();

            return Ok(new { msg = "producto actualizado", data = productoExistente });
        }

        // **************************************************
        // ************  BORRAR PRODUCTO  **************
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteProducto(string id)
        {
            var producto = dbContext.Productos.Find(Guid.Parse(id));
            if (producto == null)
            {
                return NotFound();
            }
            dbContext.Productos.Remove(producto);
            dbContext.SaveChanges();
            return Ok(new { msg = "producto eliminado", data = producto });
        }
    }
}
