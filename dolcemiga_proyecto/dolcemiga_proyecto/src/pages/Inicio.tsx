import { useState, useEffect } from "react"
import MetricCard from "../features/dashboard/components/MetricCard"
import VentasChart from "../features/dashboard/components/VentasChart"
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
      console.log("📌 RAW DASHBOARD:", res)

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-xl">
        Cargando dashboard...
      </div>
    )

  if (error)
    return (
      <div className="p-6 text-center">
        <h1 className="text-lg text-red-600 font-semibold">⚠ Error</h1>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={load}
          className="mt-4 bg-primary text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    )

  if (!data)
    return (
      <div className="p-6 text-center">
        <h1 className="text-gray-700">No hay datos</h1>
        <button
          onClick={load}
          className="mt-4 bg-primary text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    )

  const { metricas, ventasMensuales, productosPopulares, ventasRecientes } = data

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido a la gestión de Dolce Miga Pastelería
          </p>
        </div>
        <div className="text-right text-gray-700">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </div>
      </div>

      {/* MÉTRICAS */}
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

      {/* GRÁFICO Y PRODUCTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow lg:col-span-2">
          <h3 className="font-semibold mb-2">Ventas Mensuales</h3>
          {ventasMensuales.length ? (
            <VentasChart data={ventasMensuales} type="line" />
          ) : (
            <div className="text-gray-500">No hay datos</div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Productos Populares</h3>
          {productosPopulares.length ? (
            productosPopulares.map((p, i) => (
              <div key={p.productoId} className="flex justify-between py-2 border-b">
                <span>{i + 1}. {p.nombre}</span>
                <span className="font-semibold">S/{p.totalVendido.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No hay productos populares</div>
          )}
        </div>
      </div>

      {/* VENTAS RECIENTES */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Ventas Recientes</h3>
        {ventasRecientes.length ? (
          ventasRecientes.map(v => (
            <div key={v.id} className="flex justify-between py-2 border-b">
              <div>
                <div className="font-medium">Pedido #{v.id}</div>
                <div className="text-sm text-gray-500">{v.cliente?.nombres}</div>
              </div>
              <div className="font-semibold">S/{v.total.toFixed(2)}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No hay ventas recientes</div>
        )}
      </div>
    </div>
  )
}
