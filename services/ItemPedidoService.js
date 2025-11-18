import { EstadoPedido } from "../models/entities/enums/EstadoPedido.js";

export class ItemPedidoService {
  constructor(ItemPedidoRepository, PedidoService) {
    this.itemPedidoRepository = ItemPedidoRepository;
    this.pedidoService = PedidoService;
  }
  async getItemPedidosByVendedorId({vendedorId, page, perPage}) {
    const itemPedidos = await this.itemPedidoRepository.findByVendedorId(vendedorId, page, perPage);
    return itemPedidos;
  }
  async getItemPedidoById(idItem) {
    const itemPedido = await this.findById(idItem);
    return itemPedido;
  }

  async marcarEnviado(itemPedidoId) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId);

    if (!itemPedido) {
      throw new PedidoNotFound();
    }

    console.log("itemPedido:", itemPedido);

    const lista = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.ENVIADO,
    ];

    if (lista.includes(itemPedido.estado)) {
      throw new NoPuedeEnviarseError();
    }
    
    console.log("idPedido en servicio:", itemPedido.idPedido);
    await this.actualizarEstadoItemPedido(itemPedido.idPedido);
    return await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.ENVIADO);
  }

  async actualizarEstadoItemPedido(idPedido) {
    await this.pedidoService.verificarEstado(idPedido);
  }

  async cancelarItemPedido(itemPedidoId) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId);
    console.log("itemPedidoId")
    console.log(itemPedidoId)
    console.log(itemPedido)
    if (!itemPedido) {
      throw new PedidoNotFound();
    }
    const lista = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.ENVIADO,
      EstadoPedido.EN_PREPARACION,
      EstadoPedido.CONFIRMADO
    ];

      console.log("itempedido")
    console.log(itemPedido)

    if (lista.includes(itemPedido.estado)) {
      throw new NoPuedeEnviarseError();
    }
  
    //await this.actualizarEstadoItemPedido(itemPedido.idPedido);
    return await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.CANCELADO);
  }

  async confirmarItemPedido(itemPedidoId) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId);
    if (!itemPedido) {
      throw new PedidoNotFound();
    }
    const lista = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.ENVIADO,
      EstadoPedido.EN_PREPARACION
    ];
    if (lista.includes(itemPedido.estado)) {
      throw new NoPuedeEnviarseError();
    }
    await this.actualizarEstadoItemPedido(itemPedido.idPedido);
    return await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.CONFIRMADO);
  }
}
