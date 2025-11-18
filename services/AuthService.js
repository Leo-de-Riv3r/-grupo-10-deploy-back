import { Usuario } from "../models/entities/Usuario.js"
import generateTokens from '../utils/jwtServices.js'
import { UsuarioExists, UsuarioNotExists } from "../errors/UsuariosErrors.js"
import bcrypt from 'bcrypt'
import { InvalidLoginCredentials } from "../errors/AuthErrors.js"

export default class AuthService {
  constructor(usuariosRepository) {
    this.usuariosRepository = usuariosRepository
  }

  async register(newUserData) {
    const newUser = new Usuario(newUserData.nombre, newUserData.email, newUserData.telefono, newUserData.tipo)
    const existingUser = await this.usuariosRepository.findByEmail(newUser.email)
    if (existingUser) {
      throw new UsuarioExists("Ya existe un usuario con el email ingresado");
    }

    newUser.passwordHash = await bcrypt.hash(newUserData.password, 10)
    const user = await this.usuariosRepository.save(newUser)
    return generateTokens(user)
  }

  async login(userData) {
    const user = await this.usuariosRepository.findByEmail(userData.email)
    const passwordCorrect = user === null ? false : await bcrypt.compare(userData.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      throw new InvalidLoginCredentials("Credenciales inválidas")
    }

    return generateTokens(user)
  }

  async refresh(userData) {
    return generateTokens(userData)
  }

  async agregarRol(id, tipo) {
    const user = await this.usuariosRepository.findById(id)
    if (!user) {
      throw new UsuarioNotExists("Usuario no encontrado")
    }
  }
}