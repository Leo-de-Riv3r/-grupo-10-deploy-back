import mongoose from "mongoose"
import { ItemPedido } from '../entities/ItemPedido.js'
import { EstadoPedido } from "../entities/enums/EstadoPedido.js";

const itemPedidoSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  precioUnitario: {
    type: Number,
    required: true
  },
  estado: {
    type: String, 
    enum: Object.values(EstadoPedido),
    default: EstadoPedido.PENDIENTE
  },
  idPedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido',
    required: true
  }
})
itemPedidoSchema.loadClass(ItemPedido)

const ItemProductoModel = mongoose.model('ItemPedido', itemPedidoSchema)
export default ItemProductoModel;

export { itemPedidoSchema };