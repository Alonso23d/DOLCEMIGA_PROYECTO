import { useState, useCallback, useEffect } from 'react';
import { productosService } from '../services/productosService';
import type { Producto, ProductoFormData } from '../../../features/inventario/models/Producto';

interface ProductoStats {
  totalProductos: number;
  productosStockBajo: number;
  valorTotal: number;
}

interface UseProductsReturn {
  productos: Producto[];
  categorias: string[];
  stats: ProductoStats;
  loading: boolean;
  error: string | null;
  loadProductos: () => Promise<void>;
  createProducto: (producto: ProductoFormData) => Promise<void>;
  updateProducto: (id: number, producto: Partial<Producto>) => Promise<void>;
  deleteProducto: (id: number) => Promise<void>;
  getCategorias: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = useCallback((products: Producto[]): ProductoStats => {
    return {
      totalProductos: products.length,
      productosStockBajo: products.filter(p => p.stock < 10).length,
      valorTotal: products.reduce((total, producto) => total + (producto.precio * producto.stock), 0)
    };
  }, []);

  const [stats, setStats] = useState<ProductoStats>(calculateStats([]));

  const loadProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await productosService.getProductos();
      setProductos(data);
      setStats(calculateStats(data));
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const createProducto = useCallback(async (producto: ProductoFormData) => {
    setError(null);
    try {
      const productoCompleto: Omit<Producto, "id"> = {
        ...producto,
        tieneStockBajo: () => producto.stock < 10,
        estaAgotado: () => producto.stock === 0,
        obtenerPrecioFormateado: () => `$${producto.precio.toFixed(2)}`
      };
      await productosService.createProducto(productoCompleto);
      await loadProductos();
    } catch (err: any) {
      setError(err.message || 'Error al crear producto');
      throw err;
    }
  }, [loadProductos]);

  const updateProducto = useCallback(async (id: number, producto: Partial<Producto>) => {
    setError(null);
    try {
      await productosService.updateProducto(id, producto);
      await loadProductos();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar producto');
      throw err;
    }
  }, [loadProductos]);

  const deleteProducto = useCallback(async (id: number) => {
    setError(null);
    try {
      await productosService.deleteProducto(id);
      await loadProductos();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar producto');
      throw err;
    }
  }, [loadProductos]);

  const getCategorias = useCallback(async () => {
    try {
      const categoriasData = await productosService.getCategorias();
      setCategorias(categoriasData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar categorías');
      console.error('Error loading categories:', err);
    }
  }, []);

  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  return {
    productos,
    categorias,
    stats,
    loading,
    error,
    loadProductos,
    createProducto,
    updateProducto,
    deleteProducto,
    getCategorias,
  };
};