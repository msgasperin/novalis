import { 
   obtiene_lista_precios, 
   guardar_lista_precio, 
   eliminar_lista_precios, 
   obtiene_precios_lista, 
   actualizar_precio_especifico, 
   eliminar_precio_especifico, 
   agregar_estudio_lista, 
   actualizacion_masiva_precios, 
   generar_lista_precios_base, 
   vaciar_lista_precios, 
   marcar_precio_defecto 
} from "./PreciosServices.js";
import { obtiene_estudios } from "../Estudios/EstudiosServices.js"; 

let arrListaPrecios = [];
let arrPreciosLista = [];
let comboEstudios   = '';

const TabPrecios = async () => {
   const res = await valida_menu('precios');

   if (!res || res.estatus != 200) {
      ModalAccesoDenegado('Precios');
      $('#containerMain').html(`<div class="alert alert-danger mt-3 p-2 text-center">No tienes permisos para ver este módulo.</div>`);
      return;
   }

   activarLoad('Cargando listas de precios...');
   let html = `
   <div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2 fw-bold">
         <div class="fs-4"><i class="bi bi-coin me-2"></i>Listas de Precios</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevaListaPrecios" onclick="ModalFormListaPrecios(0);">
            <i class="bi bi-plus-lg"></i> Nueva lista
         </button>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_litas_precios"></div>
   </div>`;

   $('#containerMain').html(html);
   listar_listas_precios();
};

