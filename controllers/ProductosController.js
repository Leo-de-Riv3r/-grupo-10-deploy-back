import { z } from 'zod'
import { ProductoService } from '../services/ProductoService.js';
import { InputValidationError } from '../errors/ProductosErrors.js';
import { TipoMoneda } from '../models/entities/enums/TipoMoneda.js';
import expressAsyncHandler from 'express-async-handler';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js';
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js';
import mongoose from 'mongoose';
import config from '../utils/config.js';
import { NotAuthorizedError } from '../errors/AuthErrors.js';
const { PORT } = config

export class ProductosController {
  constructor(productoService) {
    this.productoService = productoService
  }

  async obtenerCategorias(req, res) {
    const categorias = await this.productoService.getCategorias()
    return res.status(200).json(categorias)
  }

  async obtenerProductoId(req, res) {
    const idProducto = req.params.id
    if (!mongoose.isValidObjectId(idProducto)) throw new InputValidationError("Id de producto no valido")
    const producto = await this.productoService.obtenerProducto(idProducto)
    return res.status(200).json(producto)
  }

  
  async obtenerProductos(req, res) {
    const query = req.query
    const parsedQuery = buscarProductoSchema.safeParse(query)
    if (parsedQuery.error) {
      return res.status(400).json(parsedQuery.error.issues)
    }
    const paginacionProductos = await this.productoService.obtenerProductos(parsedQuery.data)
    return res.status(200).json(paginacionProductos)
  }

  async desactivarProducto(req, res) {
    const idProducto = req.params.id
    const idVendedor = req.user.id
    await this.productoService.desactivarProducto(idProducto, idVendedor)
    return res.status(204).end()
  }

  async modificarProducto(req, res) {
    let body = req.body.producto;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json([{ message: 'Producto JSON inválido' }]);
      }
    }
    const idProducto = req.params.id;
    const idVendedor = req.user.id;
    if (!mongoose.isValidObjectId(idProducto)) throw new InputValidationError("Id de producto no valido")
    body.precio = Number(body.precio)
    body.stock = Number(body.stock)
    body.ventas = Number(body.ventas)

    const parsedBody = modificarProductoSchema.safeParse(body);
    if (parsedBody.error) {
      return res.status(400).json(parsedBody.error.issues);
    }
    const productoNuevo = await this.productoService.modificarProducto(idProducto, idVendedor, parsedBody.data, req.files)
    return res.status(201).json(productoNuevo)
  }
  
  async crearProducto(req, res) {
    //validate user.tipo is vendedor
    //extract id from token received
    let body = req.body.producto;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json([{ message: 'Producto JSON inválido' }]);
      }
    }
    body.precio = Number(body.precio)
    body.stock = Number(body.stock)
    
    const parsedBody = productoSchema.safeParse(body);
    if (parsedBody.error) {
      return res.status(400).json(parsedBody.error.issues);
    }

    const productoNuevo = await this.productoService.crearProducto(parsedBody.data, req.files)
    return res.status(201).json(productoNuevo)
  }
}


const modificarProductoSchema = z.object({
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  categorias: z.array(z.string().min(3)).nonempty("Debe haber al menos una categoría"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  moneda: z.enum(Object.values(TipoMoneda)),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  fotos: z.array(z.string()).optional(),
  activo: z.enum(["true", "false"]).transform(val => val === "true"),
  ventas: z.number().int().nonnegative("Las ventas no pueden ser negativas"),
});

const productoSchema = z.object({
  vendedorId: z.string().nonempty(),
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  categorias: z.array(z.string().min(3)).nonempty("Debe haber al menos una categoría"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  moneda: z.enum(Object.values(TipoMoneda)),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  fotos: z.array(z.string()).optional(),
});

const buscarProductoSchema = z.object({
  vendedorId: z.string().optional(),
  valorBusqueda: z.string().optional(),
  precioMin: z.coerce.number().nonnegative().optional(),
  precioMax: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().nonnegative().optional().default(1),
  perPage: z.coerce.number().nonnegative().optional().default(10)
    .transform((val) => (val > 30 ? 30 : val)),
  ordenarPor: z.enum(["PRECIO", "VENTAS"]).optional(),
  orden: z.enum(["ASC", "DESC"]).optional().default("DESC"),
  activo: z.enum(["true", "false"]).optional().default("true").transform(val => val === "true"),
  categoria: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.precioMin && data.precioMax && data.precioMin >= data.precioMax) {
    ctx.addIssue({
      code: "custom",
      path: ["precioMin"],
      message: "precioMin debe ser menor a precioMax",
    });
  }
});