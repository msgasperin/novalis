import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto

export const guardar_sucursal = async (objUser) => {   
   let respuesta = await postJSON('../api/controller/sucursales.php', objUser);
   return respuesta;
};

export const obtiene_sucursales = async () => {
   const datos = { func: 'obtiene_sucursales' };
   let respuesta = await postJSON('../api/controller/sucursales.php', datos);
   return respuesta;
}

export const eliminar_sucursal = async (idSucursal, nomSucursal) => {
   const datos = { func: 'eliminar', idSucursal, nomSucursal };
   let respuesta = await postJSON('../api/controller/sucursales.php', datos);
   return respuesta;
}