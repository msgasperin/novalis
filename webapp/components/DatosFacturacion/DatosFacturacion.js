import { 
   obtiene_datos_facturacion, 
   guarda_datos_facturacion, 
   elimina_datos_facturacion 
} from "./DatosFacturacionServices.js";

let arrDatosFacturacion = [];
let receptorActual = { tipo: '', id: 0 };

const ModalDatosFacturacion = (tipoReceptor, idReceptor, nomReceptor = '') => {
   const idNumReceptor = parseInt(idReceptor) || 0;
   receptorActual = { tipo: tipoReceptor, id: idNumReceptor };

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormDatosFacturacion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Datos de facturación ${nomReceptor ? ': ' + escapeHTML(nomReceptor) : ''}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <input type="hidden" id="idDatoFacturacion" value="0">
               <div class="card shadow">
                  <div class="card-body">
                     <div class="row">
                        <div class="col-9">
                           <h6><b>Formulario de registro</b></h6>
                        </div>
                        <div class="col-3 text-end">
                           <button type="button" class="btn btn-success btn-redondo btn-sm" onclick="carga_datos_editar_fact(0);">
                              <i class="bi bi-plus-lg"></i> Nuevo
                           </button>
                        </div>
                        <div class="col-12 col-sm-3 mt-3">
                           <label class="form-label fw-bold mb-1" for="rfcFact">RFC *</label>
                           <input type="text" name="rfcFact" id="rfcFact" class="form-control" maxlength="13" onblur="filtra_regimen_fiscal('regimenFiscalFact','rfcFact'); filtra_uso_cfdi('usoCfdiFact','rfcFact');" onkeyup="this.value = this.value.toUpperCase();"/>
                        </div>
                        <div class="col-12 col-sm-9 mt-3">
                           <label class="form-label fw-bold mb-1" for="razonSocialFact">Razón social *</label>
                           <input type="text" name="razonSocialFact" id="razonSocialFact" class="form-control" maxlength="255"/>
                        </div>
                        <div class="col-12 col-sm-6 mt-3">
                           <label class="form-label fw-bold mb-1" for="regimenFiscalFact">Régimen fiscal *</label>
                           <select name="regimenFiscalFact" id="regimenFiscalFact" class="form-select">
                              <option value="000">-- Seleccione un Régimen Fiscal --</option>
                           </select>
                        </div>
                        <div class="col-12 col-sm-6 mt-3">
                           <label class="form-label fw-bold mb-1" for="usoCfdiFact">Uso de CFDI *</label>
                           <select name="usoCfdiFact" id="usoCfdiFact" class="form-select">
                              <option value="000">-- Seleccione un Uso de CFDI --</option>
                           </select>
                        </div>
                        <div class="col-12 col-sm-3 mt-3">
                           <label class="form-label fw-bold mb-1" for="codigoPostalFact">Código Postal *</label>
                           <input type="text" inputmode="numeric" name="codigoPostalFact" id="codigoPostalFact" class="form-control" maxlength="5" onkeypress="return fnValidaNumeros(event);" onpaste="return false;"/>
                        </div>
                        <div class="col-12 col-sm-9 mt-3">
                           <label class="form-label fw-bold mb-1" for="calleFact">Calle</label>
                           <input type="text" name="calleFact" id="calleFact" class="form-control" maxlength="150"/>
                        </div>
                        <div class="col-6 col-sm-2 mt-3">
                           <label class="form-label fw-bold mb-1" for="noExtFact">No. Exterior</label>
                           <input type="text" name="noExtFact" id="noExtFact" class="form-control" maxlength="20"/>
                        </div>
                        <div class="col-6 col-sm-2 mt-3">
                           <label class="form-label fw-bold mb-1" for="noIntFact">No. Interior</label>
                           <input type="text" name="noIntFact" id="noIntFact" class="form-control" maxlength="20"/>
                        </div>
                        <div class="col-12 col-sm-8 mt-3">
                           <label class="form-label fw-bold mb-1" for="coloniaFact">Colonia</label>
                           <input type="text" name="coloniaFact" id="coloniaFact" class="form-control" maxlength="100"/>
                        </div>
                        <div class="col-12 col-sm-6 mt-3">
                           <label class="form-label fw-bold mb-1" for="municipioFact">Municipio</label>
                           <input type="text" name="municipioFact" id="municipioFact" class="form-control" maxlength="100"/>
                        </div>
                        <div class="col-12 col-sm-6 mt-3">
                           <label class="form-label fw-bold mb-1" for="estadoFact">Estado</label>
                           <input type="text" name="estadoFact" id="estadoFact" class="form-control" maxlength="100"/>
                        </div>
                        <div class="col-12 col-sm-6 mt-3">
                           <label class="form-label fw-bold mb-1" for="correoFact">Correo facturación *</label>
                           <input type="email" name="correoFact" id="correoFact" class="form-control" maxlength="150"/>
                        </div>
                        <div class="col-12 col-sm-6 mt-3">
                           <label class="form-label fw-bold mb-1" for="chkDatosFactPredeterminado">¿Datos predeterminados de facturación?</label>
                           <div class="form-check form-switch fs-4 mb-0 me-1">
                              <input class="form-check-input style-cursor-pointer" type="checkbox" id="chkDatosFactPredeterminado" name="chkDatosFactPredeterminado" role="switch">
                           </div>
                        </div>
                        <div class="col-12 text-end mt-3">
                           <button type="button" class="btn btn-secondary btn-lib btn-redondo" id="btnSaveDatFact" onclick="guardar_datos_facturacion();">
                              <i class="bi bi-save"></i> Guardar
                           </button> 
                           <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                              Cancelar
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="row mt-3">
                  <div class="col-12">
                     <div id="container_listado_datos_facturacion"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalFormDatosFacturacion').modal('show');
   listar_datos_facturacion('container_listado_datos_facturacion', tipoReceptor, idNumReceptor);
   filtra_regimen_fiscal('regimenFiscalFact', 'rfcFact');
   filtra_uso_cfdi('usoCfdiFact', 'rfcFact');
};

