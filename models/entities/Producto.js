import { v4 as uuidv4 } from 'uuid';
import { NotEnoughStockError } from '../../errors/ProductosErrors.js';

export class Producto{
    constructor(vendedor,titulo,descripcion,categorias,precio,moneda,stock,fotos){
        this.vendedor = vendedor;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categorias = categorias;
        this.precio = precio;
        this.moneda = moneda;
        this.stock = stock;
        this.ventas = 0;
        this.fotos = fotos;
        this.activo = true;
    }

    estaDisponible(cantidad){
        if(this.stock < cantidad){
            throw new NotEnoughStockError("No hay suficiente stock para el producto con id " + this.id);
        }
    }

    reducirStock(cantARestar){
        if(this.stock-cantARestar>=0){
            this.stock-=cantARestar;
        }else{
            throw new Error("No hay stock suficiente");
        }
    }
    
    aumentarVentas(cantidad){ 
        this.ventas+=cantidad;
    }
    aumentarStock(cantidad){
        this.stock+=cantidad;
    }

}