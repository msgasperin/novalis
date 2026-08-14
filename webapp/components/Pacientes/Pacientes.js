import { obtiene_pacientes, guardar_paciente, eliminar_paciente, obtiene_credenciales_pacientes, cambiar_credenciales, busca_paciente_coincidencia, valida_coincidencia_paciente } from "./PacientesServices.js";

let arrPacientes              = [];
let arrPacientesCoincidencias = [];
let objPacCoincidencia        = {};

const TabPacientes = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-people"></i> Pacientes</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevoPaciente" onclick="ModalFormPaciente(0, '', 1);"><i class="bi bi-plus-lg"></i> Nuevo Paciente</button>
      </div>
   </div>
   <div class="mt-4">
      <div class="card border-0 shadow-sm mb-3">
         <div class="card-body p-2">
            <div class="input-group">
               <input type="text" id="inputBuscarPaciente" class="form-control border-0 shadow-none ps-1" placeholder="Escribe el nombre del paciente a buscar..." autocomplete="off">
               <button class="btn btn-outline-success border-0 btn-redondo" type="button" id="btnBusquedaPacienteModulo" onclick="listar_pacientes('listar_pacientes');">
                  <i class="bi bi-search"></i>
               </button>
            </div>
         </div>
      </div>
      <div id="listar_pacientes">
         <div class="card border-0 shadow-sm mb-3 text-center">
            <div class="card-body p-4">
               <div class="row align-items-center">
                  <div class="col-12">
                     <i class="bi bi-people text-muted display-6 d-block mb-2"></i>
                     <h6 class="card-title text-dark fw-bold mb-1">Pacientes</h6>
                     <span class="text-muted small d-block mb-3">
                        Ingresa el nombre del paciente en el buscador para consultar su expediente, o bien, haz clic en el botón <strong class="text-primary pointer" onclick="ModalFormPaciente(0, '', 1);"><i class="bi bi-person-plus-fill me-1"></i>Nuevo paciente</strong> para registrar a uno nuevo.
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>`;

   $('#containerMain').html(html);
   
}

const ModalFormPaciente = (idPaciente, nomPaciente, origen) => {

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
      <div class="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${titulo}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="col-12 col-sm-6 mt-3">
                     <b>Nombre del paciente *</b>
                     <input type="text" name="nomPaciente" id="nomPaciente" class="form-control" maxlength="100" value="${nombre}"/>
                  </div>
                  <div class="col-12 col-sm-3 mt-3">
                     <b>Apellido paterno *</b>
                     <input type="text" name="apPaterno" id="apPaterno" class="form-control" maxlength="70" value="${apellido_paterno}"/>
                  </div>
                  <div class="col-12 col-sm-3 mt-3">
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
                     <b>Teléfono *</b>
                     <input type="tel" inputmode="numeric" name="telefonoPaciente" id="telefonoPaciente" class="form-control" maxlength="10" value="${telefono}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Correo</b>
                     <input type="mail" name="correoPaciente" id="correoPaciente" class="form-control" maxlength="100" value="${correo}" />
                  </div>
               </div>
            </div>
            <div class="modal-footer border-0 text-end">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnGuardarPaciente" onclick="validar_coincidencia_paciente('${idPaciente}', ${origen});">
                <i class="bi bi-save"></i> Guardar
              </button> 
              <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminExt').html(html);
   $('#modalFormPaciente').modal('show');
   setTimeout(() => {
      $('#sexoBiologico').val(sexo_biologico);
   }, 200);

   if(origen == 2) {
      $('#modalPacientesEncontrados').modal('hide');
   }
}

const listar_pacientes = async (containerId) => {
   
   let parametroBusqueda = $('#inputBuscarPaciente').val().trim();

   if (parametroBusqueda.length < 3) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar una palabra más larga; al menos 3 letras',
         icon: 'warning'
      });
      $('#inputBuscarPaciente').focus();
      return;
   }

   activarLoad('Cargando pacientes...');
   
   let respuesta      = await busca_paciente_coincidencia(parametroBusqueda);
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
            <th width="35%">Paciente</th>
            <th width="10%">Fecha Nacimiento</th>
            <th width="10%">Sexo</th>
            <th width="10%">Teléfono</th>
            <th width="15%">Correo</th>
            <th width="15%">Acciones</th>
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
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Gestionar datos de facturación" onclick="ModalDatosFacturacion('PACIENTE', '${row.id}', '${nombreCompleto}');">
                        <i class="bi bi-receipt"></i>
                     </button>
                  <button type="buttton" class="btn btn-outline-secondary btn-redondo btn-sm px-2" onclick="ModalFormPaciente('${row.id}', '${nombreCompleto}', 1);" title="Editar paciente">
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

const validar_coincidencia_paciente = async (idPaciente, origen) => {
   
   //Si es un registro nuevo validamos
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
     
   const objPaciente = { func: 'valida_coincidencia_paciente', idPaciente, nomPaciente, apPaterno, apMaterno, sexoBiologico, fechaNacimiento, telefonoPaciente, correoPaciente };

   // Si es una edición
   if(parseInt(idPaciente) > 0) { 
      fn_guardar_paciente(idPaciente, origen, objPaciente);
      return;
   }

   $('#btnGuardarPaciente').prop('disabled', true);

   let respuesta = await valida_coincidencia_paciente(objPaciente);

   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      if(respuesta.data.length > 0) {
         objPacCoincidencia =  objPaciente;
         arrPacientesCoincidencias = respuesta.data;
         ModalCoincidenciasPacientes(arrPacientesCoincidencias, objPaciente, origen);
         $('#btnGuardarPaciente').prop('disabled', false);
         return;
      }

      fn_guardar_paciente(idPaciente, origen, objPaciente, 1);
      $('#btnGuardarPaciente').prop('disabled', false);

   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGuardarPaciente').prop('disabled', false);
      return;
   }
}

const ModalCoincidenciasPacientes = (data, objPaciente, origen) => {

    let html = `
    <div class="modal fade modal-superior-blur" id="modalCoincidenciasPacientes" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-fullscreen-md-down modal-lg">
            <div class="modal-content sombra-modal border-0">
                
                <div class="modal-header bg-warning bg-opacity-10 border-0 pt-3 pb-2 px-4">
                    <h6 class="modal-title fw-bold text-dark d-flex align-items-center">
                        <i class="bi bi-exclamation-triangle-fill text-warning me-2 fs-5"></i>
                        Posibles pacientes registrados
                    </h6>
                    <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body p-4">
                    <p class="text-muted small mb-3">
                        Encontramos ${data.length} ${data.length === 1 ? 'coincidencia' : 'coincidencias'} en el catálogo. Verifica si el paciente que estás intentando registrar ya existe:
                    </p>
                    <div class="pe-1">`;
                        data.forEach(row => {
                           const materno = row.apellido_materno ? ` ${row.apellido_materno}` : '';
                           const nombreCompleto = `${row.nombre} ${row.apellido_paterno}${materno}`;
                           
                           html += `
                           <div class="card border-0 shadow-sm mb-2 rounded-3 hover-shadow transition-all">
                              <div class="card-body p-3">
                                 <div class="row align-items-center">
                                    <div class="col-8 col-md-9">
                                       <div class="fw-bold text-dark mb-1">
                                          <i class="bi bi-person-circle text-secondary me-2"></i>${nombreCompleto}
                                       </div>
                                       <div class="d-flex flex-wrap gap-3 text-muted small">
                                          <span><i class="bi bi-calendar3 me-1"></i>${row.fecha_nacimiento}</span>
                                          ${row.telefono ? `<span><i class="bi bi-telephone me-1"></i>${row.telefono}</span>` : ''}
                                          ${row.correo ? `<span><i class="bi bi-at me-1"></i></i>${row.correo}</span>` : ''}
                                       </div>
                                    </div>
                                    <div class="col-4 col-md-3 text-end">
                                       <button type="button" class="btn btn-sm btn-outline-success btn-redondo px-3 w-100" onclick="paciente_coincidente_seleccionado(${row.id}, ${origen})">
                                          <i class="bi bi-check-lg me-1"></i>Seleccionar
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>`;
                        });

                        html += `
                    </div>

                    <div class="alert alert-light border-0 bg-light rounded-3 mt-3 mb-0 p-3">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-info-circle text-primary me-2 fs-5"></i>
                            <span class="text-muted small">
                                Si estás seguro de que es una persona distinta, haz clic en <strong>"Guardar como nuevo"</strong>.
                            </span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-0 bg-light px-4 py-3 d-flex justify-content-between align-items-center">
                    <button type="button" class="btn btn-outline-secondary btn-redondo" data-bs-dismiss="modal">
                        Cancelar
                    </button>
                    <button type="button" class="btn btn-dark btn-lib btn-redondo shadow-sm" id="btnForzarGuardadoPaciente" onclick="fn_guardar_paciente(0, '${origen}', 0, 2);">
                        <i class="bi bi-person-plus-fill me-1"></i>Ninguno coincide, guardar como nuevo
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    $('#modalAdminExt2').html(html);
    $('#modalCoincidenciasPacientes').modal('show');   
};

