import { valida_login, cerrar_sesion } from "./LoginServices.js";

const fn_login = async () => {
  let user = $.trim($('#userLogin').val());
  let pass = $.trim($('#passwordLogin').val());
  let csrf = $('#csrfToken').val();

  if (user == '') {
    ToastColor.fire({
      text: '¡Atención! Debes ingresar un nombre de usuario',
      icon: 'warning',
      position: 'top',
      timerProgressBar: false
    });
    $('#userLogin').focus();
    return;
  } else if (pass == '') {
    ToastColor.fire({
      text: '¡Atención! Debes ingresar tu contraseña',
      icon: 'warning',
      position: 'top',
      timerProgressBar: false
    });
    $('#passwordLogin').focus();
    return;
  }

  $('#btnLogin').prop('disabled',true);
  let res = await valida_login(user, pass, csrf);
  if(res.estatus == 200) {
    showMessageSwalTimer('Bienvenido al equipo', 'NovaLIS', 'success', 2500);
    redireccionar("webapp/admin", 1000);
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

const fn_cerrar_sesion = async () => {
  
  let clienteMasg = $('#clienteMasg').val();
  const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se cerrará la sesión', 'question', 'Sí, cerrar', 'Cancelar');
   
  if (!res.result) {
    return;
  }

  let respuesta = await cerrar_sesion();
  if(respuesta.estatus == 200) {
    showMessageSwalTimer('Sesión finalizada correctamente', '', 'success', 2500);
    redireccionar("../inicio?cliente_masg="+clienteMasg, 1000);
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

window.fn_login         = fn_login;
window.fn_cerrar_sesion = fn_cerrar_sesion;
window.ver_password     = ver_password;
window.redireccionar    = redireccionar;