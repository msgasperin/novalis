import { abrir_caja, cerrar_caja, obtener_historial_movimientos_caja, registrar_movimiento, eliminar_movimiento, obtener_mis_cortes_caja, obtener_movimientos_corte } from "./CajaServices.js";

let arrMovimientos = [];

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ABRIR CAJA +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalAbrirCaja = () => {
   let html = `
   <div class="modal fade shadow-lg modal-superior-blur" id="modalAbrirCaja" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content sombra-modal border-0">
            <div class="modal-body p-4 text-center">
               
               <!-- ÍCONO DE ENCABEZADO -->
               <div class="mb-3">
                  <div class="rounded-circle bg-primary-subtle mx-auto p-3 d-flex align-items-center justify-content-center" style="width: 70px; height: 70px;">
                     <i class="bi bi-door-open-fill text-primary fs-1"></i>
                  </div>
               </div>

               <h4 class="fw-bold text-dark mb-1">Apertura de Turno de Caja</h4>
               <p class="text-muted small mb-4">Ingresa el fondo inicial entregado en efectivo para operar durante el turno.</p>
               
               <div class="bg-light rounded-3 p-3 border mb-4 text-start">
                  <label class="text-muted fs-7 d-block text-uppercase fw-semibold mb-2">Fondo Inicial (Efectivo)</label>
                  <div class="input-group input-group-lg">
                     <span class="input-group-text bg-white border-end-0 fw-bold text-secondary">$</span>
                     <input type="number" step="0.50" min="0" class="form-control border-start-0 fw-bold fs-4 text-end" id="inpFondoInicial" name="fondo_inicial" autofocus  onkeypress="return fnValidaNumeros(event);" onpaste="return false;">
                  </div>
               </div>

               <div class="alert alert-info border-0 bg-info-subtle text-info-emphasis small py-2 mb-4 text-start">
                  <i class="bi bi-info-circle me-1"></i> Este monto formará parte de tu saldo base para dar cambio.
               </div>

               <div class="row g-2">
                  <div class="col-md-6">
                     <button type="button" class="btn btn-outline-secondary btn-redondo w-100" data-bs-dismiss="modal">
                        Cancelar
                     </button>
                  </div>
                  <div class="col-md-6">
                     <button type="button" class="btn btn-dark btn-lib btn-redondo w-100" id="btnAbreCaja" onclick="abre_caja();">
                        <i class="bi bi-key-fill me-1"></i> Abrir Caja
                     </button>
                  </div>
               </div>               

            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminExt').html(html);
   $('#modalAbrirCaja').modal('show');
}

const abre_caja = async () => {
   let fondoInicial = $('#inpFondoInicial').val().trim();
      
   if (parseFloat(fondoInicial < 0) || fondoInicial == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un monto mayor a 0',
         icon: 'warning'
      });
      $('#inpFondoInicial').focus();
      return;
   }
   
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se abrirá la caja con un fondo de $' + fondoInicial, 'question', 'Sí, abrir', 'Cancelar');
   
   if (!res.result) {
      $('#btnAbreCaja').prop('disabled', false);
      return;
   }

   $('#btnAbreCaja').prop('disabled', true);

   let objCaja = { fondoInicial, func: 'abrir_caja' };

   let respuesta = await abrir_caja(objCaja);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Caja Abierta!', '', 'success', 2500);
      $('#modalAbrirCaja').modal('hide');
      $('#estatusCaja').val('abierta');
      $('#idCaja').val(respuesta.data[0]);
      $('#aperturaCaja').val(respuesta.data[1]);

      TabRecepcion();
      $('#btnAbreCaja').prop('disabled', false);
   } 
   else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnAbreCaja').prop('disabled', false);
      return;
   }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CERRAR CAJA +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalCerrarCaja = (idCaja = 0) => {
   let html = `
   <div class="modal fade shadow-lg modal-superior-blur" id="modalCerrarCaja" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content sombra-modal border-0">
            <div class="modal-body p-4 text-center">
               
               <div class="mb-3">
                  <div class="rounded-circle bg-warning-subtle mx-auto p-3 d-flex align-items-center justify-content-center" style="width: 70px; height: 70px;">
                     <i class="bi bi-lock-fill text-warning-emphasis fs-1"></i>
                  </div>
               </div>

               <h4 class="fw-bold text-dark mb-1">Cierre de Turno y Arqueo</h4>
               <p class="text-muted small mb-4">Ingresa el conteo físico exacto acumulado en tu caja antes de finalizar.</p>
                  
               <div class="bg-light rounded-3 p-3 border mb-3 text-start">
                  
                  <div class="row align-items-center mb-3 pb-2 border-bottom">
                     <div class="col-6">
                        <span class="fw-bold text-dark fs-6 d-block"><i class="bi bi-cash-stack text-success me-1"></i> Efectivo</span>
                        <small class="text-muted fs-7">Dinero físico en cajón</small>
                     </div>
                     <div class="col-6">
                        <div class="input-group">
                           <span class="input-group-text bg-white border-end-0 fw-bold">$</span>
                           <input type="number" step="0.50" min="0" class="form-control border-start-0 fw-bold text-end" id="decEfectivo" name="decEfectivo" placeholder="0.00" onkeypress="return fnValidaNumeros(event);" onpaste="return false;">
                        </div>
                     </div>
                  </div>

                  <div class="row align-items-center mb-3 pb-2 border-bottom">
                     <div class="col-6">
                        <span class="fw-bold text-dark fs-6 d-block"><i class="bi bi-credit-card-2-front text-primary me-1"></i> Tarjetas</span>
                        <small class="text-muted fs-7">Vouchers liquidados</small>
                     </div>
                     <div class="col-6">
                        <div class="input-group">
                           <span class="input-group-text bg-white border-end-0 fw-bold">$</span>
                           <input type="number" step="0.50" min="0" class="form-control border-start-0 fw-bold text-end" id="decTarjeta" name="decTarjeta" placeholder="0.00" onkeypress="return fnValidaNumeros(event);" onpaste="return false;">
                        </div>
                     </div>
                  </div>

                  <div class="row align-items-center">
                     <div class="col-6">
                        <span class="fw-bold text-dark fs-6 d-block"><i class="bi bi-bank text-info me-1"></i> Transferencias</span>
                        <small class="text-muted fs-7">Comprobantes recibidos</small>
                     </div>
                     <div class="col-6">
                        <div class="input-group">
                           <span class="input-group-text bg-white border-end-0 fw-bold">$</span>
                           <input type="number" step="0.50" min="0" class="form-control border-start-0 fw-bold text-end" id="decTransferencia" name="decTransferencia" placeholder="0.00" onkeypress="return fnValidaNumeros(event);" onpaste="return false;">
                        </div>
                     </div>
                  </div>

               </div>

               <div class="text-start mb-4">
                  <label class="text-muted fs-7 text-uppercase fw-semibold mb-1">Observaciones / Notas de Cierre</label>
                  <textarea class="form-control form-control-sm" id="obsCierre" name="obsCierre" rows="2" placeholder="Opcional: Detalla cualquier incidencia del turno..."></textarea>
               </div>

               <div class="row g-2">
                  <div class="col-md-6">
                     <button type="button" class="btn btn-outline-secondary btn-redondo w-100" data-bs-dismiss="modal">
                        Cancelar
                     </button>
                  </div>
                  <div class="col-md-6">
                     <button type="submit" class="btn btn-dark btn-lib btn-redondo w-100" id="btnCerrarCaja" onclick="cierra_caja();">
                        <i class="bi bi-lock-fill me-1"></i> Finalizar Turno
                     </button>
                  </div>
               </div>

            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminExt').html(html);
   $('#modalCerrarCaja').modal('show');
}

