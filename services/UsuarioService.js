import { TipoUsuario } from "../models/entities/enums/TipoUsuario.js"

export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository
  }
  toDto(usuario) {
    return {
      ...usuario,
      _id: usuario.id?.toString() || usuario._id?.toString(),
    }
  }

  async obtenerUsuarioPorId(id) {
    return await this.usuarioRepository.findById(id)
  }

  async obtenerVendedores(filtro) {
    let terminoBusqeda = filtro.valorBusqueda ? filtro.valorBusqueda : "";
    let page = filtro.page ? Number(filtro.page) : 1;
    let perPage = filtro.perPage ? Number(filtro.perPage) : 30;
    const paginacionUsuarios = await this.usuarioRepository.findByTipo(TipoUsuario.VENDEDOR, terminoBusqeda, page, perPage);
    paginacionUsuarios.data = paginacionUsuarios.data.map(u => this.toDto(u))
    
    return paginacionUsuarios
  }
}