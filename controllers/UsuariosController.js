import { parse } from "uuid"
import z from "zod"

export class UsuariosController{
  constructor(usuarioService){
    this.usuarioService = usuarioService
  }

  async obtenerUsuarioPorId(req, res){
    const { id } = req.params
    const usuario = await this.usuarioService.obtenerUsuarioPorId(id)
    if(!usuario){
      return res.status(404).json({message: 'Usuario no encontrado'})
    }

    return res.status(200).json(usuario)
  }
  async obtenerVendedores(req, res){
    const query = req.query
    const parsedQuery = buscarVendedorSchema.safeParse(query)
    if (parsedQuery.error) {
      return res.status(400).json(parsedQuery.error.issues)
    }
    const paginacionVendedores = await this.usuarioService.obtenerVendedores(parsedQuery.data)
    return res.status(200).json(paginacionVendedores)
  }
}

const buscarVendedorSchema = z.object({
  valorBusqueda: z.string().optional(),
  page: z.coerce.number().nonnegative().optional().default(1)
  .transform((val) => (val > 0 ? val : 1)),
  perPage: z.coerce.number().nonnegative().optional().default(30)
    .transform((val) => (val > 30 ? 30 : val))
});