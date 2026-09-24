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
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('flujo_operacion', 'Flujo de Operación y Movimientos', 2);">
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
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('saldos_deudores', 'Cuentas por Cobrar', 3);">
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
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('estudios_solicitados', 'Estudios y Demanda', 4);">
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

      <!-- Rendimiento por Cliente -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('rendimiento_clientes', 'Rendimiento de Clientes', 5);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes" style="width: 50px; height: 50px;">
                     <i class="bi bi-building-check text-warning fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Rendimiento Clientes</h5>
                  <p class="card-text text-muted small mb-0">
                     Análisis de volumen de órdenes y facturación aportada por empresas, doctores y clientes.
                  </p>
               </div>
            </div>
         </div>
      </div>

      <!-- Análisis Demográfico de Pacientes -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('demografia_pacientes', 'Demografía de Pacientes', 6);">
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
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('descuentos_cancelaciones', 'Auditoría de Descuentos y Cancelaciones', 7);">
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
   `<div class="modal fade" id="modalReporteVisualizacion" tabindex="-1" aria-labelledby="modalReporteVisualizacion" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
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
                        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6">
                           <label for="filtro_fecha_inicio" class="form-label small fw-bold mb-1">Fecha Inicio</label>
                           <div class="input-group input-group-sm">
                              <span class="input-group-text bg-white"><i class="bi bi-calendar-event"></i></span>
                              <input type="date" class="form-control" id="filtro_fecha_inicio" name="filtro_fecha_inicio" value="${fecActual}">
                           </div>
                        </div>

                        <!-- Rango de Fechas (Fin) -->
                        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6">
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

            <div class="modal-footer bg-light">
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
   let fechaIni       = $('#filtro_fecha_inicio').val().trim();
   let fechaFin       = $('#filtro_fecha_fin').val().trim();
   let idSucursal     = $('#filtro_sucursal_id').val().trim();
   let nombreSucursal = $('#filtro_sucursal_id option:selected').text().trim();
   let nomEmpresa     = $('#nomEmpresa').val().trim();

   idSucursal == 0 ? nombreSucursal = 'Todas las sucursales' : nombreSucursal;

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

      switch (parseInt(idTipo)) {
         case 1:
            pintar_reporte_cortes_caja(arrReporte, nombreSucursal, nomEmpresa);   
         break;

         case 2:
            pintar_reporte_flujo_operativo(arrReporte, nombreSucursal, nomEmpresa);  
         break;

         case 3:
            pintar_reporte_cuentas_por_cobrar(arrReporte, nombreSucursal, nomEmpresa);
         break;

         case 4:
            pintar_reporte_estudios_rentabilidad(arrReporte, nombreSucursal, nomEmpresa);
         break;

         case 5:
            pintar_reporte_rendimiento_convenios(arrReporte, nombreSucursal, nomEmpresa);
         break;

         case 6:
            pintar_reporte_analisis_pacientes(arrReporte, nombreSucursal, nomEmpresa);
         break;

         case 7:
            pintar_reporte_auditoria_cancelaciones(arrReporte, nombreSucursal, nomEmpresa);
         break;
      
         default:
            showMessageSwalTimer('Ocurrió un error: ', 'Tipo de reporte no identificado', 'error', 2500);
         break;
      }

   }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CORTES Y ARQUEOS DE CAJA +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const pintar_reporte_cortes_caja = (data, nombreSucursal, nomEmpresa) => {   
   let html = 
   `<div class="table-responsive" style="max-height: 550px;">
      <table class="table table-hover align-middle mb-0 border">
         <thead class="table-light sticky-top">
            <tr class="small text-uppercase text-muted">
               <th class="ps-3 py-2">Sesión / Cajero / Sucursal</th>
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
                           <span class="fw-bold text-dark">Suc: ${row.sucursal}</span>
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
   </div>
   <div class="btn-group btn-group-sm mt-2" role="group">
      <button type="button" class="btn btn-outline-success" id="btnExportarExcel" onclick="exportar_caja_excel('${nombreSucursal}', '${nomEmpresa}');">
         <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
      <button type="button" class="btn btn-outline-danger" id="btnExportarPDF" onclick="exportar_caja_pdf('${nombreSucursal}', '${nomEmpresa}');">
         <i class="bi bi-file-earmark-pdf me-1"></i> PDF
      </button>
   </div>`;

   $('#containerResultadosReporte').html(html);
}

const exportar_caja_excel = (nombreSucursal, nomEmpresa) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({
         text: 'No hay datos disponibles para exportar',
         icon: 'warning'
      });
      return;
   }

   // 1. Mapeamos la data global a una estructura limpia con nombres de columnas amigables
   let datosExcel = arrReporte.map(row => {
      let dif = parseFloat(row.diferencia ?? 0);
      let estadoDif = dif === 0 ? 'Cuadre' : (dif < 0 ? 'Faltante' : 'Sobrante');

      return {
         'Caja ID': row.id_caja,
         'Estatus': row.estatus,
         'Sucursal': row.sucursal,
         'Cajero': row.usuario_registro ?? 'N/A',
         'Apertura': row.fecha_apertura ?? '',
         'Cierre': row.fecha_cierre ?? 'En curso',
         'Fondo Inicial ($)': parseFloat(row.fondo_inicial ?? 0),
         'Esp. Efectivo ($)': parseFloat(row.sistema_efectivo ?? 0),
         'Esp. Tarjeta ($)': parseFloat(row.sistema_tarjeta ?? 0),
         'Esp. Transf ($)': parseFloat(row.sistema_transferencia ?? 0),
         'Total Esperado ($)': parseFloat(row.total_esperado_sistema ?? 0),
         'Decl. Efectivo ($)': parseFloat(row.declarado_efectivo ?? 0),
         'Decl. Tarjeta ($)': parseFloat(row.declarado_tarjeta ?? 0),
         'Decl. Transf ($)': parseFloat(row.declarado_transferencia ?? 0),
         'Total Declarado ($)': parseFloat(row.total_declarado ?? 0),
         'Diferencia ($)': dif,
         'Estado Auditoría': estadoDif,
         'Observaciones': row.observaciones ?? ''
      };
   });

   // 2. Crear hoja de trabajo y libro
   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Corte_"+nombreSucursal);

   // 3. Generar archivo con fecha actual en el nombre
   let fechaHoy = new Date().toISOString().split('T')[0];
   XLSX.writeFile(workbook, `Rep_Cortes_Caja_${fechaHoy}.xlsx`);
};

const exportar_caja_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({
         text: 'No hay datos disponibles para exportar',
         icon: 'warning'
      });
      return;
   }

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('landscape', 'mm', 'a4'); // Orientación horizontal para mayor espacio

   // Encabezado del PDF
   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Reporte de Auditoría y Cortes de Caja - " + nombreSucursal, 14, 20);   
   
   doc.setFontSize(9);
   doc.setTextColor(100);
   let fechaStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
   doc.text(`Fecha de emisión: ${fechaStr}`, 14, 25);

   // Estructurar filas para autoTable
   let bodyTable = arrReporte.map(row => [
      `Caja #${row.id_caja}\n${row.usuario_registro ?? 'Cajero'}`,
      row.sucursal,
      `${row.fecha_apertura}\n${row.fecha_cierre ?? 'En curso'}`,
      `$${parseFloat(row.fondo_inicial ?? 0).toFixed(2)}`,
      `$${parseFloat(row.total_esperado_sistema ?? 0).toFixed(2)}`,
      `$${parseFloat(row.total_declarado ?? 0).toFixed(2)}`,
      `$${parseFloat(row.diferencia ?? 0).toFixed(2)}`
   ]);

   doc.autoTable({
      startY: 30,
      head: [['Caja / Cajero', 'Sucursal', 'Apertura / Cierre', 'Fondo Inicial', 'Total Esperado', 'Total Declarado', 'Diferencia']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [33, 37, 41], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
         2: { halign: 'right' },
         3: { halign: 'right' },
         4: { halign: 'right' },
         5: { halign: 'right', fontStyle: 'bold' }
      }
   });

   let fechaHoy = new Date().toISOString().split('T')[0];
   doc.save(`Reporte_Cortes_Caja_${fechaHoy}.pdf`);
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FLUJO OPERATIVO DE DINERO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const pintar_reporte_flujo_operativo = (data, nombreSucursal, nomEmpresa) => {
   let html = '';
   let totalIngresos = 0;
   let totalEgresos  = 0;
   let saldoNeto     = 0;

   // 1. Calculamos totales generales
   data.forEach(row => {
      let monto = parseFloat(row.monto ?? 0);
      if (row.tipo_movimiento === 'INGRESO') {
         totalIngresos += monto;
      } else if (row.tipo_movimiento === 'EGRESO') {
         totalEgresos += monto;
      }
   });

   saldoNeto = totalIngresos - totalEgresos;

   // 2. Tarjetas de Resumen Financiero KPI
   html += 
   `<div class="row g-2 mb-3">
      <div class="col-12 col-md-4">
         <div class="card border-0 bg-success bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-success fw-bold small text-uppercase">Total Ingresos</span>
               <span class="fs-5 fw-bold text-success">+$${totalIngresos.toFixed(2)}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-4">
         <div class="card border-0 bg-danger bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-danger fw-bold small text-uppercase">Total Egresos</span>
               <span class="fs-5 fw-bold text-danger">-$${totalEgresos.toFixed(2)}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-4">
         <div class="card border-0 ${saldoNeto >= 0 ? 'bg-primary' : 'bg-warning'} bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block ${saldoNeto >= 0 ? 'text-primary' : 'text-warning'} fw-bold small text-uppercase">Flujo Neto Operativo</span>
               <span class="fs-5 fw-bold ${saldoNeto >= 0 ? 'text-primary' : 'text-warning'}">$${saldoNeto.toFixed(2)}</span>
            </div>
         </div>
      </div>
   </div>`;

   // 3. Tabla Detallada de Movimientos
   html += 
   `<div class="table-responsive" style="max-height: 480px;">
      <table class="table table-hover align-middle mb-0 border">
         <thead class="table-light sticky-top">
            <tr class="small text-uppercase text-muted">
               <th class="ps-3 py-2">Fecha / Hora / Sucursal</th>
               <th class="py-2">Origen / Concepto</th>
               <th class="py-2">Método Pago</th>
               <th class="py-2">Usuario</th>
               <th class="py-2 text-end pe-3">Monto</th>
            </tr>
         </thead>
         <tbody>`;
            data.forEach(row => {
               let esIngreso = row.tipo_movimiento === 'INGRESO';
               let badgeTipo = esIngreso 
                  ? `<span class="badge bg-success bg-opacity-10 text-success fw-bold fs-8">INGRESO</span>`
                  : `<span class="badge bg-danger bg-opacity-10 text-danger fw-bold fs-8">EGRESO</span>`;

               let badgeOrigen = row.origen === 'ORDEN_PAGO'
                  ? `<span class="badge bg-primary bg-opacity-10 text-primary fs-8 me-1"><i class="bi bi-receipt me-1"></i>Orden #${row.folio ?? row.referencia_id}</span>`
                  : `<span class="badge bg-secondary bg-opacity-10 text-secondary fs-8 me-1"><i class="bi bi-cash-stack me-1"></i>Manual (Caja #${row.caja_id})</span>`;

               let montoFormat = parseFloat(row.monto ?? 0).toFixed(2);

               html += 
               `<tr>
                  <!-- Fecha y Hora -->
                  <td class="ps-3 py-2">
                     <span class="d-block text-dark fw-semibold fs-7">${row.fecha_movimiento}</span>
                     <small class="text-muted fs-8">Caja #${row.caja_id}</small>
                     <small class="text-muted fs-8">Sucursal: ${row.sucursal}</small>
                  </td>

                  <!-- Origen y Concepto -->
                  <td class="py-2">
                     <div class="d-flex align-items-center mb-1">
                        ${badgeTipo}
                        <span class="ms-1">${badgeOrigen}</span>
                     </div>
                     <span class="d-block text-dark fs-7 fw-semibold text-truncate" style="max-width: 280px;" title="${row.concepto}">
                        ${row.concepto}
                     </span>
                     ${row.paciente_nombre ? `<small class="d-block text-muted fs-8"><i class="bi bi-person me-1"></i>${row.paciente_nombre}</small>` : ''}
                  </td>

                  <!-- Forma / Método de Pago -->
                  <td class="py-2">
                     <span class="badge bg-light text-dark border fs-8 text-uppercase">${row.metodo_pago}</span>
                     ${row.referencia_pago ? `<small class="d-block text-muted fs-8">Ref: ${row.referencia_pago}</small>` : ''}
                  </td>

                  <!-- Usuario Registró -->
                  <td class="py-2">
                     <small class="text-dark fw-semibold fs-7 d-block"><i class="bi bi-person-badge me-1"></i>${row.usuario_registro ?? 'N/A'}</small>
                  </td>

                  <!-- Monto (Positivo / Negativo) -->
                  <td class="py-2 text-end pe-3 align-middle">
                     <span class="fw-bold fs-6 ${esIngreso ? 'text-success' : 'text-danger'}">
                        ${esIngreso ? '+' : '-'}$${montoFormat}
                     </span>
                  </td>
               </tr>`;
            });

            html += 
         `</tbody>
      </table>
   </div>
   <div class="btn-group btn-group-sm mt-2" role="group">
      <button type="button" class="btn btn-outline-success" id="btnExportarExcel" onclick="exportar_flujo_excel('${nombreSucursal}', '${nomEmpresa}');">
         <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
      <button type="button" class="btn btn-outline-danger" id="btnExportarPDF" onclick="exportar_flujo_pdf('${nombreSucursal}', '${nomEmpresa}');">
         <i class="bi bi-file-earmark-pdf me-1"></i> PDF
      </button>
   </div>`;

   $('#containerResultadosReporte').html(html);
};

