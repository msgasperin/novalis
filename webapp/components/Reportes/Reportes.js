import { genera_reporte } from "./ReportesServices.js";

let arrReporte = [];

const TabReportes = () => {
   let html = `
   <div class="row">
      <div class="col-12 mt-2 mb-2">
         <div class="fs-4"><i class="bi bi-bar-chart-line-fill"></i> Módulo de Reportes</div>
         <p class="text-muted small mb-0">Seleccione el reporte que desea consultar para generar indicadores operativos y financieros.</p>
      </div>
   </div>

   <!-- SECCIÓN: FINANCIEROS Y CAJAS -->
   <div class="row mt-2">
      <div class="col-12">
         <h6 class="text-secondary fw-bold text-uppercase fs-7 border-bottom pb-2">
            <i class="bi bi-cash-stack me-1"></i> Financieros, Cajas y Cobranza
         </h6>
      </div>

      <!-- Auditoría de Cortes de Caja (Aprovecha caja_sesiones) -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('cortes_caja', 'Auditoría de Cortes de Caja', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes" style="width: 50px; height: 50px;">
                     <i class="bi bi-cash-coin text-success fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Cortes y Arqueos de Caja</h5>
                  <p class="card-text text-muted small mb-0">
                     Revisión de cierres de caja, montos declarados vs sistema y control de diferencias (faltantes/sobrantes).
                  </p>
               </div>
            </div>
         </div>
      </div>

      <!-- Flujo de Operación y Pagos -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('flujo_operacion', 'Flujo de Operación y Movimientos', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes" style="width: 50px; height: 50px;">
                     <i class="bi bi-wallet2 text-info fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Flujo Operativo de Dinero</h5>
                  <p class="card-text text-muted small mb-0">
                     Ingresos por cobro de estudios (orden_pagos) sumados/restados con movimientos manuales de caja.
                  </p>
               </div>
            </div>
         </div>
      </div>

      <!-- Cuentas por Cobrar (Saldos Deudores) -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('saldos_deudores', 'Cuentas por Cobrar', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes" style="width: 50px; height: 50px;">
                     <i class="bi bi-exclamation-triangle-fill text-danger fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Cuentas por Cobrar</h5>
                  <p class="card-text text-muted small mb-0">
                     Órdenes con saldo deudor pendiente de liquidar filtrado por paciente, sucursal o convenio.
                  </p>
               </div>
            </div>
         </div>
      </div>
   </div>

   <!-- SECCIÓN: OPERATIVOS Y COMERCIALES -->
   <div class="row mt-3">
      <div class="col-12">
         <h6 class="text-secondary fw-bold text-uppercase fs-7 border-bottom pb-2">
            <i class="bi bi-graph-up-arrow me-1"></i> Operativos y Análisis Comercial
         </h6>
      </div>

      <!-- Estudios Más Solicitados y Utilidad -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('estudios_solicitados', 'Estudios y Demanda', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes" style="width: 50px; height: 50px;">
                     <i class="bi bi-journal-medical text-primary fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Estudios y Rentabilidad</h5>
                  <p class="card-text text-muted small mb-0">
                     Top de estudios/paquetes más vendidos, volumen demandado y margen de utilidad calculado.
                  </p>
               </div>
            </div>
         </div>
      </div>

      <!-- Rendimiento por Convenios -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('rendimiento_convenios', 'Rendimiento de Convenios', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes" style="width: 50px; height: 50px;">
                     <i class="bi bi-building-check text-warning fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Rendimiento Convenios</h5>
                  <p class="card-text text-muted small mb-0">
                     Análisis de volumen de órdenes y facturación aportada por empresas y convenios.
                  </p>
               </div>
            </div>
         </div>
      </div>

      <!-- Análisis Demográfico de Pacientes -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('demografia_pacientes', 'Demografía de Pacientes', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes" style="width: 50px; height: 50px;">
                     <i class="bi bi-people-fill text-secondary fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Análisis de Pacientes</h5>
                  <p class="card-text text-muted small mb-0">
                     Estadísticas de atención agrupadas por rangos de edad, sexo y pacientes recurrentes.
                  </p>
               </div>
            </div>
         </div>
      </div>

      <!-- Descuentos y Cancelaciones -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('descuentos_cancelaciones', 'Auditoría de Descuentos y Cancelaciones', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-dark bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes" style="width: 50px; height: 50px;">
                     <i class="bi bi-shield-slash-fill text-dark fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Auditoría y Cancelaciones</h5>
                  <p class="card-text text-muted small mb-0">
                     Supervisión de descuentos aplicados, cargos extra y análisis de motivos de cancelación.
                  </p>
               </div>
            </div>
         </div>
      </div>
   </div>`;

   $('#containerMain').html(html);   
}