const filtra_regimen_fiscal = (selectDestinoId, inputOrigenId) => {
   let rfcVal   = $('#' + inputOrigenId).val().trim();
   let longitud = rfcVal.length;
   let select   = $('#' + selectDestinoId);

   const valorPrevio = select.val();
   let regimenFiltrado = typeof REGIMENES_FISCALES !== 'undefined' ? REGIMENES_FISCALES : [];

   if (longitud === 13) {
      regimenFiltrado = regimenFiltrado.filter(reg => reg.aplicaFisica);
   } else if (longitud === 12) {
      regimenFiltrado = regimenFiltrado.filter(reg => reg.aplicaMoral);
   }

   select.empty().append('<option value="000">-- Seleccione un Régimen Fiscal --</option>');

   regimenFiltrado.forEach(reg => {
      select.append(`<option value="${escapeHTML(reg.clave)}">${escapeHTML(reg.clave)} - ${escapeHTML(reg.descripcion)}</option>`);
   });

   if (valorPrevio && select.find(`option[value="${valorPrevio}"]`).length > 0) {
      select.val(valorPrevio);
   }
};

const filtra_uso_cfdi = (selectDestinoId, inputOrigenId) => {
   let rfcVal   = $('#' + inputOrigenId).val().trim();
   let longitud = rfcVal.length;
   let select   = $('#' + selectDestinoId);

   const valorPrevio = select.val();
   let usoCfdiFiltrado = typeof USOS_CFDI !== 'undefined' ? USOS_CFDI : [];

   if (longitud === 13) {
      usoCfdiFiltrado = usoCfdiFiltrado.filter(reg => reg.aplicaFisica);
   } else if (longitud === 12) {
      usoCfdiFiltrado = usoCfdiFiltrado.filter(reg => reg.aplicaMoral);
   }

   select.empty().append('<option value="000">-- Seleccione un Uso de CFDI --</option>');

   usoCfdiFiltrado.forEach(reg => {
      select.append(`<option value="${escapeHTML(reg.clave)}">${escapeHTML(reg.clave)} - ${escapeHTML(reg.descripcion)}</option>`);
   });

   if (valorPrevio && select.find(`option[value="${valorPrevio}"]`).length > 0) {
      select.val(valorPrevio);
   }
};

