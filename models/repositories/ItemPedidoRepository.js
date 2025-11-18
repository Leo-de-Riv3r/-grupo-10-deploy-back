import mongoose from "mongoose";
import ItemPedidoModel from "../schemas/ItemPedidoModel.js";

export class ItemPedidoRepository {
    
    async save(itemPedido) {
        const itemPedidoModel = new ItemPedidoModel(itemPedido);
        console.log(itemPedidoModel)
        return await itemPedidoModel.save();
    }
    
    async updateEstado(itemId, nuevoEstado) {
        return await ItemPedidoModel.findByIdAndUpdate(itemId, { estado: nuevoEstado }, { new: true });
    }

    async findById(id) {
        return await ItemPedidoModel.findById(id)
            .populate('producto')
            .populate('idPedido');
    }

    async findByVendedorId(vendedorId, page = 1, perPage = 10) {
        const skip = (page - 1) * perPage;
        return await ItemPedidoModel.find({ vendedorId: mongoose.Types.ObjectId(vendedorId) })
            .skip(skip)
            .limit(perPage)
            .populate('producto')
            .populate('idPedido');
    }

}