import { guardar_usuario, obtiene_usuarios, eliminar_usuario, actualizar_llave, consulta_log } from "./UsuariosServices.js";

let arrUsuarios = [];

const TabUsuarios = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-person-gear"></i> Usuarios</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevoUsuario" onclick="ModalFormUsuario(0, 0,'');"><i class="bi bi-plus-lg"></i> Nuevo Usuario</button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 col-md-3" align="right">
         <div class="input-group">
            <input type="text" name="inpBusquedaUsuario" id="inpBusquedaUsuario" class="form-control border-end-0" placeholder="Buscar usuario" onkeyUp="fn_buscar_usuario();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="containerListUsuarios"></div>      
   </div>`;

   $('#containerMain').html(html);
   
   listar_usuarios();
}

const ModalLogsMovimientos = () => {

   let html = `
   <div class="modal fade modal-superior-blur" id="modalLogMovimientos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Log de movimientos</h1>
               <button type="button" class="btn btn-outline-dark btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="col-lg-3 col-md-3 col-sm-3 col-6 mt-3">
                     <b>Desde *</b>
                     <input type="date" name="fecIniLog" id="fecIniLog" class="form-control"/>
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-3 col-6 mt-3">
                     <b>Hasta *</b>
                     <input type="date" name="fecFinLog" id="fecFinLog" class="form-control"/>
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-4 col-6 mt-3">
                     <b>Usuario *</b>
                     <select name="userLog" id="userLog" class="form-select">
                        <option value="0">Seleccionar</option>
                     </select>
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-2 col-6 mt-3">
                     <br>
                     <button type="button" class="btn btn-secondary btn-elao btn-redondo" id="btnConsultaLog" onclick="fn_consultar_log();">
                        Consultar
                     </button>
                  </div>
               </div>
               <div class="row mt-4">
                  <div class="col-12">
                     <div id="listado_log">
                        <div class="alert alert-secondary border-0 shadow-sm d-flex align-items-center justify-content-center p-4" role="alert">
                           <i class="bi bi-calendar-range fs-3 me-3 text-muted"></i>
                           <div>
                              <h6 class="mb-1 fw-bold">Consulta de Log de movimientos</h6>
                              <span class="text-muted small">
                                 Selecciona un rango de fechas y a un operativo y presiona el botón <strong>Consultar</strong> para visualizar el listado.
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
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
   setTimeout(() => {
      fn_combo_usuarios('userLog');
   }, 500);
   $('#modalAdmin').html(html);
   $('#modalLogMovimientos').modal('show');
}

const fn_consultar_log = async () => {  
   
   let fecIni    = $('#fecIniLog').val().trim();
   let fecFin    = $('#fecFinLog').val().trim();
   let idUsuario = $('#userLog').val();

   if(fecIni == '' || fecFin == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el rango de fechas',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniLog').focus()
      return;
   }
   else if(fecIni > fecFin) {
      ToastColor.fire({
         text: '¡Atención! La fecha inicial no puede ser mayor a la fecha final',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#fecIniLog').focus()
      return;
   }
   else {
      let fechaInicio = new Date(fecIni);
      let fechaFin    = new Date(fecFin);

      // Diferencia en milisegundos → convertir a días
      let diffMs   = fechaFin - fechaInicio;
      let diffDias = diffMs / (1000 * 60 * 60 * 24);

      if (diffDias > 30) {
         ToastColor.fire({
            text: '¡Atención! El rango de fechas no puede ser mayor a 30 días',
            icon: 'warning',
            position: 'top',
            timerProgressBar: false
         });
         $('#fecIniLog').focus();
         return;
      }
   }

   $('#btnConsultaLog').prop('disabled', true);

   $('#listado_log').html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');

   let respuesta = await consulta_log(fecIni, fecFin, idUsuario);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnConsultaLog').prop('disabled', false);
      $('#listado_log').html(`
         <div class="text-center py-5">
            <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
            <p class="text-muted">Hubo problemas</p>
         </div>
      `);
      return;
   }
   else {
      let arrListado = await respuesta.data;
      pinta_listado_log(arrListado);
   }
}

