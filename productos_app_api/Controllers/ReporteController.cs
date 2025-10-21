using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using productos_app_api.Data;
using productos_app_api.Documents;
using productos_app_api.Models;
using QuestPDF.Fluent;

namespace productos_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        public ReporteController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // ****************************************ENDPOINTS REPORTES****************************************// 

        [HttpGet("descargar-pdf")]
        [Authorize(Roles = "Admin")]
        public IActionResult DownloadInvoice()
        {
            var productos = dbContext.Productos.ToList();
            var model = new InvoiceModel
            {
                NroReporte = 1,
                Direccion = new Address
                {
                    Empresa = "Mi Empresa S.A.",
                    Calle = "Calle Falsa 123",
                    Ciudad = "Ciudad",
                    Estado = "Estado",
                    Email = "ejemplo@gmail.com",
                    Telefono = "+1234567890"
                },
                Items = productos,
                Comentarios = "Reporte de productos generado el " + DateTime.Now.ToString("dd/MM/yyyy")
            };
            var invoiceDocument = new InvoiceDocument(model);
            var pdfBytes = invoiceDocument.GeneratePdf();
            return File(pdfBytes, "application/pdf", "Reporte.pdf");
        }
    }
}
