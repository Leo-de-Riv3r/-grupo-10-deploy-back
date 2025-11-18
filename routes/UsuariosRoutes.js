import express from 'express';
import { UsuariosController } from '../controllers/UsuariosController.js';
import { UsuarioService } from '../services/UsuarioService.js';
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js';
const usuariosRouter = express.Router();
import asyncHandler from 'express-async-handler';
const usuariosService = new UsuarioService(new UsuarioRepository());
const usuariosController = new UsuariosController(usuariosService);

usuariosRouter.get('/vendedores', asyncHandler(async (req, res) => {
  return await usuariosController.obtenerVendedores(req, res);
}))

export default usuariosRouter

