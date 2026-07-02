import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_lista_precios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const obtiene_lista_precios = async () => {
   const datos = { func: 'obtiene_lista_precios' };
   return await postJSON('../api/controller/precios.php', datos);
}

export const guardar_lista_precio = async (objListaPrecios) => {
   return await postJSON('../api/controller/precios.php', objListaPrecios);
};

export const generar_lista_precios_base = async (idListaPrecios, nomListaPrecios) => {   
   let datos = { func: 'generar_lista_precios_base', idListaPrecios, nomListaPrecios };
   return await postJSON('../api/controller/precios.php', datos);
};

export const vaciar_lista_precios = async (idListaPrecios, nomListaPrecios) => {   
   let datos = { func: 'vaciar_lista_precios', idListaPrecios, nomListaPrecios };
   return await postJSON('../api/controller/precios.php', datos);
};

export const eliminar_lista_precios = async (idListaPrecios, nomListaPrecios) => {
   const datos = { func: 'eliminar_lista_precios', idListaPrecios, nomListaPrecios };     
   return await postJSON('../api/controller/precios.php', datos);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_precios+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const obtiene_precios_lista = async (idListaPrecios) => {
   const datos = { func: 'obtiene_precios_lista', idListaPrecios };
   return await postJSON('../api/controller/precios.php', datos);
}

export const agregar_estudio_lista = async (objEstudio) => {
   return await postJSON('../api/controller/precios.php', objEstudio);
};

export const actualizar_precio_especifico = async (idPrecio, nomEstudio, idListaPrecios, nomListaPrecios, nuevoPrecio) => {
   const datos = { func: 'actualizar_precio_especifico', idPrecio, nomEstudio, idListaPrecios, nomListaPrecios, nuevoPrecio };     
   return await postJSON('../api/controller/precios.php', datos);
}

export const eliminar_precio_especifico = async (idPrecio, nomEstudio, idListaPrecios, nomListaPrecios, precio) => {
   const datos = { func: 'eliminar_precio_especifico', idPrecio, nomEstudio, idListaPrecios, nomListaPrecios, precio };     
   let respuesta = await postJSON('../api/controller/precios.php', datos);
   return respuesta;
}

export const actualizacion_masiva_precios = async (idListaPrecios, nomListaPrecios, subirBajar, porcentaje) => {
   const datos = { func: 'actualizacion_masiva_precios', idListaPrecios, nomListaPrecios, subirBajar, porcentaje };     
   return await postJSON('../api/controller/precios.php', datos);
}

export const marcar_precio_defecto = async (idListaPrecios, nomListaPrecios) => {
   const datos = { func: 'marcar_precio_defecto', idListaPrecios, nomListaPrecios };     
   let respuesta = await postJSON('../api/controller/precios.php', datos);
   return respuesta;
}