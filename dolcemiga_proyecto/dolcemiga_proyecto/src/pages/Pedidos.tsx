import { useState, useEffect } from 'react'
import { ventasService } from '../features/ventas/services/ventasService'
import type { Pedido } from '../features/ventas/models/Pedido'

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      const data = await ventasService.getPedidos()
      setPedidos(data)
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
      alert('Error al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  const actualizarEstado = async (id: number, nuevoEstado: Pedido['estado']) => {
    try {
      await ventasService.actualizarEstadoPedido(id, nuevoEstado)
      await loadPedidos()
      alert('Estado actualizado correctamente')
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      alert('Error al actualizar el estado')
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando pedidos...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Pedidos</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay pedidos registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{pedido.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{pedido.cliente.nombres}</div>
                        <div className="text-sm text-gray-500">DNI: {pedido.cliente.dni}</div>
                        <div className="text-sm text-gray-500">{pedido.cliente.telefono}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {pedido.productos.map(p => (
                          <div key={p.productoId} className="flex justify-between">
                            <span>{p.nombre} x {p.cantidad}</span>
                            <span>S/. {p.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">
                      S/. {pedido.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="space-x-2">
                        {pedido.estado === 'pendiente' && (
                          <>
                            <button
                              onClick={() => pedido.id && actualizarEstado(pedido.id, 'completado')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Completar
                            </button>
                            <button
                              onClick={() => pedido.id && actualizarEstado(pedido.id, 'cancelado')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pedidos
