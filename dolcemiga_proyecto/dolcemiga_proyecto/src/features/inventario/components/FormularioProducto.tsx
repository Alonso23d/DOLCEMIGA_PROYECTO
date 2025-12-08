import { useState, useEffect } from 'react';
import { Producto } from '../models/Producto'; 
import type { ProductoFormData } from '../models/Producto';
import { useProducts } from '../hooks/useProducts';

interface FormularioProductoProps {
  producto?: Producto | null;
  onSave: () => void;
  onCancel: () => void;
  categoriasDisponibles: string[];
}

const FormularioProducto: React.FC<FormularioProductoProps> = ({ 
  producto, 
  onSave, 
  onCancel,
  categoriasDisponibles 
}) => {
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    stock: 0,
    precio: 0,
    categoria: '',
    imagen: '',
    descripcion: ''
  });
  
  const [loading, setLoading] = useState(false);
  const { createProducto, updateProducto } = useProducts();

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        stock: producto.stock,
        precio: producto.precio,
        categoria: producto.categoria,
        imagen: producto.imagen,
        descripcion: producto.descripcion || ''
      });
    } else {
      setFormData({
        nombre: '',
        stock: 0,
        precio: 0,
        categoria: '',
        imagen: '',
        descripcion: ''
      });
    }
  }, [producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (producto && producto.id) {
        await updateProducto(producto.id, formData);
      } else {
        await createProducto(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      // El error ya se muestra en el hook
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'precio' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Nombre del producto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Seleccionar categoría</option>
                {categoriasDisponibles.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen *
              </label>
              <input
                type="url"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                required
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Descripción del producto (opcional)"
              />
            </div>

            {formData.imagen && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista previa:
                </label>
                <div className="flex justify-center">
                  <img 
                    src={formData.imagen} 
                    alt="Vista previa" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Imagen+No+Disponible';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {producto ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  producto ? 'Actualizar' : 'Crear Producto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioProducto;