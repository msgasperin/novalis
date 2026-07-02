const cerrarMenu = () => {
  if(isMobile()) {
    muestraMenu(2);
  }
}

const submenus = {

  catPersonas: `
    <div onclick="fnPacientes()"> <i class="bi bi-person-badge-fill"></i> Pacientes</div>
    <div onclick="fnPersonal()"> <i class="bi bi-person-bounding-box"></i> Personal</div>`,

  configuracion: `
    <div onclick="TabSucursales()"><i class="bi bi-shop-window"></i> Sucursales</div>
    <div onclick="TabUsuarios()"><i class="bi bi-person-gear"></i> Personal</div>
    <div onclick="TabPrecios()"><i class="bi bi-currency-dollar"></i> Listas de precios</div>`
};

document.addEventListener("click", function(e) {
  let submenu = document.getElementById("globalSubmenu");
  if(!e.target.closest(".menu-con-submenu") && !e.target.closest("#globalSubmenu") ){
    submenu.style.display = "none";
  }
});

function mostrarSubmenu(event, menu){

    let submenu = document.getElementById("globalSubmenu");
    // si está abierto con el mismo menú → cerrar
    if(submenu.dataset.menu === menu && submenu.style.display === "block") {
      submenu.style.display = "none";
      submenu.dataset.menu = "";
      return;
    }

    // cargar contenido
    submenu.innerHTML = submenus[menu];
    submenu.dataset.menu = menu;

    let rect = event.currentTarget.getBoundingClientRect();

    if(window.innerWidth <= 768) {
      submenu.style.left = rect.left + "px";
      submenu.style.top = (rect.bottom + 5) + "px";
    }
    else {
      submenu.style.left = (rect.right + 5) + "px";
      submenu.style.top = rect.top + "px";
    }

    submenu.style.display = "block";
}

const muestraMenu = (opcion) => {
  $('.overlay-menu').appendTo('body');
  if (opcion == 1 && isMobile()) {
    $(".overlay-menu").css("height", "100%");
    $(".overlay-menu").css("opacity", "1");
    $(".side-menu").css("left", "0");
    $(".overlay-menu").css("opacity", "1");
  }
  else {
    $(".overlay-menu").css("height", "");
    $(".overlay-menu").css("opacity", "");
    $(".side-menu").css("left", "");
  }
  $(".overlay-menu").css("transition", "opacity 1s ease-out 0s");
  $(".side-menu").css("transition", "left 0.2s ease 0s");
}

const link = (tipo, enlace) => {
  if (tipo == 1) {
    window.open(enlace);
  } else {
    setTimeout("location.href='" + enlace + "'");
  }
}

const opcionActive = (opcion) => {
  $('.opciones_menu').removeClass("opciones_menu_active");
  $('#' + opcion).addClass("opciones_menu_active");  
}

const activarLoad = (mensajeInicial) => {
  $('#modalLoading').modal('show');
  $('#mensajeLoading').html(mensajeInicial);
}


const closeLoad = (mensajeFinal) => {
  $('#mensajeLoading').html(mensajeFinal);
  setTimeout(() => {
    $('#modalLoading').modal('hide');
  }, 500);
  let submenu = document.getElementById("globalSubmenu");
  submenu.style.display = "none";
}

const isMobile = () => {
  return /android|iphone|ipad|ipod|windows phone|mobile/i.test(navigator.userAgent);
}


window.cerrarMenu     = cerrarMenu;
window.muestraMenu    = muestraMenu;
window.link           = link;
window.opcionActive   = opcionActive;
window.activarLoad    = activarLoad;
window.closeLoad      = closeLoad;
window.isMobile       = isMobile;
window.mostrarSubmenu = mostrarSubmenu;