import { obtiene_empresas, guardar_empresa, eliminar_empresa } from "./EmpresasServices.js";

let arrEmpresas = [];

const TabEmpresas = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-building-gear"></i> Empresas / Laboratorios</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevaEmpresa" onclick="ModalFormEmpresa(0);">
            <i class="bi bi-plus-lg"></i> Nueva empresa
         </button>
      </div>
   </div>
   <div class="row mt-2">
      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12" align="right">
         <div class="input-group">
            <input type="text" name="inpBusquedaEmpresa" id="inpBusquedaEmpresa" class="form-control border-end-0" placeholder="Buscar empresa"  onkeyUp="fn_buscar_empresas();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_empresas"></div>
   </div>`;

   $('#containerMain').html(html);
   fn_obtiene_empresas('listado_empresas');
}

const fn_buscar_empresas = () => {
   // Capturamos el valor, limpiamos espacios y removemos acentos
   let busqueda = $('#inpBusquedaEmpresa').val().trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
   // Filtramos el arreglo comparando ambas cadenas sin acentos
   const filtrado = arrEmpresas.filter(empresa => {
      const tituloSinAcentos = empresa.nombre_comercial.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");      
      return tituloSinAcentos.includes(busqueda);
   });   

   fn_pinta_listado_cempresas('listado_empresas', filtrado);
}

const fn_obtiene_empresas = async (containerId) => {
   activarLoad('Cargando empresas...');
   let respuesta = await obtiene_empresas();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron empresas registradas</div>');
      closeLoad();
      return;
   }
   else {
      arrEmpresas = await respuesta.data;
      if(arrEmpresas.length > 0) {
         fn_pinta_listado_cempresas(containerId, arrEmpresas);
      }
      else {
         $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron empresas registradas</div>');
         closeLoad();
      }
   }
}

const fn_pinta_listado_cempresas = (containerId, data) => {
   const contenedor = document.getElementById(containerId);
   
   let iconTipoEmpresa = '';
   let html = 
   `<div class="row g-4">`;
      data.forEach((row, i) => {
         
         row.tipo == 'LABORATORIO' ? iconTipoEmpresa = '<i class="bi bi-droplet"></i>'
         : row.tipo == 'EMPRESA' ? iconTipoEmpresa = '<i class="bi bi-building"></i>' : '<i class="bi bi-ban"></i>';

         html += `
         <div class="col-12 col-md-6 col-lg-4" id="cardEmpresa${row.id_empresa}">
            <div class="card h-100 shadow border-0">

               <div class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                  <span class="badge rounded-pill px-3 py-1 bg-success bg-opacity-10 border-1 text-success border-success">
                     <i class="bi bi-circle-fill me-1"></i> Activo
                  </span>
                  <small class="text-muted">ID: #${row.id_empresa}</small>
               </div>

               <div class="card-body pt-2 mt-2">

                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 circle-card-avatar">
                        ${iniciales(row.nombre_comercial)}
                     </div>
                     <div>
                        <div class="mb-0 fw-bold text-dark fs-7">${row.nombre_comercial}</div>
                        <small class="text-muted fs-8">${iconTipoEmpresa} ${row.tipo}</small>
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
                     <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormEmpresa('${row.id_empresa}');">
                        <i class="bi bi-pencil"></i>
                     </button>
                     <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarEmpresa" title="Eliminar" onclick="fn_eliminar_empresa(${row.id_empresa}, '${row.nombre_comercial}');">
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

