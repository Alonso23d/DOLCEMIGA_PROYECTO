import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './core/contexts/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import Sidebar from './components/layout/Sidebar'
import Inicio from './pages/Inicio'
import Ventas from './pages/Ventas'
import Inventario from './pages/Inventario'
import Pedidos from './pages/Pedidos'
import Reportes from './pages/Reportes'
import Usuarios from './pages/Usuarios' // <--- IMPORTANTE: Importar la nueva página

const AppLayout = () => (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    
    <Sidebar />
    
    <main className="flex-1 overflow-y-auto p-6">
      <div className="container mx-auto">
        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/usuarios" element={<Usuarios />} /> {/* <--- NUEVA RUTA AGREGADA */}
        </Routes>
      </div>
    </main>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }/>
      </Routes>
    </AuthProvider>
  )
}

export default App