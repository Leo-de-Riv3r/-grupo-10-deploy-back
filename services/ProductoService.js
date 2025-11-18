import { ProductoRepository } from '../models/repositories/ProductosRepository.js'
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js'
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js'
import { EntidadNotFoundError, InputValidationError } from '../errors/ProductosErrors.js'
import { Producto } from '../models/entities/Producto.js'
import mongoose, { mongo, Mongoose } from 'mongoose'
import { Categoria } from '../models/entities/Categoria.js'
import expressAsyncHandler from 'express-async-handler'
import { uploadToS3 } from './S3Service.js'
import { NotAuthorizedError } from '../errors/AuthErrors.js'
export class ProductoService {
  constructor(productoRepo, categoriaRepo, usuarioRepo) {
    this.productoRepo = productoRepo
    this.categoriaRepo = categoriaRepo
    this.usuarioRepo = usuarioRepo
  }
  toDto(producto) {
    return {
      ...producto,
      _id: producto.id?.toString() || producto._id?.toString(),
      vendedor: {
        id: producto.vendedor.id?.toString() || producto.vendedor._id?.toString(),
        nombre: producto.vendedor.nombre,
        email: producto.vendedor.email
      }
    }
  }


  async getCategorias() {
    const categorias = await this.categoriaRepo.findAll()
    return categorias.map(c => c.nombre)
  }

  async crearProducto(productoDto, imagenes) {
    if (!mongoose.isValidObjectId(productoDto.vendedorId)) {
      throw new InputValidationError("vendedorId no es un id valido")
    }
    const vendedor = await this.usuarioRepo.findById(productoDto.vendedorId)
    if (!vendedor) { throw new EntidadNotFoundError(`usuario con id ${productoDto.vendedorId} no encontrado`) }

    const categorias = [];
    for (const nombreCategoria of productoDto.categorias) {
      let categoria = await this.categoriaRepo.findByNombre(nombreCategoria);
      if (!categoria) {
        throw new EntidadNotFoundError(`categoria ${nombreCategoria} no encontrada`)
      }
      categorias.push(categoria);
    }
    //subo imagenes a s3
    const uploadPromises = imagenes.map(file => uploadToS3(file));
    
    const fotosUrls = await Promise.all(uploadPromises);
    
    const producto = new Producto(vendedor, productoDto.titulo, productoDto.descripcion, categorias, productoDto.precio, productoDto.moneda, productoDto.stock, fotosUrls || [])
    return await this.productoRepo.saveProducto(producto)
  }

  async modificarProducto(idProducto, idVendedor, productoDto, imagenes) {
    const productoExistente = await this.productoRepo.findById(idProducto)
    if (!productoExistente) {
      throw new EntidadNotFoundError(`producto con id ${idProducto} no encontrado`)
    }
    if (productoExistente.vendedor.id !== idVendedor) {
      throw new NotAuthorizedError("No puedes modificar este recurso")
    }
    productoExistente.titulo = productoDto.titulo;
    productoExistente.descripcion = productoDto.descripcion;
    productoExistente.precio = productoDto.precio;
    productoExistente.moneda = productoDto.moneda;
    productoExistente.stock = productoDto.stock;
    productoExistente.ventas = productoDto.ventas;
    productoExistente.activo = productoDto.activo;
    
    const uploadPromises = imagenes.map(file => uploadToS3(file));
    const fotosProducto = productoDto.fotos;
    const fotosUrls = await Promise.all(uploadPromises);
  
    productoExistente.fotos = fotosProducto.concat(fotosUrls) || [];
    //repetido
    const categorias = [];
    for (const nombreCategoria of productoDto.categorias) {
      let categoria = await this.categoriaRepo.findByNombre(nombreCategoria);
      if (!categoria) {
        throw new EntidadNotFoundError(`categoria ${nombreCategoria} no encontrada`)
      }
      categorias.push(categoria);
    }
    productoExistente.categorias = categorias;
    console.log(productoExistente)
    //repetido
    return await this.productoRepo.updateProducto(idProducto, productoExistente)
  }

  async desactivarProducto(idProducto, idVendedor) {
    const producto = await this.productoRepo.findById(idProducto)
    if (!producto) throw new EntidadNotFoundError("producto con id " + idProducto + " no encontrado")
    if (producto.vendedor.id !== idVendedor) {
      throw new NotAuthorizedError("No puedes modificar este recurso")
    } 
    producto.activo = false
    await this.productoRepo.updateProducto(idProducto, producto)
  }
  async obtenerProducto(idProducto) {
    const producto = await this.productoRepo.findById(idProducto)
    if (!producto) throw new EntidadNotFoundError("producto con id " + idProducto + " no encontrado")
    return producto
  }
  async obtenerProductos(filtro) {
    if (filtro.vendedorId) {
      const vendedor = await this.usuarioRepo.findById(filtro.vendedorId)
      if (!vendedor) {
        throw new EntidadNotFoundError(`usuario con id ${filtro.vendedorId} no encontrado`)
      }
    }

    let page = filtro.page ? Number(filtro.page) : 1;
    let perPage = filtro.perPage ? Number(filtro.perPage) : 30;

    let paginacionProducto = await this.productoRepo.getProductosWithFilters(filtro, page, perPage)
    paginacionProducto.data = paginacionProducto.data.map(p => this.toDto(p))

    return paginacionProducto
  }
}