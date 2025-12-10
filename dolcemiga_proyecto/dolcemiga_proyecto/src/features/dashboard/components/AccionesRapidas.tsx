import { useNavigate } from "react-router-dom"
import { DollarSign, Package, ClipboardList, FileText, AlertTriangle } from "lucide-react"

interface AccionesRapidasProps {
  stockBajo: number;
}

export default function AccionesRapidas({ stockBajo }: AccionesRapidasProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="font-semibold text-gray-700">Acciones Rápidas</h3>
      
      {/* Botones Grandes de Colores */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        
        {/* Nueva Venta - Color Vino/Rojo oscuro */}
        <button
          onClick={() => navigate("/ventas")}
          className="bg-[#881337] hover:bg-[#9f1239] text-white p-4 rounded-lg shadow flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <DollarSign size={28} />
          <span className="font-medium">Nueva Venta</span>
        </button>

        {/* Gestionar Inventario - Azul */}
        <button
          onClick={() => navigate("/inventario")}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Package size={28} />
          <span className="font-medium">Gestionar Inventario</span>
        </button>

        {/* Ver Pedidos - Verde */}
        <button
          onClick={() => navigate("/pedidos")}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg shadow flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <ClipboardList size={28} />
          <span className="font-medium">Ver Pedidos</span>
        </button>

        {/* Generar Reporte - Morado */}
        <button
          onClick={() => navigate("/reportes")}
          className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg shadow flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <FileText size={28} />
          <span className="font-medium">Generar Reporte</span>
        </button>
      </div>

      {/* Sección de Alertas (Estilo imagen) */}
      <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-3 text-red-700">
        <AlertTriangle size={20} />
        <span className="text-sm font-medium">
            Alertas: {stockBajo > 0 ? `${stockBajo} producto(s) con stock bajo` : "No hay alertas de stock"}
        </span>
      </div>
    </div>
  )
}