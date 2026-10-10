import { obtiene_descuentos, guardar_descuento, eliminar_descuento } from "./DescuentosServices.js";

let arrDescuentos = [];

const TabDescuentos = async () => {
   const res = await valida_menu('descuentos');

   if (!res || res.estatus != 200) {
      ModalAccesoDenegado('Descuentos');
      $('#containerMain').html(`<div class="alert alert-danger mt-3 p-2 text-center">No tienes permisos para ver este módulo.</div>`);
      return;
   }

   let html = `
   <div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2 fw-bold">
         <div class="fs-4"><i class="bi bi-percent me-2"></i>Descuentos</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevoDescuento" onclick="ModalFormDescuento(0);">
            <i class="bi bi-plus-lg"></i> Nuevo Desc.
         </button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 col-md-3">
         <div class="input-group">
            <input type="text" name="inpBusquedaDescuento" id="inpBusquedaDescuento" class="form-control border-end-0" placeholder="Buscar descuento" onkeyup="fn_buscar_descuento();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="containerListDescuento"></div>      
   </div>`;

   $('#containerMain').html(html);
   listar_descuentos();
};

const ModalFormDescuento = (idDescuento = 0) => {
   let idNum = parseInt(idDescuento) || 0;
   let descuentoSeleccionado = arrDescuentos.find(d => d.id == idNum);

   let titulo;
   let concepto   = '';
   let porcentaje = '';

   if (idNum > 0 && descuentoSeleccionado) {
      titulo     = 'Editar Descuento: ' + (descuentoSeleccionado.concepto_desc || '');
      concepto   = descuentoSeleccionado.concepto_desc || '';
      porcentaje = descuentoSeleccionado.porcentaje_desc || '';
   }
   else {
      titulo = 'Registrar Nuevo Descuento';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormDescuentos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${escapeHTML(titulo)}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="col-12 mt-3">
                     <label class="form-label fw-bold mb-1" for="conceptoDescuento">Concepto del descuento *</label>
                     <input type="text" name="conceptoDescuento" id="conceptoDescuento" class="form-control" maxlength="150" value="${escapeHTML(concepto)}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <label class="form-label fw-bold mb-1" for="porcentajeDescuento">% Porcentaje del descuento *</label>
                     <input type="text" inputmode="numeric" name="porcentajeDescuento" id="porcentajeDescuento" class="form-control" maxlength="3" value="${escapeHTML(porcentaje)}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
               </div>
            </div>
            <div class="modal-footer text-end">
               <button type="button" class="btn btn-secondary btn-lib btn-redondo" id="btnSaveDescuento" onclick="fn_guardar_descuento(${idNum});">
                  <i class="bi bi-save"></i> Guardar
               </button> 
               <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cancelar
               </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalFormDescuentos').modal('show');   
};

const listar_descuentos = async () => {
   activarLoad('Cargando descuentos...');
   let respuesta = await obtiene_descuentos();
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      closeLoad();
      return;
   }
   else {
      arrDescuentos = respuesta.data || [];
      pinta_listado_descuentos(arrDescuentos);
   }
};

