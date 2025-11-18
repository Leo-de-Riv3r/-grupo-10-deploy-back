import { CustomError } from "../errors/CustomError.js";
import { EntidadNotFoundError } from "../errors/ProductosErrors.js";
import { UsuarioRepository } from "../models/repositories/UsuariosRepository.js";
import UsuarioModel from "../models/schemas/UsuarioModel.js";
import logger from './logger.js'
import jwt from 'jsonwebtoken'
import config from '../utils/config.js'
import { UsuarioNotExists } from "../errors/UsuariosErrors.js";
import { NoTokenError } from "../errors/AuthErrors.js";
import multer from "multer";

const JWT_SECRET = config.JWT_SECRET
const extractUser = async(req, res, next) => {
 const authorization = req.headers.authorization;
 if (!authorization || !authorization.startsWith('Bearer ')) {
  throw new NoTokenError("Falta token de autenticación")
 }

 const token = authorization.split(' ')[1];
 req.user = jwt.verify(token, JWT_SECRET)
   next();
};


const extractUserForRefresh = (req, res, next) => {
  //extract token from bearer header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No autenticado" });
    req.user = jwt.verify(token, JWT_SECRET);
    next();
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.replace('Bearer ', '');
    }
    next();
  }

  const userExtractor = async (request, response, next) => {
      const token = request.headers["authorization"].split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const user = await UsuarioRepository.findById(decodedToken.id)
      request.user = user
      next()
  }


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    const statusCode = parseInt(err.statusCode, 10) || 400;
    return res.status(statusCode).json({
      success: false,
      type: "CustomError",
      message: err.message,
    });
  }
  // errores de mongodb
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      type: "ValidationError",
      message: "Datos inválidos en la solicitud",
      details: err.errors,
    });
  }

  // Errores de casteo (ej: ObjectId malformado)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      type: "CastError",
      message: `Valor inválido para campo`,
    });
  }

  // Error por duplicados (índice unique)
  if (err.code === 11000 || err.message.includes('E11000 duplicate key error')) {
    return res.status(409).json({
      success: false,
      type: "DuplicateKey",
      message: "El recurso ya existe con ese valor único",
    });
  }

  // Error de conexión con MongoDB
  if (err.name === "MongooseServerSelectionError") {
    return res.status(503).json({
      success: false,
      type: "DatabaseConnectionError",
      message: "No se pudo conectar a la base de datos",
    });
  }
//Errores de token
 if (err.name === 'JsonWebTokenError') {
  return res.status(401).json({
      success: false,
      type: "TokenError",
      message: "Token invalido",
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      type: "TokenExpired",
      message: "Token expirado",
    });
  }

  //errores de multer
  if (err instanceof multer.MulterError ) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Una o más imágenes superan los 10MB permitidos." });
    }
    if(err.code === "LIMIT_UNEXPECTED_FILE"){
     return res.status(400).json({ error: "Solo se permiten subir hasta 5 imagenes." }); 
    }
    return res.status(400).json({ error: "Error procesando archivos: " + err.message });
  }
  // Error genérico
  res.status(500).json({
    message: "Error inesperado",
  })

  next(err)
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  extractUserForRefresh,
  extractUser
}