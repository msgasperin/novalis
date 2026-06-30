import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto

export const guardar_usuario = async (objUser) => {
   let respuesta = await postJSON('../api/controller/usuarios.php', objUser);
   return respuesta;
};

export const obtiene_usuarios = async () => {
   const datos = { func: 'obtiene_usuarios' };
   let respuesta = await postJSON('../api/controller/usuarios.php', datos);
   return respuesta;
}

export const eliminar_usuario = async (idUsuario, nomUsuario) => {
   const datos = { func: 'eliminar', idUsuario, nomUsuario };     
   let respuesta = await postJSON('../api/controller/usuarios.php', datos);
   return respuesta;
}