const exportar_flujo_excel = (nombreSucursal, nomEmpresa) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({
         text: 'No hay datos disponibles para exportar',
         icon: 'warning'
      });
      return;
   }

   let datosExcel = arrReporte.map(row => {
      let esIngreso = row.tipo_movimiento === 'INGRESO';
      let monto = parseFloat(row.monto ?? 0);

      return {
         'Fecha / Hora': row.fecha_movimiento,
         'Sucursal': row.sucursal,
         'Caja ID': row.caja_id,
         'Tipo': row.tipo_movimiento,
         'Origen': row.origen,
         'Folio / Ref': row.folio ?? row.referencia_id ?? 'N/A',
         'Concepto': row.concepto,
         'Paciente / Cliente': row.paciente_nombre ?? 'N/A',
         'Método Pago': row.metodo_pago,
         'Referencia Pago': row.referencia_pago ?? '',
         'Usuario': row.usuario_registro ?? 'N/A',
         'Ingreso ($)': esIngreso ? monto : 0,
         'Egreso ($)': !esIngreso ? monto : 0,
         'Monto Neto ($)': esIngreso ? monto : -monto
      };
   });

   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Flujo_"+nombreSucursal);

   let fechaHoy = new Date().toISOString().split('T')[0];
   XLSX.writeFile(workbook, `Reporte_Flujo_Operativo_${fechaHoy}.xlsx`);
};

