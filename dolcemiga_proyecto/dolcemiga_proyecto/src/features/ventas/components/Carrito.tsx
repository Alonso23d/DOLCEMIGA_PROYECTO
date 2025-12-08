import type { CarritoItem } from '../../../features/ventas/models/Carritoitem';

interface CarritoProps {
  items: CarritoItem[];
  onUpdateCantidad: (productoId: number, cantidad: number) => void;
  onRemoveItem: (productoId: number) => void;
  onRealizarPedido: () => void;
  total: number;
  disabled?: boolean;
}

const Carrito: React.FC<CarritoProps> = ({
  items,
  onUpdateCantidad,
  onRemoveItem,
  onRealizarPedido,
  total,
  disabled = false
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
        <h2 className="text-xl font-semibold mb-4">Carrito de Compras</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-gray-500">El carrito está vacío</p>
          <p className="text-sm text-gray-400 mt-2">
            Agrega productos desde el catálogo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Carrito de Compras</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.productoId} className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm flex-1">{item.nombre}</h3>
              <button
                onClick={() => item.productoId && onRemoveItem(item.productoId)}
                className="text-red-500 hover:text-red-700 text-lg ml-2"
                title="Eliminar del carrito"
              >
                ×
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => item.productoId && onUpdateCantidad(item.productoId, item.cantidad - 1)}
                  className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                  disabled={item.cantidad <= 1}
                >
                  -
                </button>
                <span className="font-semibold w-8 text-center">{item.cantidad}</span>
                <button
                  onClick={() => item.productoId && onUpdateCantidad(item.productoId, item.cantidad + 1)}
                  className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-primary">
                  ${item.subtotal.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">
                  ${item.precio.toFixed(2)} c/u
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total y acciones */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="text-2xl font-bold text-primary">
            S/.{total.toFixed(2)}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 mb-4 text-center">
          {items.reduce((sum, item) => sum + item.cantidad, 0)} productos
        </div>

        <button
          onClick={onRealizarPedido}
          disabled={disabled}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {disabled ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Procesando...
            </>
          ) : (
            <>
              <span>💰</span>
              Realizar Pedido
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Carrito;