const ModalVisualizacionReporte = (tipoReporte, tituloReporte, idTipo) => {
   
   let html = 
   `<div class="modal fade" id="modalReporteVisualizacion" tabindex="-1" aria-labelledby="modalReporteVisualizacion" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content border-0 shadow-lg">
            
            <!-- HEADER DEL MODAL -->
            <div class="modal-header bg-light">
               <div class="d-flex align-items-center">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                     <i class="bi bi-file-earmark-bar-graph text-primary fs-4"></i>
                  </div>
                  <div>
                     <h5 class="modal-title fw-bold text-dark mb-0" id="modalReporteLabel">${tituloReporte}</h5>
                     <small class="text-muted fs-7">Filtre los parámetros para consultar la información requerida</small>
                  </div>
               </div>
            </div>

            <!-- CUERPO DEL MODAL -->
            <div class="modal-body">
               
               <!-- BARRA DE FILTROS -->
               <div class="card border-0 bg-light mb-3">
                  <div class="card-body p-3">
                    
                     <input type="hidden" id="reporte_tipo_key" value="${tipoReporte}">
                     
                     <div class="row g-2 align-items-end">
                        
                        <!-- Rango de Fechas (Inicio) -->
                        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                           <label for="filtro_fecha_inicio" class="form-label small fw-bold mb-1">Fecha Inicio</label>
                           <div class="input-group input-group-sm">
                              <span class="input-group-text bg-white"><i class="bi bi-calendar-event"></i></span>
                              <input type="date" class="form-control" id="filtro_fecha_inicio" name="filtro_fecha_inicio" value="${fecActual}">
                           </div>
                        </div>

                        <!-- Rango de Fechas (Fin) -->
                        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                           <label for="filtro_fecha_fin" class="form-label small fw-bold mb-1">Fecha Fin</label>
                           <div class="input-group input-group-sm">
                              <span class="input-group-text bg-white"><i class="bi bi-calendar-event-fill"></i></span>
                              <input type="date" class="form-control" id="filtro_fecha_fin" name="filtro_fecha_fin" value="${fechaRangoAdelante}">
                           </div>
                        </div>

                        <!-- Selector de Sucursal -->
                        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                           <label for="filtro_sucursal_id" class="form-label small fw-bold mb-1">Sucursal</label>
                           <div class="input-group input-group-sm">
                              <span class="input-group-text bg-white"><i class="bi bi-building"></i></span>
                              <select class="form-select" id="filtro_sucursal_id" name="filtro_sucursal_id">
                                 <option value="TODAS">Todas las Sucursales</option>
                                 <!-- Opciones cargadas dinámicamente -->
                              </select>
                           </div>
                        </div>

                        <!-- Botón Generar / Consultar -->
                        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                           <button type="button" class="btn btn-secondary btn-lib btn-redondo btn-sm w-100 fw-bold" id="btnGeneraReporte" onclick="generar_reporte('${idTipo}');">
                              <i class="bi bi-search me-1"></i> Generar Reporte
                           </button>
                        </div>

                     </div>
                     
                  </div>
               </div>

               <!-- CONTENEDOR DE RESULTADOS (TABLA / GRÁFICAS) -->
               <div id="containerResultadosReporte" class="mt-3">
                  <div class="text-center py-5 text-muted">
                     <i class="bi bi-funnel fs-1 d-block mb-2 text-secondary"></i>
                     <p class="mb-0 fs-6">Seleccione los filtros de búsqueda y haga clic en <strong>"Generar Reporte"</strong>.</p>
                  </div>
               </div>

            </div>

            <!-- PIE DEL MODAL (BOTONES DE ACCIÓN) -->
            <div class="modal-footer bg-light d-flex justify-content-between align-items-center">
               
               <div class="btn-group btn-group-sm" role="group">
                  <button type="button" class="btn btn-outline-success" id="btnExportarExcel" disabled>
                     <i class="bi bi-file-earmark-excel me-1"></i> Excel
                  </button>
                  <button type="button" class="btn btn-outline-danger" id="btnExportarPDF" disabled>
                     <i class="bi bi-file-earmark-pdf me-1"></i> PDF
                  </button>
                  <button type="button" class="btn btn-outline-secondary" id="btnImprimirReporte" disabled>
                     <i class="bi bi-printer me-1"></i> Imprimir
                  </button>
               </div>

               <button type="button" class="btn btn-outline-secondary btn-redondo btn-sm px-4" data-bs-dismiss="modal">
                  Cerrar ventana
               </button>

            </div>

         </div>
      </div>
   </div>`;
  
   $('#modalAdmin').html(html);
   $('#modalReporteVisualizacion').modal('show');

   combo_listas_sucursales('filtro_sucursal_id');
}

