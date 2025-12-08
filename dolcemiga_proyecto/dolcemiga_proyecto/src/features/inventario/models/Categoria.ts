export class Categoria {
    id: number;
    nombre: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.nombre = data.nombre || '';
    }
}