// src/pages/Usuarios.tsx
import { useState, useEffect } from 'react'
import { UserPlus, Trash2, Shield, User } from 'lucide-react'
import { usuariosService } from '../features/auth/services/usuariosService'

// Definimos la interfaz aquí para asegurar los tipos
interface UsuarioDB {
  id: string;
  username: string;
  nombre: string;
  rol: string;
  contra: string; // En tu db.json se llama 'contra', no 'password'
  email?: string;
  activo: boolean;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioDB[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  // Estado para el formulario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    username: '',
    contra: '',
    rol: 'vendedor', // Valor por defecto coincidiendo con db.json
    email: ''
  })

  // 1. CARGAR USUARIOS REALES AL INICIAR
  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      const data = await usuariosService.getUsuarios()
      setUsuarios(data)
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  // 2. ELIMINAR USUARIO REAL
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await usuariosService.deleteUsuario(id)
        // Recargamos la lista para ver los cambios
        loadUsuarios()
      } catch (error) {
        alert('Error al eliminar usuario')
      }
    }
  }

  // 3. CREAR USUARIO REAL
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Preparamos el objeto tal como lo espera db.json
      const usuarioAGuardar = {
        ...nuevoUsuario,
        email: nuevoUsuario.email || `${nuevoUsuario.username}@dolcemiga.com`, // Email por defecto si no pone nada
        activo: true
      }

      await usuariosService.createUsuario(usuarioAGuardar as any)
      
      // Limpiamos y recargamos
      setShowModal(false)
      setNuevoUsuario({ nombre: '', username: '', contra: '', rol: 'vendedor', email: '' })
      loadUsuarios()
      alert('Usuario creado correctamente')
      
    } catch (error) {
      console.error(error)
      alert('Error al crear el usuario')
    }
  }

  if (loading) return <div className="p-6">Cargando usuarios...</div>

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-primary">Gestión de Usuarios</h1>
           <p className="text-gray-500">Administra el acceso al sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2 font-medium"
        >
          <UserPlus size={20} /> Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
             <tr>
               <th className="px-6 py-4">Usuario</th>
               <th className="px-6 py-4">Nombre Completo</th>
               <th className="px-6 py-4">Rol</th>
               <th className="px-6 py-4 text-center">Acciones</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {usuarios.map(user => (
               <tr key={user.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                 <td className="px-6 py-4 text-gray-600">{user.nombre}</td>
                 <td className="px-6 py-4">
                   {/* Lógica visual para los roles (mapeamos 'admin' a visual 'Administrador') */}
                   <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                     user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                   }`}>
                     {user.rol === 'admin' ? <Shield size={12}/> : <User size={12}/>}
                     {user.rol === 'admin' ? 'Administrador' : 'Vendedor'}
                   </span>
                 </td>
                 <td className="px-6 py-4 text-center">
                    {user.username !== 'admin' && ( 
                        <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                            title="Eliminar usuario"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {/* MODAL NUEVO USUARIO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-primary px-6 py-4">
                <h3 className="text-white font-bold text-lg">Nuevo Usuario</h3>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input 
                        required
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                        value={nuevoUsuario.nombre}
                        onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                            value={nuevoUsuario.username}
                            onChange={e => setNuevoUsuario({...nuevoUsuario, username: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <select 
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none bg-white"
                            value={nuevoUsuario.rol}
                            onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
                        >
                            <option value="vendedor">Vendedor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input 
                        required
                        type="password" 
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                        value={nuevoUsuario.contra}
                        onChange={e => setNuevoUsuario({...nuevoUsuario, contra: e.target.value})}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button 
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Guardar Usuario
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Usuarios