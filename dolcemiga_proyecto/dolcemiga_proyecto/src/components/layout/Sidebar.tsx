import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../core/contexts/AuthContext'
import { Home, DollarSign, Package, ClipboardList, BarChart2, Users } from 'lucide-react' // Usaremos lucide-react si lo tienes instalado

const Sidebar = () => {
  const location = useLocation()
  const { usuario, logout } = useAuthContext()

  // Definimos items básicos para todos
  const baseMenuItems = [
    { path: '/inicio', label: 'Inicio', icon: '🏠' },
    { path: '/ventas', label: 'Ventas', icon: '💰' },
    { path: '/inventario', label: 'Inventario', icon: '📦' },
    { path: '/pedidos', label: 'Pedidos', icon: '📋' },
    { path: '/reportes', label: 'Reportes', icon: '📊' },
  ]

  // Si es admin, agregamos el item de Usuarios
  // Cambiamos 'Administrador' por 'admin' para que coincida con tu tipo de TypeScript
const menuItems = usuario?.rol === 'admin' 
  ? [...baseMenuItems, { path: '/usuarios', label: 'Usuarios', icon: <Users size={20} /> }] // Asegúrate de importar Users de lucide-react o poner el emoji '👥'
  : baseMenuItems
  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout()
    }
  }

  return (
    <aside className="w-64 h-full flex-shrink-0 bg-gradient-to-b from-primary to-[#6a0a3a] text-white p-6 shadow-lg flex flex-col">
      
      {/* Logo/Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dolce Miga</h2>
        <p className="text-sm text-gray-200 mt-1">Pastelería</p>
      </div>

      {/* Información del usuario */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{usuario?.nombre}</p>
            <p className="text-xs text-gray-300 capitalize">{usuario?.rol}</p>
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`w-full block py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-3 hover:translate-x-1 ${
                  isActive(item.path)
                    ? 'bg-white bg-opacity-30 font-semibold'
                    : 'hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="pt-4 border-t border-white/20 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-red-200 hover:text-red-100"
        >
          <span className="text-lg">🚪</span>
          <span>Cerrar Sesión</span>
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-300">
            {usuario?.username} • v1.0
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar