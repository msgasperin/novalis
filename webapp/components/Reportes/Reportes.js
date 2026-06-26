import { obtiene_reporte_utilidades, obtiene_reporte_mas_vendidos, obtiene_reporte_stock_critico, obtiene_reporte_mejores_clientes, obtiene_operativos, obtiene_reporte_produccion } from "./ReportesServices.js";

const TabReportes = () => {
  	let html =
	`<div class="row">
		<div class="col-12 mt-2 mb-2">
			<div class="fs-4"><i class="bi bi-bar-chart"> </i>Reportes</div>
		</div>
   </div>
   <div class="row mt-2">

      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow border-0 pointer text-center" onclick="ModalVisualizacionReporte('utilidades', 'Utilidades', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes">
                     <i class="bi bi-graph-up-arrow text-success fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Utilidades</h5>
                  <p class="card-text text-muted small mb-0">
                     Analiza el margen de ganancia real por periodo.
                  </p>
               </div>
            </div>
         </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow border-0 pointer text-center" onclick="ModalVisualizacionReporte('mas_vendidos', 'Más Vendidos', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes">
                     <i class="bi bi-cart-check text-info fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Más Vendidos</h5>
                  <p class="card-text text-muted small mb-0">
                    Top de productos con mayor rotación de inventario.
                  </p>
               </div>
            </div>
         </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow border-0 pointer text-center" onclick="ModalVisualizacionReporte('stock_critico', 'Stock Crítico', 0);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes">
                     <i class="bi bi-dash-circle-dotted text-danger fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Stock Crítico</h5>
                  <p class="card-text text-muted small mb-0">
                     Productos que están por debajo o igual a su stock mínimo.
                  </p>
               </div>
            </div>
         </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow border-0 pointer text-center" onclick="ModalVisualizacionReporte('mejores_clientes', 'Mejores Clientes', 1);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes">
                     <i class="bi bi-trophy text-warning fs-2"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-2 fw-bold">Mejores Clientes</h5>
                  <p class="card-text text-muted small mb-0">
                     Identifica a los clientes con mayor volumen de compras y lealtad.
                  </p>
               </div>
            </div>
         </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2">
         <div class="card mb-3 shadow border-0 pointer text-center" onclick="ModalVisualizacionReporte('produccion', 'Producción', 3);">
            <div class="card-body">
               <div class="d-flex justify-content-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center icon-reportes">
                     <i class="bi bi-bar-chart-line text-primary fs-3"></i>
                  </div>
               </div>
               <div>
                  <h5 class="card-title mb-1 fw-bold">Producción</h5>
                  <p class="card-text text-muted small mb-0">
                     Monitorea el volumen y rendimiento de producción por periodo.
                  </p>
               </div>
            </div>
         </div>
      </div>
   </div>`;

	$('#containerMain').html(html);   
}

