import { obtiene_estudios, guardar_estudio, eliminar_estudio } from "./EstudiosServices.js";

let arrEstudios     = [];
let arrTubosEstudio = [];

const TabEstudios = async () => {
   const res = await valida_menu('estudios');

   if (!res || res.estatus != 200) {
      ModalAccesoDenegado('Paquetes y estudios');
      $('#containerMain').html(`<div class="alert alert-danger mt-3 p-2 text-center">No tienes permisos para ver este módulo.</div>`);
      return;
   }

   let html = `
   <div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2 fw-bold">
         <div class="fs-4"><i class="bi bi-list-columns me-2"></i>Paquetes / Estudios</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevoEstudio" onclick="ModalFormEstudio(0);">
            <i class="bi bi-plus-lg"></i> Nuevo Estudio
         </button>
      </div>
   </div>
   <div class="mt-4">
      <div id="listar_estudios"></div>      
   </div>`;

   $('#containerMain').html(html);
   listar_estudios('listar_estudios');
};

const ModalFormEstudio = (idEstudio = 0) => {
   let idNum = parseInt(idEstudio) || 0;
   let estudioSeleccionado = arrEstudios.find(e => e.id == idNum);

   let titulo;
   let nombre              = '';
   let tipo                = 'NA';
   let precio_publico      = '';
   let costo               = '';
   let indicaciones_toma   = '';
   let descripcion_estudio = '';
   let aplicaDescuento     = 'NO';
   arrTubosEstudio         = [];

   if (idNum > 0 && estudioSeleccionado) {
      titulo              = 'Editar Estudio: ' + (estudioSeleccionado.nombre || '');
      nombre              = estudioSeleccionado.nombre || '';
      tipo                = estudioSeleccionado.tipo || 'NA';
      precio_publico      = estudioSeleccionado.precio_publico || '';
      costo               = estudioSeleccionado.costo || '';
      indicaciones_toma   = estudioSeleccionado.indicaciones_toma || '';
      descripcion_estudio = estudioSeleccionado.descripcion_estudio || '';
      aplicaDescuento     = estudioSeleccionado.aplica_desc || 'NO';

      try {
         arrTubosEstudio  = estudioSeleccionado.tubos_json ? JSON.parse(estudioSeleccionado.tubos_json) : [];
      } catch (e) {
         arrTubosEstudio  = [];
      }
   }
   else {
      titulo = 'Registrar Nuevo Estudio';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormEstudio" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${escapeHTML(titulo)}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="col-12 mt-3">
                     <label class="form-label fw-bold mb-1" for="nomEstudio">Nombre del estudio / paquete *</label>
                     <input type="text" name="nomEstudio" id="nomEstudio" class="form-control" maxlength="150" value="${escapeHTML(nombre)}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <label class="form-label fw-bold mb-1" for="descripcionEstudio">Descripción estudio / paquete</label>
                     <textarea name="descripcionEstudio" id="descripcionEstudio" class="form-control" rows="3" maxlength="250">${escapeHTML(descripcion_estudio)}</textarea>
                  </div>
                  <div class="col-6 col-sm-4 mt-3">
                     <label class="form-label fw-bold mb-1" for="tipoEstudio">Tipo *</label>
                     <select name="tipoEstudio" id="tipoEstudio" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="ESTUDIO">ESTUDIO</option>
                        <option value="PAQUETE">PAQUETE</option>
                     </select>
                  </div>
                  <div class="col-6 col-sm-4 mt-3">
                     <label class="form-label fw-bold mb-1" for="precioPublico">Precio Público *</label>
                     <input type="number" inputmode="decimal" step="0.01" name="precioPublico" id="precioPublico" class="form-control" maxlength="10" value="${escapeHTML(precio_publico.toString())}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-6 col-sm-4 mt-3">
                     <label class="form-label fw-bold mb-1" for="costoEstudio">Costo *</label>
                     <input type="number" inputmode="decimal" step="0.01" name="costoEstudio" id="costoEstudio" class="form-control" maxlength="10" value="${escapeHTML(costo.toString())}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-6 col-sm-4 mt-3">
                     <label class="form-label fw-bold mb-1" for="estudioAplicaDesc">¿Aplica descuento?</label>
                     <select name="estudioAplicaDesc" id="estudioAplicaDesc" class="form-select">
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                     </select>
                  </div>

                  <!-- SECCIÓN CONFIGURACIÓN DE ETIQUETAS Y TUBOS -->
                  <div class="col-12 mt-3">
                     <div class="card border-light-subtle shadow-sm">
                        <div class="card-header bg-light fs-6 fw-bold">
                           <i class="bi bi-tags me-1"></i> Configuración de Etiquetas para Muestras
                        </div>
                        <div class="card-body">
                           <div class="row align-items-end">
                              <div class="col-12 col-sm-4">
                                 <label class="form-label fw-bold mb-1" for="selectTuboMuestra">Contenedor / Tubo</label>
                                 <select id="selectTuboMuestra" class="form-select">
                                    <option value="">Seleccionar...</option>
                                    <option value="Tubo Morado (EDTA)">Tubo Morado (EDTA)</option>
                                    <option value="Tubo Rojo (Seco)">Tubo Rojo (Seco)</option>
                                    <option value="Tubo Amarillo (Gel)">Tubo Amarillo (Gel)</option>
                                    <option value="Tubo Azul (Citrato)">Tubo Azul (Citrato)</option>
                                    <option value="Frasco Estéril">Frasco Estéril (Orina)</option>
                                    <option value="Frasco Copro">Frasco Copro (Heces)</option>
                                    <option value="Hisopo / Medio Transporte">Hisopo / Medio Transporte</option>
                                 </select>
                              </div>
                              <div class="col-12 col-sm-4 mt-2 mt-sm-0">
                                 <label class="form-label fw-bold mb-1" for="txtTipoMuestra">Tipo de Muestra</label>
                                 <input type="text" id="txtTipoMuestra" class="form-control" placeholder="Ej. Sangre Total, Suero, Orina" maxlength="100"/>
                              </div>
                              <div class="col-8 col-sm-2 mt-2 mt-sm-0">
                                 <label class="form-label fw-bold mb-1" for="numCantTubo">Cantidad</label>
                                 <input type="number" id="numCantTubo" class="form-control" value="1" min="1" max="10" onkeypress="return fnValidaNumeros(event);"/>
                              </div>
                              <div class="col-4 col-sm-2 mt-2 mt-sm-0 text-end">
                                 <button type="button" class="btn btn-primary w-100 btn-redondo" onclick="fn_agregar_tubo_lista();">
                                    <i class="bi bi-plus-lg"></i>
                                 </button>
                              </div>
                           </div>

                           <!-- LISTA DINÁMICA DE TUBOS AGREGADOS -->
                           <div class="row mt-3">
                              <div class="col-12">
                                 <div id="contenedorTubosAgregados" class="d-flex flex-wrap gap-2 p-2 border rounded bg-white" style="min-height: 48px;">
                                    <span class="text-muted small fst-italic id-sin-tubos">No se han agregado etiquetas a este estudio.</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <input type="hidden" name="tubosJson" id="tubosJson" value="[]" />

                  <div class="col-12 mt-3">
                     <label class="form-label fw-bold mb-1" for="indicacionesToma">Indicaciones toma de muestra</label>
                     <textarea name="indicacionesToma" id="indicacionesToma" class="form-control" rows="3" maxlength="400">${escapeHTML(indicaciones_toma)}</textarea>
                  </div>
               </div>
               
            </div>
            <div class="modal-footer border-0 text-end">
               <button type="button" class="btn btn-secondary btn-lib btn-redondo" id="btnGuardarEstudio" onclick="fn_guardar_estudio(${idNum});">
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
   $('#modalFormEstudio').modal('show');
   setTimeout(() => {
      $('#tipoEstudio').val(tipo);
      $('#estudioAplicaDesc').val(aplicaDescuento);
      fn_renderizar_tubos();
   }, 200);
};

const fn_agregar_tubo_lista = () => {
   let tubo    = $('#selectTuboMuestra').val();
   let muestra = $('#txtTipoMuestra').val().trim();
   let cant    = parseInt($('#numCantTubo').val()) || 1;

   if (!tubo) {
      ToastColor.fire({ text: '¡Atención! Seleccione un contenedor/tubo.', icon: 'warning' });
      $('#selectTuboMuestra').focus();
      return;
   }
   if (!muestra) {
      ToastColor.fire({ text: '¡Atención! Ingrese el tipo de muestra (ej. Sangre Total, Suero, Orina).', icon: 'warning' });
      $('#txtTipoMuestra').focus();
      return;
   }
   if (cant <= 0) {
      ToastColor.fire({ text: '¡Atención! La cantidad debe ser mayor a 0.', icon: 'warning' });
      $('#numCantTubo').focus();
      return;
   }

   arrTubosEstudio.push({
      contenedor: tubo,
      muestra: muestra,
      cantidad: cant
   });

   $('#selectTuboMuestra').val('');
   $('#txtTipoMuestra').val('');
   $('#numCantTubo').val(1);

   fn_renderizar_tubos();
};

const fn_renderizar_tubos = () => {
   let html = '';

   if (arrTubosEstudio.length === 0) {
      html = '<span class="text-muted small fst-italic">No se han agregado etiquetas a este estudio.</span>';
   } else {
      arrTubosEstudio.forEach((item, index) => {
         html += `
         <span class="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
            <i class="bi bi-vial-fill text-primary"></i> 
            <b>${parseInt(item.cantidad) || 1}x</b> ${escapeHTML(item.contenedor || '')} — <span class="text-secondary">${escapeHTML(item.muestra || '')}</span>
            <button type="button" class="btn-close btn-close-xs ms-1" onclick="fn_eliminar_tubo_lista(${index});" aria-label="Eliminar"></button>
         </span>`;
      });
   }

   $('#contenedorTubosAgregados').html(html);
   $('#tubosJson').val(JSON.stringify(arrTubosEstudio));
};

const fn_eliminar_tubo_lista = (index) => {
   arrTubosEstudio.splice(index, 1);
   fn_renderizar_tubos();
};

const listar_estudios = async (containerId) => {
   arrTubosEstudio = [];
   activarLoad('Cargando estudios...');
   let respuesta = await obtiene_estudios();
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      closeLoad();
      return;
   }
   else {
      arrEstudios = respuesta.data || [];
      pinta_listado_estudios(containerId, arrEstudios);
   }
};

