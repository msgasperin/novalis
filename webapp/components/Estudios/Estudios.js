import { obtiene_estudios, guardar_estudio, eliminar_estudio } from "./EstudiosServices.js";

let arrEstudios = [];

const TabEstudios = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-list-columns"></i> Paquetes / Estudios</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevoEstudio" onclick="ModalFormEstudio(0,'');"><i class="bi bi-plus-lg"></i> Nuev Estudio</button>
      </div>
   </div>
   <div class="mt-4">
      <div id="listar_estudios"></div>      
   </div>`;

   $('#containerMain').html(html);
   
   listar_estudios('listar_estudios');
}

const ModalFormEstudio = (idEstudio, nomEstudio) => {

   let estudioSeleccionado = arrEstudios.filter(estudio => estudio.id == idEstudio);

   let titulo;
   let nombre              = '';
   let tipo                = 'NA';
   let precio_publico      = '';
   let indicaciones_toma   = '';
   let descripcion_estudio = '';

   if(idEstudio > 0) {
      titulo              = 'Editar Estudio: '+ nomEstudio;
      nombre              = estudioSeleccionado[0].nombre;
      tipo                = estudioSeleccionado[0].tipo;
      precio_publico      = estudioSeleccionado[0].precio_publico;
      indicaciones_toma   = estudioSeleccionado[0].indicaciones_toma;
      descripcion_estudio = estudioSeleccionado[0].descripcion_estudio;
   }
   else {
      titulo = 'Registrar Nuevo Estudio';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormEstudio" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
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
                     <b>Nombre del estudio / paquete *</b>
                     <input type="text" name="nomEstudio" id="nomEstudio" class="form-control" maxlength="150" value="${nombre}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Descripción estudio / paquete</b>
                     <textarea name="descripcionEstudio" id="descripcionEstudio" class="form-control" rows="3" maxlength="250">${descripcion_estudio}</textarea>
                  </div>
                  <div class="col-12 col-sm-6 mt-3">
                     <b>Tipo *</b>
                     <select name="tipoEstudio" id="tipoEstudio" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="ESTUDIO">ESTUDIO</option>
                        <option value="PAQUETE">PAQUETE</option>
                     </select>
                  </div>
                  <div class="col-12 col-sm-6 mt-3">
                     <b>Precio Público *</b>
                     <input type="number" inputmode="numeric" name="precioPublico" id="precioPublico" class="form-control" maxlength="10" value="${precio_publico}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Indicaciones toma de muestra</b>
                     <textarea name="indicacionesToma" id="indicacionesToma" class="form-control" rows="3" maxlength="400">${indicaciones_toma}</textarea>
                  </div>
               </div>
            </div>
            <div class="modal-footer border-0 text-end">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnGuardarEstudio" onclick="fn_guardar_estudio('${idEstudio}');">
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
   $('#modalFormEstudio').modal('show');
   setTimeout(() => {
      $('#tipoEstudio').val(tipo);
   }, 200);
}

const listar_estudios = async (containerId) => {
   activarLoad('Cargando estudios...');
   let respuesta = await obtiene_estudios();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrEstudios = respuesta.data;
      pinta_listado_estudios(containerId, respuesta.data);
   }
}

const pinta_listado_estudios = (containerId, data) => {
   if(data.length == 0) {
      $('#'+containerId).html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron estudios registrados</div>');
      closeLoad();
      return;
   }
   
   let html = 
   `<table class="table table-striped table-bordered dataTable" id="tableEstudios">
      <thead>
         <tr>
            <th width="5%">ID</th>
            <th width="65%">Estudio</th>
            <th width="10%">Tipo</th>
            <th width="10%">Precio Público</th>
            <th width="10%">Acciones</th>
         </tr>
      </thead>
      <tbody>`;
         data.map(row => {
            html+=
            `<tr id="trEstudios${row.id}">
               <td class="text-center">${row.id}</td>
               <td>${row.nombre}</td>
               <td class="text-center">${row.tipo}</td>
               <td>$ ${row.precio_publico}</td>
               <td class="text-center">
                  <button type="buttton" class="btn btn-outline-secondary btn-redondo btn-sm px-2" onclick="ModalFormEstudio('${row.id}', '${row.nombre}');" title="Editar estudio">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button type="buttton" class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarEstudio" onclick="fn_eliminar_estudio('${row.id}', '${row.nombre}');" title="Eliminar estudio">
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
      new DataTable('#tableEstudios', {   
         language: {
            url: "assets/lib/DataTables/es-ES.json",
         },
         responsive: true
      });
   }, 200);
   closeLoad();
}

const fn_guardar_estudio = async (idEstudio) => {

   let nomEstudio         = $('#nomEstudio').val().trim();
   let tipoEstudio        = $('#tipoEstudio').val();
   let precioPublico      = $('#precioPublico').val().trim();
   let descripcionEstudio = $('#descripcionEstudio').val().trim();
   let indicacionesToma   = $('#indicacionesToma').val().trim();
   let msjAccion          = '';

   if (nomEstudio == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del estudio',
         icon: 'warning'
      });
      $('#nomEstudio').focus();
      return;
   }
   else if (tipoEstudio == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el tipo de estudio',
         icon: 'warning'
      });
      $('#tipoEstudio').focus();
      return;
   }
   else if (parseFloat(precioPublico) == 0 || precioPublico == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el precio público y debe ser mayor a 0',
         icon: 'warning'
      });
      $('#precioPublico').focus();
      return;
   }
  
   const objEstudio = { func: 'guardar_estudio', idEstudio, nomEstudio, tipoEstudio, precioPublico, descripcionEstudio, indicacionesToma };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información del estudio ' + nomEstudio + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnGuardarEstudio').prop('disabled', false);
      return;
   }

   $('#btnGuardarEstudio').prop('disabled', true);
   let respuesta = await guardar_estudio(objEstudio);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      
      idEstudio > 0 ? msjAccion = 'Información actualizada' : msjAccion = 'Estudio guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormEstudio').modal('hide');
      $('#btnGuardarEstudio').prop('disabled', false);
      listar_estudios('listar_estudios');
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnGuardarEstudio').prop('disabled', false);
      return;
   }
}

const fn_eliminar_estudio = async (idEstudio, nomEstudio) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El estudio: ' + nomEstudio + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
    $('.btnEliminarEstudio').prop('disabled', false);
    return;
  }

   $('.btnEliminarEstudio').prop('disabled', true);
   let respuesta = await eliminar_estudio(idEstudio, nomEstudio);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Estudio eliminado correctamente', '', 'success', 2500);
      let tabla = $('#tableEstudios').DataTable();
      tabla.row($('#trEstudios' + idEstudio)).remove().draw();
      $('.btnEliminarEstudio').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarEstudio').prop('disabled', false);
      return;
   }
}

// Interfaces
window.TabEstudios         = TabEstudios;
window.ModalFormEstudio    = ModalFormEstudio;
// Funciones
window.fn_eliminar_estudio = fn_eliminar_estudio;
window.fn_guardar_estudio  = fn_guardar_estudio;
