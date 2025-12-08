import type { Categoria } from '../../../features/inventario/models/Categoria';
import type { Producto } from '../models/Producto';

const API_URL = 'http://localhost:3001';

export const productosService = {
  async getProductos(): Promise<Producto[]> {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return response.json();
  },

  async getProductoById(id: number): Promise<Producto> {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el producto');
    }
    return response.json();
  },

  async createProducto(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) {
      throw new Error('Error al crear producto');
    }
    return response.json();
  },

  async updateProducto(id: number, producto: Partial<Producto>): Promise<Producto> {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar producto');
    }
    return response.json();
  },

  async deleteProducto(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar producto');
    }
  },

  async getCategorias(): Promise<string[]> {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }
    const categorias: Categoria[] = await response.json();
    return categorias.map(cat => cat.nombre);
  }
};