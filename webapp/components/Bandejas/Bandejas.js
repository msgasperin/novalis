import { busqueda_ordenes_bandeja, obtiene_datos_gestion_resultados } from "./BandejasServices.js";

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
                  
                  <form id="formSubirPDF" enctype="multipart/form-data" onsubmit="guardarNuevoArchivoPDF(event, ${idOrden})">
                     <div class="row g-2 align-items-end">
                        <div class="col-12 col-md-5">
                           <label class="form-label small fw-semibold text-muted mb-1">Descripción del Archivo</label>
                           <input type="text" class="form-control form-control-sm" id="pdf_descripcion" name="pdf_descripcion" placeholder="Ej. Biometría Hematológica / General" required autocomplete="off">
                        </div>

                        <div class="col-12 col-md-5">
                           <label class="form-label small fw-semibold text-muted mb-1">Seleccionar Archivo PDF</label>
                           <input type="file" class="form-control form-control-sm" id="pdf_archivo" name="pdf_archivo" accept=".pdf" required>
                        </div>

                        <div class="col-12 col-md-2 text-end">
                           <button type="submit" class="btn btn-success btn-sm btn-redondo w-100" id="btnSubirPDF">
                              <i class="bi bi-plus-lg me-1"></i> Subir PDF
                           </button>
                        </div>
                     </div>
                  </form>
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
   obtenerArchivosOrdenPDF(idOrden);
};

const obtenerArchivosOrdenPDF = async (idOrden) => {
   // Loader en el contenedor de estudios
   $('#contenedor_estudios_solicitados').html(`
      <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
      <span class="small text-muted">Cargando estudios...</span>
   `);

   // Loader en la tabla de archivos
   $('#tbodyArchivosPDF').html(`
      <tr>
         <td colspan="4" class="text-center py-4 text-muted">
            <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
            Cargando archivos de la orden...
         </td>
      </tr>
   `);

   try {
      let respuesta = await obtiene_datos_gestion_resultados(idOrden);

      if (respuesta.estatus == 403) {
         fnNoSesion();
         return;
      }

      if (respuesta.estudios.length == 0) {
         showMessageSwalTimer('Atención', respuesta.mensaje || respuesta.msg || 'No se pudieron recuperar los datos de la orden.', 'warning', 2500);
         $('#contenedor_estudios_solicitados').html('<span class="text-danger extra-small">Error al cargar estudios.</span>');
         $('#tbodyArchivosPDF').html(`
            <tr>
               <td colspan="4" class="text-center py-4 text-muted">
                  <i class="bi bi-folder2-open fs-3 d-block mb-1 opacity-50"></i>
                  <span class="small">No se encontraron datos disponibles para esta orden.</span>
               </td>
            </tr>
         `);
         return;
      }

      // Se envían los datos obtenidos a la función renderizadora
      pinta_archivos_orden_pdf(respuesta, idOrden);

   } catch (error) {
      showMessageSwalTimer('Ocurrió un error: ', 'No se pudo conectar con el servidor para consultar los archivos.', 'error', 2500);
      $('#contenedor_estudios_solicitados').html('<span class="text-danger extra-small">Error al cargar estudios.</span>');
      $('#tbodyArchivosPDF').html(`
         <tr>
            <td colspan="4" class="text-center py-3 text-danger">
               <i class="bi bi-exclamation-triangle me-1"></i> Error de conexión al recuperar los archivos adjuntos.
            </td>
         </tr>
      `);
   }
};

const pinta_archivos_orden_pdf = (data, idOrden) => {
   
   // 2. Renderizar Badges de Estudios Solicitados
   let htmlEstudios = '';
   if (data.estudios && data.estudios.length > 0) {

      console.log(data.estudios);

      data.estudios.forEach((est) => {
         htmlEstudios += `
         <span class="badge bg-white text-dark border border-secondary-subtle font-monospace fw-normal py-1 px-2 shadow-sm fs-8">
            <i class="bi bi-check2 text-primary me-1"></i>${est.nombre_estudio_historico}
         </span>`;
      });
   } else {
      htmlEstudios = '<span class="text-muted extra-small">No se registraron estudios en esta orden.</span>';
   }
   $('#contenedor_estudios_solicitados').html(htmlEstudios);

   // 3. Renderizar Tabla de Archivos PDF Subidos
   let htmlArchivos = '';
   if (data.archivos && data.archivos.length > 0) {
      data.archivos.forEach((file) => {
         htmlArchivos += `
         <tr id="filaArchivoPDF_${file.id}">
            <td>
               <div class="fw-bold text-dark mb-0">${file.descripcion}</div>
               <span class="extra-small text-muted">
                  <i class="bi bi-person me-1"></i>${file.usuario_nombre || 'Sistema'}
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
                  <!-- Previsualizar PDF -->
                  <button type="button" 
                          class="btn btn-outline-info btn-redondo btn-sm px-2" 
                          title="Previsualizar resultado" 
                          onclick="VerPDFPrevisualizar('${file.nombre_servidor}')">
                     <i class="bi bi-eye"></i>
                  </button>

                  <!-- Descargar directamente -->
                  <a href="${file.nombre_servidor}" 
                     target="_blank" 
                     download="${file.nombre_original}"
                     class="btn btn-outline-dark btn-redondo btn-sm px-2" 
                     title="Descargar PDF">
                     <i class="bi bi-download"></i>
                  </a>

                  <!-- Eliminar PDF cargado -->
                  <button type="button" 
                          class="btn btn-outline-danger btn-redondo btn-sm px-2" 
                          title="Eliminar archivo" 
                          onclick="EliminarArchivoPDF(${file.id}, ${idOrden})">
                     <i class="bi bi-trash"></i>
                  </button>
               </div>
            </td>
         </tr>`;
      });
   } else {
      htmlArchivos = `
      <tr>
         <td colspan="4" class="text-center py-4 text-muted">
            <i class="bi bi-folder2-open fs-3 d-block mb-1 opacity-50"></i>
            <span class="small">Aún no se han adjuntado archivos PDF para esta orden.</span>
         </td>
      </tr>`;
   }

   $('#tbodyArchivosPDF').html(htmlArchivos);
};

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
window.ModalGestionPDF         = ModalGestionPDF;

window.registrar_resultado     = registrar_resultado;
window.eliminar_resultado      = eliminar_resultado;
window.cambiar_estatus_barra   = cambiar_estatus_barra;
window.obtiene_ordenes_estatus = obtiene_ordenes_estatus;