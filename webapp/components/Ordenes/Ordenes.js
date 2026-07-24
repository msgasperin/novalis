import { obtiene_estudios_recepcion, agregar_estudio_carrito, borrar_carrito_recepcion, borrar_estudio_carrito } from "./OrdenesServices.js";
import { busca_paciente_coincidencia, busca_paciente_fecha_nac } from "../Pacientes/PacientesServices.js";
import { obtiene_convenios } from "../Convenios/ConveniosServices.js";

let arrOredenes          = [];
let arrPacientesBusqueda = [];
let comboConvenios       = '';
let pacienteOrden;

const TabRecepcion = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-clipboard-minus"></i> Recepcion</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2 text-end">
         <button class="btn btn-dark btn-lib btn-redondo fs-6" type="button" id="btnNuevoCliente" onclick="ModalFormCliente(0);">
            <i class="bi bi-plus-lg"></i>
         </button>
      </div>
   </div>
   <div class="row mt-3">
      
      <div class="col-12 col-sm-8 col-lg-9">
         <div class="card">
            <div class="card-body">
               <div class="row">
                  <div class="col-12">
                     <h5 class="fw-bold text-secondary"><span class="badge rounded-pill bg-success">1</span> Selección de paciente</h5>
                  </div>
                  <div class="col-12 col-sm-8 mt-2">
                     <b>Búsqueda de paciente por nombre o correo electrónico</b>
                     <div class="input-group mb-3">
                        <input type="text" class="form-control form-control-lg fs-6" id="busquedaPacienteRec" placeholder="Ingresa el nombre del paciente o su correo electrónico" value="sainz">
                        <button class="btn btn-dark btn-lib" type="button" id="btnBusquedaPacienteRecepcion" onclick="buscar_paciente_recepcion('container_busqueda_paciente_recepcion');">
                           <i class="bi bi-search"></i>
                        </button>
                     </div>
                  </div>

                  <div class="col-12 col-sm-4 mt-2">
                     <b>Búsqueda por fecha de nacimiento</b>
                     <div class="input-group mb-3">
                        <input type="date" class="form-control form-control-lg fs-6" id="busFecNacPac">
                        <button class="btn btn-dark btn-lib" type="button" id="btnBusquedaPacFecNac" onclick="busca_paciente_fecha_nacimiento('container_busqueda_paciente_recepcion');">
                           <i class="bi bi-search"></i>
                        </button>
                     </div>
                  </div>

                  <div class="col-12 mt-2">
                     <div id="container_busqueda_paciente_recepcion"></div>
                  </div>
               </div>
            </div>
         </div>

         <div id="container_form_carga_estudios"></div>

      </div>        

      <div class="col-12 col-sm-4 col-lg-3">
         <div class="card">
            <div class="card-body">
               <div class="row">
                  <div class="col-12">
                     <h5>Búsqueda de ordenes</h5>
                  </div>
                  <div class="col-12 mt-2">
                     <div class="input-group mb-3">
                        <input type="date" class="form-control" name="busOrdFecha" id="busOrdFecha" placeholder="Buscar ordenes...">
                        <button class="btn btn-dark btn-lib" type="button" id="button-addon2"><i class="bi bi-search"></i></button>
                     </div>
                  </div>
                  <div class="col-12 mt-2">
                     <div id="ordenes_del_dia"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

   </div>`;

   $('#containerMain').html(html);
   setTimeout(() => {
      pinta_ordenes_del_dia('ordenes_del_dia');
   }, 200);
}

const pinta_ordenes_del_dia = (containerId) => {
   let html = `
   <div class="row align-items-center mb-3 mt-2 px-1">
      <div class="col-8">
         <span class="fs-6 fw-bold text-secondary text-uppercase tracking-wider">Órdenes del Día</span>
      </div>
      <div class="col-4 text-end">
         <span class="badge bg-primary rounded-pill">2 hoy</span>
      </div>
   </div>

   <div class="row mb-3 px-1">
      <div class="col-12">
         <div class="input-group input-group-sm shadow-sm">
            <span class="input-group-text bg-white border-end-0 text-muted">
               <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control border-start-0 ps-0" placeholder="Buscar orden reciente...">
         </div>
      </div>
   </div>

   <div class="orders-log-container pe-1" style="max-height: 70vh; overflow-y: auto;">
      
      <div class="card border-0 shadow-sm mb-2 text-start border-start border-4 border-success" style="cursor: pointer;">
         <div class="card-body p-3">
            
            <div class="row align-items-center mb-2">
               <div class="col-7">
                  <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill small">
                     Particular
                  </span>
               </div>
               <div class="col-5 text-end">
                  <span class="fw-semibold text-primary small bg-light px-2 py-1 rounded">
                     #0001
                  </span>
               </div>
            </div>

            <div class="row">
               <div class="col-12">
                  <h6 class="card-title text-dark fw-bold mb-1 text-truncate">
                     Romina López Rodríguez
                  </h6>
               </div>
            </div>

            <div class="row align-items-center mt-2 pt-2 border-top border-light">
               <div class="col-6">
                  <small class="text-muted"><i class="bi bi-clock me-1"></i> 08:20 AM</small>
               </div>
               <div class="col-6 text-end">
                  <span class="badge bg-light text-dark border small">Recepcion</span>
               </div>
            </div>

         </div>
      </div>

      <div class="card border-0 shadow-sm mb-2 text-start border-start border-4 border-warning" style="cursor: pointer;">
         <div class="card-body p-3">
            
            <div class="row align-items-center mb-2">
               <div class="col-7">
                  <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill small">
                     Convenio
                  </span>
               </div>
               <div class="col-5 text-end">
                  <span class="fw-semibold text-primary small bg-light px-2 py-1 rounded">
                     #0002
                  </span>
               </div>
            </div>

            <div class="row">
               <div class="col-12">
                  <h6 class="card-title text-dark fw-bold mb-1 text-truncate" title="Miguel Ángel Sáinz Gasperín">
                     Miguel Ángel Sáinz Gasperín
                  </h6>
                  <p class="text-muted small mb-0 text-truncate">
                     <i class="bi bi-building me-1"></i> Clínica Metabólica Xalapa
                  </p>
               </div>
            </div>

            <div class="row align-items-center mt-2 pt-2 border-top border-light">
               <div class="col-6">
                  <small class="text-muted"><i class="bi bi-clock me-1"></i> 09:15 AM</small>
               </div>
               <div class="col-6 text-end">
                  <span class="badge bg-light text-dark border small">Laboratorio</span>
               </div>
            </div>

         </div>
      </div>

   </div>`;

   $('#' + containerId).html(html);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SELECCIÓN DE PACIENTE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const busca_paciente_fecha_nacimiento = async () => {
   
   let fecha = $('#busFecNacPac').val().trim();

   if (fecha == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar una fecha de nacimiento',
         icon: 'warning'
      });
      $('#busFecNacPac').focus();
      return;
   }

   let respuesta      = await busca_paciente_fecha_nac(fecha);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrPacientesBusqueda = respuesta.data;
      modalPacientesEncontrados(respuesta.data, fecha);
   }
}

const buscar_paciente_recepcion = async () => {
   
   let parametroBusqueda = $('#busquedaPacienteRec').val().trim();

   if (parametroBusqueda == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del paciente o su correo electrónico',
         icon: 'warning'
      });
      $('#busquedaPacienteRec').focus();
      return;
   }
   else if (parametroBusqueda.length < 3) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar una palabra más larga; al menos 3 letras',
         icon: 'warning'
      });
      $('#busquedaPacienteRec').focus();
      return;
   }

   let respuesta      = await busca_paciente_coincidencia(parametroBusqueda);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrPacientesBusqueda = respuesta.data;
      modalPacientesEncontrados(respuesta.data, parametroBusqueda);
   }
}

const modalPacientesEncontrados = (listaPacientes, parametroBusqueda) => {
   // Generamos las filas de los pacientes encontrados
   let filasPacientes = '';

   if (listaPacientes.length === 0) {
      filasPacientes = `
      <tr>
         <td colspan="5" class="text-center py-4 text-muted">
            <i class="bi bi-person-x fs-3 d-block mb-2 text-warning-emphasis"></i>
            <p class="mb-3">
               No se encontraron pacientes que coincidan con "<strong>${parametroBusqueda}</strong>"
            </p>
            <button type="button" 
                  class="btn btn-success btn-sm btn-redondo px-3" onclick="ModalFormPaciente(0, '', 2);">
               <i class="bi bi-person-plus-fill me-1"></i> Registrar como nuevo paciente
            </button>
         </td>
      </tr>`;
   } else {
   
      listaPacientes.forEach((paciente, index) => {
         // Sanitizamos nombres para evitar problemas con comillas en el onclick
         const nombreCompleto = `${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno || ''}`.trim();
         const nombreEscapado = nombreCompleto.replace(/'/g, "\\'");
         const apPaternoEscapado = paciente.apellido_paterno.replace(/'/g, "\\'");
         const nomEscapado = paciente.nombre.replace(/'/g, "\\'");

         filasPacientes += `
         <tr class="align-middle">
            <td width="30%">
               <strong class="text-dark">${paciente.apellido_paterno} ${paciente.apellido_materno || ''}</strong>, ${paciente.nombre}
            </td>
            <td width="15%" class="text-nowrap">
               <i class="bi bi-calendar3 text-muted me-1"></i> ${paciente.fecha_nacimiento_format || 'N/D'}
            </td>
            <td width="20%">
               <span class="small text-muted d-block text-truncate" style="max-width: 180px;" title="${paciente.correo || ''}">
                  ${paciente.correo || '<em class="text-muted-light">Sin correo</em>'}
               </span>
            </td>
            <td width="15%" class="text-center">
               <span class="badge rounded-pill bg-light text-dark border">
                  ${paciente.sexo_biologico || '-'}
               </span>
            </td>
            <td width="20%" class="text-center">
               <button type="button" class="btn btn-success btn-sm btn-redondo px-3" onclick="paciente_seleccionado('${paciente.id}', '', 1);">
                  <i class="bi bi-check2-circle"></i> Seleccionar
               </button>
            </td>
         </tr>`;
      });
   }

   let html = `
   <div class="modal fade modal-superior-blur" id="modalPacientesEncontrados" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down">
         <div class="modal-content sombra-modal border-0">
            <!-- Encabezado con estilo sutil y limpio -->
            <div class="modal-header border-0 pb-0">
               <h5 class="modal-title d-flex align-items-center gap-2">
                  <i class="bi bi-people text-secondary fs-4"></i>
                  <span>Coincidencias de Pacientes</span>
               </h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body py-3">
               <p class="text-muted small mb-3">
                  Resultados para la búsqueda: <mark class="px-2 py-0.5 rounded text-dark bg-info bg-opacity-25">"${parametroBusqueda}"</mark>
               </p>
               
               <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                     <thead class="table-light sticky-top">
                        <tr class="small text-uppercase text-muted">
                           <th>Nombre del Paciente</th>
                           <th>F. Nacimiento</th>
                           <th>Correo</th>
                           <th class="text-center">Sexo</th>
                           <th class="text-center">Acción</th>
                        </tr>
                     </thead>
                     <tbody>
                        ${filasPacientes}
                     </tbody>
                  </table>
               </div>
            </div>

            <div class="modal-footer border-0 pt-0">
               <button type="button" class="btn btn-outline-dark btn-redondo btn-sm" data-bs-dismiss="modal">
                  Cancelar
               </button>
            </div>
         </div>
      </div>
   </div>`;

   // Inyectamos en tu contenedor común de modales de administración/procesos
   $('#modalAdmin').html(html);
   $('#modalPacientesEncontrados').modal('show');
}

const paciente_seleccionado = (idPaciente, paciente, origen) => {  

   if(origen == 1) {
      paciente = arrPacientesBusqueda.find(pac => parseInt(pac.id) == parseInt(idPaciente));
   }

   pacienteOrden = paciente;
      
   let html = `
   <div class="card border-0 shadow-sm border-start border-4 border-secondary">
      <div class="card-body p-3">
         
         <div class="row align-items-center mb-2">
            <div class="col-md-8">
               <h5 class="card-title text-dark fw-bold mb-0 text-truncate">
                  ${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno}
               </h5>
            </div>
            <div class="col-md-4 text-md-end">
               <span class="badge bg-light text-dark border fw-semibold fs-7 px-2 py-1">
                  ${paciente.correo || '<em class="text-muted-light">Sin correo</em>'}
               </span>
            </div>
         </div>

         <div class="row mb-3">
            <div class="col-6 col-md-4">
               <small class="text-muted d-block text-uppercase fs-7">Sexo</small>
               <span class="fw-semibold text-secondary">${paciente.sexo_biologico || '-'}</span>
            </div>
            <div class="col-6 col-md-4">
               <small class="text-muted d-block text-uppercase fs-7">Fecha Nac.</small>
               <span class="fw-semibold text-secondary">${paciente.fecha_nacimiento_format || 'N/D'}</span>
            </div>
         </div>

         <div class="row pt-3 border-top border-light">
            <div class="col-12 mb-1">
               <small class="text-muted d-block text-uppercase fs-7 fw-bold">Seleccione Tipo de Cliente / Convenio:</small>
            </div>
         </div>

         <div class="row align-items-center g-2">
            
            <div class="col-6 col-sm-3">
               <input type="radio" class="btn-check" name="optionTipoCliente" id="success-outlined" autocomplete="off" value="particular" onclick="form_carga_estudios('container_form_carga_estudios'), ocultar_convenios();">
               <label class="btn btn-outline-dark btn-sm w-100 fw-bold" for="success-outlined">Particular</label>
            </div>
            
            <div class="col-6 col-sm-3">
               <input type="radio" class="btn-check" name="optionTipoCliente" id="danger-outlined" autocomplete="off" value="convenio" onclick="combo_listas_convenios('selectConvenioEmpresa');">
               <label class="btn btn-outline-dark btn-sm w-100 fw-bold" for="danger-outlined">Convenio</label>
            </div>
            
            <div class="col-12 col-sm-6 no-display" id="comboConvenio">
               <select name="selectConvenioEmpresa" id="selectConvenioEmpresa" class="form-control form-control-sm select2" onchange="form_carga_estudios('container_form_carga_estudios');">
                  <option value="0" selected disabled>Selecciona el convenio</option>
               </select>
            </div>

         </div>

      </div>
   </div>`;

   $('#container_busqueda_paciente_recepcion').html(html);
   $('#modalPacientesEncontrados').modal('hide');
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++ SELECCIÓN DE CONVENIO LISTADO DE ESTUDIOS   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ocultar_convenios = () => {
   $('#comboConvenio').hide();
}

const combo_listas_convenios = async (containerId) => {

   $('#comboConvenio').show();
   $('#container_form_carga_estudios').html('');

   if(comboConvenios.length == 0) {
      comboConvenios = '<option value="0" selected disabled data-tipo="NA">Selecciona el convenio</option>';
      let respuesta = await obtiene_convenios();
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
            res.map((convenio) => {
               comboConvenios +=`<option value="${convenio.id_convenio}" data-tipo="${convenio.tipo}" data-lista-precio="${convenio.lista_precio_id}">${convenio.razon_social}</option>`;
            });
            $('#'+containerId).html(comboConvenios);
         }      
      }
   }
   else {
      $('#'+containerId).html(comboConvenios);
   }

   $('.select2').select2({theme: 'bootstrap-5'});
}

const form_carga_estudios = (containerId) => {

   $('#' + containerId).html('');
   let idConvenio      = 0;
   let idListaPrecio   = 0;
   let tipoSolicitante = $('input[name="optionTipoCliente"]:checked').val();

   if(tipoSolicitante == 'convenio') {
      idConvenio      = $('#selectConvenioEmpresa').val();
      idListaPrecio   = $('#selectConvenioEmpresa option:selected').data('lista-precio');
   }

   let html =
   `<div class="card mt-3">
      <div class="card-body">
         <div class="row">
            <div class="col-12">
               <h5 class="fw-bold text-secondary"><span class="badge rounded-pill bg-success">2</span> Selección de estudios</h5>
            </div>
            <div class="col-12 mt-2">
               <div class="input-group mb-3">
                  <select name="estudiosRecepcion" id="estudiosRecepcion" class="form-control select2">
                     <option value="0" data-precio="0.00" data-estudio="NA">Selecciona un estudio</option>
                  </select>
                  <button class="btn btn-dark btn-lib" type="button" id="btnAgregarEstudio" onclick="agrega_estudio_carrito();">
                     <i class="bi bi-plus-circle"></i>
                  </button>
                  <button class="btn btn-danger" type="button" id="btnAgregarBorrarEstudios" onclick="borra_carrito_recepcion();">
                     <i class="bi bi-trash"></i>
                  </button>
               </div>
            </div>
            <div class="col-12 mt-2">
               <div id="estudios_agregados_recepcion"></div>
            </div>
         </div>
      </div>
   </div>`;

   $('#' + containerId).html(html);

   if(tipoSolicitante == 'particular' || (tipoSolicitante == 'convenio' && parseInt(idConvenio) > 0)) {
      combo_listas_estudios(tipoSolicitante, idListaPrecio, 'estudiosRecepcion');
   }
   vaciar_carrito_recepcion();
}

const combo_listas_estudios = async (tipoSolicitante, idListaPrecio, containerId) => {

   let comboEstudios = '<option value="0" data-precio="0.00" data-estudio="NA">Selecciona un estudio</option>';
   let respuesta = await obtiene_estudios_recepcion(tipoSolicitante, idListaPrecio);
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
         res.map((estudio) => {
            comboEstudios +=`<option value="${estudio.id}" data-precio="${estudio.precio_publico}" data-estudio="${estudio.nombre}">${estudio.nombre}</option>`;
         });
         $('#'+containerId).html(comboEstudios);
      }      
   }

   $('.select2').select2({theme: 'bootstrap-5'});
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CARRITO DE ESTUDIOS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const agrega_estudio_carrito =  async () => {
   
   let idEstudio    = $('#estudiosRecepcion').val().trim();

   if(idEstudio <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un estudio',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#estudiosRecepcion').focus();
      return;
   }
      
   let res = await agregar_estudio_carrito(idEstudio)
   if(res.estatus == 403) {
      fnNoSesion();
   }
   else if(res.estatus == 200) {
      $('#estudiosRecepcion').val(0);
      $('#estudiosRecepcion').trigger('change');
      pintado_carrito(res.data, 'estudios_agregados_recepcion');
   }
   else {
      ToastColor.fire({
         text: '¡Atención! Hubo un problema para agregar el estudio, actualiza e inténtalo de nuevo',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }
}

const borra_estudio_carrito = async (idCarrito, estudio) => {   
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El estudio: '+ estudio +' será eliminado', 'question', 'Sí, borrar', 'Cancelar');
   
   if (!res.result) {
      return;
   }

   let respuesta = await borrar_estudio_carrito(idCarrito);

   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Estudio eliminado correctamente!', '', 'success', 2500);
      $('#cardEstudioCarrito'+idCarrito).remove();
      pintado_carrito(respuesta.data);

      if (!document.querySelector('.validaHayCarrito')) {
         pintado_carrito([], 'estudios_agregados_recepcion');
      }
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      return;
   }
}

const pintado_carrito = (data, containerId) => {

   let html      = '';
   let descuento = '';
   let total     = 0;
   
   if (data && Object.keys(data).length > 0) {
      Object.values(data).forEach(row => {

         total += parseFloat(row.precio || 0);

         html += 
         `<div class="card mb-2 rounded-2 border-0 shadow-sm validaHayCarrito" id="cardEstudioCarrito${row.id}">
            <div class="card-body p-3">
               <div class="row align-items-center g-2">
                  <div class="col-12 col-md-7 col-lg-8">
                     <h6 class="fw-bold mb-1 text-primary-emphasis">${row.nom_estudio ?? ''}</h6>
                     <div class="small text-secondary lh-sm mb-1">${row.descripcion_estudio ?? ''}</div>
                     ${row.indicaciones_toma ? `<div class="small text-muted fst-italic"><i class="bi bi-info-circle me-1"></i>${row.indicaciones_toma}</div>` : ''}
                  </div>
                  
                  <div class="col-6 col-md-3 col-lg-2 text-start text-md-center">
                     <span class="d-block small text-uppercase fw-semibold text-muted">Precio</span>
                     <span class="badge bg-light text-dark border fs-6 fw-bold px-2 py-1">$${row.precio}</span>
                  </div>

                  <div class="col-6 col-md-2 col-lg-2 text-end">
                     <button type="button" class="btn btn-outline-danger btn-sm btn-redondo px-2 py-1" title="Eliminar estudio" onclick="borra_estudio_carrito('${row.id}', '${row.nom_estudio}');">
                        <i class="bi bi-trash3"></i>
                     </button>
                  </div>
               </div>
            </div>
         </div>`;
      });

      html +=
      `<div class="card border-0 bg-light rounded-2 mt-3 p-3">
         <div class="row align-items-center g-3">
            <div class="col-12 col-sm-6 text-start text-sm-start">
               <span class="text-uppercase small fw-bold text-secondary d-block">Resumen de Orden</span>
               <span class="fs-4 fw-bold text-dark" id="totalVentaOrden">Total: $${total.toFixed(2)}</span>
            </div>
            <div class="col-12 col-sm-6 text-end text-sm-end">
               <button type="button" class="btn btn-dark btn-lib btn-redondo px-4 py-2 fw-semibold w-100 w-sm-auto" id="btnRegistrarPedido" onclick="ModalRegistrarPedido('${total}');">
                  <i class="bi bi-save me-1"></i> Registrar orden
               </button>
            </div>
         </div>
      </div>`;
   }
   else {
      html = 
      `<div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3" alt="Sin estudios">
         <p class="text-muted fw-semibold mb-0">No se encontraron estudios agregados a la orden</p>
      </div>`;
   }

   $('#' + containerId).html(html);
}

const borra_carrito_recepcion = async () => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los estudios agregados serán eliminados', 'question', 'Sí, borrar', 'Cancelar');
   
   if (!res.result) {
      return;
   }

   let respuesta = await borrar_carrito_recepcion();

   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Estudios eliminados correctamente', '', 'success', 2500);
      $('#estudios_agregados_recepcion').html('<div class="text-center mt-5"><img src="assets/images/no_encontrado.png" class="img img-fluid"><br>No se encontraron estudios agregados</div>');
      $('#estudiosRecepcion').val(0);
      $('#estudiosRecepcion').trigger('change');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      return;
   }
}

const vaciar_carrito_recepcion = async () => {
   
   let respuesta = await borrar_carrito_recepcion();
   $('#estudios_agregados_recepcion').html('<div class="text-center mt-5"><img src="assets/images/no_encontrado.png" class="img img-fluid"><br>No se encontraron estudios agregados</div>');
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabRecepcion                    = TabRecepcion;
window.modalPacientesEncontrados       = modalPacientesEncontrados;

window.paciente_seleccionado           = paciente_seleccionado;
window.form_carga_estudios             = form_carga_estudios;
window.buscar_paciente_recepcion       = buscar_paciente_recepcion;
window.busca_paciente_fecha_nacimiento = busca_paciente_fecha_nacimiento;
window.combo_listas_convenios          = combo_listas_convenios;
window.ocultar_convenios               = ocultar_convenios;

window.agrega_estudio_carrito          = agrega_estudio_carrito;
window.borra_estudio_carrito           = borra_estudio_carrito;
window.pintado_carrito                 = pintado_carrito;
window.borra_carrito_recepcion         = borra_carrito_recepcion;