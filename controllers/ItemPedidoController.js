import z from "zod";

export class ItemPedidoController {
    constructor(itemPedidoService) {
        this.itemPedidoService = itemPedidoService;
    }


    async getItemPedido(req, res) {
        try {
            const { itemPedidoId } = req.params;
            
            const itemPedido = await this.itemPedidoService.getItemPedidoById(itemPedidoId);
            res.json(itemPedido);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
        }
    }

    async getItemsPorVendedorId(req,res) {
        try{
            const query = req.query;
            const parsedQuery = getItemsPedidoByVendedor.safeParse(query);
            if(parsedQuery.error){
                return res.status(400).json(parseItemPedidoId.error.issues);
            }
            
            return await this.itemPedidoService.getItemPedidosByVendedorId(parsedQuery.data);
        }catch(error){
            res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
        }
    }

    async actualizarEstadoItemPedido(req, res) {
        try {
            const { itemPedidoId } = req.params;
            const { estado } = req.query;
            console.log("Actualizar estado item pedido controller:");
            console.log(itemPedidoId)
            console.log(estado)

            let itemPedidoActualizado;
            if(estado == 'ENVIADO'){
                itemPedidoActualizado = this.itemPedidoService.marcarEnviado(itemPedidoId);
            } else if (estado == 'CANCELADO'){
                itemPedidoActualizado = this.itemPedidoService.cancelarItemPedido(itemPedidoId);
            } else if(estado == "CONFIRMADO"){
                itemPedidoActualizado = this.itemPedidoService.confirmarItemPedido(itemPedidoId);
            }
            
            res.json(itemPedidoActualizado);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
        }
    }
}

const itemPedidoIdSchemaZod = z.object({
    _id: z.string().nonempty()
});

const vendedorIdSchemaZod = z.object({
    _id: z.string().nonempty()
});


const getItemsPedidoByVendedor = z.object({
    vendedorId: z.string().nonempty(),
    page: z.coerce.number().nonnegative().optional().default(1),
    perPage: z.coerce.number().nonnegative().optional().default(10)
    .transform((val) => (val > 30 ? 30 : val))
});