const ModalFormEmpresa = (idEmpresa) => {

   let empresaSeleccionada = arrEmpresas.filter(empresa => empresa.id_empresa == idEmpresa);

   let titulo;
   let razon_social      = '';
   let nombre_comercial  = '';
   let persona_contacto  = '';
   let rfc               = '';
   let telefono_contacto = '';
   let correo_contacto   = '';
   let direccion         = '';
   let lista_precio_id   = 0;
   let tipo              = 'NA';

   if(idEmpresa > 0) {
      titulo            = 'Editar Empresa: '+ empresaSeleccionada[0].nombre_comercial;
      razon_social      = empresaSeleccionada[0].razon_social;
      nombre_comercial  = empresaSeleccionada[0].nombre_comercial;
      persona_contacto  = empresaSeleccionada[0].persona_contacto;
      rfc               = empresaSeleccionada[0].rfc;
      telefono_contacto = empresaSeleccionada[0].telefono_contacto;
      correo_contacto   = empresaSeleccionada[0].correo_contacto;
      direccion         = empresaSeleccionada[0].direccion;
      lista_precio_id   = empresaSeleccionada[0].lista_precio_id;
      tipo              = empresaSeleccionada[0].tipo;
   }
   else {
      titulo = 'Registrar Nueva Empresa';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormEmpresa" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Nueva Empresa</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            
            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-12 mt-3">
                     <b>Razón social *</b>
                     <input type="text" name="razonSocialEmpresa" id="razonSocialEmpresa" class="form-control" maxlength="200" value="${razon_social}">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Nombre comercial *</b>
                     <input type="text" name="nomComercial" id="nomComercial" class="form-control" maxlength="200" value="${nombre_comercial}">
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>Tipo *</b>
                     <select name="tipoEmpresa" id="tipoEmpresa" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="LABORATORIO">LABORATORIO</option>
                        <option value="EMPRESA">EMPRESA</option>
                     </select>
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>RFC *</b>
                     <input type="text" name="rfcEmpresa" id="rfcEmpresa" class="form-control" maxlength="11" value="${rfc}" onkeypress="this.value=this.value.toUpperCase();">
                  </div>
                  <div class="col-md-6 col-sm-5 col-12 mt-3">
                     <b>Persona de Contacto *</b>
                     <input type="text" name="personaContactoEmpresa" id="personaContactoEmpresa" class="form-control" maxlength="200" value="${persona_contacto}">
                  </div>
                  <div class="col-md-3 col-sm-3 col-12 mt-3">
                     <b>Teléfono *</b>
                     <input type="tel" inputmode="tel" name="telEmpresa" id="telEmpresa" class="form-control" maxlength="10" onkeypress="return fnValidaNumeros(event);" value="${telefono_contacto}">
                  </div>
                  <div class="col-md-5 col-sm-5 col-12 mt-3">
                     <b>Correo</b>
                     <input type="mail" inputmode="mail" name="correoEmpresa" id="correoEmpresa" class="form-control" maxlength="100" value="${correo_contacto}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Tipo de precio *</b>
                     <select name="precioEmpresa" id="precioEmpresa" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Público en general</option>
                     </select>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Dirección *</b>
                     <textarea name="direccionEmpresa" id="direccionEmpresa" class="form-control" rows="3" maxlength="300">${direccion}</textarea>
                  </div>
               </div>
            </div>
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" id="btnGuardarEmpresa" onclick="fn_guardar_empresa(${idEmpresa});">
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
   $('#modalFormEmpresa').modal('show');
   if(idEmpresa > 0) {
      setTimeout(() => {
         $('#tipoEmpresa').val(tipo);
         $('#precioEmpresa').val(lista_precio_id);
      }, 300);
   }
}

const fn_guardar_empresa = async (idEmpresa, origen) => {

   let razonSocialEmpresa     = $('#razonSocialEmpresa').val().trim();
   let nomComercial           = $('#nomComercial').val().trim();
   let tipoEmpresa            = $('#tipoEmpresa').val();
   let rfcEmpresa             = $('#rfcEmpresa').val().trim();
   let personaContactoEmpresa = $('#personaContactoEmpresa').val().trim();
   let telEmpresa             = $('#telEmpresa').val().trim();
   let correoEmpresa          = $('#correoEmpresa').val().trim();
   let precioEmpresa          = $('#precioEmpresa').val();
   let direccionEmpresa       = $('#direccionEmpresa').val().trim();
   let msjAccion;

   if (razonSocialEmpresa == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la razón social de la empresa',
         icon: 'warning'
      });
      $('#razonSocialEmpresa').focus();
      return;
   }
   else if (nomComercial == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre comercial de la empresa',
         icon: 'warning'
      });
      $('#nomComercial').focus();
      return;
   }
   else if (tipoEmpresa == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de empresa',
         icon: 'warning'
      });
      $('#tipoEmpresa').focus();
      return;
   }
   else if (rfcEmpresa == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el RFC',
         icon: 'warning'
      });
      $('#rfcEmpresa').focus();
      return;
   }
   else if (personaContactoEmpresa == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre de la persona de contacto',
         icon: 'warning'
      });
      $('#personaContactoEmpresa').focus();
      return;
   }
   else if (telEmpresa == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el teléfono de contacto de la empresa',
         icon: 'warning'
      });
      $('#telEmpresa').focus();
      return;
   }
   else if(correoEmpresa != '') {
      if(!fnValidaMail(correoEmpresa)) {
         ToastColor.fire({
            text: '¡Atención! Debes ingresar una cuenta de correo válida',
            icon: 'warning'
         });
         $('#correoEmpresa').focus();
      return;
      }
   }
   else if (parseInt(precioEmpresa) == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de precio para la empresa',
         icon: 'warning'
      });
      $('#precioEmpresa').focus();
      return;
   }
   else if (direccionEmpresa == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la dirección de la empresa',
         icon: 'warning'
      });
      $('#direccionEmpresa').focus();
      return;
   }

   let objEmpresa = { 'func': 'guardar', idEmpresa, razonSocialEmpresa, nomComercial, tipoEmpresa, rfcEmpresa, personaContactoEmpresa, telEmpresa, correoEmpresa, precioEmpresa, direccionEmpresa };
      
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La empresa: ' + nomComercial + ' será registrada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarEmpresa').prop('disabled', false);
      return;
   }

   $('#btnGuardarEmpresa').prop('disabled',true);
   let respuesta = await guardar_empresa(objEmpresa);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      idEmpresa > 0 ? msjAccion = 'Información actualizada correctamente' : msjAccion = 'Empresa guardada correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormEmpresa').modal('hide');
      $('#btnGuardarEmpresa').prop('disabled',false);
      fn_obtiene_empresas('listado_empresas');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarEmpresa').prop('disabled',false);
      return;
   }
}

const fn_eliminar_empresa = async (idEmpresa, nomComercial) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La empresa: ' + nomComercial + ' será eliminada', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarEmpresa').prop('disabled', false);
      return;
   }

   $('.btnEliminarEmpresa').prop('disabled', true);

   let respuesta = await eliminar_empresa(idEmpresa, nomComercial);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Empresa eliminada correctamente', '', 'success', 2500);
      $('#cardEmpresa'+idEmpresa).remove();
      arrEmpresas = arrEmpresas.filter(empresa => empresa.id_empresa != idEmpresa);
      $('.btnEliminarEmpresa').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarEmpresa').prop('disabled', false);
      return;
   }
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabEmpresas         = TabEmpresas;
window.ModalFormEmpresa    = ModalFormEmpresa;

window.fn_buscar_empresas  = fn_buscar_empresas;
window.fn_guardar_empresa  = fn_guardar_empresa;
window.fn_eliminar_empresa = fn_eliminar_empresa;
