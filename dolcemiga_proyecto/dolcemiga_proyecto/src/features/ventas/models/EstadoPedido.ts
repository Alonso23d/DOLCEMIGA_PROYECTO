export class EstadoPedido {
    codigo: 'pendiente' | 'completado' | 'cancelado';
    descripcion: string;

    constructor(data: any = {}) {
        this.codigo = data.codigo || 'pendiente';
        this.descripcion = data.descripcion || 'Pedido registrado';
    }
}