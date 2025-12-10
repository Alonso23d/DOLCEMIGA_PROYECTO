import { useState, useEffect } from 'react'
import { Eye, FileText, Ban, Trash2, X } from 'lucide-react' // Importamos iconos
import { ventasService } from '../features/ventas/services/ventasService'
import type { Pedido } from '../features/ventas/models/Pedido'
import { pdfGenerator } from '../utils/pdfGenerator'

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estado para el modal
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      const data = await ventasService.getPedidos()
      // Ordenar por fecha descendente (más nuevo primero)
      setPedidos(data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()))
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
      alert('Error al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  const actualizarEstado = async (id: number, nuevoEstado: Pedido['estado']) => {
    if (!confirm(`¿Estás seguro de cambiar el estado a "${nuevoEstado}"?`)) return

    try {
      await ventasService.actualizarEstadoPedido(id, nuevoEstado)
      await loadPedidos()
      // alert('Estado actualizado correctamente')
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      alert('Error al actualizar el estado')
    }
  }

  const handleVerDetalle = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido)
    setShowModal(true)
  }

  const handleDescargarPDF = (pedido: Pedido) => {
    try {
        pdfGenerator.generarComprobante(pedido)
    } catch (error) {
        console.error("Error PDF:", error)
        alert("No se pudo generar el comprobante.")
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800 border-green-200'
      case 'pendiente': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Cargando pedidos...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Pedidos</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">📦</div>
            <p className="text-gray-500 text-lg">No hay pedidos registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Productos</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{pedido.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{pedido.cliente.nombres}</div>
                        <div className="text-xs text-gray-500">{pedido.cliente.telefono || 'Sin teléfono'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       {/* Mostramos solo el primer producto y "...más" si hay muchos */}
                      <div className="text-sm text-gray-600">
                        {pedido.productos[0]?.nombre} x{pedido.productos[0]?.cantidad}
                        {pedido.productos.length > 1 && (
                            <span className="text-xs text-gray-400 ml-1">
                                (+{pedido.productos.length - 1} más)
                            </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                      S/. {pedido.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getEstadoColor(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    
                    {/* COLUMNA DE ACCIONES */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        
                        {/* 1. Ver Detalle */}
                        <button
                          onClick={() => handleVerDetalle(pedido)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver Detalle Completo"
                        >
                          <Eye size={18} />
                        </button>

                        {/* 2. Descargar PDF */}
                        <button
                          onClick={() => handleDescargarPDF(pedido)}
                          className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Descargar Comprobante"
                        >
                          <FileText size={18} />
                        </button>

                        {/* 3. Anular / Cancelar (Solo si está pendiente) */}
                        {pedido.estado === 'pendiente' && (
                            <button
                                onClick={() => pedido.id && actualizarEstado(pedido.id, 'cancelado')}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                title="Anular Pedido"
                            >
                                <Ban size={18} />
                            </button>
                        )}
                        
                        {/* Opción extra: Eliminar si ya está cancelado (opcional) */}
                        {pedido.estado === 'cancelado' && (
                             <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar registro">
                                 <Trash2 size={18} />
                             </button>
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

      {/* MODAL DE DETALLE DEL PEDIDO */}
      {showModal && pedidoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="bg-primary px-6 py-4 flex justify-between items-center">
                <h2 className="text-white text-lg font-bold">Detalle del Pedido #{pedidoSeleccionado.id}</h2>
                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition">
                    <X size={24} />
                </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-4">
                
                {/* Info Cliente */}
                <div className="flex justify-between items-start border-b pb-4">
                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Cliente</p>
                        <p className="text-lg font-medium text-gray-800">{pedidoSeleccionado.cliente.nombres}</p>
                        <p className="text-sm text-gray-600">DNI: {pedidoSeleccionado.cliente.dni || '-'}</p>
                        <p className="text-sm text-gray-600">Tel: {pedidoSeleccionado.cliente.telefono || '-'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase font-semibold">Fecha</p>
                        <p className="text-gray-800">{new Date(pedidoSeleccionado.fecha).toLocaleDateString()}</p>
                        <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${getEstadoColor(pedidoSeleccionado.estado)}`}>
                            {pedidoSeleccionado.estado}
                        </div>
                    </div>
                </div>

                {/* Lista Productos */}
                <div>
                    <p className="text-sm text-gray-500 uppercase font-semibold mb-2">Productos</p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        {pedidoSeleccionado.productos.map((prod, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span>{prod.cantidad} x {prod.nombre}</span>
                                <span className="font-medium">S/. {prod.subtotal.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t mt-4">
                    <span className="text-xl font-bold text-gray-800">Total a Pagar</span>
                    <span className="text-2xl font-bold text-primary">S/. {pedidoSeleccionado.total.toFixed(2)}</span>
                </div>

            </div>

            {/* Footer Modal - Acciones Rápidas */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                 <button 
                    onClick={() => handleDescargarPDF(pedidoSeleccionado)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition"
                 >
                    <FileText size={18} /> Comprobante
                 </button>
                 
                 {pedidoSeleccionado.estado === 'pendiente' && (
                     <button 
                        onClick={() => {
                            if(pedidoSeleccionado.id) actualizarEstado(pedidoSeleccionado.id, 'completado');
                            setShowModal(false);
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                     >
                        Marcar como Entregado
                     </button>
                 )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Pedidos