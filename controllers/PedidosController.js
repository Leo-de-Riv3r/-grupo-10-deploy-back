//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                  no se puede mezclar import y require  
import { z } from 'zod'
import mongoose from 'mongoose';
import { DireccionEntregaBuilder } from '../models/entities/DireccionEntrega.js';
import { PedidoInputDTO } from '../models/entities/dtos/input/PedidoInputDTO.js';
import { PedidoOutputDTO } from '../models/entities/dtos/output/PedidoOutputDTO.js';
import express from 'express';
import { id } from 'zod/v4/locales';
const direccionEntregaBuilder = new DireccionEntregaBuilder();

export class PedidosController {
 constructor(pedidoService) {
   this.pedidoService = pedidoService;
 }
  obtenerPedidos = async (req, res) => {
    try {
      const {page = 1, limit = 10} =req.query;

      const userId = req.user?.id;
    const userTipo = req.user?.tipo; // "COMPRADOR" o "VENDEDOR"

      const parseFiltros = filtrosSchema.safeParse(req.query);
      if (parseFiltros.error) {
        return res.status(400).json(parseFiltros.error.issues);
      }
      const filtros = parseFiltros.data;

      if (userTipo === "COMPRADOR") {
      filtros.usuarioId = userId;
    } else if (userTipo === "VENDEDOR") {
      filtros.vendedorId = userId;
    }
      
      const pedidosPaginados = await this.pedidoService.obtenerPedidosPaginados(page,limit,filtros);
      res.status(200).json(pedidosPaginados);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
    }
  }

  obtenerPedidoPorId = async (req, res) => {
    try {
      let pedidoId = req.params.id;
      const parsePedidoId = idSchema.safeParse(pedidoId);
      if (parsePedidoId.error) {
        return res.status(400).json(parsePedidoId.error.issues);
      }
      pedidoId = parsePedidoId.data;
      const pedido = await this.pedidoService.obtenerPedidoPorId(pedidoId);
      res.status(200).json(pedido);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
    }
  }

  crearPedido = async (req, res) => {
    try{
    let body = req.body;
      const parsedBody = crearPedidoSchema.safeParse(body);    
    if (parsedBody.error) {
      return res.status(400).json(parsedBody.error.issues);
    }

    body = parsedBody.data;

    const direccionEntrega = direccionEntregaBuilder
     .withCalle(body.calle)
     .withAltura(body.altura)
     .withDepartamento(body.departamento)
     .withCodigoPostal(body.codigoPostal)
     .withCiudad(body.ciudad)
     .withProvincia(body.provincia)
     .withPais(body.pais)
     .build();

    const pedidoInputDTO = new PedidoInputDTO(body.compradorId, body.items, body.moneda, direccionEntrega);
    const nuevoPedido = await this.pedidoService.crearPedido(pedidoInputDTO);
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
  }
  }
  // tanto para cancelar como para marcar enviado, luego se delega en el service para cada caso
  actualizarEstadoPedido = async (req, res) => {
  try {
    let pedidoId = req.params.id
    const parsePedidoId = idSchema.safeParse(pedidoId);
    if (parsePedidoId.error) {
      return res.status(400).json(parsePedidoId.error.issues);
    }
    pedidoId = parsePedidoId.data;

    const { estado } = req.query;
    if (!estado) {
        return res.status(400).json({ error: 'Falta el parámetro "estado" en query.' });
    }

    const estadoNormalizado = estado.toString().toLowerCase();

    if (estadoNormalizado === 'cancelado') {
        const parseBody = cancelarPedidoSchema.safeParse(req.body);
      if (parseBody.error) {
      return res.status(400).json(parseBody.error.issues);
      }

      const {motivo} = parseBody.data

      const resultado = await this.pedidoService.cancelarPedido(pedidoId, motivo);
      if(!resultado) {
        return res.status(500).json({ error: 'error de cancelacion' });
      }
      res.status(200).json(resultado);
    }
    else if (estadoNormalizado === 'enviado') {
        const pedidoEnviado = await this.pedidoService.marcarEnviado(pedidoId);
        res.status(200).json(pedidoEnviado);
    }
        
    
  } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
  }
  }

  actualizarEstadoItemPedido = async (req, res) => {
    try {
      let itemPedidoId = req.params.itemId;
      let pedidoId = req.params.id;
      
      const parseItemPedidoId = idSchema.safeParse(itemPedidoId);
      if (parseItemPedidoId.error) {
        return res.status(400).json(parseItemPedidoId.error.issues);
      }
      const parsePedidoId = idSchema.safeParse(pedidoId);
      if (parsePedidoId.error) {
        return res.status(400).json(parsePedidoId.error.issues);
      }
      itemPedidoId = parseItemPedidoId.data;
      pedidoId = parsePedidoId.data;

      const { estado } = req.query;
      if (!estado) {
          return res.status(400).json({ error: 'Falta el parámetro "estado" en query.' });
      }
      const itemPedidoActualizado = await this.pedidoService.actualizarEstadoItemPedido(pedidoId, itemPedidoId, estado);
      res.status(200).json(itemPedidoActualizado);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
    }

  }


  /*
  cancelarPedido = async (req, res) => {
  try {
    let pedidoId = req.params.id
    const parsePedidoId = idSchema.safeParse(pedidoId);
    if (parsePedidoId.error) {
      return res.status(400).json(parsePedidoId.error.issues);
    }
    pedidoId = parsePedidoId.data;

    const parseBody = cancelarPedidoSchema.safeParse(req.body);
    if (parseBody.error) {
      return res.status(400).json(parseBody.error.issues);
    }

    const {motivo} = parseBody.data

    const resultado = await this.pedidoService.cancelarPedido(pedidoId, motivo);
    if(!resultado) {
      return res.status(500).json({ error: 'error de cancelacion' });
    }
    res.status(200).json(resultado);
  } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
  }
  }


  marcarEnviado = async (req, res) => {
    try {
      const parseParams = idSchema.safeParse(req.params.id);
      if (parseParams.error) {
        return res.status(400).json(parseParams.error.issues);
      }
      const pedidoId = parseParams.data;
      const pedidoEnviado = await this.pedidoService.marcarEnviado(pedidoId);
      res.status(200).json(pedidoEnviado);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
    }
  }
  */

}



const itemPedidoSchemaZod = z.object({
  productoId: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Id de producto no válido",
  }),
  cantidad: z.coerce.number().min(1, { message: "Cantidad debe ser al menos 1" }),
  precioUnitario: z.coerce.number().min(0, { message: "PrecioUnitario no puede ser negativo" })
});

const crearPedidoSchema = z.object({
  compradorId: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Id de comprador no válido",
  }),
  items: z.array(itemPedidoSchemaZod).nonempty({ message: "Debe haber al menos un item" }),
  moneda: z.string().nonempty({ message: "Moneda es obligatoria" }),
  calle: z.string(),
  altura: z.string(),
  departamento: z.string().optional(),
  piso: z.string().optional(),
  codigoPostal: z.string(),
  ciudad: z.string(),
  provincia: z.string(),
  pais: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const idSchema = z.string().refine((id) => mongoose.isValidObjectId(id), {
  message: "Id no valido",
});

const cancelarPedidoSchema = z.object({
  motivo: z.string({required_error: "Motivo es obligatorio"}).nonempty({ message: "Motivo es obligatorio" }),
});

const filtrosSchema = z.object({
  estado: z.string().optional(),
  maxPrice: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  usuarioId: idSchema.optional(),
});