const generar_reporte = async (idTipo) => {
   let fechaIni   = $('#filtro_fecha_inicio').val().trim();
   let fechaFin   = $('#filtro_fecha_fin').val().trim();
   let idSucursal = $('#filtro_sucursal_id').val().trim();
   let html       = '';
   arrReporte     = [];
   
   if (idTipo == '' || parseInt(idTipo) == 0) {
      ToastColor.fire({
         text: '¡Atención! Falta un parámetro importante, recarga la página para volver a intentarlo',
         icon: 'warning'
      });
      return;
   }
   else if (fechaIni === '' || fechaFin === '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el rango de fechas para la consulta',
         icon: 'warning'
      });
      $('#filtro_fecha_inicio').focus();
      return;
   }
   
   $('#btnGeneraReporte').prop('disabled', true);
   let respuesta = await genera_reporte(idTipo, idSucursal, fechaIni, fechaFin);

   if (respuesta.estatus == 403) {
      fnNoSesion();
      $('#btnGeneraReporte').prop('disabled', false);
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrió un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGeneraReporte').prop('disabled', false);
      return;
   }
   else if (!respuesta.data || respuesta.data.length == 0) {
      html = 
      `<div class="text-center py-5 text-muted">
         <i class="bi bi-calendar-x fs-1 d-block mb-2 text-danger"></i>
         <p class="mb-0 fs-6">No se encontraron cortes de caja en el rango de fechas seleccionado.</p>   
      </div>`;
      $('#containerResultadosReporte').html(html);
      $('#btnGeneraReporte').prop('disabled', false);
      return;
   }
   else {
      arrReporte = await respuesta.data;
      $('#btnGeneraReporte').prop('disabled', false);

      if(idTipo == 1) {
         pintar_reporte_cortes_caja(arrReporte);
      }
   }
}

