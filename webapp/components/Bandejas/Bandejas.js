import { busqueda_ordenes_bandeja, obtiene_estudios_orden, obtiene_archivos_resultados_orden, sube_pdf_resultado, eliminar_pdf_resultado, marcar_orden_como_parcial, marcar_orden_como_completada, procesar_publicacion_notificacion, notificar_mail_resultados } from "./BandejasServices.js";

let arrPdfResultados  = [];
let arrOrdenesBandeja = [];

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
         <button type="button" class="btn-tab-pedidos w-100 py-2 shadow-sm btn-status" id="btn-status-PROCESO" onclick="cambiar_estatus_barra('PROCESO')">
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
            <i class="bi bi-check-circle me-sm-1"></i> Publicadas / Entregadas
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
   arrOrdenesBandeja = respuesta.data;
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
      if(arrOrdenesBandeja.length > 0) {
         pinta_ordenes_bandejas(arrOrdenesBandeja);
      }
      else {
         $('#listado_ordenes_bandeja').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron ordenes de trabajo</div>');
         closeLoad();
      }
   }
}

const pinta_ordenes_bandejas = (data) => {

   let html = 
   `<div class="table-responsive rounded-3 border shadow-sm mh-500">
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
         
         let labelPublicada = '';
         data.forEach(row => {
            let isUrgente = (row.es_urgente == 1 || row.es_urgente == '1');

            row.publicada == "1" ? labelPublicada = '<span class="badge bg-success bg-opacity-75 rounded-pill px-2 py-1 fw-normal small">Publicada</span>' : labelPublicada  = '';

            html +=
            `<tr id="trBusqueda${row.id}" class="${isUrgente && row.estatus != 'CANCELADO' ? 'border-start border-1 border-danger' : 'border-start border-1 border-secondary-subtle'}">
               
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
                  <span id="labelPublicado${row.id}">${labelPublicada}</span>
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

                  <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-2 btnAcciones" title="Subir / Gestionar PDF" onclick="ModalGestionPDF(${row.id}, '${row.folio}', '${row.estatus}', '${row.paciente_nombre_historico}');">
                     <i class="bi bi-file-arrow-up"></i>
                  </button>

                  <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-2 btnAcciones" title="Previsualizar resultados" onclick="ModalViewerResultadosFolio('${row.id}', '${row.folio}');">
                     <i class="bi bi-eye"></i>
                  </button>`;

                  if(row.estatus == 'RECEPCION') {
                     html+=`
                     <button type="button" class="btn btn-outline-primary btn-redondo btn-sm px-2 btnAcciones" title="Marcar como resultados parciales" onclick="marcar_como_parcial(${row.id}, '${row.folio}');">
                        <i class="bi bi-file-earmark-break"></i>
                     </button>`;
                  }

                  if(row.estatus == 'RECEPCION' || row.estatus == 'PROCESO') {
                     html+=`
                     <button type="button" class="btn btn-outline-success btn-redondo btn-sm px-2 btnAcciones" title="Marcar como orden completada" onclick="marcar_como_completada(${row.id}, '${row.folio}');">
                        <i class="bi bi-check2-all"></i>
                     </button>`;
                  }

                  if(row.estatus == 'PROCESO' || row.estatus == 'LISTO' || row.estatus == 'ENTREGADO') {
                     html+=`
                     <button type="button" class="btn btn-outline-primary btn-redondo btn-sm px-2 btnAcciones" id="btnPublicado${row.id}" title="Publicar resultados en plataforma" onclick="ModalPublicarNotificar(${row.id}, '${row.folio}', '${row.paciente_nombre_historico}', '${row.correo}', '${row.telefono}', ${row.publicada}, '${row.fecha_publicada}', '${row.key_query}');">
                        <i class="bi bi-share"></i>
                     </button>`;
                  }

                  html+=`
                  <button type="button" class="btn btn-outline-secondary btn-redondo btn-sm px-2 btnAcciones" id="btnPublicado${row.id}" title="Ver detalle de orden" onclick="ModalViewDetallesOrden(${row.id}, '${row.folio}');">
                     <i class="bi bi-file-text"></i> 
                  </button>`;

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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ GESTIÓN DE SUBIDA DE RESULTADOS PDF +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
                        <label class="form-label small fw-semibold text-muted mb-1" for="pdf_descripcion">Descripción del Archivo</label>
                        <input type="text" class="form-control form-control-sm" id="pdf_descripcion" name="pdf_descripcion" placeholder="Ej. Biometría Hematológica / General" autocomplete="off" maxlength="150">
                        <div class="form-text text-muted small mt-1 fs-8">
                           <i class="bi bi-info-circle me-1"></i> Breve nombre de lo que reportas.
                        </div>
                     </div>

                     <div class="col-12 col-md-5">
                        <label class="form-label small fw-semibold text-muted mb-1" for="pdf_archivo">Seleccionar Archivo PDF</label>
                        <input type="file" class="form-control form-control-sm" id="pdf_archivo" name="pdf_archivo" accept=".pdf,application/pdf">
                        <div class="form-text text-muted small mt-1 fs-8">
                           <i class="bi bi-info-circle me-1"></i> Solo formato PDF. Tamaño máximo autorizado: <b>5 MB</b>.
                        </div>
                     </div>

                     <div class="col-12 col-md-2 text-end">
                        <button type="button" class="btn btn-success btn-sm btn-redondo w-100" id="btnSubirPDF" 
                              onclick="subir_pdf_resultado(${idOrden}, '${folio}', '${paciente}', '${estatus}');">
                           <i class="bi bi-plus-lg me-1"></i> Subir PDF
                        </button><br><br>
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
                  
                  <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-2" title="Previsualizar resultado" onclick="ModalViewerResultado('${file.key_query_pdf}', '${folio}', 1);">
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
   let maxBytes      = 5 * 1024 * 1024;
   
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
   if (!(/\.(pdf)$/i).test(file.name) || file.type !== 'application/pdf') {
      ToastColor.fire({ text: '¡Atención! El archivo debe ser un archivo PDF', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
      $('#pdf_archivo').focus();
      return;
   }
   else if (file.size > maxBytes)  {
      ToastColor.fire({ text: '¡Atención! El archivo excede el tamaño máximo permitido de 5 MB.', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
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
         orden_folio: respuesta.data.orden_folio,
         descripcion: descripcion,
         nombre_original: respuesta.data.nombre_original,
         nombre_servidor: respuesta.data.nombre_servidor,
         user_cap: respuesta.data.user_cap,
         fecha: respuesta.data.fecha,
         hora: respuesta.data.hora,
         key_query_pdf: respuesta.data.key_query_pdf
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


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CAMBIOS DE ESTATUS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const marcar_como_parcial = async (idOrden, folio) => {

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La orden: ' + folio + ' será marcada con resultados parciales', 'question', 'Sí, marcar', 'Cancelar');
   
   if (!res.result) {
      $('.btnAcciones').prop('disabled', false);
      return;
   }

   $('.btnAcciones').prop('disabled', true);

   let respuesta = await marcar_orden_como_parcial(idOrden, folio);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Orden marcada como parcial!', '', 'success', 2000);
      let tabla = $('#tableOrdenesBandeja').DataTable();
      tabla.row($('#trBusqueda' + idOrden)).remove().draw();
      
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 3000);
      $('.btnAcciones').prop('disabled', false);
      return;
   }
}

const marcar_como_completada = async (idOrden, folio) => {

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La orden: ' + folio + ' será marcada como completada', 'question', 'Sí, marcar', 'Cancelar');
   
   if (!res.result) {
      $('.btnAcciones').prop('disabled', false);
      return;
   }

   $('.btnAcciones').prop('disabled', true);

   let respuesta = await marcar_orden_como_completada(idOrden, folio);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Orden marcada como completada!', '', 'success', 2500);
      let tabla = $('#tableOrdenesBandeja').DataTable();
      tabla.row($('#trBusqueda' + idOrden)).remove().draw();
      
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnAcciones').prop('disabled', false);
      return;
   }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++ VISORES DE RESULTADOS / DETALLE DE LA ORDEN +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalViewerResultado = (key_query, folio) => {
   // 1. Destruir modal previo si existe para liberar memoria

   const modalExistente = $('#modalViewerResultados');
   if (modalExistente.length) {
      modalExistente.modal('dispose');
   }

   let ruta = `reportes/resultado.php?id=${key_query}`;

   const html = `
   <div class="modal fade modal-superior-blur" id="modalViewerResultados" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal border-0">            

            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5 d-flex align-items-center gap-2">
                  <i class="bi bi-file-earmark-pdf fs-4"></i>
                  <span>Visor de resultados - Orden #${folio}</span>
               </h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>         

            <div class="modal-body p-0 position-relative" style="min-height: 70vh;">
               <!-- Spinner de carga -->
               <div id="pdfLoader" class="position-absolute top-50 start-50 translate-middle text-center">
                  <div class="spinner-border text-primary" role="status">
                     <span class="visually-hidden">Cargando PDF...</span>
                  </div>
                  <p class="small text-muted mt-2 mb-0">Cargando documento...</p>
               </div>

               <!-- Visor iFrame con altura adaptable -->
               <iframe 
                  id="iframePdf"
                  width="100%" 
                  style="height: 75vh; display: block;" 
                  src="${ruta}" 
                  frameborder="0"
                  onload="$('#pdfLoader').hide();"
               ></iframe>
            </div>

            <div class="modal-footer border-0 py-2">
               <a href="${ruta}" target="_blank" class="btn btn-outline-primary btn-redondo btn-sm">
                  <i class="bi bi-box-arrow-up-right me-1"></i> Abrir en nueva pestaña
               </a>
               <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-4" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>

         </div>
      </div>
   </div>`;

   // Inyectar HTML e inicializar modal
   $('#modalAdminDocs').html(html);
   const modalElement = document.getElementById('modalViewerResultados');
   const myModal = new bootstrap.Modal(modalElement);
   
   // Evento para vaciar el iframe al cerrar (libera RAM)
   $(modalElement).on('hidden.bs.modal', function () {
      $('#iframePdf').attr('src', 'about:blank');
      $(this).remove();
   });

   myModal.show();
};

const ModalViewerResultadosFolio = async (idOrden, folio) => {
   
   let respuesta = await obtiene_archivos_resultados_orden(idOrden);

   if (respuesta.estatus == 403) {
      fnNoSesion();
      return;
   }
   else if(respuesta.data.length == 0) {
      ToastColor.fire({ text: '¡Atención! No se encontraron archivos ligados a esa orden', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
      return;
   }
     
   let listaHtml = 
   `<div class="d-flex gap-2 p-2 bg-light border-bottom overflow-auto">`;
      respuesta.data.forEach((doc, idx) => {
         const activeClass = idx === 0 ? 'btn-secondary' : 'btn-outline-secondary';
         listaHtml += `
         <button type="button" class="btn ${activeClass} btn-sm text-nowrap btn-tab-pdf btn-redondo text-truncate extra-small font-monospace" style="max-width: 240px;" data-key="${doc.key_query_pdf}">
            <i class="bi bi-file-earmark-pdf me-1"></i> ${doc.descripcion || 'Estudio ' + (idx + 1)}
         </button>`;
      });
      listaHtml += 
   `</div>`;
   

   let primerKey = respuesta.data[0].key_query_pdf;

   const html = `
   <div class="modal fade modal-superior-blur" id="modalViewerResultados" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content sombra-modal border-0">            
            <div class="modal-header modal-head-per py-2">
               <h1 class="modal-title fs-5 d-flex align-items-center gap-2">
                  <i class="bi bi-journal-medical fs-4"></i>
                  <span>Resultados de Orden #${folio} (${respuesta.data.length} PDF)</span>
               </h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>         

            ${listaHtml}

            <div class="modal-body p-0 position-relative" style="min-height: 70vh;">
               <div id="pdfLoader" class="position-absolute top-50 start-50 translate-middle text-center" style="display:none;">
                  <div class="spinner-border text-primary" role="status"></div>
                  <p class="small text-muted mt-2">Cargando documento...</p>
               </div>

               <iframe 
                  id="iframePdf"
                  width="100%" 
                  style="height: 75vh; display: block;" 
                  src="reportes/resultado.php?id=${primerKey}" 
                  frameborder="0"
                  onload="$('#pdfLoader').hide();"
               ></iframe>
            </div>

            <div class="modal-footer border-0 py-2">
               <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-4" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminDocs').html(html);
   const modalElement = document.getElementById('modalViewerResultados');
   const myModal = new bootstrap.Modal(modalElement);

   // Evento para cambiar de PDF dinámicamente sin cerrar el modal
   $('.btn-tab-pdf').on('click', function() {
      $('.btn-tab-pdf').removeClass('btn-secondary').addClass('btn-outline-secondary');
      $(this).removeClass('btn-outline-secondary').addClass('btn-secondary');
      
      const key = $(this).data('key');
      $('#pdfLoader').show();
      $('#iframePdf').attr('src', `reportes/resultado.php?id=${key}`);
   });

   // Limpieza de memoria al cerrar
   $(modalElement).on('hidden.bs.modal', function () {
      $('#iframePdf').attr('src', 'about:blank');
      $(this).remove();
   });

   myModal.show();
}