const exportar_flujo_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({
         text: 'No hay datos disponibles para exportar',
         icon: 'warning'
      });
      return;
   }

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('landscape', 'mm', 'a4');

   // Encabezado
   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Reporte de Flujo Operativo de Dinero (Ingresos vs Egresos) - " + nombreSucursal, 14, 20);

   doc.setFontSize(9);
   doc.setTextColor(100);
   let fechaStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
   doc.text(`Fecha de emisión: ${fechaStr}`, 14, 25);

   // Estructurar filas para autoTable
   let bodyTable = arrReporte.map(row => {
      let esIngreso = row.tipo_movimiento === 'INGRESO';
      let montoFormat = `${esIngreso ? '+' : '-'}$${parseFloat(row.monto ?? 0).toFixed(2)}`;

      return [
         row.fecha_movimiento,
         row.sucursal,
         `Caja #${row.caja_id}`,
         row.tipo_movimiento,
         row.concepto,
         row.metodo_pago,
         row.usuario_registro ?? 'N/A',
         montoFormat
      ];
   });

   doc.autoTable({
      startY: 30,
      head: [['Fecha / Hora', 'Sucursal', 'Caja', 'Tipo', 'Concepto / Origen', 'Método Pago', 'Usuario', 'Monto']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [33, 37, 41], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
         6: { halign: 'right', fontStyle: 'bold' }
      }
   });

   let fechaHoy = new Date().toISOString().split('T')[0];
   doc.save(`Reporte_Flujo_Operativo_${fechaHoy}.pdf`);
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CUENTAS POR COBRAR / SALDOS DEUDORES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const pintar_reporte_cuentas_por_cobrar = (data, nombreSucursal, nomEmpresa) => {
   let html = '';
   let totalTotalNeto    = 0;
   let totalAbonado      = 0;
   let totalPorCobrar    = 0;
   let totalCreditoEmp   = 0;
   let totalOrdenes      = 0;

   const ordenesDeudoras = data.filter(row => {
      let saldo = parseFloat(row.saldo_deudor ?? 0);
      let esCancelada = row.estatus === 'CANCELADA';
      let tieneEstatusCobro = ['PENDIENTE', 'PARCIAL', 'CREDITO_EMPRESA'].includes(row.estatus_pago);
      return (saldo > 0 || tieneEstatusCobro) && !esCancelada && row.estatus_pago !== 'PAGADO';
   });

   totalOrdenes = ordenesDeudoras.length;

   ordenesDeudoras.forEach(row => {
      let saldo = parseFloat(row.saldo_deudor ?? 0);
      totalTotalNeto += parseFloat(row.total_neto ?? 0);
      totalAbonado   += parseFloat(row.total_abonado ?? 0);
      totalPorCobrar += saldo;

      if (row.estatus_pago === 'CREDITO_EMPRESA') {
         totalCreditoEmp += saldo;
      }
   });

   html += 
   `<div class="row g-2 mb-3">
      <div class="col-12 col-md-4">
         <div class="card border-0 bg-secondary bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-secondary fw-bold small text-uppercase">Órdenes con Saldo</span>
               <span class="fs-5 fw-bold text-dark">${totalOrdenes}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-4">
         <div class="card border-0 bg-success bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-success fw-bold small text-uppercase">Total Facturado/Neto</span>
               <span class="fs-5 fw-bold text-success">$${totalTotalNeto.toFixed(2)}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-4">
         <div class="card border-0 bg-danger bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-danger fw-bold small text-uppercase">Total Por Cobrar</span>
               <span class="fs-5 fw-bold text-danger">$${totalPorCobrar.toFixed(2)}</span>
            </div>
         </div>
      </div>
   </div>`;

   html += 
   `<div class="table-responsive" style="max-height: 480px;">
      <table class="table table-hover align-middle mb-0 border">
         <thead class="table-light sticky-top">
            <tr class="small text-uppercase text-muted">
               <th class="ps-3 py-2">Orden / Fecha / Sucursal</th>
               <th class="py-2">Paciente</th>
               <th class="py-2">Estatus Pago / Convenio</th>
               <th class="py-2 text-end">Total Neto</th>
               <th class="py-2 text-end">Abonado</th>
               <th class="py-2 text-end pe-3">Saldo Deudor</th>
            </tr>
         </thead>
         <tbody>`;

         if (ordenesDeudoras.length === 0) {
            html += `<tr><td colspan="6" class="text-center py-4 text-muted">No hay cuentas por cobrar pendientes.</td></tr>`;
         } else {
            ordenesDeudoras.forEach(row => {
               let totalNetoFormat = parseFloat(row.total_neto ?? 0).toFixed(2);
               let abonadoFormat   = parseFloat(row.total_abonado ?? 0).toFixed(2);
               let saldoFormat     = parseFloat(row.saldo_deudor ?? 0).toFixed(2);
               
               let clienteNombre = row.paciente_nombre_historico ?? 'N/A';
               let convenioNombre = row.convenio_nombre_historico ? row.convenio_nombre_historico : 'Particular';

               // Renderizado dinámico de Badges de Estatus de Pago
               let badgeEstatusPago = '';
               switch (row.estatus_pago) {
                  case 'PENDIENTE':
                     badgeEstatusPago = `<span class="badge bg-danger bg-opacity-10 text-danger fw-bold fs-8 me-1">PENDIENTE</span>`;
                     break;
                  case 'PARCIAL':
                     badgeEstatusPago = `<span class="badge bg-warning bg-opacity-10 text-warning fw-bold fs-8 me-1">PARCIAL</span>`;
                     break;
                  case 'CREDITO_EMPRESA':
                     badgeEstatusPago = `<span class="badge bg-info bg-opacity-10 text-info fw-bold fs-8 me-1">CRÉDITO EMPRESA</span>`;
                     break;
                  default:
                     badgeEstatusPago = `<span class="badge bg-secondary bg-opacity-10 text-secondary fs-8 me-1">${row.estatus_pago}</span>`;
                     break;
               }

               html += 
               `<tr>
                  <!-- Orden y Fecha -->
                  <td class="ps-3 py-2">
                     <span class="badge bg-primary bg-opacity-10 text-primary fs-8 me-1">
                        <i class="bi bi-receipt me-1"></i>Folio #${row.folio ?? row.id_folio}
                     </span>
                     <small class="d-block text-muted fs-8 mt-1">Cap: ${row.fecha_cap ?? 'N/A'}</small>
                     <small class="d-block text-muted fs-8 mt-1">Sucursal: ${row.sucursal_historico ?? 'N/A'}</small>
                  </td>

                  <!-- Paciente / Datos generales -->
                  <td class="py-2">
                     <span class="d-block text-dark fs-7 fw-semibold text-truncate" style="max-width: 250px;" title="${clienteNombre}">
                        ${clienteNombre}
                     </span>
                     <small class="text-muted fs-8">
                        ${row.paciente_edad_registro ? row.paciente_edad_registro + ' años' : ''} 
                        ${row.paciente_sexo_historico ? '(' + row.paciente_sexo_historico + ')' : ''}
                     </small>
                  </td>

                  <!-- Estatus Pago & Convenio -->
                  <td class="py-2">
                     <div class="d-flex align-items-center mb-1">
                        ${badgeEstatusPago}
                     </div>
                     <span class="badge bg-light text-dark border fs-8 text-uppercase">${convenioNombre}</span>
                     ${row.requiere_factura == 1 ? '<small class="d-block text-primary fs-8 mt-1"><i class="bi bi-file-earmark-text me-1"></i>Req. Factura</small>' : ''}
                  </td>

                  <!-- Total Neto -->
                  <td class="py-2 text-end fw-semibold fs-7 text-dark">
                     $${totalNetoFormat}
                  </td>

                  <!-- Total Abonado -->
                  <td class="py-2 text-end fw-semibold fs-7 text-success">
                     $${abonadoFormat}
                  </td>

                  <!-- Saldo Deudor -->
                  <td class="py-2 text-end pe-3 align-middle">
                     <span class="fw-bold fs-6 text-danger">
                        $${saldoFormat}
                     </span>
                  </td>
               </tr>`;
            });
         }

         html += 
         `</tbody>
      </table>
   </div>
   <div class="btn-group btn-group-sm mt-2" role="group">
      <button type="button" class="btn btn-outline-success" id="btnExportarExcelCXC" onclick="exportar_cxc_excel('${nombreSucursal}', '${nomEmpresa}');">
         <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
      <button type="button" class="btn btn-outline-danger" id="btnExportarPDFCXC" onclick="exportar_cxc_pdf('${nombreSucursal}', '${nomEmpresa}');">
         <i class="bi bi-file-earmark-pdf me-1"></i> PDF
      </button>
   </div>`;

   $('#containerResultadosReporte').html(html);
};

const exportar_cxc_excel = (nombreSucursal, nomEmpresa) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({ text: 'No hay datos disponibles para exportar', icon: 'warning' });
      return;
   }

   let datosDeudores = arrReporte.filter(row => row.estatus !== 'CANCELADA' && row.estatus_pago !== 'PAGADO');

   if (datosDeudores.length === 0) {
      ToastColor.fire({ text: 'No existen saldos deudores para exportar', icon: 'info' });
      return;
   }

   let datosExcel = datosDeudores.map(row => {
      return {
         'Folio': row.folio ?? row.id_folio,
         'Fecha Captura': row.fecha_cap,
         'Sucursal': row.sucursal_historico,
         'Paciente': row.paciente_nombre_historico ?? 'N/A',
         'Edad': row.paciente_edad_registro ?? '',
         'Sexo': row.paciente_sexo_historico ?? '',
         'Tipo Cliente': row.tipo_cliente ?? 'N/A',
         'Convenio': row.convenio_nombre_historico ?? 'Particular',
         'Estatus Pago': row.estatus_pago,
         'Total Neto ($)': parseFloat(row.total_neto ?? 0),
         'Total Abonado ($)': parseFloat(row.total_abonado ?? 0),
         'Saldo Deudor ($)': parseFloat(row.saldo_deudor ?? 0),
         'Requiere Factura': row.requiere_factura == 1 ? 'SI' : 'NO'
      };
   });

   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "CXC_"+nombreSucursal);

   let fechaHoy = new Date().toISOString().split('T')[0];
   XLSX.writeFile(workbook, `Reporte_Cuentas_Por_Cobrar_${fechaHoy}.xlsx`);
};

