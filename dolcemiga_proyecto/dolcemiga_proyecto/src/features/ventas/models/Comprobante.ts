export class Comprobante {
    serie: string;
    numero: number;
    tipo: 'BOLETA' | 'FACTURA';
    total: number;
    igv: number;

    constructor(data: any = {}) {
        this.serie = data.serie || 'B001';
        this.numero = data.numero || 0;
        this.tipo = data.tipo || 'BOLETA';
        this.total = Number(data.total) || 0;
        this.igv = this.total - (this.total / 1.18);
    }
}