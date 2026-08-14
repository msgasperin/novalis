import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto

export const guarda_datos_facturacion = async (objUser) => {
   let respuesta = await postJSON('../api/controller/datos_facturacion.php', objUser);
   return respuesta;
};

export const obtiene_datos_facturacion = async (tipoReceptor, idReceptor) => {
   const datos = { func: 'obtiene_datos_facturacion', tipoReceptor, idReceptor };
   let respuesta = await postJSON('../api/controller/datos_facturacion.php', datos);
   return respuesta;
}

export const elimina_datos_facturacion = async (idDatosFacturacion, nomReceptor) => {
   const datos = { func: 'elimina_datos_facturacion', idDatosFacturacion, nomReceptor };     
   let respuesta = await postJSON('../api/controller/datos_facturacion.php', datos);
   return respuesta;
}