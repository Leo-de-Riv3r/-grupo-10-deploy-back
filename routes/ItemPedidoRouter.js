import express from 'express'
const itemPedidoRouter = express.Router()
import { ItemPedidoRepository } from '../models/repositories/ItemPedidoRepository.js'
import asyncHandler from 'express-async-handler';
import { ItemPedidoController } from '../controllers/ItemPedidoController.js';
import { ItemPedidoService} from '../services/ItemPedidoService.js'
import { PedidoService } from '../services/PedidoService.js';
import { PedidoRepository } from '../models/repositories/PedidoRepository.js';

const pedidoRepository = new PedidoRepository()
const pedidoService = new PedidoService(pedidoRepository)
const itemPedidoRepository = new ItemPedidoRepository()
const itemPedidoService = new ItemPedidoService(itemPedidoRepository, pedidoService)
const itemPedidoController = new ItemPedidoController(itemPedidoService)

itemPedidoRouter.get('/:id', asyncHandler(async (req, res)=> {
  return await itemPedidoController.getItemPedido(req, res);
})) 

itemPedidoRouter.get('/', asyncHandler(async (req,res) =>{
    return await itemPedidoController.getItemsPorVendedorId(req,res);
}))

itemPedidoRouter.patch('/:id', asyncHandler(async (req, res) => {
  return await itemPedidoController.actualizarEstadoItemPedido(req, res);
}))


export default itemPedidoRouter