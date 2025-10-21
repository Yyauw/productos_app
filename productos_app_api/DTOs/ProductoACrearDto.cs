using System;

namespace productos_app_api.DTOs;

public class ProductoACrearDto
{
    public required string Nombre { get; set; }
    public string? Descripcion { get; set; }
    public required decimal Precio { get; set; }
    public required bool Estado { get; set; }
}
