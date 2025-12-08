import { useState, useEffect } from 'react';
import Carrito from '../features/ventas/components/Carrito';
import ModalPedido from '../features/ventas/components/ModalPedido';
import { useProducts } from '../features/inventario/hooks/useProducts';
import { useVentas } from '../features/ventas/hooks/useVentas';

import type { Cliente } from '../features/ventas/models/Cliente';

const Ventas = () => {
  const { productos, loadProductos, loading: loadingProductos } = useProducts();
  const {
    carrito,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    realizarPedido,
    totalCarrito,
    error,
    loading: loadingVenta
  } = useVentas();

  const [showModal, setShowModal] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  const handleRealizarPedido = async (cliente: Cliente, metodoPago: string) => {
    try {
      await realizarPedido(cliente, metodoPago);
      await loadProductos(); // Recargar productos para actualizar stock
      setShowModal(false);
    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  // Obtener categorías únicas para el filtro
  const categorias = [...new Set(productos.map(p => p.categoria))];

  // Filtrar productos por categoría
  const productosFiltrados = filtroCategoria 
    ? productos.filter(p => p.categoria === filtroCategoria)
    : productos;

  const getStockColor = (stock: number): string => {
    if (stock === 0) return 'text-red-500';
    if (stock < 10) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStockText = (stock: number): string => {
    if (stock === 0) return 'Sin Stock';
    if (stock < 10) return `Stock Bajo (${stock})`;
    return `En Stock (${stock})`;
  };

  if (loadingProductos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Cargando productos...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Realizar Venta</h1>
        <div className="flex items-center gap-4">
          {/* Filtro por categoría */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600">
            {productosFiltrados.length} productos
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Catálogo de Productos */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Catálogo de Productos</h2>
              {filtroCategoria && (
                <span className="text-sm text-gray-500">
                  Filtrado por: <strong>{filtroCategoria}</strong>
                  <button 
                    onClick={() => setFiltroCategoria('')}
                    className="ml-2 text-primary hover:text-primary/80"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
            
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg mb-2">
                  {filtroCategoria 
                    ? `No hay productos en la categoría "${filtroCategoria}"`
                    : 'No hay productos disponibles'
                  }
                </p>
                {filtroCategoria && (
                  <button
                    onClick={() => setFiltroCategoria('')}
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Ver todos los productos
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {productosFiltrados.map((producto) => (
                  <div 
                    key={producto.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    <div className="h-40 overflow-hidden bg-gray-100">
                      <img 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Imagen+No+Disponible';
                        }}
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm leading-tight">
                        {producto.nombre}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {producto.categoria}
                        </span>
                        <span className={`text-xs font-medium ${getStockColor(producto.stock)}`}>
                          {getStockText(producto.stock)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-primary">
                          S/.{producto.precio.toFixed(2)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stock === 0}
                        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                      >
                        {producto.stock === 0 ? (
                          <>
                            <span>❌</span>
                            Sin Stock
                          </>
                        ) : (
                          <>
                            <span>🛒</span>
                            Agregar al Carrito
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Carrito */}
        <div className="lg:col-span-1">
          <Carrito
            items={carrito}
            onUpdateCantidad={actualizarCantidad}
            onRemoveItem={eliminarDelCarrito}
            onRealizarPedido={() => setShowModal(true)}
            total={totalCarrito}
            disabled={carrito.length === 0 || loadingVenta}
          />
        </div>
      </div>

      {/* Modal de Confirmación de Pedido */}
      <ModalPedido
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleRealizarPedido}
        items={carrito}
        total={totalCarrito}
        loading={loadingVenta}
      />

      {/* Resumen rápido del carrito para móvil */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">Carrito: {carrito.length} items</span>
            <span className="ml-2">Total: S/.{totalCarrito.toFixed(2)}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={carrito.length === 0}
            className="bg-white text-primary px-4 py-2 rounded font-semibold disabled:opacity-50"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ventas;