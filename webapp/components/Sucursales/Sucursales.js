import { obtiene_sucursales, guardar_sucursal, eliminar_sucursal } from "./SucursalesServices.js";

let arrSucursales = [];

const TabSucursales = async () => {
   const res = await valida_menu('sucursales');

   if (!res || res.estatus != 200) {
      ModalAccesoDenegado('Sucursales');
      $('#containerMain').html(`<div class="alert alert-danger mt-3 p-2 text-center">No tienes permisos para ver este módulo.</div>`);
      return;
   }

   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2 fw-bold">
         <div class="fs-4"> <i class="bi bi-shop-window"></i> Sucursales</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevaSucursal" onclick="ModalFormSucursal(0);"><i class="bi bi-plus-lg"></i> Nueva Sucursal</button>
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

const ModalFormSucursal = (idSucursal) => {
   let sucursalSeleccionada = arrSucursales.find(sucursal => sucursal.id == idSucursal);

   let titulo    = 'Registrar Nueva Sucursal';
   let nombre    = '';
   let direccion = '';
   let telefono  = '';
   let matriz    = 0;

   if (idSucursal > 0 && sucursalSeleccionada) {
      nombre    = escapeHTML(sucursalSeleccionada.nombre);
      direccion = escapeHTML(sucursalSeleccionada.direccion);
      telefono  = escapeHTML(sucursalSeleccionada.telefono);
      matriz    = sucursalSeleccionada.matriz;
      titulo    = 'Editar Sucursal: ' + nombre;
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormSucursal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
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
                  <div class="col-12 mt-3">
                     <b>¿Es una matriz?</b>
                     <select name="matriz" id="matriz" class="form-select">
                        <option value="0">No</option>
                        <option value="1">Sí</option>
                     </select>
                  </div>
               </div>
            </div>
            <div class="modal-footer" align="right">
              <button type="button" class="btn btn-secondary btn-lib btn-redondo" id="btnGuardarSucursal" onclick="fn_guardar_sucursal(${idSucursal});">
                <i class="bi bi-save"></i> Guardar
              </button> 
              <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalFormSucursal').modal('show');
   $('#matriz').val(matriz);
}

const listar_sucursales = async (containerId) => {
   activarLoad('Cargando sucursales...');
   let respuesta = await obtiene_sucursales();
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrSucursales = respuesta.data;
      pinta_listado_sucursales(containerId, respuesta.data);
   }
}

const pinta_listado_sucursales = (containerId, data) => {
   if (!data || data.length === 0) {
      $('#' + containerId).html(`
         <div align="center">
            <img src="assets/images/no_encontrado.png" class="img img-fluid"><br>
            No se encontraron sucursales registradas
         </div>
      `);
      closeLoad();
      return;
   }
   
   let html = `<div class="row">`;
   data.map(row => {
      const nombreLimpio    = escapeHTML(row.nombre);
      const direccionLimpia = escapeHTML(row.direccion);
      const telefonoLimpio  = escapeHTML(row.telefono);

      html += `
      <div class="col-12 col-sm-3 col-md-3 mt-2" id="cardSucursal${row.id}">
         <div class="card mb-3 shadow">
            <div class="card-body">
               <div class="row fs-8">
                  <div class="col-2 mt-2 text-center">
                     <i class="bi bi-shop fs-4 text-secondary"></i>
                  </div>
                  <div class="col-10 mt-2">
                     <div class="mt-1"><b>${nombreLimpio}</b></div>
                     <div class="mt-1"><b>${direccionLimpia}</b></div>
                     <div class="text-muted fs-8">${telefonoLimpio}</div>
                  </div>
               </div>
            </div>
            <div class="card-footer bg-white border-top-0 pb-2">
               <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormSucursal(${row.id});">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarSucursal" title="Eliminar" onclick="fn_eliminar_sucursal(${row.id});">
                     <i class="bi bi-trash"></i>
                  </button>
               </div>
            </div>
         </div>
      </div>`;
   });

   html += `</div>`;
   $('#' + containerId).html(html);
   closeLoad();
};

const fn_guardar_sucursal = async (idSucursal) => {
   let nomSucursal       = $('#nomSucursal').val().trim();
   let direccionSucursal = $('#direccionSucursal').val().trim();
   let telSucursal       = $('#telSucursal').val().trim();
   let matriz            = $('#matriz').val();
   let msjAccion         = '';

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
  
   const objSucursal = { func: 'guardar', idSucursal, nomSucursal, direccionSucursal, telSucursal, matriz, CSRF_TOKEN };

   // Sanitizamos la variable nomSucursal para evitar XSS dentro del SweetAlert
   const nomSucursalEscapado = escapeHTML(nomSucursal);

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información de la sucursal ' + nomSucursalEscapado + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarSucursal').prop('disabled', false);
      return;
   }

   $('#btnGuardarSucursal').prop('disabled', true);
   let respuesta = await guardar_sucursal(objSucursal);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
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

const fn_eliminar_sucursal = async (idSucursal) => {
   let sucursalSeleccionada = arrSucursales.find(sucursal => sucursal.id == idSucursal);
   if (!sucursalSeleccionada) return;

   let nomSucursal = escapeHTML(sucursalSeleccionada.nombre);

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La sucursal: ' + nomSucursal + ' será eliminada', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarSucursal').prop('disabled', false);
      return;
   }

   $('.btnEliminarSucursal').prop('disabled', true);
   let respuesta = await eliminar_sucursal(idSucursal, sucursalSeleccionada.nombre, CSRF_TOKEN);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Sucursal eliminada correctamente', '', 'success', 2500);
      $('#cardSucursal' + idSucursal).remove();
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