const ModalViewDetallesOrden = async (idOrden, folio) => {
   
   let ordenSelected = arrOrdenesBandeja.find(orden => orden.id == idOrden);
   
   // Helpers visuales para badges
   const bannerUrgente = ordenSelected.es_urgente == 1 
      ? `
      <div class="alert alert-danger border-danger-subtle d-flex mb-3 shadow-sm rounded-3 p-2" role="alert">
         <i class="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
         <div class="text-center">
            <strong>¡ORDEN URGENTE!</strong> Esta orden requiere atención prioritaria en el flujo de laboratorio.
         </div>
      </div>` 
      : '';
      
   const badgePublicada = ordenSelected.publicada == 1
      ? '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-cloud-check me-1"></i>Publicada</span>'
      : '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle"><i class="bi bi-cloud-slash me-1"></i>No publicada</span>';

   const badgeFactura = ordenSelected.requiere_factura == 1
      ? '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle"><i class="bi bi-receipt me-1"></i>Requiere Factura</span>'
      : '';

   const html = `
   <div class="modal fade modal-superior-blur" id="modalViewDetallesOrden" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content sombra-modal border-0">            
            
            <div class="modal-header modal-head-per py-2">
               <h1 class="modal-title fs-5 d-flex align-items-center gap-2">
                  <i class="bi bi-journal-medical fs-4"></i>
                  <span>Detalles de la Orden #${folio}</span>
               </h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>         

            <div class="modal-body bg-light">
               <div class="container-fluid p-0">
                  
                  <!-- Banner Urgente (si aplica) -->
                  ${bannerUrgente}

                  <div class="row g-3">
                     
                     <!-- COLUMNA IZQUIERDA: Información del Paciente, Orden, Estudios y Archivos -->
                     <div class="col-12 col-lg-7">
                        
                        <!-- Tarjeta Paciente -->
                        <div class="card border-0 shadow-sm mb-3">
                           <div class="card-body">
                              <h6 class="text-uppercase text-muted fw-bold mb-3 small d-flex align-items-center gap-2">
                                 <i class="bi bi-person-vcard text-primary"></i> Información del Paciente
                              </h6>
                              <div class="row g-2">
                                 <div class="col-12">
                                    <span class="text-muted d-block extra-small">Nombre Completo</span>
                                    <span class="fw-semibold text-dark fs-6">${ordenSelected.paciente_nombre_historico || 'Sin registro'}</span>
                                 </div>
                                 <div class="col-12 col-sm-6">
                                    <span class="text-muted d-block extra-small">Teléfono</span>
                                    <span class="fw-medium text-dark">
                                       <i class="bi bi-telephone text-muted me-1"></i>${ordenSelected.telefono || 'N/A'}
                                    </span>
                                 </div>
                                 <div class="col-12 col-sm-6">
                                    <span class="text-muted d-block extra-small">Correo Electrónico</span>
                                    <span class="fw-medium text-dark text-truncate d-block">
                                       <i class="bi bi-envelope text-muted me-1"></i>${ordenSelected.correo || 'N/A'}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <!-- Tarjeta Contexto de la Orden -->
                        <div class="card border-0 shadow-sm mb-3">
                           <div class="card-body">
                              <h6 class="text-uppercase text-muted fw-bold mb-3 small d-flex align-items-center gap-2">
                                 <i class="bi bi-info-circle text-primary"></i> Datos Generales
                              </h6>
                              <div class="row g-3">
                                 <div class="col-6 col-sm-4">
                                    <span class="text-muted d-block extra-small">Sucursal</span>
                                    <span class="fw-medium text-dark">${ordenSelected.sucursal_historico || 'N/A'}</span>
                                 </div>
                                 <div class="col-6 col-sm-4">
                                    <span class="text-muted d-block extra-small">Convenio</span>
                                    <span class="fw-medium text-dark">${ordenSelected.convenio_nombre_historico || 'Particular'}</span>
                                 </div>
                                 <div class="col-6 col-sm-4">
                                    <span class="text-muted d-block extra-small">Estatus Orden</span>
                                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-medium">
                                       ${ordenSelected.estatus || 'N/A'}
                                    </span>
                                 </div>
                                 <div class="col-6 col-sm-4">
                                    <span class="text-muted d-block extra-small">Fecha Registro</span>
                                    <span class="fw-medium text-dark">${ordenSelected.fecha_registro || 'N/A'}</span>
                                 </div>
                                 <div class="col-6 col-sm-4">
                                    <span class="text-muted d-block extra-small">Hora Registro</span>
                                    <span class="fw-medium text-dark">${ordenSelected.hora_registro || 'N/A'}</span>
                                 </div>
                                 <div class="col-6 col-sm-4">
                                    <span class="text-muted d-block extra-small">Publicación</span>
                                    <div>${badgePublicada}</div>
                                 </div>
                                 ${badgeFactura ? `<div class="col-12"><div>${badgeFactura}</div></div>` : ''}
                              </div>
                           </div>
                        </div>

                        <!-- Tarjeta Estudios Asignados -->
                        <div class="card border-0 shadow-sm mb-3">
                           <div class="card-body">
                              <h6 class="text-uppercase text-muted fw-bold mb-3 small d-flex align-items-center gap-2">
                                 <i class="bi bi-file-earmark-medical text-primary"></i> Estudios Solicitados
                              </h6>
                              <div id="estudios_detalle_orden" class="row g-2">
                                 <!-- Se llena dinámicamente con pinta_estudios_orden_detalle -->
                              </div>
                           </div>
                        </div>

                        <!-- Tarjeta Archivos Adjuntos -->
                        <div class="card border-0 shadow-sm">
                           <div class="card-body">
                              <h6 class="text-uppercase text-muted fw-bold mb-3 small d-flex align-items-center gap-2">
                                 <i class="bi bi-paperclip text-primary"></i> Archivos y Resultados PDF
                              </h6>
                              <div id="container_archivos_detalle" class="row g-2">
                                 <!-- Se llena dinámicamente con pinta_archivos_orden_detalle -->
                              </div>
                           </div>
                        </div>

                     </div>

                     <!-- COLUMNA DERECHA: Financiero y Trazabilidad -->
                     <div class="col-12 col-lg-5">
                        
                        <!-- Tarjeta Financiera -->
                        <div class="card border-0 shadow-sm mb-3">
                           <div class="card-body">
                              <h6 class="text-uppercase text-muted fw-bold mb-3 small d-flex align-items-center gap-2">
                                 <i class="bi bi-cash-stack text-success"></i> Estado Financiero
                              </h6>
                              <div class="row g-2 align-items-center mb-3">
                                 <div class="col-6">
                                    <span class="text-muted d-block extra-small">Estatus Pago</span>
                                    <span class="badge bg-success-subtle text-success border border-success-subtle fw-medium">
                                       ${ordenSelected.estatus_pago || 'Pendiente'}
                                    </span>
                                 </div>
                                 <div class="col-6 text-end">
                                    <span class="text-muted d-block extra-small">Total Neto</span>
                                    <span class="fs-5 fw-bold text-dark">$${parseFloat(ordenSelected.total_neto || 0).toFixed(2)}</span>
                                 </div>
                              </div>

                              <div class="border-top pt-2">
                                 <div class="d-flex justify-content-between py-1">
                                    <span class="text-muted small">Total Abonado:</span>
                                    <span class="fw-semibold text-success">$${parseFloat(ordenSelected.total_abonado || 0).toFixed(2)}</span>
                                 </div>
                                 <div class="d-flex justify-content-between py-1">
                                    <span class="text-muted small">Saldo Deudor:</span>
                                    <span class="fw-semibold text-danger">$${parseFloat(ordenSelected.saldo_deudor || 0).toFixed(2)}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <!-- Tarjeta Trazabilidad / Auditoría -->
                        <div class="card border-0 shadow-sm">
                           <div class="card-body">
                              <h6 class="text-uppercase text-muted fw-bold mb-3 small d-flex align-items-center gap-2">
                                 <i class="bi bi-clock-history text-secondary"></i> Historial y Eventos
                              </h6>
                              
                              <ul class="list-group list-group-flush extra-small">
                                 
                                 <!-- Completada -->
                                 <li class="list-group-item px-0 d-flex justify-content-between align-items-start bg-transparent">
                                    <div>
                                       <span class="fw-bold d-block text-dark"><i class="bi bi-check-circle me-1 text-success"></i>Completada</span>
                                       <span class="text-muted">${ordenSelected.user_completo || 'N/A'}</span>
                                    </div>
                                    <span class="text-muted text-end">${ordenSelected.fecha_completada || '-'}</span>
                                 </li>

                                 <!-- Entregada -->
                                 <li class="list-group-item px-0 d-flex justify-content-between align-items-start bg-transparent">
                                    <div>
                                       <span class="fw-bold d-block text-dark"><i class="bi bi-box-seam me-1 text-primary"></i>Entregada</span>
                                       <span class="text-muted">${ordenSelected.user_entrego || 'N/A'}</span>
                                    </div>
                                    <span class="text-muted text-end">${ordenSelected.fecha_entregado || '-'}</span>
                                 </li>

                                 <!-- Publicada -->
                                 <li class="list-group-item px-0 d-flex justify-content-between align-items-start bg-transparent">
                                    <div>
                                       <span class="fw-bold d-block text-dark"><i class="bi bi-cloud-upload me-1 text-info"></i>Publicada</span>
                                       <span class="text-muted">${ordenSelected.user_publico || 'N/A'}</span>
                                    </div>
                                    <span class="text-muted text-end">${ordenSelected.fecha_publicada || '-'}</span>
                                 </li>

                                 <!-- Cancelación (si aplica) -->
                                 ${ordenSelected.fecha_cancelacion ? `
                                 <li class="list-group-item px-0 bg-danger-subtle rounded p-2 mt-2">
                                    <span class="fw-bold d-block text-danger"><i class="bi bi-x-circle me-1"></i>Cancelada</span>
                                    <span class="text-dark d-block">Por: ${ordenSelected.user_cancela || 'N/A'}</span>
                                    <span class="text-muted d-block">Fecha: ${ordenSelected.fecha_cancelacion}</span>
                                    <span class="text-muted d-block italic">Motivo: ${ordenSelected.motivo_cancela || 'Sin especificación'}</span>
                                 </li>
                                 ` : ''}

                              </ul>
                           </div>
                        </div>

                     </div>
                  </div>
               </div>
            </div>

            <div class="modal-footer border-0 py-2 bg-light">
               <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-4" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalViewDetallesOrden').modal('show');
   obtenerEstudiosOrdenDetalle(idOrden);
   obtenerArchivosOrdenDetalle(idOrden, folio);
}

const obtenerEstudiosOrdenDetalle = async (idOrden) => {
   // Loader en el contenedor de estudios
   $('#estudios_detalle_orden').html(`
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
      $('#estudios_detalle_orden').html('<span class="text-danger extra-small">Error al cargar estudios.</span>');
      return;
   }
   pinta_estudios_orden_detalle(respuesta.data, idOrden);
};

