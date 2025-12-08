import { DetallePedido } from './DetallePedido';

export class CarritoItem extends DetallePedido {
    constructor(data: any = {}) {
        super(data);
    }
    
    // Método útil para el frontend
    aumentarCantidad() {
        this.cantidad++;
        this.calcularSubtotal();
    }
}