import { obtiene_clientes, guardar_cliente, eliminar_cliente } from "./ClientesServices.js";
import { obtiene_lista_precios } from "../Precios/PreciosServices.js";

let arrClientes = [];

const TabClientes = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-building-gear"></i>Clientes</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevoCliente" onclick="ModalFormCliente(0);">
            <i class="bi bi-plus-lg"></i> Nuevo cliente
         </button>
      </div>
   </div>
   <div class="row mt-2">
      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
         <div class="input-group">
            <input type="text" name="inpBusquedaCliente" id="inpBusquedaCliente" class="form-control border-end-0" placeholder="Buscar cliente"  onkeyUp="fn_buscar_clientes();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
         <div class="input-group">
            <select name="filtro_tipo_cliente" id="filtro_tipo_cliente" class="form-select" onChange="fn_filtrar_clientes();">
               <option value="TODOS">Todos</option>
               <option value="LABORATORIO">LABORATORIO</option>
               <option value="EMPRESA">EMPRESA</option>
               <option value="DOCTOR">DOCTOR</option>
            </select>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_clientes"></div>
   </div>`;

   $('#containerMain').html(html);
   fn_obtiene_clientes('listado_clientes');
}

const fn_filtrar_clientes = () => {
   let filtrado    = [];
   let tipoCliente = $('#filtro_tipo_cliente').val().trim();

   if(tipoCliente == 'TODOS') {
      filtrado = arrClientes;
      console.log('Todos: ',filtrado);
   }
   else {
      filtrado = arrClientes.filter(cliente => cliente.tipo == tipoCliente);   
      console.log(tipoCliente+':', filtrado);
   }

   fn_pinta_listado_clientes('listado_clientes', filtrado);
}

const fn_buscar_clientes = () => {
   // Capturamos el valor, limpiamos espacios y removemos acentos
   let busqueda = $('#inpBusquedaCliente').val().trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
   // Filtramos el arreglo comparando ambas cadenas sin acentos
   const filtrado = arrClientes.filter(cliente => {
      const tituloSinAcentos = cliente.nombre_comercial.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");      
      return tituloSinAcentos.includes(busqueda);
   });   

   fn_pinta_listado_clientes('listado_clientes', filtrado);
}

const fn_obtiene_clientes = async (containerId) => {
   activarLoad('Cargando clientes...');
   let respuesta = await obtiene_clientes();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron clientes registrados</div>');
      closeLoad();
      return;
   }
   else {
      arrClientes = await respuesta.data;
      if(arrClientes.length > 0) {
         fn_pinta_listado_clientes(containerId, arrClientes);
      }
      else {
         $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron clientes registrados</div>');
         closeLoad();
      }
   }
}

const fn_pinta_listado_clientes = (containerId, data) => {
   const contenedor = document.getElementById(containerId);
   
   let iconTipoCliente = '';
   let html = 
   `<div class="row g-4">`;
      data.forEach((row, i) => {
         
         row.tipo == 'LABORATORIO' ? iconTipoCliente = '<i class="bi bi-droplet"></i>'
         : row.tipo == 'EMPRESA' ? iconTipoCliente = '<i class="bi bi-building"></i>'
         : row.tipo == 'DOCTOR' ? iconTipoCliente = '<i class="bi bi-clipboard2-pulse"></i>' : '<i class="bi bi-ban"></i>';

         html += `
         <div class="col-12 col-md-6 col-lg-4" id="cardCliente${row.id_cliente}">
            <div class="card h-100 shadow border-0">

               <div class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                  <span class="badge rounded-pill px-3 py-1 bg-success bg-opacity-10 border-1 text-success border-success">
                     <i class="bi bi-circle-fill me-1"></i> Activo
                  </span>
                  <small class="text-muted">ID: #${row.id_cliente}</small>
               </div>

               <div class="card-body pt-2 mt-2">

                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 circle-card-avatar">
                        ${iniciales(row.nombre_comercial)}
                     </div>
                     <div>
                        <div class="mb-0 fw-bold text-dark fs-7">${row.nombre_comercial}</div>
                        <small class="text-muted fs-8">${iconTipoCliente} ${row.tipo}</small>
                     </div>
                  </div>

                  <!-- RFC -->
                  <div class="mb-2 p-2 rounded bg-secondary bg-opacity-10">
                     <small class="text-muted d-block title-rfc">RFC</small>
                     <span class="fw-bold text-dark text-rfc">${row.rfc}</span>
                  </div>

                  <!-- Contacto + teléfono -->
                  <div class="row g-2 mb-2">
                     <div class="col-7">
                        <small class="text-muted d-block fs-7">Contacto</small>
                        <small class="fw-medium text-dark">${row.persona_contacto}</small>
                     </div>
                     <div class="col-5 border-start">
                        <small class="text-muted d-block fs-7">Teléfono</small>
                        <small class="fw-medium text-dark">${row.telefono_contacto ?? 'S/D'}</small>
                     </div>
                  </div>

                  <!-- Correo -->
                  <div>
                     <small class="text-muted d-block fs-7">Correo</small>
                     <small class="text-dark"><i class="bi bi-envelope me-1 text-success"></i>${row.correo_contacto ?? 'S/D'}</small>
                  </div>
               </div>

               <!-- Footer -->
               <div class="card-footer bg-white border-top-0 pb-2">
                  <div class="d-flex justify-content-end gap-2">
                     <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormCliente('${row.id_cliente}');">
                        <i class="bi bi-pencil"></i>
                     </button>
                     <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarCliente" title="Eliminar" onclick="fn_eliminar_cliente(${row.id_cliente}, '${row.nombre_comercial}');">
                        <i class="bi bi-trash"></i>
                     </button>               
                  </div>
               </div>
            </div>
         </div>`;
      });
      html += 
   `</div>`;
   contenedor.innerHTML = html;
   closeLoad();
}

const ModalFormCliente = (idCliente) => {

   let clienteSeleccionado = arrClientes.filter(cliente => cliente.id_cliente == idCliente);

   let titulo;
   let razon_social        = '';
   let nombre_comercial    = '';
   let persona_contacto    = '';
   let rfc                 = '';
   let telefono_contacto   = '';
   let correo_contacto     = '';
   let direccion           = '';
   let lista_precio_id     = 0;
   let password_plataforma = '';
   let tipo                = 'NA';

   if(idCliente > 0) {
      titulo              = 'Editar Cliente: '+ clienteSeleccionado[0].nombre_comercial ?? '';
      razon_social        = clienteSeleccionado[0].razon_social ?? '';
      nombre_comercial    = clienteSeleccionado[0].nombre_comercial ?? '';
      persona_contacto    = clienteSeleccionado[0].persona_contacto ?? '';
      rfc                 = clienteSeleccionado[0].rfc ?? '';
      telefono_contacto   = clienteSeleccionado[0].telefono_contacto ?? '';
      correo_contacto     = clienteSeleccionado[0].correo_contacto ?? '';
      direccion           = clienteSeleccionado[0].direccion ?? '';
      lista_precio_id     = clienteSeleccionado[0].lista_precio_id;
      tipo                = clienteSeleccionado[0].tipo;
      password_plataforma = clienteSeleccionado[0].password_plataforma ?? '';
   }
   else {
      titulo = 'Registrar Nuevo Cliente';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormCliente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${titulo}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            
            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-12 mt-3">
                     <b>Nombre *</b>
                     <input type="text" name="nomCliente" id="nomCliente" class="form-control" maxlength="200" value="${nombre_comercial}">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Razón social</b>
                     <input type="text" name="razonSocialCliente" id="razonSocialCliente" class="form-control" maxlength="200" value="${razon_social}">
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>Tipo *</b>
                     <select name="tipoCliente" id="tipoCliente" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="LABORATORIO">LABORATORIO</option>
                        <option value="EMPRESA">EMPRESA</option>
                        <option value="DOCTOR">DOCTOR</option>
                     </select>
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>RFC *</b>
                     <input type="text" name="rfcCliente" id="rfcCliente" class="form-control" maxlength="11" value="${rfc}" onkeypress="this.value=this.value.toUpperCase();">
                  </div>
                  <div class="col-md-6 col-sm-5 col-12 mt-3">
                     <b>Persona de Contacto *</b>
                     <input type="text" name="personaContactoCliente" id="personaContactoCliente" class="form-control" maxlength="200" value="${persona_contacto}">
                  </div>
                  <div class="col-md-3 col-sm-3 col-12 mt-3">
                     <b>Teléfono *</b>
                     <input type="tel" inputmode="tel" name="telCliente" id="telCliente" class="form-control" maxlength="10" onkeypress="return fnValidaNumeros(event);" value="${telefono_contacto}">
                  </div>
                  <div class="col-md-5 col-sm-5 col-12 mt-3">
                     <b>Correo</b>
                     <input type="mail" inputmode="mail" name="correoCliente" id="correoCliente" class="form-control" maxlength="100" value="${correo_contacto}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Tipo de precio *</b>
                     <select name="precioCliente" id="precioCliente" class="form-select">
                        <option value="0">Seleccionar</option>
                     </select>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Dirección *</b>
                     <textarea name="direccionCliente" id="direccionCliente" class="form-control" rows="3" maxlength="300">${direccion}</textarea>
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Password Plataforma *</b>
                     <div class="input-group mb-3">
                        <input type="password" class="form-control form-control-lg rounded-1" name="passwordPlataformaCliente" id="passwordPlataformaCliente" placeholder="***" value="${password_plataforma}" maxlength="50">
                        <span class="input-group-text pointer" id="eyePasswordCliente" onclick="ver_password('passwordPlataformaCliente','eyePasswordCliente');"><i class="bi bi-eye-slash"></i></span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" id="btnGuardarCliente" onclick="fn_guardar_cliente(${idCliente});">
                  Guardar
               </button>
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminExt').html(html);
   $('#modalFormCliente').modal('show');

   combo_listas_precios('precioCliente');

   if(idCliente > 0) {
      setTimeout(() => {
         $('#tipoCliente').val(tipo);
         $('#precioCliente').val(lista_precio_id);
      }, 300);
   }
}

const combo_listas_precios = async (containerId) => {
   let comboListasPrecios = '<option value="0">Seleccionar</option>';
   let respuesta = await obtiene_lista_precios();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      let res = await respuesta.data;
      if(res.length > 0) {
         res.map((lista) => {
            comboListasPrecios +=`<option value="${lista.id}">${lista.nombre}</option>`;
         });
         $('#'+containerId).html(comboListasPrecios);
      }      
   }
}

const fn_guardar_cliente = async (idCliente, origen) => {

   let razonSocialCliente        = $('#razonSocialCliente').val().trim();
   let nomCliente                = $('#nomCliente').val().trim();
   let tipoCliente               = $('#tipoCliente').val();
   let rfcCliente                = $('#rfcCliente').val().trim();
   let personaContactoCliente    = $('#personaContactoCliente').val().trim();
   let telCliente                = $('#telCliente').val().trim();
   let correoCliente             = $('#correoCliente').val().trim();
   let precioCliente             = $('#precioCliente').val();
   let direccionCliente          = $('#direccionCliente').val().trim();
   let passwordPlataformaCliente = $('#passwordPlataformaCliente').val().trim();
   let msjAccion;

   if (nomCliente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del cliente',
         icon: 'warning'
      });
      $('#nomCliente').focus();
      return;
   }
   else if (tipoCliente == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de cliente',
         icon: 'warning'
      });
      $('#tipoCliente').focus();
      return;
   }
   else if (rfcCliente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el RFC',
         icon: 'warning'
      });
      $('#rfcCliente').focus();
      return;
   }
   else if (personaContactoCliente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre de la persona de contacto',
         icon: 'warning'
      });
      $('#personaContactoCliente').focus();
      return;
   }
   else if (telCliente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el teléfono de contacto del cliente',
         icon: 'warning'
      });
      $('#telCliente').focus();
      return;
   }
   else if(correoCliente != '') {
      if(!fnValidaMail(correoCliente)) {
         ToastColor.fire({
            text: '¡Atención! Debes ingresar una cuenta de correo válida',
            icon: 'warning'
         });
         $('#correoCliente').focus();
      return;
      }
   }
   else if (parseInt(precioCliente) == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de precio para el cliente',
         icon: 'warning'
      });
      $('#precioCliente').focus();
      return;
   }
   else if (direccionCliente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la dirección del cliente',
         icon: 'warning'
      });
      $('#direccionCliente').focus();
      return;
   }
   else if (passwordPlataformaCliente == '' && parseInt(idCliente) == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la contraseña para el acceso a la plataforma',
         icon: 'warning'
      });
      $('#passwordPlataformaCliente').focus();
      return;
   }
   
   let objCliente = { 'func': 'guardar', idCliente, razonSocialCliente, nomCliente, tipoCliente, rfcCliente, personaContactoCliente, telCliente, correoCliente, precioCliente, direccionCliente, passwordPlataformaCliente };
      
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El cliente: ' + nomCliente + ' será registrado', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarCliente').prop('disabled', false);
      return;
   }

   $('#btnGuardarCliente').prop('disabled',true);
   let respuesta = await guardar_cliente(objCliente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      idCliente > 0 ? msjAccion = 'Información actualizada correctamente' : msjAccion = 'Cliente guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormCliente').modal('hide');
      $('#btnGuardarCliente').prop('disabled',false);
      fn_obtiene_clientes('listado_clientes');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarCliente').prop('disabled',false);
      return;
   }
}

const fn_eliminar_cliente = async (idCliente, nomCliente) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El Cliente: ' + nomCliente + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarCliente').prop('disabled', false);
      return;
   }

   $('.btnEliminarCliente').prop('disabled', true);

   let respuesta = await eliminar_cliente(idCliente, nomCliente);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Cliente eliminado correctamente', '', 'success', 2500);
      $('#cardCliente'+idCliente).remove();
      arrClientes = arrClientes.filter(cliente => cliente.id_cliente != idCliente);
      $('.btnEliminarCliente').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarCliente').prop('disabled', false);
      return;
   }
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabClientes         = TabClientes;
window.ModalFormCliente    = ModalFormCliente;

window.fn_buscar_clientes  = fn_buscar_clientes;
window.fn_filtrar_clientes = fn_filtrar_clientes;
window.fn_guardar_cliente  = fn_guardar_cliente;
window.fn_eliminar_cliente = fn_eliminar_cliente;