const pinta_listado_estudios = (containerId, data) => {
   if (!data || data.length === 0) {
      $('#' + containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron estudios registrados</div>');
      closeLoad();
      return;
   }
   
   let html = 
   `<table class="table table-striped table-bordered dataTable" id="tableEstudios">
      <thead>
         <tr>
            <th width="5%">ID</th>
            <th width="45%">Estudio</th>
            <th width="10%">Tipo</th>
            <th width="10%">Costo</th>
            <th width="10%">Precio Público</th>
            <th width="10%">Aplica Descuento</th>
            <th width="10%">Acciones</th>
         </tr>
      </thead>
      <tbody>`;
      
   data.forEach((row) => {
      html += `
      <tr id="trEstudios${row.id}">
         <td class="text-center">${row.id}</td>
         <td>${escapeHTML(row.nombre || '')}</td>
         <td class="text-center">${escapeHTML(row.tipo || '')}</td>
         <td>$ ${parseFloat(row.costo || 0).toFixed(2)}</td>
         <td>$ ${parseFloat(row.precio_publico || 0).toFixed(2)}</td>
         <td class="text-center">${escapeHTML(row.aplica_desc || 'NO')}</td>
         <td class="text-center">
            <!-- Llamadas puramente numéricas -->
            <button type="button" class="btn btn-outline-secondary btn-redondo btn-sm px-2" onclick="ModalFormEstudio(${row.id});" title="Editar estudio">
               <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarEstudio" onclick="fn_eliminar_estudio(${row.id});" title="Eliminar estudio">
               <i class="bi bi-trash"></i>
            </button>
         </td>
      </tr>`;
   });

   html += `
      </tbody>
   </table>`;
   
   $('#' + containerId).html(html);

   setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#tableEstudios')) {
         $('#tableEstudios').DataTable().destroy();
      }

      new DataTable('#tableEstudios', {   
         language: {
            url: "assets/lib/DataTables/es-ES.json",
         },
         responsive: true
      });
   }, 200);

   closeLoad();
};

