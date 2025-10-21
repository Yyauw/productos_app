using System;

namespace productos_app_api.Models;

public class InvoiceModel
{
    public int NroReporte { get; set; }
    public required Address Direccion { get; set; }
    public required List<Producto> Items { get; set; }
    public string? Comentarios { get; set; }
}

public class Address
{
    public required string Empresa { get; set; }
    public string? Calle { get; set; }
    public string? Ciudad { get; set; }
    public string? Estado { get; set; }
    public required string Email { get; set; }
    public required string Telefono { get; set; }
}
