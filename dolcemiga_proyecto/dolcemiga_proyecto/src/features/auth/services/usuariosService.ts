// src/features/auth/services/usuariosService.ts
import type { Usuario } from "../models/Usuario"; 
// Si no tienes el modelo Usuario definido, puedes usar 'any' o definirlo aquí mismo
// interface Usuario { id: string; username: string; nombre: string; rol: string; ... }

const API_URL = 'http://localhost:3001/usuarios';

export const usuariosService = {
  // Obtener todos los usuarios
  async getUsuarios() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar usuarios');
    return await response.json();
  },

  // Crear nuevo usuario
  async createUsuario(usuario: Omit<Usuario, 'id'>) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    return await response.json();
  },

  // Eliminar usuario
  async deleteUsuario(id: string) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return true;
  }
};