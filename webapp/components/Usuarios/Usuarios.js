import { guardar_usuario, obtiene_usuarios, eliminar_usuario } from "./UsuariosServices.js";

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

const ModalFormUsuario = (idUsuario, nomUsuario) => {

   let usuarioSeleccionado = arrUsuarios.filter(usuario => usuario.id_usuario == idUsuario);

   let titulo;
   let nombre   = '';
   let usuario  = '';
   let correo   = '';
   let perfil   = 'NA';
   let sucursal = 0;
   let disabled = '';

   if(idUsuario > 0) {
      titulo      = 'Editar Usuario: '+ nomUsuario;
      nombre      = usuarioSeleccionado[0].nombre;
      usuario     = usuarioSeleccionado[0].usuario;
      correo      = usuarioSeleccionado[0].correo;
      perfil      = usuarioSeleccionado[0].perfil;
      sucursal    = usuarioSeleccionado[0].id_sucursal_fk;
      disabled    = 'disabled';
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
                     <input type="text" name="usuario" id="usuario" class="form-control" maxlength="50" ${disabled} value="${usuario}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Contraseña *</b>
                     <input type="text" name="contrasenia" id="contrasenia" class="form-control" maxlength="50" />
                  </div>
                  <div class="col-12 mt-3">
                     <b>Correo</b>
                     <input type="email" name="mailUsuario" id="mailUsuario" class="form-control" value="${correo}"/>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Perfil *</b>
                     <select name="perfilUsuario" id="perfilUsuario" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                        <option value="GERENTE">GERENTE</option>
                        <option value="QUIMICO">QUIMICO</option>
                        <option value="RECEPCION">RECEPCION</option>
                        <option value="VALIDADOR">VALIDADOR</option>
                     </select>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Sucursal *</b>
                     <select name="sucursalUsuario" id="sucursalUsuario" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Matriz</option>
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
      $('#sucursalUsuario').val(sucursal);
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
      <div class="col-12 col-sm-3 col-md-3 mt-2" id="cardUsuario${row.id_usuario}">
         <div class="card mb-3 shadow">
            <div class="card-body">
               <div class="row fs-8">
                  <div class="col-12 col-sm-2 mt-2 text-center">
                     <i class="bi bi-person-circle fs-4 text-secondary"></i>
                  </div>
                  <div class="col-12 col-sm-10 mt-2">
                     <div class="mt-1"><b>${row.nombre}</b></div>
                     <div><i class="bi bi-at fs-6"></i>${row.correo}</div>
                     <div class="text-muted fs-8">${row.perfil}</div>
                  </div>
               </div>
            </div>
            <div class="card-footer bg-white border-top-0 pb-2">
               <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormUsuario(${row.id_usuario},'${row.nombre}');">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarCliente" title="Eliminar" onclick="fn_eliminar_usuario(${row.id_usuario},'${row.nombre}');">
                     <i class="bi bi-trash"></i>
                  </button>               
               </div>
            </div>
         </div>
      </div>`;
   });

   html+=`</div>`;
   $('#containerListUsuarios').html(html);
   closeLoad();
}

const fn_guardar_usuario = async (idUsuario) => {

   let nomUsuario      = $('#nomUsuario').val().trim();
   let usuario         = $('#usuario').val().trim();
   let contrasenia     = $('#contrasenia').val().trim();
   let mailUsuario     = $('#mailUsuario').val().trim();
   let perfilUsuario   = $('#perfilUsuario').val().trim();
   let sucursalUsuario = $('#sucursalUsuario').val().trim();
   let msjAccion       = '';

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
   else if (perfilUsuario == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un perfil',
         icon: 'warning'
      });
      $('#perfilUsuario').focus();
      return;
   }
   else if (parseInt(sucursalUsuario) == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar una sucursal',
         icon: 'warning'
      });
      $('#sucursalUsuario').focus();
      return;
   }

   const objUser = { func: 'guardar', idUsuario, nomUsuario, usuario, contrasenia, mailUsuario, perfilUsuario, sucursalUsuario };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información del usuario ' + nomUsuario + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
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
      
      idUsuario > 0 ? msjAccion = 'Información actualizada' : msjAccion = 'Usuario guardado correctamente';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormUsuarios').modal('hide');
      listar_usuarios();
      $('#btnSaveUser').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnSaveUser').prop('disabled', false);
      return;
   }

}

const fn_eliminar_usuario = async (idUsuario, nomUsuario) => {
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
      arrUsuarios = arrUsuarios.filter(usuario => usuario.id_usuario != idUsuario);
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

// Funciones
window.fn_eliminar_usuario  = fn_eliminar_usuario;
window.fn_guardar_usuario   = fn_guardar_usuario;
window.fn_buscar_usuario    = fn_buscar_usuario;
