import mongoose from "mongoose";
import { Notificacion } from "../entities/Notificacion.js"

const NotificacionSchema = new mongoose.Schema({
    usuarioDestino:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
   mensaje: {
    type: String,
    required: true,
    trim: true
   },
   fechaAlta: {
    type: Date,
    required: true
   },
   leida: {
    type: Boolean,
    required: true
   },
   fechaLeida: {
    type: Date
   }

}, { collection: 'notificaciones'});

NotificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', NotificacionSchema);