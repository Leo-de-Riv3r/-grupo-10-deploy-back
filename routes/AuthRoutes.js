import express from 'express'
const authRouter = express.Router()
import asyncHandler from 'express-async-handler'
import  AuthController  from '../controllers/AuthController.js' 
import AuthService  from '../services/AuthService.js'
import  { UsuarioRepository } from '../models/repositories/UsuariosRepository.js'
import middleware from '../utils/middleware.js'
const usuarioRepo = new UsuarioRepository()
const authService = new AuthService(usuarioRepo)
const authController = new AuthController(authService)

authRouter.post('/login', asyncHandler(async (req, res) => {
  return await authController.login(req, res)
}))

authRouter.post('/register', asyncHandler(async (req, res) => {
  return await authController.register(req, res)
}))

authRouter.post('/refresh', middleware.extractUserForRefresh, asyncHandler(async (req, res) => {
  return await authController.refresh(req, res)
}))

authRouter.post('/logout', asyncHandler(async (req, res) => {
  return await authController.logout(req, res)
}))

// authRouter.post('/addRole', middleware.extractUser, asyncHandler(async(req, res) => {
//   return await authController.addRole(req, res)
// }))
export default authRouter