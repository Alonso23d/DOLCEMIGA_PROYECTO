import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { Usuario, LoginData } from '../models/Usuario';

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          setUsuario(authService.getCurrentUser());
        }
      } catch (err) {
        setError('Error al inicializar autenticación');
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (loginData: LoginData): Promise<Usuario> => {
    setLoading(true);
    setError(null);
    
    try {
      const { usuario } = await authService.login(loginData);
      setUsuario(usuario);
      return usuario; // 
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUsuario(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    usuario,
    loading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: !!usuario,
  };
};