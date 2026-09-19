import { postJSON } from "../../../webapp/components/globals.js";

export const obtiene_resultados_cliente = async (fDesde, fHasta, txtBusqueda) => {
   const datos = { func: 'obtiene_resultados_cliente', fDesde, fHasta, txtBusqueda };
   return await postJSON('api/controller/dashboard.php', datos);
}

export const obtiene_archivos_resultados_orden = async (idOrden) => {
   const datos = { func: 'obtiene_archivos_resultados_orden', idOrden };
   return await postJSON('api/controller/dashboard.php', datos);
}