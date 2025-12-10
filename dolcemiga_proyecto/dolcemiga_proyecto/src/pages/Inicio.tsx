import { useState, useEffect } from "react"
import MetricCard from "../features/dashboard/components/MetricCard"
import VentasChart from "../features/dashboard/components/VentasChart"
import AccionesRapidas from "../features/dashboard/components/AccionesRapidas"
import ResumenDia from "../features/dashboard/components/ResumenDia" // <--- Importamos el nuevo componente
import { dashboardService } from "../features/dashboard/services/dashboardService"
import type { DashboardData } from "../features/dashboard/services/dashboardService"

const safe = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0)

export default function Inicio() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await dashboardService.getDashboardData()
      
      // Sanitización de datos
      res.metricas.totalProductos = safe(res.metricas.totalProductos)
      res.metricas.productosStockBajo = safe(res.metricas.productosStockBajo)
      res.metricas.totalVentasHoy = safe(res.metricas.totalVentasHoy)
      res.metricas.pedidosPendientes = safe(res.metricas.pedidosPendientes)
      res.metricas.valorInventario = safe(res.metricas.valorInventario)
      res.metricas.clientesNuevos = safe(res.metricas.clientesNuevos)

      res.ventasMensuales = res.ventasMensuales?.map(v => ({
        mes: v.mes,
        ventas: safe(v.ventas),
        pedidos: safe(v.pedidos)
      })) ?? []

      setData(res)
      setError(null)
    } catch (e: any) {
      setError(e.message || "Error inesperado")
      setData(null)
    }
    setLoading(false)
  }

  if (loading) return <div className="flex justify-center items-center h-64 text-xl">Cargando dashboard...</div>
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>
  if (!data) return <div className="p-6 text-center">No hay datos</div>

  const { metricas, ventasMensuales, productosPopulares, ventasRecientes } = data

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido a la gestión de Dolce Miga Pastelería</p>
        </div>
        <div className="text-right text-gray-700">
          {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* 1. SECCIÓN DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Productos" value={metricas.totalProductos} icon="📦" color="blue" />
        <MetricCard title="Ventas Hoy" value={`S/${metricas.totalVentasHoy.toFixed(2)}`} icon="💰" color="green" />
        <MetricCard title="Pedidos Pendientes" value={metricas.pedidosPendientes} icon="📋" color="orange" />
        <MetricCard title="Stock Bajo" value={metricas.productosStockBajo} icon="⚠️" color="red" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard title="Valor Inventario" value={`S/${metricas.valorInventario.toFixed(2)}`} icon="🏪" color="purple" />
        <MetricCard title="Clientes Nuevos" value={metricas.clientesNuevos} icon="👥" color="primary" />
      </div>

      {/* 2. GRÁFICO Y PRODUCTOS POPULARES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow lg:col-span-2">
          <h3 className="font-semibold mb-2">Ventas Mensuales</h3>
          {ventasMensuales.length ? <VentasChart data={ventasMensuales} type="line" /> : <div className="text-gray-500">No hay datos</div>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Productos Populares</h3>
          {productosPopulares.length ? (
            productosPopulares.map((p, i) => (
              <div key={p.productoId} className="flex justify-between py-2 border-b last:border-0">
                <span>{i + 1}. {p.nombre}</span>
                <span className="font-semibold">S/{p.totalVendido.toFixed(2)}</span>
              </div>
            ))
          ) : <div className="text-gray-500">No hay productos populares</div>}
        </div>
      </div>

      {/* 3. VENTAS RECIENTES (Izquierda) Y ACCIONES RÁPIDAS (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ventas Recientes */}
        <div className="bg-white p-4 rounded shadow h-full">
          <h3 className="font-semibold mb-4">Ventas Recientes</h3>
          {ventasRecientes.length ? (
            <div className="space-y-3">
              {ventasRecientes.map(v => (
                <div key={v.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                  <div>
                    <div className="font-medium text-primary">Pedido #{v.id}</div>
                    <div className="text-sm text-gray-500">{v.cliente?.nombres}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">S/{v.total.toFixed(2)}</div>
                    <div className="text-xs text-green-600">Completado</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No hay ventas recientes</div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white p-4 rounded shadow h-full">
           {/* Pasamos la métrica de stock bajo para la alerta */}
           <AccionesRapidas stockBajo={metricas.productosStockBajo} />
        </div>
      </div>

      {/* 4. BARRA DE RESUMEN DEL DÍA (Footer) */}
      <ResumenDia 
        ventasHoy={metricas.totalVentasHoy}
        pedidosHoy={metricas.pedidosPendientes} // Ojo: Usé pendientes, si tienes una métrica de "pedidos hoy" úsala aquí
        clientesNuevos={metricas.clientesNuevos}
        stockBajo={metricas.productosStockBajo}
      />

    </div>
  )
}