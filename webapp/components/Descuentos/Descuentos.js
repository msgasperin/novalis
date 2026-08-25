import { obtiene_descuentos, guardar_descuento, eliminar_descuento } from "./DescuentosServices.js";

let arrDescuentos = [];

const TabDescuentos = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2 fw-bold">
         <div class="fs-4"> <i class="bi bi-percent"></i> Descuentos</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevoDescuento" onclick="ModalFormDescuento(0, 0,'');"><i class="bi bi-plus-lg"></i> Nuevo Descuento</button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 col-md-3" align="right">
         <div class="input-group">
            <input type="text" name="inpBusquedaDescuento" id="inpBusquedaDescuento" class="form-control border-end-0" placeholder="Buscar descuento" onkeyUp="fn_buscar_descuento();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="containerListDescuento"></div>      
   </div>`;

   $('#containerMain').html(html);
   
   listar_descuentos();
}

const ModalFormDescuento = (idDescuento, conceptoDescuento) => {

   let descuentoSeleccionado = arrDescuentos.filter(descuento => descuento.id == idDescuento);

   let titulo;
   let concepto   = '';
   let porcentaje = '';

   if(idDescuento > 0) {
      titulo     = 'Editar Descuento: '+ conceptoDescuento;
      concepto   = descuentoSeleccionado[0].concepto_desc;
      porcentaje = descuentoSeleccionado[0].porcentaje_desc;
   }
   else {
      titulo = 'Registrar Nuevo Descuento';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormDescuentos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${titulo}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="col-12 mt-3">
                     <b>Concepto del descuento *</b>
                     <input type="text" name="conceptoDescuento" id="conceptoDescuento" class="form-control" maxlength="150" value="${concepto}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>% Porcentaje del descuento *</b>
                     <input type="text" inputmode="numeric" name="porcentajeDescuento" id="porcentajeDescuento" class="form-control" maxlength="3" value="${porcentaje}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
               </div>
            </div>
            <div class="modal-footer" align="right">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnSaveDescuento" onclick="fn_guardar_descuento('${idDescuento}');">
                <i class="bi bi-save"></i> Guardar
              </button> 
              <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalFormDescuentos').modal('show');   
}

const listar_descuentos = async () => {
   activarLoad('Cargando descuentos...');
   let respuesta = await obtiene_descuentos();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrDescuentos = respuesta.data;
      pinta_listado_descuentos(arrDescuentos);
   }
}

const pinta_listado_descuentos = (data) => {
   if(data.length == 0) {
      $('#containerListDescuento').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron descuentos registrados</div>');
      closeLoad();
      return;
   }
   
   let html = `<div class="row">`;
   data.map((row, i) => {
      html+=`
      <div class="col-12 col-sm-3 col-md-3 mt-2" id="cardDescuento${row.id}">
         <div class="card mb-3 shadow">
            <div class="card-body">
               <div class="row fs-8">
                  <div class="col-12 col-sm-2 mt-2 text-center">
                     <i class="bi bi-percent fs-4 text-secondary"></i>
                  </div>
                  <div class="col-12 col-sm-10 mt-2">
                     <div class="mt-1 fs-6"><b>${row.concepto_desc}</b></div>
                     <div>${row.porcentaje_desc}% de descuento.</div>
                  </div>
               </div>
            </div>
            <div class="card-footer bg-white border-top-0 pb-2">
               <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormDescuento(${row.id},'${row.concepto_desc}');">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarDescuento" title="Eliminar" onclick="fn_eliminar_descuento(${row.id},'${row.concepto_desc}');">
                     <i class="bi bi-trash"></i>
                  </button>               
               </div>
            </div>
         </div>
      </div>`;
   });

   html+=`</div>`;
   $('#containerListDescuento').html(html);
   closeLoad();
}

const fn_guardar_descuento = async (idDescuento) => {

   let conceptoDescuento   = $('#conceptoDescuento').val().trim();
   let porcentajeDescuento = $('#porcentajeDescuento').val().trim();
   let msjAccion           = '';

   if (conceptoDescuento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el concepto del descuento',
         icon: 'warning'
      });
      $('#conceptoDescuento').focus();
      return;
   }
   else if (porcentajeDescuento == '' || parseInt(porcentajeDescuento) <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un porcentaje de descuento y este debe ser mayor a 0',
         icon: 'warning'
      });
      $('#porcentajeDescuento').focus();
      return;
   }
      
   const objDescuento = { func: 'guardar_descuento', idDescuento, conceptoDescuento, porcentajeDescuento };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información del descuento ' + conceptoDescuento + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnSaveDescuento').prop('disabled', false);
      return;
   }

   $('#btnSaveDescuento').prop('disabled', true);
   let respuesta = await guardar_descuento(objDescuento);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      
      idDescuento > 0 ? msjAccion = 'Información actualizada' : msjAccion = 'Descuento guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormDescuentos').modal('hide');
      listar_descuentos();
      $('#btnSaveDescuento').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnSaveDescuento').prop('disabled', false);
      return;
   }
}

const fn_eliminar_descuento = async (idDescuento, conceptoDescuento) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El descuento: ' + conceptoDescuento + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarDescuento').prop('disabled', false);
      return;
   }

   $('.btnEliminarDescuento').prop('disabled', true);
   let respuesta = await eliminar_descuento(idDescuento, conceptoDescuento);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Descuento eliminado correctamente', '', 'success', 2500);
      $('#cardDescuento'+idDescuento).remove();
      arrDescuentos = arrDescuentos.filter(descuento => descuento.id != idDescuento);
      $('.btnEliminarDescuento').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarDescuento').prop('disabled', false);
      return;
   }
}

const fn_buscar_descuento = () => {
   let busqueda = $('#inpBusquedaDescuento').val().trim();

   const filtrado = arrDescuentos.filter(descuento => 
      descuento.concepto_desc.toLowerCase().includes(busqueda.toLowerCase())
   );
   pinta_listado_descuentos(filtrado);
}

// Interfaces
window.TabDescuentos         = TabDescuentos;
window.ModalFormDescuento    = ModalFormDescuento;

// Funciones
window.fn_eliminar_descuento = fn_eliminar_descuento
window.fn_guardar_descuento  = fn_guardar_descuento; 
window.fn_buscar_descuento   = fn_buscar_descuento;
