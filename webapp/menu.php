<?php
  $host = $_SERVER['HTTP_HOST'];
  $parts = explode('.', $host);
  // Si hay al menos 3 partes (ej. labxyz.novalis.com), tomamos el subdominio
  $subDominio = (count($parts) >= 3) ? $parts[0] : 'default';
  $subDominio = 'labdemo'; // Borrar es solo para pruebas en el cel
  $ruta       = '../api/assets/'.$subDominio.'/images/logo.png';
?>
<div class="row fondo-azul-1 header-top">
  <div class="col-xl-3 col-lg-3 col-md-5 col-sm-5 col-7 p-2 text-sm-start text-center">
    <img src="assets/images/logo_text_2.webp" class="img-logo me-sm-4 me-2">
    <img src="<?= $ruta; ?>" class="img-logo-cliente">
  </div>
  
  <div class="col-xl-9 col-lg-9 col-sm-7 col-5 text-end">  
    <!-- Contenedor Flex Principal (Visible siempre) -->
    <div class="d-flex align-items-center justify-content-end gap-2 p-2 mt-0 mt-sm-2">
      
      <!-- Info del Usuario (Solo visible en pantallas XL en adelante) -->
      <div class="d-none d-xl-block text-white text-end lh-sm me-2">
        <div class="fs-8 fw-semibold">
          <i class="bi bi-person-circle fs-6 me-1"></i><?php echo $_SESSION["nombre"] ?>
        </div>
        <div class="fs-8 text-white-50"><?php echo $_SESSION["perfil"] ?></div>
      </div>

      <!-- Divisor vertical (Solo visible en XL) -->
      <div class="vr text-white opacity-50 d-none d-xl-block me-1" style="height: 25px;"></div>

      <!-- Botón Ayuda (Visible en móvil y escritorio) -->
      <a href="ayuda" class="btn btn-outline-secondary shadow-sm btn-redondo text-white fs-8" title="Centro de Ayuda / Manual" target="_blank">
        <i class="bi bi-question-circle-fill fs-7"></i> <span class="d-none d-md-inline ms-1">Ayuda</span>
      </a>

      <!-- Botón Salir (Visible en móvil y escritorio) -->
      <button class="btn btn-danger shadow-sm btn-redondo text-white fs-8" id="btnLogout" title="Cerrar sesión" onclick="fn_cerrar_sesion();">
        <i class="bi bi-power fs-7"></i> <span class="d-none d-md-inline ms-1">Salir</span>
      </button>

      <!-- Menú Hamburguesa para Móviles/Tablets (Menor a XL) -->
      <button class="btn btn-outline-light d-block d-xl-none ms-3" onclick="muestraMenu(1);">
        <i class="bi bi-list fs-7"></i>
      </button>
    </div>
  </div>

</div>

<div class="row">
  <div class="col-12">
    <div class="overlay-menu m-responsive">
      <div class="side-menu wm-responsive">
        <div class="row mt-4">
          <div class="col-8 offset-1 d-lg-none mt-3 text-white">
            <div class="fs-6">&nbsp;<?php echo $_SESSION["nombre"] ?></div>
            <div class="fs-7">&nbsp;<?php echo $_SESSION["perfil"] ?></div>
          </div>
          <div class="col-1 d-lg-none text-white mt-3" onclick="muestraMenu(2);">
            <i class="bi bi-x-lg"></i>
          </div>
        </div>
        <div class="mt-cel">

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE' || $_SESSION["perfil"] == 'RECEPCION') { ?>
            <div class="opciones_menu align-menu" id="opcionRecepcion" onclick="opcionActive('opcionRecepcion'), TabRecepcion(), cerrarMenu();">
              <i class="bi bi-clipboard-minus icon-menu"></i>
              <div>Recepción</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE' || $_SESSION["perfil"] == 'QUIMICO') { ?>
            <div class="opciones_menu align-menu" id="opcionBandejas" onclick="opcionActive('opcionBandejas'), TabBandejas(), cerrarMenu();">
              <i class="bi bi-card-checklist icon-menu"></i>
              <div>Bandejas Operativas</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE' || $_SESSION["perfil"] == 'RECEPCION') { ?>
            <div class="opciones_menu align-menu" id="opcionPacientes" onclick="opcionActive('opcionPacientes'), TabPacientes(), cerrarMenu();">
              <i class="bi bi-people icon-menu"></i>
              <div>Pacientes</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE' || $_SESSION["perfil"] == 'RECEPCION') { ?>
            <div class="opciones_menu align-menu" id="opcionConvenio" onclick="opcionActive('opcionConvenio'), TabConvenios(), cerrarMenu();">
              <i class="bi bi-building-gear icon-menu"></i>
              <div>Convenios</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionReportes" onclick="opcionActive('opcionReportes'), TabReportes(), cerrarMenu();">
              <i class="bi bi-bar-chart icon-menu"></i>
              <div>Reportes e Indicadores</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionEstudios" onclick="opcionActive('opcionEstudios'), TabEstudios(), cerrarMenu();">
              <i class="bi bi-list-columns icon-menu"></i>
              <div>Paquetes Estudios</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR') { ?>
          <div class="opciones_menu align-menu menu-con-submenu" id="opcionConfiguracion" onclick="opcionActive('opcionConfiguracion'), mostrarSubmenu(event, 'configuracion');">
            <i class="bi bi-gear icon-menu"></i>
            <div>Configuración Administración</div>
          </div>    
          <?php } ?>
          
          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR') { ?>
          <div class="opciones_menu align-menu menu-con-submenu" id="opcionPortal" onclick="opcionActive('opcionPortal'), mostrarSubmenu(event, 'portal');">
            <i class="bi bi-browser-chrome icon-menu"></i>
            <div>Gestión del Portal</div>
          </div>    
          <?php } ?>

        </div>                
      </div>  
    </div>  
  </div>
</div>


<div id="globalSubmenu" class="global-submenu"></div>
<!-- cierre menu lateral -->