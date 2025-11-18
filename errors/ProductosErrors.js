import { CustomError } from "./CustomError.js";

export class EntidadNotFoundError extends CustomError {
  constructor(message) {
    super(message, 404)
  }  
}

export class InputValidationError extends CustomError {
  constructor(message) {
    super(message, 400)
  }  
}

export class NotEnoughStockError extends CustomError {
  constructor(message) {
    super(message || "No hay suficiente stock", 400);
  }
}

export class ImageUploadError extends CustomError {
  constructor(message) {
    super(message || "Error al subir la imagen", 502);
  }
}