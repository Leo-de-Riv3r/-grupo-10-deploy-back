import mongoose from "mongoose";
import { Pedido } from "../entities/Pedido.js";
import { v4 as uuidv4 } from 'uuid';
import { direccionEntregaSchema } from "./direccionEntregaSchema.js";
import { cambioEstadoPedidoSchema } from "./cambioEstadoPedidoSchema.js"; 
import { EstadoPedido } from "../entities/enums/EstadoPedido.js";
import { ca } from "zod/v4/locales";
import { itemPedidoSchema } from "./ItemPedidoModel.js";

const pedidoSchema = new mongoose.Schema({
  comprador: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: true 
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ItemPedido' }],
  total: { type: Number},
  moneda: { type: String, required: true },
  direccionEntrega: direccionEntregaSchema,
  estado: { type: String, enum: Object.values(EstadoPedido), default: EstadoPedido.PENDIENTE },
  fechaCreacion: { type: Date, default: Date.now },
  historialEstados: [cambioEstadoPedidoSchema],
},{
    timestamps: true,
    collection: 'pedidos'
});

pedidoSchema.loadClass(Pedido);

const pedidoModel = mongoose.model('Pedido', pedidoSchema);
export default pedidoModel;