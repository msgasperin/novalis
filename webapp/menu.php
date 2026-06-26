  
<div class="row fondo-azul-1 header-top">
  <div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-5 p-2 mt-2" align="center">
    <img src="assets/images/logo_text_blanco.png" class="img-logo"></img>
  </div>
  <div class="col-xl-10 col-lg-10 col-md-9 col-sm-9 col-7 fs-1" align="right">
    <div class="p-3">
      <div class="d-none d-xl-block d-xxl-block text-dark text-white">
        <div class="fs-8"><i class="bi bi-person-circle fs-6">&nbsp;</i> <?php echo $_SESSION["nombre"] ?></div>
        <div class="fs-8"><?php echo $_SESSION["perfil"] ?></div>
      </div>
      <div class="d-block d-xl-none d-xxl-none text-white" onclick="muestraMenu(1);">
        <i class="bi bi-list"></i>
      </div>
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

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionRecepcion" onclick="opcionActive('opcionRecepcion'), TabRecepcion(), cerrarMenu();">
              <i class="bi bi-clipboard-minus icon-menu"></i>
              <div>Recepción</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionLaboratorio" onclick="opcionActive('opcionLaboratorio'), TabRecepcion(), cerrarMenu();">
              <i class="bi bi-card-checklist icon-menu"></i>
              <div>Bandejas Operativas</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionFinanciero" onclick="opcionActive('opcionFinanciero'), TabRecepcion(), cerrarMenu();">
              <i class="bi bi-currency-dollar icon-menu"></i>
              <div>Gestión Financiera</div>
            </div>
          <?php } ?>
          
          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionPacientes" onclick="opcionActive('opcionPacientes'), TabClientes(), cerrarMenu();">
              <i class="bi bi-people icon-menu"></i>
              <div>Pacientes</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionConvenios" onclick="opcionActive('opcionConvenios'), TabClientes(), cerrarMenu();">
              <i class="bi bi-building-gear icon-menu"></i>
              <div>Empresas</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionConvenios" onclick="opcionActive('opcionConvenios'), TabClientes(), cerrarMenu();">
              <i class="bi bi-person-square icon-menu"></i>
              <div>Doctores</div>
            </div>
          <?php } ?>

          <?php if($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') { ?>
            <div class="opciones_menu align-menu" id="opcionConvenios" onclick="opcionActive('opcionConvenios'), TabClientes(), cerrarMenu();">
              <i class="bi bi-list-columns icon-menu"></i>
              <div>Paquetes  Estudios</div>
            </div>
          <?php } ?>

          <div class="opciones_menu align-menu menu-con-submenu" id="opcionConfiguracion" onclick="opcionActive('opcionConfiguracion'), mostrarSubmenu(event, 'configuracion');">
            <i class="bi bi-gear icon-menu"></i>
            <div>Configuración Administración</div>
          </div>          

          <div class="opciones_menu align-menu" id="opcionSalir" onclick="fn_cerrar_sesion();">
            <i class="bi bi-box-arrow-left icon-menu"></i>
            <div>Salir</div>
          </div>

        </div>                
      </div>  
    </div>  
  </div>
</div>


<div id="globalSubmenu" class="global-submenu"></div>
<!-- cierre menu lateral -->