const ModalVisualizacionReporte = (tipoReporte, nomReporte, usaRango) => {

   let mensajeReporte;
   if(usaRango == 1) {
      mensajeReporte = '<span class="text-muted small">Selecciona un rango de fechas y presiona el botón <strong>Generar</strong> para visualizar el desglose.</span>';
   }
   else if(usaRango == 3) {
      mensajeReporte = '<span class="text-muted small">Selecciona un rango de fechas y a un operativo y presiona el botón <strong>Generar</strong> para visualizar el desglose.</span>';
   }
   else {
      mensajeReporte = '<span class="text-muted small">Cargando la información del reporte seleccionado, espera un momento.</span>';
   }

   let html = `
   <div class="modal fade modal-superior-blur" id="modalVisualizarReporte" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
              <h1 class="modal-title fs-5">${nomReporte}</h1>
              <button type="button" class="btn btn-outline-dark btn-sm" data-bs-dismiss="modal" aria-label="Close">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="modal-body">`;
               if(usaRango == 3) {
                  html+=`
                  <div class="row">
                     <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 mt-2">
                        <strong>Operativo *</strong>
                        <select name="userOperativo" id="userOperativo" class="form-select">
                           <option value="0">Seleccionar</option>
                        </select>
                     </div>
                     <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 mt-2">
                        <strong>Fecha inicial *</strong>
                        <input type="date" name="fecIniReporte" id="fecIniReporte" class="form-control">
                     </div>
                     <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 mt-2">
                        <strong>Fecha inicial *</strong>
                        <input type="date" name="fecFinReporte" id="fecFinReporte" class="form-control">
                     </div>
                     <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-6 mt-2">
                        <br>
                        <button type="button" class="btn btn-secondary btn-elao btn-redondo w-100" id="btnGenerarReporte" onclick="fn_reporte_${tipoReporte}();">
                           Generar
                        </button>
                     </div>
                  </div>`;
               }
               else if(usaRango == 1) {
                  html+=`
                  <div class="row">
                     <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-6 mt-2">
                        <strong>Fecha inicial *</strong>
                        <input type="date" name="fecIniReporte" id="fecIniReporte" class="form-control">
                     </div>
                     <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-6 mt-2">
                        <strong>Fecha inicial *</strong>
                        <input type="date" name="fecFinReporte" id="fecFinReporte" class="form-control">
                     </div>
                     <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-12 mt-2">
                        <br>
                        <button type="button" class="btn btn-secondary btn-elao btn-redondo w-100" id="btnGenerarReporte" onclick="fn_reporte_${tipoReporte}();">
                           Generar
                        </button>
                     </div>
                  </div>`;
               }
               html+=`
               <div class="row">
                  <div class="col-12 mt-4">
                     <div id="vista_reportes">
                        <div class="alert alert-secondary border-0 shadow-sm d-flex align-items-center justify-content-center p-4" role="alert">
                           <i class="bi bi-calendar-range fs-3 me-3 text-muted"></i>
                           <div>
                              <h6 class="mb-1 fw-bold">Consulta de ${nomReporte}</h6>
                              ${mensajeReporte}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer" align="right">
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
               Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdmin').html(html);
   $('#modalVisualizarReporte').modal('show');
   if(tipoReporte == 'stock_critico') {
      fn_reporte_stock_critico();
   }
   setTimeout(() => {
      fn_combo_operativos('userOperativo');
   }, 500);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Reportes ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const fn_combo_operativos = async (selectDestino) => {  
   let comboOperativos = '<option value="0">Seleccionar</option>';
   let respuesta = await obtiene_operativos();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      if(respuesta.data.length > 0) {
         respuesta.data.map(row => {
            comboOperativos+=`<option value="${row.id}">${row.nombre}</option>`;
         });
         $('#'+selectDestino).html(comboOperativos);
         setTimeout(() => {
            $('#'+selectDestino).trigger('change');
         }, 500);
      }
   }  
}

const fn_reporte_utilidades = async () => {

   let fecIni = $('#fecIniReporte').val().trim();
   let fecFin = $('#fecFinReporte').val().trim();

   if(fecIni == '' || fecFin == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el rango de fechas',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniReporte').focus()
      return;
   }
   else if(fecIni > fecFin) {
      ToastColor.fire({
         text: '¡Atención! La fecha inicial no puede ser mayor a la fecha final',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniReporte').focus()
      return;
   }
   else {
      let fechaInicio = new Date(fecIni);
      let fechaFin    = new Date(fecFin);

      // Diferencia en milisegundos → convertir a días
      let diffMs   = fechaFin - fechaInicio;
      let diffDias = diffMs / (1000 * 60 * 60 * 24);

      if (diffDias > 30) {
         ToastColor.fire({
            text: '¡Atención! El rango de fechas no puede ser mayor a 30 días',
            icon: 'warning',
            position: 'top',
            timerProgressBar: false
         });
         $('#fecIniReporte').focus();
         return;
      }
   }

   $('#btnGenerarReporte').prop('disabled', true);
   $('#vista_reportes').html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');

   let respuesta = await obtiene_reporte_utilidades(fecIni, fecFin);
   if(respuesta.estatus == 403) {
      fnNoSesion();
      $('#btnGenerarReporte').prop('disabled', false);
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGenerarReporte').prop('disabled', false);
      $('#vista_reportes').html(`
         <div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">Hubo problemas</p>
         </div>
      `);
      return;
   }
   else {
      let arrReporte = await respuesta.data;
      pinta_reporte_utilidades(arrReporte, fecIni, fecFin);
   }
}

const pinta_reporte_utilidades = (res, fecIni, fecFin) => {
  let html = '';  
  // Validamos que no haya error y que existan detalles
   if(!res.error && res.detalles.length > 0) {
      const { totales, detalles } = res;
      // --- SECCIÓN 1: WIDGETS DE TOTALES (DASHBOARD) ---
      html += `
      <div class="row mt-2 mb-4">
         <div class="col-md-3 col-6 mb-2">
            <div class="card border-0 shadow-sm bg-primary bg-opacity-10 text-primary h-100">
               <div class="card-body text-center">
                  <h6 class="text-uppercase fw-bold small">Venta Total</h6>
                  <h4 class="mb-0 fw-bold">$${formatoMoneda(totales.ingresos)}</h4>
               </div>
            </div>
         </div>
         <div class="col-md-3 col-6 mb-2">
            <div class="card border-0 shadow-sm bg-secondary bg-opacity-10 text-secondary h-100">
               <div class="card-body text-center">
                  <h6 class="text-uppercase fw-bold small">Costo Mercancía</h6>
                  <h4 class="mb-0 fw-bold">$${formatoMoneda(totales.inversion)}</h4>
               </div>
            </div>
         </div>
         <div class="col-md-3 col-6 mb-2">
            <div class="card border-0 shadow-sm bg-success bg-opacity-10 text-success h-100">
               <div class="card-body text-center">
                  <h6 class="text-uppercase fw-bold small">Utilidad Neta</h6>
                  <h4 class="mb-0 fw-bold">$${formatoMoneda(totales.utilidad)}</h4>
               </div>
            </div>
         </div>
         <div class="col-md-3 col-6 mb-2">
            <div class="card border-0 shadow-sm bg-danger bg-opacity-10 text-danger h-100">
               <div class="card-body text-center">
                  <h6 class="text-uppercase fw-bold small">Devoluciones</h6>
                  <h4 class="mb-0 fw-bold">$${formatoMoneda(totales.devoluciones)}</h4>
               </div>
            </div>
         </div>
      </div>`;

      // --- SECCIÓN 2: TABLA DE DETALLE ---
      html += `
      <div class="row">
         <div class="col-12">
         <div class="table-responsive">
            <table id="tableReporteUtilidades" class="table dataTable table-hover align-middle">
               <thead class="table-light">
               <tr align="center">
                  <th>Folio</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Venta</th>
                  <th>Costo</th>
                  <th>Utilidad</th>
                  <th>Devol.</th>
               </tr>
               </thead>
               <tbody>`;            
                  detalles.forEach(row => {
                  html += `
                  <tr class="small">
                     <td class="fw-bold text-primary">${row.folio}</td>
                     <td class="text-center">${row.fecha_format}</td>
                     <td>${row.cliente}</td>
                     <td>$${formatoMoneda(row.venta_bruta)}</td>
                     <td class="text-muted">$${formatoMoneda(row.costo_total)}</td>
                     <td class="fw-bold text-success text-right">$${formatoMoneda(row.utilidad_neta)}</td>
                     <td class="text-danger small text-end">${row.devoluciones > 0 ? '-$'+formatoMoneda(row.devoluciones) : '0.00'}</td>
                  </tr>`;
                  });
                  html += `
               </tbody>
            </table>
         </div>
         </div>
      </div>`;

      $('#vista_reportes').html(html);

      // Inicialización de DataTable
      setTimeout(() => {
         initDataTableExport({
            tableId: '#tableReporteUtilidades',
            titulo: 'Reporte de Utilidades elao: ' + fecIni+' - '+fecFin,
            orientation: 'landscape',
            alignment: ['10%', '15%', '30%', '11%', '11%', '11%', '11%'],
            exportColumns: [0, 1, 2, 3, 4, 5, 6],
            posicionOrden: 1, // Ordenar por fecha
            order: 'desc'
         }); 
         closeLoad();
      }, 300);
      $('#btnGenerarReporte').prop('disabled', false);

   } else {
      $('#vista_reportes').html(`
         <div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">No se encontraron datos en el rango seleccionado.</p>
         </div>
      `);
      $('#btnGenerarReporte').prop('disabled', false);
   }
}

const fn_reporte_mas_vendidos = async () => {

   let fecIni = $('#fecIniReporte').val().trim();
   let fecFin = $('#fecFinReporte').val().trim();

   if(fecIni == '' || fecFin == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el rango de fechas',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniReporte').focus()
      return;
   }
   else if(fecIni > fecFin) {
      ToastColor.fire({
         text: '¡Atención! La fecha inicial no puede ser mayor a la fecha final',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniReporte').focus()
      return;
   }
   else {
      let fechaInicio = new Date(fecIni);
      let fechaFin    = new Date(fecFin);

      // Diferencia en milisegundos → convertir a días
      let diffMs   = fechaFin - fechaInicio;
      let diffDias = diffMs / (1000 * 60 * 60 * 24);

      if (diffDias > 30) {
         ToastColor.fire({
            text: '¡Atención! El rango de fechas no puede ser mayor a 30 días',
            icon: 'warning',
            position: 'top',
            timerProgressBar: false
         });
         $('#fecIniReporte').focus();
         return;
      }
   }

   $('#btnGenerarReporte').prop('disabled', true);
   $('#vista_reportes').html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');

   let respuesta = await obtiene_reporte_mas_vendidos(fecIni, fecFin);
   if(respuesta.estatus == 403) {
      fnNoSesion();
      $('#btnGenerarReporte').prop('disabled', false);
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGenerarReporte').prop('disabled', false);
      $('#vista_reportes').html(`
         <div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">Hubo problemas</p>
         </div>
      `);
      return;
   }
   else {
      let arrReporte = await respuesta.data;
      pinta_reporte_mas_vendidos(arrReporte, fecIni, fecFin);
   }
}

const pinta_reporte_mas_vendidos = (res, fecIni, fecFin) => {
   let html = '';

   // Validamos que la respuesta sea correcta y tenga datos
   if(!res.error && res.detalles.length > 0) {
      const { totales, detalles } = res;

      // --- DASHBOARD DE LIDERAZGO ---
      html += `
      <div class="row mt-2 mb-4">
         <div class="col-md-4 col-12 mb-2 text-sm-start text-center">
            <div class="card border-0 shadow-sm bg-success bg-opacity-10 text-success h-100">
               <div class="card-body">
                  <h6 class="text-uppercase fw-bold small mb-2">Producto Estrella</h6>
                  <h5 class="mb-0 fw-bold text-truncate" title="${totales.top_producto}">
                     <i class="bi bi-star-fill me-2"></i>${totales.top_producto}
                  </h5>
               </div>
            </div>
         </div>
         <div class="col-md-4 col-6 mb-2">
            <div class="card border-0 shadow-sm bg-dark bg-opacity-10 text-dark h-100">
               <div class="card-body text-center">
                  <h6 class="text-uppercase fw-bold small mb-2">Total Piezas Vendidas</h6>
                  <h4 class="mb-0 fw-bold">${totales.total_piezas.toLocaleString()}</h4>
               </div>
            </div>
         </div>
         <div class="col-md-4 col-6 mb-2">
            <div class="card border-0 shadow-sm bg-primary bg-opacity-10 text-primary h-100">
               <div class="card-body">
                  <h6 class="text-uppercase fw-bold small mb-2">Sabor más solicitado</h6>
                  <h5 class="mb-0 fw-bold"><i class="bi bi-hand-thumbs-up-fill me-2"></i>${totales.top_sabor}</h5>
               </div>
            </div>
         </div>
      </div>`;

      // --- TABLA DE RANKING ---
      html += `
      <div class="row">
         <div class="col-12">
            <div class="table-responsive">
               <table id="tableMasVendidos" class="table dataTable table-hover align-middle">
                  <thead class="table-light">
                     <tr align="center">
                        <th width="40%">Producto</th>
                        <th width="15%">Tipo</th>
                        <th width="15%">Sabor</th>
                        <th width="15%">Piezas</th>
                        <th width="15%">Monto ($)</th>
                     </tr>
                  </thead>
                  <tbody>`;
        
                     detalles.forEach((row, index) => {
                        html += `
                        <tr>
                           <td class="fw-bold text-dark">${row.producto}</td>
                           <td>${row.tipo}</td>
                           <td>${row.sabor}</td>
                           <td class="fw-bold fs-6 text-center">${row.total_piezas}</td>
                           <td class="text-end">$${formatoMoneda(row.monto_generado)}</td>
                        </tr>`;
                     });

                     html += `
                  </tbody>
               </table>
            </div>
         </div>
      </div>`;

      $('#vista_reportes').html(html);

      // Inicialización de DataTable con exportación
      setTimeout(() => {
         initDataTableExport({
            tableId: '#tableMasVendidos',
            titulo: 'Ranking de Productos Más Vendidos - elao: ' + fecIni + ' - ' + fecFin,
            orientation: 'portrait', // Vertical es suficiente para estas columnas
            alignment: ['5%', '40%', '15%', '15%', '15%'],
            exportColumns: [0, 1, 2, 3, 4],
            posicionOrden: 3, // Ordenar por la columna de Piezas (index 4)
            order: 'desc',
            // Pasamos un ajuste manual para que la columna 0 sea visible
            columnDefs: [ { targets: 0, visible: true, searchable: true }]
         });
      }, 300);
      $('#btnGenerarReporte').prop('disabled', false);
   } 
   else {
      $('#vista_reportes').html(`
         <div class="text-center py-5">
            <img src="assets/images/no_encontrado.png" class="img-fluid mb-3" style="max-width: 180px;">
            <p class="text-muted">No hay datos de ventas para el periodo seleccionado.</p>
         </div>
      `);
      $('#btnGenerarReporte').prop('disabled', false);
   }
}

const fn_reporte_stock_critico = async () => {   

   $('#vista_reportes').html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');

   let respuesta = await obtiene_reporte_stock_critico();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGenerarReporte').prop('disabled', false);
      $('#vista_reportes').html(`
         <div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">Hubo problemas</p>
         </div>
      `);
      return;
   }
   else {
      let arrReporte = await respuesta.data;
      pinta_reporte_stock_critico(arrReporte);
   }
}

const pinta_reporte_stock_critico = (res) => {
   let html = '';

   if(!res.error && res.detalles.length > 0) {
      const { resumen, detalles } = res;

      html += `
      <div class="row mt-2 mb-4">
         <div class="col-6 mb-2">
            <div class="card border-0 shadow-sm bg-danger bg-opacity-10 text-danger h-100">
               <div class="card-body">
                  <h6 class="text-uppercase fw-bold small mb-2">Agotados (Stock 0)</h6>
                  <h4 class="mb-0 fw-bold text-dark">
                     <i class="bi bi-exclamation-circle me-2 text-danger"></i>${resumen.total_criticos}
                  </h4>
               </div>
            </div>
         </div>

         <div class="col-6 mb-2">
            <div class="card border-0 shadow-sm bg-warning bg-opacity-10 text-warning h-100">
               <div class="card-body">
                  <h6 class="text-uppercase fw-bold small mb-2">En Stock Mínimo</h6>
                  <h4 class="mb-0 fw-bold text-dark">
                     <i class="bi bi-graph-down-arrow me-2 text-warning"></i>${resumen.total_en_minimo}
                  </h4>
               </div>
            </div>
         </div>

      </div>`;

      // --- TABLA DE ALERTAS ---
      html += `
      <div class="row">
         <div class="col-12">
            <div class="table-responsive">
               <table id="tableStockCritico" class="table dataTable table-hover align-middle">
                  <thead class="table-light">
                     <tr align="center">
                        <th>SKU</th>
                        <th width="35%">Producto</th>
                        <th>Stock Actual</th>
                        <th>Mínimo</th>
                        <th>Faltante</th>
                        <th>Nivel Alerta</th>
                     </tr>
                  </thead>
                  <tbody>`;
        
                  detalles.forEach((row) => {
                     // Lógica de colores para el badge de alerta
                     let badgeClass = '';
                     let rowClass   = '';

                     if(row.nivel_alerta === 'CRÍTICO') {
                        badgeClass = 'bg-danger'; 
                        rowClass   = 'table-danger bg-opacity-10'; // Resaltado suave para fila crítica
                     } else if(row.nivel_alerta === 'MÍNIMO') {
                        badgeClass = 'bg-warning text-dark';
                     }

                     html += `
                     <tr class="${rowClass}">
                        <td class="small fw-bold">${row.sku}</td>
                        <td class="fw-bold text-dark">${row.nom_producto}</td>
                        <td class="text-center fw-bold fs-6">${row.stock}</td>
                        <td class="text-center text-muted">${row.stock_minimo}</td>
                        <td class="text-center text-danger fw-bold">
                            ${row.faltante > 0 ? row.faltante : '-'}
                        </td>
                        <td class="text-center">
                           <span class="badge bg-opacity-50 ${badgeClass} p-2 w-100">${row.nivel_alerta}</span>
                        </td>
                     </tr>`;
                  });

                  html += `
                  </tbody>
               </table>
            </div>
         </div>
      </div>`;

      $('#vista_reportes').html(html);

      // Inicialización de DataTable
      setTimeout(() => {
         initDataTableExport({
            tableId: '#tableStockCritico',
            titulo: 'Reporte de Stock Crítico y Reposición - elao',
            orientation: 'portrait',
            alignment: ['10%', '35%', '15%', '15%', '10%', '15%'],
            exportColumns: [0, 1, 2, 3, 4, 5],
            posicionOrden: 2, // Ordenar por Stock Actual (index 2)
            order: 'asc', 
            columnDefs: [ { targets: 0, visible: true, searchable: true }]
         });
      }, 300);
   } 
   else {
      $('#vista_reportes').html(`
         <div class="text-center py-5">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
            <h4 class="mt-3">¡Todo en orden!</h4>
            <p class="text-muted">No se encontraron productos por debajo del stock de seguridad.</p>
         </div>
      `);      
   }
}

const fn_reporte_mejores_clientes = async () => {

   let fecIni = $('#fecIniReporte').val().trim();
   let fecFin = $('#fecFinReporte').val().trim();

   if(fecIni == '' || fecFin == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el rango de fechas',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniReporte').focus()
      return;
   }
   else if(fecIni > fecFin) {
      ToastColor.fire({
         text: '¡Atención! La fecha inicial no puede ser mayor a la fecha final',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniReporte').focus()
      return;
   }
   else {
      let fechaInicio = new Date(fecIni);
      let fechaFin    = new Date(fecFin);

      // Diferencia en milisegundos → convertir a días
      let diffMs   = fechaFin - fechaInicio;
      let diffDias = diffMs / (1000 * 60 * 60 * 24);

      if (diffDias > 30) {
         ToastColor.fire({
            text: '¡Atención! El rango de fechas no puede ser mayor a 30 días',
            icon: 'warning',
            position: 'top',
            timerProgressBar: false
         });
         $('#fecIniReporte').focus();
         return;
      }
   }

   $('#btnGenerarReporte').prop('disabled', true);
   $('#vista_reportes').html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');

   let respuesta = await obtiene_reporte_mejores_clientes(fecIni, fecFin);
   if(respuesta.estatus == 403) {
      fnNoSesion();
      $('#btnGenerarReporte').prop('disabled', false);
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGenerarReporte').prop('disabled', false);
      $('#vista_reportes').html(`
         <div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">Hubo problemas</p>
         </div>
      `);
      return;
   }
   else {
      let arrReporte = await respuesta.data;
      pinta_reporte_mejores_clientes(arrReporte, fecIni, fecFin);
   }
}

const pinta_reporte_mejores_clientes = (res, fecIni, fecFin) => {
   let html = '';

   // Validamos que no haya error y existan datos
   if(!res.error && res.detalles.length > 0) {
      const { totales, detalles } = res;

      // --- DASHBOARD DE LIDERAZGO ---
      html += `
      <div class="row mt-2 mb-4">
         <div class="col-md-4 col-12 mb-2 text-sm-start text-center">
            <div class="card border-0 shadow-sm bg-warning bg-opacity-10 text-dark h-100">
               <div class="card-body py-3">
                  <h6 class="text-uppercase fw-bold small mb-2 text-warning">
                     <i class="bi bi-trophy-fill me-1"></i>Más Ventas $
                  </h6>
                  <h5 class="mb-0 fw-bold text-truncate" title="${totales.cliente_oro}">${totales.cliente_oro}</h5>
               </div>
            </div>
         </div>
         <div class="col-md-4 col-6 mb-2">
            <div class="card border-0 shadow-sm bg-primary bg-opacity-10 text-primary h-100">
               <div class="card-body py-3">
                  <h6 class="text-uppercase fw-bold small mb-2">
                     <i class="bi bi-person-heart me-1"></i>Más Frecuente
                  </h6>
                  <h5 class="mb-0 fw-bold text-truncate" title="${totales.cliente_fiel}">${totales.cliente_fiel}</h5>
               </div>
            </div>
         </div>
         <div class="col-md-4 col-6 mb-2">
            <div class="card border-0 shadow-sm bg-success bg-opacity-10 text-success h-100">
               <div class="card-body py-3">
                  <h6 class="text-uppercase fw-bold small mb-2">
                     <i class="bi bi-graph-up-arrow me-1"></i>Mayor Utilidad
                  </h6>
                  <h5 class="mb-0 fw-bold text-truncate" title="${totales.cliente_rentable}">${totales.cliente_rentable}</h5>
               </div>
            </div>
         </div>
      </div>`;

      // --- TABLA DE DETALLES ---
      html += `
      <div class="row">
         <div class="col-12">
            <div class="table-responsive">
               <table id="tableMejoresClientes" class="table dataTable table-hover align-middle">
                  <thead class="table-light">
                     <tr align="center">
                        <th width="50%">Cliente</th>
                        <th width="20%">No. Pedidos</th>
                        <th width="30%">Total de Compras</th>
                     </tr>
                  </thead>
                  <tbody>`;
        
                  detalles.forEach((row) => {
                     html += `
                     <tr>
                        <td class="fw-bold text-dark">${row.cliente}</td>
                        <td class="text-center fs-6">${row.total_pedidos}</td>
                        <td class="text-end fw-bold">$${formatoMoneda(row.monto_total_compras)}</td>
                     </tr>`;
                  });

                  html += `
                  </tbody>
               </table>
            </div>
         </div>
      </div>`;

      $('#vista_reportes').html(html);

      // Inicialización de DataTable con exportación (Siguiendo tu estándar)
      setTimeout(() => {
         initDataTableExport({
            tableId: '#tableMejoresClientes',
            titulo: 'Análisis de Mejores Clientes - elao: ' + fecIni + ' - ' + fecFin,
            orientation: 'portrait',
            alignment: ['50%', '20%', '30%'],
            exportColumns: [0, 1, 2],
            posicionOrden: 2, // Ordenar por Total de Compras (index 2)
            order: 'desc',
            columnDefs: [ { targets: 0, visible: true, searchable: true }]
         });
      }, 300);

      $('#btnGenerarReporte').prop('disabled', false);
   } 
   else {
      // Manejo de estado vacío
      $('#vista_reportes').html(`
         <div class="text-center py-5">
            <i class="bi bi-people text-muted opacity-25" style="font-size: 4rem;"></i>
            <p class="text-muted mt-3">No se encontraron clientes con pedidos en el rango seleccionado.</p>
         </div>
      `);
      $('#btnGenerarReporte').prop('disabled', false);
   }
}

const fn_reporte_produccion = async () => {  
   
   let fecIni    = $('#fecIniReporte').val().trim();
   let fecFin    = $('#fecFinReporte').val().trim();
   let idUsuario = $('#userOperativo').val();

   if(idUsuario == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un operador',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#usuarioProd').focus()
      return;
   }
   else if(fecIni == '' || fecFin == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el rango de fechas',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniReporte').focus()
      return;
   }
   else if(fecIni > fecFin) {
      ToastColor.fire({
         text: '¡Atención! La fecha inicial no puede ser mayor a la fecha final',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniReporte').focus()
      return;
   }
   else {
      let fechaInicio = new Date(fecIni);
      let fechaFin    = new Date(fecFin);

      // Diferencia en milisegundos → convertir a días
      let diffMs   = fechaFin - fechaInicio;
      let diffDias = diffMs / (1000 * 60 * 60 * 24);

      if (diffDias > 30) {
         ToastColor.fire({
            text: '¡Atención! El rango de fechas no puede ser mayor a 30 días',
            icon: 'warning',
            position: 'top',
            timerProgressBar: false
         });
         $('#fecIniReporte').focus();
         return;
      }
   }

   $('#btnGenerarReporte').prop('disabled', true);

   $('#vista_reportes').html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');

   let respuesta = await obtiene_reporte_produccion(fecIni, fecFin, idUsuario);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGenerarReporte').prop('disabled', false);
      $('#vista_reportes').html(`
         <div class="text-center py-5">
            <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
            <p class="text-muted">Hubo problemas</p>
         </div>
      `);
      return;
   }
   else {
      let arrReporte = await respuesta.data;
      pinta_reporte_produccion(arrReporte);
   }
}

const pinta_reporte_produccion = (res) => {
   const contenedor = $('#vista_reportes');
   const btn = $('#btnGenerarReporte');
    
   if (res.length > 0) {
      const cardsHtml = res.map(row => `
         <div class="col-xl-4 col-lg-4 col-sm-6 mb-4">
            <div class="card border-0 shadow-sm p-2 rounded-3">
               <div class="card-body">
                  <div class="row">
                     <div class="col-xl-3 col-md-3 col-3">
                        <div class="bg-primary-subtle rounded-3 p-2 me-3 text-center">
                           <i class="bi bi-box-seam text-primary fs-5"></i> 
                        </div>
                     </div>
                     <div class="col-xl-9 col-md-9 col-9">
                        <h6 class="card-subtitle text-muted text-uppercase fw-semibold mb-0 fs-8">
                           ${row.nom_producto_hist}
                        </h6>
                        <div class="d-flex align-items-baseline text-primary small fw-medium">
                           ${row.sku_hist}
                        </div>
                     </div>
                     <div class="col-12 align-items-baseline mt-3">
                        <h3 class="mb-0 fw-bold text-dark">${row.total}</h3>                     
                     </div>
                  </div>
               </div>
            </div>
         </div>
      `).join('');

      contenedor.html(`<div class="row mt-2 mb-4">${cardsHtml}</div>`);
   } 
   else {
      contenedor.html(`
         <div class="text-center py-5">
            <img src="assets/images/no_encontrado.png" style="max-width: 150px;" class="mb-3">
            <p class="text-muted">No se encontraron datos para este reporte</p>
         </div>
      `);
   }
   btn.prop('disabled', false);
}

window.TabReportes                 = TabReportes;
window.ModalVisualizacionReporte   = ModalVisualizacionReporte;

window.fn_reporte_utilidades       = fn_reporte_utilidades;
window.fn_reporte_mas_vendidos     = fn_reporte_mas_vendidos;
window.fn_reporte_stock_critico    = fn_reporte_stock_critico;
window.fn_reporte_mejores_clientes = fn_reporte_mejores_clientes;
window.fn_combo_operativos         = fn_combo_operativos;
window.fn_reporte_produccion       = fn_reporte_produccion;