const ModalFormListaPrecios = (idListaPrecios = 0) => {
   let idNum = parseInt(idListaPrecios) || 0;
   let listaSeleccionada = arrListaPrecios.find(l => l.id == idNum);

   let titulo          = idNum === 0 ? 'Nueva lista de precios' : 'Edición de lista de precios: ' + (listaSeleccionada?.nombre || '');
   let nomListaPrecios = listaSeleccionada ? listaSeleccionada.nombre || '' : '';
   let descListaPrecios= listaSeleccionada ? listaSeleccionada.descripcion || '' : '';

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormListaPrecios" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${escapeHTML(titulo)}</h1>
               <button type="button" class="btn btn-outline-dark btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row mb-3">
                  <div class="col-12">
                     <label class="form-label fw-bold mb-1" for="nomListaPrecios">Nombre de la lista de precios *</label>
                     <input type="text" name="nomListaPrecios" id="nomListaPrecios" class="form-control" maxlength="100" value="${escapeHTML(nomListaPrecios)}">
                  </div>
                  <div class="col-12 mt-3">
                     <label class="form-label fw-bold mb-1" for="descListaPrecios">Descripción de la lista de precios</label>
                     <textarea name="descListaPrecios" id="descListaPrecios" class="form-control" maxlength="400" rows="3">${escapeHTML(descListaPrecios)}</textarea>
                  </div>
               </div>                  
            </div>
            <div class="modal-footer border-0 text-end">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" id="btnGuardarListaPrecios" onclick="fn_guardar_lista_precios(${idNum});">
                  Guardar
               </button>
               <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cancelar
              </button>
            </div>
         </div>
      </div>
  </div>`;

  $('#modalAdmin').html(html);
  $('#modalFormListaPrecios').modal('show');
};

const fn_guardar_lista_precios = async (idListaPrecios = 0) => {
   let idNum           = parseInt(idListaPrecios) || 0;
   let nomListaPrecios = $('#nomListaPrecios').val().trim();
   let descripcion     = $('#descListaPrecios').val().trim();
   let func            = idNum === 0 ? 'guardar_lista_precios' : 'actualizar_generales_lista_precios';

   if (nomListaPrecios === '') {
      ToastColor.fire({ text: '¡Atención! Debes ingresar el nombre de la lista de precios', icon: 'warning' });
      $('#nomListaPrecios').focus();
      return;
   }

   let objListaPrecios = { func, idListaPrecios: idNum, nomListaPrecios, descripcion, csrf: CSRF_TOKEN };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información de lista de precios: ' + escapeHTML(nomListaPrecios) + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarListaPrecios').prop('disabled', false);
      return;
   }

   $('#btnGuardarListaPrecios').prop('disabled', true);

   let respuesta = await guardar_lista_precio(objListaPrecios);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Lista de precios guardada correctamente', '', 'success', 2500);
      $('#modalFormListaPrecios').modal('hide');
      listar_listas_precios();
      $('#btnGuardarListaPrecios').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarListaPrecios').prop('disabled', false);
      return;
   }
};

const fn_eliminar_lista_precios = async (idListaPrecios) => {
   let idNum = parseInt(idListaPrecios) || 0;
   let listaSeleccionada = arrListaPrecios.find(l => l.id == idNum);
   if (!listaSeleccionada) return;

   let nomListaPrecios = listaSeleccionada.nombre || '';

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La lista de precios: ' + escapeHTML(nomListaPrecios) + ' será eliminada', 'question', 'Sí, eliminar', 'Cancelar');
   if (!res.result) {
      $('.btnEliminarListaPrecios').prop('disabled', false);
      return;
   }

   $('.btnEliminarListaPrecios').prop('disabled', true);
   let respuesta = await eliminar_lista_precios(idNum, nomListaPrecios, CSRF_TOKEN);
   
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Lista de precios eliminada correctamente', '', 'success', 2500);
      $('#cardListaPrecios' + idNum).remove();
      arrListaPrecios = arrListaPrecios.filter(lista => lista.id != idNum);
      $('.btnEliminarListaPrecios').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnEliminarListaPrecios').prop('disabled', false);
      return;
   }
};

const fn_marcar_precio_defecto = async (idListaPrecios) => {
   let idNum = parseInt(idListaPrecios) || 0;
   let listaSeleccionada = arrListaPrecios.find(l => l.id == idNum);
   if (!listaSeleccionada) return;

   let nomListaPrecios = listaSeleccionada.nombre || '';

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La lista de precios: ' + escapeHTML(nomListaPrecios) + ' será marcada como por defecto', 'question', 'Sí, marcar', 'Cancelar');
   if (!res.result) {
      return;
   }

   let respuesta = await marcar_precio_defecto(idNum, nomListaPrecios, CSRF_TOKEN);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('¡Precio marcado por defecto!', '', 'success', 2500);
      $('.checkDefecto').prop('checked', false);$('#esDefecto' + idNum).prop('checked', true);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');      
      return;
   }
};

const listar_listas_precios = async () => {
   arrListaPrecios = [];
   let respuesta = await obtiene_lista_precios();
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      closeLoad();
      return;
   }
   else {
      arrListaPrecios = respuesta.data || [];
      pinta_listas_precios(arrListaPrecios);
   }
};

const pinta_listas_precios = (data) => {  
   if (!data || data.length === 0) {
      $('#listado_litas_precios').html('<div align="center" class="mt-5"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron listas de precios registradas</div>');
      closeLoad();
      return;
   }
   
   let html = `<div class="row">`;
   data.forEach(row => {
      let checked = row.es_defecto == 1 ? 'checked' : '';
      html += `
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2" id="cardListaPrecios${row.id}">
         <div class="card mb-3 shadow border-0">
            <div class="card-body">
               <div class="row">
                  <div class="col-2">
                     <i class="bi bi-card-list fs-2 text-secondary"></i>
                  </div>
                  <div class="col-10">
                     <div class="card-text mt-1"><strong>${escapeHTML(row.nombre || '')}</strong></div>
                     <div class="card-text mt-2 text-muted small">${escapeHTML(row.descripcion || '')}</div>
                  </div>
               </div>
            </div>
            <div class="card-footer bg-white border-top-0 text-end pb-3">
               <button type="button" class="btn btn-outline-secondary btn-redondo btn-sm px-2" onclick="ModalGestionarPrecios(${row.id});" title="Gestionar precios">
                  <i class="bi bi-list-check"></i>
               </button>
               <button type="button" class="btn btn-outline-secondary btn-redondo btn-sm px-2" onclick="ModalFormListaPrecios(${row.id});" title="Editar lista de precios">
                  <i class="bi bi-pencil"></i>
               </button>
               <button type="button" class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarListaPrecios" onclick="fn_eliminar_lista_precios(${row.id});" title="Eliminar lista de precios">
                  <i class="bi bi-trash"></i>
               </button>
            </div>
         </div>
      </div>`;
   });
   html += `</div>`;    
   
   $('#listado_litas_precios').html(html);
   closeLoad();
};

const ModalGestionarPrecios = (idListaPrecios) => {
   let idNum = parseInt(idListaPrecios) || 0;
   let listaSeleccionada = arrListaPrecios.find(l => l.id == idNum);
   let nomListaPrecios   = listaSeleccionada ? listaSeleccionada.nombre || '' : '';

   let html = `
   <div class="modal fade modal-superior-blur" id="modalGestionListaPrecios" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Gestión lista de precios: ${escapeHTML(nomListaPrecios)}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="card border-0 shadow-sm bg-light mb-3">
                  <div class="card-body">
                     <div class="row">
                        <div class="col-12">
                           <h6><strong>Agregar estudio a la lista</strong></h6>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mt-2">
                           <label class="form-label fw-bold mb-1" for="estudioPrecios">Estudio</label>
                           <select name="estudioPrecios" id="estudioPrecios" class="form-select select2" onchange="fn_pintar_precio_base();">
                              <option value="0" data-precio-publico="0">Seleccionar</option>
                           </select>
                        </div>
                        <div class="col-xl-2 col-lg-3 col-md-2 col-sm-4 col-6 mt-2">
                           <label class="form-label fw-bold mb-1" for="precioBasePrecios">Precio base</label>
                           <div class="input-group">
                              <span class="input-group-text"><i class="bi bi-currency-dollar"></i></span>
                              <input type="text" inputmode="numeric" name="precioBasePrecios" id="precioBasePrecios" class="form-control" disabled>
                           </div>
                        </div>
                        <div class="col-xl-2 col-lg-3 col-md-2 col-sm-4 col-6 mt-2">
                           <label class="form-label fw-bold mb-1" for="precioAjustado">Precio ajustado</label>
                           <div class="input-group">
                              <span class="input-group-text"><i class="bi bi-currency-dollar"></i></span>
                              <input type="number" inputmode="decimal" step="0.01" name="precioAjustado" id="precioAjustado" class="form-control" onkeypress="return fnValidaNumeros(event);">
                           </div>
                        </div>
                        <div class="col-xl-2 col-lg-3 col-md-2 col-sm-4 col-12 mt-2 text-end align-self-end">
                           <button type="button" id="btnAddEstudioListaPrecio" class="btn btn-secondary btn-elao w-100 btn-redondo" onclick="fn_agregar_estudio_lista(${idNum});">
                              Agregar
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="row mt-4">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mt-1">
                     <label class="form-label fw-bold mb-1" for="subirBajar">Actualización masiva de precios</label>
                     <div class="input-group">
                        <select name="subirBajar" id="subirBajar" class="form-select">
                           <option value="NA">Seleccionar</option>
                           <option value="Subir">Subir</option>
                           <option value="Bajar">Bajar</option>
                        </select>
                        <input type="number" inputmode="decimal" name="porcentajeSubirBajar" id="porcentajeSubirBajar" class="form-control" placeholder="%" onkeypress="return fnValidaNumeros(event);">
                        <button type="button" class="btn btn-secondary btn-elao" id="btnSubirBajarPrecios" title="Actualizar precios" onclick="fn_actualizacion_masiva_precios(${idNum});">
                           <i class="bi bi-check-circle"></i>
                        </button>
                     </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mt-4">
                     <button type="button" class="btn btn-outline-secondary btn-redondo w-100" id="btnImportarPreciosBase" onclick="fn_generar_lista_precios_base(${idNum});">
                        Importar precios base
                     </button>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mt-4">
                     <button type="button" class="btn btn-outline-danger btn-redondo w-100" id="btnVaciarPreciosLista" onclick="fn_vaciar_lista_precios(${idNum});">
                        Vaciar lista
                     </button>
                  </div>
               </div>
               <div class="col-12 mt-4">
                  <div id="listado_precios_lista"></div>
               </div>
            </div>
            <div class="modal-footer border-0 text-end">
               <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cancelar
              </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalGestionListaPrecios').modal('show');
   
   $('.select2').select2({
      dropdownParent: $('#modalGestionListaPrecios'),
      theme: 'bootstrap-5'
   });

   listar_precios_lista(idNum);
   cargar_estudios('estudioPrecios');

   $('.select2').on('select2:open', function () {
      setTimeout(() => {
         let input = document.querySelector('.select2-container--open .select2-search__field');
         if (input) input.focus();
      }, 10);
   });
};

