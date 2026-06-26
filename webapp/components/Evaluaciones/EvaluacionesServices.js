import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES devoluciones ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const agregar_devolucion = async (objDevolucion) => {
   const datos = { func: 'agregar_devolucion', objDevolucion };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const eliminar_devolucion = async (idDevolucion, idDetallePedido, idPedido, nomProducto) => {
   const datos = { func: 'eliminar_devolucion', idDevolucion, idDetallePedido, idPedido, nomProducto };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES detalle pedidos ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const marcar_pedido_transito = async (idPedido, nomCliente ) => {
   const datos = { func: 'marcar_pedido_transito', idPedido, nomCliente };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const marcar_pedido_surtido = async (idPedido, nomCliente ) => {
   const datos = { func: 'marcar_pedido_surtido', idPedido, nomCliente };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const agregar_producto_pedido = async (idPedido, idProducto, nomProducto, cantidad, porDescuento, idListaPrecios ) => {
   const datos = { func: 'agregar_producto_pedido', idPedido, idProducto, nomProducto, cantidad, porDescuento, idListaPrecios };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const eliminar_producto_pedido = async (idDetallePedido, idPedido, nomProducto ) => {
   const datos = { func: 'eliminar_producto_pedido', idDetallePedido, idPedido, nomProducto };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_detalle_pedido = async (idPedido) => {
   const datos = { func: 'obtiene_detalle_pedido', idPedido };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_pedidos_fecha = async (fechaInicio, fechaFin) => {
   const datos = { func: 'obtiene_pedidos_fecha', fechaInicio, fechaFin };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const registrar_pedido = async (objPedido) => {
   const datos = { func: 'registrar_pedido', objPedido };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_precios_lista_cliente = async (idListaPrecios) => {
   const datos = { func: 'obtiene_precios_lista_cliente', idListaPrecios };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const validar_clave_autorizacion = async (clave) => {
   const datos = { func: 'valida_clave_autorizacion', clave };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const agregar_carrito_pedido = async (idProducto, cantidad, porDescuento) => {
   const datos = { func: 'agregar_carrito_pedido', idProducto, cantidad, porDescuento };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const borrar_carrito_pedido = async () => {
   const datos = { func: 'borrar_carrito_pedido' };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const borrar_producto_carrito = async (idCarrito) => {
   const datos = { func: 'borrar_producto_carrito', idCarrito };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const cancelar_pedido = async (idPedido, nomCliente, motivo) => {
   const datos = { func: 'cancelar_pedido', idPedido, nomCliente, motivo };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Adjuntar evidencias ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const agregar_evidencia_pedido = async (objEvidencia) => {
   let respuesta;
   try {
      respuesta = await postFormData('../api/controller/pedidos.php', objEvidencia);
      if(respuesta.estatus == 200) {
         objEvidencia.set("func", "agregar_evidencia_pedido");
         objEvidencia.set("archivo", respuesta.data[0]);
         let resUpload = await postFormData('../api/controller/pedidos.php', objEvidencia);
         if(resUpload.estatus != 200) {
            respuesta = { estatus: 203, "mensaje": "Hubo un problema para subir el archivo guardar la información", data: [] };
         }
      }      
   } catch (err) {
      respuesta = { estatus: 500, "mensaje": "Error del servidor: "+err, data: [] };
   }

   return respuesta;
};

export const eliminar_evidencia_pedido = async (idEvidencia, idPedido, nomArchivo, tipoEvidencia) => {
   const datos = { func: 'eliminar_evidencia_pedido', idEvidencia, idPedido, nomArchivo, tipoEvidencia };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_evidencias_pedido = async (idPedido) => {
   const datos = { func: 'obtiene_evidencias_pedido', idPedido };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Adjuntar evidencias ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const agregar_abono_pedido = async (objAbono) => {
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', objAbono);      
   } catch (err) {
      respuesta = { estatus: 500, "mensaje": "Error del servidor: "+err, data: [] };
   }

   return respuesta;
};

export const eliminar_abono_pedido = async (idAbono, idPedido, metodoPago, montoAbono) => {
   const datos = { func: 'eliminar_abono_pedido', idAbono, idPedido, metodoPago, montoAbono };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_abonos_pedido = async (idPedido) => {
   const datos = { func: 'obtiene_abonos_pedido', idPedido };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pedidos.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}