const exportar_cxc_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({ text: 'No hay datos disponibles para exportar', icon: 'warning' });
      return;
   }

   let datosDeudores = arrReporte.filter(row => row.estatus !== 'CANCELADA' && row.estatus_pago !== 'PAGADO');

   if (datosDeudores.length === 0) {
      ToastColor.fire({ text: 'No existen saldos deudores para exportar', icon: 'info' });
      return;
   }

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('landscape', 'mm', 'a4');

   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Reporte de Cuentas por Cobrar (Saldos Deudores) - " + nombreSucursal, 14, 20);

   doc.setFontSize(9);
   doc.setTextColor(100);
   let fechaStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
   doc.text(`Fecha de emisión: ${fechaStr}`, 14, 25);

   let bodyTable = datosDeudores.map(row => {
      return [
         row.folio ?? row.id_folio,
         row.fecha_cap,
         row.sucursal_historico,
         row.paciente_nombre_historico ?? 'N/A',
         row.estatus_pago,
         row.convenio_nombre_historico ?? 'Particular',
         `$${parseFloat(row.total_neto ?? 0).toFixed(2)}`,
         `$${parseFloat(row.total_abonado ?? 0).toFixed(2)}`,
         `$${parseFloat(row.saldo_deudor ?? 0).toFixed(2)}`
      ];
   });

   doc.autoTable({
      startY: 30,
      head: [['Folio', 'Fecha Cap.', 'Sucursal', 'Paciente', 'Estatus Pago', 'Convenio / Cliente', 'Total Neto', 'Abonado', 'Saldo Deudor']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [180, 40, 40], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
         5: { halign: 'right' },
         6: { halign: 'right' },
         7: { halign: 'right', fontStyle: 'bold' }
      }
   });

   let fechaHoy = new Date().toISOString().split('T')[0];
   doc.save(`Reporte_Cuentas_Por_Cobrar_${fechaHoy}.pdf`);
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ REPORTES DE ESTUDIOS Y RENTABILIDAD  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const pintar_reporte_estudios_rentabilidad = (data, nombreSucursal, nomEmpresa) => {
   let html = '';
   let totalEstudiosVendidos = 0;
   let totalIngresosGenerados = 0;
   let totalCostosAcumulados  = 0;
   let totalUtilidadBruta    = 0;

   // 1. Calculamos totales generales del periodo
   data.forEach(row => {
      let cant    = parseInt(row.cantidad_vendida ?? 0);
      let ingreso = parseFloat(row.ingreso_total ?? 0);
      let costo   = parseFloat(row.costo_total ?? 0);
      let util    = parseFloat(row.utilidad_bruta ?? 0);

      totalEstudiosVendidos  += cant;
      totalIngresosGenerados += ingreso;
      totalCostosAcumulados  += costo;
      totalUtilidadBruta    += util;
   });

   let margenGlobal = totalIngresosGenerados > 0 
      ? ((totalUtilidadBruta / totalIngresosGenerados) * 100).toFixed(2) 
      : '0.00';

   // 2. Tarjetas KPI
   html += 
   `<div class="row g-2 mb-3">
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-primary bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-primary fw-bold small text-uppercase">Volumen Realizado</span>
               <span class="fs-5 fw-bold text-primary">${totalEstudiosVendidos.toLocaleString('es-MX')} <small class="fs-8">estudios</small></span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-dark bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-dark fw-bold small text-uppercase">Venta Bruta Total</span>
               <span class="fs-5 fw-bold text-dark">$${totalIngresosGenerados.toFixed(2)}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-success bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-success fw-bold small text-uppercase">Utilidad Total</span>
               <span class="fs-5 fw-bold text-success">$${totalUtilidadBruta.toFixed(2)}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-dark bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-dark fw-bold small text-uppercase">Margen Global</span>
               <span class="fs-5 fw-bold text-dark">${margenGlobal}%</span>
            </div>
         </div>
      </div>
   </div>`;

   // 3. Tabla Detallada
   html += 
   `<div class="table-responsive" style="max-height: 480px;">
      <table class="table table-hover align-middle mb-0 border">
         <thead class="table-light sticky-top">
            <tr class="small text-uppercase text-muted">
               <th class="ps-3 py-2"># Top</th>
               <th class="py-2">Estudio</th>
               <th class="py-2 text-center">Volumen</th>
               <th class="py-2 text-end">Ingreso Total</th>
               <th class="py-2 text-end">Costo Total</th>
               <th class="py-2 text-end">Utilidad</th>
               <th class="py-2 text-end pe-3">Margen %</th>
            </tr>
         </thead>
         <tbody>`;

         if (data.length === 0) {
            html += `<tr><td colspan="7" class="text-center py-4 text-muted">No se encontraron movimientos en este período.</td></tr>`;
         } else {
            data.forEach((row, index) => {
               let cantidad  = parseInt(row.cantidad_vendida ?? 0);
               let ingreso   = parseFloat(row.ingreso_total ?? 0);
               let costo     = parseFloat(row.costo_total ?? 0);
               let utilidad  = parseFloat(row.utilidad_bruta ?? 0);
               let margenPct = parseFloat(row.porcentaje_margen ?? 0);

               // Badge dinámico según porcentaje de rentabilidad
               let badgeMargen = '';
               if (margenPct >= 60) {
                  badgeMargen = `<span class="badge bg-success bg-opacity-10 text-success fw-bold fs-8">${margenPct.toFixed(1)}%</span>`;
               } else if (margenPct >= 30) {
                  badgeMargen = `<span class="badge bg-primary bg-opacity-10 text-primary fw-bold fs-8">${margenPct.toFixed(1)}%</span>`;
               } else {
                  badgeMargen = `<span class="badge bg-danger bg-opacity-10 text-danger fw-bold fs-8">${margenPct.toFixed(1)}%</span>`;
               }

               html += 
               `<tr>
                  <td class="ps-3 py-2">
                     <span class="fw-bold fs-7 text-muted">#${index + 1}</span>
                  </td>
                  <td class="py-2">
                     <span class="d-block text-dark fs-7 fw-semibold text-truncate" style="max-width: 320px;" title="${row.item_nombre}">
                        ${row.item_nombre}
                     </span>
                  </td>
                  <td class="py-2 text-center align-middle">
                     <span class="badge bg-secondary bg-opacity-10 text-dark fw-bold fs-7">
                        ${cantidad}
                     </span>
                  </td>
                  <td class="py-2 text-end fw-semibold fs-7 text-dark">
                     $${ingreso.toFixed(2)}
                  </td>
                  <td class="py-2 text-end text-muted fs-7">
                     $${costo.toFixed(2)}
                  </td>
                  <td class="py-2 text-end fw-bold fs-7 ${utilidad >= 0 ? 'text-success' : 'text-danger'}">
                     $${utilidad.toFixed(2)}
                  </td>
                  <td class="py-2 text-end pe-3 align-middle">
                     ${badgeMargen}
                  </td>
               </tr>`;
            });
         }

         html += 
         `</tbody>
      </table>
   </div>
   <div class="btn-group btn-group-sm mt-2" role="group">
      <button type="button" class="btn btn-outline-success" onclick="exportar_rentabilidad_excel('${nombreSucursal}');">
         <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
      <button type="button" class="btn btn-outline-danger" onclick="exportar_rentabilidad_pdf('${nombreSucursal}', '${nomEmpresa}');">
         <i class="bi bi-file-earmark-pdf me-1"></i> PDF
      </button>
   </div>`;

   $('#containerResultadosReporte').html(html);
};

const exportar_rentabilidad_excel = (nombreSucursal) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({ text: 'No hay datos para exportar', icon: 'warning' });
      return;
   }

   let datosExcel = arrReporte.map((row, index) => {
      return {
         'Ranking': index + 1,
         'ID Estudio': row.estudio_id,
         'Estudio': row.item_nombre,
         'Cantidad Vendida': parseInt(row.cantidad_vendida ?? 0),
         'Precio Promedio ($)': parseFloat(row.precio_promedio ?? 0),
         'Ingreso Total ($)': parseFloat(row.ingreso_total ?? 0),
         'Costo Total ($)': parseFloat(row.costo_total ?? 0),
         'Utilidad Bruta ($)': parseFloat(row.utilidad_bruta ?? 0),
         'Margen (% )': parseFloat(row.porcentaje_margen ?? 0)
      };
   });

   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Rentabilidad");

   let fechaHoy = new Date().toISOString().split('T')[0];
   XLSX.writeFile(workbook, `Reporte_Estudios_Rentabilidad_${nombreSucursal}_${fechaHoy}.xlsx`);
};

const exportar_rentabilidad_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({ text: 'No hay datos para exportar', icon: 'warning' });
      return;
   }

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('landscape', 'mm', 'a4');

   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Reporte de Demanda de Estudios y Rentabilidad - " + nombreSucursal, 14, 20);

   doc.setFontSize(9);
   doc.setTextColor(100);
   let fechaStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
   doc.text(`Fecha de emisión: ${fechaStr}`, 14, 25);

   let bodyTable = arrReporte.map((row, index) => [
      `#${index + 1}`,
      row.item_nombre,
      row.cantidad_vendida,
      `$${parseFloat(row.ingreso_total ?? 0).toFixed(2)}`,
      `$${parseFloat(row.costo_total ?? 0).toFixed(2)}`,
      `$${parseFloat(row.utilidad_bruta ?? 0).toFixed(2)}`,
      `${parseFloat(row.porcentaje_margen ?? 0).toFixed(1)}%`
   ]);

   doc.autoTable({
      startY: 30,
      head: [['#', 'Estudio', 'Volumen', 'Ingreso Total', 'Costo Total', 'Utilidad', 'Margen %']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [40, 116, 166], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
         2: { halign: 'center' },
         3: { halign: 'right' },
         4: { halign: 'right' },
         5: { halign: 'right', fontStyle: 'bold' },
         6: { halign: 'right', fontStyle: 'bold' }
      }
   });

   let fechaHoy = new Date().toISOString().split('T')[0];
   doc.save(`Reporte_Estudios_Rentabilidad_${fechaHoy}.pdf`);
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ REPORTES DE RENDIMIENTO DE CONVENIOS  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const pintar_reporte_rendimiento_convenios = (data, nombreSucursal, nomEmpresa) => {
   let html = '';
   let totalOrdenesGral     = 0;
   let totalSubtotalGral    = 0;
   let totalDescuentosGral  = 0;
   let totalFacturacionNeta = 0;
   let totalAbonadoGral     = 0;
   let totalSaldoDeudorGral = 0;
   let totalConvenios       = data.length;

   // 1. Acumulamos métricas globales
   data.forEach(row => {
      totalOrdenesGral     += parseInt(row.total_ordenes ?? 0);
      totalSubtotalGral    += parseFloat(row.subtotal_bruto ?? 0);
      totalDescuentosGral  += parseFloat(row.total_descuentos ?? 0);
      totalFacturacionNeta += parseFloat(row.facturacion_neta ?? 0);
      totalAbonadoGral     += parseFloat(row.total_recaudado ?? 0);
      totalSaldoDeudorGral += parseFloat(row.total_saldo_deudor ?? 0);
   });

   let ticketPromedioGral = totalOrdenesGral > 0 ? (totalFacturacionNeta / totalOrdenesGral).toFixed(2) : '0.00';

   // 2. Tarjetas KPI
   html += 
   `<div class="row g-2 mb-3">
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-primary bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-primary fw-bold small text-uppercase">Órdenes Atendidas</span>
               <span class="fs-5 fw-bold text-primary">${totalOrdenesGral.toLocaleString('es-MX')} <small class="fs-8">(${totalConvenios} convenios)</small></span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-success bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-success fw-bold small text-uppercase">Facturación Neta Aportada</span>
               <span class="fs-5 fw-bold text-success">$${totalFacturacionNeta.toFixed(2)}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-secondary bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-secondary text-darken-2 fw-bold small text-uppercase">Descuentos Ofertados</span>
               <span class="fs-5 fw-bold text-secondary text-darken-2">$${totalDescuentosGral.toFixed(2)}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-danger bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-danger fw-bold small text-uppercase">Saldo Deudor por Cobrar</span>
               <span class="fs-5 fw-bold text-danger">$${totalSaldoDeudorGral.toFixed(2)}</span>
            </div>
         </div>
      </div>
   </div>`;

   // 3. Tabla Detallada por Convenio / Empresa
   html += 
   `<div class="table-responsive" style="max-height: 480px;">
      <table class="table table-hover align-middle mb-0 border">
         <thead class="table-light sticky-top">
            <tr class="small text-uppercase text-muted">
               <th class="ps-3 py-2">#</th>
               <th class="py-2">Clientes</th>
               <th class="py-2 text-center">Órdenes</th>
               <th class="py-2 text-end">Subtotal Bruto</th>
               <th class="py-2 text-end">Cargo Extra</th>
               <th class="py-2 text-end">Descuentos</th>
               <th class="py-2 text-end">Facturación Neta</th>
               <th class="py-2 text-end">Cobrado</th>
               <th class="py-2 text-end">Saldo Deudor</th>
            </tr>
         </thead>
         <tbody>`;

         if (data.length === 0) {
            html += `<tr><td colspan="9" class="text-center py-4 text-muted">No se registraron órdenes por convenios en este período.</td></tr>`;
         } else {
            data.forEach((row, index) => {
                                                            
               let esParticular = (row.convenio_id == 0 || row.convenio_nombre.toUpperCase().includes('PARTICULAR'));

               let badgeConvenio = esParticular
                  ? `<span class="badge bg-secondary bg-opacity-10 text-secondary fs-8 me-1"><i class="bi bi-person me-1"></i>PARTICULAR</span>`
                  : `<span class="badge bg-primary bg-opacity-10 text-primary fs-8 me-1"><i class="bi bi-building me-1"></i>EMPRESA</span>`;

               html += 
               `<tr>
                  <td class="ps-3 py-2">
                     <span class="fw-bold fs-7 text-muted">#${index + 1}</span>
                  </td>
                  <td class="py-2">
                     <div class="d-flex align-items-center mb-1">
                        ${badgeConvenio}
                        ${row.ordenes_facturadas > 0 ? `<small class="text-muted fs-8"><i class="bi bi-receipt me-1"></i>${row.ordenes_facturadas} req. factura</small>` : ''}
                     </div>
                     <span class="d-block text-dark fs-7 fw-semibold text-truncate" style="max-width: 250px;" title="${row.convenio_nombre}">
                        ${row.convenio_nombre}
                     </span>
                  </td>
                  <td class="py-2 text-center align-middle">
                     <span class="badge bg-secondary bg-opacity-10 text-dark fw-bold fs-7">
                        ${row.total_ordenes}
                     </span>
                  </td>
                  <td class="py-2 text-end text-muted fs-7">
                     $${row.subtotal_bruto}
                  </td>
                  <td class="py-2 text-end text-muted fs-7">
                     $${row.cargo_extra}
                  </td>
                  <td class="py-2 text-end text-warning text-darken-2 fs-7 fw-semibold">
                     $${row.total_descuentos}
                  </td>
                  <td class="py-2 text-end fw-bold fs-7 text-dark">
                     $${row.facturacion_neta}
                  </td>
                  <td class="py-2 text-end text-success fs-7 fw-semibold">
                     $${row.total_recaudado}
                  </td>
                  <td class="py-2 text-end fs-7 fw-bold ${row.total_saldo_deudor > 0 ? 'text-danger' : 'text-muted'}">
                     $${row.total_saldo_deudor}
                  </td>
               </tr>`;
            });
         }

         html += 
         `</tbody>
      </table>
   </div>
   <div class="btn-group btn-group-sm mt-2" role="group">
      <button type="button" class="btn btn-outline-success" onclick="exportar_clientes_excel('${nombreSucursal}');">
         <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
      <button type="button" class="btn btn-outline-danger" onclick="exportar_clientes_pdf('${nombreSucursal}', '${nomEmpresa}');">
         <i class="bi bi-file-earmark-pdf me-1"></i> PDF
      </button>
   </div>`;

   $('#containerResultadosReporte').html(html);
};