const fn_guardar_estudio = async (idEstudio = 0) => {
   let idNum              = parseInt(idEstudio) || 0;
   let nomEstudio         = $('#nomEstudio').val().trim();
   let tipoEstudio        = $('#tipoEstudio').val();
   let precioPublico      = $('#precioPublico').val().trim();
   let costo              = $('#costoEstudio').val().trim();
   let descripcionEstudio = $('#descripcionEstudio').val().trim();
   let indicacionesToma   = $('#indicacionesToma').val().trim();
   let estudioAplicaDesc  = $('#estudioAplicaDesc').val();
   let msjAccion          = '';

   if (nomEstudio === '') {
      ToastColor.fire({ text: '¡Atención! Debes ingresar el nombre del estudio', icon: 'warning' });
      $('#nomEstudio').focus();
      return;
   }
   else if (tipoEstudio === 'NA') {
      ToastColor.fire({ text: '¡Atención! Debes seleccionar el tipo de estudio', icon: 'warning' });
      $('#tipoEstudio').focus();
      return;
   }
   else if (precioPublico === '' || parseFloat(precioPublico) <= 0) {
      ToastColor.fire({ text: '¡Atención! Debes ingresar el precio público y debe ser mayor a 0', icon: 'warning' });
      $('#precioPublico').focus();
      return;
   }

   costo = costo === '' ? 0 : parseFloat(costo);

   const objEstudio = { 
      func: 'guardar_estudio', 
      idEstudio: idNum, 
      nomEstudio, 
      tipoEstudio, 
      precioPublico, 
      costo, 
      descripcionEstudio, 
      indicacionesToma, 
      estudioAplicaDesc, 
      arrTubosEstudio,
      csrf: CSRF_TOKEN 
   };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información del estudio ' + escapeHTML(nomEstudio) + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarEstudio').prop('disabled', false);
      return;
   }

   $('#btnGuardarEstudio').prop('disabled', true);
   let respuesta = await guardar_estudio(objEstudio);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      msjAccion = idNum > 0 ? 'Información actualizada correctamente' : 'Estudio guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormEstudio').modal('hide');
      $('#btnGuardarEstudio').prop('disabled', false);
      listar_estudios('listar_estudios');
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGuardarEstudio').prop('disabled', false);
      return;
   }
};