const pinta_listado_log = (data) => {
   let html     = '';
   if(data.length > 0) {
      html += `
      <div class="row mt-3">
         <div class="col-12">
            <table id="tableLogMovimientos" class="table dataTable table-striped table-hover">
               <thead>
               <tr align="center">
                  <th width="5%"></th>
                  <th width="20%">Fecha</th>
                  <th width="40%">Acción</th>
                  <th width="10%">ID Tracking</th>
                  <th width="30%">Usuario</th>
               </tr>
               </thead>
               <tbody>`;
               data.map(row => {
                  html+=`
                  <tr>
                     <td>${row.fecha}</td>
                     <td>${row.fecha_format}</td>
                     <td>${row.accion}</td>
                     <td class="text-center">${row.id_tracking}</td>
                     <td class="text-center">${row.usuario}</td>
                  </tr>`;
               });              
               html+=`
               </tbody>
            </table>
         </div>
      </div>`;

      $('#listado_log').html(html);
      $('#btnConsultaLog').prop('disabled', false);

      setTimeout(() => {
      initDataTableExport({
         tableId: '#tableLogMovimientos',
         titulo: 'Log de movimientos',
         alignment: ['20%', '40%', '10%', '30%'],
         exportColumns: [1, 2, 3, 4],
         posicionOrden: 0,
         order: 'desc'
      }); 
      closeLoad();
      }, 300);
   }
   else {
      $('#listado_log').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron movimientos</div>');
      $('#btnConsultaLog').prop('disabled', false);
   }  
}

