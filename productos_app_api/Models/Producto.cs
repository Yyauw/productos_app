using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace productos_app_api.Models;

public class Producto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Nombre { get; set; }
    public string? Descripcion { get; set; }
    public required decimal Precio { get; set; }
    public required bool Estado { get; set; }
    public required Guid UsuarioCreacionId { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public Guid? UsuarioModificacionId { get; set; }
    public DateTime? FechaModificacion { get; set; }
    public  Usuario? UsuarioCreacion { get; set; }
    public  Usuario? UsuarioModificacion { get; set; }
}