const exportar_clientes_excel = (nombreSucursal) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({ text: 'No hay datos para exportar', icon: 'warning' });
      return;
   }

   let datosExcel = arrReporte.map((row, index) => {
      return {
         '#': index + 1,
         'ID Convenio': row.convenio_id,
         'Convenio / Empresa': row.convenio_nombre,
         'Total Órdenes': row.total_ordenes,
         'Subtotal Bruto ($)': row.subtotal_bruto,
         'Cargo Extra ($)': row.cargo_extra,
         'Descuentos ($)': row.total_descuentos,
         'Facturación Neta ($)': row.facturacion_neta,
         'Total Recaudado ($)': row.total_recaudado,
         'Saldo Deudor ($)': row.total_saldo_deudor,
         'Órdenes que Req. Factura': row.ordenes_facturada
      };
   });

   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Convenios");

   let fechaHoy = new Date().toISOString().split('T')[0];
   XLSX.writeFile(workbook, `Reporte_Rendimiento_Convenios_${nombreSucursal}_${fechaHoy}.xlsx`);
};

const exportar_clientes_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrReporte || arrReporte.length === 0) {
      ToastColor.fire({ text: 'No hay datos para exportar', icon: 'warning' });
      return;
   }

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('landscape', 'mm', 'a4');

   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Reporte de Rendimiento y Facturación por Convenio - " + nombreSucursal, 14, 20);

   doc.setFontSize(9);
   doc.setTextColor(100);
   let fechaStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
   doc.text(`Fecha de emisión: ${fechaStr}`, 14, 25);

   let bodyTable = arrReporte.map((row, index) => [
      `#${index + 1}`,
      row.convenio_nombre,
      row.total_ordenes,
      `$${row.subtotal_bruto}`,
      `$${row.cargo_extra}`,
      `$${row.total_descuentos}`,
      `$${row.facturacion_neta}`,
      `$${row.total_recaudado}`,
      `$${row.total_saldo_deudor}`,
   ]);

   doc.autoTable({
      startY: 30,
      head: [['#', 'Convenio / Empresa', 'Órdenes', 'Subtotal', 'Cargo Extra', 'Descuentos', 'Fact. Neta', 'Recaudado', 'Saldo Deudor', 'Ticket Prom.']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [40, 116, 166], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
         2: { halign: 'center' },
         3: { halign: 'right' },
         4: { halign: 'right' },
         5: { halign: 'right', fontStyle: 'bold' },
         6: { halign: 'right' },
         7: { halign: 'right', fontStyle: 'bold' },
         8: { halign: 'right' }
      }
   });

   let fechaHoy = new Date().toISOString().split('T')[0];
   doc.save(`Reporte_Rendimiento_Convenios_${fechaHoy}.pdf`);
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ REPORTES DE ANÁLISIS DE PACIENTES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let arrDemografiaGlobal  = [];
let arrRecurrenciaGlobal = [];