const listar_datos_facturacion = async (containerId, tipoReceptor, idReceptor) => {
   const idNum = parseInt(idReceptor) || 0;
   let respuesta = await obtiene_datos_facturacion(tipoReceptor, idNum);

   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      $('#' + containerId).html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');
      arrDatosFacturacion = respuesta.data || [];
      pintar_lista_datos_facturacion(arrDatosFacturacion, containerId);
   }
};

const pintar_lista_datos_facturacion = (data, containerId) => {
   if (!data || data.length === 0) {
      $(`#${containerId}`).html(`
         <div class="text-center py-4">
            <img src="assets/images/no_encontrado.png" class="img-fluid mb-2" style="max-height: 85px;" alt="Sin registros">
            <p class="text-muted small mb-0">No se encontraron datos de facturación registrados</p>
         </div>
      `);
      return;
   }

   let html = `<div class="row g-2">`;

   data.forEach((row) => {
      const partesDireccion = [
         row.calle ? `${row.calle}${row.numero_exterior ? ' No. ' + row.numero_exterior : ''}${row.numero_interior ? ' Int. ' + row.numero_interior : ''}` : '',
         row.colonia ? `Col. ${row.colonia}` : '',
         row.codigo_postal ? `C.P. ${row.codigo_postal}` : '',
         row.municipio_alcaldia || '',
         row.estado || ''
      ].filter(item => item && item.trim() !== '');

      const direccionCompleta = partesDireccion.length > 0 
         ? partesDireccion.join(', ') 
         : 'Sin dirección registrada';

      const badgePredeterminado = (parseInt(row.es_predeterminado) === 1) 
         ? `<span class="badge bg-success-subtle text-success border border-success-subtle ms-1" style="font-size: 0.65rem;">Predeterminado</span>` 
         : '';

      html += `
      <div class="col-12" id="cardDatosFacturacion${row.id_datos_facturacion}">
         <div class="card mb-2 shadow-sm border-0 border-start border-3 border-primary bg-light-subtle">
            <div class="card-body p-2 px-3">
               
               <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
                  <div class="text-truncate me-auto">
                     <strong class="text-dark text-truncate d-inline-block mw-100" style="font-size: 0.85rem;" title="${escapeHTML(row.razon_social || '')}">
                        ${escapeHTML(row.razon_social || '')}
                     </strong>
                     ${badgePredeterminado}
                  </div>
                  
                  <div class="d-flex align-items-center gap-1 flex-shrink-0">
                     <!-- Llamadas inline 100% numéricas -->
                     <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="carga_datos_editar_fact(${row.id_datos_facturacion});">
                        <i class="bi bi-pencil"></i>
                     </button>
                     <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarDatoFact" title="Eliminar" onclick="eliminar_datos_facturacion(${row.id_datos_facturacion});">
                        <i class="bi bi-trash"></i>
                     </button> 
                  </div>
               </div>

               <div class="d-flex flex-wrap gap-1 align-items-center mb-2">
                  <span class="badge bg-primary text-white font-monospace" style="font-size: 0.7rem;">
                     RFC: ${escapeHTML(row.rfc || '')}
                  </span>
                  ${row.regimen_fiscal ? `
                     <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle" style="font-size: 0.65rem;">
                        Régimen: ${escapeHTML(row.regimen_fiscal)}
                     </span>` : ''}
                  ${row.uso_cfdi ? `
                     <span class="badge bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle" style="font-size: 0.65rem;">
                        Uso: ${escapeHTML(row.uso_cfdi)}
                     </span>` : ''}
               </div>

               <div class="text-muted" style="font-size: 0.73rem; line-height: 1.25;">
                  <div class="text-truncate mb-1" title="${escapeHTML(direccionCompleta)}">
                     <i class="bi bi-geo-alt-fill me-1 text-primary"></i>${escapeHTML(direccionCompleta)}
                  </div>
                  ${row.email_facturacion ? `
                     <div class="text-truncate" title="${escapeHTML(row.email_facturacion)}">
                        <i class="bi bi-envelope-fill me-1 text-primary"></i>${escapeHTML(row.email_facturacion)}
                     </div>` : ''}
               </div>

            </div>
         </div>
      </div>`;
   });

   html += `</div>`;
   $(`#${containerId}`).html(html);
};

