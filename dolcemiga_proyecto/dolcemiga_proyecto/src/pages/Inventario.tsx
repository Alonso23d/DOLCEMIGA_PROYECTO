import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Package } from 'lucide-react'; // Necesitas importar iconos
import FormularioProducto from '../features/inventario/components/FormularioProducto';
import { useProducts } from '../features/inventario/hooks/useProducts';
import type { Producto } from '../features/inventario/models/Producto';

const Inventario = () => {
  const [showForm, setShowForm] = useState(false);
  const [productoEdit, setProductoEdit] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState(''); // Estado para filtro simple
  
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
        // alert('Producto eliminado correctamente'); // Opcional, a veces es molesto
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

  // Filtrado simple por nombre
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Cargando inventario...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y Acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-primary">Inventario</h1>
           <p className="text-gray-500 text-sm">Gestiona tus productos, precios y stock</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            {/* Barra de búsqueda */}
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text"
                    placeholder="Buscar producto..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
            
            <button
            onClick={handleCreate}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium shadow-sm"
            >
            <Plus size={20} /> Nuevo
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Estadísticas Rápidas (Barra superior) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
               <p className="text-sm text-gray-500">Total Productos</p>
               <p className="text-2xl font-bold text-gray-800">{stats.totalProductos}</p>
           </div>
           <Package className="text-blue-500 opacity-20" size={40} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
               <p className="text-sm text-gray-500">Valor Inventario</p>
               <p className="text-2xl font-bold text-green-600">S/. {stats.valorTotal.toFixed(2)}</p>
           </div>
           <div className="text-green-500 opacity-20 text-3xl">S/.</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
               <p className="text-sm text-gray-500">Stock Bajo</p>
               <p className="text-2xl font-bold text-red-500">{stats.productosStockBajo}</p>
           </div>
           <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="p-4">Producto</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4">Precio</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {productosFiltrados.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                No se encontraron productos
                            </td>
                        </tr>
                    ) : (
                        productosFiltrados.map((producto) => (
                        <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img 
                                            src={producto.imagen} 
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=IMG'}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{producto.nombre}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{producto.descripcion}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                    {producto.categoria}
                                </span>
                            </td>
                            <td className="p-4 font-medium text-gray-700">
                                S/. {producto.precio.toFixed(2)}
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        producto.stock < 10 ? 'bg-red-500' : producto.stock < 20 ? 'bg-orange-500' : 'bg-green-500'
                                    }`}></div>
                                    <span className={`text-sm ${producto.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                        {producto.stock} uds.
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleEdit(producto)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => producto.id && handleDelete(producto.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
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