<?php
   //ini_set('session.cookie_secure', 1);     // solo HTTPS
   ini_set('session.cookie_httponly', 1);   // no accesible desde JS
   ini_set('session.cookie_samesite', 'Strict'); // bloquea CSRF adicional
   session_start();
   //require("api/config/seguridad.php");
   header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
   header( "Last-Modified: ". gmdate("D,dMYH:i:s"). " GMT" );
   header( "Cache-Control: no-cache, must-revalidate" );
   header( "Pragma: no-cache" );

	$host = $_SERVER['HTTP_HOST'];
   $parts = explode('.', $host);
   // Si hay al menos 3 partes (ej. labxyz.novalis.com), tomamos el subdominio
   $subdominio = (count($parts) >= 3) ? $parts[0] : 'default';

	$logo    = "../".$_SESSION["logoUrl"];
	$favicon = "../".$_SESSION["favicon"];
?>
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>:: <?= htmlspecialchars($_SESSION["nombreLab"]) ?> - Consulta de Resultados ::</title>
      <!-- CSS -->
		<link rel="shortcut icon" href="<?= htmlspecialchars($favicon) ?>"/>
		<link rel="stylesheet" type="text/css" href="../webapp/assets/lib/sweetAlert2/sweetalert2.min.css"/>
		<link rel="stylesheet" type="text/css" href="../webapp/assets/lib/bootstrap-5.3.2/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="../webapp/assets/css/toast.css" />
		<link rel="stylesheet" type="text/css" href="../webapp/assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
		<link rel="stylesheet" type="text/css" href="../webapp/assets/lib/jquery-ui-1.14.0/jquery-ui.css" />
		<link rel="stylesheet" type="text/css" href="../webapp/assets/lib/DataTables/datatables.css" />
      <link rel="stylesheet" type="text/css" href="assets/css/styles.css" />
   </head>
   
   <body onload="obtener_resultados_cliente();">
      <input type="hidden" id="tipoClientePortal" value="<?php echo $_SESSION["tipo_cliente"]; ?>">

      <!-- Header Superior con Resalte Inferior -->
      <header class="sticky-top p-3 mb-4 shadow-sm bg-white">
         <div class="container-fluid d-flex align-items-center justify-content-between">
            
            <!-- Branding -->
            <div class="d-flex align-items-center gap-3">
               <div>
                  <img src="<?= htmlspecialchars($logo) ?>" alt="<?= htmlspecialchars($_SESSION["nombreLab"]) ?>" height="40" class="me-2">
                  <span class="small text-muted fw-bold">Portal de Consulta de Resultados</span>
               </div>
            </div>

            <!-- Perfil / Usuario -->
            <div class="d-flex align-items-center gap-3">
               <div class="text-end d-none d-sm-block">
                  <div class="fw-bold text-dark small" id="lblUsuario"><?= htmlspecialchars($_SESSION["cliente"]) ?></div>
                  <span class="badge bg-light text-secondary border rounded-pill extra-small" id="lblTipoRol">
                     <?= $_SESSION["tipo_cliente"] === 'convenio' ? 'Cuenta Convenio' : 'Paciente' ?>
                  </span>
               </div>
               <div class="vr d-none d-sm-block my-2"></div>
               <button class="btn btn-light btn-sm text-danger fw-semibold d-flex align-items-center gap-1 border shadow-sm" id="btnLogout" title="Cerrar sesión">
                  <i class="bi bi-power"></i> <span class="d-none d-md-inline">Salir</span>
               </button>
            </div>

         </div>
      </header>

      <main class="container-fluid px-4 pb-5">

         <?php if($_SESSION["tipo_cliente"] == 'convenio') : ?>
            <div class="filter-bar p-3 shadow-sm mb-4 bg-white">
               <div class="row g-2 align-items-center">                  
                  <!-- Búsqueda Principal -->
                  <div class="col-12 col-lg-5">
                     <div class="input-group">
                        <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control border-start-0 ps-0" id="txtBusqueda" placeholder="Buscar por Folio, Paciente...">
                     </div>
                  </div>

                  <div class="col-6 col-sm-4 col-lg-2">
                     <input type="date" class="form-control text-muted" name="fDesde" id="fDesde" title="Fecha inicial" value="<?php echo date('Y-m-d'); ?>">
                  </div>
                  <div class="col-6 col-sm-4 col-lg-2">
                     <input type="date" class="form-control text-muted" name="fHasta" id="fHasta" title="Fecha final" value="<?php echo date('Y-m-d'); ?>">
                  </div>

                  <!-- Botón Buscar -->
                  <div class="col-12 col-lg-1 d-grid">
                     <button type="button" class="btn btn-primary bg-primary-dark fw-semibold shadow-sm rounded-5" id="btnFiltrar">
                        Filtrar
                     </button>
                  </div>

               </div>
            </div>
         <?php else: ?>
            <div class="card border-0 shadow-sm p-3 mb-4 bg-body-tertiary rounded-4">
               <div class="row g-3 align-items-center justify-content-between">
                  
                  <!-- Título de Sección con Indicador Visual -->
                  <div class="col-12 col-md-auto">
                     <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle bg-primary bg-opacity-10 p-2 d-flex align-items-center justify-content-center text-primary" style="width: 44px; height: 44px;">
                           <i class="bi bi-clock-history fs-5"></i>
                        </div>
                        <div>
                           <h5 class="fw-bold mb-0 text-dark">Historial de Estudios</h5>
                           <small class="text-muted extra-small d-block">
                              <i class="bi bi-sort-down me-1"></i>Mostrando desde el más reciente
                           </small>
                        </div>
                     </div>
                  </div>

                  <div class="col-12 col-md-5 col-lg-4">
                     <div class="input-group input-group-merge shadow-sm rounded-3 overflow-hidden">
                        <span class="input-group-text bg-white border-end-0 text-muted ps-3">
                           <i class="bi bi-search"></i>
                        </span>
                        <input type="text" id="txtFiltroPaciente" class="form-control border-start-0 ps-1 py-2 text-dark bg-white shadow-none" placeholder="Buscar por estudio o folio..." autocomplete="off" onkeyup="buscar_ordenes_arr_paciente();">
                     </div>
                  </div>

               </div>
            </div>
         <?php endif; ?>
            
         <div class="row g-4 mt-4" id="containerSolicitudes"></div>

      </main>

      <div id="modalAdminDocs"></div>

      <div class="modal fade" id="modalLoading" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" style="z-index: 9999 !important;">
			<div class="modal-dialog modal-fullscreen">
				<div class="modal-content modal-loading">
					<div class="modal-body" align="center">
						<div class="container-loader mt-load">
							<div class="loader"></div>
							<div class="align-middle text-white mt-2" id="mensajeLoading"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

      <script src="../webapp/assets/lib/jquery-3.7.1.min.js"></script>
      <script src="../webapp/assets/lib/jquery-ui-1.14.0/jquery-ui.js"></script>
      <script src="../webapp/assets/lib/sweetAlert2/sweetalert2.min.js"></script>
      <script src="../webapp/assets/lib/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>
      <script src="../webapp/assets/lib/select2/select2.min.js"></script>
      <script src="../webapp/assets/lib/DataTables/datatables.min.js"></script>
   
      <script type="module" src="../webapp/components/globals.js?<?=time()?>"></script>
      <script type="module" src="components/Login/Login.js?<?=time()?>"></script>
      <script type="module" src="components/Dashboard/Dashboard.js?<?=time()?>"></script>
   
   </body>
</html>