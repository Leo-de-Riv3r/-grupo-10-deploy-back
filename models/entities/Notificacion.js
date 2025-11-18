import { v4 as uuidv4 } from 'uuid';


export class Notificacion{
    fechaLeida 

    constructor(usuarioDestino,mensaje){
        this.usuarioDestino = usuarioDestino;
        this.mensaje = mensaje;
        //this.fechaAlta = new Date().toLocaleString();
        this.fechaAlta = new Date();
        this.leida = false;
    }

    marcarComoLeida(){
        this.leida = true;
        this.fechaLeida= new Date();
    }
}