const carga_datos_editar_fact = (idDatoFacturacion = 0) => {
   
   let idNum = parseInt(idDatoFacturacion) || 0;
   let btn   = $('#btnSaveDatFact');
   
   if (idNum === 0) {
      $('#idDatoFacturacion').val(0);
      $('#rfcFact').val('');
      $('#razonSocialFact').val('');
      $('#regimenFiscalFact').val('000');
      $('#usoCfdiFact').val('000');
      $('#codigoPostalFact').val('');
      $('#calleFact').val('');
      $('#noExtFact').val('');
      $('#noIntFact').val('');
      $('#coloniaFact').val('');
      $('#municipioFact').val('');
      $('#estadoFact').val('');
      $('#correoFact').val('');
      $('#chkDatosFactPredeterminado').prop('checked', false);
      
      btn.text('Guardar');
   }
   else {
      let datoSeleccionado = arrDatosFacturacion.find(fact => fact.id_datos_facturacion == idNum);
      if (!datoSeleccionado) return;

      $('#idDatoFacturacion').val(datoSeleccionado.id_datos_facturacion);
      $('#rfcFact').val(datoSeleccionado.rfc || '');
      $('#razonSocialFact').val(datoSeleccionado.razon_social || '');
      
      $('#codigoPostalFact').val(datoSeleccionado.codigo_postal || '');
      $('#calleFact').val(datoSeleccionado.calle || '');
      $('#noExtFact').val(datoSeleccionado.numero_exterior || '');
      $('#noIntFact').val(datoSeleccionado.numero_interior || '');
      $('#coloniaFact').val(datoSeleccionado.colonia || '');
      $('#municipioFact').val(datoSeleccionado.municipio_alcaldia || '');
      $('#estadoFact').val(datoSeleccionado.estado || '');
      $('#correoFact').val(datoSeleccionado.email_facturacion || '');
      $('#chkDatosFactPredeterminado').prop('checked', parseInt(datoSeleccionado.es_predeterminado) === 1);

      // Re-filtrar los selects basándose en la longitud del RFC recuperado y asignar su valor
      filtra_regimen_fiscal('regimenFiscalFact', 'rfcFact');
      filtra_uso_cfdi('usoCfdiFact', 'rfcFact');
      $('#regimenFiscalFact').val(datoSeleccionado.clave_regimen_fiscal || '000');
      $('#usoCfdiFact').val(datoSeleccionado.clave_uso_cfdi || '000');
      btn.text('Guardar cambios');
   }
};

