import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const obtiene_estudios_recepcion = async (tipoSolicitante, idListaPrecio) => {
   const datos = { func: 'obtiene_estudios_recepcion', tipoSolicitante, idListaPrecio };
   return await postJSON('../api/controller/ordenes.php', datos);
}

export const obtiene_ordenes_hoy = async () => {
   const datos = { func: 'obtiene_ordenes_hoy' };
   return await postJSON('../api/controller/ordenes.php', datos);
}

export const registrar_orden = async (objOrden) => {
   return await postJSON('../api/controller/ordenes.php', objOrden);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CARRITO DE ESTUDIOS EN RECEPCIÓN +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const agregar_estudio_carrito = async (idEstudio) => {
   const datos = { func: 'agregar_estudio_carrito', idEstudio };
   return await postJSON('../api/controller/ordenes.php', datos);
}

export const borrar_carrito_recepcion = async () => {
   const datos = { func: 'borrar_carrito_recepcion' };
   return await postJSON('../api/controller/ordenes.php', datos);
}

export const borrar_estudio_carrito = async (idCarrito) => {
   const datos = { func: 'borrar_estudio_carrito', idCarrito };
   return await postJSON('../api/controller/ordenes.php', datos);
}
