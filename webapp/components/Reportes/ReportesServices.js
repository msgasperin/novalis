import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Entrada inventario ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const obtiene_reporte_mejores_clientes = async (fecIni, fecFin) => {   

   const datos = { func: 'obtiene_reporte_mejores_clientes', fecIni, fecFin };
   
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/reportes.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_reporte_stock_critico = async () => {

   const datos = { func: 'obtiene_reporte_stock_critico' };
   
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/reportes.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_reporte_utilidades = async (fecIni, fecFin) => {   

   const datos = { func: 'obtiene_reporte_utilidades', fecIni, fecFin };
   
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/reportes.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_reporte_mas_vendidos = async (fecIni, fecFin) => {

   const datos = { func: 'obtiene_reporte_mas_vendidos', fecIni, fecFin };
   
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/reportes.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_reporte_produccion = async (fecIni, fecFin, idUsuario) => {

   const datos = { func: 'obtiene_reporte_produccion', fecIni, fecFin, idUsuario };
   
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/reportes.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const obtiene_operativos = async () => {

   const datos = { func: 'obtiene_operativos' };
   
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/reportes.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}