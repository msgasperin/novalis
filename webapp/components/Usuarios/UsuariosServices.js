import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto


export const actualizar_llave = async (clave) => {
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/usuarios.php', {func: 'actualizar_llave', clave});
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }

   return respuesta;
};

export const guardar_usuario = async (objUser) => {
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/usuarios.php', objUser);
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }

   return respuesta;
};

export const obtiene_usuarios = async () => {
   const datos = { func: 'obtiene_usuarios' };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/usuarios.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const eliminar_usuario = async (idUsuario, nomUsuario) => {
   const datos = { func: 'eliminar', idUsuario, nomUsuario };     
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/usuarios.php', datos);
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const consulta_log = async (fecIni, fecFin, idUsuario) => {
   
   const datos = { func: 'consulta_log', fecIni, fecFin, idUsuario };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/usuarios.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}
   
