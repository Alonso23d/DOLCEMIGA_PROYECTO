import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ReporteVentas, ReporteProductos } from '../features/dashboard/services/reportesService';

// Extendemos la interfaz para evitar errores de TS con el plugin
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: { finalY: number };
}

export const pdfGenerator = {
  
  // --- 1. REPORTE DE VENTAS (General) ---
  generarPDFVentas(datos: ReporteVentas): void {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const colorPrimario = [136, 19, 55]; // #881337

    // Encabezado
    doc.setFontSize(22);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text('Dolce Miga', 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text('Reporte de Ventas', 14, 28);

    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 35);
    doc.text(`Período: ${new Date(datos.fechaInicio).toLocaleDateString()} al ${new Date(datos.fechaFin).toLocaleDateString()}`, 14, 40);

    // Resumen (Cajas)
    doc.setDrawColor(200);
    doc.setFillColor(245, 245, 245);
    doc.rect(14, 45, 60, 20, 'F'); 
    doc.rect(80, 45, 60, 20, 'F'); 

    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text('Total Ventas', 19, 52);
    doc.text('Total Pedidos', 85, 52);

    doc.setFontSize(14);
    doc.setTextColor(0);
    
    doc.setFont("helvetica", "bold");
    doc.text(`S/. ${datos.totalVentas.toFixed(2)}`, 19, 60);
    doc.text(`${datos.totalPedidos}`, 85, 60);
    doc.setFont("helvetica", "normal");

    let currentY = 75;

    // Tabla de Productos Más Vendidos
    if (datos.productosVendidos.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
      doc.text('Top Productos Vendidos', 14, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Producto', 'Cant.', 'Total']],
        body: datos.productosVendidos.slice(0, 10).map((p) => [
          p.nombre,
          p.cantidadVendida,
          `S/. ${p.totalVendido.toFixed(2)}`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [136, 19, 55] },
        styles: { fontSize: 9 },
      });

      currentY = doc.lastAutoTable.finalY + 15;
    }

    // Tabla Detalle de Pedidos
    doc.setFontSize(12);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text('Detalle de Pedidos', 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [['ID', 'Fecha', 'Cliente', 'Estado', 'Total']],
      body: datos.pedidos.map((pedido) => [
        `#${pedido.id}`,
        new Date(pedido.fecha).toLocaleDateString(),
        pedido.cliente.nombres,
        pedido.estado,
        `S/. ${pedido.total.toFixed(2)}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [60, 60, 60] },
      styles: { fontSize: 8 },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 3) {
            const estado = data.cell.raw as string;
            if (estado === 'pendiente') data.cell.styles.textColor = [234, 88, 12];
            if (estado === 'completado') data.cell.styles.textColor = [22, 163, 74];
        }
      }
    });

    doc.save(`Reporte_Ventas_${datos.fechaInicio || 'General'}.pdf`);
  },

  // --- 2. REPORTE DE INVENTARIO (General) ---
  generarPDFProductos(datos: ReporteProductos): void {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const colorPrimario = [136, 19, 55];

    // Encabezado
    doc.setFontSize(22);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text('Dolce Miga', 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text('Reporte de Inventario Actual', 14, 28);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 35);

    // Resumen
    const resumen = [
        [`Total Productos: ${datos.productos.length}`, `Valor Inventario: S/. ${datos.valorTotalInventario.toFixed(2)}`],
        [`Stock Total: ${datos.stockTotal} uds`, `Alertas Stock Bajo: ${datos.productosStockBajo.length}`]
    ];

    autoTable(doc, {
        startY: 45,
        body: resumen,
        theme: 'plain',
        styles: { fontSize: 10, fontStyle: 'bold' }
    });

    // Tabla Principal de Inventario
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Producto', 'Categoría', 'Precio', 'Stock', 'Valor Total']],
      body: datos.productos.map((p) => [
        p.nombre,
        p.categoria,
        `S/. ${p.precio.toFixed(2)}`,
        p.stock,
        `S/. ${(p.stock * p.precio).toFixed(2)}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [136, 19, 55] },
      styles: { fontSize: 9, valign: 'middle' },
      
      didParseCell: function(data) {
        if (data.section === 'body') {
            const rawRow = data.row.raw as any[];
            const stock = Number(rawRow[3]); 
            
            if (stock < 10) {
                data.cell.styles.fillColor = [255, 241, 242];
                data.cell.styles.textColor = [190, 18, 60];
            }
        }
      }
    });

    doc.save(`Inventario_DolceMiga_${new Date().toLocaleDateString()}.pdf`);
  },

  // --- 3. COMPROBANTE DE VENTA (Individual) ---
  generarComprobante(pedido: any): void {
    // Usamos formato A6 (tamaño boleta pequeña)
    const doc = new jsPDF({ format: 'a6', unit: 'mm' }) as jsPDFWithAutoTable; 
    const colorPrimario = [136, 19, 55];

    // Encabezado
    doc.setFontSize(14);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text('Dolce Miga', 10, 10);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('RUC: 20123456789', 10, 14);
    doc.text('Dirección: Av. Siempre Viva 123', 10, 17);
    
    // Línea separadora
    doc.setDrawColor(200);
    doc.line(5, 20, 100, 20);

    // Datos del Cliente y Pedido
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(`Pedido: #${pedido.id}`, 10, 25);
    doc.text(`Fecha: ${new Date(pedido.fecha).toLocaleDateString()}`, 60, 25);
    
    doc.text(`Cliente: ${pedido.cliente.nombres}`, 10, 30);
    doc.text(`DNI: ${pedido.cliente.dni || '-'}`, 10, 34);

    // Tabla de productos del pedido
    autoTable(doc, {
      startY: 38,
      head: [['Cant.', 'Producto', 'Total']],
      body: pedido.productos.map((p: any) => [
        p.cantidad,
        p.nombre,
        `S/. ${p.subtotal.toFixed(2)}`
      ]),
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fillColor: [240, 240, 240], textColor: 50, fontStyle: 'bold' }
    });

    // Total Final
    const finalY = doc.lastAutoTable.finalY + 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: S/. ${pedido.total.toFixed(2)}`, 60, finalY);
    
    // Pie de página
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text('¡Gracias por tu preferencia!', 35, finalY + 10, { align: 'center' });

    doc.save(`Comprobante_Pedido_${pedido.id}.pdf`);
  }
};