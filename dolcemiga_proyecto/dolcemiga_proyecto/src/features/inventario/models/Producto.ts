// Mantenemos el DTO del formulario para no romper tu FormularioProducto.tsx
export interface ProductoFormData {
    nombre: string;
    stock: number;
    precio: number;
    categoria: string;
    imagen: string;
    descripcion?: string;
}

export class Producto {
    id: number;
    nombre: string;
    stock: number;
    precio: number;
    categoria: string;
    imagen: string;
    descripcion?: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.nombre = data.nombre || '';
        this.stock = Number(data.stock) || 0;
        this.precio = Number(data.precio) || 0;
        this.categoria = data.categoria || 'General';
        this.imagen = data.imagen || '';
        this.descripcion = data.descripcion || '';
    }

    tieneStockBajo(): boolean {
        return this.stock < 5 && this.stock > 0;
    }

    estaAgotado(): boolean {
        return this.stock === 0;
    }

    obtenerPrecioFormateado(): string {
        return `S/ ${this.precio.toFixed(2)}`;
    }
}