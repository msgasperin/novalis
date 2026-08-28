import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const busqueda_ordenes_bandeja = async (origen, estatus, fechaIni, fechaFin, parametro) => {
   const datos = { func: 'busqueda_ordenes_bandeja', origen, estatus, fechaIni, fechaFin, parametro };
   return await postJSON('../api/controller/bandejas.php', datos);
}

export const obtiene_archivos_resultados_orden = async (idOrden) => {
   const datos = { func: 'obtiene_archivos_resultados_orden', idOrden };
   return await postJSON('../api/controller/bandejas.php', datos);
}

export const obtiene_estudios_orden = async (idOrden) => {
   const datos = { func: 'obtiene_estudios_orden', idOrden };
   return await postJSON('../api/controller/bandejas.php', datos);
}

export const sube_pdf_resultado = async (objSubidaResultado) => {
   return await postFormData('../api/controller/bandejas.php', objSubidaResultado);
};

export const eliminar_pdf_resultado = async (idArchivo, idOrden, folio, nomServidor, nomOriginal) => {
   const datos = { func: 'eliminar_pdf_resultado', idArchivo, idOrden, folio, nomServidor, nomOriginal };
   return await postJSON('../api/controller/bandejas.php', datos);
}

export const marcar_orden_como_parcial = async (idOrden, folio) => {
   const datos = { func: 'marcar_orden_como_parcial', idOrden, folio };
   return await postJSON('../api/controller/bandejas.php', datos);
}

export const marcar_orden_como_completada = async (idOrden, folio) => {
   const datos = { func: 'marcar_orden_como_completada', idOrden, folio };
   return await postJSON('../api/controller/bandejas.php', datos);
}

export const procesar_publicacion_notificacion = async (idOrden, folio, paciente, correo, telefono) => {
   const datos = { func: 'procesar_publicacion_notificacion', idOrden, folio, paciente, correo, telefono };
   return await postJSON('../api/controller/bandejas.php', datos);
}

export const notificar_mail_resultados = async (keyQuery, correo) => {
   const datos = { func: 'notificar_mail_resultados', keyQuery, correo };
   return await postJSON('../api/controller/enviar_resultados_mail.php', datos);
}