const cierra_caja = async () => {
   
   let decEfectivo      = $('#decEfectivo').val().trim();
   let decTarjeta       = $('#decTarjeta').val().trim();
   let decTransferencia = $('#decTransferencia').val().trim();
   let obsCierre        = $('#obsCierre').val().trim();
      
   if ( (parseFloat(decEfectivo < 0) || decEfectivo == '') && (parseFloat(decTarjeta < 0) || decTarjeta == '') && (parseFloat(decTransferencia < 0) || decTransferencia == '') ) {
      ToastColor.fire({
         text: '¡Atención! Al menos uno de los conceptos debe ser mayor a 0',
         icon: 'warning'
      });
      return;
   }
   
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se cerrará la caja', 'question', 'Sí, cerrar', 'Cancelar');
   
   if (!res.result) {
      $('#btnCerrarCaja').prop('disabled', false);
      return;
   }

   $('#btnCerrarCaja').prop('disabled', true);

   let objCaja = { decEfectivo, decTarjeta, decTransferencia, obsCierre, func: 'cerrar_caja' };

   let respuesta = await cerrar_caja(objCaja);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Caja Cerrada!', '', 'success', 2500);
      $('#modalCerrarCaja').modal('hide');
      $('#estatusCaja').val('cerrada');
      $('#idCaja').val(respuesta.data[0]);
      $('#cierreCaja').val(respuesta.data[1]);

      TabRecepcion();
      $('#btnCerrarCaja').prop('disabled', false);
   } 
   else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnCerrarCaja').prop('disabled', false);
      return;
   }
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ MOVIMIENTOS MANUALES CAJA +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalMovimientosCaja = () => { 

   let html = `
   <div class="modal fade shadow-lg modal-superior-blur" id="modalMovimientosCaja" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-xl">
         <div class="modal-content sombra-modal border-0">
            
            <!-- HEADER MODAL -->
            <div class="modal-header border-bottom-0 pb-0 pt-4 px-4 align-items-center">
               <div class="d-flex align-items-center">
                  <div class="rounded-circle bg-primary-subtle p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                     <i class="bi bi-arrow-down-up text-primary fs-4"></i>
                  </div>
                  <div>
                     <h5 class="fw-bold text-dark mb-0">Movimientos Manuales de Caja</h5>
                     <p class="text-muted small mb-0">Gestión de entradas y salidas extraordinarias de efectivo/efectivo parcial</p>
                  </div>
               </div>
            </div>

            <div class="modal-body p-4">

               <div id="vistaHistorialMovimientos">
                  
                  <div class="row align-items-center g-2 mb-3">
                     <div class="col-md-5 col-12">
                        <div class="input-group input-group-sm">
                           <input type="date" class="form-control fw-semibold" id="filtroFechaMov" value="${fecActual}">
                           <button type="button" class="btn btn-secondary" onclick="obtiene_historial_movimientos_caja('tbodyMovimientos');">
                              <i class="bi bi-arrow-clockwise"></i>
                           </button>
                        </div>
                     </div>
                     <div class="col-md-7 col-12 text-md-end text-start">
                        <button class="btn btn-sm btn-outline-success btn-redondo me-1" onclick="ModalRegistroMovimientoCaja('ingreso');">
                           <i class="bi bi-plus-circle me-1"></i> Registrar Ingreso
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-redondo" onclick="ModalRegistroMovimientoCaja('egreso');">
                           <i class="bi bi-dash-circle me-1"></i> Registrar Egreso
                        </button>
                     </div>
                  </div>

                  <!-- METRICAS RÁPIDAS DEL DÍA -->
                  <div class="row g-2 mb-3">
                     <div class="col-6">
                        <div class="bg-success-subtle border border-success-subtle rounded-3 p-2 text-center">
                           <small class="text-success-emphasis fw-semibold text-uppercase d-block fs-7">Ingresos Manuales</small>
                           <span class="fs-5 fw-bold text-success" id="lblTotalIngresos">$0.00</span>
                        </div>
                     </div>
                     <div class="col-6">
                        <div class="bg-secondary-subtle border border-secondary-subtle rounded-3 p-2 text-center">
                           <small class="text-secondary-emphasis fw-semibold text-uppercase d-block fs-7">Egresos / Gastos</small>
                           <span class="fs-5 fw-bold text-secondary" id="lblTotalEgresos">$0.00</span>
                        </div>
                     </div>
                  </div>

                  <!-- TABLA DE MOVIMIENTOS -->
                  <div class="table-responsive rounded-3 border bg-white" style="max-height: 280px; overflow-y: auto;">
                     <table class="table table-hover align-middle mb-0" id="tablaMovimientos">
                        <thead class="bg-light sticky-top fs-8 text-uppercase text-muted">
                           <tr>
                              <th class="ps-3 py-2">Tipo / Hora</th>
                              <th class="ps-3 py-2">Registró</th>
                              <th class="py-2">Concepto</th>
                              <th class="py-2">Forma Pago</th>
                              <th class="py-2 text-end">Monto</th>
                              <th class="text-center py-2">Comprobante</th>
                              <th class="text-center py-2">Eliminar</th>
                           </tr>
                        </thead>
                        <tbody id="tbodyMovimientos" class="fs-7">
                           <tr>
                              <td colspan="5" class="text-center py-4 text-muted">
                                 <i class="bi bi-arrow-repeat spin fs-4 d-block mb-1"></i>
                                 Cargando movimientos...
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

               </div>

            </div>

            <div class="modal-footer border-top-0 pt-0 px-4 pb-3">
               <button type="button" class="btn btn-sm btn-outline-secondary btn-redondo" data-bs-dismiss="modal">Cerrar Pantalla</button>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalMovimientosCaja').modal('show');
   obtiene_historial_movimientos_caja('tbodyMovimientos');
}

const obtiene_historial_movimientos_caja = async (containerId) => {

   let fecha      = $('#filtroFechaMov').val().trim();
   let html       = '';
   arrMovimientos = [];
   
   if(fecha == '') {
      html = 
      `<tr>
         <td colspan="7" class="text-center py-4 text-muted">
            <i class="bi bi-exclamation-circle fs-4 d-block mb-1 text-warning"></i>
            Debes seleccionar una fecha para obtener el historial
         </td>
      </tr>`;

      $('#'+containerId).html(html);
      return;
   }
   
   let respuesta = await obtener_historial_movimientos_caja(fecha);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else if(respuesta.data.length == 0) {
      html = 
      `<tr>
         <td colspan="7" class="text-center py-4 text-muted">
            <i class="bi bi-calendar-x fs-4 d-block mb-1 text-danger"></i>
            No se encontraron movimientos en esa fecha
         </td>
      </tr>`;
      $('#'+containerId).html(html);
      return;
   }
   else {
      arrMovimientos = await respuesta.data;
      pinta_movimientos_caja(arrMovimientos, containerId);
   }
}

const pinta_movimientos_caja = (data, containerId) => {

   let html          = '';
   let icon          = '';
   let totalIngresos = 0;
   let totalEgresos  = 0;

   data.forEach(row => {

      if(row.tipo == 'ingreso') {
         icon = '<i class="bi bi-arrow-right-circle text-success" title="Ingreso"></i>';
         totalIngresos += parseFloat(row.monto);
      }
      else {
      icon = '<i class="bi bi-arrow-left-circle text-danger" title="Egreso"></i>';
      totalEgresos += parseFloat(row.monto);
      }      

      html += 
      `<tr>
         <td class="ps-3 py-2">${icon} ${row.hora}</td>
         <td class="py-2">${row.usuario_registro}</td>
         <td class="py-2">${row.concepto}</td>
         <td class="py-2">${row.forma_pago}</td>
         <td class="py-2 text-end">$${row.monto}</td>
         <td class="text-center py-2">${row.comprobante ?? ''}</td>
         <td class="text-center py-2">
            <button type="button" class="btn btn-sm btn-outline-danger btn-redondo btnAccionMov" onclick="elimina_movimiento(${row.id_movimiento}, '${row.tipo}', '${row.monto}');">
               <i class="bi bi-trash"></i>
            </button>
         </td>
      </tr>`;
   });

   $('#' + containerId).html(html);
   $('#lblTotalIngresos').html('$'+parseFloat(totalIngresos).toFixed(2));
   $('#lblTotalEgresos').html('$'+parseFloat(totalEgresos).toFixed(2));
}

const ModalRegistroMovimientoCaja = (tipoMovimiento) => {

   let fecha = $('#filtroFechaMov').val().trim();

   if (fecha == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar la fecha en la que registrarás el movimiento',
         icon: 'warning'
      });
      $('#filtroFechaMov').focus()
      return;
   }
   
   let html = `
   <div class="modal fade shadow-lg modal-superior-blur" id="modalRegistroMovimientoCaja" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content sombra-modal border-0">
            
            <!-- HEADER MODAL -->
            <div class="modal-header border-bottom-0 pb-0 pt-4 px-4 align-items-center">
               <div class="d-flex align-items-center">
                  <div class="rounded-circle bg-primary-subtle p-2 me-3 d-flex align-items-center justify-content-center" style="width: 30px; height: 30px;">
                     <i class="bi bi-arrow-down-up text-primary fs-6"></i>
                  </div>
                  <div>
                     <h5 class="fw-bold text-dark mb-0">Registrar ${tipoMovimiento}</h5>
                  </div>
               </div>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body p-4">               
                  
               <div class="bg-light rounded-3 p-3 border mb-3">
                  <div class="d-flex align-items-center mb-3 pb-2 border-bottom">
                     <span class="badge" id="badgeTipoMov"></span>
                     <h6 class="fw-bold mb-0 ms-2 text-dark" id="tituloFormMovimiento">Nuevo Registro</h6>
                     <div class="small text-muted">${fecha}</div>
                  </div>

                  <div class="row g-3">
                     <div class="col-md-6">
                        <label class="form-label text-muted fs-7 text-uppercase fw-semibold mb-1">Monto ($) *</label>
                        <div class="input-group">
                           <span class="input-group-text bg-white border-end-0 fw-bold">$</span>
                           <input type="number" step="0.50" min="0.50" class="form-control border-start-0 fw-bold text-end" id="montoMovimiento" name="montoMovimiento" placeholder="0.00" required onkeypress="return fnValidaNumeros(event);" onpaste="return false;">
                        </div>
                     </div>

                     <div class="col-md-6">
                        <label class="form-label text-muted fs-7 text-uppercase fw-semibold mb-1">Forma de Pago *</label>
                        <select class="form-select" id="formaPagoMov" name="formaPagoMov" required>
                           <option value="EFECTIVO" selected>EFECTIVO</option>
                           <option value="TARJETA DE CREDITO">TARJETA DE CRÉDITO</option>
                           <option value="TARJETA DE DEBITO">TARJETA DE DÉBITO</option>
                           <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                        </select>
                     </div>

                     <div class="col-12">
                        <label class="form-label text-muted fs-7 text-uppercase fw-semibold mb-1">Concepto / Motivo *</label>
                        <input type="text" class="form-control" id="conceptoMovimiento" name="conceptoMovimiento" placeholder="Ej. Fondo para cambio, compra de papelería, garrafón de agua..." maxlength="255" required>
                     </div>

                     <div class="col-12">
                        <label class="form-label text-muted fs-7 text-uppercase fw-semibold mb-1">No. Comprobante / Ticket (Opcional)</label>
                        <input type="text" class="form-control form-control-sm" id="comprobanteMovimiento" name="comprobanteMovimiento" placeholder="Ej. Folio de factura, ticket o nota" maxlength="100">
                     </div>
                  </div>

                  <div class="row g-2 mt-3">
                     <div class="col-6">
                        <button type="button" class="btn btn-outline-secondary btn-redondo w-100" data-bs-dismiss="modal">
                           <i class="bi bi-arrow-left me-1"></i> Volver a Historial
                        </button>
                     </div>
                     <div class="col-6">
                        <button type="button" class="btn btn-dark btn-lib btn-redondo w-100" id="btnGuardarMov" onclick="registra_movimiento('${tipoMovimiento}');">
                           <i class="bi bi-check-circle-fill me-1"></i> Guardar ${tipoMovimiento}
                        </button>
                     </div>
                  </div>
               </div>               

            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdminExt').html(html);
   $('#modalRegistroMovimientoCaja').modal('show');
}

