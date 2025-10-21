using System;
using productos_app_api.Models;

namespace productos_app_api.Data.Seeders;

public class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Usuarios.Any())
        {
            //ENCRIPTAMOS LAS CONTRASEÑAS DE LOS USUARIOS
            var claveEncriptadaAdmin = BCrypt.Net.BCrypt.HashPassword("123456");
            var claveEncriptadaUsuario = BCrypt.Net.BCrypt.HashPassword("abcdef");

            //SEEDER DE LOS USUARIOS
            var admin = new Usuario
            {
                Nombre = "Admin",
                Email = "admin@example.com",
                Password = claveEncriptadaAdmin,
                Rol = RolUsuario.Admin
            };

            var usuario = new Usuario
            {
                Nombre = "Usuario",
                Email = "usuario@example.com",
                Password = claveEncriptadaUsuario,
                Rol = RolUsuario.Usuario
            };

            context.Usuarios.AddRange(admin, usuario);
            context.SaveChanges();

            //SEEDER DE LOS PRODUCTOS
            var productos = new List<Producto>
            {
                new Producto { Nombre = "Monitor LG 27", Descripcion = "Monitor IPS de alta resolución", Precio = 350.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Monitor Samsung 24", Descripcion = "Monitor LED Full HD", Precio = 250.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Teclado Mecánico Corsair", Descripcion = "Teclado RGB con switches Cherry MX", Precio = 120.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Mouse Logitech G502", Descripcion = "Mouse gaming con sensor de alta precisión", Precio = 80.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Auriculares HyperX Cloud II", Descripcion = "Auriculares con micrófono y sonido envolvente", Precio = 90.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "SSD Samsung 1TB", Descripcion = "Disco sólido NVMe de alto rendimiento", Precio = 150.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Memoria RAM Corsair 16GB", Descripcion = "DDR4 3200MHz", Precio = 75.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Placa Madre ASUS B550", Descripcion = "Placa madre AM4 compatible con Ryzen", Precio = 180.00m, Estado = false, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Procesador AMD Ryzen 7 5800X", Descripcion = "8 núcleos y 16 hilos", Precio = 400.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Fuente de Poder EVGA 650W", Descripcion = "Certificación 80 Plus Gold", Precio = 95.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Gabinete NZXT H510", Descripcion = "Gabinete compacto ATX con vidrio templado", Precio = 85.00m, Estado = false, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Monitor Acer 32", Descripcion = "Monitor curvo 2K", Precio = 400.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Mousepad SteelSeries QcK", Descripcion = "Mousepad de tela de alta precisión", Precio = 20.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Webcam Logitech C920", Descripcion = "1080p Full HD", Precio = 70.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Tarjeta de Video NVIDIA RTX 3060", Descripcion = "12GB GDDR6, Ray Tracing", Precio = 600.00m, Estado = false, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Refrigeración Líquida Corsair", Descripcion = "Cooler para CPU con LED RGB", Precio = 120.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Disco Duro WD 2TB", Descripcion = "HDD SATA 7200RPM", Precio = 65.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Monitor BenQ 27", Descripcion = "Monitor IPS para diseño gráfico", Precio = 330.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Auriculares Sony WH-1000XM4", Descripcion = "Auriculares inalámbricos con cancelación de ruido", Precio = 300.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now },
                new Producto { Nombre = "Teclado Logitech K380", Descripcion = "Teclado Bluetooth compacto", Precio = 40.00m, Estado = true, UsuarioCreacionId = admin.Id, FechaCreacion = DateTime.Now }
            };

            context.Productos.AddRange(productos);
            context.SaveChanges();
        }
    }
}
