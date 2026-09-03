import { abrir_caja, cerrar_caja } from "./CajaServices.js";


// 1. MODAL APERTURA DE CAJA
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

// 2. MODAL CIERRE Y ARQUEO DE CAJA "A CIEGAS"
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

window.ModalAbrirCaja  = ModalAbrirCaja;
window.ModalCerrarCaja = ModalCerrarCaja;

window.abre_caja       = abre_caja;
window.cierra_caja     = cierra_caja;