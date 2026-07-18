import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const obtiene_estudios_recepcion = async (tipoSolicitante, idListaPrecio) => {
   const datos = { func: 'obtiene_estudios_recepcion', tipoSolicitante, idListaPrecio };
   return await postJSON('../api/controller/ordenes.php', datos);
}

export const guardar_cliente = async (objCliente) => {
   return await postJSON('../api/controller/clientes.php', objCliente);
};

export const eliminar_cliente = async (idCliente, nomCliente) => {
   const datos = { func: 'eliminar', idCliente, nomCliente };     
   return await postJSON('../api/controller/clientes.php', datos);
}
