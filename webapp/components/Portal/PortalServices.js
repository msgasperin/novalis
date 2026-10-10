import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto

export const guarda_promocion = async (objPromocion) => {
   let respuesta = await postJSON('../api/controller/portal.php', objPromocion);
   return respuesta;
};

export const obtiene_promociones = async () => {
   const datos = { func: 'obtiene_promociones' };
   let respuesta = await postJSON('../api/controller/portal.php', datos);
   return respuesta;
}

export const elimina_promocion = async (idPromocion, nomPromocion, csrf) => {
   const datos = { func: 'elimina_promocion', idPromocion, nomPromocion, csrf };     
   let respuesta = await postJSON('../api/controller/portal.php', datos);
   return respuesta;
}

export const actualiza_whats = async (whatsapp, csrf) => {
   const datos = { func: 'actualiza_whats', whatsapp, csrf };     
   let respuesta = await postJSON('../api/controller/portal.php', datos);
   return respuesta;
}

export const publica_cambios = async (csrf) => {
   const datos = { func: 'publica_cambios', csrf };     
   let respuesta = await postJSON('../api/controller/portal.php', datos);
   return respuesta;
}