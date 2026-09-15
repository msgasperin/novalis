import { valida_login, cierra_sesion } from "./LoginServices.js";

const login_portal = async () => {
  let user        = $('#inputUsuario').val().trim();
  let pass        = $('#inputPassword').val().trim();
  let tipoCliente = $('#tipo_cliente').val().trim();
  let fechaNac    = $('#inputFechaNac').val().trim();
  let csrf        = $('#csrfTokenPortal').val();

  if (user == '') {
    console.log('Hola');
    ToastColor.fire({
      text: '¡Atención! Debes ingresar un nombre de usuario',
      icon: 'warning',
      position: 'top',
      timerProgressBar: false
    });
    $('#inputUsuario').focus();
    return;
  } 
  else if (pass == '') {
    ToastColor.fire({
      text: '¡Atención! Debes ingresar tu contraseña',
      icon: 'warning',
      position: 'top',
      timerProgressBar: false
    });
    $('#inputPassword').focus();
    return;
  }
  else if (tipoCliente == 'paciente' && fechaNac == '') {
    ToastColor.fire({
      text: '¡Atención! Debes ingresar la fecha de nacimiento',
      icon: 'warning',
      position: 'top',
      timerProgressBar: false
    });
    $('#inputFechaNac').focus();
    return;
  }

  $('#btnLogin').prop('disabled',true);
  let res = await valida_login(user, pass, tipoCliente, fechaNac, csrf);
  if(res.estatus == 200) {
    showMessageSwalTimer('Bienvenido al equipo', 'NovaLIS', 'success', 2500);
    redireccionar("admin", 1000);
  }
  else if(res.estatus == 202) {
    showMessageSwalTimer('Usuario no encontrado', '', 'info', 2500);
    $('#btnLogin').prop('disabled',false);
    return;
  }
  else if(res.estatus == 202) {
    showMessageSwalTimer('Debes ingresar usuario y contraseña', '', 'info', 2500);
    $('#btnLogin').prop('disabled',false);
    return;
  }
  else if (res.estatus == 429) { 
    showMessageSwal('Acceso bloqueado', res.mensaje, 'error');
    $('#btnLogin').prop('disabled', true);
  }
  else {
    showMessageSwal('Ocurrio un error: ', res.mensaje, 'error');
    $('#btnLogin').prop('disabled',false);
  }
}

const cerrar_sesion = async () => {
  
  let clienteMasg = $('#clienteMasg').val();
  const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se cerrará la sesión', 'question', 'Sí, cerrar', 'Cancelar');
   
  if (!res.result) {
    return;
  }

  let respuesta = await cierra_sesion();
  if(respuesta.estatus == 200) {
    showMessageSwalTimer('Sesión finalizada correctamente', '', 'success', 2500);
    redireccionar("inicio", 1000);
  }
  else {
    showMessageSwal('Ocurrio un error: ', res.mensaje, 'error');
  }
}

const ver_password = (campo, icon) => {
  var input = document.getElementById(campo);
  var tipo = input.getAttribute("type");
  if (tipo == 'password') {
    input.setAttribute('type', 'text');
    $('#eyePassword').html('<i class="bi bi-eye"></i>');
  } else {
    input.setAttribute('type', 'password');
    $('#' + icon).html('<i class="bi bi-eye-slash"></i>');
  }
}

const redireccionar = (dir, tiempo) => {
  setTimeout("location.href='" + dir + "'", tiempo);
}

window.login_portal   = login_portal;
window.cerrar_sesion  = cerrar_sesion;
window.ver_password   = ver_password;
window.redireccionar  = redireccionar;