const pintar_reporte_analisis_pacientes = (data, nombreSucursal, nomEmpresa) => {
   arrDemografiaGlobal  = data.demografia ?? [];
   arrRecurrenciaGlobal = data.recurrencia ?? [];

   let html = '';

   // 1. Métricas globales a partir de pacientes únicos en el periodo
   let totalAtenciones = 0;
   let totalPacientesUnicos = arrRecurrenciaGlobal.length;
   let pacientesRecurrentes = 0; // Pacientes con > 1 visita
   let totalIngresos = 0;

   arrRecurrenciaGlobal.forEach(p => {
      let visitas = parseInt(p.total_visitas ?? 0);
      let gasto   = parseFloat(p.gasto_total ?? 0);

      totalAtenciones += visitas;
      totalIngresos   += gasto;
      if (visitas > 1) {
         pacientesRecurrentes++;
      }
   });

   let tasaRecurrencia = totalPacientesUnicos > 0 
      ? ((pacientesRecurrentes / totalPacientesUnicos) * 100).toFixed(1) 
      : '0.0';

   // 2. Tarjetas KPI ejecutivas
   html += 
   `<div class="row g-2 mb-3">
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-primary bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-primary fw-bold small text-uppercase">Total de Atenciones</span>
               <span class="fs-5 fw-bold text-primary">${totalAtenciones.toLocaleString('es-MX')}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-info bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-info fw-bold small text-uppercase">Pacientes Únicos</span>
               <span class="fs-5 fw-bold text-info">${totalPacientesUnicos.toLocaleString('es-MX')}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-success bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-success fw-bold small text-uppercase">Pacientes Recurrentes</span>
               <span class="fs-5 fw-bold text-success">${pacientesRecurrentes.toLocaleString('es-MX')} <small class="fs-8">(${tasaRecurrencia}%)</small></span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-dark bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-dark fw-bold small text-uppercase">Gasto Prom. por Paciente</span>
               <span class="fs-5 fw-bold text-dark">$${(totalPacientesUnicos > 0 ? (totalIngresos / totalPacientesUnicos) : 0).toFixed(2)}</span>
            </div>
         </div>
      </div>
   </div>`;

   // 3. Pestañas de Navegación
   html += 
   `<ul class="nav nav-tabs nav-tabs-bordered mb-3" id="tabAnalisisPacientes" role="tablist">
      <li class="nav-item" role="presentation">
         <button class="nav-link active fw-semibold" id="demografia-tab" data-bs-toggle="tab" data-bs-target="#tab-demografia" type="button" role="tab">
            <i class="bi bi-people me-1"></i> Distribución por Sexo y Rangos de Edad
         </button>
      </li>
      <li class="nav-item" role="presentation">
         <button class="nav-link fw-semibold" id="recurrencia-tab" data-bs-toggle="tab" data-bs-target="#tab-recurrencia" type="button" role="tab">
            <i class="bi bi-arrow-repeat me-1"></i> Top Pacientes Recurrentes / Frecuentes
         </button>
      </li>
   </ul>

   <div class="tab-content" id="tabContentPacientes">
      <!-- TAB 1: DEMOGRAFÍA POR EDAD Y SEXO -->
      <div class="tab-pane fade show active" id="tab-demografia" role="tabpanel">
         <div class="table-responsive" style="max-height: 400px;">
            <table class="table table-hover align-middle mb-0 border">
               <thead class="table-light sticky-top">
                  <tr class="small text-uppercase text-muted">
                     <th class="ps-3 py-2">Rango de Edad</th>
                     <th class="py-2 text-center">Sexo</th>
                     <th class="py-2 text-center">Total Visitas</th>
                     <th class="py-2 text-center">Pacientes Únicos</th>
                     <th class="py-2 text-end pe-3">Monto Facturado</th>
                  </tr>
               </thead>
               <tbody>`;

               if (arrDemografiaGlobal.length === 0) {
                  html += `<tr><td colspan="5" class="text-center py-4 text-muted">No se encontraron datos demográficos en este período.</td></tr>`;
               } else {
                  arrDemografiaGlobal.forEach(row => {
                     let sexoUpper = (row.sexo ?? 'MASCULINO').toUpperCase();
                     let isFemenino = sexoUpper.includes('FEM') || sexoUpper === 'F';
                     
                     let badgeSexo = isFemenino
                        ? `<span class="badge bg-danger bg-opacity-10 text-danger fs-8"><i class="bi bi-gender-female me-1"></i>FEMENINO</span>`
                        : `<span class="badge bg-primary bg-opacity-10 text-primary fs-8"><i class="bi bi-gender-male me-1"></i>MASCULINO</span>`;

                     html += 
                     `<tr>
                        <td class="ps-3 py-2 fw-semibold text-dark fs-7">${row.rango_edad}</td>
                        <td class="py-2 text-center">${badgeSexo}</td>
                        <td class="py-2 text-center font-monospace fw-bold fs-7">${row.total_atenciones}</td>
                        <td class="py-2 text-center text-muted fs-7">${row.pacientes_unicos}</td>
                        <td class="py-2 text-end pe-3 fw-bold text-success fs-7">$${parseFloat(row.total_facturado ?? 0).toFixed(2)}</td>
                     </tr>`;
                  });
               }

               html += 
               `</tbody>
            </table>
         </div>

         <!-- Botones de Exportación Demografía -->
         <div class="btn-group btn-group-sm mt-3" role="group">
            <button type="button" class="btn btn-outline-success" onclick="exportar_demografia_excel('${nombreSucursal}');">
               <i class="bi bi-file-earmark-excel me-1"></i> Excel Demografía
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="exportar_demografia_pdf('${nombreSucursal}', '${nomEmpresa}');">
               <i class="bi bi-file-earmark-pdf me-1"></i> PDF Demografía
            </button>
         </div>
      </div>

      <!-- TAB 2: PACIENTES RECURRENTES -->
      <div class="tab-pane fade" id="tab-recurrencia" role="tabpanel">
         <div class="table-responsive" style="max-height: 400px;">
            <table class="table table-hover align-middle mb-0 border">
               <thead class="table-light sticky-top">
                  <tr class="small text-uppercase text-muted">
                     <th class="ps-3 py-2"># Top</th>
                     <th class="py-2">Paciente</th>
                     <th class="py-2 text-center">Sexo / Edad</th>
                     <th class="py-2 text-center">Nº Visitas</th>
                     <th class="py-2 text-end">Inversión Total</th>
                     <th class="py-2 text-end pe-3">Última Visita</th>
                  </tr>
               </thead>
               <tbody>`;

               if (arrRecurrenciaGlobal.length === 0) {
                  html += `<tr><td colspan="6" class="text-center py-4 text-muted">No se encontraron registros de pacientes en este período.</td></tr>`;
               } else {
                  arrRecurrenciaGlobal.forEach((p, index) => {
                     let visitas = parseInt(p.total_visitas ?? 0);
                     let esRecurrente = visitas > 1;

                     let badgeVisitas = esRecurrente
                        ? `<span class="badge bg-success bg-opacity-10 text-success fw-bold fs-7"><i class="bi bi-arrow-repeat me-1"></i>${visitas} visitas</span>`
                        : `<span class="badge bg-secondary bg-opacity-10 text-muted fs-7">1 visita</span>`;

                     html += 
                     `<tr>
                        <td class="ps-3 py-2 fw-bold text-muted fs-7">#${index + 1}</td>
                        <td class="py-2 fw-semibold text-dark fs-7">${p.paciente_nombre}</td>
                        <td class="py-2 text-center fs-8 text-muted">${p.sexo ?? ''} (${p.ultima_edad ?? ''})</td>
                        <td class="py-2 text-center">${badgeVisitas}</td>
                        <td class="py-2 text-end fw-bold text-dark fs-7">$${parseFloat(p.gasto_total ?? 0).toFixed(2)}</td>
                        <td class="py-2 text-end pe-3 fs-8 text-muted">${p.ultima_visita ? p.ultima_visita.substring(0, 10) : ''}</td>
                     </tr>`;
                  });
               }

               html += 
               `</tbody>
            </table>
         </div>

         <!-- Botones de Exportación Recurrencia -->
         <div class="btn-group btn-group-sm mt-3" role="group">
            <button type="button" class="btn btn-outline-success" onclick="exportar_recurrencia_excel('${nombreSucursal}');">
               <i class="bi bi-file-earmark-excel me-1"></i> Excel Pacientes Recurrentes
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="exportar_recurrencia_pdf('${nombreSucursal}', '${nomEmpresa}');">
               <i class="bi bi-file-earmark-pdf me-1"></i> PDF Pacientes Recurrentes
            </button>
         </div>
      </div>
   </div>`;

   $('#containerResultadosReporte').html(html);
};

const exportar_demografia_excel = (nombreSucursal) => {
   if (!arrDemografiaGlobal || arrDemografiaGlobal.length === 0) {
      ToastColor.fire({ text: 'No hay datos para exportar', icon: 'warning' });
      return;
   }

   let datosExcel = arrDemografiaGlobal.map(row => ({
      'Rango de Edad': row.rango_edad,
      'Sexo': row.sexo,
      'Total Visitas / Atención': parseInt(row.total_atenciones ?? 0),
      'Pacientes Únicos': parseInt(row.pacientes_unicos ?? 0),
      'Total Facturado ($)': parseFloat(row.total_facturado ?? 0)
   }));

   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Demografia_Pacientes");

   let fechaHoy = new Date().toISOString().split('T')[0];
   XLSX.writeFile(workbook, `Reporte_Demografia_Pacientes_${nombreSucursal}_${fechaHoy}.xlsx`);
};

const exportar_demografia_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrDemografiaGlobal || arrDemografiaGlobal.length === 0) {
      ToastColor.fire({ text: 'No hay datos para exportar', icon: 'warning' });
      return;
   }

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('portrait', 'mm', 'a4');

   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Análisis Demográfico de Pacientes - " + nombreSucursal, 14, 20);

   let bodyTable = arrDemografiaGlobal.map(row => [
      row.rango_edad,
      row.sexo,
      row.total_atenciones,
      row.pacientes_unicos,
      `$${parseFloat(row.total_facturado ?? 0).toFixed(2)}`
   ]);

   doc.autoTable({
      startY: 28,
      head: [['Rango de Edad', 'Sexo', 'Visitas', 'Pacientes Únicos', 'Monto Facturado']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [40, 116, 166], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
         2: { halign: 'center' },
         3: { halign: 'center' },
         4: { halign: 'right', fontStyle: 'bold' }
      }
   });

   let fechaHoy = new Date().toISOString().split('T')[0];
   doc.save(`Reporte_Demografia_Pacientes_${fechaHoy}.pdf`);
};

const exportar_recurrencia_excel = (nombreSucursal) => {
   if (!arrRecurrenciaGlobal || arrRecurrenciaGlobal.length === 0) {
      ToastColor.fire({ text: 'No hay datos para exportar', icon: 'warning' });
      return;
   }

   let datosExcel = arrRecurrenciaGlobal.map((p, index) => ({
      '# Top': index + 1,
      'ID Paciente': p.paciente_id,
      'Nombre Paciente': p.paciente_nombre,
      'Sexo': p.sexo,
      'Última Edad': p.ultima_edad,
      'Nº Visitas': parseInt(p.total_visitas ?? 0),
      'Inversión Total ($)': parseFloat(p.gasto_total ?? 0),
      'Ticket Promedio ($)': parseFloat(p.ticket_promedio ?? 0),
      'Primera Visita': p.primera_visita ? p.primera_visita.substring(0, 10) : '',
      'Última Visita': p.ultima_visita ? p.ultima_visita.substring(0, 10) : ''
   }));

   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes_Recurrentes");

   let fechaHoy = new Date().toISOString().split('T')[0];
   XLSX.writeFile(workbook, `Reporte_Pacientes_Recurrentes_${nombreSucursal}_${fechaHoy}.xlsx`);
};

