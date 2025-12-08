import type { Pedido } from '../../../features/ventas/models/Pedido'; 

const API_URL = 'http://localhost:3001';

export const ventasService = {
  async crearPedido(pedido: Omit<Pedido, 'id'>): Promise<Pedido> {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });
    if (!response.ok) {
      throw new Error('Error al crear pedido');
    }
    return response.json();
  },

  async getPedidos(): Promise<Pedido[]> {
    const response = await fetch(`${API_URL}/pedidos`);
    if (!response.ok) {
      throw new Error('Error al obtener pedidos');
    }
    return response.json();
  },

  async actualizarEstadoPedido(id: number, estado: Pedido['estado']): Promise<Pedido> {
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar pedido');
    }
    return response.json();
  }
};