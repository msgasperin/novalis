import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const obtiene_clientes = async () => {
   const datos = { func: 'obtiene_clientes' };
   return await postJSON('../api/controller/clientes.php', datos);
}

export const guardar_cliente = async (objCliente) => {
   return await postJSON('../api/controller/clientes.php', objCliente);
};

export const eliminar_cliente = async (idCliente, nomCliente) => {
   const datos = { func: 'eliminar', idCliente, nomCliente };     
   return await postJSON('../api/controller/clientes.php', datos);
}
