import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto


export const guardar_trabajador = async (objCliente) => {

   let respuesta;

   try {
      respuesta = await postFormData('../api/controller/clientes.php', objCliente);
      if(respuesta.estatus == 200 && objCliente.get("tieneImagen") == 1) {
         objCliente.set("func", "subir_logo_cliente");
         objCliente.set("idCliente", respuesta.data[0]);
         let resUpload = await postFormData('../api/controller/clientes.php', objCliente);
         if(resUpload.estatus != 200) {
            respuesta = { estatus: 203, "mensaje": "El registro se realizó, pero el archivo no se subió", data: [] };
         }
      }
   } catch (err) {
      respuesta = { estatus: 500, "mensaje": "Error del servidor: "+err, data: [] };
   }

   return respuesta;
};

export const obtiene_trabajadores = async () => {
   const datos = { func: 'obtiene_clientes' };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/clientes.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const eliminar_trabajador = async (idCliente, nomCliente) => {
   const datos = { func: 'eliminar', idCliente, nomCliente };     
   try {
      const respuesta = await postJSON('../api/controller/clientes.php', datos);
      return respuesta;
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
}