const listar_precios_lista = async (idListaPrecios) => {
   let idNum = parseInt(idListaPrecios) || 0;
   arrPreciosLista = [];

   let respuesta = await obtiene_precios_lista(idNum);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrPreciosLista = respuesta.data || [];
      pinta_precios_lista(arrPreciosLista, idNum);
   }
};

const pinta_precios_lista = (data, idListaPrecios) => {
   let idNum = parseInt(idListaPrecios) || 0;

   if (!data || data.length === 0) {
      $('#listado_precios_lista').html('<div align="center" class="mt-5"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron estudios en esta lista</div>');
      return;
   }

   let html = `
   <div class="table-responsive">
      <table id="tablePreciosLista" class="table dataTable table-striped table-hover">
         <thead>
            <tr align="center">
               <th width="10%">ID</th>
               <th width="55%">Estudio</th>
               <th width="15%">Precio</th>
               <th width="15%">Acciones</th>
            </tr>
         </thead>
         <tbody>`;

   data.forEach((row) => {
      html += `
      <tr id="trPreciosLista${row.id}">
         <td class="text-center">${row.id}</td>
         <td>${escapeHTML(row.nombre_estudio || '')}</td>
         <td>
            <input type="number" inputmode="decimal" step="0.01" name="precioAjustado${row.id}" id="precioAjustado${row.id}" class="form-control form-control-sm text-end" value="${parseFloat(row.precio || 0).toFixed(2)}" onkeypress="return fnValidaNumeros(event);">
         </td>
         <td class="text-center">
            <button class="btn btn-secondary btn-lib btn-sm fs-6 btnActualizarPrecioEspecifico" type="button" title="Actualizar precio" onclick="fn_actualizar_precio_especifico(${row.id}, ${idNum});">
               <i class="bi bi-floppy"></i>
            </button>
            <button type="button" class="btn btn-danger btn-sm fs-6 btnEliminarPrecioEspecifico" title="Eliminar precio" onclick="fn_eliminar_precio_especifico(${row.id}, ${idNum});">  
               <i class="bi bi-trash"></i>
            </button>
         </td>
      </tr>`;
   });

   html += `
         </tbody>
      </table>
   </div>`;
 
   $('#listado_precios_lista').html(html);

   setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#tablePreciosLista')) {
         $('#tablePreciosLista').DataTable().destroy();
      }

      new DataTable('#tablePreciosLista', {   
         language: {
            url: "assets/lib/DataTables/es-ES.json",
         },
         responsive: true
      });
   }, 200);
};