const registra_movimiento = async (tipoMovimiento) => {

   let montoMovimiento       = $('#montoMovimiento').val().trim();   
   let formaPagoMov          = $('#formaPagoMov').val().trim();
   let conceptoMovimiento    = $('#conceptoMovimiento').val().trim();
   let comprobanteMovimiento = $('#comprobanteMovimiento').val().trim();
    
   if(parseFloat(montoMovimiento < 0) || montoMovimiento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un monto mayor a 0',
         icon: 'warning'
      });
      $('#montoMovimiento').focus();
      return;
   }
   else if(conceptoMovimiento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el concepto o motivo del movimiento',
         icon: 'warning'
      });
      $('#conceptoMovimiento').focus();
      return;
   }
   
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El movimiento por $' + montoMovimiento + ' será registrado', 'question', 'Sí, registrar', 'Cancelar');
   
   if (!res.result) {
      $('#btnGuardarMov').prop('disabled', false);
      return;
   }

   $('#btnGuardarMov').prop('disabled', true);

   let objMovimiento = { tipoMovimiento, montoMovimiento, formaPagoMov, conceptoMovimiento, comprobanteMovimiento, func: 'registrar_movimiento' };

   let respuesta = await registrar_movimiento(objMovimiento);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      showMessageSwalTimer('¡Movimiento registrado!', '', 'success', 2500);
      $('#modalRegistroMovimientoCaja').modal('hide');

      let objArrMovimiento = {};
      objArrMovimiento.id_movimiento    = respuesta.data[0];
      objArrMovimiento.sucursal_id      = respuesta.data[1];
      objArrMovimiento.caja_id          = respuesta.data[2];
      objArrMovimiento.tipo             = tipoMovimiento;
      objArrMovimiento.concepto         = conceptoMovimiento;
      objArrMovimiento.monto            = montoMovimiento;
      objArrMovimiento.forma_pago       = formaPagoMov;
      objArrMovimiento.comprobante      = comprobanteMovimiento;
      objArrMovimiento.fecha_movimiento = respuesta.data[3];
      objArrMovimiento.hora             = respuesta.data[4];
      objArrMovimiento.usuario_registro = respuesta.data[5];

      arrMovimientos.push(objArrMovimiento);

      pinta_movimientos_caja(arrMovimientos, 'tbodyMovimientos');
   } 
   else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGuardarMov').prop('disabled', false);
      return;
   }
}