const exportar_recurrencia_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrRecurrenciaGlobal || arrRecurrenciaGlobal.length === 0) {
      ToastColor.fire({ text: 'No hay datos para exportar', icon: 'warning' });
      return;
   }

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('landscape', 'mm', 'a4');

   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Top Pacientes Recurrentes y Frecuentes - " + nombreSucursal, 14, 20);

   let bodyTable = arrRecurrenciaGlobal.map((p, index) => [
      `#${index + 1}`,
      p.paciente_nombre,
      `${p.sexo ?? ''} (${p.ultima_edad ?? ''})`,
      p.total_visitas,
      `$${parseFloat(p.gasto_total ?? 0).toFixed(2)}`,
      `$${parseFloat(p.ticket_promedio ?? 0).toFixed(2)}`,
      p.ultima_visita ? p.ultima_visita.substring(0, 10) : ''
   ]);

   doc.autoTable({
      startY: 28,
      head: [['#', 'Paciente', 'Sexo / Edad', 'Visitas', 'Inversión Total', 'Ticket Prom.', 'Última Visita']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [40, 116, 166], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
         3: { halign: 'center', fontStyle: 'bold' },
         4: { halign: 'right', fontStyle: 'bold' },
         5: { halign: 'right' },
         6: { halign: 'center' }
      }
   });

   let fechaHoy = new Date().toISOString().split('T')[0];
   doc.save(`Reporte_Pacientes_Recurrentes_${fechaHoy}.pdf`);
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ REPORTES DE AUDITORÍA Y CANCELACIONES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let arrCancelacionesGlobal = [];
let arrDescuentosGlobal    = [];
let arrCargosExtraGlobal   = [];

const pintar_reporte_auditoria_cancelaciones = (data, nombreSucursal, nomEmpresa) => {
   let kpis = data.resumen_kpis ?? {};
   arrCancelacionesGlobal = data.cancelaciones ?? [];
   arrDescuentosGlobal    = data.top_descuentos ?? [];
   arrCargosExtraGlobal   = data.cargos_extra ?? [];

   let totalCreadas       = parseInt(kpis.total_ordenes_creadas ?? 0);
   let totalCanceladas    = parseInt(kpis.total_canceladas ?? 0);
   let montoCancelado     = parseFloat(kpis.monto_cancelado ?? 0);
   let totalDescuentos    = parseFloat(kpis.total_descuentos_otorgados ?? 0);
   let totalCargosExtra   = parseFloat(kpis.total_cargos_extra ?? 0);
   let subtotalBruto      = parseFloat(kpis.subtotal_bruto_activo ?? 0);

   let pctCancelacion = totalCreadas > 0 ? ((totalCanceladas / totalCreadas) * 100).toFixed(1) : '0.0';

   let html = '';

   // 1. Tarjetas KPI de Auditoría
   html += 
   `<div class="row g-2 mb-3">
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-primary bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-primary fw-bold small text-uppercase">Órdenes Generadas</span>
               <span class="fs-5 fw-bold text-primary">${totalCreadas.toLocaleString('es-MX')}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-danger bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-danger fw-bold small text-uppercase">Órdenes Canceladas</span>
               <span class="fs-5 fw-bold text-danger">${totalCanceladas} <small class="fs-8">(${pctCancelacion}%)</small></span>
               <small class="d-block text-muted fs-8">Perdido: $${montoCancelado.toFixed(2)}</small>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-warning bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-warning text-darken-2 fw-bold small text-uppercase">Descuentos Aplicados</span>
               <span class="fs-5 fw-bold text-warning text-darken-2">$${totalDescuentos.toFixed(2)}</span>
            </div>
         </div>
      </div>
      <div class="col-12 col-md-3">
         <div class="card border-0 bg-success bg-opacity-10 h-100">
            <div class="card-body p-2 text-center">
               <span class="d-block text-success fw-bold small text-uppercase">Cargos Extra Totales</span>
               <span class="fs-5 fw-bold text-success">$${totalCargosExtra.toFixed(2)}</span>
            </div>
         </div>
      </div>
   </div>`;

   // 2. Tabs de Navegación (3 Pestañas de Auditoría)
   html += 
   `<ul class="nav nav-tabs nav-tabs-bordered mb-3" id="tabAuditoria" role="tablist">
      <li class="nav-item" role="presentation">
         <button class="nav-link active fw-semibold" id="cancelaciones-tab" data-bs-toggle="tab" data-bs-target="#tab-cancelaciones" type="button" role="tab">
            <i class="bi bi-x-circle text-danger me-1"></i> Cancelaciones (${arrCancelacionesGlobal.length})
         </button>
      </li>
      <li class="nav-item" role="presentation">
         <button class="nav-link fw-semibold" id="descuentos-tab" data-bs-toggle="tab" data-bs-target="#tab-descuentos" type="button" role="tab">
            <i class="bi bi-percent text-warning me-1"></i> Descuentos (${arrDescuentosGlobal.length})
         </button>
      </li>
      <li class="nav-item" role="presentation">
         <button class="nav-link fw-semibold" id="cargos-tab" data-bs-toggle="tab" data-bs-target="#tab-cargos" type="button" role="tab">
            <i class="bi bi-plus-circle text-success me-1"></i> Cargos Extra (${arrCargosExtraGlobal.length})
         </button>
      </li>
   </ul>

   <div class="tab-content" id="tabContentAuditoria">
      
      <!-- TAB 1: CANCELACIONES -->
      <div class="tab-pane fade show active" id="tab-cancelaciones" role="tabpanel">
         <div class="table-responsive" style="max-height: 400px;">
            <table class="table table-hover align-middle mb-0 border">
               <thead class="table-light sticky-top">
                  <tr class="small text-uppercase text-muted">
                     <th class="ps-3 py-2">Folio</th>
                     <th class="py-2">Paciente / Convenio</th>
                     <th class="py-2">Motivo de Cancelación</th>
                     <th class="py-2 text-end">Monto Perdido</th>
                     <th class="py-2">Canceló</th>
                     <th class="py-2 text-end pe-3">Fecha Canc.</th>
                  </tr>
               </thead>
               <tbody>`;

               if (arrCancelacionesGlobal.length === 0) {
                  html += `<tr><td colspan="6" class="text-center py-4 text-muted"><i class="bi bi-check-circle text-success me-1"></i>Sin órdenes canceladas en este período.</td></tr>`;
               } else {
                  arrCancelacionesGlobal.forEach(row => {
                     html += 
                     `<tr>
                        <td class="ps-3 py-2 fw-bold text-danger fs-7">#${row.folio ?? row.orden_id}</td>
                        <td class="py-2">
                           <span class="d-block text-dark fw-semibold fs-7">${row.paciente ?? 'SIN NOMBRE'}</span>
                           <small class="text-muted fs-8">${row.convenio ?? 'PARTICULAR'}</small>
                        </td>
                        <td class="py-2">
                           <span class="badge bg-danger bg-opacity-10 text-danger fw-normal text-wrap text-start fs-8">
                              ${row.motivo_cancela && row.motivo_cancela.trim() !== '' ? row.motivo_cancela : 'SIN MOTIVO ESPECIFICADO'}
                           </span>
                        </td>
                        <td class="py-2 text-end fw-bold text-danger fs-7">$${parseFloat(row.total_neto ?? 0).toFixed(2)}</td>
                        <td class="py-2 fs-8 text-secondary">${row.user_cancela ?? 'NO REGISTRADO'}</td>
                        <td class="py-2 text-end pe-3 fs-8 text-muted">${row.fecha_cancelacion ?? row.fecha_cap ?? ''}</td>
                     </tr>`;
                  });
               }

               html += 
               `</tbody>
            </table>
         </div>
         <div class="btn-group btn-group-sm mt-3">
            <button type="button" class="btn btn-outline-success" onclick="exportar_cancelaciones_excel('${nombreSucursal}');">
               <i class="bi bi-file-earmark-excel me-1"></i> Excel Cancelaciones
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="exportar_cancelaciones_pdf('${nombreSucursal}', '${nomEmpresa}');">
               <i class="bi bi-file-earmark-pdf me-1"></i> PDF Cancelaciones
            </button>
         </div>
      </div>

      <!-- TAB 2: DESCUENTOS -->
      <div class="tab-pane fade" id="tab-descuentos" role="tabpanel">
         <div class="table-responsive" style="max-height: 400px;">
            <table class="table table-hover align-middle mb-0 border">
               <thead class="table-light sticky-top">
                  <tr class="small text-uppercase text-muted">
                     <th class="ps-3 py-2">Folio</th>
                     <th class="py-2">Paciente / Convenio</th>
                     <th class="py-2 text-end">Subtotal</th>
                     <th class="py-2 text-end">Descuento ($)</th>
                     <th class="py-2 text-center">% Desc.</th>
                     <th class="py-2 text-end">Total Neto</th>
                     <th class="py-2 text-end pe-3">Capturó</th>
                  </tr>
               </thead>
               <tbody>`;

               if (arrDescuentosGlobal.length === 0) {
                  html += `<tr><td colspan="7" class="text-center py-4 text-muted">No hay registros de descuentos aplicados.</td></tr>`;
               } else {
                  arrDescuentosGlobal.forEach(row => {
                     let pct = parseFloat(row.por_descuento ?? 0);
                     let badgePct = pct >= 30 
                        ? `<span class="badge bg-danger bg-opacity-10 text-danger fw-bold fs-8">${pct}%</span>`
                        : `<span class="badge bg-warning bg-opacity-10 text-warning text-darken-2 fw-bold fs-8">${pct}%</span>`;

                     html += 
                     `<tr>
                        <td class="ps-3 py-2 fw-bold text-primary fs-7">#${row.folio ?? row.orden_id}</td>
                        <td class="py-2">
                           <span class="d-block text-dark fw-semibold fs-7">${row.paciente ?? 'SIN NOMBRE'}</span>
                           <small class="text-muted fs-8">${row.convenio ?? 'PARTICULAR'}</small>
                        </td>
                        <td class="py-2 text-end text-muted fs-7">$${parseFloat(row.subtotal ?? 0).toFixed(2)}</td>
                        <td class="py-2 text-end text-warning text-darken-2 fw-bold fs-7">$${parseFloat(row.descuento ?? 0).toFixed(2)}</td>
                        <td class="py-2 text-center">${badgePct}</td>
                        <td class="py-2 text-end fw-bold text-dark fs-7">$${parseFloat(row.total_neto ?? 0).toFixed(2)}</td>
                        <td class="py-2 text-end pe-3 fs-8 text-secondary">${row.user_cap ?? 'SISTEMA'}</td>
                     </tr>`;
                  });
               }

               html += 
               `</tbody>
            </table>
         </div>
         <div class="btn-group btn-group-sm mt-3">
            <button type="button" class="btn btn-outline-success" onclick="exportar_descuentos_excel('${nombreSucursal}');">
               <i class="bi bi-file-earmark-excel me-1"></i> Excel Descuentos
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="exportar_descuentos_pdf('${nombreSucursal}', '${nomEmpresa}');">
               <i class="bi bi-file-earmark-pdf me-1"></i> PDF Descuentos
            </button>
         </div>
      </div>

      <!-- TAB 3: CARGOS EXTRA -->
      <div class="tab-pane fade" id="tab-cargos" role="tabpanel">
         <div class="table-responsive" style="max-height: 400px;">
            <table class="table table-hover align-middle mb-0 border">
               <thead class="table-light sticky-top">
                  <tr class="small text-uppercase text-muted">
                     <th class="ps-3 py-2">Folio</th>
                     <th class="py-2">Paciente / Convenio</th>
                     <th class="py-2">Motivo Cargo Extra</th>
                     <th class="py-2 text-end">Cargo Extra ($)</th>
                     <th class="py-2 text-end">Total Neto</th>
                     <th class="py-2 text-end pe-3">Capturó</th>
                  </tr>
               </thead>
               <tbody>`;

               if (arrCargosExtraGlobal.length === 0) {
                  html += `<tr><td colspan="6" class="text-center py-4 text-muted">No hay registros de cargos extra aplicados.</td></tr>`;
               } else {
                  arrCargosExtraGlobal.forEach(row => {
                     html += 
                     `<tr>
                        <td class="ps-3 py-2 fw-bold text-primary fs-7">#${row.folio ?? row.orden_id}</td>
                        <td class="py-2">
                           <span class="d-block text-dark fw-semibold fs-7">${row.paciente ?? 'SIN NOMBRE'}</span>
                           <small class="text-muted fs-8">${row.convenio ?? 'PARTICULAR'}</small>
                        </td>
                        <td class="py-2 fs-8 text-secondary">
                           ${row.motivo_cargo_extra && row.motivo_cargo_extra.trim() !== '' ? row.motivo_cargo_extra : 'N/A'}
                        </td>
                        <td class="py-2 text-end text-success fw-bold fs-7">+$${parseFloat(row.cargo_extra ?? 0).toFixed(2)}</td>
                        <td class="py-2 text-end fw-bold text-dark fs-7">$${parseFloat(row.total_neto ?? 0).toFixed(2)}</td>
                        <td class="py-2 text-end pe-3 fs-8 text-secondary">${row.user_cap ?? 'SISTEMA'}</td>
                     </tr>`;
                  });
               }

               html += 
               `</tbody>
            </table>
         </div>
         <div class="btn-group btn-group-sm mt-3">
            <button type="button" class="btn btn-outline-success" onclick="exportar_cargos_excel('${nombreSucursal}');">
               <i class="bi bi-file-earmark-excel me-1"></i> Excel Cargos Extra
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="exportar_cargos_pdf('${nombreSucursal}', '${nomEmpresa}');">
               <i class="bi bi-file-earmark-pdf me-1"></i> PDF Cargos Extra
            </button>
         </div>
      </div>

   </div>`;

   $('#containerResultadosReporte').html(html);
};

