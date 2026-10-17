import { obtiene_resultados_cliente, obtiene_archivos_resultados_orden, validar_aceptacion_aviso, aceptar_aviso_privacidad } from "./DashboardServices.js";

let arrOrdenes        = [];

const valida_aceptacion_aviso = async () => {

   let respuesta = await validar_aceptacion_aviso();

   if(respuesta.estatus == 200) {
      obtener_resultados_cliente();
   }
   else if(respuesta.estatus == 202) {
      ModalAvisoPrivacidad();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500); 
      return;
   }
   
}

const acepta_aviso_privacidad = async () => {

   if(!$('#checkConsentimiento').prop('checked')) {
      ToastColor.fire({
         text: '¡Atención! debes aceptar el aviso de privacidad',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#checkConsentimiento').focus();
      return;
   }

   let respuesta = await aceptar_aviso_privacidad();

   if (respuesta.estatus == 200) {
      ToastColor.fire({
         text: '¡Aviso de privacidad aceptado!',
         icon: 'success',
         position: 'top',
         timerProgressBar: false
      });
      $('#modalAvisoPrivacidad').modal('hide');
      obtener_resultados_cliente();
   }
   else {
      ToastColor.fire({
         text: '¡Atención! ' + respuesta.mensaje,
         icon: 'error',
         position: 'top',
         timerProgressBar: false
      });
   }
   
}

const ModalAvisoPrivacidad = () => {
   
   let html = `
   <div class="modal fade" id="modalAvisoPrivacidad" tabindex="-1" aria-labelledby="modalAvisoPrivacidadLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
         <div class="modal-content border-0 shadow-lg">
            
            <!-- HEADER -->
            <div class="modal-header bg-primary text-white py-4 px-4">
               <div class="d-flex align-items-center w-100">
                  <div class="rounded-circle bg-white bg-opacity-25 p-3 me-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:50px; height:50px">
                     <i class="bi bi-info-circle text-white fs-4"></i>
                  </div>
                  <div>
                     <h5 class="modal-title fw-bold mb-1" id="modalAvisoPrivacidadLabel">Aviso de privacidad</h5>
                     <span class="text-white-50 small">Aceptación obligatoria del aviso de privacidad</span>
                  </div>
               </div>
            </div>

            <!-- CUERPO -->
            <div class="modal-body bg-light p-4 p-md-5">
               <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                  
                  <div class="text-center mb-4">
                     <div class="text-primary display-6 mb-2">
                        <i class="bi bi-shield-check"></i>
                     </div>
                     <h4 class="fw-bold text-dark">Protección de Datos Personales</h4>
                  </div>
                  
                  <p class="text-muted small text-center mb-4 lh-lg">
                     <strong>[Nombre del Laboratorio]</strong> utilizará sus datos personales y de salud para la generación, consulta y descarga de sus estudios clínicos en línea. Para mayor información sobre el tratamiento de sus datos y cómo ejercer sus Derechos ARCO, puede consultar nuestro 
                     <a href="#" class="text-decoration-underline fw-semibold text-primary" onclick="ModalAvisoIntegral();">
                        Aviso de Privacidad Integral aquí
                     </a>.
                  </p>

                  <div class="form-check form-switch bg-light p-3 px-4 rounded-3 border mb-4 d-flex align-items-center justify-content-between">
                     <label class="form-check-label small fw-semibold text-secondary user-select-none order-1 me-3" for="checkConsentimiento">
                        He leído y acepto el Aviso de Privacidad y autorizo el tratamiento de mis datos de salud.
                     </label>
                     <input class="form-check-input fs-4 order-2 ms-0" type="checkbox" role="switch" id="checkConsentimiento">
                  </div>

                  <button type="button" id="btnConsultar" class="btn btn-primary btn-lg w-100 rounded-pill shadow-sm" onclick="acepta_aviso_privacidad();">
                     Consultar Mis Resultados
                  </button>

               </div>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdminDocs').html(html);
   $('#modalAvisoPrivacidad').modal('show');
}

const ModalAvisoIntegral = () => {

   let subdo = $('#subdo').val().trim();
   
   let html = `
   <div class="modal fade" id="modalAvisoIntegral" tabindex="-1" aria-labelledby="modalAvisoIntegralLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-lg-down">
         <div class="modal-content border-0 shadow-lg">
            
            <!-- HEADER -->
            <div class="modal-header bg-primary text-white py-3 px-4 d-flex align-items-center justify-content-between">
               <div class="d-flex align-items-center">
                  <div class="rounded-circle bg-white bg-opacity-25 p-2 me-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:50px; height:50px">
                     <i class="bi bi-file-earmark-pdf text-white fs-4"></i>
                  </div>
                  <div>
                     <h5 class="modal-title fw-bold mb-0" id="modalAvisoIntegralLabel">Aviso de Privacidad Integral</h5>
                     <span class="text-white-50 small">Documento legal y de protección de datos</span>
                  </div>
               </div>
               <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- CUERPO -->
            <div class="modal-body bg-light p-3 p-md-4">
               <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  
                  <!-- VISUALIZADOR PDF -->
                  <div class="ratio ratio-16x9">
                     <iframe src="/api/assets/${subdo}/docs/aviso_privacidad_v1.pdf" title="Aviso de Privacidad Integral" allowfullscreen></iframe>
                  </div>

               </div>
               
            </div>

            <!-- FOOTER -->
            <div class="modal-footer bg-white border-0 px-4 pb-4 pt-0">
               <button type="button" class="btn btn-outline-secondary rounded-pill px-4 ms-auto" data-bs-dismiss="modal">
                  Entendido / Cerrar
               </button>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdminDocs2').html(html);
   $('#modalAvisoIntegral').modal('show');
}

const obtener_resultados_cliente = async () => {
   
   let tipoCliente = $('#tipoClientePortal').val().trim();
   let fDesde      = '';
   let fHasta      = '';
   let txtBusqueda = '';

   if(tipoCliente == 'convenio') {
      fDesde      = $('#fDesde').val().trim();
      fHasta      = $('#fHasta').val().trim();
      txtBusqueda = $('#txtBusqueda').val().trim();

      if(fDesde == '' || fHasta == '') {
         showMessageSwalTimer('Debes seleccionar el rango de fechas y este no debe ser mayor a 30 días', '', 'info', 3500);
         $('#fDesde').focus();
         return;
      }

      if(fDesde > fHasta) {
         showMessageSwalTimer('La fecha inicial no puede ser mayor a la fecha final', '', 'info', 3500);
         $('#fDesde').focus();
         return;
      }
   }

   activarLoad('Cargando estudios...');

   let respuesta = await obtiene_resultados_cliente(fDesde, fHasta, txtBusqueda);
   arrOrdenes = respuesta.data;
   if(respuesta.estatus == 403) {
      //fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#containerSolicitudes').html(
         `<div class="container py-5">
            <div class="row justify-content-center">
               <div class="col-12 col-sm-10 col-md-8 col-lg-5">
                  <div class="card border-0 shadow-sm bg-body-tertiary rounded-4 text-center p-4 p-md-5">
                  <div class="card-body">
                     
                     <!-- Ícono con fondo suave y pulso visual -->
                     <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-4 p-3" style="width: 60px; height: 60px;">
                        <i class="bi bi-folder-x fs-2"></i>
                     </div>

                     <!-- Título y descripción -->
                     <h5 class="fw-bold text-body-emphasis mb-2">
                        Sin resultados coincidentes
                     </h5>
                     <p class="text-secondary small mb-4">
                        No encontramos ningún registro para tu búsqueda. Intenta simplificar los términos o cambiar los filtros activos.
                     </p>

                  </div>
                  </div>
               </div>
            </div>
         </div>`
      );
      closeLoad();
      return;
   }
   else {
      if(arrOrdenes.length > 0) {
         pinta_ordenes(arrOrdenes);
      }
      else {
         $('#containerSolicitudes').html(
            `<div class="container py-5">
               <div class="row justify-content-center">
                  <div class="col-12 col-sm-10 col-md-8 col-lg-5">
                     <div class="card border-0 shadow-sm bg-body-tertiary rounded-4 text-center p-4 p-md-5">
                     <div class="card-body">
                        
                        <!-- Ícono con fondo suave y pulso visual -->
                        <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-4 p-3" style="width: 60px; height: 60px;">
                           <i class="bi bi-folder-x fs-2"></i>
                        </div>

                        <!-- Título y descripción -->
                        <h5 class="fw-bold text-body-emphasis mb-2">
                           Sin resultados coincidentes
                        </h5>
                        <p class="text-secondary small mb-4">
                           No encontramos ningún registro para tu búsqueda. Intenta simplificar los términos o cambiar los filtros activos.
                        </p>

                     </div>
                     </div>
                  </div>
               </div>
            </div>`
         );
         closeLoad();
      }
   }
}

const pinta_ordenes = (data) => {

   let estudios = [];
   let color    = '';


   if(data.length == 0) {
      $('#containerSolicitudes').html(
         `<div class="container py-5">
            <div class="row justify-content-center">
               <div class="col-12 col-sm-10 col-md-8 col-lg-5">
                  <div class="card border-0 shadow-sm bg-body-tertiary rounded-4 text-center p-4 p-md-5">
                  <div class="card-body">
                     
                     <!-- Ícono con fondo suave y pulso visual -->
                     <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-4 p-3" style="width: 60px; height: 60px;">
                        <i class="bi bi-folder-x fs-2"></i>
                     </div>

                     <!-- Título y descripción -->
                     <h5 class="fw-bold text-body-emphasis mb-2">
                        Sin resultados coincidentes
                     </h5>
                     <p class="text-secondary small mb-4">
                        No encontramos ningún registro para tu búsqueda. Intenta simplificar los términos o cambiar los filtros activos.
                     </p>

                  </div>
                  </div>
               </div>
            </div>
         </div>`
      );
      return;
   }

   let html = 
   '<div class="row">';
      data.forEach(row => {

         estudios = row.estudios.split(',');
         (row.estatus == 'LISTO' || row.estatus == 'ENTREGADO') ? color = 'success' :
         row.estatus == 'PROCESO' ? color = 'warning' : color = 'secondary';
         
         html +=
         `<div class="col-12 col-md-6 col-xl-4 mt-2">
            <div class="order-card h-100 d-flex flex-column">
               
               <div class="card-header-custom d-flex justify-content-between align-items-center">
                  <div class="status-indicator border-4 border-start border-${color}"></div>
                  <div class="ps-2">
                     <span class="text-uppercase text-muted fw-bold extra-small d-block">Folio Solicitud</span>
                     <span class="fw-bold text-dark fs-6">#${row.folio}</span>
                  </div>
                  <span class="badge status-badge-${color} rounded-pill px-3 py-1.5 fw-semibold small d-flex align-items-center gap-1">
                     <i class="bi bi-check-circle-fill"></i> ${row.estatus}
                  </span>
               </div>

               <div class="card-body p-4 d-flex flex-column justify-content-between gap-3">
                  
                  <!-- Datos del Paciente -->
                  <div>
                     <h6 class="fw-bold text-dark mb-1">${row.paciente_nombre_historico}</h6>
                     <div class="text-muted small mb-2">
                        <i class="bi bi-person me-1"></i>${row.paciente_sexo_historico}, ${row.paciente_edad_registro}
                     </div>
                     <div class="text-muted extra-small">
                        <i class="bi bi-calendar3 me-1"></i> Registrado: ${row.fecha_registro} - ${row.hora_registro}
                     </div>
                  </div>

                  <hr class="my-0 text-black-50 opacity-10">

                  <!-- Lista de Estudios -->
                  <div>
                     <span class="extra-small text-muted fw-bold d-block mb-2">ESTUDIOS SOLICITADOS</span>
                     <div class="d-flex flex-wrap gap-1.5">
                        ${estudios.map(e => `<span class="study-pill me-2">${e}</span>`).join('')}
                     </div>
                  </div>`;
                  if(row.estatus == 'ENTREGADO' || row.estatus == 'LISTO') {
                     html+=
                     `<div class="pt-2">
                        <button class="btn btn-outline-danger btn-sm w-100 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm btn-redondo" onclick="ModalViewerResultadosFolio('${row.id}', '${row.folio}');">
                           <i class="bi bi-file-earmark-pdf-fill fs-6"></i> Descargar Resultados (PDF)
                        </button>
                     </div>`;
                  }
                  else {
                     html+=
                     `<span class="bg-light text-muted w-100 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 border btn-redondo">
                        <i class="bi bi-lock-fill"></i> Resultados Pendientes
                     </span>`;
                  }
                  html+=`
               </div>
            </div>
         </div>`;          
      });
      html +=
   `</div>`;
   
   $('#containerSolicitudes').html(html);

   
   closeLoad();
}

const buscar_ordenes_arr_paciente = () => {

   const busqueda = $('#txtFiltroPaciente').val().trim().toLowerCase();

   const filtrado = arrOrdenes.filter(orden => {
      return orden.estudios.toLowerCase().includes(busqueda) || orden.folio.toLowerCase().includes(busqueda);
   });

   pinta_ordenes(filtrado);
}

const ModalViewerResultadosFolio = async (idOrden, folio) => {
   
   let respuesta = await obtiene_archivos_resultados_orden(idOrden);

   if (respuesta.estatus == 403) {
      fnNoSesion();
      return;
   }
   else if(respuesta.data.length == 0) {
      ToastColor.fire({ text: '¡Atención! No se encontraron archivos ligados a esa orden; hable con el administrador', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
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
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
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
                  src="reportes/res_cliente.php?id=${primerKey}" 
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
      $('#iframePdf').attr('src', `reportes/res_cliente.php?id=${key}`);
   });

   // Limpieza de memoria al cerrar
   $(modalElement).on('hidden.bs.modal', function () {
      $('#iframePdf').attr('src', 'about:blank');
      $(this).remove();
   });

   myModal.show();
}

const activarLoad = (mensajeInicial) => {
  $('#modalLoading').modal('show');
  $('#mensajeLoading').html(mensajeInicial);
}

const closeLoad = (mensajeFinal) => {
   $('#mensajeLoading').html(mensajeFinal);
   setTimeout(() => {
      $('#modalLoading').modal('hide');
   }, 500);  
}

window.obtener_resultados_cliente  = obtener_resultados_cliente;
window.buscar_ordenes_arr_paciente = buscar_ordenes_arr_paciente;
window.ModalViewerResultadosFolio  = ModalViewerResultadosFolio;
window.valida_aceptacion_aviso     = valida_aceptacion_aviso;
window.acepta_aviso_privacidad     = acepta_aviso_privacidad;
window.ModalAvisoIntegral          = ModalAvisoIntegral;