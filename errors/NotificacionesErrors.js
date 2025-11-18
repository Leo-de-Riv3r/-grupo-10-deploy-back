import { CustomError } from "./CustomError.js";

export class NotificacionUsuarioError extends CustomError {
  constructor(message) {
    super(message || "El parametro usuario es obligatorio", 400);
  }
}

export class NotificacionNotFoundError extends CustomError {
  constructor(message) {
    super(message || "Notificacion no encontrada", 404);
  }
}

export class NotificacionUsuarioMissmatchError extends CustomError {
  constructor(message) {
    super(message || "El usuario no corresponde a la notificacion", 400);
  }
}