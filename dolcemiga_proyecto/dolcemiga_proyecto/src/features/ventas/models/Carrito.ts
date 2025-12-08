import { CarritoItem } from './Carritoitem';

export class Carrito {
    items: CarritoItem[];

    constructor() {
        this.items = [];
    }

    agregar(item: CarritoItem) {
        const existente = this.items.find(i => i.productoId === item.productoId);
        if (existente) {
            existente.cantidad += item.cantidad;
            existente.calcularSubtotal();
        } else {
            this.items.push(item);
        }
    }

    obtenerTotal(): number {
        return this.items.reduce((acc, item) => acc + item.subtotal, 0);
    }
}