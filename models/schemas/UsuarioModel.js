import mongoose from "mongoose";
import { TipoUsuario } from "../entities/enums/TipoUsuario.js";
import { Usuario } from "../entities/Usuario.js";

const usuarioSchema = new mongoose.Schema({
nombre: {type: String, required: true},
email: {
  type: String,
  required: true,
  unique: true
},
telefono: {type: String , required: true},
tipo: {
  type: String,
  enum: Object.values(TipoUsuario),
  required: true
},
fechaAlta: { type: Date},
passwordHash: {type: String, required: true},
});
usuarioSchema.loadClass(Usuario);
usuarioSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id?.toString() || returnedObject.id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const UsuarioModel = mongoose.model('Usuario', usuarioSchema);
export default UsuarioModel