import { useState, useCallback } from 'react';
import { ventasService } from '../services/ventasService';
import { productosService } from '../../inventario/services/productosService';
// Importamos las Clases (ya no solo "type")
import { Pedido } from '../../../features/ventas/models/Pedido';
import { CarritoItem } from '../../../features/ventas/models/Carritoitem'; 
import { Producto } from '../../../features/inventario/models/Producto';
import { Cliente } from '../../../features/ventas/models/Cliente';

interface UseVentasReturn {
  carrito: CarritoItem[];
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  agregarAlCarrito: (producto: Producto) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  eliminarDelCarrito: (productoId: number) => void;
  limpiarCarrito: () => void;
  realizarPedido: (cliente: Cliente, metodoPago: string) => Promise<void>;
  cargarPedidos: () => Promise<void>;
  actualizarEstadoPedido: (id: number, estado: 'pendiente' | 'completado' | 'cancelado') => Promise<void>;
  totalCarrito: number;
}

export const useVentas = (): UseVentasReturn => {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregarAlCarrito = useCallback((producto: Producto) => {
    setCarrito(prev => {
      const existingItemIndex = prev.findIndex(item => item.productoId === producto.id);
      
      if (existingItemIndex >= 0) {
        const itemActual = prev[existingItemIndex];

        if (itemActual.cantidad >= producto.stock) {
          setError(`No hay suficiente stock. Disponible: ${producto.stock}`);
          return prev;
        }

        const itemsActualizados = [...prev];
        const itemActualizado = new CarritoItem({
            ...itemActual, 
            cantidad: itemActual.cantidad + 1
        });
        
        itemActualizado.calcularSubtotal();
        
        itemsActualizados[existingItemIndex] = itemActualizado;
        return itemsActualizados;
      }

      const nuevoItem = new CarritoItem({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        subtotal: producto.precio
      });
      nuevoItem.calcularSubtotal();

      return [...prev, nuevoItem];
    });
  }, []);

  const actualizarCantidad = useCallback((productoId: number, cantidad: number) => {
    if (cantidad < 1) return;
    
    setCarrito(prev =>
      prev.map(item => {
        if (item.productoId === productoId) {

          const itemActualizado = new CarritoItem({
             ...item,
             cantidad: cantidad
          });
          itemActualizado.calcularSubtotal();
          return itemActualizado;
        }
        return item;
      })
    );
  }, []);

  const eliminarDelCarrito = useCallback((productoId: number) => {
    setCarrito(prev => prev.filter(item => item.productoId !== productoId));
  }, []);

  const limpiarCarrito = useCallback(() => {
    setCarrito([]);
    setError(null);
  }, []);

  const realizarPedido = useCallback(async (cliente: Cliente, metodoPago: string) => {
    if (carrito.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const itemsValidos = carrito.filter(item => item.productoId !== undefined);
    
    if (itemsValidos.length === 0) {
      throw new Error('No hay productos válidos en el carrito');
    }

    setLoading(true);
    setError(null);

    try {
      const total = itemsValidos.reduce((sum, item) => sum + item.subtotal, 0);
      
      const nuevoPedido = new Pedido({
        cliente,
        productos: itemsValidos, 
        total,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        metodoPago
      });

      await ventasService.crearPedido(nuevoPedido);
      
      for (const item of itemsValidos) {
        if (item.productoId) {
          try {
            const producto = await productosService.getProductoById(item.productoId);
            if (producto && producto.id) {
              await productosService.updateProducto(producto.id, {
                ...producto,
                stock: producto.stock - item.cantidad
              });
            }
          } catch (err) {
            console.error(`Error actualizando stock del producto ${item.productoId}:`, err);
          }
        }
      }

      limpiarCarrito();
    } catch (err: any) {
      setError(err.message || 'Error al realizar el pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [carrito, limpiarCarrito]);

  const cargarPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ventasService.getPedidos();
      const pedidosInstanciados = Array.isArray(data) 
        ? data.map((p: any) => new Pedido(p)) 
        : [];
      setPedidos(pedidosInstanciados);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarEstadoPedido = useCallback(async (id: number, estado: 'pendiente' | 'completado' | 'cancelado') => {
    setError(null);
    try {
      await ventasService.actualizarEstadoPedido(id, estado);
      await cargarPedidos();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar pedido');
      throw err;
    }
  }, [cargarPedidos]);

  const totalCarrito = carrito.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    carrito,
    pedidos,
    loading,
    error,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,
    realizarPedido,
    cargarPedidos,
    actualizarEstadoPedido,
    totalCarrito,
  };
};