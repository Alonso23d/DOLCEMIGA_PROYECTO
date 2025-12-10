import { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react'; // Asegúrate de tener lucide-react instalado
import { useVentas } from '../features/ventas/hooks/useVentas';
import type { Pedido } from '../features/ventas/models/Pedido';
import { pdfGenerator } from '../utils/pdfGenerator';
import { reportesService } from '../features/dashboard/services/reportesService';

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
        fin.setHours(23, 59, 59, 999); // Incluir todo el día final
        return fechaPedido >= inicio && fechaPedido <= fin;
      });
      setPedidosFiltrados(filtrados);
    } else {
      setPedidosFiltrados(pedidos);
    }
  }, [pedidos, fechaInicio, fechaFin]);

  // --- Estadísticas ---
  const totalVentas = pedidosFiltrados.reduce((total: number, pedido: Pedido) => total + pedido.total, 0);
  const totalPedidos = pedidosFiltrados.length;
  const pedidosCompletados = pedidosFiltrados.filter((pedido: Pedido) => pedido.estado === 'completado').length;
  const pedidosPendientes = pedidosFiltrados.filter((pedido: Pedido) => pedido.estado === 'pendiente').length;

  // --- Productos más vendidos ---
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

  // --- Métodos de pago ---
  const metodosPago = pedidosFiltrados.reduce((acc: any, pedido: Pedido) => {
    acc[pedido.metodoPago] = (acc[pedido.metodoPago] || 0) + 1;
    return acc;
  }, {});

  // --- FUNCIONES PARA DESCARGAR PDF ---
  const handleDownloadVentas = () => {
    const datosReporte = {
        fechaInicio: fechaInicio || new Date().toISOString(), // Si no hay fecha, usa hoy
        fechaFin: fechaFin || new Date().toISOString(),
        totalVentas,
        totalPedidos,
        pedidos: pedidosFiltrados,
        productosVendidos: productosMasVendidos.map((p: any) => ({
            productoId: p.productoId,
            nombre: p.nombre,
            categoria: 'General',
            cantidadVendida: p.cantidad,
            totalVendido: p.total
        }))
    };
    pdfGenerator.generarPDFVentas(datosReporte);
  };

  const handleDownloadInventario = async () => {
      try {
          // Solicitamos datos frescos al servicio (asumiendo que devuelve la estructura correcta)
          const datos = await reportesService.generarReporteProductos();
          pdfGenerator.generarPDFProductos(datos);
      } catch (error) {
          console.error("Error al generar reporte inventario", error);
          alert("Error al generar el reporte. Revisa la consola.");
      }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      
      {/* HEADER CON BOTONES DE ACCIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Reportes y Estadísticas</h1>
        
        <div className="flex flex-wrap gap-3">
             <button 
                onClick={handleDownloadVentas}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
              >
                  <FileText size={18} />
                  <span>Exportar Ventas</span>
              </button>

              <button 
                onClick={handleDownloadInventario}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2 shadow-sm"
              >
                  <Download size={18} />
                  <span>Exportar Inventario</span>
              </button>
        </div>
      </div>

      {/* Filtros por fecha */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Filtrar por Fecha</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
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
          <p className="text-3xl font-bold text-primary">S/. {totalVentas.toFixed(2)}</p>
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
                <div key={producto.productoId} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">{producto.nombre}</p>
                      <p className="text-sm text-gray-500">{producto.cantidad} unidades</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">S/. {producto.total.toFixed(2)}</span>
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
                  <span className="font-semibold capitalize text-gray-700">{metodo}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {cantidad} pedidos
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista de pedidos recientes */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">Pedidos Recientes</h2>
        {pedidosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay pedidos en el período seleccionado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Pago</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.slice(0, 10).map((pedido: Pedido) => (
                  <tr key={pedido.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium">#{pedido.id}</td>
                    <td className="py-3 px-4">{pedido.cliente.nombres}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(pedido.fecha).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">S/. {pedido.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pedido.estado === 'completado' 
                          ? 'bg-green-100 text-green-800'
                          : pedido.estado === 'pendiente'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize text-gray-600">{pedido.metodoPago}</td>
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