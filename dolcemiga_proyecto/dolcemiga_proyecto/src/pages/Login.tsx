import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../core/contexts/AuthContext' // ← CORREGIDO

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    contra: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuthContext() // ← CORREGIDO
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(loginData)
      navigate('/inicio')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const usuariosPrueba = [
    { username: 'admin', contra: 'admin123', rol: 'Administrador' },
    { username: 'vendedor', contra: 'vendedor123', rol: 'Vendedor' },
    { username: 'maria', contra: 'maria123', rol: 'Vendedor' }
  ]

  const llenarCredenciales = (username: string, contra: string) => {
    setLoginData({ username, contra })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-pink-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🍰</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Dolce Miga</h1>
          <p className="text-white/80 mt-2">Pastelería & Repostería</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Ingresa a tu cuenta
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="contra"
                value={loginData.contra}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              Usuarios de prueba para desarrollo:
            </p>
            <div className="space-y-2">
              {usuariosPrueba.map((usuario, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => llenarCredenciales(usuario.username, usuario.contra)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  <div className="font-medium text-gray-900">{usuario.username}</div>
                  <div className="text-gray-600">Contraseña: {usuario.contra}</div>
                  <div className="text-primary text-xs">Rol: {usuario.rol}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/70 text-sm">
            Sistema de Gestión - Dolce Miga Pastelería
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
