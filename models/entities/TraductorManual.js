import { EstadoPedido } from "./enums/EstadoPedido.js"

export class TraductorManual {
  constructor() {
    this.mensajes = {
      [EstadoPedido.ENVIADO]: {
        ES: "Tu pedido ha sido enviado",
        EN: "Your order has been shipped",
        BR: "Pedido enviado",
      },
      [EstadoPedido.PENDIENTE]: {
        ES: "Tu pedido está pendiente",
        EN: "Pending order",
        BR: "Pedido pendente",
      },
      [EstadoPedido.CANCELADO]: {
        ES: "Tu pedido ha sido cancelado",
        EN: "Your order has been cancelled",
        BR: "Pedido cancelado",
      },
      [EstadoPedido.CONFIRMADO]: {
        ES: "Tu pedido fue confirmado",
        EN: "Your order is confirmed",
        BR: "Pedido confirmado",
      },
      [EstadoPedido.EN_PREPARACION]: {
        ES: "Tu pedido está en preparación",
        EN: "We are preparing your order, soon we'll send it",
        BR: "Pedido em preparação",
      },
      [EstadoPedido.ENTREGADO]: {
        ES: "Tu pedido fue entregado",
        EN: "Your order was delivered",
        BR: "Pedido entregue",
      }
    };
  }

  traducir = (estado, idioma) => {
    const traducciones = this.mensajes[estado];
    if (!traducciones) {
      throw new Error(`Estado no soportado: ${estado}`);
    }
    const mensaje = traducciones[idioma]
    if (!mensaje) {
      throw new Error(`Idioma no soportado: ${idioma}`)
    }
    return mensaje
  };

  agregarTraduccion = (idioma, traducciones) => {
    const estados = Object.values(EstadoPedido);

      const estadosFaltantes = estados.filter(e => !traducciones[e])
      if (estadosFaltantes.length > 0) throw new Error(`Falta traducciones para alguno/s de los estados`);

    // agregar traducciones
    estados.forEach(e => {this.mensajes[e][idioma] = traducciones[e]})
  };
}

//ejemplo
// let xd = new TraductorManual()
// xd.agregarTraduccion("CHN", {
//     "ENVIADO" : "chin chon chin chon",
//     "PENDIENTE" : "chin chon chin chon",
//     "CANCELADO" : "chin chon chin chon",
//     "CONFIRMADO" : "chin chon chin chon",
//     "EN_PREPARACION" : "chin chon chin chon",
//     "ENTREGADO" : "SDSDSFDSF"
// })