export class PedidoInputDTO{
  constructor(compradorId, items, moneda, direccionEntrega) {
    this.compradorId = compradorId
    this.items = items 
    this.moneda = moneda 
    this.direccionEntrega = direccionEntrega
  }

  getCompradorId = () => this.compradorId
  getItems = () => this.items
  getMoneda = () => this.moneda
  getDireccionEntrega = () => this.direccionEntrega
}