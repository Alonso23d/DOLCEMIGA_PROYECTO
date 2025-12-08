import { useState, useEffect } from 'react';
import FormularioProducto from '../features/inventario/components/FormularioProducto';
import { useProducts } from '../features/inventario/hooks/useProducts';
import type { Producto } from '../features/inventario/models/Producto';

const Inventario = () => {
  const [showForm, setShowForm] = useState(false);
  const [productoEdit, setProductoEdit] = useState<Producto | null>(null);
  
  const {
    productos,
    categorias,
    stats,
    loading,
    error,
    deleteProducto,
    loadProductos,
    getCategorias
  } = useProducts();

  useEffect(() => {
    getCategorias();
  }, [getCategorias]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProducto(id);
        alert('Producto eliminado correctamente');
      } catch (err) {}
    }
  };

  const handleEdit = (producto: Producto) => {
    setProductoEdit(producto);
    setShowForm(true);
  };

  const handleCreate = () => {
    setProductoEdit(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setProductoEdit(null);
    loadProductos();
  };

  const handleCancel = () => {
    setShowForm(false);
    setProductoEdit(null);
  };

  const getStockBgColor = (stock: number): string => {
    if (stock < 10) return 'bg-red-100 text-red-800';
    if (stock < 20) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
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
        <h1 className="text-3xl font-bold text-primary">Inventario</h1>
        <button
          onClick={handleCreate}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-semibold"
        >
          <span className="text-xl">+</span> Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
          <h3 className="font-semibold text-gray-600 mb-2">Total Productos</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalProductos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 className="font-semibold text-gray-600 mb-2">Stock Bajo</h3>
          <p className="text-3xl font-bold text-orange-500">{stats.productosStockBajo}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-600 mb-2">Valor Total</h3>
          <p className="text-3xl font-bold text-green-500">
            S/. {stats.valorTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Productos en Inventario</h2>
          <span className="text-sm text-gray-500">
            Mostrando {productos.length} productos
          </span>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-4">No hay productos en el inventario</p>
            <button
              onClick={handleCreate}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Agregar primer producto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <div 
                key={producto.id} 
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="h-48 overflow-hidden bg-gray-100">
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
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                      {producto.nombre}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStockBgColor(producto.stock)}`}>
                      {producto.stock} en stock
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {producto.categoria}
                    </span>
                  </div>
                  
                  {producto.descripcion && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {producto.descripcion}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-primary">
                      S/. {producto.precio.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(producto)}
                        className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <span>✏️</span>
                        Editar
                      </button>
                      <button 
                        onClick={() => producto.id && handleDelete(producto.id)}
                        className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <span>🗑️</span>
                        Eliminar
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <FormularioProducto
          producto={productoEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          categoriasDisponibles={categorias}
        />
      )}
    </div>
  );
};

export default Inventario;