const fn_agregar_estudio_lista = async (idListaPrecios) => {
   let idNum         = parseInt(idListaPrecios) || 0;
   let selectEstudio = document.getElementById("estudioPrecios");
   let idEstudio     = parseInt(selectEstudio.value) || 0;
   let precioBase    = $('option:selected', selectEstudio).attr('data-precio-publico');
   let nomEstudio    = selectEstudio.options[selectEstudio.selectedIndex].text;
   let nuevoPrecio   = $('#precioAjustado').val().trim();

   let listaSeleccionada = arrListaPrecios.find(l => l.id == idNum);
   let nomListaPrecios   = listaSeleccionada ? listaSeleccionada.nombre || '' : '';

   if (idEstudio === 0) {
      ToastColor.fire({ text: '¡Atención! Debes seleccionar un estudio', icon: 'warning' });
      $('#estudioPrecios').focus();
      return;
   }
   else if (!precioBase || parseFloat(precioBase) <= 0) {
      ToastColor.fire({ text: '¡Atención! Hubo un problema para cargar el precio base / público', icon: 'warning' });
      return;
   }
   else if (nuevoPrecio === '' || parseFloat(nuevoPrecio) <= 0) {
      ToastColor.fire({ text: '¡Atención! Debes ingresar un nuevo precio mayor a 0', icon: 'warning' });
      $('#precioAjustado').focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se agregará el estudio: ' + escapeHTML(nomEstudio) + ' con precio $' + nuevoPrecio + ' a la lista: ' + escapeHTML(nomListaPrecios), 'question', 'Sí, agregar', 'Cancelar');
   if (!res.result) {
      $('#btnAddEstudioListaPrecio').prop('disabled', false);
      return;
   }

   $('#btnAddEstudioListaPrecio').prop('disabled', true);

   let objEstudio = { 
      func: 'agregar_estudio_lista', 
      idListaPrecios: idNum, 
      nomListaPrecios, 
      idEstudio, 
      nomEstudio, 
      precioBase, 
      nuevoPrecio: parseFloat(nuevoPrecio),
      csrf: CSRF_TOKEN
   };

   let respuesta = await agregar_estudio_lista(objEstudio);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('¡Estudio agregado correctamente!', '', 'success', 2500);
      listar_precios_lista(idNum);
      $('#estudioPrecios').val(0).trigger('change');
      $('#precioBasePrecios').val('');
      $('#precioAjustado').val('');
      $('#btnAddEstudioListaPrecio').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnAddEstudioListaPrecio').prop('disabled', false);
      return;
   }
};