const pinta_estudios_orden_detalle = (data, idOrden) => {
   
   let html = '';
   if (data && data.length > 0) {
      data.forEach((est) => {
         html += `
         <div class="col-12 col-sm-6">
            <div class="p-2 border rounded bg-white shadow-sm d-flex align-items-center h-100">
               <i class="bi bi-flask text-primary me-2 fs-5"></i>
               <span class="fw-medium text-dark small text-truncate" title="${est.nombre_estudio_historico}">
                  ${est.nombre_estudio_historico}
               </span>
            </div>
         </div>`;
      });
   } 
   else {
      html = `
      <div class="col-12">
         <div class="alert alert-secondary py-2 px-3 mb-0 small text-center" role="alert">
            <i class="bi bi-info-circle me-1"></i> No se registraron estudios en esta orden.
         </div>
      </div>`;
   }
   $('#estudios_detalle_orden').html(html);
};

const obtenerArchivosOrdenDetalle = async (idOrden, folio) => {
        
   let respuesta = await obtiene_archivos_resultados_orden(idOrden);

   if (respuesta.estatus == 403) {
      fnNoSesion();
      return;
   }   
   else if(!respuesta.data || respuesta.data.length == 0) {
      $('#container_archivos_detalle').html(`
         <div class="col-12">
            <div class="alert alert-secondary py-2 px-3 mb-0 small text-center" role="alert">
               <i class="bi bi-folder2-open me-1 opacity-75"></i> Aún no se han adjuntado archivos PDF para esta orden.
            </div>
         </div>
      `);
      return;
   }
   
   pinta_archivos_orden_detalle(respuesta.data, folio);   
};

