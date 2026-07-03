import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto

export const obtiene_estudios = async () => {
   const datos = { func: 'obtiene_estudios' };
   let respuesta = await postJSON('../api/controller/estudios.php', datos);
   return respuesta;
}

export const guardar_estudio = async (objEstudio) => {   
   let respuesta = await postJSON('../api/controller/estudios.php', objEstudio);
   return respuesta;
};

export const eliminar_estudio = async (idEstudio, nomEstudio) => {
   const datos = { func: 'eliminar_estudio', idEstudio, nomEstudio };
   let respuesta = await postJSON('../api/controller/estudios.php', datos);
   return respuesta;
}