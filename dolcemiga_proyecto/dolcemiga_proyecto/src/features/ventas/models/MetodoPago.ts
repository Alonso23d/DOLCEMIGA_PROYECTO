export class MetodoPago {
    id: string; 
    nombre: string;

    constructor(data: any = {}) {
        this.id = data.id || 'efectivo';
        this.nombre = data.nombre || 'Efectivo';
    }
}