// =========================================================================
// EXPORTACIONES A EXCEL Y PDF (CANCELACIONES)
// =========================================================================

const exportar_cancelaciones_excel = (nombreSucursal) => {
   if (!arrCancelacionesGlobal || arrCancelacionesGlobal.length === 0) return;

   let datosExcel = arrCancelacionesGlobal.map(row => ({
      'Folio': row.folio ?? row.orden_id,
      'Paciente': row.paciente,
      'Convenio': row.convenio,
      'Motivo Cancelación': row.motivo_cancela ?? '',
      'Monto Perdido ($)': parseFloat(row.total_neto ?? 0),
      'Canceló': row.user_cancela,
      'Fecha Cancelación': row.fecha_cancelacion ?? row.fecha_cap,
      'Capturó Orden': row.user_cap
   }));

   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Cancelaciones");
   XLSX.writeFile(workbook, `Reporte_Cancelaciones_${nombreSucursal}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const exportar_cancelaciones_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrCancelacionesGlobal || arrCancelacionesGlobal.length === 0) return;

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('landscape', 'mm', 'a4');

   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Auditoría de Órdenes Canceladas - " + nombreSucursal, 14, 20);

   let bodyTable = arrCancelacionesGlobal.map(row => [
      `#${row.folio ?? row.orden_id}`,
      row.paciente,
      row.motivo_cancela ?? 'N/A',
      `$${parseFloat(row.total_neto ?? 0).toFixed(2)}`,
      row.user_cancela ?? 'N/A',
      row.fecha_cancelacion ?? ''
   ]);

   doc.autoTable({
      startY: 28,
      head: [['Folio', 'Paciente', 'Motivo Cancelación', 'Monto Perdido', 'Canceló', 'Fecha Canc.']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [192, 57, 43], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
         3: { halign: 'right', fontStyle: 'bold' },
         5: { halign: 'center' }
      }
   });

   doc.save(`Reporte_Cancelaciones_${new Date().toISOString().split('T')[0]}.pdf`);
};

// =========================================================================
// EXPORTACIONES DE CARGOS EXTRA
// =========================================================================

const exportar_cargos_excel = (nombreSucursal) => {
   if (!arrCargosExtraGlobal || arrCargosExtraGlobal.length === 0) return;

   let datosExcel = arrCargosExtraGlobal.map(row => ({
      'Folio': row.folio ?? row.orden_id,
      'Paciente': row.paciente,
      'Convenio': row.convenio,
      'Motivo Cargo Extra': row.motivo_cargo_extra ?? '',
      'Cargo Extra ($)': parseFloat(row.cargo_extra ?? 0),
      'Total Neto ($)': parseFloat(row.total_neto ?? 0),
      'Capturó': row.user_cap,
      'Fecha Captura': row.fecha_cap
   }));

   const worksheet = XLSX.utils.json_to_sheet(datosExcel);
   const workbook  = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Cargos_Extra");
   XLSX.writeFile(workbook, `Reporte_Cargos_Extra_${nombreSucursal}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const exportar_cargos_pdf = (nombreSucursal, nomEmpresa) => {
   if (!arrCargosExtraGlobal || arrCargosExtraGlobal.length === 0) return;

   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('landscape', 'mm', 'a4');

   doc.setFontSize(14);
   doc.text(nomEmpresa, 14, 15);
   doc.setFontSize(11);
   doc.text("Auditoría de Cargos Extra Aplicados - " + nombreSucursal, 14, 20);

   let bodyTable = arrCargosExtraGlobal.map(row => [
      `#${row.folio ?? row.orden_id}`,
      row.paciente,
      row.motivo_cargo_extra ?? 'N/A',
      `+$${parseFloat(row.cargo_extra ?? 0).toFixed(2)}`,
      `$${parseFloat(row.total_neto ?? 0).toFixed(2)}`,
      row.user_cap
   ]);

   doc.autoTable({
      startY: 28,
      head: [['Folio', 'Paciente', 'Motivo Cargo Extra', 'Cargo Extra', 'Total Neto', 'Capturó']],
      body: bodyTable,
      theme: 'grid',
      headStyles: { fillColor: [39, 174, 96], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
         3: { halign: 'right', fontStyle: 'bold' },
         4: { halign: 'right' }
      }
   });

   doc.save(`Reporte_Cargos_Extra_${new Date().toISOString().split('T')[0]}.pdf`);
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabReportes                  = TabReportes;
window.ModalVisualizacionReporte    = ModalVisualizacionReporte;
window.generar_reporte              = generar_reporte;

window.exportar_caja_excel          = exportar_caja_excel;
window.exportar_caja_pdf            = exportar_caja_pdf;

window.exportar_flujo_excel         = exportar_flujo_excel;
window.exportar_flujo_pdf           = exportar_flujo_pdf;

window.exportar_cxc_excel           = exportar_cxc_excel;
window.exportar_cxc_pdf             = exportar_cxc_pdf;

window.exportar_rentabilidad_excel  = exportar_rentabilidad_excel;
window.exportar_rentabilidad_pdf    = exportar_rentabilidad_pdf;

window.exportar_clientes_excel      = exportar_clientes_excel;
window.exportar_clientes_pdf        = exportar_clientes_pdf;

window.exportar_demografia_excel    = exportar_demografia_excel;
window.exportar_demografia_pdf      = exportar_demografia_pdf;
window.exportar_recurrencia_excel   = exportar_recurrencia_excel;
window.exportar_recurrencia_pdf     = exportar_recurrencia_pdf;

window.exportar_cargos_pdf          = exportar_cargos_pdf;
window.exportar_cargos_excel        = exportar_cargos_excel;
window.exportar_cancelaciones_pdf   = exportar_cancelaciones_pdf;
window.exportar_cancelaciones_excel = exportar_cancelaciones_excel;