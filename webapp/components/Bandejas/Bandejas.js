import { busqueda_ordenes_bandeja, obtiene_estudios_orden, obtiene_archivos_resultados_orden, sube_pdf_resultado, eliminar_pdf_resultado } from "./BandejasServices.js";

let arrPdfResultados = [];

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

                  <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-2" title="Subir / Gestionar PDF" onclick="ModalGestionPDF(${row.id}, '${row.folio}', '${row.estatus}', '${row.paciente_nombre_historico}');">
                     <i class="bi bi-file-earmark-pdf"></i>
                  </button>

                  <button type="button" class="btn btn-outline-primary btn-redondo btn-sm px-2" title="Previsualizar resultados" onclick="ModalPreviewResultados(${row.id}, '${row.folio}');">
                     <i class="bi bi-eye"></i>
                  </button>`;

                  if(row.estatus == 'LISTO' || row.estatus == 'COMPLETADO') {
                     html+=`
                     <button type="button" class="btn btn-outline-success btn-redondo btn-sm px-2" title="Marcar como entregado" onclick="MarcarComoEntregado(${row.id}, '${row.folio}');">
                        <i class="bi bi-check2-all"></i>
                     </button>`;
                  }

                  html+=`
                  <div class="dropdown d-inline-block">
                     <button class="btn btn-outline-secondary btn-redondo btn-sm px-2 dropdown-toggle no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Más opciones">
                        <i class="bi bi-three-dots-vertical"></i>
                     </button>
                     <ul class="dropdown-menu dropdown-menu-end shadow-sm small">
                        <li>
                           <a class="dropdown-item py-1.5" href="#" onclick="ModalDetalleOrden(${row.id}, '${row.folio}'); return false;">
                              <i class="bi bi-file-text me-2 text-secondary"></i> Ver detalle de orden
                            </a>
                        </li>
                        <li>
                           <a class="dropdown-item py-1.5" href="reportes/ticket?kq=${row.key_query}" target="_blank">
                              <i class="bi bi-ticket-detailed me-2 text-secondary"></i> Imprimir ticket
                            </a>
                        </li>
                        <li>
                           <a class="dropdown-item py-1.5" href="#" onclick="ModalEnviarResultados(${row.id}, '${row.folio}'); return false;">
                              <i class="bi bi-whatsapp me-2 text-success"></i> Enviar por WhatsApp / Correo
                            </a>
                        </li>`;

                     if(row.estatus != 'CANCELADO') {
                        html+=`
                           <li><hr class="dropdown-divider my-1"></li>
                           <li>
                              <a class="dropdown-item py-1.5 text-danger" href="#" onclick="ModalCancelarOrden(${row.id}, '${row.folio}', 2); return false;">
                                 <i class="bi bi-x-circle me-2"></i> Cancelar orden
                              </a>
                           </li>`;
                     }

                     html+=`
                     </ul>
                  </div>`;
                
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

const ModalGestionPDF = (idOrden, folio, estatus, paciente) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="ModalGestionPDF" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal border-0">            

            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5 d-flex align-items-center gap-2">
                  <i class="bi bi-file-earmark-pdf fs-4"></i>
                  <span>Gestión de Resultados PDF - Orden #${folio}</span>
               </h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>         

            <div class="modal-body py-3">
               
               <!-- Ficha Resumen del Paciente y Estudios Solicitados -->
               <div class="card border-0 bg-light rounded-3 p-3 mb-3 shadow-sm">
                  <div class="row g-2 align-items-center mb-2">
                     <div class="col-12 col-md-8">
                        <span class="text-muted extra-small text-uppercase fw-semibold d-block">Paciente</span>
                        <span class="fw-bold text-dark fs-6" id="pdf_modal_paciente_nombre">${paciente}</span>
                     </div>
                     <div class="col-12 col-md-4 text-md-end">
                        <span class="text-muted extra-small text-uppercase fw-semibold d-block mb-1">Estatus Orden</span>
                        <span id="pdf_modal_estatus_badge"><span class="badge bg-secondary">${estatus}</span></span>
                     </div>
                  </div>

                  <hr class="my-2 opacity-25">

                  <!-- Resumen de estudios que componen la orden -->
                  <div>
                     <span class="text-muted extra-small text-uppercase fw-semibold d-block mb-1">
                        <i class="bi bi-journal-check me-1"></i>Estudios Solicitados en esta Orden:
                     </span>
                     <div id="contenedor_estudios_solicitados" class="d-flex flex-wrap gap-1">
                        <span class="spinner-border spinner-border-sm text-secondary" role="status"></span>
                     </div>
                  </div>
               </div>

               <!-- Formulario de Carga: Descripción + Selección de PDF -->
               <div class="card border-0 bg-white rounded-3 p-3 mb-3 shadow-sm border-start border-4 border-primary">
                  <h6 class="fw-bold text-dark mb-2 small text-uppercase d-flex align-items-center gap-1">
                     <i class="bi bi-cloud-upload text-primary"></i> Adjuntar Nuevo Documento PDF
                  </h6>                  
                  
                  <div class="row g-2 align-items-end">
                     <div class="col-12 col-md-5">
                        <label class="form-label small fw-semibold text-muted mb-1">Descripción del Archivo</label>
                        <input type="text" class="form-control form-control-sm" id="pdf_descripcion" name="pdf_descripcion" placeholder="Ej. Biometría Hematológica / General" autocomplete="off" maxlength="150">
                     </div>

                     <div class="col-12 col-md-5">
                        <label class="form-label small fw-semibold text-muted mb-1">Seleccionar Archivo PDF</label>
                        <input type="file" class="form-control form-control-sm" id="pdf_archivo" name="pdf_archivo" accept=".pdf">
                     </div>

                     <div class="col-12 col-md-2 text-end">
                        <button type="button" class="btn btn-success btn-sm btn-redondo w-100" id="btnSubirPDF" 
                        onclick="subir_pdf_resultado(${idOrden}, '${folio}', '${paciente}', '${estatus}');">
                           <i class="bi bi-plus-lg me-1"></i> Subir PDF
                        </button>
                     </div>
                  </div>
                  
               </div>

               <!-- Tabla de Archivos PDF Adjuntados -->
               <div class="table-responsive rounded-3 border shadow-sm">
                  <table class="table table-hover align-middle mb-0" id="tablaArchivosPDF">
                     <thead class="table-dark text-uppercase small">
                        <tr>
                           <th width="35%" class="py-2">Descripción del Documento</th>
                           <th width="30%" class="py-2">Nombre de Archivo</th>
                           <th width="15%" class="text-center py-2">Fecha / Hora</th>
                           <th width="20%" class="text-center py-2">Acciones</th>
                        </tr>
                     </thead>
                     <tbody id="tbodyArchivosPDF">
                        <!-- Carga dinámica mediante JS -->
                        <tr>
                           <td colspan="4" class="text-center py-4 text-muted">
                              <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                              Cargando archivos de la orden...
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>

            </div>

            <div class="modal-footer border-0 pt-0">
               <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-4" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#ModalGestionPDF').modal('show');
   
   // Cargar resumen de orden y la lista de archivos adjuntos
   obtenerEstudiosOrdenPDF(idOrden);
   obtenerArchivosOrdenPDF(idOrden, folio, estatus);
};

const obtenerEstudiosOrdenPDF = async (idOrden) => {
   // Loader en el contenedor de estudios
   $('#contenedor_estudios_solicitados').html(`
      <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
      <span class="small text-muted">Cargando estudios...</span>
   `);

   let respuesta = await obtiene_estudios_orden(idOrden);

   if (respuesta.estatus == 403) {
      fnNoSesion();
      return;
   }

   if(respuesta.estatus != 200 || respuesta.data.length == 0) {
      showMessageSwalTimer('Atención', 'No se pudieron recuperar los datos de la orden.', 'warning', 2500);
      $('#ModalGestionPDF').modal('hide');
      $('#contenedor_estudios_solicitados').html('<span class="text-danger extra-small">Error al cargar estudios.</span>');
      return;
   }

   // Se envían los datos obtenidos a la función renderizadora
   pinta_estudios_orden_pdf(respuesta.data, idOrden);

};

const pinta_estudios_orden_pdf = (data, idOrden) => {
   
   let html = '';
   if (data && data.length > 0) {

      data.forEach((est) => {
         html += `
         <span class="badge bg-white text-dark border border-secondary-subtle font-monospace fw-normal py-1 px-2 shadow-sm fs-8">
            <i class="bi bi-check2 text-primary me-1"></i>${est.nombre_estudio_historico}
         </span>`;
      });
   } 
   else {
      html = '<span class="text-muted extra-small">No se registraron estudios en esta orden.</span>';
   }
   $('#contenedor_estudios_solicitados').html(html);

};

const obtenerArchivosOrdenPDF = async (idOrden, folio, estatus) => {
   
   // Loader en la tabla de archivos
   $('#tbodyArchivosPDF').html(`
      <tr>
         <td colspan="4" class="text-center py-4 text-muted">
            <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
            Cargando archivos de la orden...
         </td>
      </tr>
   `);
   
   let respuesta = await obtiene_archivos_resultados_orden(idOrden);
   arrPdfResultados = respuesta.data;

   if (respuesta.estatus == 403) {
      fnNoSesion();
      return;
   }   
   else if(respuesta.data.length == 0) {
      $('#tbodyArchivosPDF').html(`
         <tr>
            <td colspan="4" class="text-center py-4 text-muted">
               <i class="bi bi-folder2-open fs-3 d-block mb-1 opacity-50"></i>
               <span class="small">No se encontraron archivos disponibles para esta orden.</span>
            </td>
         </tr>
      `);
      return;
   }
   // Se envían los datos obtenidos a la función renderizadora
   pinta_archivos_orden_pdf(arrPdfResultados, idOrden, folio, estatus);   
};

const pinta_archivos_orden_pdf = (data, idOrden, folio, estatus) => {
   
   // 3. Renderizar Tabla de Archivos PDF Subidos
   let html = '';
   if (data && data.length > 0) {
      data.forEach((file) => {
         html += `
         <tr id="filaArchivoPDF_${file.id}">
            <td>
               <div class="fw-bold text-dark mb-0">${file.descripcion}</div>
               <span class="extra-small text-muted">
                  <i class="bi bi-person me-1"></i>${file.user_cap || 'Sistema'}
               </span>
            </td>

            <td>
               <div class="text-truncate extra-small font-monospace text-secondary" style="max-width: 240px;" title="${file.nombre_original}">
                  <i class="bi bi-file-earmark-pdf-fill text-danger me-1 fs-6"></i>${file.nombre_original}
               </div>
            </td>

            <td class="text-center extra-small text-muted">
               <div><i class="bi bi-calendar3 me-1 opacity-50"></i>${file.fecha}</div>
               <div><i class="bi bi-clock me-1 opacity-50"></i>${file.hora}</div>
            </td>

            <td class="text-center">
               <div class="d-flex justify-content-center gap-1">
                  
                  <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-2" title="Previsualizar resultado" onclick="VerPDFPrevisualizar('${file.nombre_servidor}')">
                     <i class="bi bi-eye"></i>
                  </button>`;

                  if(estatus != 'ENTREGADO' && estatus != 'CANCELADO') {
                     html+=`
                     <button type="button" class="btn btn-outline-danger btn-redondo btn-sm px-2 btnEliminarPdfRes" title="Eliminar archivo" onclick="eliminar_resultado(${file.id}, ${idOrden}, '${folio}', '${file.nombre_servidor}', '${file.nombre_original}', '${estatus}')">
                        <i class="bi bi-trash"></i>
                     </button>`;
                  }

                  html+=`
               </div>
            </td>
         </tr>`;
      });
   } 
   else {
      html = `
      <tr>
         <td colspan="4" class="text-center py-4 text-muted">
            <i class="bi bi-folder2-open fs-3 d-block mb-1 opacity-50"></i>
            <span class="small">Aún no se han adjuntado archivos PDF para esta orden.</span>
         </td>
      </tr>`;
   }

   $('#tbodyArchivosPDF').html(html);
};

const subir_pdf_resultado = async (idOrden, folio, paciente, estatus) => {

   let file0         = document.getElementById('pdf_archivo');
   let file          = file0.files[0];
   let descripcion   = $('#pdf_descripcion').val().trim();
   
   if(idOrden == '' || idOrden < 0) {
      ToastColor.fire({
         text: '¡Atención! No se obtuvo un parámetro importante para continuar, actualiza y vuelve a intentarlo',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }
   else if(descripcion == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre descriptivo del archivo',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#pdf_descripcion').focus();
      return;
   }
   else if (typeof (file) == "undefined") {
      ToastColor.fire({text: '¡Atención! Debes seleccionar un archivo.', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
      $('#pdf_archivo').focus();
      return;
   }
   else if (!(/\.(pdf)$/i).test(file.name)) {
      ToastColor.fire({ text: '¡Atención! El archivo debe ser un archivo PDF', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
      $('#pdf_archivo').focus();
      return;
   }

   /*
   let fileReducido  = await reducirImagen(file).then(fr=>{ return fr; });

   if (fileReducido.size > 1000000) {
      ToastColor.fire({text: '¡Atención! Debes agregar un archivo más ligero, tamaño máximo 1 MB.', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
      $('#pdf_archivo').focus();
      return;
   }
   */

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El archivo será almacenado', 'question', 'Sí, Subir', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarEstudio').prop('disabled', false);
      return;
   }

   $('#btnSubirPDF').prop('disabled', true);

   var objSubidaResultado = new FormData();
   objSubidaResultado.append('func', 'subir_pdf_resultado');
   objSubidaResultado.append('idOrden', idOrden);
   objSubidaResultado.append('folio', folio);
   objSubidaResultado.append('paciente', paciente); 
   objSubidaResultado.append('descripcion', descripcion);
   objSubidaResultado.append('archivo', file);

   let respuesta = await sube_pdf_resultado(objSubidaResultado);  
   
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) { 

      let objResultado = {
         id: respuesta.data.id,
         descripcion: descripcion,
         nombre_original: respuesta.data.nombre_original,
         nombre_servidor: respuesta.data.nombre_servidor,
         user_cap: respuesta.data.user_cap,
         fecha: respuesta.data.fecha,
         hora: respuesta.data.hora
      };

      arrPdfResultados.push(objResultado);

      pinta_archivos_orden_pdf(arrPdfResultados, idOrden, folio, estatus);

      showMessageSwalTimer('¡Archivo almacenado!', '', 'success', 2500);
      $('#btnSubirPDF').prop('disabled', false);
      $('#pdf_archivo').val('');
      $('#pdf_descripcion').val('');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnSubirPDF').prop('disabled', false);
      return;
   }
}

const eliminar_resultado = async (idArchivo, idOrden, folio, nomServidor, nomOriginal, estatus) => {

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El archivo: ' + nomOriginal + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarPdfRes').prop('disabled', false);
      return;
   }

   $('.btnEliminarPdfRes').prop('disabled', true);

   let respuesta = await eliminar_pdf_resultado(idArchivo, idOrden, folio, nomServidor, nomOriginal);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Resultado PDF eliminado!', '', 'success', 2500);
      
      arrPdfResultados = arrPdfResultados.filter(pdf => pdf.id != idArchivo);
      pinta_archivos_orden_pdf(arrPdfResultados, idOrden, estatus)
      $('.btnEliminarPdfRes').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarPdfRes').prop('disabled', false);
      return;
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabBandejas             = TabBandejas;
window.ModalGestionPDF         = ModalGestionPDF;

window.subir_pdf_resultado     = subir_pdf_resultado;
window.eliminar_resultado      = eliminar_resultado;
window.cambiar_estatus_barra   = cambiar_estatus_barra;
window.obtiene_ordenes_estatus = obtiene_ordenes_estatus;