const pinta_archivos_orden_detalle = (data, folio) => {
   
   let html = '';
   if (data && data.length > 0) {
      data.forEach((file) => {
         html += `
         <div class="col-12">
            <div class="p-2 border rounded bg-white shadow-sm d-flex align-items-center justify-content-between">
               
               <!-- Info del Archivo -->
               <div class="d-flex align-items-center overflow-hidden me-2 pointer" onclick="ModalViewerResultado('${file.key_query_pdf}', '${folio}', 1);">
                  <div class="bg-danger-subtle text-danger rounded p-2 me-2 d-flex align-items-center justify-content-center">
                     <i class="bi bi-file-earmark-pdf fs-4"></i>
                  </div>
                  <div class="text-truncate">
                     <div class="fw-semibold text-dark small text-truncate" title="${file.descripcion || file.nombre_original}">
                        ${file.descripcion || 'Archivo adjunto'}
                     </div>
                     <div class="extra-small text-muted text-truncate" title="${file.nombre_original}">
                        ${file.nombre_original}
                     </div>
                  </div>
               </div>

               <!-- Metadata (Usuario y Fecha/Hora) -->
               <div class="text-end text-nowrap extra-small text-muted border-start ps-2">
                  <div>
                     <i class="bi bi-person me-1 opacity-75"></i>${file.user_cap || 'Sistema'}
                  </div>
                  <div>
                     <i class="bi bi-calendar3 me-1 opacity-75"></i>${file.fecha || '-'} <span class="ms-1">${file.hora || ''}</span>
                  </div>
               </div>

            </div>
         </div>`;
      });
   } 
   else {
      html = `
      <div class="col-12">
         <div class="alert alert-secondary py-2 px-3 mb-0 small text-center" role="alert">
            <i class="bi bi-folder2-open me-1 opacity-75"></i> No se encontraron archivos disponibles para esta orden.
         </div>
      </div>`;
   }

   $('#container_archivos_detalle').html(html);
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ PUBLICACIÓN Y NOTIFICACIÓN ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalPublicarNotificar = (idOrden, folio, paciente, correo, telefono, estaPublicada, fechaPublicacion = null, keyQuery) => {
   // Corrección de sintaxis y estado dinámico (evaluando 1 o true)
   const publicada = (estaPublicada == 1 || estaPublicada === true);
   
   const tituloModal = publicada ? `Reenviar Notificación - Orden #${folio}` : `Publicar y Notificar - Orden #${folio}`;
   const iconoModal = publicada ? 'bi-send-check' : 'bi-globe-americas';
   const btnTexto = publicada ? 'Reenviar Notificación' : 'Publicar y Enviar';
   const btnColor = publicada ? 'btn-primary' : 'btn-success';

   let html = `
   <div class="modal fade modal-superior-blur" id="ModalPublicarNotificar" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal border-0">            

            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5 d-flex align-items-center gap-2">
                  <i class="bi ${iconoModal} fs-4"></i>
                  <span>${tituloModal}</span>
               </h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>         

            <div class="modal-body py-3">
               
               <!-- Ficha Resumen del Paciente -->
               <div class="card border-0 bg-light rounded-3 p-3 mb-3 shadow-sm">
                  <div class="row g-2 align-items-center">
                     <div class="col-12 col-md-7">
                        <span class="text-muted extra-small text-uppercase fw-semibold d-block">Paciente</span>
                        <span class="fw-bold text-dark fs-6">${paciente}</span>
                     </div>
                     <div class="col-12 col-md-5 text-md-end">
                        <span class="text-muted extra-small text-uppercase fw-semibold d-block mb-1">Estatus Portal Cliente</span>
                        ${publicada 
                           ? `<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 fs-8">
                                 <i class="bi bi-check-circle-fill me-1"></i> Publicado ${fechaPublicacion ? '(' + fechaPublicacion + ')' : ''}
                              </span>`
                           : `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2 py-1 fs-8">
                                 <i class="bi bi-clock-history me-1"></i> No visible en Portal
                              </span>`
                        }
                     </div>
                  </div>
               </div>

               <!-- Mensaje Informativo de Acción sobre el Portal (Reemplaza al Checkbox) -->
               <div class="alert ${publicada ? 'alert-info border-info-subtle' : 'alert-success border-success-subtle'} rounded-3 mb-3 d-flex align-items-center gap-2 py-2 px-3 shadow-sm">
                  <i class="bi ${publicada ? 'bi-info-circle-fill text-info' : 'bi-globe-americas text-success'} fs-5"></i>
                  <span class="small text-dark">
                     ${publicada 
                        ? 'Esta orden <b>ya se encuentra publicada</b> en el portal del cliente. Selecciona los canales para reenviar la notificación.' 
                        : 'Al confirmar, la orden <b>se publicará automáticamente</b> en el portal de clientes para su consulta.'}
                  </span>
               </div>

               <!-- Canales de Notificación Directa -->
               <div class="card border-0 bg-white rounded-3 p-3 shadow-sm border-start border-4 border-info">
                  <h6 class="fw-bold text-dark mb-3 small text-uppercase d-flex align-items-center gap-1">
                     <i class="bi bi-chat-left-dots text-info"></i> Canales de Notificación Directa (Opcional)
                  </h6>

                  <!-- WhatsApp -->
                  <div class="row g-2 align-items-center mb-3">
                     <div class="col-12 col-md-5">
                        <div class="form-check">
                           <input class="form-check-input" type="checkbox" id="chk_enviar_wa" ${telefono ? 'checked' : 'disabled'}>
                           <label class="form-check-label fw-semibold text-dark small" for="chk_enviar_wa">
                              <i class="bi bi-whatsapp text-success me-1"></i> Enviar WhatsApp
                           </label>
                        </div>
                     </div>
                     <div class="col-12 col-md-7">
                        <div class="input-group input-group-sm">
                           <span class="input-group-text bg-light"><i class="bi bi-telephone"></i></span>
                           <input type="text" class="form-control" id="txt_whatsapp" value="${telefono || ''}" placeholder="Sin teléfono registrado" ${!telefono ? 'disabled' : ''}>
                        </div>
                     </div>
                  </div>

                  <hr class="my-2 opacity-25">

                  <!-- Correo Electrónico -->
                  <div class="row g-2 align-items-center">
                     <div class="col-12 col-md-5">
                        <div class="form-check">
                           <input class="form-check-input" type="checkbox" id="chk_enviar_email" ${correo ? 'checked' : 'disabled'}>
                           <label class="form-check-label fw-semibold text-dark small" for="chk_enviar_email">
                              <i class="bi bi-envelope-at text-danger me-1"></i> Enviar Correo
                           </label>
                        </div>
                     </div>
                     <div class="col-12 col-md-7">
                        <div class="input-group input-group-sm">
                           <span class="input-group-text bg-light"><i class="bi bi-at"></i></span>
                           <input type="email" class="form-control" id="txt_correo" value="${correo || ''}" placeholder="Sin correo registrado" ${!correo ? 'disabled' : ''}>
                        </div>
                     </div>
                  </div>

               </div>

            </div>

            <div class="modal-footer border-0 pt-1">
               <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-3" data-bs-dismiss="modal">
                  Cancelar
               </button>
               <button type="button" class="btn ${btnColor} btn-redondo btn-sm px-4" id="btnEjecutarPublicacion"
                  onclick="procesa_publicacion_notificacion(${idOrden}, '${keyQuery}', '${folio}');">
                  <i class="bi ${iconoModal} me-1"></i> ${btnTexto}
               </button>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#ModalPublicarNotificar').modal('show');
};

const procesa_publicacion_notificacion = async (idOrden, keyQuery, folio) => {

   let enviarWhats    = $('#chk_enviar_wa').prop('checked') ? 1 : 0;
   let enviarMail     = $('#chk_enviar_email').prop('checked') ? 1 : 0;
   let txt_whatsapp   = $('#txt_whatsapp').val().trim();
   let txt_correo     = $('#txt_correo').val().trim();
   
   // Construcción del mensaje con etiquetas HTML
   let mensajeConfirm = '<div style="text-align: left; margin-top: 10px;">';
   mensajeConfirm += '<ul>';
   mensajeConfirm += '  <li>Publicar el resultado en la plataforma del paciente.</li>';

   if (enviarWhats === 1) {
      mensajeConfirm += `  <li>Enviar resultado por WhatsApp al número: <strong>${txt_whatsapp}</strong></li>`;
   }
   if (enviarMail === 1) {
      mensajeConfirm += `  <li>Enviar resultado por correo a: <strong>${txt_correo}</strong></li>`;
   }

   if(enviarWhats == 1 && (txt_whatsapp == '' || txt_whatsapp.length != 10)) {
      ToastColor.fire({
         text: '¡Atención! Si vas a enviar el resultado por WhatsApp necesitas ingresar un número válido de 10 dígitos',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#txt_whatsapp')
      return;
   }
   else if(enviarMail == 1 && ( txt_correo == '' || !fnValidaMail(txt_correo)  )) {
      ToastColor.fire({
         text: '¡Atención! Si vas a enviar el resultado por correo necesitas ingresar una cuenta de correo válido',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#txt_correo')
      return;
   }

   const res = await showMessageSwalQuestion(
      `Acciones sobre la orden <strong>#${folio}</strong>`, 
      mensajeConfirm, 
      'info', 
      'Sí, publicar', 
      'Cancelar'
   );
   
   if (!res.result) {
      $('.btnAcciones').prop('disabled', false);
      return;
   }

   $('.btnAcciones').prop('disabled', true);

   let respuesta = await procesar_publicacion_notificacion(idOrden, folio);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      showMessageSwalTimer('¡Publicación y notificación correcta!', '', 'success', 2500);
      $('#ModalPublicarNotificar').modal('hide');
      
      let orden = arrOrdenesBandeja.find(o => o.id == idOrden);
      if (orden) {
         orden.publicada       = 1;
         orden.fecha_publicada = respuesta.data[0];
      }
      pinta_ordenes_bandejas(arrOrdenesBandeja);
      if(enviarWhats == 1) {
         console.log('Enviando resultados por whatsApp');
      }

      if(enviarMail == 1) {
         notif_mail_resultados(keyQuery, txt_correo);
      }
   } 
   else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnAcciones').prop('disabled', false);
      return;
   }
}