const pintar_reporte_cortes_caja = (data) => {
   
   let html = 
   `<div class="table-responsive" style="max-height: 550px;">
      <table class="table table-hover align-middle mb-0 border">
         <thead class="table-light sticky-top">
            <tr class="small text-uppercase text-muted">
               <th class="ps-3 py-2">Sesión / Cajero</th>
               <th class="py-2 text-end">Esperado (Sistema)</th>
               <th class="py-2 text-end">Declarado (Cajero)</th>
               <th class="py-2 text-end">Diferencia Efec.</th>
            </tr>
         </thead>
         <tbody>`;

            data.forEach(row => {

               let badgeDifEfectivo = '';
               let diferencia = row.diferencia ?? 0;

               if (diferencia == 0) {
                  badgeDifEfectivo = `<span class="badge bg-success bg-opacity-10 text-success fw-bold fs-7">$0.00 (Cuadre)</span>`;
               } else if (row.diferencia < 0) {
                  badgeDifEfectivo = `<span class="badge bg-danger bg-opacity-10 text-danger fw-bold fs-7">-$${diferencia} (Faltante)</span>`;
               } else {
                  badgeDifEfectivo = `<span class="badge bg-warning bg-opacity-10 text-warning fw-bold fs-7">+$${diferencia} (Sobrante)</span>`;
               }

               html += 
               `<tr>
                  <!-- Identificación de la sesión -->
                  <td class="ps-3 py-2">
                     <div class="d-flex align-items-center">
                        <div>
                           <span class="fw-bold text-dark">Caja #${row.id_caja}</span>
                           <span class="badge ${row.estatus == 'cerrada' ? 'bg-secondary' : 'bg-success'} ms-1 fs-8">${row.estatus}</span>
                           <small class="d-block text-dark fw-semibold fs-7"><i class="bi bi-person me-1"></i>${row.usuario_registro ?? 'Cajero'}</small>
                           <small class="d-block text-muted fs-8"><i class="bi bi-clock me-1"></i>${row.fecha_apertura} - ${row.fecha_cierre ?? 'En curso'}</small>
                           ${row.observaciones ? `<small class="d-block text-secondary fst-italic fs-8 text-truncate" style="max-width: 220px;" title="${row.observaciones}"><i class="bi bi-chat-left-text me-1"></i>${row.observaciones}</small>` : ''}
                        </div>
                     </div>
                  </td>
                  
                  <!-- Esperado con desglose por método de pago -->
                  <td class="py-2 text-end align-middle">
                     <span class="fw-bold text-dark">$${row.total_esperado_sistema}</span>
                     <div class="lh-sm mt-1 fs-8">
                        <span class="text-muted d-block">
                           <b>Fondo inicial: $${row.fondo_inicial}</b>
                        </span>
                        <span class="text-muted d-block">
                           Efec: $${row.sistema_efectivo} | Tarj: $${row.sistema_tarjeta}
                        </span>
                        <span class="text-muted d-block">
                           Transf: $${row.sistema_transferencia}
                        </span>
                        ${row.sistema_ingresos > 0 ? `<span class="text-success fw-semibold">Ingres: +$${row.sistema_ingresos}</span>` : ''}
                        ${row.sistema_egresos > 0 ? `<span class="text-danger ms-2 fw-semibold">Egres: -$${row.sistema_egresos}</span>` : ''}
                     </div>
                  </td>

                  <!-- Declarado por el usuario en el corte -->
                  <td class="py-2 text-end align-middle">
                     <span class="fw-bold text-dark">$${row.total_declarado}</span>
                     <div class="lh-sm mt-1 fs-8">
                        <span class="text-muted d-block">Efec: $${row.declarado_efectivo ?? 0}</span>
                        <span class="text-muted d-block">Tarj: $${row.declarado_tarjeta ?? 0} | Transf: $${row.declarado_transferencia ?? 0}</span>
                     </div>
                  </td>

                  <!-- Badge visual de la Diferencia en Efectivo -->
                  <td class="py-2 text-end align-middle">
                     ${badgeDifEfectivo}
                  </td>

               </tr>`;
            });
            
            html +=
         `</tbody>
      </table>
   </div>`;

   $('#containerResultadosReporte').html(html);
   
   // Habilitar botones de exportación en el footer del modal
   $('#btnExportarExcel, #btnExportarPDF, #btnImprimirReporte').removeAttr('disabled');
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabReportes               = TabReportes;
window.ModalVisualizacionReporte = ModalVisualizacionReporte;
window.generar_reporte           = generar_reporte;