import mongoose from "mongoose";
import {Categoria} from '../entities/Categoria.js'

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minLength: 3
  }
});
categoriaSchema.loadClass(Categoria);

const CategoriaModel = mongoose.model('Categoria', categoriaSchema);
export default CategoriaModel
