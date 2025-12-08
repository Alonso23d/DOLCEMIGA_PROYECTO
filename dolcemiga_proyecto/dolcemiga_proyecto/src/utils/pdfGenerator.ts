import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const pdfGenerator = {
  // Generar PDF a partir de un elemento HTML
  async generarPDF(elemento: HTMLElement, nombreArchivo: string = 'reporte.pdf'): Promise<void> {
    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 30

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(nombreArchivo)
  },

  // Generar PDF de reporte de ventas
  async generarPDFVentas(datos: any, fechaInicio: string, fechaFin: string): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    let yPos = 20

    // Título
    pdf.setFontSize(20)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Reporte de Ventas - Dolce Miga', 20, yPos)
    yPos += 10

    // Período
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Período: ${new Date(fechaInicio).toLocaleDateString()} - ${new Date(fechaFin).toLocaleDateString()}`, 20, yPos)
    yPos += 15

    // Resumen
    pdf.setFontSize(14)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Resumen General', 20, yPos)
    yPos += 10

    pdf.setFontSize(10)
    pdf.text(`Total de Ventas: $${datos.totalVentas.toFixed(2)}`, 30, yPos)
    yPos += 6
    pdf.text(`Total de Pedidos: ${datos.totalPedidos}`, 30, yPos)
    yPos += 6
    pdf.text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, 30, yPos)
    yPos += 15

    // Productos más vendidos
    if (datos.productosVendidos && datos.productosVendidos.length > 0) {
      pdf.setFontSize(14)
      pdf.text('Productos Más Vendidos', 20, yPos)
      yPos += 10

      pdf.setFontSize(8)
      datos.productosVendidos.slice(0, 10).forEach((producto: any, index: number) => {
        if (yPos > 270) {
          pdf.addPage()
          yPos = 20
        }
        
        pdf.text(`${index + 1}. ${producto.nombre}`, 25, yPos)
        pdf.text(`Cantidad: ${producto.cantidadVendida}`, 120, yPos)
        pdf.text(`Total: $${producto.totalVendido.toFixed(2)}`, 160, yPos)
        yPos += 6
      })
      yPos += 10
    }

    // Detalle de pedidos
    if (datos.pedidos && datos.pedidos.length > 0) {
      pdf.setFontSize(14)
      pdf.text('Detalle de Pedidos', 20, yPos)
      yPos += 10

      pdf.setFontSize(7)
      datos.pedidos.forEach((pedido: any, index: number) => {
        if (yPos > 270) {
          pdf.addPage()
          yPos = 20
        }

        pdf.text(`Pedido #${pedido.id} - ${pedido.cliente.nombres}`, 25, yPos)
        yPos += 4
        pdf.text(`Fecha: ${new Date(pedido.fecha).toLocaleDateString()}`, 25, yPos)
        pdf.text(`Total: $${pedido.total.toFixed(2)}`, 100, yPos)
        pdf.text(`Estado: ${pedido.estado}`, 150, yPos)
        yPos += 6

        pedido.productos.forEach((item: any) => {
          pdf.text(`  - ${item.nombre} x${item.cantidad} = $${item.subtotal.toFixed(2)}`, 30, yPos)
          yPos += 4
        })
        yPos += 4
      })
    }

    pdf.save(`reporte-ventas-${fechaInicio}-a-${fechaFin}.pdf`)
  },

  // Generar PDF de reporte de productos
  async generarPDFProductos(datos: any): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    let yPos = 20

    // Título
    pdf.setFontSize(20)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Reporte de Inventario - Dolce Miga', 20, yPos)
    yPos += 10

    // Fecha
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, 20, yPos)
    yPos += 15

    // Resumen
    pdf.setFontSize(14)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Resumen del Inventario', 20, yPos)
    yPos += 10

    pdf.setFontSize(10)
    pdf.text(`Total de Productos: ${datos.productos.length}`, 30, yPos)
    yPos += 6
    pdf.text(`Stock Total: ${datos.stockTotal} unidades`, 30, yPos)
    yPos += 6
    pdf.text(`Valor Total del Inventario: $${datos.valorTotalInventario.toFixed(2)}`, 30, yPos)
    yPos += 6
    pdf.text(`Productos con Stock Bajo: ${datos.productosStockBajo.length}`, 30, yPos)
    yPos += 15

    // Lista de productos
    pdf.setFontSize(14)
    pdf.text('Lista de Productos', 20, yPos)
    yPos += 10

    // Encabezados de tabla
    pdf.setFontSize(8)
    pdf.setTextColor(255, 255, 255)
    pdf.setFillColor(136, 12, 72) // Color primary
    pdf.rect(20, yPos, 170, 6, 'F')
    pdf.text('Producto', 22, yPos + 4)
    pdf.text('Categoría', 80, yPos + 4)
    pdf.text('Stock', 120, yPos + 4)
    pdf.text('Precio', 140, yPos + 4)
    pdf.text('Valor', 160, yPos + 4)
    yPos += 8

    // Datos de productos
    pdf.setTextColor(0, 0, 0)
    datos.productos.forEach((producto: any) => {
      if (yPos > 270) {
        pdf.addPage()
        yPos = 20
        // Volver a dibujar encabezados
        pdf.setTextColor(255, 255, 255)
        pdf.setFillColor(136, 12, 72)
        pdf.rect(20, yPos, 170, 6, 'F')
        pdf.text('Producto', 22, yPos + 4)
        pdf.text('Categoría', 80, yPos + 4)
        pdf.text('Stock', 120, yPos + 4)
        pdf.text('Precio', 140, yPos + 4)
        pdf.text('Valor', 160, yPos + 4)
        yPos += 8
        pdf.setTextColor(0, 0, 0)
      }

      // Resaltar productos con stock bajo
      if (producto.stock < 10) {
        pdf.setFillColor(255, 230, 230)
        pdf.rect(20, yPos - 2, 170, 6, 'F')
      }

      pdf.text(producto.nombre.substring(0, 30), 22, yPos + 4)
      pdf.text(producto.categoria, 80, yPos + 4)
      pdf.text(producto.stock.toString(), 120, yPos + 4)
      pdf.text(`$${producto.precio.toFixed(2)}`, 140, yPos + 4)
      pdf.text(`$${(producto.precio * producto.stock).toFixed(2)}`, 160, yPos + 4)
      yPos += 6
    })

    // Productos con stock bajo
    if (datos.productosStockBajo.length > 0) {
      yPos += 10
      if (yPos > 250) {
        pdf.addPage()
        yPos = 20
      }

      pdf.setFontSize(14)
      pdf.setTextColor(255, 0, 0)
      pdf.text('Productos con Stock Bajo', 20, yPos)
      yPos += 10

      pdf.setFontSize(8)
      pdf.setTextColor(0, 0, 0)
      datos.productosStockBajo.forEach((producto: any) => {
        if (yPos > 270) {
          pdf.addPage()
          yPos = 20
        }
        pdf.text(`${producto.nombre} - Stock: ${producto.stock}`, 25, yPos)
        yPos += 6
      })
    }

    pdf.save('reporte-inventario.pdf')
  }
}