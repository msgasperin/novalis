import { postJSON } from "../globals.js";

export const valida_login = async (usuario, contrasenia, csrf) => {
   const datos = { func: 'login', usuario, contrasenia, csrf };
   let respuesta;
   try {
      respuesta = await postJSON('api/controller/login.php', datos);
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor: "+ err, data: []};
   }
   return respuesta;
}

export const cerrar_sesion = async () => {
   const datos = { func: 'cerrar_sesion' };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/login.php', datos);
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor: "+ err, data: []};
   }
   return respuesta;
}