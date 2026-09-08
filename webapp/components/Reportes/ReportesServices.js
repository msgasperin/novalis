import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const genera_reporte = async (idTipo, idSucursal, fechaIni, fechaFin) => {
   const datos = { func: 'genera_reporte', idTipo, idSucursal, fechaIni, fechaFin };
   return await postJSON('../api/controller/reportes.php', datos);
}
