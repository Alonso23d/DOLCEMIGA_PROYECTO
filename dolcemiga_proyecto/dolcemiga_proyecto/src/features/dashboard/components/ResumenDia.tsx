interface ResumenDiaProps {
  ventasHoy: number;
  pedidosHoy: number;
  clientesNuevos: number;
  stockBajo: number;
}

export default function ResumenDia({ ventasHoy, pedidosHoy, clientesNuevos, stockBajo }: ResumenDiaProps) {
  return (
    <div className="bg-[#BE125F] text-white p-4 rounded-lg shadow-lg mt-6">
      <h3 className="font-bold text-lg mb-4 border-b border-pink-400 pb-2">Resumen del Día</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        
        <div>
          <div className="text-2xl font-bold">S/{ventasHoy.toFixed(2)}</div>
          <div className="text-xs text-pink-200 uppercase">Ventas Hoy</div>
        </div>

        <div>
          <div className="text-2xl font-bold">{pedidosHoy}</div>
          <div className="text-xs text-pink-200 uppercase">Pedidos Hoy</div>
        </div>

        <div>
          <div className="text-2xl font-bold">{clientesNuevos}</div>
          <div className="text-xs text-pink-200 uppercase">Clientes Nuevos</div>
        </div>

        <div>
          <div className="text-2xl font-bold">{stockBajo}</div>
          <div className="text-xs text-pink-200 uppercase">Alertas Stock</div>
        </div>

      </div>
    </div>
  )
}