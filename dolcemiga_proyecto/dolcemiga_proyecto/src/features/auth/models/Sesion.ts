export class Sesion {
    token: string;
    fechaInicio: Date;
    ip: string;

    constructor(data: any = {}) {
        this.token = data.token || '';
        this.fechaInicio = new Date();
        this.ip = data.ip || '127.0.0.1';
    }

    estaActiva(): boolean {
        // La sesión dura 8 horas
        const horas = (new Date().getTime() - this.fechaInicio.getTime()) / 36e5;
        return horas < 8;
    }
}