export const TipoMoneda = Object.freeze({
  PESO_ARG: "PESO_ARG",
  DOLAR_USA: "DOLAR_USA",
  REAL: "REAL"
});

export const obtenerMoneda = (str) => {
  const match = Object.values(TipoMoneda).find(moneda => moneda === str);
  if (!match) throw new Error(`Moneda no válida: ${str}`);
  return match;
};