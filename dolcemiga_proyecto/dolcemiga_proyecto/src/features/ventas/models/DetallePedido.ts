export class DetallePedido {
    productoId: number;
    nombre: string;
    precio: number;
    cantidad: number;
    subtotal: number;

    constructor(data: any = {}) {
        this.productoId = data.productoId || 0;
        this.nombre = data.nombre || '';
        this.precio = Number(data.precio) || 0;
        this.cantidad = Number(data.cantidad) || 0;
        this.subtotal = Number(data.subtotal) || 0;
    }

    calcularSubtotal(): void {
        this.subtotal = this.precio * this.cantidad;
    }
}