import { es } from "zod/v4/locales";

export class PedidoOutputDTO{
  constructor(pedido) {
    this._id = pedido._id || pedido.id,
    this.compradorId = pedido.comprador?._id
            ? pedido.comprador._id.toString()
            : pedido.comprador?.toString() || null;
    this.items = (pedido.items || []).map(item => ({
      productoId: item.producto?._id
            ? item.producto._id.toString()
            : item.producto?.toString() || null,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      estado: item.estado || null
    })),
    this.total = pedido.total,
    this.moneda = pedido.moneda,
    this.direccionEntrega = { ...pedido.direccionEntrega },
    this.estado = pedido.estado,
    this.fechaCreacion = pedido.fechaCreacion,
    this.historialEstados = (pedido.historialEstados || []).map(ce => ({
      estado: ce.estado || null,
      usuarioId: ce.usuarioId ? ce.usuarioId.toString() : null,
      fecha: ce.fecha || null,
      motivo: ce.motivo || null
    }));
  }
}