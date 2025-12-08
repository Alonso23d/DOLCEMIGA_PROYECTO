import { useState } from 'react';
import { Cliente } from '../models/Cliente'; 
import { CarritoItem } from '../models/Carritoitem';

interface ModalPedidoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cliente: Cliente, metodoPago: string, total: number) => void;
  items: CarritoItem[];
  total: number;
  loading?: boolean;
}

const ModalPedido: React.FC<ModalPedidoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  items,
  total,
  loading = false
}) => {
  const [cliente, setCliente] = useState<Cliente>({
    dni: '',
    nombres: '',
    telefono: ''
  });
  const [metodoPago, setMetodoPago] = useState('efectivo');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente.dni || !cliente.nombres || !cliente.telefono) {
      alert('Por favor complete todos los datos del cliente');
      return;
    }
    onConfirm(cliente, metodoPago, total);
    setCliente({ dni: '', nombres: '', telefono: '' });
    setMetodoPago('efectivo');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">Confirmar Pedido</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumen del Pedido */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productoId} className="flex justify-between text-sm">
                    <span>{item.nombre} x {item.cantidad}</span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Datos del Cliente</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DNI *
                  </label>
                  <input
                    type="text"
                    value={cliente.dni}
                    onChange={(e) => setCliente(prev => ({ ...prev, dni: e.target.value }))}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Ingrese DNI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres Completos *
                  </label>
                  <input
                    type="text"
                    value={cliente.nombres}
                    onChange={(e) => setCliente(prev => ({ ...prev, nombres: e.target.value }))}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Ingrese nombres completos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={cliente.telefono}
                    onChange={(e) => setCliente(prev => ({ ...prev, telefono: e.target.value }))}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Ingrese teléfono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago *
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="yape">Yape</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      'Confirmar Pedido'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPedido;