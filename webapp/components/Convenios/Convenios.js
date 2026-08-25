import { obtiene_convenios, guardar_convenio, eliminar_convenio } from "./ConveniosServices.js";
import { obtiene_lista_precios } from "../Precios/PreciosServices.js";

let arrConvenios = [];

const TabConvenios = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2 fw-bold">
         <div class="fs-4"> <i class="bi bi-building-gear"></i>Convenios</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevoConvenio" onclick="ModalFormConvenio(0);">
            <i class="bi bi-plus-lg"></i> Nuevo convenio
         </button>
      </div>
   </div>
   <div class="row mt-2">
      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
         <div class="input-group">
            <input type="text" name="inpBusquedaConvenio" id="inpBusquedaConvenio" class="form-control border-end-0" placeholder="Buscar convenio"  onkeyUp="fn_buscar_convenios();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
         <div class="input-group">
            <select name="filtro_tipo_convenio" id="filtro_tipo_convenio" class="form-select" onChange="fn_filtrar_convenios();">
               <option value="TODOS">Todos</option>
               <option value="LABORATORIO">LABORATORIO</option>
               <option value="EMPRESA">EMPRESA</option>
               <option value="DOCTOR">DOCTOR</option>
            </select>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_convenios"></div>
   </div>`;

   $('#containerMain').html(html);
   fn_obtiene_convenios('listado_convenios');
}

const fn_filtrar_convenios = () => {
   let filtrado    = [];
   let tipoConvenio = $('#filtro_tipo_convenio').val().trim();

   if(tipoConvenio == 'TODOS') {
      filtrado = arrConvenios;
   }
   else {
      filtrado = arrConvenios.filter(convenio => convenio.tipo == tipoConvenio);   
   }

   fn_pinta_listado_convenios('listado_convenios', filtrado);
}

const fn_buscar_convenios = () => {
   // Capturamos el valor, limpiamos espacios y removemos acentos
   let busqueda = $('#inpBusquedaConvenio').val().trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
   // Filtramos el arreglo comparando ambas cadenas sin acentos
   const filtrado = arrConvenios.filter(convenio => {
      const tituloSinAcentos = convenio.nombre_comercial.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");      
      return tituloSinAcentos.includes(busqueda);
   });   

   fn_pinta_listado_convenios('listado_convenios', filtrado);
}

const fn_obtiene_convenios = async (containerId) => {
   activarLoad('Cargando convenios...');
   let respuesta = await obtiene_convenios();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron convenios registrados</div>');
      closeLoad();
      return;
   }
   else {
      arrConvenios = await respuesta.data;
      if(arrConvenios.length > 0) {
         fn_pinta_listado_convenios(containerId, arrConvenios);
      }
      else {
         $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron convenios registrados</div>');
         closeLoad();
      }
   }
}

const fn_pinta_listado_convenios = (containerId, data) => {
   const contenedor = document.getElementById(containerId);
   
   let iconTipoConvenio = '';
   let html = 
   `<div class="row g-4">`;
      data.forEach((row, i) => {
         
         row.tipo == 'LABORATORIO' ? iconTipoConvenio = '<i class="bi bi-droplet"></i>'
         : row.tipo == 'EMPRESA' ? iconTipoConvenio = '<i class="bi bi-building"></i>'
         : row.tipo == 'DOCTOR' ? iconTipoConvenio = '<i class="bi bi-clipboard2-pulse"></i>' : '<i class="bi bi-ban"></i>';

         html += `
         <div class="col-12 col-md-6 col-lg-4" id="cardConvenio${row.id_convenio}">
            <div class="card h-100 shadow border-0">

               <div class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                  <span class="badge rounded-pill px-3 py-1 bg-success bg-opacity-10 border-1 text-success border-success">
                     <i class="bi bi-circle-fill me-1"></i> Activo
                  </span>
                  <small class="text-muted">ID: #${row.id_convenio}</small>
               </div>

               <div class="card-body pt-2 mt-2">

                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 circle-card-avatar">
                        ${iniciales(row.nombre_comercial)}
                     </div>
                     <div>
                        <div class="mb-0 fw-bold text-dark fs-7">${row.nombre_comercial}</div>
                        <small class="text-muted fs-8">${iconTipoConvenio} ${row.tipo}</small>
                     </div>
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

                     <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Gestionar datos de facturación" onclick="ModalDatosFacturacion('CONVENIO', '${row.id_convenio}', '${row.nombre_comercial}');">
                        <i class="bi bi-receipt"></i>
                     </button>
                     <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormConvenio('${row.id_convenio}');">
                        <i class="bi bi-pencil"></i>
                     </button>
                     <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarConvenio" title="Eliminar" onclick="fn_eliminar_convenio(${row.id_convenio}, '${row.nombre_comercial}');">
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

const ModalFormConvenio = (idConvenio) => {

   let convenioSeleccionado = arrConvenios.filter(convenio => convenio.id_convenio == idConvenio);

   let titulo;
   let nombre_comercial    = '';
   let persona_contacto    = '';
   let telefono_contacto   = '';
   let correo_contacto     = '';
   let direccion           = '';
   let lista_precio_id     = 0;
   let password_plataforma = '';
   let tipo                = 'NA';

   if(idConvenio > 0) {
      titulo              = 'Editar Convenio: '+ convenioSeleccionado[0].nombre_comercial ?? '';
      nombre_comercial    = convenioSeleccionado[0].nombre_comercial ?? '';
      persona_contacto    = convenioSeleccionado[0].persona_contacto ?? '';
      telefono_contacto   = convenioSeleccionado[0].telefono_contacto ?? '';
      correo_contacto     = convenioSeleccionado[0].correo_contacto ?? '';
      direccion           = convenioSeleccionado[0].direccion ?? '';
      lista_precio_id     = convenioSeleccionado[0].lista_precio_id;
      tipo                = convenioSeleccionado[0].tipo;
      password_plataforma = convenioSeleccionado[0].password_plataforma ?? '';
   }
   else {
      titulo = 'Registrar Nuevo Convenio';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormConvenio" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-sm-down">
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
                     <input type="text" name="nomConvenio" id="nomConvenio" class="form-control" maxlength="200" value="${nombre_comercial}">
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>Tipo *</b>
                     <select name="tipoConvenio" id="tipoConvenio" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="LABORATORIO">LABORATORIO</option>
                        <option value="EMPRESA">EMPRESA</option>
                        <option value="DOCTOR">DOCTOR</option>
                     </select>
                  </div>
                  <div class="col-md-9 col-sm-5 col-12 mt-3">
                     <b>Persona de Contacto *</b>
                     <input type="text" name="personaContactoConvenio" id="personaContactoConvenio" class="form-control" maxlength="200" value="${persona_contacto}">
                  </div>
                  <div class="col-md-3 col-sm-3 col-12 mt-3">
                     <b>Teléfono *</b>
                     <input type="tel" inputmode="tel" name="telConvenio" id="telConvenio" class="form-control" maxlength="10" onkeypress="return fnValidaNumeros(event);" value="${telefono_contacto}">
                  </div>
                  <div class="col-md-5 col-sm-5 col-12 mt-3">
                     <b>Correo</b>
                     <input type="mail" inputmode="mail" name="correoConvenio" id="correoConvenio" class="form-control" maxlength="100" value="${correo_contacto}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Tipo de precio *</b>
                     <select name="precioConvenio" id="precioConvenio" class="form-select">
                        <option value="0">Seleccionar</option>
                     </select>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Dirección *</b>
                     <textarea name="direccionConvenio" id="direccionConvenio" class="form-control" rows="3" maxlength="300">${direccion}</textarea>
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Password Plataforma *</b>
                     <div class="input-group mb-3">
                        <input type="password" class="form-control form-control-lg rounded-1" name="passwordPlataformaConvenio" id="passwordPlataformaConvenio" placeholder="***" value="${password_plataforma}" maxlength="50">
                        <span class="input-group-text pointer" id="eyePasswordConvenio" onclick="ver_password('passwordPlataformaConvenio','eyePasswordConvenio');"><i class="bi bi-eye-slash"></i></span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" id="btnGuardarConvenio" onclick="fn_guardar_convenio(${idConvenio});">
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
   $('#modalFormConvenio').modal('show');

   combo_listas_precios('precioConvenio');

   if(idConvenio > 0) {
      setTimeout(() => {
         $('#tipoConvenio').val(tipo);
         $('#precioConvenio').val(lista_precio_id);
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

const fn_guardar_convenio = async (idConvenio, origen) => {

   let nomConvenio        = $('#nomConvenio').val().trim();
   let tipo               = $('#tipoConvenio').val();
   let personaContacto    = $('#personaContactoConvenio').val().trim();
   let telefono           = $('#telConvenio').val().trim();
   let correo             = $('#correoConvenio').val().trim();
   let precio             = $('#precioConvenio').val();
   let direccion          = $('#direccionConvenio').val().trim();
   let passwordPlataforma = $('#passwordPlataformaConvenio').val().trim();
   let msjAccion;

   if (nomConvenio == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del cliente del convenio',
         icon: 'warning'
      });
      $('#nomConvenio').focus();
      return;
   }
   else if (tipo == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de cliente del convenio',
         icon: 'warning'
      });
      $('#tipoConvenio').focus();
      return;
   }
   else if (personaContacto == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre de la persona de contacto',
         icon: 'warning'
      });
      $('#personaContactoConvenio').focus();
      return;
   }
   else if (telefono == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el teléfono de contacto del cliente del convenio',
         icon: 'warning'
      });
      $('#telConvenio').focus();
      return;
   }
   else if(correo != '') {
      if(!fnValidaMail(correo)) {
         ToastColor.fire({
            text: '¡Atención! Debes ingresar una cuenta de correo válida',
            icon: 'warning'
         });
         $('#correoConvenio').focus();
      return;
      }
   }
   else if (parseInt(precio) == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de precio para el cliente',
         icon: 'warning'
      });
      $('#precioConvenio').focus();
      return;
   }
   else if (direccion == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la dirección del cliente',
         icon: 'warning'
      });
      $('#direccionConvenio').focus();
      return;
   }
   else if (passwordPlataforma == '' && parseInt(idConvenio) == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la contraseña para el acceso a la plataforma',
         icon: 'warning'
      });
      $('#passwordPlataformaConvenio').focus();
      return;
   }
   
   let objConvenio = { 'func': 'guardar', idConvenio, nomConvenio, tipo, personaContacto, telefono, correo, precio, direccion, passwordPlataforma };
      
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El convenio: ' + nomConvenio + ' será registrado', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarConvenio').prop('disabled', false);
      return;
   }

   $('#btnGuardarConvenio').prop('disabled',true);
   let respuesta = await guardar_convenio(objConvenio);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      idConvenio > 0 ? msjAccion = 'Información actualizada correctamente' : msjAccion = 'Convenio guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormConvenio').modal('hide');
      $('#btnGuardarConvenio').prop('disabled',false);
      fn_obtiene_convenios('listado_convenios');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarConvenio').prop('disabled',false);
      return;
   }
}

const fn_eliminar_convenio = async (idConvenio, nomConvenio) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El Convenio: ' + nomConvenio + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarConvenio').prop('disabled', false);
      return;
   }

   $('.btnEliminarConvenio').prop('disabled', true);

   let respuesta = await eliminar_convenio(idConvenio, nomConvenio);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Convenio eliminado correctamente', '', 'success', 2500);
      $('#cardConvenio'+idConvenio).remove();
      arrConvenios = arrConvenios.filter(convenio => convenio.id_convenio != idConvenio);
      $('.btnEliminarConvenio').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarConvenio').prop('disabled', false);
      return;
   }
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabConvenios        = TabConvenios;
window.ModalFormConvenio   = ModalFormConvenio;

window.fn_buscar_convenios  = fn_buscar_convenios;
window.fn_filtrar_convenios = fn_filtrar_convenios;
window.fn_guardar_convenio  = fn_guardar_convenio;
window.fn_eliminar_convenio = fn_eliminar_convenio;
