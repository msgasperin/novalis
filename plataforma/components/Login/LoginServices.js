import { postJSON } from "../../../webapp/components/globals.js";

export const valida_login = async (usuario, contrasenia, tipoCliente, fechaNac, csrf) => {
   const datos = { func: 'login', usuario, contrasenia, tipoCliente, fechaNac, csrf };
   let respuesta;
   try {
      respuesta = await postJSON('plataforma/api/controller/login.php', datos);
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor: "+ err, data: []};
   }
   return respuesta;
}

export const cierra_sesion = async () => {
   const datos = { func: 'cierra_sesion' };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/login.php', datos);
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor: "+ err, data: []};
   }
   return respuesta;
}