const fn_actualizar_precio_especifico = async (idPrecio, idListaPrecios) => {
   let idPrecioNum = parseInt(idPrecio) || 0;
   let idListaNum  = parseInt(idListaPrecios) || 0;
   let precioRow   = arrPreciosLista.find(p => p.id == idPrecioNum);
   if (!precioRow) return;

   let nomEstudio  = precioRow.nombre_estudio || '';
   let nuevoPrecio = $('#precioAjustado' + idPrecioNum).val().trim();

   let listaSeleccionada = arrListaPrecios.find(l => l.id == idListaNum);
   let nomListaPrecios   = listaSeleccionada ? listaSeleccionada.nombre || '' : '';

   if (nuevoPrecio === '' || parseFloat(nuevoPrecio) <= 0) {
      ToastColor.fire({ text: '¡Atención! Debes ingresar un nuevo precio mayor a 0', icon: 'warning' });
      $('#precioAjustado' + idPrecioNum).focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El precio para el estudio: ' + escapeHTML(nomEstudio) + ' será actualizado', 'question', 'Sí, actualizar', 'Cancelar');
   if (!res.result) {
      $('.btnActualizarPrecioEspecifico').prop('disabled', false);
      return;
   }

   $('.btnActualizarPrecioEspecifico').prop('disabled', true);
   let respuesta = await actualizar_precio_especifico(idPrecioNum, parseFloat(nuevoPrecio), nomEstudio, idListaNum, nomListaPrecios, CSRF_TOKEN);

   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Precio actualizado correctamente', '', 'success', 2500);
      $('.btnActualizarPrecioEspecifico').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnActualizarPrecioEspecifico').prop('disabled', false);
      return;
   }
};

