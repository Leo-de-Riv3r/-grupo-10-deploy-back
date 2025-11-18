import { CustomError } from "./CustomError.js";

export class UsuarioNotExists extends CustomError {
    constructor(message) {
        super(message || "Usuario no encontrado", 404);
    }
}

export class UsuarioExists extends CustomError {
    constructor(message) {
        super(message || "Usuario ya existe", 409);
    }
}