const notif_mail_resultados = async (keyQuery, correo) => {
   
   let respuesta = await notificar_mail_resultados(keyQuery, correo);
      
   if(respuesta.estatus == 200) {
      ToastColor.fire({
         text: '¡Resultados enviados por correo!',
         icon: 'success',
         position: 'top',
         timerProgressBar: false
      });
   }
   else {
      ToastColor.fire({
         text: '¡Atención! '+respuesta.mensaje,
         icon: 'error',
         position: 'top',
         timerProgressBar: false
      });
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabBandejas                       = TabBandejas;
window.ModalGestionPDF                   = ModalGestionPDF;
window.ModalViewerResultado              = ModalViewerResultado;
window.ModalViewerResultadosFolio        = ModalViewerResultadosFolio;
window.ModalPublicarNotificar            = ModalPublicarNotificar;
window.ModalViewDetallesOrden            = ModalViewDetallesOrden;

window.subir_pdf_resultado               = subir_pdf_resultado;
window.eliminar_resultado                = eliminar_resultado;
window.cambiar_estatus_barra             = cambiar_estatus_barra;
window.obtiene_ordenes_estatus           = obtiene_ordenes_estatus;
window.marcar_como_parcial               = marcar_como_parcial;
window.marcar_como_completada            = marcar_como_completada;
window.procesa_publicacion_notificacion  = procesa_publicacion_notificacion;
