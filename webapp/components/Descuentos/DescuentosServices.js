import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto

export const guardar_descuento = async (objUser) => {
   let respuesta = await postJSON('../api/controller/descuentos.php', objUser);
   return respuesta;
};

export const obtiene_descuentos = async () => {
   const datos = { func: 'obtiene_descuentos' };
   let respuesta = await postJSON('../api/controller/descuentos.php', datos);
   return respuesta;
}

export const eliminar_descuento = async (idDescuento, conceptoDescuento, csrf) => {
   const datos = { func: 'eliminar_descuento', idDescuento, conceptoDescuento, csrf };     
   let respuesta = await postJSON('../api/controller/descuentos.php', datos);
   return respuesta;
}