const elimina_movimiento = async (idMovimiento, tipo, monto) => {

   if(idMovimiento == '' || parseInt(idMovimiento) == 0) {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes, reinicia y vuelve a intentarlo',
         icon: 'warning'
      });      
      return;
   }
   
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El movimiento de ' + tipo + ' por $' + monto + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnAccionMov').prop('disabled', false);
      return;
   }

   $('.btnAccionMov').prop('disabled', true);

   let objMovimiento = { idMovimiento, tipo, monto, func: 'eliminar_movimiento' };

   let respuesta = await eliminar_movimiento(objMovimiento);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      showMessageSwalTimer('¡Movimiento eliminado!', '', 'success', 2500);
      arrMovimientos = arrMovimientos.filter(mov => mov.id_movimiento != idMovimiento);      
      pinta_movimientos_caja(arrMovimientos, 'tbodyMovimientos');
   } 
   else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnAccionMov').prop('disabled', false);
      return;
   }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CORTES DE CAJA +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ModalMiCorte = () => {
   
   let html = `
   <div class="modal fade shadow-lg modal-superior-blur" id="modalMiCorte" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-xl">
         <div class="modal-content sombra-modal border-0">
            
            <!-- HEADER -->
            <div class="modal-header border-bottom-0 pb-0 pt-4 px-4 align-items-center">
               <div class="d-flex align-items-center">
                  <div class="rounded-circle bg-dark-subtle p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                     <i class="bi bi-receipt-cutoff text-dark fs-4"></i>
                  </div>
                  <div>
                     <h5 class="fw-bold text-dark mb-0">Mis Cortes de Caja</h5>
                     <p class="text-muted small mb-0">Consulta y reimpresión de mis comprobantes de turno</p>
                  </div>
               </div>
            </div>

            <div class="modal-body p-4">

               <!-- FILTRO RÁPIDO DE FECHA -->
               <div class="bg-light rounded-3 p-3 border mb-3">
                  <div class="row g-2 align-items-end">
                     <div class="col-md-5 col-6">
                        <label class="form-label text-muted fs-7 text-uppercase fw-semibold mb-1">Fecha</label>
                        <input type="date" class="form-control form-control-sm fw-semibold" id="filtroMiCorteFecha" value="${fecActual}">
                     </div>
                     <div class="col-md-7 col-6 text-end">
                        <button type="button" class="btn btn-sm btn-dark btn-redondo" onclick="obtiene_mis_cortes_caja('tbodyMisCortes');">
                           <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
                        </button>
                     </div>
                  </div>
               </div>

               <!-- TABLA DE MIS CORTES -->
               <div class="table-responsive rounded-3 border bg-white" style="max-height: 320px; overflow-y: auto;">
                  <table class="table table-hover align-middle mb-0" id="tablaMisCortes">
                     <thead class="bg-light sticky-top fs-7 text-uppercase text-muted">
                        <tr>
                           <th class="ps-3 py-2">Folio / Horario</th>
                           <th class="py-2 text-end">Esperado</th>
                           <th class="py-2 text-end">Declarado</th>
                           <th class="py-2 text-end">Diferencia</th>
                           <th class="text-center py-2 pe-3">Acción</th>
                        </tr>
                     </thead>
                     <tbody id="tbodyMisCortes" class="fs-7">
                        <tr>
                           <td colspan="6" class="text-center py-4 text-muted">
                              <i class="bi bi-arrow-repeat spin fs-4 d-block mb-1"></i>
                              Cargando mis cortes del día...
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>

            </div>

            <!-- FOOTER -->
            <div class="modal-footer border-top-0 pt-0 px-4 pb-3">
               <button type="button" class="btn btn-sm btn-outline-secondary btn-redondo" data-bs-dismiss="modal">Cerrar</button>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalMiCorte').modal('show');
   obtiene_mis_cortes_caja('tbodyMisCortes');
}

const obtiene_mis_cortes_caja = async (containerId) => {
   let fecha = $('#filtroMiCorteFecha').val().trim();
   let html  = '';
   
   // Validación estricta: debe existir fecha seleccionada
   if (fecha === '') {
      html = 
      `<tr>
         <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-exclamation-circle fs-4 d-block mb-1 text-warning"></i>
            Debes seleccionar una fecha para consultar tus cortes
         </td>
      </tr>`;
      $('#' + containerId).html(html);
      return;
   }
   
   let respuesta = await obtener_mis_cortes_caja(fecha);

   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrió un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else if (respuesta.data.length == 0) {
      html = 
      `<tr>
         <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-calendar-x fs-4 d-block mb-1 text-danger"></i>
            No se encontraron cortes de caja en la fecha seleccionada
         </td>
      </tr>`;
      $('#' + containerId).html(html);
      return;
   }
   else {
      let data = await respuesta.data;
      pinta_mis_cortes_caja(data, containerId);
   }
}

const pinta_mis_cortes_caja = (data, containerId) => {
   let html = '';

   data.forEach(row => {

      // Diferencia específica de EFECTIVO
      let badgeDifEfectivo = '';

      if (row.diferencia === 0) {
         badgeDifEfectivo = `<span class="badge bg-success-subtle text-success border border-success-subtle fs-7">$0.00</span>`;
      } 
      else if (row.diferencia < 0) {
         badgeDifEfectivo = `<span class="badge bg-danger-subtle text-danger border border-danger-subtle fs-7">$${row.diferencia}</span>`;
      } 
      else {
         badgeDifEfectivo = `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle fs-7">+$${row.diferencia}</span>`;
      }

      html += 
      `<tr>
         <td class="ps-3 py-2">
            <span class="fw-bold text-dark">#${row.id_caja}</span>
            <small class="d-block text-muted fs-7">${row.hora_apertura} - ${row.hora_cierre ?? 'En curso'}</small>
            ${row.observaciones ? `<small class="d-block text-secondary fst-italic fs-7 text-truncate" style="max-width: 180px;" title="${row.observaciones}">${row.observaciones}</small>` : ''}
         </td>
         
         <!-- Esperado con desglose en pequeño -->
         <td class="py-2 text-end align-middle">
            <span class="fw-semibold text-dark">$${row.total_esperado_sistema}</span>
            <div class="lh-2 mt-1 fs-8">
               <span class="text-muted d-block">
                  <b>Fondo inicial: $${row.fondo_inicial}</b>
               </span>
               <span class="text-muted d-block">
                  Efec: $${row.sistema_efectivo} | Tarj: $${row.sistema_tarjeta} | Transf: $${row.sistema_transferencia}
               </span>
               ${row.sistema_ingresos > 0 ? `<span class="text-success">Ingresos: +$${row.sistema_ingresos}</span>` : ''}
               ${row.sistema_egresos > 0 ? `<span class="text-danger ms-2">Egresos: -$${row.sistema_egresos}</span>` : ''}
            </div>
         </td>

         <!-- Declarado con desglose en pequeño -->
         <td class="py-2 text-end align-middle">
            <span class="fw-semibold text-dark">$${row.total_declarado}</span>
            <div class="lh-2 mt-1 fs-8">
               <span class="text-muted d-block">Efec: $${row.declarado_efectivo}</span>
               <span class="text-muted d-block">Tarj: $${row.declarado_tarjeta} | Transf: $${row.declarado_transferencia}</span>
            </div>
         </td>

         <!-- Diferencia enfocada en Efectivo -->
         <td class="py-2 text-end align-middle">
            ${badgeDifEfectivo}
         </td>

         <td class="text-center py-2 pe-3 align-middle">
            <div class="btn-group btn-group-sm" role="group">
               <button type="button" class="btn btn-sm btn-outline-dark rounded-circle me-1" onclick="ModalMovimientosCorteCaja(${row.id_caja});" title="Ver Movimientos">
                  <i class="bi bi-list-task"></i>
               </button>
               <a href="reportes/corte?kq=${row.key_query}" target="_blank" class="btn btn-sm btn-outline-dark rounded-circle" title="Imprimir ticket">
                  <i class="bi bi-printer"></i>
               </a>
            </div>
         </td>
      </tr>`;
   });

   $('#' + containerId).html(html);
}

