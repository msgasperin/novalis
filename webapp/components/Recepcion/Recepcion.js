import { obtiene_estudios_recepcion, agregar_estudio_carrito, borrar_carrito_recepcion, borrar_estudio_carrito, registrar_orden, obtiene_ordenes_hoy, buscar_ordenes_avanzado } from "./RecepcionServices.js";
import { busca_paciente_coincidencia, busca_paciente_fecha_nac } from "../Pacientes/PacientesServices.js";
import { obtiene_convenios } from "../Convenios/ConveniosServices.js";
import { obtiene_descuentos } from "../Descuentos/DescuentosServices.js";

let arrOrdenesBusAvanzada = [];
let arrOrdenesHoy         = [];
let arrEstudios           = [];
let arrPacientesBusqueda  = [];
let comboConvenios        = '';
let comboDescuentos       = '';
let pacienteOrden;

const TabRecepcion = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-clipboard-minus"></i> Recepción</div>
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
                  <div class="col-12 mt-2">
                     <div class="d-grid gap-2">
                        <button class="btn btn-dark btn-lib btn-redondo" type="button" onclick="ModalBuscarOrdenes();">
                           <i class="bi bi-search"></i> Búsqueda ordenes
                        </button>
                     </div>
                  </div>
                  <div class="col-12 mt-2">
                     <div class="row align-items-center mb-3 mt-2 px-1">
                        <div class="col-8">
                           <span class="fs-6 fw-bold text-secondary text-uppercase tracking-wider">Órdenes del Día</span>
                        </div>
                        <div class="col-4 text-end">
                           <span class="badge bg-primary rounded-pill"><span id="totalHoy">0</span></span>
                        </div>
                     </div>

                     <div class="row mb-3 px-1">
                        <div class="col-12">
                           <div class="input-group input-group-sm shadow-sm">
                              <span class="input-group-text bg-white border-end-0 text-muted">
                                 <i class="bi bi-search"></i>
                              </span>
                              <input type="text" class="form-control border-start-0 ps-0" id="inpBusquedaOrdenHoy" placeholder="Buscar orden reciente..." onkeyUp="buscar_ordenes_hoy();">
                           </div>
                        </div>
                     </div>
                     <div id="ordenes_del_dia"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

   </div>`;

   $('#containerMain').html(html);
   setTimeout(() => {
      obtener_ordenes_hoy('ordenes_del_dia');
   }, 200);
}

const obtener_ordenes_hoy = async (containerId) => {

   $('#comboConvenio').show();
   $('#'+containerId).html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');
   
   let respuesta = await obtiene_ordenes_hoy();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else if(respuesta.data.length == 0) {
      $('#' + containerId).html(`
         <div class="card border-0 shadow-sm mb-2 text-center">
            <div class="card-body p-4">
                  <div class="row align-items-center">
                     <div class="col-12">
                        <i class="bi bi-inbox text-muted display-6 d-block mb-2"></i>
                        <h6 class="card-title text-dark fw-bold mb-1">Sin órdenes registradas</h6>
                        <span class="text-muted small">No hay órdenes registradas el día de hoy.</span>
                     </div>
                  </div>
            </div>
         </div>
      `);
      return;
   }
   else {
      let res = await respuesta.data;
      arrOrdenesHoy = res;
      pinta_ordenes_del_dia(arrOrdenesHoy, containerId);
   }
}

const pinta_ordenes_del_dia = (data, containerId) => {

   let color     = '';
   let colorPago = '';

   let cuantas = data.length;
   $('#totalHoy').html(cuantas+' hoy');

   let html = 
   `<div class="orders-log-container pe-1 altura-ordenes-hoy">`;
      data.forEach((row, index) => {

         color     = (row.tipo_cliente == 'particular') ? 'dark' : 'primary';
         colorPago = (row.estatus_pago == 'PAGADO') ? 'success' : (row.estatus_pago == 'PARCIAL') ? 'primary' : 'danger';
         
         html+=`      
         <div class="card border-0 shadow-sm mb-2 text-start border-start border-4 border-${colorPago}">
            <div class="card-body p-3">
               
               <div class="row align-items-center mb-2">
                  <div class="col-7 pointer">
                     <span class="badge bg-${colorPago}-subtle text-${colorPago} border border-${colorPago}-subtle rounded-pill small text-uppercase">
                        <i class="bi bi-currency-dollar"></i> ${row.estatus_pago}
                     </span>
                  </div>
                  <div class="col-5 text-end">
                     <span class="fw-semibold text-primary small bg-light px-2 py-1 rounded">
                        #${row.folio}
                     </span>
                  </div>
               </div>

               <div class="row">
                  <div class="col-12">
                     <h6 class="card-title text-dark fw-bold mb-1 text-truncate">
                        ${row.paciente_nombre_historico}
                     </h6>
                     <span class="text-muted small text-uppercase">${row.tipo_cliente ?? ''}</span><br>
                     <span class="text-muted small">${row.convenio_nombre_historico ?? ''}</span>
                  </div>
               </div>

               <div class="row align-items-center mt-2 pt-2 border-top border-light">
                  <div class="col-6">
                     <small class="text-muted"><i class="bi bi-clock me-1"></i> ${row.hora_registro}</small>
                  </div>
                  <div class="col-6 text-end">
                     <a href="reportes/ticket?kq=${row.key_query}" target="_blank" class="badge bg-light border" title="Imprimir ticket">
                        <i class="bi bi-ticket-detailed text-dark fs-7"></i>
                     </a>
                     <span class="badge bg-light text-dark border small">${row.estatus}</span>
                  </div>
               </div>

            </div>
         </div>`;
      });
      html+=`
   </div>`;

   $('#' + containerId).html(html);
}

const buscar_ordenes_hoy = () => {
   let busqueda = $('#inpBusquedaOrdenHoy').val().trim().toLowerCase();
   
   const filtrado = arrOrdenesHoy.filter(orden => {
      const nombreCoincide = orden.paciente_nombre_historico.toLowerCase().includes(busqueda);
      
      const ultimoFolio   = orden.folio.split('-').pop();
      const folioCoincide = ultimoFolio === busqueda;
      
      return nombreCoincide || folioCoincide;
   });

   pinta_ordenes_del_dia(filtrado, 'ordenes_del_dia');
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
      ModalPacientesEncontrados(respuesta.data, fecha);
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
      ModalPacientesEncontrados(respuesta.data, parametroBusqueda);
   }
}

const ModalPacientesEncontrados = (listaPacientes, parametroBusqueda) => {
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
            <button type="button" class="btn btn-success btn-sm btn-redondo px-3" onclick="ModalFormPaciente(0, '', 2);">
               <i class="bi bi-person-plus-fill me-1"></i> Registrar como nuevo paciente
            </button>
         </td>
      </tr>`;
   } else {
   
      listaPacientes.forEach((paciente, index) => {
         // Sanitizamos nombres para evitar problemas con comillas en el onclick
         const nombreCompleto    = `${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno || ''}`.trim();
         const nombreEscapado    = nombreCompleto.replace(/'/g, "\\'");
         const apPaternoEscapado = paciente.apellido_paterno.replace(/'/g, "\\'");
         const nomEscapado       = paciente.nombre.replace(/'/g, "\\'");

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
   <div class="modal fade modal-superior-blur" id="ModalPacientesEncontrados" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
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
               <div class="row">
                  <div class="col-12 col-sm-8 mb-3">
                     <p class="text-muted small">
                        Resultados para la búsqueda: <mark class="px-2 py-0.5 rounded text-dark bg-info bg-opacity-25">"${parametroBusqueda}"</mark>
                     </p>
                  </div>
                  <div class="col-12 col-sm-4 text-end mb-3">`
                     if(listaPacientes.length > 0) {
                        html+=`
                        <button type="button" class="btn btn-outline-dark btn-sm btn-redondo px-3" onclick="ModalFormPaciente(0, '', 2);">
                           <i class="bi bi-person-plus-fill me-1"></i> Registrar nuevo paciente
                        </button>`;
                     }
                     html+=`
                  </div>
               </div>               
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
   $('#ModalPacientesEncontrados').modal('show');
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
               <div class="badge bg-light text-dark border fw-semibold fs-7 px-2 py-1">
                  <i class="bi bi-at"></i> ${paciente.correo || '<em class="text-muted-light">Sin correo</em>'}
               </div>
               <br>               
               <div class="badge bg-light text-dark border fw-semibold fs-7 px-2 py-1">
                  <i class="bi bi-telephone-forward"></i> ${paciente.telefono || '<em class="text-muted-light">Sin Teléfono</em>'}
               </div>
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
                  <option value="0" selected data-tipo="NA" data-lista-precio="0" data-nom-precio="NA">Selecciona el convenio</option>
               </select>
            </div>

         </div>

      </div>
   </div>`;

   $('#container_busqueda_paciente_recepcion').html(html);
   $('#ModalPacientesEncontrados').modal('hide');
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++ SELECCIÓN DE CONVENIO LISTADO DE ESTUDIOS   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ocultar_convenios = () => {
   $('#comboConvenio').hide();
}

const combo_listas_convenios = async (containerId) => {

   $('#comboConvenio').show();
   $('#container_form_carga_estudios').html('');

   if(comboConvenios.length == 0) {
      comboConvenios = '<option value="0" selected data-tipo="NA" data-lista-precio="0" data-nom-precio="NA">Selecciona el convenio</option>';
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
               comboConvenios +=`<option value="${convenio.id_convenio}" data-tipo="${convenio.tipo}" data-lista-precio="${convenio.lista_precio_id}" data-nom-precio="${convenio.nombre}">${convenio.razon_social}</option>`;
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
   arrEstudios      = [];

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
      
   let res = await agregar_estudio_carrito(idEstudio);
   arrEstudios = res;
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

   arrEstudios   = [];
   let respuesta = await borrar_estudio_carrito(idCarrito);
   
   arrEstudios = respuesta;

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

   let html         = '';
   let labelDesc    = '';
   let totalSinDesc = 0;
   let totalConDesc = 0;
   let total        = 0;
      
   if (data && Object.keys(data).length > 0) {
      Object.values(data).forEach(row => {

         labelDesc = '';

         if(row.aplica_desc == 'SI') {
            totalConDesc += parseFloat(row.precio || 0) 
            labelDesc = '<div class="small text-muted fst-italic"><i class="bi bi-tag me-1"></i>Aplica descuento</div>';
         }
         else {
            totalSinDesc += parseFloat(row.precio || 0);
         }

         total+= row.precio;

         
         html += 
         `<div class="card mb-2 rounded-2 border-0 shadow-sm validaHayCarrito" id="cardEstudioCarrito${row.id}">
            <div class="card-body p-3">
               <div class="row align-items-center g-2">
                  <div class="col-12 col-md-7 col-lg-8">
                     <h6 class="fw-bold mb-1 text-primary-emphasis">${row.nom_estudio ?? ''}</h6>
                     <div class="small text-secondary lh-sm mb-1">${row.descripcion_estudio ?? ''}</div>
                     ${row.indicaciones_toma ? `<div class="small text-muted fst-italic"><i class="bi bi-info-circle me-1"></i>${row.indicaciones_toma}</div>` : ''}
                     ${labelDesc}
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
               <button type="button" class="btn btn-dark btn-lib btn-redondo px-4 py-2 fw-semibold w-100 w-sm-auto" id="btnRegistrarOrden" onclick="ModalRegistrarOrden('${total}', '${totalConDesc}', '${totalSinDesc}');">
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
      arrEstudios = [];
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


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ REGISTRO DE ORDEN +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ModalRegistrarOrden = (total, totalConDesc, totalSinDesc) => {

   // Se obtienen los datos generales de la orden
   let e    = fnObtieneEdad(pacienteOrden.fecha_nacimiento);
   let edad = '';

   e.anios > 0 ? edad = e.anios + ' años' : e.meses > 0 ? edad = e.meses + ' mes(es)' : edad = e.dias;

   let idPaciente     = pacienteOrden.id;
   let nomPaciente    = pacienteOrden.nombre + ' ' + pacienteOrden.apellido_paterno + ' ' +  pacienteOrden.apellido_materno;
   let sexo           = pacienteOrden.sexo_biologico; 
   let tipoCliente    = $('input[name="optionTipoCliente"]:checked').val();
   let selectConvenio = document.getElementById("selectConvenioEmpresa");
   let idConvenio     = selectConvenio.value;
   let tipoConvenio   = $('option:selected', selectConvenio).attr('data-tipo');
   let nomConvenio    = $('#selectConvenioEmpresa option:selected').text();
   let idPrecio       = $('option:selected', selectConvenio).attr('data-lista-precio');
   let nomPrecio      = $('option:selected', selectConvenio).attr('data-nom-precio');  
   total              = parseFloat(total) || 0;

   if(parseFloat(idPaciente) == 0 || nomPaciente == '' || sexo == '' || tipoCliente == '' || edad == '') {      
      ToastColor.fire({
         text: '¡Atención! Hubo parámetros que no pudieron cargarse, actualiza y vuelve a intentarlo',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }
   else if(tipoCliente == 'convenio' && idConvenio == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar a la empresa, laboratorio o doctor del convenio',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#selectConvenioEmpresa').focus();
      return;
   }
   else if(arrEstudios.length == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes agregar al menos un estudio a la orden',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }

   let html = `
   <div class="modal fade shadow-lg modal-superior-blur" id="modalRegistrarOrden" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal border-0">
            <div class="modal-body p-4">
               
               <!-- CABECERA ALINEADA A LA IZQUIERDA -->
               <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
                  <div class="rounded-circle bg-warning-subtle p-3 me-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; shrink: 0;">
                     <i class="bi bi-receipt text-warning-emphasis fs-3"></i>
                  </div>
                  <div>
                     <h4 class="fw-bold mb-1 text-dark">Confirmar Registro de Orden</h4>
                     <p class="text-muted small mb-0">Ajusta descuentos, cargos adicionales y registra el pago inicial antes de generar la orden.</p>
                  </div>
               </div>

               <div class="p-3 bg-light rounded border mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                     <span class="text-muted small">Subtotal estudios:</span>
                     <span class="fw-semibold small" id="lblSubtotalOrden">$${total.toFixed(2)}</span>                     
                  </div>

                  <!-- Línea de Descuento -->
                  <div class="d-flex justify-content-between align-items-center mb-1 text-success d-none" id="rowDescuentoAplicado">
                     <span class="small" id="lblTextoDescuento"><i class="bi bi-tag-fill me-1"></i> Descuento:</span>
                     <span class="fw-semibold small" id="lblMontoDescuento">-$0.00</span>
                  </div>

                  <!-- Línea de Cargo Extra -->
                  <div class="d-flex justify-content-between align-items-center mb-2 text-danger d-none" id="rowCargoExtraAplicado">
                     <span class="small" id="lblTextoCargoExtra"><i class="bi bi-plus-circle-fill me-1"></i> Cargo extra:</span>
                     <span class="fw-semibold small" id="lblMontoCargoExtra">+$0.00</span>
                  </div>

                  <hr class="my-2 border-secondary opacity-25">

                  <div class="d-flex justify-content-between align-items-center pt-1 mb-2">
                     <div>
                        <span class="text-uppercase fw-bold d-block lh-1">Total Final</span>
                        <span class="text-muted fs-7 opacity-75">Monto neto a cobrar</span>
                     </div>
                     <h3 class="fw-bold text-dark mb-0" id="lblTotalNetoOrden">$${total.toFixed(2)}</h3>
                  </div>

                  <!-- Línea de Abono / Pago Inicial -->
                  <div class="d-flex justify-content-between align-items-center border-top pt-2 mb-1 text-primary" id="rowAbonoAplicado">
                     <span class="small fw-semibold"><i class="bi bi-wallet2 me-1"></i> Abono inicial:</span>
                     <span class="fw-bold small" id="lblMontoAbonoResumen">-$${total.toFixed(2)}</span>
                  </div>

                  <!-- Línea de Saldo Pendiente -->
                  <div class="d-flex justify-content-between align-items-center pt-1">
                     <span class="fw-bold small text-muted">Saldo pendiente:</span>
                     <span class="fw-bold text-success fs-6" id="lblSaldoPendienteOrden">$0.00 (Liquidado)</span>
                  </div>
               </div>

               <!-- SECCIÓN AJUSTES DE ORDEN -->
               <div class="row g-3">
                  
                  <!-- Bloque 1: Aplicar Descuento -->
                  <div class="col-12">
                     <div class="card border-0 bg-white shadow-sm rounded-3 border-start border-primary border-4">
                        <div class="card-body p-3">
                           <div class="d-flex align-items-center mb-2">
                              <span class="badge bg-primary-subtle text-primary fw-bold me-2 px-2 py-1">
                                 <i class="bi bi-percent"></i>
                              </span>
                              <h6 class="fw-bold mb-0 text-dark">Aplicar Descuento General</h6>
                           </div>
                           
                           <div>
                              <select name="descuentoGeneralOrden" id="descuentoGeneralOrden" class="form-select border-secondary-subtle" onchange="calcularTotalDinamico('${total}', '${totalConDesc}', '${totalSinDesc}');">
                                 <option value="0" selected data-descuento="0">Selecciona un descuento</option>
                              </select>
                              <div class="form-text text-muted small mt-1">
                                 <i class="bi bi-info-circle me-1"></i> El descuento solo se aplicará a los estudios que lo tengan autorizado.
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <!-- Bloque 2: Cargo Adicional -->
                  <div class="col-12">
                     <div class="card border-0 bg-white shadow-sm rounded-3 border-start border-warning border-4">
                        <div class="card-body p-3">
                           <div class="d-flex align-items-center mb-3">
                              <span class="badge bg-warning-subtle text-warning-emphasis fw-bold me-2 px-2 py-1">
                                 <i class="bi bi-cash-stack"></i>
                              </span>
                              <h6 class="fw-bold mb-0 text-dark">Cargo Adicional <span class="text-muted fw-normal fs-7">(Opcional)</span></h6>
                           </div>

                           <div class="row g-3">
                              <div class="col-md-5">
                                 <label for="cargoExtraOrden" class="form-label fw-semibold small text-secondary">Monto extra</label>
                                 <div class="input-group">
                                    <span class="input-group-text bg-light text-muted">$</span>
                                    <input type="number" inputmode="decimal" name="cargoExtraOrden" id="cargoExtraOrden" class="form-control" placeholder="0.00" onkeypress="return fnValidaNumeros(event);" oninput="calcularTotalDinamico('${total}', '${totalConDesc}', '${totalSinDesc}');">
                                 </div>
                              </div>

                              <div class="col-md-7">
                                 <label for="motivoCargoExtraOrden" class="form-label fw-semibold small text-secondary">Motivo del cargo</label>
                                 <input type="text" name="motivoCargoExtraOrden" id="motivoCargoExtraOrden" class="form-control" placeholder="Ej. Servicio a domicilio, urgencia..." maxlength="100" oninput="calcularTotalDinamico('${total}', '${totalConDesc}', '${totalSinDesc}');">
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <!-- Bloque 3: Registro de Pago / Abono -->
                  <div class="col-12">
                     <div class="card border-0 bg-white shadow-sm rounded-3 border-start border-success border-4">
                        <div class="card-body p-3">
                           <div class="d-flex align-items-center mb-3">
                              <span class="badge bg-success-subtle text-success fw-bold me-2 px-2 py-1">
                                 <i class="bi bi-credit-card"></i>
                              </span>
                              <h6 class="fw-bold mb-0 text-dark">Registrar Pago / Abono Inicial</h6>
                           </div>

                           <div class="row g-3">
                              <div class="col-md-4">
                                 <label for="abonoOrden" class="form-label fw-semibold small text-secondary">Monto a abonar</label>
                                 <div class="input-group">
                                    <span class="input-group-text bg-light text-muted">$</span>
                                    <input type="number" inputmode="decimal" name="abonoOrden" id="abonoOrden" class="form-control fw-bold" value="${total.toFixed(2)}" placeholder="0.00" onkeypress="return fnValidaNumeros(event);" oninput="calcularTotalDinamico('${total}', '${totalConDesc}', '${totalSinDesc}');">
                                 </div>
                                 <div class="form-text text-muted fs-7 mt-1">Por defecto liquida el total. Puedes ajustarlo.</div>
                              </div>

                              <div class="col-md-8">
                                 <label for="metodoPagoOrden" class="form-label fw-semibold small text-secondary">Método de pago del abono</label>
                                 <select name="metodoPagoOrden" id="metodoPagoOrden" class="form-select">
                                    <option value="NA" selected>Selecciona un método de pago</option>
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TARJETA DE DEBITO">Tarjeta de Débito</option>
                                    <option value="TARJETA DE CREDITO">Tarjeta de Crédito</option>
                                    <option value="TRANSFERENCIA">Transferencia (SPEI)</option>
                                    <option value="CHEQUE">Cheque</option>
                                 </select>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>

               <!-- Acciones -->
               <div class="text-center mt-4 pt-2">
                  <button type="button" class="btn btn-dark btn-redondo px-4 me-2 shadow-sm" id="btnRegistrarOrden" onclick="registra_orden();">
                     <i class="bi bi-check-lg me-1"></i> Registrar orden
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-redondo px-4" data-bs-dismiss="modal">
                     <i class="bi bi-x-lg me-1"></i> No, cancelar
                  </button>
               </div>

            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalRegistrarOrden').modal('show');
   
   setTimeout(() => {
      combo_descuentos_generales('descuentoGeneralOrden');
   }, 200);
}

const calcularTotalDinamico_old = (total, totalConDesc, totalSinDesc) => {
   
   let montoDescuento         = 0;
   let subTotalMenosDescuento = total;
   
   // 1. Obtenemos el subtotal base
   let subtotalBase = parseFloat($('#lblTotalConDescuento').text().replace('$', '').trim()) || 0;   

   // 2. Obtener datos del Descuento seleccionado
   let selectDescuento = $('#descuentoGeneralOrden option:selected');
   let idDescuento     = parseFloat(selectDescuento.val()) || 0;
   let porcentajeDesc  = selectDescuento.data('descuento') || 0;
   let nombreDescuento = selectDescuento.text().trim();

   // 3. Obtener datos del Cargo Extra
   let cargoExtra  = parseFloat($('#cargoExtraOrden').val()) || 0;
   let motivoCargo = $('#motivoCargoExtraOrden').val().trim();

   // 4. Cálculo de descuento
   if(porcentajeDesc > 0) {
      montoDescuento         = Math.round((parseFloat(subtotalBase) * parseFloat(porcentajeDesc)) / 100);
      subTotalMenosDescuento = Math.round(parseFloat(subtotalBase) - parseFloat(montoDescuento));
   }

   // 5. Actualizar vista: Descuento
   if (montoDescuento > 0) {
      $('#lblTextoDescuento').html(`<i class="bi bi-tag-fill me-1"></i> Descuento ${nombreDescuento}:`);
      $('#lblMontoDescuento').text(`-$${montoDescuento.toFixed(2)}`);
      $('#rowDescuentoAplicado').removeClass('d-none');
   } else {
      $('#rowDescuentoAplicado').addClass('d-none');
   }

   // 6. Actualizar vista: Cargo Extra
   if (cargoExtra > 0) {
      let textoMotivo = motivoCargo !== '' ? ` (${motivoCargo})` : '';
      $('#lblTextoCargoExtra').html(`<i class="bi bi-plus-circle-fill me-1"></i> Cargo extra${textoMotivo}:`);
      $('#lblMontoCargoExtra').text(`+$${cargoExtra.toFixed(2)}`);
      $('#rowCargoExtraAplicado').removeClass('d-none');
   } else {
      $('#rowCargoExtraAplicado').addClass('d-none');
   }

   // 7. Cálculo del Total Neto Final
   let totalNeto = (subtotalBase - montoDescuento) + cargoExtra;
   if (totalNeto < 0) totalNeto = 0;

   // 8. Obtener Abono ingresado
   let abonoInput = parseFloat($('#abonoOrden').val()) || 0;

   // Si el abono excede el total neto (por ej. si aplicaron descuento posteriormente), ajustamos al máximo posible
   if (abonoInput > totalNeto) {
      abonoInput = totalNeto;
      $('#abonoOrden').val(totalNeto.toFixed(2));
   }

   // 9. Actualizar vista: Abono en el resumen
   if (abonoInput > 0) {
      $('#lblMontoAbonoResumen').text(`-$${abonoInput.toFixed(2)}`);
      $('#rowAbonoAplicado').removeClass('d-none');
   } else {
      $('#rowAbonoAplicado').addClass('d-none');
   }

   // 10. Cálculo de Saldo Pendiente
   let saldoPendiente = totalNeto - abonoInput;

   // 11. Renderizar Total Neto, Saldo e Hidden
   $('#lblTotalNetoOrden').text(`$${totalNeto.toFixed(2)}`);
   
   if (saldoPendiente <= 0 && totalNeto > 0 && abonoInput > 0) {
      $('#lblSaldoPendienteOrden').removeClass('text-danger').addClass('text-success').text('$0.00 (Liquidado)');
   } else {
      $('#lblSaldoPendienteOrden').removeClass('text-success').addClass('text-danger').text(`$${saldoPendiente.toFixed(2)}`);
   }

   $('#montoDescuentoOrden').val(montoDescuento);
}

const calcularTotalDinamico = (total, totalConDesc, totalSinDesc) => {
    
    let montoDescuento = 0;
    
    // 1. Usamos los parámetros que ya recibe la función (o fallback al DOM si no vienen)
    let baseAplicableDescuento = parseFloat(totalConDesc) || 0;
    let baseSinDescuento       = parseFloat(totalSinDesc) || 0;
    let subtotalGeneral        = parseFloat(total) || (baseAplicableDescuento + baseSinDescuento);

    // 2. Obtener datos del Descuento seleccionado
    let selectDescuento = $('#descuentoGeneralOrden option:selected');
    let idDescuento     = parseFloat(selectDescuento.val()) || 0;
    let porcentajeDesc  = selectDescuento.data('descuento') || 0;
    let nombreDescuento = selectDescuento.text().trim();

    // 3. Obtener datos del Cargo Extra
    let cargoExtra  = parseFloat($('#cargoExtraOrden').val()) || 0;
    let motivoCargo = $('#motivoCargoExtraOrden').val().trim();

    // 4. Cálculo de descuento ÚNICAMENTE sobre los productos/estudios permitidos (totalConDesc)
    if (porcentajeDesc > 0 && baseAplicableDescuento > 0) {
        montoDescuento = Math.round((baseAplicableDescuento * parseFloat(porcentajeDesc)) / 100);
    }

    // 5. Actualizar vista: Descuento
    if (montoDescuento > 0) {
        $('#lblTextoDescuento').html(`<i class="bi bi-tag-fill me-1"></i> Descuento ${nombreDescuento}:`);
        $('#lblMontoDescuento').text(`-$${montoDescuento.toFixed(2)}`);
        $('#rowDescuentoAplicado').removeClass('d-none');
    } else {
        $('#rowDescuentoAplicado').addClass('d-none');
    }

    // 6. Actualizar vista: Cargo Extra
    if (cargoExtra > 0) {
        let textoMotivo = motivoCargo !== '' ? ` (${motivoCargo})` : '';
        $('#lblTextoCargoExtra').html(`<i class="bi bi-plus-circle-fill me-1"></i> Cargo extra${textoMotivo}:`);
        $('#lblMontoCargoExtra').text(`+$${cargoExtra.toFixed(2)}`);
        $('#rowCargoExtraAplicado').removeClass('d-none');
    } else {
        $('#rowCargoExtraAplicado').addClass('d-none');
    }

    // 7. Cálculo del Total Neto Final (Subtotal General - Descuento + Cargo Extra)
    let totalNeto = (subtotalGeneral - montoDescuento) + cargoExtra;
    if (totalNeto < 0) totalNeto = 0;

    // 8. Obtener Abono ingresado
    let abonoInput = parseFloat($('#abonoOrden').val()) || 0;

    // Si el abono excede el total neto, ajustamos al máximo posible
    if (abonoInput > totalNeto) {
        abonoInput = totalNeto;
        $('#abonoOrden').val(totalNeto.toFixed(2));
    }

    // 9. Actualizar vista: Abono en el resumen
    if (abonoInput > 0) {
        $('#lblMontoAbonoResumen').text(`-$${abonoInput.toFixed(2)}`);
        $('#rowAbonoAplicado').removeClass('d-none');
    } else {
        $('#rowAbonoAplicado').addClass('d-none');
    }

    // 10. Cálculo de Saldo Pendiente
    let saldoPendiente = totalNeto - abonoInput;

    // 11. Renderizar Total Neto, Saldo e Hidden
    $('#lblTotalNetoOrden').text(`$${totalNeto.toFixed(2)}`);
    
    if (saldoPendiente <= 0 && totalNeto > 0 && abonoInput > 0) {
        $('#lblSaldoPendienteOrden').removeClass('text-danger').addClass('text-success').text('$0.00 (Liquidado)');
    } else {
        $('#lblSaldoPendienteOrden').removeClass('text-success').addClass('text-danger').text(`$${saldoPendiente.toFixed(2)}`);
    }

    $('#montoDescuentoOrden').val(montoDescuento);
}

const combo_descuentos_generales = async (containerId) => {

   if(comboDescuentos.length == 0) {
      comboDescuentos = '<option value="0" selected data-descuento="0">Selecciona un descuento</option>';
      let respuesta = await obtiene_descuentos();
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
            res.map((descuento) => {
               comboDescuentos +=`<option value="${descuento.id}" data-descuento="${descuento.porcentaje_desc}">${descuento.concepto_desc} (${descuento.porcentaje_desc} %)</option>`;
            });
            $('#'+containerId).html(comboDescuentos);
         }      
      }
   }
   else {
      $('#'+containerId).html(comboDescuentos);
   }   
}

const registra_orden = async () => {   

   // Se obtienen los datos generales de la orden
   let e = fnObtieneEdad(pacienteOrden.fecha_nacimiento);
   let edad;
   let idConvenio   = 0;
   let tipoConvenio = '';
   let nomConvenio  = '';
   let idPrecio     = 0;
   let nomPrecio    = 'Público en general';

   e.anios > 0 ? edad = e.anios + ' años' : e.meses > 0 ? edad = e.meses + ' mes(es)' : edad = e.dias;

   let idPaciente     = pacienteOrden.id;
   let nomPaciente    = pacienteOrden.nombre + ' ' + pacienteOrden.apellido_paterno + ' ' +  pacienteOrden.apellido_materno;
   let sexo           = pacienteOrden.sexo_biologico; 
   let tipoCliente    = $('input[name="optionTipoCliente"]:checked').val();
   

   if(tipoCliente == 'convenio') {
      let selectConvenio = document.getElementById("selectConvenioEmpresa");
      idConvenio         = selectConvenio.value;
      tipoConvenio       = $('option:selected', selectConvenio).attr('data-tipo');
      nomConvenio        = $('#selectConvenioEmpresa option:selected').text();
      idPrecio           = $('option:selected', selectConvenio).attr('data-lista-precio');
      nomPrecio          = $('option:selected', selectConvenio).attr('data-nom-precio');
   }

   // Se obtienen los datos generales del pago
   let selectDescuento       = document.getElementById("descuentoGeneralOrden");
   let idDescuento           = selectDescuento.value;
   let porDescuento          = $('option:selected', selectDescuento).attr('data-descuento');
   let cargoExtraOrden       = $('#cargoExtraOrden').val().trim();
   let motivoCargoExtraOrden = $('#motivoCargoExtraOrden').val().trim();
   let abonoOrden            = $('#abonoOrden').val().trim();
   let metodoPagoOrden       = $('#metodoPagoOrden').val();
   
   if(parseFloat(idPaciente) == 0 || nomPaciente == '' || sexo == '' || tipoCliente == '') {      
      ToastColor.fire({
         text: '¡Atención! Hubo parámetros que no pudieron cargarse, actualiza y vuelve a intentarlo',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }
   else if(tipoCliente == 'convenio' && idConvenio == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar a la empresa, laboratorio o doctor del convenio',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#selectConvenioEmpresa').focus();
      return;
   }
   else if(tipoCliente == 'convenio' && idConvenio == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar a la empresa, laboratorio o doctor del convenio',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#selectConvenioEmpresa').focus();
      return;
   }
   else if(arrEstudios.length == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes agregar al menos un estudio a la orden',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }
   else if(parseFloat(cargoExtraOrden) > 0 && motivoCargoExtraOrden == '') {      
      ToastColor.fire({
         text: '¡Atención! Si ingresas un cargo extra, deberás ingresar un motivo',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#motivoCargoExtraOrden').focus();
      return;
   }
   else if(parseInt(metodoPagoOrden) == 'NA') {      
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un método de pago',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#metodoPagoOrden').focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La orden será registrada', 'question', 'Sí, guardar', 'Cancelar');

   if (!res.result) {
      return;
   }

   let objOrden = { 'func': 'registrar_orden', idPaciente, nomPaciente, edad, sexo, tipoCliente, idConvenio, tipoConvenio, nomConvenio, idPrecio, nomPrecio, idDescuento, porDescuento, cargoExtraOrden, motivoCargoExtraOrden, abonoOrden, metodoPagoOrden };

   $('#btnRegistrarOrden').prop('disabled',true);
   
   let respuesta = await registrar_orden(objOrden);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      $('#modalRegistrarOrden').modal('hide');      
      $('#btnRegistrarOrden').prop('disabled',false);
      ModalOrdenRegistradaExito(respuesta.data[1], respuesta.data[2], respuesta.data[3]);
      TabRecepcion();
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnRegistrarOrden').prop('disabled',false);
      return;
   }
}

const ModalOrdenRegistradaExito = (folio, totalNeto, keyQuery) => {

   totalNeto = parseFloat(totalNeto) || 0;

   let html = `
   <div class="modal fade shadow-lg modal-superior-blur" id="modalOrdenRegistradaExito" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content sombra-modal border-0">
            <div class="modal-body p-4 text-center">
               
               <!-- ÍCONO DE ÉXITO -->
               <div class="mb-3">
                  <div class="rounded-circle bg-success-subtle mx-auto p-3" style="width: 70px; height: 70px;">
                     <i class="bi bi-check-circle-fill text-success fs-1"></i>
                  </div>
               </div>

               <h4 class="fw-bold text-dark mb-1">¡Orden Registrada con Éxito!</h4>
               <p class="text-muted small mb-4">La orden de trabajo ha sido generada correctamente en el sistema.</p>

               <!-- DATOS CLAVE DE LA ORDEN (USANDO GRID DE BS5) -->
               <div class="bg-light rounded-3 p-3 border mb-4 text-start">
                  
                  <!-- FILA 1: FOLIO Y ESTADO -->
                  <div class="row align-items-center mb-3 pb-2 border-bottom">
                     <div class="col-7">
                        <span class="text-muted fs-7 d-block text-uppercase fw-semibold">Folio de Orden</span>
                        <span class="fw-bold text-primary fs-5">${folio}</span>
                     </div>
                     <div class="col-5 text-end">
                        <span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">
                           <i class="bi bi-check2 me-1"></i> Confirmado
                        </span>
                     </div>
                  </div>

                  <!-- FILA 2: MONTO TOTAL -->
                  <div class="row align-items-center">
                     <div class="col-6">
                        <span class="text-muted fs-7 d-block text-uppercase fw-semibold">Monto Total</span>
                        <small class="text-muted fs-7">Total neto cobrado</small>
                     </div>
                     <div class="col-6 text-end">
                        <h3 class="fw-bold text-dark mb-0">$${totalNeto.toFixed(2)}</h3>
                     </div>
                  </div>

               </div>

               <!-- MENSAJE INFORMATIVO SECUNDARIO -->
               <div class="alert alert-info border-0 bg-info-subtle text-info-emphasis small py-2 mb-4">
                  <i class="bi bi-info-circle me-1"></i> Puedes imprimir el comprobante o pasar al siguiente registro.
               </div>

               <!-- ACCIONES PRINCIPALES (GRID BS5) -->
               <div class="row g-2">
                  <div class="col-md-6">
                     <a href="reportes/ticket?kq=${keyQuery}" target="_blank" class="btn btn-dark btn-lib btn-redondo w-100">
                        <i class="bi bi-printer me-1"></i> Imprimir
                     </a>
                  </div>
                  <div class="col-md-6">
                     <button type="button" class="btn btn-outline-secondary btn-redondo w-100" data-bs-dismiss="modal">
                        <i class="bi bi-plus-lg me-1"></i> Nueva orden
                     </button>
                  </div>
               </div>

            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminExt').html(html);
   $('#modalOrdenRegistradaExito').modal('show');
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ BÚSQUEDA AVANZADA DE ORDENES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalBuscarOrdenes = () => {
   let html = `
   <div class="modal fade modal-superior-blur" id="ModalBuscarOrdenes" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content sombra-modal border-0">
            
            <!-- Encabezado sutil -->
            <div class="modal-header border-0 pb-0">
               <h5 class="modal-title d-flex align-items-center gap-2">
                  <i class="bi bi-search text-primary-emphasis fs-4"></i>
                  <span>Búsqueda de Órdenes</span>
               </h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body py-3">
               
               <!-- Contenedor de Filtros -->
               <div class="card border-0 bg-light rounded-3 p-3 mb-3 shadow-sm">
                  <div class="row g-2 align-items-end">
                     
                     <!-- Criterio principal -->
                     <div class="col-12 col-md-4">
                        <label class="form-label small fw-semibold text-muted mb-1">Buscar por</label>
                        <select class="form-select form-select-sm" id="filtro_criterio" onchange="cambiarTipoFiltro(this.value)">
                           <option value="folio">Folio de Orden</option>
                           <option value="paciente" selected>Paciente / Nombre</option>
                           <option value="fecha">Día específico</option>
                           <option value="mes">Mes completo</option>
                           <option value="convenio">Convenio / Empresa</option>
                        </select>
                     </div>

                     <!-- Campo dinámico de entrada (Input de texto / Fecha / Mes) -->
                     <div class="col-12 col-md-5" id="col_campo_busqueda">
                        <label class="form-label small fw-semibold text-muted mb-1" id="label_busqueda">Nombre del Paciente</label>
                        <div class="input-group input-group-sm">
                           <span class="input-group-text bg-white"><i class="bi bi-person text-muted"></i></span>
                           <input type="text" class="form-control" id="inputParametroBusqueda" placeholder="Escribe para buscar..." autocomplete="off">
                        </div>
                     </div>

                     <!-- Estatus (Opcional para acotar) -->
                     <div class="col-6 col-md-3">
                        <label class="form-label small fw-semibold text-muted mb-1">Estatus</label>
                        <select class="form-select form-select-sm" id="filtro_estatus">
                           <option value="TODOS">Todos</option>
                           <option value="RECEPCION">Recepción</option>
                           <option value="LABORATORIO">Laboratorio</option>
                           <option value="COMPLETADA">Completada</option>
                           <option value="ENTREGADA">Entregada</option>
                           <option value="CANCELADA">Cancelada</option>
                        </select>
                     </div>

                  </div>

                  <!-- Botón de acción -->
                  <div class="row mt-3">
                     <div class="col-12 text-end">
                        <button type="button" class="btn btn-outline-secondary btn-sm btn-redondo px-3 me-1" onclick="limpiar_busqueda_avanzada()">
                           <i class="bi bi-eraser me-1"></i> Limpiar
                        </button>
                        <button type="button" class="btn btn-dark btn-lib btn-sm btn-redondo px-4" onclick="busqueda_avanzada_ordenes('contenedor_resultados_busqueda')">
                           <i class="bi bi-search me-1"></i> Buscar
                        </button>
                     </div>
                  </div>
               </div>

               <!-- Area de Resultados -->
               <div id="contenedor_resultados_busqueda">
                  <div class="text-center py-4 text-muted">
                     <i class="bi bi-receipt-cutoff fs-2 d-block mb-2 text-secondary"></i>
                     <span class="small">Ingresa un criterio de búsqueda para mostrar los resultados.</span>
                  </div>
               </div>

            </div>

            <div class="modal-footer border-0 pt-0">
               <button type="button" class="btn btn-outline-dark btn-redondo btn-sm px-3" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#ModalBuscarOrdenes').modal('show');
};

const cambiarTipoFiltro = (tipo) => {
   const col = $('#col_campo_busqueda');
   let label = 'Parámetro';
   let inputHtml = '';

   switch (tipo) {
      case 'folio':
         label = 'Número de Folio';
         inputHtml = `
            <div class="input-group input-group-sm">
               <span class="input-group-text bg-white"><i class="bi bi-hash text-muted"></i></span>
               <input type="text" class="form-control" id="inputParametroBusqueda" placeholder="Ej. O-26-1-23" autocomplete="off">
            </div>`;
         break;

      case 'paciente':
         label = 'Nombre del Paciente';
         inputHtml = `
            <div class="input-group input-group-sm">
               <span class="input-group-text bg-white"><i class="bi bi-person text-muted"></i></span>
               <input type="text" class="form-control" id="inputParametroBusqueda" placeholder="Escribe el nombre..." autocomplete="off">
            </div>`;
         break;

      case 'fecha':
         label = 'Selecciona el Día';
         inputHtml = `
            <div class="input-group input-group-sm">
               <span class="input-group-text bg-white"><i class="bi bi-calendar-event text-muted"></i></span>
               <input type="date" class="form-control" id="inputParametroBusqueda">
            </div>`;
         break;

      case 'mes':
         label = 'Selecciona el Mes';
         inputHtml = `
            <div class="input-group input-group-sm">
               <span class="input-group-text bg-white"><i class="bi bi-calendar3 text-muted"></i></span>
               <select name="inputParametroBusqueda" id="inputParametroBusqueda" class="form-select form-select-sm">
                  <option value="00">Selecciona un mes</option>
                  ${comboMeses}
               </select>
            </div>`;
         break;

      case 'convenio':
         label = 'Nombre del Convenio';
         inputHtml = `
            <div class="input-group input-group-sm">
               <span class="input-group-text bg-white"><i class="bi bi-building text-muted"></i></span>
               <select name="inputParametroBusqueda" id="inputParametroBusqueda" class="form-select form-select-sm">
                  <option value="00">Selecciona un mes</option>
                  ${comboConvenios}
               </select>
            </div>`;

            combo_listas_convenios('inputParametroBusqueda');
         break;
   }

   col.html(`<label class="form-label small fw-semibold text-muted mb-1">${label}</label>${inputHtml}`);
};

const busqueda_avanzada_ordenes = async (containerId) => {

   let filtroCriterio    = $('#filtro_criterio').val();
   let parametroBusqueda = $('#inputParametroBusqueda').val();
   let filtroEstatus     = $('#filtro_estatus').val();

   if(filtroCriterio == 'folio' || filtroCriterio == 'fecha' || filtroCriterio == 'paciente') {
      if(parametroBusqueda.length < 3) {
         ToastColor.fire({
            text: '¡Atención! Debes ingresar el valor de búsqueda, mayor a 3 caracteres',
            icon: 'warning'
         });
         $('#inputParametroBusqueda').focus();
         return;
      }
   }
   else if(filtroCriterio == 'mes' || filtroCriterio == 'convenio') {
      if(parseInt(parametroBusqueda) == 0) {
         ToastColor.fire({
            text: '¡Atención! Debes seleccionar el valor de búsqueda',
            icon: 'warning'
         });
         $('#inputParametroBusqueda').focus();
         return;
      }
   }
   else {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un parámetro de búsqueda',
         icon: 'warning'
      });
      $('#filtro_criterio').focus();
   }

   $('#'+containerId).html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');
   
   let respuesta = await buscar_ordenes_avanzado(filtroCriterio, parametroBusqueda, filtroEstatus);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#'+containerId).html(`
         <div class="text-center py-4 text-muted">
            <i class="bi bi-receipt-cutoff fs-2 d-block mb-2 text-secondary"></i>
            <span class="small">Ingresa un criterio de búsqueda para mostrar los resultados.</span>
         </div>`);
      return;
   }
   else if(respuesta.data.length == 0) {
      $('#' + containerId).html(`
         <div class="card border-0 shadow-sm mb-2 text-center">
            <div class="card-body p-4">
               <div class="row align-items-center">
                  <div class="col-12">
                     <i class="bi bi-inbox text-muted display-6 d-block mb-2"></i>
                     <h6 class="card-title text-dark fw-bold mb-1">Sin órdenes registradas</h6>
                     <span class="text-muted small">No se encontraron órdenes registradas con el parámetro de búsqueda enviado.</span>
                  </div>
               </div>
            </div>
         </div>
      `);
      return;
   }
   else {
      let res = respuesta.data;
      arrOrdenesBusAvanzada = res;
      pinta_ordenes_busqueda_avanzada(arrOrdenesBusAvanzada, containerId);
   }
}

const getBadgeEstatus = (estatus) => {
   let bgClass = 'bg-secondary';
   switch ((estatus || '').toUpperCase()) {
      case 'RECEPCION': bgClass = 'bg-secondary text-white'; break;
      case 'LABORATORIO': bgClass = 'bg-warning text-dark'; break;
      case 'COMPLETADA': bgClass = 'bg-success'; break;
      case 'ENTREGADA': bgClass = 'bg-primary'; break;
      case 'CANCELADA': bgClass = 'bg-danger'; break;
   }
   return `<span class="badge ${bgClass} bg-opacity-75 rounded-pill px-2 py-1 fw-normal small">${estatus || 'N/A'}</span>`;
};

const getCeldaPago = (estatusPago, totalNeto, totalAbonado, saldoDeudor) => {
   
   const estatusUpper = (estatusPago || 'PENDIENTE').toUpperCase();

   // 1. Caso PAGADO
   if (estatusUpper === 'PAGADO') {
      return `
         <span class="d-block text-success fw-bold small">
            <i class="bi bi-check-circle-fill me-1"></i>${fmtMoney(totalNeto)}
         </span>
         <span class="extra-small text-muted small">Saldado</span>`;
   }

   // 2. Caso PARCIAL
   if (estatusUpper === 'PARCIAL') {
      return `
         <span class="d-block text-danger fw-bold small">
            Resta ${fmtMoney(saldoDeudor)}
         </span>
         <span class="extra-small text-secondary small">
            <i class="bi bi-wallet2 me-1 opacity-50"></i>Abono: ${fmtMoney(totalAbonado)}
         </span>`;
   }

   // 3. Caso PENDIENTE
   return `
      <span class="d-block text-danger fw-bold small">
         Debe ${fmtMoney(totalNeto)}
      </span>
      <span class="extra-small text-muted small">
         <i class="bi bi-exclamation-circle me-1 opacity-50"></i>Sin abono
      </span>`;
};

const pinta_ordenes_busqueda_avanzada = (data, containerId) => {

   let html = 
   `<div class="table-responsive rounded-3 border shadow-sm">
      <table class="table table-hover align-middle mb-0 dataTable table-striped" id="tableBusquedaAvanzada">
         <thead class="table-dark text-uppercase small">
            <tr>
               <th width="15%" class="text-center py-2">Orden</th>
               <th width="35%" class="py-2">Paciente / Convenio</th>
               <th width="15%" class="text-center py-2">Registro</th>
               <th width="20%" class="text-center py-2">Estado Pago</th>
               <th width="15%" class="text-center py-2">Acciones</th>
            </tr>
         </thead>
         <tbody>`;
         
         data.forEach(row => {
            html +=
            `<tr id="trBusqueda${row.folio}">
               <!-- 1. FOLIO Y ESTATUS DE ORDEN -->
               <td class="text-center">
                  <span class="font-monospace fw-bold text-primary-emphasis d-block mb-1">
                     #${row.folio}
                  </span>
                  ${getBadgeEstatus(row.estatus)}
               </td>

               <td>
                  <div class="fw-bold text-dark text-truncate" style="max-width: 280px;" title="${row.paciente_nombre_historico || ''}">
                     ${row.paciente_nombre_historico || 'Sin nombre'}
                  </div>
                  <div class="extra-small text-muted lh-sm mt-1">
                     <span class="fw-semibold text-secondary text-uppercase">${row.tipo_cliente ?? 'PARTICULAR'}</span>
                     ${row.convenio_nombre_historico ? ` <span class="opacity-50">|</span> ${row.convenio_nombre_historico}` : ''}
                  </div>
               </td>

               <td class="text-center small text-muted">
                  <span class="d-block"><i class="bi bi-calendar3 me-1 opacity-50"></i>${row.fecha_registro ?? ''}</span>
                  ${row.hora_registro ? `<span class="extra-small text-secondary"><i class="bi bi-clock me-1 opacity-50"></i>${row.hora_registro}</span>` : ''}
               </td>

               <td class="text-center">
                  ${getCeldaPago(row.estatus_pago, row.total_neto, row.total_abonado, row.saldo_deudor)}
               </td>

               <td class="text-center">
                  <a href="reportes/ticket?kq=${row.key_query}" target="_blank" class="btn btn-outline-dark btn-redondo btn-sm px-2" title="Imprimir ticket">
                     <i class="bi bi-ticket-detailed"></i>
                  </a>
                  <button type="button" class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Ver abonos / pagos" onclick="ModalAbonosPagos('${row.folio}')">
                     <i class="bi bi-currency-dollar"></i>
                  </button>
               </td>
            </tr>`;
         });
         
         html +=
         `</tbody>
      </table>
   </div>`;
   
   $('#' + containerId).html(html);

   setTimeout(() => {
      new DataTable('#tableBusquedaAvanzada', {   
         language: {
            url: "assets/lib/DataTables/es-ES.json",
         },
         responsive: true,
         order: [[0, 'desc']]
      });
   }, 200);
}

const limpiar_busqueda_avanzada = () => {
   $('#filtro_criterio').val('paciente');
   $('#filtro_criterio').change();
   $('#filtro_estatus').val('TODOS');
   $('#contenedor_resultados_busqueda').html(`
      <div class="text-center py-4 text-muted">
         <i class="bi bi-receipt-cutoff fs-2 d-block mb-2 text-secondary"></i>
         <span class="small">Ingresa un criterio de búsqueda para mostrar los resultados.</span>
      </div>`);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabRecepcion                    = TabRecepcion;
window.ModalPacientesEncontrados       = ModalPacientesEncontrados;
window.ModalRegistrarOrden             = ModalRegistrarOrden;
window.ModalOrdenRegistradaExito       = ModalOrdenRegistradaExito;
window.ModalBuscarOrdenes              = ModalBuscarOrdenes;

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

window.combo_descuentos_generales      = combo_descuentos_generales;
window.registra_orden                  = registra_orden;
window.calcularTotalDinamico           = calcularTotalDinamico;
window.buscar_ordenes_hoy              = buscar_ordenes_hoy;

window.cambiarTipoFiltro               = cambiarTipoFiltro;
window.busqueda_avanzada_ordenes       = busqueda_avanzada_ordenes;
window.limpiar_busqueda_avanzada       = limpiar_busqueda_avanzada;
