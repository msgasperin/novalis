import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const obtiene_convenios = async () => {
   const datos = { func: 'obtiene_convenios' };
   return await postJSON('../api/controller/convenios.php', datos);
}

export const guardar_convenio = async (objConvenio) => {
   return await postJSON('../api/controller/convenios.php', objConvenio);
};

export const eliminar_convenio = async (idConvenio, nomConvenio, csrf) => {
   const datos = { func: 'eliminar', idConvenio, nomConvenio, csrf };     
   return await postJSON('../api/controller/convenios.php', datos);
}

export const obtiene_credenciales_convenio = async (idConvenio) => {
   const datos = { func: 'obtiene_credenciales_convenio', idConvenio };
   let respuesta = await postJSON('../api/controller/convenios.php', datos);
   return respuesta;
}

export const cambiar_credenciales = async (idConvenio, nomConvenio, csrf) => {
   const datos = { func: 'cambiar_credenciales', idConvenio, nomConvenio, csrf };
   let respuesta = await postJSON('../api/controller/convenios.php', datos);
   return respuesta;
}