const ModalMovimientosCorteCaja = (idCaja) => {
   
   let html = `
   <div class="modal fade shadow-lg modal-superior-blur" id="modalDetalleCorte" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered modal-xl">
         <div class="modal-content sombra-modal border-0">
            
            <!-- HEADER -->
            <div class="modal-header border-bottom-0 pb-2 pt-4 px-4 align-items-center">
               <div class="d-flex align-items-center">
                  <div class="rounded-circle bg-light p-2 me-3 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px;">
                     <i class="bi bi-receipt text-dark fs-5"></i>
                  </div>
                  <div>
                     <h5 class="fw-bold text-dark mb-0">Detalle de Turno - Caja #${idCaja}</h5>
                     <p class="text-muted small mb-0">Auditoría de ingresos y egresos de la sesión</p>
                  </div>
               </div>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- BODY CON PESTAÑAS -->
            <div class="modal-body p-4 pt-2">
               
               <!-- NAVEGACIÓN DE PESTAÑAS -->
               <ul class="nav nav-tabs nav-tabs-bordered mb-3" id="corteTabs" role="tablist">
                  <li class="nav-item" role="presentation">
                     <button class="nav-link active fw-semibold text-dark fs-7" id="tab-pagos-tab" data-bs-toggle="tab" data-bs-target="#tab-pagos" type="button" role="tab">
                        <i class="bi bi-credit-card-2-front me-1 text-primary"></i> Cobros / Abonos 
                        <span class="badge bg-primary-subtle text-primary border ms-1" id="badgeTotalPagos">0</span>
                     </button>
                  </li>
                  <li class="nav-item" role="presentation">
                     <button class="nav-link fw-semibold text-dark fs-7" id="tab-movs-tab" data-bs-toggle="tab" data-bs-target="#tab-movs" type="button" role="tab">
                        <i class="bi bi-arrow-down-up me-1 text-warning"></i> Movimientos Manuales 
                        <span class="badge bg-secondary-subtle text-secondary border ms-1" id="badgeTotalMovs">0</span>
                     </button>
                  </li>
               </ul>

               <!-- CONTENIDO DE LAS PESTAÑAS -->
               <div class="tab-content" id="corteTabsContent">
                  
                  <!-- TAB 1: PAGOS DE ÓRDENES -->
                  <div class="tab-pane fade show active" id="tab-pagos" role="tabpanel">
                     <div class="table-responsive rounded-3 border bg-white" style="max-height: 320px; overflow-y: auto;">
                        <table class="table table-hover align-middle mb-0">
                           <thead class="bg-light sticky-top fs-7 text-uppercase text-muted">
                              <tr>
                                 <th class="ps-3 py-2">Fecha / Hora</th>
                                 <th>Atendió</th>
                                 <th>Método</th>
                                 <th>Referencia</th>
                                 <th class="text-end pe-3">Monto</th>
                              </tr>
                           </thead>
                           <tbody id="tbodyPagos" class="fs-7">
                              <tr><td colspan="5" class="text-center py-4 text-muted"><i class="bi bi-arrow-repeat spin fs-4 d-block"></i> Cargando...</td></tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <!-- TAB 2: MOVIMIENTOS MANUALES -->
                  <div class="tab-pane fade" id="tab-movs" role="tabpanel">
                     <div class="table-responsive rounded-3 border bg-white" style="max-height: 320px; overflow-y: auto;">
                        <table class="table table-hover align-middle mb-0">
                           <thead class="bg-light sticky-top fs-7 text-uppercase text-muted">
                              <tr>
                                 <th class="ps-3">Hora</th>
                                 <th>Tipo</th>
                                 <th>Concepto</th>
                                 <th>Forma Pago</th>
                                 <th class="text-end pe-3">Monto</th>
                              </tr>
                           </thead>
                           <tbody id="tbodyMovimientos" class="fs-7">
                              <tr><td colspan="5" class="text-center py-4 text-muted"><i class="bi bi-arrow-repeat spin fs-4 d-block"></i> Cargando...</td></tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

               </div>
            </div>

            <div class="modal-footer border-top-0 pt-0 px-4 pb-3">
               <button type="button" class="btn btn-outline-secondary btn-redondo" data-bs-dismiss="modal">Cerrar</button>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdminExt').html(html);
   $('#modalDetalleCorte').modal('show');
   obtiene_movimientos_corte(idCaja, 'tbodyPagos', 'tbodyMovimientos');
}

const obtiene_movimientos_corte = async (idCaja, containerPagos, containerMovimientos) => {
   
   let html = '';

   if (idCaja === '' || idCaja == 0) {
      html = 
      `<tr>
         <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-exclamation-circle fs-4 d-block mb-1 text-warning"></i>
            Faltó un parámetro importante para obtener los datos
         </td>
      </tr>`;
      $('#' + containerPagos).html(html);
      $('#' + containerMovimientos).html(html);
      return;
   }
   
   let respuesta = await obtener_movimientos_corte(idCaja);

   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrió un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else if (respuesta.data.pagos == 0 && respuesta.data.movimientos_manuales == 0) {
      html = 
      `<tr>
         <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-calendar-x fs-4 d-block mb-1 text-danger"></i>
            No se encontraron movimientos registrados en el corte seleccionado
         </td>
      </tr>`;
      $('#' + containerPagos).html(html);
      $('#' + containerMovimientos).html(html);
      return;
   }
   else {
      let data = await respuesta.data;
      pinta_movimientos_corte_caja(data, containerPagos, containerMovimientos);
   }
}

const pinta_movimientos_corte_caja = (data, containerPagos, containerMovimientos) => {
   
   const { pagos, movimientos_manuales } = data;

   // 1. PINTAR TABLA DE PAGOS
   $('#badgeTotalPagos').text(pagos.length);
   if (pagos.length === 0) {
      $('#tbodyPagos').html('<tr><td colspan="5" class="text-center py-4 text-muted">No hay cobros registrados en esta caja</td></tr>');
   } else {
      let htmlPagos = '';
      pagos.forEach(p => {
         htmlPagos += `
         <tr>
            <td class="text-nowrap text-center fs-7">${p.fecha_pago}</td>
            <td>${p.usuario_recibio}</td>
            <td class="text-center"><span class="badge bg-light text-dark border text-capitalize">${p.metodo_pago}</span></td>
            <td class="text-muted fs-7">${p.referencia_pago || '-'}</td>
            <td class="text-end pe-3 fw-semibold text-success">+$${parseFloat(p.monto).toFixed(2)}</td>
         </tr>`;
      });
      $('#'+containerPagos).html(htmlPagos);
   }

   // 2. PINTAR TABLA DE MOVIMIENTOS MANUALES
   $('#badgeTotalMovs').text(movimientos_manuales.length);
   if (movimientos_manuales.length === 0) {
      $('#tbodyMovimientos').html('<tr><td colspan="5" class="text-center py-4 text-muted">No hay movimientos manuales registrados</td></tr>');
   } else {
      let htmlMovs = '';
      movimientos_manuales.forEach(m => {
         let esIngreso = m.tipo === 'ingreso';
         let badgeTipo = esIngreso 
            ? `<span class="badge bg-success-subtle text-success border border-success-subtle">Ingreso</span>`
            : `<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Egreso</span>`;

         htmlMovs += `
         <tr>
            <td class="text-nowrap text-center fs-7">${m.fecha_movimiento}</td>
            <td class="text-center">${badgeTipo}</td>
            <td>${m.concepto}</td>
            <td class="text-center">${m.forma_pago}</td>
            <td class="text-end pe-3 fw-semibold ${esIngreso ? 'text-success' : 'text-danger'}">
               ${esIngreso ? '+' : '-'}$${parseFloat(m.monto).toFixed(2)}
            </td>
         </tr>`;
      });
      $('#'+containerMovimientos).html(htmlMovs);
   }
}


window.ModalAbrirCaja                     = ModalAbrirCaja;
window.ModalCerrarCaja                    = ModalCerrarCaja;
window.ModalMovimientosCaja               = ModalMovimientosCaja;
window.ModalRegistroMovimientoCaja        = ModalRegistroMovimientoCaja;
window.ModalMiCorte                       = ModalMiCorte;
window.ModalMovimientosCorteCaja          = ModalMovimientosCorteCaja;

window.abre_caja                          = abre_caja;
window.cierra_caja                        = cierra_caja;
window.obtiene_historial_movimientos_caja = obtiene_historial_movimientos_caja;
window.registra_movimiento                = registra_movimiento;
window.elimina_movimiento                 = elimina_movimiento;
window.obtiene_mis_cortes_caja            = obtiene_mis_cortes_caja;
window.obtiene_movimientos_corte          = obtiene_movimientos_corte;