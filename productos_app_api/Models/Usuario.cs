using System;

namespace productos_app_api.Models;

public enum RolUsuario
{
    Admin = 1,
    Usuario = 2
}
public class Usuario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Nombre { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public List<Producto>? Productos { get; set; }
    public RolUsuario Rol { get; set; } = RolUsuario.Usuario;

}
