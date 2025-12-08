export class MovimientoStock {
    id: number;
    productoId: number;
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    fecha: Date;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.productoId = data.productoId || 0;
        this.tipo = data.tipo || 'ENTRADA';
        this.cantidad = data.cantidad || 0;
        this.fecha = new Date();
    }
}