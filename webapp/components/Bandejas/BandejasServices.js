import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const busqueda_ordenes_bandeja = async (origen, estatus, fechaIni, fechaFin, parametro) => {
   const datos = { func: 'busqueda_ordenes_bandeja', origen, estatus, fechaIni, fechaFin, parametro };
   return await postJSON('../api/controller/bandejas.php', datos);
}

export const obtiene_datos_gestion_resultados = async (idOrden) => {
   const datos = { func: 'obtiene_datos_gestion_resultados', idOrden };
   return await postJSON('../api/controller/bandejas.php', datos);
}
