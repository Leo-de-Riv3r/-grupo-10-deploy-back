import express from 'express'
import asyncHandler from 'express-async-handler'

const notificacionesRouter = express.Router()
import { NotificacionesController } from '../controllers/NotificacionesController.js'
import { NotificacionService } from '../services/NotificacionService.js'
import { NotificacionesRepository } from '../models/repositories/NotificacionesRepository.js'
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js'
import { FactoryNotificacion } from '../models/entities/FactoryNotificacion.js'
import { TraductorManual } from '../models/entities/TraductorManual.js'
import { ProductoRepository } from '../models/repositories/ProductosRepository.js'
import middleware from '../utils/middleware.js';

const usuarioRepository = new UsuarioRepository()
const notificacionesRepository = new NotificacionesRepository()
const productoRepository = new ProductoRepository()
const traductor = new TraductorManual()
const factoryNotificacion = new FactoryNotificacion(traductor)
const notificacionService = new NotificacionService(notificacionesRepository, usuarioRepository, factoryNotificacion, productoRepository)
const notificacionesController = new NotificacionesController(notificacionService)

notificacionesRouter.get('/', middleware.extractUser,asyncHandler(async (req, res) => {
    return await notificacionesController.obtenerNotificaciones(req, res)
}))

notificacionesRouter.patch('/:id', middleware.extractUser, asyncHandler(async (req, res) => {
    return await notificacionesController.marcarNotificacionLeida(req, res)
}))

notificacionesRouter.get('/no-leidas/cantidad', middleware.extractUser, asyncHandler(async (req, res) => {
    return await notificacionesController.contarNotificacionesNoLeidas(req, res)
}))

export default notificacionesRouter