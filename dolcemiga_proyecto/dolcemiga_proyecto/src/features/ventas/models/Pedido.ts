import { Cliente } from './Cliente';
import { DetallePedido } from './DetallePedido';

// TU CLASE PEDIDO (DOMINIO)
export class Pedido {
    id?: number;
    cliente: Cliente;             // Ahora usa la Clase Cliente
    productos: DetallePedido[];   // Ahora usa la Clase DetallePedido
    total: number;
    fecha: string;                // Mantengo string porque así lo tenías
    estado: 'pendiente' | 'completado' | 'cancelado';
    metodoPago: string;

    constructor(data: any = {}) {
        this.id = data.id;
        // Adaptación: Convertimos los datos planos a Clases
        this.cliente = data.cliente ? new Cliente(data.cliente) : new Cliente();
        
        this.productos = Array.isArray(data.productos) 
            ? data.productos.map((p: any) => new DetallePedido(p)) 
            : [];
            
        this.total = data.total || 0;
        this.fecha = data.fecha || new Date().toISOString();
        this.estado = data.estado || 'pendiente';
        this.metodoPago = data.metodoPago || 'efectivo';
    }

    calcularTotalItems(): number {
        return this.productos.reduce((acc, item) => acc + item.cantidad, 0);
    }
}