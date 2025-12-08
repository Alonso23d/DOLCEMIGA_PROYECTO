export class Cliente {
    dni: string;
    nombres: string;
    telefono: string;

    constructor(data: any = {}) {
        this.dni = data.dni || '';
        this.nombres = data.nombres || '';
        this.telefono = data.telefono || '';
    }
}