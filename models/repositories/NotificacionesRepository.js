import { NotificacionModel } from "../schemas/NotificacionSchema.js";

export class NotificacionesRepository {
    
    constructor(){
        this.model = NotificacionModel;
    }

    async findByPagina(usuario, fueLeida, numeroPagina, elementosPagina) {
        const offset = (numeroPagina - 1) * elementosPagina;
        const notificaciones = await this.findAllByUsuarioAndLeida(usuario, fueLeida);
        return notificaciones.slice(offset, offset + elementosPagina);
    }

    async findByIdAndLeida(id, fueLeida){
        return await this.model.findOne({_id: id, leida: fueLeida});
    }

    
    async findAllByUsuarioAndLeida(usuario, fueLeida){
        return await this.model.find({ usuarioDestino: usuario, leida: fueLeida }).sort({ fechaAlta: -1 })
    }
    

    async save(notificacion){
        const nuevaNotificacion = new NotificacionModel(notificacion)
        return await nuevaNotificacion.save(notificacion);
    }

    //revisar el actualizado
    async update(notificacionActualizada){
        const { _id, ...notificacion } = notificacionActualizada    
            
        return await this.model.findByIdAndUpdate(
            { _id },
            { $set: notificacion },
            { new: true }
        )
    }

    async contarNotificacionesDeUnUsuario(usuario, fueLeida){
        return await this.model.where({ usuarioDestino: usuario, leida: fueLeida }).countDocuments()
    }

}
