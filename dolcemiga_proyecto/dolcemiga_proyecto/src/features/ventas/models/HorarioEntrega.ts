export class HorarioEntrega {
    fecha: Date;
    hora: string; // Ej: "15:00"
    personaAutorizada: string; // Quién recoge

    constructor(data: any = {}) {
        // Por defecto es para hoy
        this.fecha = data.fecha ? new Date(data.fecha) : new Date();
        this.hora = data.hora || '12:00';
        this.personaAutorizada = data.personaAutorizada || 'El mismo cliente';
    }

    // Regla de Negocio: No se puede programar recojo en el pasado
    esFechaValida(): boolean {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Ignoramos la hora para comparar solo fechas
        
        const fechaEntrega = new Date(this.fecha);
        fechaEntrega.setHours(0, 0, 0, 0);

        return fechaEntrega >= hoy;
    }

    // Regla de Negocio: Validar horario de atención (ej: 9am a 8pm)
    estaEnHorarioAtencion(): boolean {
        const [horas] = this.hora.split(':').map(Number);
        return horas >= 9 && horas <= 20;
    }

    obtenerResumen(): string {
        return `${this.fecha.toLocaleDateString()} a las ${this.hora} hrs. Recoge: ${this.personaAutorizada}`;
    }
}