const fn_eliminar_estudio = async (idEstudio) => {
   let idNum = parseInt(idEstudio) || 0;
   let estudioSeleccionado = arrEstudios.find(e => e.id == idNum);
   if (!estudioSeleccionado) return;

   let nomEstudio = estudioSeleccionado.nombre || '';

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El estudio: ' + escapeHTML(nomEstudio) + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarEstudio').prop('disabled', false);
      return;
   }

   $('.btnEliminarEstudio').prop('disabled', true);
   let respuesta = await eliminar_estudio(idNum, nomEstudio, CSRF_TOKEN );
   
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Estudio eliminado correctamente', '', 'success', 2500);
      
      if ($.fn.DataTable.isDataTable('#tableEstudios')) {
         let tabla = $('#tableEstudios').DataTable();
         tabla.row($('#trEstudios' + idNum)).remove().draw();
      } else {
         $('#trEstudios' + idNum).remove();
      }

      arrEstudios = arrEstudios.filter(e => e.id != idNum);
      $('.btnEliminarEstudio').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarEstudio').prop('disabled', false);
      return;
   }
};

// Interfaces
window.TabEstudios            = TabEstudios;
window.ModalFormEstudio       = ModalFormEstudio;

// Funciones
window.fn_eliminar_estudio    = fn_eliminar_estudio;
window.fn_guardar_estudio     = fn_guardar_estudio;
window.fn_eliminar_tubo_lista = fn_eliminar_tubo_lista;
window.fn_agregar_tubo_lista  = fn_agregar_tubo_lista;