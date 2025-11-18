import { NotificacionUsuarioError } from "../errors/NotificacionesErrors.js";

export class NotificacionesController {

    constructor(notificacionService) {
        this.notificacionService = notificacionService;
    }

    async obtenerNotificaciones(req, res){
        try{
            const { leidas = true, page = 1, limit = 10 } = req.query;

            const usuario = req.user.id

            if(!usuario){
                throw new NotificacionUsuarioError()
            }
            const notificaciones = await this.notificacionService.obtenerNotificaciones(usuario, leidas, page, limit)

            res.status(200).json(notificaciones)
            return
        } catch (error) {
            res.status(error.statusCode).json({ error: error.message });
        }
    }

    async marcarNotificacionLeida(req, res){
        try {
            const usuario = req.user.id

            if(!usuario){
                throw new NotificacionUsuarioError()
            }

            const notificacion = await this.notificacionService.marcarNotificacionLeida(req.params.id, usuario)

            res.status(201).json(notificacion)

            return
        } catch (error){
            res.status(error.statusCode).json({ error: error.message });
        }
    }

    async contarNotificacionesNoLeidas(req, res){
        try {
            const usuario = req.user.id
            const cantidad = await this.notificacionService.contarNotificacionesNoLeidas(usuario)
            res.status(200).json({ cantidad })
        } catch (error){
            console.log(error)
            res.status(error.statusCode).json({ error: error.message });
        }
    }



}