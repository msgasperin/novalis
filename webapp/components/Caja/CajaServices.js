import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto


export const abrir_caja = async (objCaja) => {
   let respuesta = await postJSON('../api/controller/caja.php', objCaja);
   return respuesta;
};

export const cerrar_caja = async (objCaja) => {   
   let respuesta = await postJSON('../api/controller/caja.php', objCaja);
   return respuesta;
};

export const obtener_historial_movimientos_caja = async (fecha) => {
   let datos = { func: 'obtener_historial_movimientos_caja', fecha }
   let respuesta = await postJSON('../api/controller/caja.php', datos);
   return respuesta;
};

export const registrar_movimiento = async (objMovimiento) => {   
   let respuesta = await postJSON('../api/controller/caja.php', objMovimiento);
   return respuesta;
};

export const eliminar_movimiento = async (objMovimiento) => {   
   let respuesta = await postJSON('../api/controller/caja.php', objMovimiento);
   return respuesta;
};

export const obtener_mis_cortes_caja = async (fecha) => {
   let datos = { func: 'obtener_mis_cortes_caja', fecha }
   let respuesta = await postJSON('../api/controller/caja.php', datos);
   return respuesta;
};