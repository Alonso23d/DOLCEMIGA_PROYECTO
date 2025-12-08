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

const AppLayout = () => (
  <div className="flex">
    <Sidebar />
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
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
