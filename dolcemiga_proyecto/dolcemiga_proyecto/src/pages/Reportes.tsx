import { useState, useEffect } from 'react';
import { useVentas } from '../features/ventas/hooks/useVentas';
import type { Pedido } from '../features/ventas/models/Pedido';

const Reportes = () => {
  const { pedidos, cargarPedidos } = useVentas();
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const filtrados = pedidos.filter((pedido: Pedido) => {
        const fechaPedido = new Date(pedido.fecha);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return fechaPedido >= inicio && fechaPedido <= fin;
      });
      setPedidosFiltrados(filtrados);
    } else {
      setPedidosFiltrados(pedidos);
    }
  }, [pedidos, fechaInicio, fechaFin]);

  // Estadísticas
  const totalVentas = pedidosFiltrados.reduce((total: number, pedido: Pedido) => total + pedido.total, 0);
  const totalPedidos = pedidosFiltrados.length;
  const pedidosCompletados = pedidosFiltrados.filter((pedido: Pedido) => pedido.estado === 'completado').length;
  const pedidosPendientes = pedidosFiltrados.filter((pedido: Pedido) => pedido.estado === 'pendiente').length;

  // Productos más vendidos
  const productosVendidos = pedidosFiltrados.flatMap((pedido: Pedido) => pedido.productos);
  const productosMasVendidos = productosVendidos.reduce((acc: any, item: any) => {
    const existente = acc.find((p: any) => p.productoId === item.productoId);
    if (existente) {
      existente.cantidad += item.cantidad;
      existente.total += item.subtotal;
    } else {
      acc.push({
        productoId: item.productoId,
        nombre: item.nombre,
        cantidad: item.cantidad,
        total: item.subtotal
      });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.cantidad - a.cantidad).slice(0, 5);

  // Métodos de pago
  const metodosPago = pedidosFiltrados.reduce((acc: any, pedido: Pedido) => {
    acc[pedido.metodoPago] = (acc[pedido.metodoPago] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Reportes y Estadísticas</h1>

      {/* Filtros por fecha */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtrar por Fecha</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFechaInicio('');
                setFechaFin('');
              }}
              className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
          <h3 className="font-semibold text-gray-600 mb-2">Total Ventas</h3>
          <p className="text-3xl font-bold text-primary">${totalVentas.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-600 mb-2">Total Pedidos</h3>
          <p className="text-3xl font-bold text-green-500">{totalPedidos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-600 mb-2">Completados</h3>
          <p className="text-3xl font-bold text-blue-500">{pedidosCompletados}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 className="font-semibold text-gray-600 mb-2">Pendientes</h3>
          <p className="text-3xl font-bold text-orange-500">{pedidosPendientes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Productos Más Vendidos</h2>
          {productosMasVendidos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay datos de ventas</p>
          ) : (
            <div className="space-y-3">
              {productosMasVendidos.map((producto: any, index: number) => (
                <div key={producto.productoId} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{producto.nombre}</p>
                      <p className="text-sm text-gray-500">{producto.cantidad} unidades</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">${producto.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Métodos de pago */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Métodos de Pago</h2>
          {Object.keys(metodosPago).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay datos de pagos</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(metodosPago).map(([metodo, cantidad]: [string, any]) => (
                <div key={metodo} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="font-semibold capitalize">{metodo}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {cantidad} pedidos
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista de pedidos recientes */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Pedidos Recientes</h2>
        {pedidosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay pedidos en el período seleccionado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3">ID</th>
                  <th className="text-left py-3">Cliente</th>
                  <th className="text-left py-3">Fecha</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Estado</th>
                  <th className="text-left py-3">Pago</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.slice(0, 10).map((pedido: Pedido) => (
                  <tr key={pedido.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">#{pedido.id}</td>
                    <td className="py-3">{pedido.cliente.nombres}</td>
                    <td className="py-3">{new Date(pedido.fecha).toLocaleDateString()}</td>
                    <td className="py-3 font-semibold">${pedido.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pedido.estado === 'completado' 
                          ? 'bg-green-100 text-green-800'
                          : pedido.estado === 'pendiente'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="py-3 capitalize">{pedido.metodoPago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;