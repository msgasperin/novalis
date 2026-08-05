import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const obtiene_estudios_recepcion = async (tipoSolicitante, idListaPrecio) => {
   const datos = { func: 'obtiene_estudios_recepcion', tipoSolicitante, idListaPrecio };
   return await postJSON('../api/controller/recepcion.php', datos);
}

export const obtiene_ordenes_hoy = async () => {
   const datos = { func: 'obtiene_ordenes_hoy' };
   return await postJSON('../api/controller/recepcion.php', datos);
}

export const buscar_ordenes_avanzado = async (filtro, parametro, estatus) => {
   const datos = { func: 'busqueda_avanzada_ordenes', filtro, parametro, estatus };
   return await postJSON('../api/controller/recepcion.php', datos);
}

export const registrar_orden = async (objOrden) => {
   return await postJSON('../api/controller/recepcion.php', objOrden);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CARRITO DE ESTUDIOS EN RECEPCIÓN +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const agregar_estudio_carrito = async (idEstudio) => {
   const datos = { func: 'agregar_estudio_carrito', idEstudio };
   return await postJSON('../api/controller/recepcion.php', datos);
}

export const borrar_carrito_recepcion = async () => {
   const datos = { func: 'borrar_carrito_recepcion' };
   return await postJSON('../api/controller/recepcion.php', datos);
}

export const borrar_estudio_carrito = async (idCarrito) => {
   const datos = { func: 'borrar_estudio_carrito', idCarrito };
   return await postJSON('../api/controller/recepcion.php', datos);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ GESTIÓN DE ABONOS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const obtener_abonos_orden = async (idOrden) => {
   const datos = { func: 'obtener_abonos_orden', idOrden };
   return await postJSON('../api/controller/recepcion.php', datos);
}

export const obtener_saldos_orden = async (idOrden) => {
   const datos = { func: 'obtener_saldos_orden', idOrden };
   return await postJSON('../api/controller/recepcion.php', datos);
}

export const registra_abono = async (idOrden, metodoPago, monto) => {
   const datos = { func: 'registra_abono', idOrden, metodoPago, monto };
   return await postJSON('../api/controller/recepcion.php', datos);
}