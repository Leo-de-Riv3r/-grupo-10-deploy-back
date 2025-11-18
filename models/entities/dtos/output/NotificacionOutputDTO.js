export class NotificacionOutputDTO{
    constructor(numeroPagina, elementosPagina, total, totalPaginas, notificaciones){
        this.pagina = numeroPagina,
        this.perPage = elementosPagina,
        this.total = total,
        this.totalPaginas = totalPaginas,
        this.data = notificaciones
    }
}
