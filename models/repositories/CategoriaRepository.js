import CategoriaModel from "../schemas/CategoriaModel.js"

export class CategoriaRepository{
  async save(categoria) {
    const nuevaCategoria = new CategoriaModel({nombre: categoria.nombre})
    return await CategoriaModel.save(categoria.nombre)
  }

  async findByNombre(nombre) {
    return await CategoriaModel.findOne({nombre})
  }
  async findById(id){
    return await CategoriaModel.findById(id)
  }
  async findAll() {
    return await CategoriaModel.find({})
  }
  //findById
}