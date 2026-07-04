import { obtiene_pacientes, guardar_paciente, eliminar_paciente, obtiene_credenciales_pacientes, cambiar_credenciales } from "./PacientesServices.js";

let arrPacientes = [];

const TabPacientes = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-people"></i> Pacientes</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevoPaciente" onclick="ModalFormPaciente(0,'');"><i class="bi bi-plus-lg"></i> Nuevo Paciente</button>
      </div>
   </div>
   <div class="mt-4">
      <div id="listar_pacientes"></div>      
   </div>`;

   $('#containerMain').html(html);
   
   listar_pacientes('listar_pacientes');
}

const ModalFormPaciente = (idPaciente, nomPaciente) => {

   let pacienteSeleccionado = arrPacientes.filter(paciente => paciente.id == idPaciente);

   let titulo;
   let nombre                  = '';
   let apellido_paterno        = '';
   let apellido_materno        = '';
   let fecha_nacimiento        = '';
   let fecha_nacimiento_format = '';
   let sexo_biologico          = 'NA';
   let telefono                = '';
   let correo                  = '';

   if(idPaciente > 0) {
      titulo                  = 'Editar Paciente: '+ nomPaciente;
      nombre                  = pacienteSeleccionado[0].nombre;
      apellido_paterno        = pacienteSeleccionado[0].apellido_paterno;
      apellido_materno        = pacienteSeleccionado[0].apellido_materno;
      fecha_nacimiento        = pacienteSeleccionado[0].fecha_nacimiento;
      fecha_nacimiento_format = pacienteSeleccionado[0].fecha_nacimiento;
      sexo_biologico          = pacienteSeleccionado[0].sexo_biologico;
      telefono                = pacienteSeleccionado[0].telefono;
      correo                  = pacienteSeleccionado[0].correo;
   }
   else {
      titulo = 'Registrar Nuevo Paciente';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormPaciente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-md-down">
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
                     <b>Nombre del paciente *</b>
                     <input type="text" name="nomPaciente" id="nomPaciente" class="form-control" maxlength="100" value="${nombre}"/>
                  </div>
                  <div class="col-12 col-sm-6 mt-3">
                     <b>Apellido paterno *</b>
                     <input type="text" name="apPaterno" id="apPaterno" class="form-control" maxlength="70" value="${apellido_paterno}"/>
                  </div>
                  <div class="col-12 col-sm-6 mt-3">
                     <b>Apellido materno</b>
                     <input type="text" name="apMaterno" id="apMaterno" class="form-control" maxlength="70" value="${apellido_materno}"/>
                  </div>
                  <div class="col-12 col-sm-4 mt-3">
                     <b>Fecha de nacimiento *</b>
                     <input type="date" name="fechaNacimiento" id="fechaNacimiento" class="form-control" maxlength="70" value="${fecha_nacimiento}"/>
                  </div>
                  <div class="col-12 col-sm-4 mt-3">
                     <b>Sexo Biológico *</b>
                     <select name="sexoBiologico" id="sexoBiologico" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="MASCULINO">MASCULINO</option>
                        <option value="FEMENINO">FEMENINO</option>
                     </select>
                  </div>
                  <div class="col-12 col-sm-4 mt-3">
                     <b>Telefono *</b>
                     <input type="number" inputmode="numeric" name="telefonoPaciente" id="telefonoPaciente" class="form-control" maxlength="10" value="${telefono}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Correo</b>
                     <input type="mail" name="correoPaciente" id="correoPaciente" class="form-control" maxlength="100" value="${correo}" />
                  </div>
               </div>
            </div>
            <div class="modal-footer border-0 text-end">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnGuardarPaciente" onclick="fn_guardar_paciente('${idPaciente}');">
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
   $('#modalFormPaciente').modal('show');
   setTimeout(() => {
      $('#sexoBiologico').val(sexo_biologico);
   }, 200);
}

const listar_pacientes = async (containerId) => {
   activarLoad('Cargando pacientes...');

   let respuesta      = await obtiene_pacientes();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrPacientes = respuesta.data;
      pinta_listado_pacientes(containerId, respuesta.data);
   }
}

const pinta_listado_pacientes = (containerId, data) => {
   
   let nombreCompleto = '';

   if(data.length == 0) {
      $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron pacientes registrados</div>');
      closeLoad();
      return;
   }
   
   let html = 
   `<table class="table table-striped table-bordered dataTable" id="tablePacientes">
      <thead>
         <tr>
            <th width="5%">ID</th>
            <th width="40%">Paciente</th>
            <th width="10%">Fecha Nacimiento</th>
            <th width="10%">Sexo</th>
            <th width="10%">Teléfono</th>
            <th width="15%">Correo</th>
            <th width="10%">Acciones</th>
         </tr>
      </thead>
      <tbody>`;
         data.map(row => {

            nombreCompleto = `${row.nombre} ${row.apellido_paterno} ${row.apellido_materno ?? ''}`;

            html+=
            `<tr id="trPaciente${row.id}">
               <td class="text-center">${row.id}</td>
               <td>${nombreCompleto}</td>
               <td class="text-center">${row.fecha_nacimiento_format}</td>
               <td class="text-center">${row.sexo_biologico ?? ''}</td>
               <td class="text-center">${row.telefono ?? ''}</td>
               <td class="text-center">${row.correo ?? ''}</td>
               <td class="text-center">
                  <button type="buttton" class="btn btn-outline-secondary btn-redondo btn-sm px-2" onclick="ModalFormPaciente('${row.id}', '${row.nombreCompleto}');" title="Editar paciente">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button type="buttton" class="btn btn-outline-dark btn-redondo btn-sm px-2" onclick="ModalCredencialesPaciente('${row.id}', '${row.nombre}', '${row.apellido_paterno}');" title="Ver credenciales de acceso">
                     <i class="bi bi-shield-lock"></i>
                  </button>
                  <button type="buttton" class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarPaciente" onclick="fn_eliminar_paciente('${row.id}', '${nombreCompleto}');" title="Eliminar paciente">
                     <i class="bi bi-trash"></i>
                  </button>
               </td>
            </tr>`;
         });
         html+=
      `</tbody>
   </table>`;
   $('#'+containerId).html(html);

   setTimeout(() => {
      new DataTable('#tablePacientes', {   
         language: {
            url: "assets/lib/DataTables/es-ES.json",
         },
         responsive: true,
         order: [1]
      });
   }, 200);
   closeLoad();
}

const ModalCredencialesPaciente = (idPaciente, nomPaciente, apPaterno) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalCredencialesPaciente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-body">
               <div id="container_credenciales_paciente"></div>
            </div>
            <div class="modal-footer border-0 text-end">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnCambiarCredenciales" onclick="fn_cambiar_credenciales_paciente(${idPaciente}, '${nomPaciente}', '${apPaterno}');">
                <i class="bi bi-shield-lock"></i> Cambiar credenciales
              </button> 
              <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalCredencialesPaciente').modal('show');
   fn_ver_credenciales_paciente(idPaciente, nomPaciente, apPaterno);
}

const fn_guardar_paciente = async (idPaciente) => {

   let nomPaciente      = $('#nomPaciente').val().trim();
   let apPaterno        = $('#apPaterno').val();
   let apMaterno        = $('#apMaterno').val().trim();
   let sexoBiologico    = $('#sexoBiologico').val();
   let fechaNacimiento  = $('#fechaNacimiento').val();
   let telefonoPaciente = $('#telefonoPaciente').val().trim();
   let correoPaciente   = $('#correoPaciente').val().trim();
   let msjAccion          = '';

   if (nomPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del paciente',
         icon: 'warning'
      });
      $('#nomPaciente').focus();
      return;
   }
   else if (apPaterno == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el apellido paterno del paciente',
         icon: 'warning'
      });
      $('#apPaterno').focus();
      return;
   }
   else if (fechaNacimiento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la fecha de nacimiento del paciente',
         icon: 'warning'
      });
      $('#fechaNacimiento').focus();
      return;
   }
   else if (sexoBiologico == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el sexo biológico del paciente',
         icon: 'warning'
      });
      $('#sexoBiologico').focus();
      return;
   }
   else if (telefonoPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el teléfono del paciente',
         icon: 'warning'
      });
      $('#telefonoPaciente').focus();
      return;
   }
   else if(correoPaciente != '') {
      if(!fnValidaMail(correoPaciente)) {
         ToastColor.fire({
            text: '¡Atención! Debes ingresar una cuenta de correo válida',
            icon: 'warning'
         });
         $('#correoPaciente').focus();
      return;
      }
   }
   
  
   const objPaciente = { func: 'guardar_paciente', idPaciente, nomPaciente, apPaterno, apMaterno, sexoBiologico, fechaNacimiento, telefonoPaciente, correoPaciente };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información del paciente ' + nomPaciente + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarPaciente').prop('disabled', false);
      return;
   }

   $('#btnGuardarPaciente').prop('disabled', true);
   let respuesta = await guardar_paciente(objPaciente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      
      idPaciente > 0 ? msjAccion = 'Información actualizada' : msjAccion = 'Paciente guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormPaciente').modal('hide');
      $('#btnGuardarPaciente').prop('disabled', false);
      listar_pacientes('listar_pacientes');
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGuardarPaciente').prop('disabled', false);
      return;
   }
}

const fn_eliminar_paciente = async (idPaciente, nomPaciente) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El paciente: ' + nomPaciente + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
    $('.btnEliminarPaciente').prop('disabled', false);
    return;
  }

   $('.btnEliminarPaciente').prop('disabled', true);
   let respuesta = await eliminar_paciente(idPaciente, nomPaciente);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Paciente eliminado correctamente', '', 'success', 2500);
      let tabla = $('#tablePacientes').DataTable();
      tabla.row($('#trPaciente' + idPaciente)).remove().draw();
      $('.btnEliminarPaciente').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarPaciente').prop('disabled', false);
      return;
   }
}

const fn_ver_credenciales_paciente = async (idPaciente, nomPaciente, apPaterno) => {

   let respuesta      = await obtiene_credenciales_pacientes(idPaciente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      const credenciales = respuesta.data;

      if(credenciales.length == 0) {
         $('#container_credenciales_paciente').html(`<div class="alert alert-info p-2 text-center">No se encontraron las credenciales del usuario, vuelve a intentarlo</div>`);
      }
      else {
         let html = 
         `<div class="card border-0 shadow-sm bg-light mb-4">
            <div class="card-header bg-white border-0 pt-3 pb-2 border-bottom">
               <div class="d-flex align-items-center text-dark">
                  <i class="bi bi-person-badge-fill fs-4 me-2 text-secondary"></i>
                  <div>
                     <small class="d-block text-muted lh-1 mb-1">Paciente</small>
                     <h6 class="mb-0 fw-bold">${nomPaciente} ${apPaterno}</h6>
                  </div>
               </div>
            </div>
            <div class="card-body p-3">
               <div class="d-flex align-items-center mb-2 pb-2 border-bottom text-secondary">
                  <i class="bi bi-person-fill fs-5 me-2 text-primary"></i>
                  <div>
                     <small class="d-block text-muted lh-1">Usuario</small>
                     <span class="fw-bold text-dark">${credenciales[0].user_portal}</span>
                  </div>
               </div>                  
               <div class="d-flex align-items-center text-secondary">
                  <i class="bi bi-key-fill fs-5 me-2 text-warning"></i>
                  <div>
                     <small class="d-block text-muted lh-1">Contraseña</small>
                     <span class="font-monospace text-dark">${credenciales[0].contrasenia}</span>
                  </div>
               </div>
            </div>
         </div>`;
         $('#container_credenciales_paciente').html(html);
      }
   }
}

const fn_cambiar_credenciales_paciente = async (idPaciente, nomPaciente, apPaterno) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Las credenciales del paciente: ' + nomPaciente + ' serán cambiadas', 'question', 'Sí, cambiar', 'Cancelar');
   
   if (!res.result) {
      $('#btnCambiarCredenciales').prop('disabled', false);
      return;
   }
   
   nomPaciente = quitarAcentos(nomPaciente);
   apPaterno   = quitarAcentos(apPaterno);

   $('#btnCambiarCredenciales').prop('disabled', true);
   let respuesta = await cambiar_credenciales(idPaciente, nomPaciente, apPaterno);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Credenciales actualizadas correctamente!', '', 'success', 2500);
      fn_ver_credenciales_paciente(idPaciente);
      $('#btnCambiarCredenciales').prop('disabled', false);
      
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnCambiarCredenciales').prop('disabled', false);
      return;
   }
}

// Interfaces
window.TabPacientes                     = TabPacientes;
window.ModalFormPaciente                = ModalFormPaciente;
window.ModalCredencialesPaciente        = ModalCredencialesPaciente;
// Funciones
window.fn_eliminar_paciente             = fn_eliminar_paciente;
window.fn_guardar_paciente              = fn_guardar_paciente;
window.fn_ver_credenciales_paciente     = fn_ver_credenciales_paciente;
window.fn_cambiar_credenciales_paciente = fn_cambiar_credenciales_paciente;
