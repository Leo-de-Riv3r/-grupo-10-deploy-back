import PedidoModel from "../schemas/pedidoSchema.js";
import { NoPedidosYet } from "../../errors/PedidosErrors.js";

export class PedidoRepository {
    
    async findByPage(numeroPagina,elemPorPagina,filtros){
        const query = {};
        const allowedFilters = ['maxPrice', 'estado', 'usuarioId', 'pedidoId', 'vendedorId'];
        const invalidFilters = Object.keys(filtros).filter(key => !allowedFilters.includes(key));

        if (invalidFilters.length > 0) {
            throw new Error(`Filtros inválidos: ${invalidFilters.join(', ')}`);
        }


        if(filtros.maxPrice){ query.total = { $lte: filtros.maxPrice }; }
        if(filtros.estado){ query.estado = filtros.estado; }
        //
        /*if (filtro.vendedorId) {
              query.vendedor = new mongoose.Types.ObjectId(filtro.vendedorId)
            }*/
        if(filtros.usuarioId){ query.comprador = filtros.usuarioId; }
        if(filtros.vendedorId) query["items.producto.vendedor"] = filtros.vendedorId;
        if (filtros.vendedorId) {
            const productosDelVendedor = await ProductoModel.find({
            vendedor: filtros.vendedorId
        }).distinct('_id');

    query['items.producto'] = { $in: productosDelVendedor };
  }
      
        const offset = (numeroPagina-1) *elemPorPagina;

        const pedidos = await PedidoModel.find(query)
            .skip(offset)
            .limit(elemPorPagina)
            .sort({fechaCreacion:-1}) // del mas reciente para atrás
            .populate('comprador')
            .populate('items.producto');
        if(!pedidos || pedidos.length === 0){
            throw new NoPedidosYet();
        }
        return pedidos;
    }

    async save(pedido) {
        const pedidoModel = new PedidoModel(pedido);
        return await pedidoModel.save();
    }

    async findById(id) {
        return await PedidoModel.findById(id)
        .populate('comprador')
        .populate('items.producto');
    }

    async findByUserId(usuarioId){
        const pedidos = await PedidoModel.find({comprador: usuarioId})
                                              .sort({fechaCreacion:-1}); // del mas reciente para atrás
        return pedidos
    }

    async update(id,updateData) {
        return await PedidoModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async contarTodos(filtros) {
        const query = {};

        if(filtros.maxPrice){ query.total = { $lte: filtros.maxPrice }; }
        if(filtros.estado){ query.estado = filtros.estado; }
        if(filtros.usuarioId){ query.comprador = filtros.usuarioId; }
        return PedidoModel.countDocuments(query);
    }

    async cambiarEstadoItemPedido(pedidoId, itemPedidoId, nuevoEstado) {
        const pedido = await PedidoModel.findById(pedidoId);
        const itemPedido = pedido.items.id(itemPedidoId);

        if (!itemPedido) {
            throw new Error(`ItemPedido con id ${itemPedidoId} no encontrado en el pedido ${pedidoId}`);
        }
        itemPedido.estado = nuevoEstado;
        await pedido.save();
        return pedido;
    }


}