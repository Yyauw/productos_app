using System;

namespace productos_app_api.DTOs;

public class ProductoDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = "";
    public string? Descripcion { get; set; }
    public decimal Precio { get; set; }
    public bool Estado { get; set; }
    public Guid UsuarioCreacionId { get; set; }
    public UsuarioDto? UsuarioCreacion { get; set; }
    public DateTime FechaCreacion { get; set; }
    public Guid? UsuarioModificacionId { get; set; }
    public DateTime? FechaModificacion { get; set; }
}

public class UsuarioDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = "";
    public string Email { get; set; } = "";
}