const fn_eliminar_precio_especifico = async (idPrecio, idListaPrecios) => {
   let idPrecioNum = parseInt(idPrecio) || 0;
   let idListaNum  = parseInt(idListaPrecios) || 0;
   let precioRow   = arrPreciosLista.find(p => p.id == idPrecioNum);
   if (!precioRow) return;

   let nomEstudio  = precioRow.nombre_estudio || '';
   let precio      = precioRow.precio || 0;

   let listaSeleccionada = arrListaPrecios.find(l => l.id == idListaNum);
   let nomListaPrecios   = listaSeleccionada ? listaSeleccionada.nombre || '' : '';

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El precio para el estudio: ' + escapeHTML(nomEstudio) + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   if (!res.result) {
      $('.btnEliminarPrecioEspecifico').prop('disabled', false);
      return;
   }

   $('.btnEliminarPrecioEspecifico').prop('disabled', true);

   let respuesta = await eliminar_precio_especifico(idPrecioNum, precio, nomEstudio, idListaNum, nomListaPrecios, CSRF_TOKEN);

   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Precio eliminado correctamente', '', 'success', 2500);
      if ($.fn.DataTable.isDataTable('#tablePreciosLista')) {
         let tabla = $('#tablePreciosLista').DataTable();
         tabla.row($('#trPreciosLista' + idPrecioNum)).remove().draw();
      } else {
         $('#trPreciosLista' + idPrecioNum).remove();
      }
      arrPreciosLista = arrPreciosLista.filter(p => p.id != idPrecioNum);
      $('.btnEliminarPrecioEspecifico').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnEliminarPrecioEspecifico').prop('disabled', false);
      return;
   }
};

const fn_actualizacion_masiva_precios = async (idListaPrecios) => {
   let idNum = parseInt(idListaPrecios) || 0;
   let listaSeleccionada = arrListaPrecios.find(l => l.id == idNum);
   let nomListaPrecios   = listaSeleccionada ? listaSeleccionada.nombre || '' : '';

   let subirBajar = $('#subirBajar').val();
   let porcentaje = $('#porcentajeSubirBajar').val().trim();

   if (subirBajar === 'NA') {
      ToastColor.fire({ text: '¡Atención! Debes seleccionar si se subirán o bajarán los precios', icon: 'warning' });
      $('#subirBajar').focus();
      return;
   }
   else if (porcentaje === '' || parseFloat(porcentaje) <= 0) {
      ToastColor.fire({ text: '¡Atención! Debes indicar el porcentaje de actualización', icon: 'warning' });
      $('#porcentajeSubirBajar').focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los precios de la lista: ' + escapeHTML(nomListaPrecios) + ' se van a ' + subirBajar + ' en un ' + porcentaje + '%', 'question', 'Sí, actualizar', 'Cancelar');
   if (!res.result) {
      $('#btnSubirBajarPrecios').prop('disabled', false);
      return;
   }

   $('#btnSubirBajarPrecios').prop('disabled', true);

   let respuesta = await actualizacion_masiva_precios(idNum, nomListaPrecios, subirBajar, parseFloat(porcentaje), CSRF_TOKEN);

   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Precios actualizados correctamente', '', 'success', 2500);
      listar_precios_lista(idNum);
      $('#btnSubirBajarPrecios').prop('disabled', false);
      $('#subirBajar').val('NA');
      $('#porcentajeSubirBajar').val('');
      return;
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnSubirBajarPrecios').prop('disabled', false);
      return;
   }
};

