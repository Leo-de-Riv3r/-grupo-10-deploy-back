
export default class DireccionEntrega {
  constructor({calle, altura, piso, departamento, codigoPostal, ciudad, provincia, pais, lat, lon}) {
    this.calle = calle;
    this.altura = altura;
    this.piso = piso;
    this.departamento = departamento;
    this.codigoPostal = codigoPostal;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.pais = pais;
    this.lat = lat;
    this.lon = lon;
  }
}


export class DireccionEntregaBuilder {
  constructor() {
    this.calle = "";
    this.altura = "";
    this.piso = "";
    this.departamento = "";
    this.codigoPostal = "";
    this.ciudad = "";
    this.provincia = "";
    this.pais = "";
    this.lat = null;
    this.lon = null;
  }

  withCalle(calle) {
    this.calle = calle;
    return this;
  }

  withAltura(altura) {
    this.altura = altura;
    return this;
  }

  withPiso(piso) {
    this.piso = piso;
    return this;
  }

  withDepartamento(departamento) {
    this.departamento = departamento;
    return this;
  }

  withCodigoPostal(codigoPostal) {
    this.codigoPostal = codigoPostal;
    return this;
  }

  withCiudad(ciudad) {
    this.ciudad = ciudad;
    return this;
  }

  withProvincia(provincia) {
    this.provincia = provincia;
    return this;
  }

  withPais(pais) {
    this.pais = pais;
    return this;
  }

  withLat(lat) {
    this.lat = lat;
    return this;
  }

  withLon(lon) {
    this.lon = lon;
    return this;
  }

  build() {
    return new DireccionEntrega({
      calle: this.calle,
      altura: this.altura,
      piso: this.piso,
      departamento: this.departamento,
      codigoPostal: this.codigoPostal,
      ciudad: this.ciudad,
      provincia: this.provincia,
      pais: this.pais,
      lat: this.lat,
      lon: this.lon
    });
  }
}
