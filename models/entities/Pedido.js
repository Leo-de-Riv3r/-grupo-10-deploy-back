import  CambioEstadoPedido  from "./CambioEstadoPedido.js";
import  DireccionEntrega  from "./DireccionEntrega.js";
import { EstadoPedido } from "./enums/EstadoPedido.js";
import { TipoUsuario } from "./enums/TipoUsuario.js";
import { ItemPedido } from "./ItemPedido.js";
import {Usuario} from "./Usuario.js";
import { v4 as uuidv4 } from 'uuid';


export class Pedido {
  constructor(usuario,items,moneda,direccionEntrega) {
    this.comprador = usuario
    this.items = items.map(item => item._id);
    this.total = this.calcularTotal();
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega
    this.estado;
    this.fechaCreacion = new Date();
    this.historialEstados = [new CambioEstadoPedido(EstadoPedido.PENDIENTE, this, usuario, 'Pedido creado')];
  } 
  
  calcularTotal() {
    return this.items.reduce((acum, item) => acum + item.subtotal(), 0);
  }

  actualizarEstado = (nuevoEstado, quien, motivo)  => {
    let cambio = new CambioEstadoPedido(nuevoEstado, this, quien, motivo)
    this.historialEstados.push(cambio)
    this.estado = nuevoEstado
  }

  validarStock = () => this.items.reduce((itemAnt, itemAct) => itemAnt && itemAct.getProducto().estaDisponible(itemAct.getCantidad()), true)

  agregarEstadoInicial(usuario) {
    if (this.historialEstados.length === 0) {
      this.historialEstados.push(
        new CambioEstadoPedido(EstadoPedido.PENDIENTE, this, usuario._id, 'Pedido creado')
      );
      this.estado = EstadoPedido.PENDIENTE;
    }
  }

  
  static fromDB(doc) {
    const pedido = new Pedido(
      doc.comprador, 
      doc.items, 
      doc.moneda, 
      doc.direccionEntrega);
    pedido._id = doc._id;
    pedido.estado = doc.estado;
    pedido.historialEstados = doc.historialEstados || [];
    pedido.fechaCreacion = doc.fechaCreacion;
    pedido.total = doc.total;
    return pedido;
  }


}
