export interface LoginData {
  username: string;
  contra: string;
}


export interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
  login: (loginData: LoginData) => Promise<Usuario>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
}


export class Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'vendedor';
  activo: boolean;
  contra?: string;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.username = data.username || '';
    this.email = data.email || '';
    this.nombre = data.nombre || '';
    this.rol = data.rol || 'vendedor';
    this.activo = data.activo ?? true;
  }

  esAdmin(): boolean {
    return this.rol === 'admin';
  }
}