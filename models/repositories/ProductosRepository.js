import { Producto } from "../entities/Producto.js";
import ProductoModel from "../schemas/ProductoModel.js";
import mongoose from "mongoose";
export class ProductoRepository {

  async updateProducto(id, newProducto) {
    return await ProductoModel.findByIdAndUpdate(id, newProducto, { new: true });
  }
  async findById(id) {
    return await ProductoModel.findById(id).populate("vendedor").populate("categorias");
  }
  async saveProducto(producto) {
    const productoNuevo = new ProductoModel(producto)
    console.log(productoNuevo)
    return await productoNuevo.save()
  }

  async findById(id) {
    const producto = await ProductoModel.findById(id).populate("vendedor", "telefono nombre email")
    return producto
  }
  async findAll() {
    return await ProductoModel.find({})
  }

  async getProductosWithFilters(filtro, page = 1, per_page = 30) {
    let query = {}
    if (filtro.vendedorId) {
      query.vendedor = new mongoose.Types.ObjectId(filtro.vendedorId)
    }
    const sort = {}

    if (typeof filtro.activo === 'boolean') {
      query.activo = filtro.activo
    } else {
      query.activo = true
    }

    if (filtro.valorBusqueda) {
      const regex = new RegExp(filtro.valorBusqueda, "i");
      query.$or = [
        { "titulo": regex },
        { "descripcion": regex },
        { "categorias.nombre": regex }
      ];      
    }

    if (filtro.ordenarPor === "VENTAS") {
      if (filtro.orden === "ASC") {
        sort.ventas = 1
      } else {
        sort.ventas = -1
      }
    }

    if (filtro.ordenarPor === "PRECIO") {
      if (filtro.orden === "ASC") {
        sort.precio = 1 
      } else {
        sort.precio = -1
      }
    }
    if(filtro.categoria) {
      query['categorias.nombre'] = filtro.categoria;
    }
    if (filtro.precioMin) {
      query.precio = { ...query.precio, $gte: filtro.precioMin }
    }
    if (filtro.precioMax) {
      query.precio = { ...query.precio, $lte: filtro.precioMax }
    }

    const aggregateFields = [
      { $match: query },
      {
        $project: {
          __v: 0,
        categorias: {
          _id: 0
        }
        }
      }, 
      {
        $addFields: {
          categorias: {
            $map: {
              input: "$categorias", 
              as: "c",
              in: "$$c.nombre"
            }
          }
        }
      },
    ]
    
    
    if (Object.keys(sort).length > 0) {
      aggregateFields.push({ $sort: sort })
    }
    //paginacion
    if (page < 1) page = 1
    if (per_page > 30) per_page = 30
    if (per_page < 1) per_page = 1

    // total and clamp page to last page if necessary
    const total = await ProductoModel.countDocuments(query)
    const total_pages = Math.max(1, Math.ceil(total / per_page))
    if (page > total_pages) page = total_pages

    // apply skip & limit for pagination
    const skip = (page - 1) * per_page
    aggregateFields.push({ $skip: skip })
    aggregateFields.push({ $limit: per_page })
    const productos = await ProductoModel.aggregate(aggregateFields).unwind("vendedor")

    await ProductoModel.populate(productos, { path: "vendedor", select: "_id nombre email" })

    return {
      data: productos,
      pagination: {
        page,
        total_pages
      }
    }
  }

  update(id, updateData) {
    return ProductoModel.findByIdAndUpdate(id, updateData, { new: true })
  }
}