const ModalFormUsuario = (idUsuario, nomUsuario) => {

   let usuarioSeleccionado = arrUsuarios.filter(usuario => usuario.id == idUsuario);

   let titulo;
   let nombre      = "";
   let usuario     = "";
   let celular     = "";
   let correo      = "";
   let perfil      = 0;

   if(idUsuario > 0) {
      titulo      = 'Editar Usuario: '+ nomUsuario;
      nombre      = usuarioSeleccionado[0].nombre;
      usuario     = usuarioSeleccionado[0].usuario;
      celular     = usuarioSeleccionado[0].celular;
      correo      = usuarioSeleccionado[0].correo;
      perfil      = usuarioSeleccionado[0].perfil;
   }
   else {
      titulo = 'Registrar Nuevo Usuario';
   }   

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormUsuarios" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen-md-down">
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
                     <b>Nombre del usuario *</b>
                     <input type="text" name="nomUsuario" id="nomUsuario" class="form-control" maxlength="250" value="${nombre}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Usuario *</b>
                     <input type="text" name="usuario" id="usuario" class="form-control" maxlength="50" value="${usuario}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Contraseña *</b>
                     <input type="text" name="contrasenia" id="contrasenia" class="form-control" maxlength="50" />
                  </div>
                  <div class="col-12 mt-3">
                     <b>Celular</b>
                     <input type="tel" name="celUsuario" id="celUsuario" class="form-control" maxlength="10" value="${celular}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Correo</b>
                     <input type="email" name="mailUsuario" id="mailUsuario" class="form-control" value="${correo}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Perfil *</b>
                     <select name="perfilUsuario" id="perfilUsuario" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Administrador</option>
                        <option value="2">Equipo</option>
                        <option value="3">Cliente</option>
                     </select>
                  </div>
               </div>
            </div>
            <div class="modal-footer" align="right">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnSaveUser" onclick="fn_guardar_usuario('${idUsuario}');">
                <i class="bi bi-save"></i> Guardar
              </button> 
              <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
         </div>
      </div>
   </div>`;
   setTimeout(() => {
      $('#perfilUsuario').val(perfil);
   }, 500);
   $('#modalAdmin').html(html);
   $('#modalFormUsuarios').modal('show');
}

const listar_usuarios = async () => {
   activarLoad('Cargando usuarios...');
   let respuesta = await obtiene_usuarios();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrUsuarios = respuesta.data;
      pinta_listado_usuario(respuesta.data);
   }
}

const pinta_listado_usuario = (data) => {
   if(data.length == 0) {
      $('#containerListUsuarios').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron usuarios registrados</div>');
      return;
   }
   
   let html = `<div class="row">`;
   data.map((row, i) => {
      html+=`
      <div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mt-2" id="cardUsuario${row.id}">
         <div class="card mb-3 shadow mh-card-usuarios">
            <div class="card-body">
               <div class="row fs-8">
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-3 mt-2" align="center">
                     <img src="assets/images/usuarios/${row.foto}" class="img img-fluid img-thumbnail">
                  </div>
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-9 mt-2" align="center">
                     <div class="mt-1"><b>${row.nombre}</b></div>
                     <div class="mt-1">${row.celular ? '<i class="bi bi-phone"></i>'+ row.celular : ''}</div>
                     <div class="mt-1">${row.correo}</div>
                  </div>
               </div>
            </div>
            <div class="card-footer" align="right">
               <button class="btn btn-outline-secondary btn-redondo" type="button" onclick="ModalFormUsuario(${row.id},'${row.nombre}');" title="Editar">
                  <i class="bi bi-pencil"></i>
               </button>
               <button class="btn btn-outline-danger btn-redondo btnUsuariosDel ms-1" type="button" onclick="fn_eliminar_usuario(${i}, '${row.id}','${row.nombre}');" title="Eliminar">
                  <i class="bi bi-trash3"></i>
               </button>
            </div>
         </div>
      </div>`;
   });

   html+=`</div>`;
   $('#containerListUsuarios').html(html);
   closeLoad();
}

const fn_guardar_usuario = async (idUsuario) => {

   let nomUsuario    = $('#nomUsuario').val().trim();
   let usuario       = $('#usuario').val().trim();
   let contrasenia   = $('#contrasenia').val().trim();
   let celUsuario    = $('#celUsuario').val().trim();
   let mailUsuario   = $('#mailUsuario').val().trim();
   let perfilUsuario = $('#perfilUsuario').val().trim();

   if (nomUsuario == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del usuario',
         icon: 'warning'
      });
      $('#nomUsuario').focus();
      return;
   }
   else if (usuario == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el usuario',
         icon: 'warning'
      });
      $('#usuario').focus();
      return;
   }
   else if (idUsuario == 0 && contrasenia == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la contraseña',
         icon: 'warning'
      });
      $('#contrasenia').focus();
      return;
   }
   else if(mailUsuario != '') {
      if(!fnValidaMail(mailUsuario)) {
         ToastColor.fire({
            text: '¡Atención! Debes ingresar una cuenta de correo válida',
            icon: 'warning'
         });
         $('#mailUsuario').focus();
      return;
      }
   }
   else if (perfilUsuario == '0') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un perfil',
         icon: 'warning'
      });
      $('#perfilUsuario').focus();
      return;
   }

   const objUser = { func: 'guardar', idUsuario, nomUsuario, usuario, contrasenia, celUsuario, mailUsuario, perfilUsuario };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El usuario ' + nomUsuario + ' será registrado', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnSaveUser').prop('disabled', false);
      return;
   }

   $('#btnSaveUser').prop('disabled', true);
   let respuesta = await guardar_usuario(objUser);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Usuario guardado correctamente', '', 'success', 2500);
      $('#modalFormUsuarios').modal('hide');
      listar_usuarios();
      $('#btnSaveUser').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnSaveUser').prop('disabled', false);
      return;
   }

}

const fn_eliminar_usuario = async (indice, idUsuario, nomUsuario) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El usuario: ' + nomUsuario + ' será eliminado', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
    $('.btnUsuariosDel').prop('disabled', false);
    return;
  }

   $('.btnUsuariosDel').prop('disabled', true);
   let respuesta = await eliminar_usuario(idUsuario, nomUsuario);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Usuario eliminado correctamente', '', 'success', 2500);
      $('#cardUsuario'+idUsuario).remove();
      arrUsuarios = arrUsuarios.filter(usuario => usuario.id != idUsuario);
      $('.btnUsuariosDel').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnUsuariosDel').prop('disabled', false);
      return;
   }
}

const fn_buscar_usuario = () => {
   let busqueda = $('#inpBusquedaUsuario').val().trim();

   const filtrado = arrUsuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
   );
   pinta_listado_usuario(filtrado);
}

// Interfaces
window.TabUsuarios          = TabUsuarios;
window.ModalFormUsuario     = ModalFormUsuario;
window.ModalLogsMovimientos = ModalLogsMovimientos;
// Funciones
window.fn_eliminar_usuario  = fn_eliminar_usuario;
window.fn_guardar_usuario   = fn_guardar_usuario;
window.fn_buscar_usuario    = fn_buscar_usuario;
window.fn_consultar_log     = fn_consultar_log;
