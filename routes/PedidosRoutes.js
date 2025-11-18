//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                                      no se puede mezclar import y require
import express from 'express';
const pedidosRouter = express.Router();
import { PedidosController} from '../controllers/PedidosController.js'
import { PedidoService } from '../services/PedidoService.js';
import { NotificacionService } from '../services/NotificacionService.js';
import { FactoryNotificacion } from '../models/entities/FactoryNotificacion.js'
import { TraductorManual } from '../models/entities/TraductorManual.js'
import { NotificacionesRepository } from '../models/repositories/NotificacionesRepository.js'
import { ItemPedidoRepository } from '../models/repositories/ItemPedidoRepository.js'

/*
import { PedidoDTO } from '../models/entities/dtos/input/PedidoDTO';
import ProductoService from '../services/ProductoService';
import UsuarioService from '../services/UsuarioService';
import NotificacionService from '../services/NotificacionService';
const pedidoService = new PedidosServices(new ProductoService(), new UsuarioService(), new NotificacionService());
*/
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js';
import { PedidoRepository } from '../models/repositories/PedidoRepository.js';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import asyncHandler from 'express-async-handler'


const usuarioRepo = new UsuarioRepository();
const pedidoRepo = new PedidoRepository();
const productoRepo = new ProductoRepository();
const notificacionesRepository = new NotificacionesRepository()
const itemPedidoRepository = new ItemPedidoRepository()
const traductor = new TraductorManual()
const factoryNotificacion = new FactoryNotificacion(traductor)
const notificacionService = new NotificacionService(notificacionesRepository, usuarioRepo, factoryNotificacion, productoRepo)
const pedidosService = new PedidoService(pedidoRepo,itemPedidoRepository, usuarioRepo, productoRepo, notificacionService);

const pedidosController = new PedidosController(pedidosService);


pedidosRouter.get('/', asyncHandler(async (req, res) => {
  return await pedidosController.obtenerPedidos(req, res);
}))

pedidosRouter.get('/:id', asyncHandler(async (req, res) => {
  return await pedidosController.obtenerPedidoPorId(req, res);
}))

pedidosRouter.post('/', asyncHandler(async (req, res) => {
  return await pedidosController.crearPedido(req, res);
}))
//patch 
pedidosRouter.patch('/:id', asyncHandler(async (req, res) => {
  return await pedidosController.actualizarEstadoPedido(req, res);
}))

pedidosRouter.patch('/:id/items/:itemId', asyncHandler(async (req, res) => {
  return await pedidosController.actualizarEstadoItemPedido(req, res);
}))



export default pedidosRouter