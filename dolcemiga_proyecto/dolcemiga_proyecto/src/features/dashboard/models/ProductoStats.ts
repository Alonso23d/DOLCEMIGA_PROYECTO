export class ProductoStats {
    totalProductos: number;
    productosStockBajo: number;
    valorTotalInventario: number;
    productosAgotados: number;

    constructor(data: any = {}) {
        this.totalProductos = data.totalProductos || 0;
        this.productosStockBajo = data.productosStockBajo || 0;
        this.valorTotalInventario = Number(data.valorTotal) || 0; // Asegura que sea número
        this.productosAgotados = data.productosAgotados || 0;
    }

    obtenerTicketPromedio(): number {
        if (this.totalProductos === 0) return 0;
        return this.valorTotalInventario / this.totalProductos;
    }

    esEstadoCritico(): boolean {
        // Si más del 20% de productos tienen stock bajo o nulo, es crítico
        const productosProblema = this.productosStockBajo + this.productosAgotados;
        return (productosProblema / this.totalProductos) > 0.20;
    }

    obtenerValorFormateado(): string {
        return `S/ ${this.valorTotalInventario.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    }
}