import type { Producto } from "../../../features/inventario/models/Producto";
import type { Pedido } from "../../../features/ventas/models/Pedido";

export interface DashboardData {
  metricas: {
    totalProductos: number;
    productosStockBajo: number;
    totalVentasHoy: number;
    pedidosPendientes: number;
    valorInventario: number;
    clientesNuevos: number;
  };
  ventasRecientes: Pedido[];
  productosPopulares: ProductoPopular[];
  ventasMensuales: VentaMensual[];
}

export interface ProductoPopular {
  productoId: number;
  nombre: string;
  cantidadVendida: number;
  totalVendido: number;
}

export interface VentaMensual {
  mes: string;
  ventas: number;
  pedidos: number;
}

const API_URL = "http://localhost:3001";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const productos: Producto[] = await fetch(`${API_URL}/productos`).then(r => r.json());
    const pedidos: Pedido[] = await fetch(`${API_URL}/pedidos`).then(r => r.json());

    const hoy = new Date().toISOString().split("T")[0];

    const totalVentasHoy = pedidos
      .filter(p => p?.fecha?.startsWith?.(hoy))
      .reduce((sum, p) => sum + (p.total ?? 0), 0);

    const productosStockBajo = productos.filter(p => p.stock < 10).length;
    const pedidosPendientes = pedidos.filter(p => p.estado === "pendiente").length;

    const valorInventario = productos.reduce((s, p) => s + p.precio * p.stock, 0);

    const clientesNuevos = pedidos.length;

    const conteo: Record<number, ProductoPopular> = {};

    pedidos.forEach(p => {
      p?.productos?.forEach(prod => {
        if (!prod) return;

        if (!conteo[prod.productoId]) {
          conteo[prod.productoId] = {
            productoId: prod.productoId,
            nombre: prod.nombre,
            cantidadVendida: 0,
            totalVendido: 0
          };
        }
        conteo[prod.productoId].cantidadVendida += prod.cantidad ?? 0;
        conteo[prod.productoId].totalVendido += prod.subtotal ?? 0;
      });
    });

    const productosPopulares = Object.values(conteo)
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, 5);

    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

    const ventasMensuales: VentaMensual[] = Array.from({ length: 12 }, (_, i) => ({
      mes: meses[i],
      ventas: 0,
      pedidos: 0
    }));

    pedidos.forEach(p => {
      if (!p?.fecha) return;
      const mesIndex = new Date(p.fecha).getMonth();
      ventasMensuales[mesIndex].ventas += p.total ?? 0;
      ventasMensuales[mesIndex].pedidos += 1;
    });

    const ventasRecientes = pedidos
      .filter(p => p?.fecha)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);

    return {
      metricas: {
        totalProductos: productos.length,
        productosStockBajo,
        totalVentasHoy,
        pedidosPendientes,
        valorInventario,
        clientesNuevos
      },
      ventasRecientes,
      productosPopulares,
      ventasMensuales
    };
  }
};
