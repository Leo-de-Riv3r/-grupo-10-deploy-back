import mongoose from "mongoose";
import cambioEstadoPedido from "../entities/CambioEstadoPedido.js";


const cambioEstadoPedidoSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    estado: { type: String, required: true },
    pedido: { type: String, ref: 'Pedido', required: false },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    motivo: { type: String }
},{_id: false});

cambioEstadoPedidoSchema.loadClass(cambioEstadoPedido);

const CambioEstadoPedidoModel = mongoose.model("CambioEstadoPedido", cambioEstadoPedidoSchema);

export default CambioEstadoPedidoModel;
export { cambioEstadoPedidoSchema };
