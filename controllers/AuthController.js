import {z} from "zod"

export default class AuthController{
  constructor(authService){
    this.authService = authService
  }

  login = async(req, res) => {
    const body = req.body
    const parsedBody = loginschema.safeParse(body)
    if (parsedBody.error) {
      return res.status(400).json(parsedBody.error.issues)
    }
    const {accessToken, refreshToken} = await this.authService.login(parsedBody.data)

    return res.status(200).json({accessToken, refreshToken})
  }


  register = async(req, res) => {
    const body = req.body
    const parsedBody = newUserSchema.safeParse(body)
    if (parsedBody.error) {
      return res.status(400).json(parsedBody.error.issues)
    }
    const {accessToken, refreshToken} = await this.authService.register(parsedBody.data)
    return res.status(200).json({accessToken, refreshToken})
  }

  refresh = async(req, res) => {
    const {accessToken, refreshToken} = await  this.authService.refresh(req.user)
    return res.status(200).json({accessToken, refreshToken})
  }


  // addRole = async(req, res) => {
  //   const body = req.body
  //   const parsedBody = addRoleSchema.safeParse(body)
  //   if (parsedBody.error) {
  //     return res.status(400).json(parsedBody.error.issues)
  //   }

  //   await this.authService.agregarRol(req.user.id, parsedBody.data.tipo)
  //   return res.status(200).json({
  //     message: "Rol agregado"
  //   })
  // }
}

const newUserSchema = z.object({
  nombre: z.string().min(3),
  email: z.email(),
  telefono: z.string().min(8),
  tipo: z.enum(['COMPRADOR', 'VENDEDOR']),
  password: z.string().min(8),
})

const loginschema = z.object({
  email: z.email(),
  password: z.string(),
})

const addRoleSchema = z.object({
  tipo: z.enum(['COMPRADOR', 'VENDEDOR'])
})