const pinta_listado_descuentos = (data) => {
   if (!data || data.length === 0) {
      $('#containerListDescuento').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron descuentos registrados</div>');
      closeLoad();
      return;
   }
   
   let html = `<div class="row">`;
   data.forEach((row) => {
      html += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mt-2" id="cardDescuento${row.id}">
         <div class="card mb-3 shadow-sm border-0">
            <div class="card-body">
               <div class="row fs-8">
                  <div class="col-2 mt-2">
                     <i class="bi bi-percent fs-4 text-secondary"></i>
                  </div>
                  <div class="col-10 mt-2">
                     <div class="mt-1 fs-6"><b>${escapeHTML(row.concepto_desc || '')}</b></div>
                     <div class="text-muted">${escapeHTML(row.porcentaje_desc || '0')}% de descuento.</div>
                  </div>
               </div>
            </div>
            <div class="card-footer bg-white border-top-0 pb-2">
               <div class="d-flex justify-content-end gap-2">
                  <!-- Invocaciones con ID numérico únicamente -->
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormDescuento(${row.id});">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarDescuento" title="Eliminar" onclick="fn_eliminar_descuento(${row.id});">
                     <i class="bi bi-trash"></i>
                  </button>                
               </div>
            </div>
         </div>
      </div>`;
   });

   html += `</div>`;
   $('#containerListDescuento').html(html);
   closeLoad();
};

const fn_guardar_descuento = async (idDescuento = 0) => {
   let idNum               = parseInt(idDescuento) || 0;
   let conceptoDescuento   = $('#conceptoDescuento').val().trim();
   let porcentajeDescuento = $('#porcentajeDescuento').val().trim();
   let porcentajeNum       = parseFloat(porcentajeDescuento) || 0;
   let msjAccion           = '';

   if (conceptoDescuento === '') {
      ToastColor.fire({ text: '¡Atención! Debes ingresar el concepto del descuento', icon: 'warning' });
      $('#conceptoDescuento').focus();
      return;
   }
   else if (porcentajeDescuento === '' || porcentajeNum <= 0 || porcentajeNum > 100) {
      ToastColor.fire({ text: '¡Atención! Debes ingresar un porcentaje de descuento válido (entre 1 y 100)', icon: 'warning' });
      $('#porcentajeDescuento').focus();
      return;
   }
      
   const objDescuento = { 
      func: 'guardar_descuento', 
      idDescuento: idNum, 
      conceptoDescuento, 
      porcentajeDescuento: porcentajeNum,
      csrf: CSRF_TOKEN 
   };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información del descuento ' + escapeHTML(conceptoDescuento) + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnSaveDescuento').prop('disabled', false);
      return;
   }

   $('#btnSaveDescuento').prop('disabled', true);
   let respuesta = await guardar_descuento(objDescuento);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      msjAccion = idNum > 0 ? 'Información actualizada correctamente' : 'Descuento guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormDescuentos').modal('hide');
      listar_descuentos();
      $('#btnSaveDescuento').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnSaveDescuento').prop('disabled', false);
      return;
   }
};

const fn_eliminar_descuento = async (idDescuento) => {
   let idNum = parseInt(idDescuento) || 0;
   let descuentoSelected = arrDescuentos.find(d => d.id == idNum);
   if (!descuentoSelected) return;

   let conceptoDescuento = descuentoSelected.concepto_desc || '';

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El descuento: ' + escapeHTML(conceptoDescuento) + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarDescuento').prop('disabled', false);
      return;
   }

   $('.btnEliminarDescuento').prop('disabled', true);
   let respuesta = await eliminar_descuento(idDescuento, conceptoDescuento, CSRF_TOKEN);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Descuento eliminado correctamente', '', 'success', 2500);
      $('#cardDescuento' + idNum).remove();
      arrDescuentos = arrDescuentos.filter(d => d.id != idNum);
      $('.btnEliminarDescuento').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarDescuento').prop('disabled', false);
      return;
   }
};

const fn_buscar_descuento = () => {
   let busqueda = $('#inpBusquedaDescuento').val().trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

   const filtrado = arrDescuentos.filter(descuento => {
      const conceptoSinAcentos = (descuento.concepto_desc || '').toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
      return conceptoSinAcentos.includes(busqueda);
   });

   pinta_listado_descuentos(filtrado);
};

// Interfaces
window.TabDescuentos         = TabDescuentos;
window.ModalFormDescuento    = ModalFormDescuento;

// Funciones
window.fn_eliminar_descuento = fn_eliminar_descuento;
window.fn_guardar_descuento  = fn_guardar_descuento; 
window.fn_buscar_descuento   = fn_buscar_descuento;