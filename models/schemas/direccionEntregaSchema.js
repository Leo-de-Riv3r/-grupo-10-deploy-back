import mongoose from "mongoose";
import DireccionEntrega  from "../entities/DireccionEntrega.js";

const direccionEntregaSchema = new mongoose.Schema({
    calle: { type: String, required: true },
    altura: { type: String, required: true },
    piso: { type: String },
    departamento: { type: String },
    codigoPostal: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    pais: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
},{_id: false});

direccionEntregaSchema.loadClass(DireccionEntrega);

const DireccionEntregaModel = mongoose.model("DireccionEntrega", direccionEntregaSchema);

export default DireccionEntregaModel;
export { direccionEntregaSchema };