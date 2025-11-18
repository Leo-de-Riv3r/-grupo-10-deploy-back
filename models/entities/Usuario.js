import { v4 as uuidv4 } from 'uuid';

export class Usuario {
  constructor(nombre, email, telefono, tipo) {      
    this.nombre = nombre;        
    this.email = email;          
    this.telefono = telefono;    
    this.tipo = tipo;            
    this.fechaAlta = new Date();
    this.passwordHash = null;
  }
}

