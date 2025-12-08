import type { Usuario, LoginData } from '../../../features/auth/models/Usuario';

const API_URL = 'http://localhost:3001';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(loginData: LoginData): Promise<{ usuario: Usuario; token: string }> {
    await delay(1000);

    const response = await fetch(`${API_URL}/usuarios`);
    const usuarios: Usuario[] = await response.json();

    const usuario = usuarios.find(
      u => u.username === loginData.username && 
           u.contra === loginData.contra &&
           u.activo
    );

    if (!usuario) {
      throw new Error('Credenciales incorrectas o usuario inactivo');
    }

    const usuarioSinContra: Usuario = {
      id: usuario.id,
      username: usuario.username,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      activo: usuario.activo,
      esAdmin: function (): boolean {
        throw new Error('Function not implemented.');
      }
    };
    
    const token = btoa(JSON.stringify({
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      exp: Date.now() + (24 * 60 * 60 * 1000)
    }));

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioSinContra));

    return {
      usuario: usuarioSinContra,
      token
    };
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const tokenData = JSON.parse(atob(token));
      return tokenData.exp > Date.now();
    } catch {
      return false;
    }
  },

  getCurrentUser(): Usuario | null {
    try {
      const usuarioStr = localStorage.getItem('usuario');
      return usuarioStr ? JSON.parse(usuarioStr) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};