const paciente_coincidente_seleccionado = (idPaciente, origen) => {

   $('#modalCoincidenciasPacientes').modal('hide');
   $('#modalFormPaciente').modal('hide');

   let objetoPac = arrPacientesCoincidencias.find(paciente => paciente.id = idPaciente);  

   if(origen == 1) {
      $('#inputBuscarPaciente').val(objetoPac.nombre + ' ' + objetoPac.apellido_paterno + ' ' + objetoPac.apellido_materno);
      setTimeout(() => {
         listar_pacientes('listar_pacientes');
      }, 200);
   }
   else {      
      window.paciente_seleccionado(0, objetoPac, 2);
   }
}

const fn_guardar_paciente = async (idPaciente, origen, objPaciente, origenObjeto) => {
     
   if(origenObjeto == 2) {
      objPaciente = objPacCoincidencia;
   }

   let nomPaciente  = objPaciente.nomPaciente + ' ' + objPaciente.apPaterno + ' ' + objPaciente.apMaterno;
   let msjAccion    = '';
   objPaciente.func = 'guardar_paciente';

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
      $('#modalCoincidenciasPacientes').modal('hide');
      $('#btnGuardarPaciente').prop('disabled', false);
      if(origen == 1) {
         $('#inputBuscarPaciente').val(objPaciente.nomPaciente + ' ' + objPaciente.apPaterno + ' ' + objPaciente.apMaterno );
         setTimeout(() => {
            listar_pacientes('listar_pacientes');
         }, 200);
      }
      else {
         let objetoPac = { id: respuesta.data[0], nombre: objPaciente.nomPaciente, apellido_paterno: objPaciente.apPaterno, apellido_materno: objPaciente.apMaterno, fecha_nacimiento: objPaciente.fechaNacimiento, sexo_biologico: objPaciente.sexoBiologico, telefono: objPaciente.telefonoPaciente, correo: objPaciente.correoPaciente };
         window.paciente_seleccionado(0, objetoPac, 2);
      }
   } 
   else {
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
window.TabPacientes                      = TabPacientes;
window.ModalFormPaciente                 = ModalFormPaciente;
window.ModalCredencialesPaciente         = ModalCredencialesPaciente;
// Funciones
window.fn_eliminar_paciente              = fn_eliminar_paciente;
window.validar_coincidencia_paciente     = validar_coincidencia_paciente;
window.fn_guardar_paciente               = fn_guardar_paciente;
window.fn_ver_credenciales_paciente      = fn_ver_credenciales_paciente;
window.fn_cambiar_credenciales_paciente  = fn_cambiar_credenciales_paciente;
window.listar_pacientes                  = listar_pacientes;
window.paciente_coincidente_seleccionado = paciente_coincidente_seleccionado;
