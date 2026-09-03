import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto


export const abrir_caja = async (objCaja) => {
   let respuesta = await postJSON('../api/controller/caja.php', objCaja);
   return respuesta;
};

export const cerrar_caja = async (objCaja) => {   
   let respuesta = await postJSON('../api/controller/caja.php', objCaja);
   return respuesta;
};