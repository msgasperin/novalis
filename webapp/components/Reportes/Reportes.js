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

      <!-- Rendimiento por Convenios -->
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow-sm border-0 pointer text-center h-100" onclick="ModalVisualizacionReporte('rendimiento_convenios', 'Rendimiento de Convenios', 5);">
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

      if(idTipo == 1) {
         pintar_reporte_cortes_caja(arrReporte, nombreSucursal);
      }
      else if(idTipo == 2) {
         pintar_reporte_flujo_operativo(arrReporte, nombreSucursal);
      }
   }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CORTES Y ARQUEOS DE CAJA +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const pintar_reporte_cortes_caja = (data, nombreSucursal) => {
   
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
   </div>
   <div class="btn-group btn-group-sm mt-2" role="group">
      <button type="button" class="btn btn-outline-success" id="btnExportarExcel" onclick="exportar_caja_excel('${nombreSucursal}');">
         <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
      <button type="button" class="btn btn-outline-danger" id="btnExportarPDF" onclick="exportar_caja_pdf('${nombreSucursal}');">
         <i class="bi bi-file-earmark-pdf me-1"></i> PDF
      </button>
   </div>`;

   $('#containerResultadosReporte').html(html);
   
   // Habilitar botones de exportación en el footer del modal
   $('#btnExportarExcel, #btnExportarPDF, #btnImprimirReporte').removeAttr('disabled');
}

const exportar_caja_excel = (nombreSucursal) => {
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
   XLSX.utils.book_append_sheet(workbook, worksheet, "Cortes_Caja_"+nombreSucursal);

   // 3. Generar archivo con fecha actual en el nombre
   let fechaHoy = new Date().toISOString().split('T')[0];
   XLSX.writeFile(workbook, `Reporte_Cortes_Caja_${fechaHoy}.xlsx`);
};

const exportar_caja_pdf = (nombreSucursal) => {
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
   doc.text("Reporte de Auditoría y Cortes de Caja - " + nombreSucursal, 14, 15);
   
   doc.setFontSize(9);
   doc.setTextColor(100);
   let fechaStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
   doc.text(`Fecha de emisión: ${fechaStr}`, 14, 21);

   // Estructurar filas para autoTable
   let bodyTable = arrReporte.map(row => [
      `Caja #${row.id_caja}\n${row.usuario_registro ?? 'Cajero'}`,
      `${row.fecha_apertura}\n${row.fecha_cierre ?? 'En curso'}`,
      `$${parseFloat(row.fondo_inicial ?? 0).toFixed(2)}`,
      `$${parseFloat(row.total_esperado_sistema ?? 0).toFixed(2)}`,
      `$${parseFloat(row.total_declarado ?? 0).toFixed(2)}`,
      `$${parseFloat(row.diferencia ?? 0).toFixed(2)}`
   ]);

   doc.autoTable({
      startY: 25,
      head: [['Caja / Cajero', 'Apertura / Cierre', 'Fondo Inicial', 'Total Esperado', 'Total Declarado', 'Diferencia']],
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

const pintar_reporte_flujo_operativo = (data, nombreSucursal) => {
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
               <th class="ps-3 py-2">Fecha / Hora</th>
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
      <button type="button" class="btn btn-outline-success" id="btnExportarExcel" onclick="exportar_flujo_excel('${nombreSucursal}');">
         <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
      <button type="button" class="btn btn-outline-danger" id="btnExportarPDF" onclick="exportar_flujo_pdf('${nombreSucursal}');">
         <i class="bi bi-file-earmark-pdf me-1"></i> PDF
      </button>
   </div>`;

   $('#containerResultadosReporte').html(html);

   // Habilitar botones de exportación
   $('#btnExportarExcel, #btnExportarPDF, #btnImprimirReporte').removeAttr('disabled');
};

const exportar_flujo_excel = (nombreSucursal) => {
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

const exportar_flujo_pdf = (nombreSucursal) => {
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
   doc.text("Reporte de Flujo Operativo de Dinero (Ingresos vs Egresos) - " + nombreSucursal, 14, 15);

   doc.setFontSize(9);
   doc.setTextColor(100);
   let fechaStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
   doc.text(`Fecha de emisión: ${fechaStr}`, 14, 21);

   // Estructurar filas para autoTable
   let bodyTable = arrReporte.map(row => {
      let esIngreso = row.tipo_movimiento === 'INGRESO';
      let montoFormat = `${esIngreso ? '+' : '-'}$${parseFloat(row.monto ?? 0).toFixed(2)}`;

      return [
         row.fecha_movimiento,
         `Caja #${row.caja_id}`,
         row.tipo_movimiento,
         row.concepto,
         row.metodo_pago,
         row.usuario_registro ?? 'N/A',
         montoFormat
      ];
   });

   doc.autoTable({
      startY: 25,
      head: [['Fecha / Hora', 'Caja', 'Tipo', 'Concepto / Origen', 'Método Pago', 'Usuario', 'Monto']],
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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabReportes               = TabReportes;
window.ModalVisualizacionReporte = ModalVisualizacionReporte;
window.generar_reporte           = generar_reporte;

window.exportar_caja_excel       = exportar_caja_excel;
window.exportar_caja_pdf         = exportar_caja_pdf;

window.exportar_flujo_excel      = exportar_flujo_excel;
window.exportar_flujo_pdf        = exportar_flujo_pdf;
