import { email } from "zod";

export default class CambioEstadoPedido {
  constructor(estado, pedido, usuario, motivo){
    this.fecha = new Date();
    this.estado = estado;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}
 