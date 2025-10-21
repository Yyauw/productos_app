using System;
using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;
using productos_app_api.Models;

namespace productos_app_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Producto> Productos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Definimos las relaciones manualmente ya que no se detectan automáticamente
        modelBuilder.Entity<Producto>()
        .HasOne(p => p.UsuarioCreacion)
        .WithMany()
        .HasForeignKey(p => p.UsuarioCreacionId)
        .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Producto>()
        .HasOne(p => p.UsuarioModificacion)
        .WithMany()
        .HasForeignKey(p => p.UsuarioModificacionId)
        .OnDelete(DeleteBehavior.Restrict);
    }
}
