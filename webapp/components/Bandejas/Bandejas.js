import { busqueda_ordenes_bandeja } from "./BandejasServices.js";

const TabBandejas = () => {
   let fechaHoy = new Date().toISOString().split('T')[0];

   let html = `
   <div class="row">
      <div class="col-12 mt-2">
         <div class="fs-4 fw-bold">
            <i class="bi bi-card-checklist"></i> Bandejas Operativas
         </div>
      </div>
   </div>

   <!-- Filtros Operativos Superiores -->
   <div class="row mt-3">
      <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
         <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
               <i class="bi bi-upc-scan text-muted"></i>
            </span>
            <input type="text" name="inpBusquedaOrdenBandeja" id="inpBusquedaOrdenBandeja" class="form-control border-start-0" placeholder="Buscar Folio o Paciente...">
            <button class="btn btn-outline-dark btn-lib" type="button" id="btnBuscarFolioOpe" onclick="obtiene_ordenes_estatus(2,'');">
               <i class="bi bi-search"></i>
            </button>
         </div>
      </div>

      <div class="col-xl-4 offset-xl-5 col-lg-4 offset-xl-4 col-md-4 col-sm-6 col-12 mb-2">
         <div class="input-group">
            <span class="input-group-text bg-white">
               <i class="bi bi-calendar-range text-muted"></i>
            </span>
            <input type="date" name="filtroFechaInicio" id="filtroFechaInicio" class="form-control" value="${fechaHoy}">
            <input type="date" name="filtroFechaFin" id="filtroFechaFin" class="form-control" value="${fechaHoy}">
         </div>
      </div>
   </div>

   <!-- Pestañas de Estatus Operativo -->
   <div class="row g-2 mb-4 mt-2" id="contenedorBarraEstatus">
      <div class="col-xl col-md-4 col-6">
         <button type="button" class="btn-tab-pedidos btn-bandejas w-100 py-2 shadow-sm btn-status" id="btn-status-RECEPCION" onclick="cambiar_estatus_barra('RECEPCION')">
            <i class="bi bi-clock-history me-sm-1"></i> Pendientes
         </button>
      </div>
      
      <div class="col-xl col-md-4 col-6">
         <button type="button" class="btn-tab-pedidos w-100 py-2 shadow-sm btn-status" id="btn-status-PARCIAL" onclick="cambiar_estatus_barra('PARCIAL')">
            <i class="bi bi-file-earmark-pdf me-sm-1"></i> Resultados Parciales
         </button>
      </div>
      
      <div class="col-xl col-md-4 col-12">
         <button type="button" class="btn-tab-pedidos w-100 py-2 shadow-sm btn-status" id="btn-status-LISTO" onclick="cambiar_estatus_barra('LISTO')">
            <i class="bi bi-clipboard2-check me-sm-1"></i> Ordenes completadas
         </button>
      </div>

      <div class="col-xl col-md-4 col-6">
         <button type="button" class="btn-tab-pedidos w-100 py-2 shadow-sm btn-status" id="btn-status-ENTREGADO" onclick="cambiar_estatus_barra('ENTREGADO')">
            <i class="bi bi-check-circle me-sm-1"></i> Ordenes entregadas
         </button>
      </div>`;
            
      html+=`
      <div class="col-xl col-md-6 col-6">
         <button type="button" class="btn-tab-pedidos w-100 py-2 shadow-sm btn-status" id="btn-status-CANCELADO" onclick="cambiar_estatus_barra('CANCELADO')">
            <i class="bi bi-ban me-sm-1"></i> Cancelados
         </button>
      </div>
   </div>

   <!-- Contenedor Principal para la Tabla de Órdenes -->
   <div class="row mt-3">
      <div class="col-12">
         <div id="listado_ordenes_bandeja"></div>
      </div>
   </div>`;

   $('#containerMain').html(html);
}

const cambiar_estatus_barra = (estatus) => {
   $('.btn-status').removeClass('btn-bandejas').addClass('btn-secondary');
   $(`#btn-status-${estatus}`).addClass('btn-bandejas');
   obtiene_ordenes_estatus(1, estatus);
}