const fn_vaciar_lista_precios = async (idListaPrecios) => {
   let idNum = parseInt(idListaPrecios) || 0;
   let listaSeleccionada = arrListaPrecios.find(l => l.id == idNum);
   let nomListaPrecios   = listaSeleccionada ? listaSeleccionada.nombre || '' : '';

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los estudios de la lista ' + escapeHTML(nomListaPrecios) + ' serán eliminados', 'question', 'Sí, eliminar', 'Cancelar');
   if (!res.result) {
      $('#btnVaciarPreciosLista').prop('disabled', false);
      return;
   }

   $('#btnVaciarPreciosLista').prop('disabled', true);

   let respuesta = await vaciar_lista_precios(idNum, nomListaPrecios, CSRF_TOKEN);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('¡Estudios eliminados correctamente!', '', 'success', 2500);
      listar_precios_lista(idNum);
      $('#btnVaciarPreciosLista').prop('disabled', false);
      return;
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnVaciarPreciosLista').prop('disabled', false);
      return;
   }
};

const fn_generar_lista_precios_base = async (idListaPrecios) => {
   let idNum = parseInt(idListaPrecios) || 0;
   let listaSeleccionada = arrListaPrecios.find(l => l.id == idNum);
   let nomListaPrecios   = listaSeleccionada ? listaSeleccionada.nombre || '' : '';
  
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se borrará la lista y se importarán a esta lista todos los estudios del catálogo con su precio base', 'question', 'Sí, importar', 'Cancelar');
   if (!res.result) {
      $('#btnImportarPreciosBase').prop('disabled', false);
      return;
   }

   $('#btnImportarPreciosBase').prop('disabled', true);

   let respuesta = await generar_lista_precios_base(idNum, nomListaPrecios, CSRF_TOKEN);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('Precios importados correctamente', '', 'success', 2500);
      listar_precios_lista(idNum);
      $('#btnImportarPreciosBase').prop('disabled', false);
      return;
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnImportarPreciosBase').prop('disabled', false);
      return;
   }
};

const cargar_estudios = async (containerId) => {  
   comboEstudios = '<option value="0" data-precio-publico="0">Seleccionar</option>';
   let respuesta = await obtiene_estudios();
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      if (respuesta.data && respuesta.data.length > 0) {
         respuesta.data.forEach(estudio => {
            comboEstudios += `<option value="${estudio.id}" data-precio-publico="${estudio.precio_publico}">${escapeHTML(estudio.nombre || '')}</option>`;
         });
         $('#' + containerId).html(comboEstudios);
      }
   }  
};

const fn_pintar_precio_base = () => {
   let selectEstudio = document.getElementById("estudioPrecios");
   let precioBase    = $('option:selected', selectEstudio).attr('data-precio-publico') ?? '0';
   $('#precioBasePrecios').val(parseFloat(precioBase).toFixed(2));
};

// Interfaces
window.TabPrecios                      = TabPrecios;
window.ModalFormListaPrecios           = ModalFormListaPrecios;
window.ModalGestionarPrecios           = ModalGestionarPrecios;

// Funciones
window.listar_listas_precios           = listar_listas_precios;
window.fn_guardar_lista_precios        = fn_guardar_lista_precios;
window.fn_eliminar_lista_precios       = fn_eliminar_lista_precios;

window.listar_precios_lista            = listar_precios_lista;
window.fn_actualizar_precio_especifico = fn_actualizar_precio_especifico;
window.fn_eliminar_precio_especifico   = fn_eliminar_precio_especifico;

window.cargar_estudios                 = cargar_estudios;
window.fn_pintar_precio_base           = fn_pintar_precio_base;
window.fn_agregar_estudio_lista        = fn_agregar_estudio_lista;
window.fn_actualizacion_masiva_precios = fn_actualizacion_masiva_precios;
window.fn_generar_lista_precios_base   = fn_generar_lista_precios_base;
window.fn_vaciar_lista_precios         = fn_vaciar_lista_precios;
window.fn_marcar_precio_defecto        = fn_marcar_precio_defecto;