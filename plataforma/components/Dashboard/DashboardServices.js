import { postJSON } from "../../../webapp/components/globals.js";

export const validar_aceptacion_aviso = async () => {
   const datos = { func: 'validar_aceptacion_aviso' };
   return await postJSON('api/controller/dashboard.php', datos);
}

export const aceptar_aviso_privacidad = async () => {
   const datos = { func: 'aceptar_aviso_privacidad' };
   return await postJSON('api/controller/dashboard.php', datos);
}

export const obtiene_resultados_cliente = async (fDesde, fHasta, txtBusqueda) => {
   const datos = { func: 'obtiene_resultados_cliente', fDesde, fHasta, txtBusqueda };
   return await postJSON('api/controller/dashboard.php', datos);
}

export const obtiene_archivos_resultados_orden = async (idOrden) => {
   const datos = { func: 'obtiene_archivos_resultados_orden', idOrden };
   return await postJSON('api/controller/dashboard.php', datos);
}