const obtiene_ordenes_estatus = async (origen, estatus) => {

   let parametro = $('#inpBusquedaOrdenBandeja').val().trim();
   let fechaIni  = $('#filtroFechaInicio').val().trim();
   let fechaFin  = $('#filtroFechaFin').val().trim();
     
   if(origen == 1) {
      const inicio     = new Date(fechaIni + 'T00:00:00');
      const fin        = new Date(fechaFin + 'T00:00:00');
      const diferencia = (fin - inicio) / (1000 * 60 * 60 * 24);

      if(fechaIni == '' || fechaFin == '') {
         ToastColor.fire({
            text: '¡Atención! Debes seleccionar un rango de fechas',
            icon: 'warning'
         });
         $('#filtroFechaInicio').focus();
         return;
      }
      else if (diferencia > 30) {
         ToastColor.fire({
            text: '¡Atención! El rango de búsqueda no puede superar los 30 días',
            icon: 'warning'
         });
         $('#filtroFechaInicio').focus();
         return;
      }
   }
   else if(origen == 2 && parametro == '') { // Búsqueda por folio o paciente      
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el parámetro de búsqueda',
         icon: 'warning'
      });
      $('#inpBusquedaOrdenBandeja').focus();
      return;
   }


   activarLoad('Cargando ordenes de trabajo...');
   let respuesta = await busqueda_ordenes_bandeja(origen, estatus, fechaIni, fechaFin, parametro);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#listado_ordenes_bandeja').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron ordenes de trabajo</div>');
      closeLoad();
      return;
   }
   else {
      if(respuesta.data.length > 0) {
         pinta_ordenes_bandejas(respuesta.data);
      }
      else {
         $('#listado_ordenes_bandeja').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron ordenes de trabajo</div>');
         closeLoad();
      }
   }
}

const pinta_ordenes_bandejas = (data) => {

   let html = 
   `<div class="table-responsive rounded-3 border shadow-sm">
      <table class="table table-hover align-middle mb-0 dataTable table-striped" id="tableOrdenesBandeja">
         <thead class="table-dark text-uppercase small">
            <tr class="border-start border-1 border-dark">
               <th width="15%" class="text-center py-2">Orden</th>
               <th width="35%" class="py-2">Paciente / Convenio</th>
               <th width="15%" class="text-center py-2">Registro</th>
               <th width="20%" class="text-center py-2">Estado Pago</th>
               <th width="15%" class="text-center py-2">Acciones</th>
            </tr>
         </thead>
         <tbody>`;
         
         data.forEach(row => {
            let isUrgente = (row.es_urgente == 1 || row.es_urgente == '1');

            html +=
            `<tr id="trBusqueda${row.folio}" class="${isUrgente && row.estatus != 'CANCELADO' ? 'border-start border-1 border-danger' : 'border-start border-1 border-secondary-subtle'}">
               
               <td class="text-center">
                  <div class="align-items-center justify-content-center gap-1 mb-1">
                     <span class="font-monospace fw-bold text-primary-emphasis">
                        #${row.folio}
                     </span>
                     ${isUrgente && row.estatus != 'CANCELADO' ? `
                        <br><span class="fs-8 text-danger" title="Orden Urgente">
                           <i class="bi bi-lightning-charge-fill text-danger"></i> URGENTE
                        </span>
                     ` : ''}
                  </div>
                  ${getBadgeEstatus(row.estatus)}
               </td>

               <td>
                  <div class="fw-bold text-dark text-truncate" style="max-width: 280px;" title="${row.paciente_nombre_historico || ''}">
                     ${row.paciente_nombre_historico || 'Sin nombre'}
                  </div>
                  <div class="extra-small text-muted lh-sm mt-1">
                     <span class="fw-semibold text-secondary text-uppercase">${row.tipo_cliente ?? 'PARTICULAR'}</span>
                     ${row.convenio_nombre_historico ? ` <span class="opacity-50">|</span> ${row.convenio_nombre_historico}` : ''}
                  </div>
               </td>

               <td class="text-center small text-muted">
                  <span class="d-block"><i class="bi bi-calendar3 me-1 opacity-50"></i>${row.fecha_registro ?? ''}</span>
                  ${row.hora_registro ? `<span class="extra-small text-secondary"><i class="bi bi-clock me-1 opacity-50"></i>${row.hora_registro}</span>` : ''}
               </td>

               <td class="text-center">
                  ${getCeldaPago(row.estatus_pago, row.total_neto, row.total_abonado, row.saldo_deudor)}
               </td>

               <td class="text-center">

                  <a href="reportes/ticket?kq=${row.key_query}" target="_blank" class="btn btn-outline-dark btn-redondo btn-sm px-2" title="Imprimir ticket">
                     <i class="bi bi-ticket-detailed"></i>
                  </a>`;

                  html+=`
                  <button type="button" class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Imprimir etiquetas" onclick="ModalImpresionEtiquetas('${row.key_query}');">
                     <i class="bi bi-upc"></i>
                  </button>`;                  

                  if(row.estatus != 'CANCELADO') {
                     html+=`
                     <button type="button" class="btn btn-outline-success btn-redondo btn-sm px-2" title="Ver abonos / pagos" onclick="ModalGestionPagos(${row.id}, '${row.folio}');">
                        <i class="bi bi-currency-dollar"></i>
                     </button>`;
                  }

                  if(row.estatus == 'LISTO' && row.estatus_pago == 'PAGADO') {
                     html+=`
                     <a href="reportes/ticket?kq=${row.key_query}" target="_blank" class="btn btn-outline-dark btn-redondo btn-sm px-2" title="Ver resultado">
                        <i class="bi bi-file-earmark-medical"></i>
                     </a>`;
                  }
                  if(row.estatus != 'ENTREGADO' && row.estatus != 'CANCELADO') {
                     html+=`
                     <button type="button" class="btn btn-outline-danger btn-redondo btn-sm px-2" title="Cancelar orden" onclick="ModalCancelarOrden(${row.id}, '${row.folio}', 2);">
                        <i class="bi bi-x-circle"></i>
                     </button>`;
                  }
                  
                  html+=`
               </td>
            </tr>`;
         });
         
         html +=
         `</tbody>
      </table>
   </div>`;
   
   $('#listado_ordenes_bandeja').html(html);

   setTimeout(() => {
      new DataTable('#tableOrdenesBandeja', {   
         language: {
            url: "assets/lib/DataTables/es-ES.json",
         },
         responsive: true,
         order: [[0, 'desc']]
      });
   }, 200);
   closeLoad();
}