const guardar_datos_facturacion = async () => {
   let idDatoFacturacion   = parseInt($('#idDatoFacturacion').val()) || 0;
   let rfcFact             = $('#rfcFact').val().trim();
   let razonSocialFact     = $('#razonSocialFact').val().trim();
   let idRegimenFiscalFact = $('#regimenFiscalFact').val().trim();
   let regimenFiscalFact   = $('#regimenFiscalFact option:selected').text();
   let idUsoCfdiFact       = $('#usoCfdiFact').val().trim();
   let usoCfdiFact         = $('#usoCfdiFact option:selected').text();
   let codigoPostalFact    = $('#codigoPostalFact').val().trim();
   let calleFact           = $('#calleFact').val().trim();
   let noExtFact           = $('#noExtFact').val().trim();
   let noIntFact           = $('#noIntFact').val().trim();
   let coloniaFact         = $('#coloniaFact').val().trim();
   let municipioFact       = $('#municipioFact').val().trim();
   let estadoFact          = $('#estadoFact').val().trim();
   let correoFact          = $('#correoFact').val().trim();
   let esPredeterminado    = $('#chkDatosFactPredeterminado').is(':checked') ? 1 : 0;
   let msjAccion           = '';

   if (rfcFact === '') {
      ToastColor.fire({ text: '¡Atención! Debes ingresar el RFC', icon: 'warning' });
      $('#rfcFact').focus();
      return;
   }
   else if (razonSocialFact === '') {
      ToastColor.fire({ text: '¡Atención! Debes ingresar la razón social', icon: 'warning' });
      $('#razonSocialFact').focus();
      return;
   }
   else if (idRegimenFiscalFact === '000') {
      ToastColor.fire({ text: '¡Atención! Debes seleccionar el régimen fiscal', icon: 'warning' });
      $('#regimenFiscalFact').focus();
      return;
   }
   else if (idUsoCfdiFact === '000') {
      ToastColor.fire({ text: '¡Atención! Debes seleccionar el uso de CFDI', icon: 'warning' });
      $('#usoCfdiFact').focus();
      return;
   }
   else if (codigoPostalFact === '') {
      ToastColor.fire({ text: '¡Atención! Debes ingresar el código postal', icon: 'warning' });
      $('#codigoPostalFact').focus();
      return;
   }
   else if (correoFact === '' || !fnValidaMail(correoFact)) {
      ToastColor.fire({ text: '¡Atención! Debes ingresar una cuenta de correo válida', icon: 'warning' });
      $('#correoFact').focus();
      return;
   }
      
   const objDatosFacturacion = { 
      func: 'guarda_datos_facturacion', 
      tipoReceptor: receptorActual.tipo, 
      idReceptor: receptorActual.id, 
      idDatoFacturacion, 
      rfcFact, 
      razonSocialFact, 
      idRegimenFiscalFact, 
      regimenFiscalFact, 
      idUsoCfdiFact, 
      usoCfdiFact, 
      codigoPostalFact, 
      calleFact, 
      noExtFact, 
      noIntFact, 
      coloniaFact, 
      municipioFact, 
      estadoFact, 
      correoFact, 
      esPredeterminado, 
      csrf: CSRF_TOKEN 
   };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los datos de facturación serán almacenados', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnSaveDatFact').prop('disabled', false);
      return;
   }

   $('#btnSaveDatFact').prop('disabled', true);
   let respuesta = await guarda_datos_facturacion(objDatosFacturacion);
   
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      msjAccion = idDatoFacturacion > 0 ? 'Información actualizada' : 'Datos de facturación guardados correctamente';

      carga_datos_editar_fact(0);
      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      listar_datos_facturacion('container_listado_datos_facturacion', receptorActual.tipo, receptorActual.id);
      $('#btnSaveDatFact').prop('disabled', false);
   } 
   else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnSaveDatFact').prop('disabled', false);
      return;
   }
};

const eliminar_datos_facturacion = async (idDatoFacturacion) => {
   const idNum = parseInt(idDatoFacturacion) || 0;
   const datoSelected = arrDatosFacturacion.find(f => f.id_datos_facturacion == idNum);
   if (!datoSelected) return;

   const razonSocial = datoSelected.razon_social || '';

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los datos de facturación de ' + escapeHTML(razonSocial) + ' serán eliminados', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarDatoFact').prop('disabled', false);
      return;
   }

   $('.btnEliminarDatoFact').prop('disabled', true);
   let respuesta = await elimina_datos_facturacion({ idDatoFacturacion: idNum, razonSocial, csrf: CSRF_TOKEN });
   
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('¡Datos de facturación eliminados correctamente!', '', 'success', 2500);
      $('#cardDatosFacturacion' + idNum).remove();
      arrDatosFacturacion = arrDatosFacturacion.filter(fact => fact.id_datos_facturacion != idNum);
      $('.btnEliminarDatoFact').prop('disabled', false);
   } 
   else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarDatoFact').prop('disabled', false);
      return;
   }
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.ModalDatosFacturacion      = ModalDatosFacturacion;
window.listar_datos_facturacion   = listar_datos_facturacion;
window.guardar_datos_facturacion  = guardar_datos_facturacion; 
window.eliminar_datos_facturacion = eliminar_datos_facturacion;

window.filtra_regimen_fiscal      = filtra_regimen_fiscal;
window.filtra_uso_cfdi            = filtra_uso_cfdi;
window.carga_datos_editar_fact    = carga_datos_editar_fact;