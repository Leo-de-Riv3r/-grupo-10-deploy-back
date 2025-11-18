import {EstadoPedido} from "./enums/EstadoPedido.js"
import {Pedido} from "./Pedido.js"
import {Notificacion} from "./Notificacion.js"

export class FactoryNotificacion{
    constructor(traductor) {
      this.lenguaje = "ES"
      this.traductor = traductor
    }

    crearSegunEstadoPedido = (estadoPedido) => {
      return this.traductor.traducir(estadoPedido, this.lenguaje)
    }

    crearSegunPedido(pedido, usuarioDestino){
      //const vendedor = pedido.items[0].producto.vendedor; // cada pedido tendria un mismo vendedor
      /*
      const productosEnString = pedido.items.map(item => {
        item.producto.titulo
      }).join(", ")*/
      //const mensaje = `\nNuevo pedido de ${pedido.comprador.nombre}.\nProductos: ${productosEnString}\nTotal: ${pedido.total}\nDireccion de entrega: ${pedido.direccionEntrega}`
      const mensaje = this.crearSegunEstadoPedido(pedido.estado)

      const notificacion = new Notificacion(usuarioDestino,mensaje);
      return notificacion
    }

    cambiarLenguaje = (nuevoLenguaje) => {
      this.lenguaje = nuevoLenguaje
    }
}