export class ConversorMonedas {
  //inyecto tipos de cambios porque podria traerlos de un api
  constructor(tipoCambios) {
    this.tipoCambios = tipoCambios
  }

  convertir(desde, hacia, monto) {
    return monto * this.tipoCambios[desde][hacia]
  }
}
//tipoCambios=
// tiposCambios = 
// {
//   "PESO_ARG": {
//         "DOLAR_USA": 1500,
//         "REAL": 10
//         }
// }