const ModalFormResultado = (idConvenio) => {

   let convenioSeleccionado = arrConvenios.filter(convenio => convenio.id_convenio == idConvenio);

   let titulo;
   let nombre_comercial    = '';
   let persona_contacto    = '';
   let telefono_contacto   = '';
   let correo_contacto     = '';
   let direccion           = '';
   let lista_precio_id     = 0;
   let password_plataforma = '';
   let tipo                = 'NA';

   if(idConvenio > 0) {
      titulo              = 'Editar Convenio: '+ convenioSeleccionado[0].nombre_comercial ?? '';
      nombre_comercial    = convenioSeleccionado[0].nombre_comercial ?? '';
      persona_contacto    = convenioSeleccionado[0].persona_contacto ?? '';
      telefono_contacto   = convenioSeleccionado[0].telefono_contacto ?? '';
      correo_contacto     = convenioSeleccionado[0].correo_contacto ?? '';
      direccion           = convenioSeleccionado[0].direccion ?? '';
      lista_precio_id     = convenioSeleccionado[0].lista_precio_id;
      tipo                = convenioSeleccionado[0].tipo;
      password_plataforma = convenioSeleccionado[0].password_plataforma ?? '';
   }
   else {
      titulo = 'Registrar Nuevo Convenio';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormConvenio" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${titulo}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            
            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-12 mt-3">
                     <b>Nombre *</b>
                     <input type="text" name="nomConvenio" id="nomConvenio" class="form-control" maxlength="200" value="${nombre_comercial}">
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>Tipo *</b>
                     <select name="tipoConvenio" id="tipoConvenio" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="LABORATORIO">LABORATORIO</option>
                        <option value="EMPRESA">EMPRESA</option>
                        <option value="DOCTOR">DOCTOR</option>
                     </select>
                  </div>
                  <div class="col-md-9 col-sm-5 col-12 mt-3">
                     <b>Persona de Contacto *</b>
                     <input type="text" name="personaContactoConvenio" id="personaContactoConvenio" class="form-control" maxlength="200" value="${persona_contacto}">
                  </div>
                  <div class="col-md-3 col-sm-3 col-12 mt-3">
                     <b>Teléfono *</b>
                     <input type="tel" inputmode="tel" name="telConvenio" id="telConvenio" class="form-control" maxlength="10" onkeypress="return fnValidaNumeros(event);" value="${telefono_contacto}">
                  </div>
                  <div class="col-md-5 col-sm-5 col-12 mt-3">
                     <b>Correo</b>
                     <input type="mail" inputmode="mail" name="correoConvenio" id="correoConvenio" class="form-control" maxlength="100" value="${correo_contacto}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Tipo de precio *</b>
                     <select name="precioConvenio" id="precioConvenio" class="form-select">
                        <option value="0">Seleccionar</option>
                     </select>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Dirección *</b>
                     <textarea name="direccionConvenio" id="direccionConvenio" class="form-control" rows="3" maxlength="300">${direccion}</textarea>
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Password Plataforma *</b>
                     <div class="input-group mb-3">
                        <input type="password" class="form-control form-control-lg rounded-1" name="passwordPlataformaConvenio" id="passwordPlataformaConvenio" placeholder="***" value="${password_plataforma}" maxlength="50">
                        <span class="input-group-text pointer" id="eyePasswordConvenio" onclick="ver_password('passwordPlataformaConvenio','eyePasswordConvenio');"><i class="bi bi-eye-slash"></i></span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" id="btnGuardarConvenio" onclick="fn_guardar_convenio(${idConvenio});">
                  Guardar
               </button>
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminExt').html(html);
   $('#modalFormConvenio').modal('show');

   combo_listas_precios('precioConvenio');

   if(idConvenio > 0) {
      setTimeout(() => {
         $('#tipoConvenio').val(tipo);
         $('#precioConvenio').val(lista_precio_id);
      }, 300);
   }
}

const registrar_resultado = async (idConvenio, origen) => {

   let nomConvenio        = $('#nomConvenio').val().trim();
   let tipo               = $('#tipoConvenio').val();
   let personaContacto    = $('#personaContactoConvenio').val().trim();
   let telefono           = $('#telConvenio').val().trim();
   let correo             = $('#correoConvenio').val().trim();
   let precio             = $('#precioConvenio').val();
   let direccion          = $('#direccionConvenio').val().trim();
   let passwordPlataforma = $('#passwordPlataformaConvenio').val().trim();
   let msjAccion;

   if (nomConvenio == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del cliente del convenio',
         icon: 'warning'
      });
      $('#nomConvenio').focus();
      return;
   }
   else if (tipo == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de cliente del convenio',
         icon: 'warning'
      });
      $('#tipoConvenio').focus();
      return;
   }
   else if (personaContacto == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre de la persona de contacto',
         icon: 'warning'
      });
      $('#personaContactoConvenio').focus();
      return;
   }
   else if (telefono == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el teléfono de contacto del cliente del convenio',
         icon: 'warning'
      });
      $('#telConvenio').focus();
      return;
   }
   else if(correo != '') {
      if(!fnValidaMail(correo)) {
         ToastColor.fire({
            text: '¡Atención! Debes ingresar una cuenta de correo válida',
            icon: 'warning'
         });
         $('#correoConvenio').focus();
      return;
      }
   }
   else if (parseInt(precio) == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de precio para el cliente',
         icon: 'warning'
      });
      $('#precioConvenio').focus();
      return;
   }
   else if (direccion == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la dirección del cliente',
         icon: 'warning'
      });
      $('#direccionConvenio').focus();
      return;
   }
   else if (passwordPlataforma == '' && parseInt(idConvenio) == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la contraseña para el acceso a la plataforma',
         icon: 'warning'
      });
      $('#passwordPlataformaConvenio').focus();
      return;
   }
   
   let objConvenio = { 'func': 'guardar', idConvenio, nomConvenio, tipo, personaContacto, telefono, correo, precio, direccion, passwordPlataforma };
      
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El convenio: ' + nomConvenio + ' será registrado', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarConvenio').prop('disabled', false);
      return;
   }

   $('#btnGuardarConvenio').prop('disabled',true);
   let respuesta = await guardar_convenio(objConvenio);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      idConvenio > 0 ? msjAccion = 'Información actualizada correctamente' : msjAccion = 'Convenio guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormConvenio').modal('hide');
      $('#btnGuardarConvenio').prop('disabled',false);
      fn_obtiene_convenios('listado_convenios');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarConvenio').prop('disabled',false);
      return;
   }
}

const eliminar_resultado = async (idConvenio, nomConvenio) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El Convenio: ' + nomConvenio + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarConvenio').prop('disabled', false);
      return;
   }

   $('.btnEliminarConvenio').prop('disabled', true);

   let respuesta = await eliminar_convenio(idConvenio, nomConvenio);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Convenio eliminado correctamente', '', 'success', 2500);
      $('#cardConvenio'+idConvenio).remove();
      arrConvenios = arrConvenios.filter(convenio => convenio.id_convenio != idConvenio);
      $('.btnEliminarConvenio').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarConvenio').prop('disabled', false);
      return;
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabBandejas             = TabBandejas;
window.ModalFormResultado      = ModalFormResultado;

window.registrar_resultado     = registrar_resultado;
window.eliminar_resultado      = eliminar_resultado;
window.cambiar_estatus_barra   = cambiar_estatus_barra;
window.obtiene_ordenes_estatus = obtiene_ordenes_estatus;