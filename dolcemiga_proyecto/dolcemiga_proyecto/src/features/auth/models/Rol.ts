export class Rol {
    id: number;
    nombre: string;
    descripcion: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.nombre = data.nombre || 'vendedor';
        this.descripcion = data.descripcion || '';
    }

    esAdmin(): boolean {
        return this.nombre === 'admin';
    }
}