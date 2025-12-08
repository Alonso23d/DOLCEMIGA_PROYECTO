import type { Producto } from "../../../features/inventario/models/Producto"
import type { Pedido } from "../../../features/ventas/models/Pedido"
export interface ReporteVentas {
  fechaInicio: string
  fechaFin: string
  totalVentas: number
  totalPedidos: number
  pedidos: Pedido[]
  productosVendidos: ProductoVendido[]
}

export interface ProductoVendido {
  productoId: number
  nombre: string
  categoria: string
  cantidadVendida: number
  totalVendido: number
}

export interface ReporteProductos {
  productos: Producto[]
  stockTotal: number
  valorTotalInventario: number
  productosStockBajo: Producto[]
}

export const reportesService = {
  // Generar reporte de ventas por fecha
  async generarReporteVentas(fechaInicio: string, fechaFin: string): Promise<ReporteVentas> {
    // En una aplicación real, aquí harías una llamada a la API
    // Por ahora, simulamos con los datos existentes
    
    const response = await fetch('http://localhost:3001/pedidos')
    const pedidos: Pedido[] = await response.json()

    const pedidosFiltrados = pedidos.filter(pedido => {
      const fechaPedido = new Date(pedido.fecha)
      const inicio = new Date(fechaInicio)
      const fin = new Date(fechaFin)
      fin.setHours(23, 59, 59, 999) // Incluir todo el día final

      return fechaPedido >= inicio && fechaPedido <= fin
    })

    // Calcular productos vendidos
    const productosVendidosMap = new Map<number, ProductoVendido>()

    pedidosFiltrados.forEach(pedido => {
      pedido.productos.forEach(item => {
        const existente = productosVendidosMap.get(item.productoId)
        if (existente) {
          existente.cantidadVendida += item.cantidad
          existente.totalVendido += item.subtotal
        } else {
          productosVendidosMap.set(item.productoId, {
            productoId: item.productoId,
            nombre: item.nombre,
            categoria: '', // Se podría obtener de los productos
            cantidadVendida: item.cantidad,
            totalVendido: item.subtotal
          })
        }
      })
    })

    const productosVendidos = Array.from(productosVendidosMap.values())
    const totalVentas = pedidosFiltrados.reduce((sum, pedido) => sum + pedido.total, 0)

    return {
      fechaInicio,
      fechaFin,
      totalVentas,
      totalPedidos: pedidosFiltrados.length,
      pedidos: pedidosFiltrados,
      productosVendidos: productosVendidos.sort((a, b) => b.totalVendido - a.totalVendido)
    }
  },

  // Generar reporte de productos
  async generarReporteProductos(): Promise<ReporteProductos> {
    const response = await fetch('http://localhost:3001/productos')
    const productos: Producto[] = await response.json()

    const stockTotal = productos.reduce((sum, producto) => sum + producto.stock, 0)
    const valorTotalInventario = productos.reduce((sum, producto) => 
      sum + (producto.precio * producto.stock), 0
    )
    const productosStockBajo = productos.filter(producto => producto.stock < 10)

    return {
      productos: productos.sort((a, b) => b.stock - a.stock),
      stockTotal,
      valorTotalInventario,
      productosStockBajo
    }
  }
}