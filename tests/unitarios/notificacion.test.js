import { NotificacionNotFoundError, NotificacionUsuarioMissmatchError } from "../../errors/NotificacionesErrors.js";
import { Notificacion } from "../../models/entities/Notificacion.js";
import { Usuario } from "../../models/entities/Usuario.js";
import { NotificacionService } from "../../services/NotificacionService.js";
import { beforeEach, describe, expect, jest } from "@jest/globals"
import mongoose from 'mongoose';

const usuarioId = new mongoose.Types.ObjectId()
const notificacionId = new mongoose.Types.ObjectId()
const fecha = new Date().toLocaleString()
let notificacion

beforeEach(() => {
        notificacion = new Notificacion(usuarioId, "Tu pedido está pendiente")
        notificacion._id = notificacionId
        notificacion.fechaAlta = fecha
    })

describe("NotificacionService.obtenerNotificaciones", () => {

    const mockRepo = {
        findAllByUsuarioAndLeida: jest.fn()
    }

    const notificacionService = new NotificacionService(mockRepo)

    test("Obtener notificaciones default", async () => {
        //preparacion

        mockRepo.findAllByUsuarioAndLeida.mockResolvedValue([notificacion])

        //ejecucion
        const resultado = await notificacionService.obtenerNotificaciones(usuarioId, false)

        //comparacion
        expect(mockRepo.findAllByUsuarioAndLeida).toHaveBeenCalledWith(usuarioId, false)

        expect(resultado).toEqual([{
            id: notificacionId,
            usuarioDestino: usuarioId,
            mensaje: "Tu pedido está pendiente",
            fechaAlta : fecha,
            leida : false,
            fechaLeida: undefined
        }])

    })

    
    test("Obtener notificaciones con un usuario equivocado no devuelve resultado", async () => {
        //preparacion
        notificacion.usuarioDestino = new mongoose.Types.ObjectId()

        mockRepo.findAllByUsuarioAndLeida.mockResolvedValue([])

        //ejecucion
        const resultado = await notificacionService.obtenerNotificaciones(usuarioId, false)

        //comparacion
        expect(resultado).toEqual([])
    })
})

describe("NotificacionService.marcarNotificacionLeida", () => {

    const mockRepo = {
        findByIdAndLeida: jest.fn(),
        update: jest.fn()
    }

    const notificacionService = new NotificacionService(mockRepo)
    

test("Marcar notificacion como leida", async () => {
    //preparacion
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2025-10-05T10:00:00Z'));

    //const notificacionLeida = notificacion.marcarComoLeida()
    mockRepo.findByIdAndLeida.mockResolvedValue(notificacion)

    notificacion.marcarComoLeida()
    mockRepo.update.mockResolvedValue(notificacion)
    
    //ejecucion
    const resultado = await notificacionService.marcarNotificacionLeida(notificacionId, usuarioId)

    //comparacion
    expect(mockRepo.findByIdAndLeida).toHaveBeenCalled()
    expect(mockRepo.update).toHaveBeenCalledWith(notificacion)

    expect(resultado).toEqual({
            id: notificacionId,
            usuarioDestino: usuarioId,
            mensaje: "Tu pedido está pendiente",
            fechaAlta : fecha,
            leida : true,
            fechaLeida: new Date()
        })

})

test("Notificacion con otro usuario arroja error", async () => {

    const otroIdUsuario = new mongoose.Types.ObjectId()

    mockRepo.findByIdAndLeida.mockResolvedValue(notificacion)

    await expect(notificacionService.marcarNotificacionLeida(notificacionId, otroIdUsuario))
        .rejects.toThrow(NotificacionUsuarioMissmatchError)

})

test("Notificacion inexistente arroja error", async () => {
    
    mockRepo.findByIdAndLeida.mockResolvedValue(null)

    await expect(notificacionService.marcarNotificacionLeida(notificacionId, usuarioId)).rejects.toThrow(NotificacionNotFoundError)

})


})