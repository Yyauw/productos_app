using System;
using productos_app_api.Models;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace productos_app_api.Documents;

public class InvoiceDocument : IDocument
{
    public InvoiceModel Model { get; }

    public InvoiceDocument(InvoiceModel model)
    {
        Model = model;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;
    public DocumentSettings GetSettings() => DocumentSettings.Default;

    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Margin(50);

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);

                page.Footer().AlignCenter().Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
    }

    void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item()
                    .Text($"Reporte #{Model.NroReporte}")
                    .FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);

                column.Item().Text(text =>
                 {
                     text.Span("Fecha: ").SemiBold();
                     text.Span($"{DateTime.Now:d}");
                 });
                column.Item().Text(text =>
                 {
                     text.Span("Desde: ").SemiBold();
                     text.Span($"{Model.Direccion.Empresa}, {Model.Direccion.Calle}, {Model.Direccion.Ciudad}");
                 });
                column.Item().Text(text =>
                {
                    text.Span("Email: ").SemiBold();
                    text.Span($"{Model.Direccion.Email}");
                });
                column.Item().Text(text =>
                {
                    text.Span("Telefono: ").SemiBold();
                    text.Span($"{Model.Direccion.Telefono}");
                });
            });
        });
    }

    void ComposeContent(IContainer container)
    {
        container.PaddingVertical(40).Column(column =>
        {
            column.Spacing(5);

            column.Item().Element(ComposeTable);

            if (!string.IsNullOrWhiteSpace(Model.Comentarios))
                column.Item().PaddingTop(25).Element(ComposeComments);
        });
    }

    void ComposeTable(IContainer container)
    {
        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(25);
                columns.RelativeColumn(3);
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
            });

            table.Header(header =>
            {
                header.Cell().Element(CellStyle).Text("#");
                header.Cell().Element(CellStyle).Text("Nombre Producto");
                header.Cell().Element(CellStyle).AlignRight().Text("Precio");
                header.Cell().Element(CellStyle).AlignCenter().Text("Disponible").WordSpacing(5);
                header.Cell().Element(CellStyle).AlignRight().Text("FechaCreacion");

                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                }
            });

            foreach (var item in Model.Items)
            {
                table.Cell().Element(CellStyle).Text((Model.Items.IndexOf(item) + 1).ToString());
                table.Cell().Element(CellStyle).Text(item.Nombre);
                table.Cell().Element(CellStyle).AlignRight().Text($"{Math.Round(item.Precio, 2)}$");
                table.Cell().Element(CellStyle).AlignCenter().Text(item.Estado ? "Sí" : "No").ParagraphSpacing(5);
                table.Cell().Element(CellStyle).AlignRight().Text($"{item.FechaCreacion.ToShortDateString()}");

                static IContainer CellStyle(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                }
            }
        });
    }

    void ComposeComments(IContainer container)
    {
        container.Background(Colors.Grey.Lighten3).Padding(10).Column(column =>
        {
            column.Spacing(5);
            column.Item().Text("Notas adicionales").FontSize(14);
            column.Item().Text(Model.Comentarios);
        });
    }


}