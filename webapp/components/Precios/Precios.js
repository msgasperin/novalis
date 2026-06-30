import { obtiene_lista_precios, guardar_lista_precio, eliminar_lista_precios, obtiene_precios_lista, actualizar_precio_especifico, eliminar_precio_especifico, agregar_producto_lista, actualizacion_masiva_precios, generar_lista_precios_base, vaciar_lista_precios } from "./PreciosServices.js";
import { obtiene_productos } from "../Productos/ProductosServices.js";

let arrListaPrecios = [];
let arrPreciosLista = [];
let comboProductos  = '';

const TabListaPrecios = () => {
   activarLoad('Cargando listas de precios...');
   let html =
   `<div class="row">
      <div class="col-xl-4 col-lg-4 col-md-8 col-sm-8 col-7 mt-2">
         <div class="fs-4"> <i class="bi bi-coin"></i> Listas de Precios</div>
      </div>
      <div class="col-xl-8 col-lg-8 col-md-4 col-sm-4 col-5 mt-2" align="right">
         <button class="btn btn-secondary btn-elao btn-redondo" type="button" id="btnNuevaListaPrecios" onclick="ModalFormListaPrecios(0, '', '');">
            <i class="bi bi-plus-lg"></i> Nueva lista
         </button>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_litas_precios"></div>
   </div>`;

   $('#containerMain').html(html);

   listar_listas_precios();
   setTimeout(() => {      
      cargar_productos();
   }, 500);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_lista_precios+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalFormListaPrecios = (idListaPrecios, nomListaPrecios, descListaPrecios) => {

   let titulo = '';
   idListaPrecios == 0 ? titulo = 'Nueva lista de precios' : titulo = 'Edición de la lista de precios: ' + nomListaPrecios;

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormListaPrecios" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${titulo}</h1>
               <button type="button" class="btn btn-outline-dark btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row mb-3">
                  <div class="col-12">
                     <strong>Nombre de la lista de precios *</strong>
                     <input type="text" name="nomListaPrecios" id="nomListaPrecios" class="form-control" maxlength="100" value="${nomListaPrecios}">
                  </div>
                  <div class="col-12 mt-3">
                     <strong>Descripción de la lista de precios</strong>
                     <textarea name="descListaPrecios" id="descListaPrecios" class="form-control" maxlength="400" rows="3">${descListaPrecios}</textarea>
                  </div>
               </div>                  
            </div>
            <div class="modal-footer" align="right">
               <button type="buttton" class="btn btn-secondary btn-elao btn-redondo" id="btnGuardarListaPrecios" onclick="fn_guardar_lista_precios('${idListaPrecios}');">
                  Guardar
               </button>
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cancelar
              </button>
            </div>
         </div>
      </div>
  </div>`;
  $('#modalAdmin').html(html);
  $('#modalFormListaPrecios').modal('show');
}

const fn_guardar_lista_precios = async (idListaPrecios) => {

   let nomListaPrecios = $('#nomListaPrecios').val().trim();
   let descripcion     = $('#descListaPrecios').val().trim();
   let func            = '';

   idListaPrecios == 0 ? func = 'guardar_lista_precios' : func = 'actualizar_generales_lista_precios';

   if (nomListaPrecios == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre de la lista de precios',
         icon: 'warning'
      });
      $('#nomListaPrecios').focus();
      return;
   }

   let objListaPrecios = { func, idListaPrecios, nomListaPrecios, descripcion }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La lista de precios: ' + nomListaPrecios + ' será registrada', 'question', 'Sí, guardar', 'Cancelar');
   
   if (!res.result) {
      $('#btnGuardarListaPrecios').prop('disabled', false);
      return;
   }

   $('#btnGuardarListaPrecios').prop('disabled', true);

   let respuesta = await guardar_lista_precio(objListaPrecios);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Lista de precios guardada correctamente', '', 'success', 2500);
      $('#nomListaPrecios').val('');
      $('#descListaPrecios').val('');
      $('#modalFormListaPrecios').modal('hide');
      listar_listas_precios();
      $('#btnGuardarListaPrecios').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarListaPrecios').prop('disabled', false);
      return;
   }
}

const fn_eliminar_lista_precios = async (idListaPrecios, nomListaPrecios) => {
   if (idListaPrecios == '') {
      ToastColor.fire({
      text: '¡Atención! No se obtuvo un parámetro necesario, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La lista de precios: ' + nomListaPrecios + ' será eliminada', 'question', 'Sí, eliminar', 'Cancelar');

   if (!res.result) {
      $('.btnEliminarListaPrecios').prop('disabled', false);
      return;
   }

   $('.btnEliminarListaPrecios').prop('disabled', true);
   let respuesta = await eliminar_lista_precios(idListaPrecios, nomListaPrecios);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Lista de precios eliminada correctamente', '', 'success', 2500);
      $('#cardListaPrecios'+idListaPrecios).remove();
      arrListaPrecios = arrListaPrecios.filter(lista => lista.id != idListaPrecios);
      $('.btnEliminarListaPrecios').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnEliminarListaPrecios').prop('disabled', false);
      return;
   }
}

const listar_listas_precios = async () => {
  arrListaPrecios = [];
  let respuesta = await obtiene_lista_precios();
  if(respuesta.estatus == 403) {
    fnNoSesion();
  }
  else if(respuesta.estatus != 200) {
    showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
    return;
  }
  else {
    arrListaPrecios = await respuesta.data;
    pinta_listas_precios(arrListaPrecios);
  }
}

const pinta_listas_precios = (data) => {  
   let html = '';
   if(data.length == 0) {
      html+='<div align="center" class="mt-5"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron listas de precios registradas</div>';
      $('#listado_litas_precios').html(html);
      closeLoad();
   }
   else {
      html += 
      `<div class="row">`;
         data.map(row => {
            html += `
            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mt-2" id="cardListaPrecios${row.id}">
               <div class="card mb-3 shadow mh-card-pedidos border-0">
                  <div class="card-body">
                     <div class="row">
                        <div class="col-12">
                           <i class="bi bi-wallet fs-2"></i>
                           <div class="card-text mt-1"><strong>${row.nom_precio}</strong></div>
                           <div class="card-text mt-2">${row.descripcion}</div>
                        </div>
                     </div>
                  </div>
                  <div class="card-footer" align="right">
                     <button type="buttton" class="btn btn-secondary btn-elao btn-redondo" onclick="ModalGestionarPrecios('${row.id}', '${row.nom_precio}');" title="Gestionar precios">
                        <i class="bi bi-list-check"></i>
                     </button>
                     <button type="buttton" class="btn btn-outline-dark btn-redondo" onclick="ModalFormListaPrecios('${row.id}', '${row.nom_precio}', '${row.descripcion}');" title="Editar lista de precios">
                        <i class="bi bi-pencil"></i>
                     </button>
                     <button type="buttton" class="btn btn-outline-danger btn-redondo btnEliminarListaPrecios" onclick="fn_eliminar_lista_precios('${row.id}', '${row.nom_precio}');" title="Eliminar lista de precios">
                        <i class="bi bi-trash"></i>
                     </button>
                  </div>
               </div>
            </div>`;
         });
        html+= `
      </div>`;    
      $('#listado_litas_precios').html(html);
      closeLoad();
   }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_precios+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalGestionarPrecios = (idListaPrecios, nomListaPrecios) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalGestionListaPrecios" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Gestión lista de precios: ${nomListaPrecios}</h1>
               <button type="button" class="btn btn-outline-dark btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="card border-0 shadow">
                  <div class="card-body">
                     <div class="row">
                        <div class="col-12">
                           <h6><strong>Agregar producto a la lista</strong></h6>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mt-2">
                           <strong>Producto</strong>
                           <select name="productoPrecios" id="productoPrecios" class="form-select select2" onchange="fn_pintar_precio_base();">
                              <option value="0" data-sku="0", data-precio-base="0">Seleccionar</option>
                              ${comboProductos}
                           </select>
                        </div>
                        <div class="col-xl-2 col-lg-3 col-md-2 col-sm-4 col-6 mt-2">
                           <strong>Precio base</strong>
                           <div class="input-group">
                              <span class="input-group-text" id="inpPrecioBasePrecios"><i class="bi bi-currency-dollar"></i></span>
                              <input type="text" inputmode="numeric" name="precioBasePrecios" id="precioBasePrecios" class="form-control" onkeypress="return fnValidaNumeros(event);" disabled>
                           </div>
                        </div>
                        <div class="col-xl-2 col-lg-3 col-md-2 col-sm-4 col-6 mt-2">
                           <strong>Precio ajustado</strong>
                           <div class="input-group">
                              <span class="input-group-text" id="inpPrecioAjustado"><i class="bi bi-currency-dollar"></i></span>
                              <input type="text" inputmode="numeric" name="precioAjustado" id="precioAjustado" class="form-control" onkeypress="return fnValidaNumeros(event);">
                           </div>
                        </div>
                        <div class="col-xl-2 col-lg-3 col-md-2 col-sm-4 col-12 mt-2">
                           <br>
                           <button type="button" id="btnAddProdListaPrecio" class="btn btn-secondary btn-elao w-100 btn-redondo" onclick="fn_agregar_producto_lista(${idListaPrecios}, '${nomListaPrecios}');">
                              Agregar
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="row mt-4">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mt-1">
                     <strong>Actualización masiva de precios</strong>
                     <div class="input-group">
                        <select name="subirBajar" id="subirBajar" class="form-select">
                           <option value="NA">Seleccionar</option>
                           <option value="Subir">Subir</option>
                           <option value="Bajar">Bajar</option>
                        </select>
                        <input type="number" inputmode="decimal" name="porcentajeSubirBajar" id="porcentajeSubirBajar" class="form-control" placeholder="%" onkeypress="return fnValidaNumeros(event);">
                        <button type="button" class="btn btn-secondary btn-elao" id="btnSubirBajarPrecios" title="Actualizar precios" onclick="fn_actualizacion_masiva_precios('${idListaPrecios}', '${nomListaPrecios}');">
                           <i class="bi bi-check-circle"></i>
                        </button>
                     </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mt-4">
                     <button type="button" class="btn btn-outline-secondary btn-redondo w-100" id="btnImportarPreciosBase" onclick="fn_generar_lista_precios_base('${idListaPrecios}', '${nomListaPrecios}');">
                        Importar precios base
                     </button>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mt-4">
                     <button type="button" class="btn btn-outline-danger btn-redondo w-100" id="btnVaciarPreciosLista" onclick="fn_vaciar_lista_precios('${idListaPrecios}', '${nomListaPrecios}');">
                        Vaciar lista
                     </button>
                  </div>
               </div>
               <div class="col-12 mt-4">
                  <div id="listado_precios_lista"></div>
               </div>
            </div>
            <div class="modal-footer" align="right">
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
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
   listar_precios_lista(idListaPrecios, nomListaPrecios);
   $('.select2').on('select2:open', function () {
      setTimeout(() => {
         let input = document.querySelector('.select2-container--open .select2-search__field');
         if (input) input.focus();
      }, 10);
   });
}

const listar_precios_lista = async (idListaPrecios, nomListaPrecios) => {
  arrPreciosLista = [];
  let respuesta = await obtiene_precios_lista(idListaPrecios);
  if(respuesta.estatus == 403) {
    fnNoSesion();
  }
  else if(respuesta.estatus != 200) {
    showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
    return;
  }
  else {
    arrPreciosLista = await respuesta.data;
    pinta_precios_lista(arrPreciosLista, idListaPrecios, nomListaPrecios);
  }
}

const pinta_precios_lista = (data, idListaPrecios, nomListaPrecios) => {
   let html = '';
   if(data.length == 0) {
      html+='<div align="center" class="mt-5"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron productos en esta lista</div>';
      $('#listado_precios_lista').html(html);
   }
   else {
      html += 
      `<div class="table-responsive">
         <table id="tablePreciosLista" class="table dataTable table-striped table-hover">
            <thead>
            <tr align="center">
               <th width="10%">SKU</th>
               <th width="45%">Producto</th>
               <th width="15%">Precio base</th>
               <th width="15%">Precio ajustado</th>
               <th width="15%">Acciones</th>
            </tr>
            </thead>
            <tbody>`;
            data.map((row, i) => {
                  html+=`
                  <tr id="trPreciosLista${row.id}">
                     <td class="text-center">${row.sku}</td>
                     <td>${row.nom_producto}</td>
                     <td class="text-end">${row.precio_base_ref}</td>
                     <td>
                        <input type="text" inputmode="decimal" name="precioAjustado${row.id}" id="precioAjustado${row.id}" class="form-control text-end" value="${row.precio_venta}" onkeypress="return fnValidaNumeros(event);">
                     </td>
                     <td class="text-center">
                        <button class="btn btn-secondary btn-elao btnActualizarPrecioEspecifico" type="button" title="Actualizar precio" onclick="fn_actualizar_precio_especifico(${row.id}, '${row.nom_producto}', ${idListaPrecios}, '${nomListaPrecios}');">
                           <i class="bi bi-floppy"></i>
                        </button>
                        <button type="button" class="btn btn-danger btnEliminarPrecioEspecifico" title="Eliminar precio" onclick="fn_eliminar_precio_especifico(${row.id}, '${row.nom_producto}', ${idListaPrecios}, '${nomListaPrecios}', '${row.precio_venta}');">  
                           <i class="bi bi-trash"></i>
                        </button>
                     </td>
                  </tr>`;
            });
            html+= `
            </tbody>
         </table>
      </div>`;
    
      $('#listado_precios_lista').html(html);

      setTimeout(() => {
         new DataTable('#tablePreciosLista', {   
            language: {
               url: "assets/lib/DataTables/es-ES.json",
            },
            responsive: true
         });
      }, 500);
   }
}

const fn_agregar_producto_lista = async (idListaPrecios, nomListaPrecios) => {
   if (idListaPrecios == '') {
      ToastColor.fire({
      text: '¡Atención! No se obtuvo un parámetro necesario, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }

   let selectProd  = document.getElementById("productoPrecios");
   let idProducto  = selectProd.value;
   let sku         = $('option:selected', selectProd).attr('data-sku');
   let precioBase  = $('option:selected', selectProd).attr('data-precio-base');
   let nomProducto = selectProd.options[selectProd.selectedIndex].text;
   let nuevoPrecio = $('#precioAjustado').val().trim();

   if(idProducto == 0) {
      ToastColor.fire({
      text: '¡Atención! Debes seleccionar un producto',
         icon: 'warning'
      });
      $('#productoPrecios').focus();
      return;
   }
   else if(precioBase == '' || parseFloat(precioBase) <= 0) {
      ToastColor.fire({
      text: '¡Atención! Hubo un problema para cargar el precio base, actualiza e inténtalo de nuevo',
         icon: 'warning'
      });
      return;
   }
   else if(nuevoPrecio == '' || parseFloat(nuevoPrecio) <= 0) {
      ToastColor.fire({
      text: '¡Atención! Debes ingresar un nuevo precio mayor a 0',
         icon: 'warning'
      });
      $('#precioAjustado').focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se agregará el producto: ' + nomProducto + ' con precio $'+ nuevoPrecio +' a la lista de precios: ' + nomListaPrecios, 'question', 'Sí, actualizar', 'Cancelar');
   
   if (!res.result) {
      $('#btnAddProdListaPrecio').prop('disabled', false);
      return;
   }

   $('#btnAddProdListaPrecio').prop('disabled', true);

   let objProducto = { func: 'agregar_producto_lista', idListaPrecios, nomListaPrecios, idProducto, nomProducto, sku, precioBase, nuevoPrecio };

   let respuesta = await agregar_producto_lista(objProducto);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Producto agregado correctamente', '', 'success', 2500);
      listar_precios_lista(idListaPrecios, nomListaPrecios);
      $('#productoPrecios').val(0);
      $('#productoPrecios').trigger('change');
      $('#inpPrecioBasePrecios').val('');
      $('#precioAjustado').val('');
      $('#btnAddProdListaPrecio').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnAddProdListaPrecio').prop('disabled', false);
      return;
   }
}

const fn_actualizar_precio_especifico = async (idPrecio, nomProducto, idListaPrecios, nomListaPrecios) => {
   if (idPrecio == '') {
      ToastColor.fire({
      text: '¡Atención! No se obtuvo un parámetro necesario, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }

   let nuevoPrecio = $('#precioAjustado'+idPrecio).val().trim();

   if(nuevoPrecio == '') {
      ToastColor.fire({
      text: '¡Atención! Debes ingresar un nuevo precio mayor a 0',
         icon: 'warning'
      });
      $('#precioAjustado'+idPrecio).focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El precio para el producto: ' + nomProducto + ' será actualizado', 'question', 'Sí, actualizar', 'Cancelar');

   if (!res.result) {
      $('.btnActualizarPrecioEspecifico').prop('disabled', false);
      return;
   }

   $('.btnActualizarPrecioEspecifico').prop('disabled', true);
   let respuesta = await actualizar_precio_especifico(idPrecio, nomProducto, idListaPrecios, nomListaPrecios, nuevoPrecio);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Precio actualizado correctamente', '', 'success', 2500);
      $('.btnActualizarPrecioEspecifico').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnActualizarPrecioEspecifico').prop('disabled', false);
      return;
   }
}

const fn_eliminar_precio_especifico = async (idPrecio, nomProducto, idListaPrecios, nomListaPrecios, precio) => {
   if (idPrecio == '') {
      ToastColor.fire({
      text: '¡Atención! No se obtuvo un parámetro necesario, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El precio para el producto: ' + nomProducto + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');

   if (!res.result) {
      $('.btnEliminarPrecioEspecifico').prop('disabled', false);
      return;
   }

   $('.btnEliminarPrecioEspecifico').prop('disabled', true);

   let respuesta = await eliminar_precio_especifico(idPrecio, nomProducto, idListaPrecios, nomListaPrecios, precio);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Precio eliminado correctamente', '', 'success', 2500);
      let tabla = $('#tablePreciosLista').DataTable();
      tabla.row($('#trPreciosLista' + idPrecio)).remove().draw();
      $('.btnEliminarPrecioEspecifico').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnEliminarPrecioEspecifico').prop('disabled', false);
      return;
   }
}

const fn_actualizacion_masiva_precios = async (idListaPrecios, nomListaPrecios) => {
   if (idListaPrecios == '') {
      ToastColor.fire({
      text: '¡Atención! No se obtuvo un parámetro necesario, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }

   let subirBajar = $('#subirBajar').val();
   let porcentaje = $('#porcentajeSubirBajar').val();

   if (subirBajar == 'NA') {
      ToastColor.fire({
      text: '¡Atención! Debes seleccionar si se subirán o bajarán los precios',
         icon: 'warning'
      });
      $('#subirBajar').focus();
      return;
   }
   else if (porcentaje == '') {
      ToastColor.fire({
      text: '¡Atención! Debes indicar el porcentaje de la actualizción',
         icon: 'warning'
      });
      $('#porcentajeSubirBajar').focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los precios de la lista: ' + nomListaPrecios + ' se van a ' + subirBajar + ' en un ' + porcentaje + '%', 'question', 'Sí, actualizar', 'Cancelar');
   
   if (!res.result) {
      $('#btnSubirBajarPrecios').prop('disabled', false);
      return;
   }

   $('#btnSubirBajarPrecios').prop('disabled',true);

   let respuesta = await actualizacion_masiva_precios(idListaPrecios, nomListaPrecios, subirBajar, porcentaje );
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Precios actualizados correctamente', '', 'success', 2500);
      listar_precios_lista(idListaPrecios, nomListaPrecios);
      $('#btnSubirBajarPrecios').prop('disabled',false);
      $('#subirBajar').val('NA');
      $('#porcentajeSubirBajar').val('');
      return;
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnSubirBajarPrecios').prop('disabled',false);
      return;
   }
}

const fn_vaciar_lista_precios = async (idListaPrecios, nomListaPrecios) => {
   if (idListaPrecios == '') {
      ToastColor.fire({
      text: '¡Atención! No se obtuvo un parámetro necesario, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los productos de la lista '+nomListaPrecios+' serán eliminados', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('#btnVaciarPreciosLista').prop('disabled', false);
      return;
   }

   $('#btnVaciarPreciosLista').prop('disabled',true);

   let respuesta = await vaciar_lista_precios(idListaPrecios, nomListaPrecios );
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Productos eliminados correctamente!', '', 'success', 2500);
      listar_precios_lista(idListaPrecios, nomListaPrecios);
      $('#btnVaciarPreciosLista').prop('disabled',false);
      return;
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnVaciarPreciosLista').prop('disabled',false);
      return;
   }
}

const fn_generar_lista_precios_base = async (idListaPrecios, nomListaPrecios) => {
   if (idListaPrecios == '') {
      ToastColor.fire({
      text: '¡Atención! No se obtuvo un parámetro necesario, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }
  
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se borrará la lista y se importarán a esta lista todos los productos del catálogo con su precio base', 'question', 'Sí, importar', 'Cancelar');
   
   if (!res.result) {
      $('#btnImportarPreciosBase').prop('disabled', false);
      return;
   }

   $('#btnImportarPreciosBase').prop('disabled',true);

   let respuesta = await generar_lista_precios_base(idListaPrecios, nomListaPrecios );
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Precios importados correctamente', '', 'success', 2500);
      listar_precios_lista(idListaPrecios, nomListaPrecios);
      $('#btnImportarPreciosBase').prop('disabled',false);
      return;
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnImportarPreciosBase').prop('disabled',false);
      return;
   }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES genéricas+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const cargar_productos = async () => {  
  comboProductos = '';
  let respuesta = await obtiene_productos();
  if(respuesta.estatus == 403) {
    fnNoSesion();
  }
  else if(respuesta.estatus != 200) {
    showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
    return;
  }
  else {
    if(respuesta.data.length > 0) {
      respuesta.data.map(producto => {
        comboProductos+=`<option value="${producto.id}" data-sku="${producto.sku}" data-precio-base="${producto.precio_base}">${producto.nom_producto}</option>`;
      });
    }
  }  
}

const fn_pintar_precio_base = () => {
   
   let selectProd  = document.getElementById("productoPrecios");
   let precioBase  = $('option:selected', selectProd).attr('data-precio-base');
   //let nomProducto = selectProd.options[selectProd.selectedIndex].text;

   $('#precioBasePrecios').val(precioBase);
}

window.TabListaPrecios                 = TabListaPrecios;
window.ModalFormListaPrecios           = ModalFormListaPrecios;
window.ModalGestionarPrecios           = ModalGestionarPrecios;

window.listar_listas_precios           = listar_listas_precios;
window.fn_guardar_lista_precios        = fn_guardar_lista_precios;
window.fn_eliminar_lista_precios       = fn_eliminar_lista_precios;

window.listar_precios_lista            = listar_precios_lista;
window.fn_actualizar_precio_especifico = fn_actualizar_precio_especifico;
window.fn_eliminar_precio_especifico   = fn_eliminar_precio_especifico;

window.cargar_productos                = cargar_productos;
window.fn_pintar_precio_base           = fn_pintar_precio_base;
window.fn_agregar_producto_lista       = fn_agregar_producto_lista;
window.fn_actualizacion_masiva_precios = fn_actualizacion_masiva_precios;
window.fn_generar_lista_precios_base   = fn_generar_lista_precios_base;
window.fn_vaciar_lista_precios         = fn_vaciar_lista_precios;