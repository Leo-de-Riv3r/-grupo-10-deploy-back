const baseUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

export const obtenerTipoCambio = () => {
  const tiposCambio = {};

  // Promesa combinada para las 3 monedas
  return Promise.all([
    fetch(baseUrl + "/ars.json").then(res => res.json()),
    fetch(baseUrl + "/usd.json").then(res => res.json()),
    fetch(baseUrl + "/brl.json").then(res => res.json())
  ])
  .then(([dataArs, dataUsd, dataBrl]) => {
    const cambiosArs = dataArs["ars"];
    const cambiosUsd = dataUsd["usd"];
    const cambiosBrl = dataBrl["brl"];

    tiposCambio["PESO_ARG"] = {
      DOLAR_USA: cambiosArs["usd"],
      REAL: cambiosArs["brl"],
      PESO_ARG: 1,
    };
    tiposCambio["DOLAR_USA"] = {
      PESO_ARG: cambiosUsd["ars"],
      REAL: cambiosUsd["brl"],
      DOLAR_USA: 1,
    };
    tiposCambio["REAL"] = {
      PESO_ARG: cambiosBrl["ars"],
      DOLAR_USA: cambiosBrl["usd"],
      REAL: 1,
    };

    return tiposCambio;
  })
  .catch(error => null); // si falla, retorna null
};
