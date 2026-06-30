import { obtiene_sucursales, guardar_sucursal, eliminar_sucursal } from "./SucursalesServices.js";

let arrSucursales = [];

const TabSucursales = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-shop-window"></i> Sucursales</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevaSucursal" onclick="ModalFormSucursal(0,'');"><i class="bi bi-plus-lg"></i> Nueva Sucursal</button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 col-md-3" align="right">
         <div class="input-group">
            <input type="text" name="inpBusquedaSucursal" id="inpBusquedaSucursal" class="form-control border-end-0" placeholder="Buscar sucursal" onkeyUp="fn_buscar_sucursal();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listar_sucursales"></div>      
   </div>`;

   $('#containerMain').html(html);
   
   listar_sucursales('listar_sucursales');
}

const ModalFormSucursal = (idSucursal, nomSucursal) => {

   let sucursalSeleccionada = arrSucursales.filter(sucursal => sucursal.id == idSucursal);

   let titulo;
   let nombre    = '';
   let direccion = '';
   let telefono  = '';

   if(idSucursal > 0) {
      titulo    = 'Editar Sucursal: '+ nomSucursal;
      nombre    = sucursalSeleccionada[0].nombre;
      direccion = sucursalSeleccionada[0].direccion;
      telefono  = sucursalSeleccionada[0].telefono;
   }
   else {
      titulo = 'Registrar Nueva Sucursal';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormSucursal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen-md-down">
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
                     <b>Nombre de la sucursal *</b>
                     <input type="text" name="nomSucursal" id="nomSucursal" class="form-control" maxlength="250" value="${nombre}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Dirección *</b>
                     <textarea name="direccionSucursal" id="direccionSucursal" class="form-control" rows="3" maxlength="400">${direccion}</textarea>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Teléfono</b>
                     <input type="tel" name="telSucursal" id="telSucursal" class="form-control" maxlength="10" value="${telefono}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
               </div>
            </div>
            <div class="modal-footer" align="right">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnGuardarSucursal" onclick="fn_guardar_sucursal('${idSucursal}');">
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
   $('#modalFormSucursal').modal('show');
}

const listar_sucursales = async (containerId) => {
   activarLoad('Cargando sucursales...');
   let respuesta = await obtiene_sucursales();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrSucursales = respuesta.data;
      pinta_listado_sucursales(containerId, respuesta.data);
   }
}

const pinta_listado_sucursales = (containerId, data) => {
   if(data.length == 0) {
      $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron sucursales registradas</div>');
      closeLoad();
      return;
   }
   
   let html = `<div class="row">`;
   data.map((row, i) => {
      html+=`
      <div class="col-12 col-sm-3 col-md-3 mt-2" id="cardSucursal${row.id}">
         <div class="card mb-3 shadow">
            <div class="card-body">
               <div class="row fs-8">
                  <div class="col-12 col-sm-2 mt-2 text-center">
                     <i class="bi bi-shop fs-4 text-secondary"></i>
                  </div>
                  <div class="col-12 col-sm-10 mt-2">
                     <div class="mt-1"><b>${row.nombre}</b></div>
                     <div class="mt-1"><b>${row.direccion}</b></div>
                     <div class="text-muted fs-8">${row.telefono}</div>
                  </div>
               </div>
            </div>
            <div class="card-footer bg-white border-top-0 pb-2">
               <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormSucursal(${row.id},'${row.nombre}');">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarSucursal" title="Eliminar" onclick="fn_eliminar_sucursal(${row.id},'${row.nombre}');">
                     <i class="bi bi-trash"></i>
                  </button>               
               </div>
            </div>
         </div>
      </div>`;
   });

   html+=`</div>`;
   $('#'+containerId).html(html);
   closeLoad();
}

const fn_guardar_sucursal = async (idSucursal) => {

   let nomSucursal       = $('#nomSucursal').val().trim();
   let direccionSucursal = $('#direccionSucursal').val().trim();
   let telSucursal       = $('#telSucursal').val().trim();
   let msjAccion       = '';

   if (nomSucursal == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre de la sucursal',
         icon: 'warning'
      });
      $('#nomSucursal').focus();
      return;
   }
   else if (direccionSucursal == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la dirección de la sucursal',
         icon: 'warning'
      });
      $('#direccionSucursal').focus();
      return;
   }
  

   const objSucursal = { func: 'guardar', idSucursal, nomSucursal, direccionSucursal, telSucursal };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información de la sucursal ' + nomSucursal + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarSucursal').prop('disabled', false);
      return;
   }

   $('#btnGuardarSucursal').prop('disabled', true);
   let respuesta = await guardar_sucursal(objSucursal);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      
      idSucursal > 0 ? msjAccion = 'Información actualizada' : msjAccion = 'Sucursal guardada correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormSucursal').modal('hide');
      $('#btnGuardarSucursal').prop('disabled', false);
      listar_sucursales('listar_sucursales');
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGuardarSucursal').prop('disabled', false);
      return;
   }
}

const fn_eliminar_sucursal = async (idSucursal, nomSucursal) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La sucursal: ' + nomSucursal + ' será eliminada', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
    $('.btnEliminarSucursal').prop('disabled', false);
    return;
  }

   $('.btnEliminarSucursal').prop('disabled', true);
   let respuesta = await eliminar_sucursal(idSucursal, nomSucursal);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Sucursal eliminada correctamente', '', 'success', 2500);
      $('#cardSucursal'+idSucursal).remove();
      arrSucursales = arrSucursales.filter(sucursal => sucursal.id != idSucursal);
      $('.btnEliminarSucursal').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarSucursal').prop('disabled', false);
      return;
   }
}

const fn_buscar_sucursal = () => {
   let busqueda = $('#inpBusquedaSucursal').val().trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
   const filtrado = arrSucursales.filter(sucursal => {
      const tituloSinAcentos = sucursal.nombre.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");      
      return tituloSinAcentos.includes(busqueda);
   });
   pinta_listado_sucursales('listar_sucursales', filtrado);
}

// Interfaces
window.TabSucursales        = TabSucursales;
window.ModalFormSucursal    = ModalFormSucursal;

// Funciones
window.fn_eliminar_sucursal = fn_eliminar_sucursal;
window.fn_guardar_sucursal  = fn_guardar_sucursal;
window.fn_buscar_sucursal   = fn_buscar_sucursal;
