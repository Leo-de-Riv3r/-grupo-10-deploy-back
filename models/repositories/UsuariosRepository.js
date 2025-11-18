import UsuarioModel from "../schemas/UsuarioModel.js";

export class UsuarioRepository {

  async save(usuario) {
    const usuarioNuevo = new UsuarioModel(usuario)
    return await usuarioNuevo.save()
  }

  async findById(id) {
    return await UsuarioModel.findById(id)
  }

  async findByEmail(email) {
    return await UsuarioModel.findOne({ email })
  }
  async findByNombreAndEmail(nombre, email){
    return await UsuarioModel.findOne({nombre, email})
  }
  async findByTipo(tipoUsuario, terminoBusqueda = "", page = 1, per_page = 30) {
   const query = {tipo : tipoUsuario}
    if (terminoBusqueda || terminoBusqueda.trim().length > 0) {
      const regex = new RegExp(terminoBusqueda, "i");
      query.$or = [
        { "nombre": regex },
        { "email": regex }
      ];      
    }

    const aggregateFields = [
      { $match: query }
    ]
    
    //paginacion
    if (page < 1) page = 1
    if (per_page > 30) per_page = 30
    if (per_page < 1) per_page = 1

    // total and clamp page to last page if necessary
    const total = await UsuarioModel.countDocuments(query)
    const total_pages = Math.max(1, Math.ceil(total / per_page))
    if (page > total_pages) page = total_pages

    const skip = (page - 1) * per_page
    aggregateFields.push({ $skip: skip })
    aggregateFields.push({ $limit: per_page })
    const usuarios = await UsuarioModel.aggregate(aggregateFields)

    return {
      data: usuarios,
      pagination: {
        page,
        total_pages: Math.ceil(total / per_page)
      }
    }
  }
}