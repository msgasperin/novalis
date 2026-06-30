import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const obtiene_empresas = async () => {
   const datos = { func: 'obtiene_empresas' };
   return await postJSON('../api/controller/empresas.php', datos);
}

export const guardar_empresa = async (objEmpresa) => {
   return await postJSON('../api/controller/empresas.php', objEmpresa);
};

export const eliminar_empresa = async (idEmpresa, nomComercial) => {
   const datos = { func: 'eliminar', idEmpresa, nomComercial };     
   return await postJSON('../api/controller/empresas.php', datos);
}
