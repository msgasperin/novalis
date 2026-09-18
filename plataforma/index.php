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
		<link rel="stylesheet" type="text/css" href="../webapp/assets/css/bs5_personalizado.css" />

      <style>
			
         body {
				background: radial-gradient(
					100% 650px at 50% 0%,
					rgba(102, 204, 255, 0.08) 0%,
					rgba(248, 250, 252, 1) 100%
				);
			}


         /* Barra de Filtros con tono gris diferenciado */
         .filter-bar {
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
         }

         /* Tarjeta de Orden / Solicitud con sombra y paddings corregidos */
         .order-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
         }

         .order-card:hover {
            border-color: #cbd5e1;
            box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
            transform: translateY(-3px);
         }

         .order-card .card-header-custom {
            background-color: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 1.25rem;
            position: relative;
         }

         /* Indicador lateral de estado en el header de la card */
         .status-indicator {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
         }
         .status-indicator.ready { background-color: #10b981; }
         .status-indicator.pending { background-color: #f59e0b; }

         /* Avatar e Iconos */
         .avatar-icon {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            background-color: #ebf5ff;
            color: #0d6efd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
         }

         /* Badges de Estado */
         .status-badge-success {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
         }

         .status-badge-pending {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
         }

         .study-pill {
            background-color: #f8fafc;
            color: #475569;
            font-size: 0.825rem;
            padding: 0.4em 0.75em;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
         }

      </style>
   </head>
   <body>

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
                  <span class="badge bg-light text-secondary border rounded-pill extra-small" id="lblTipoRol">Cuenta Convenio</span>
               </div>
               <div class="vr d-none d-sm-block my-2"></div>
               <button class="btn btn-light btn-sm text-danger fw-semibold d-flex align-items-center gap-1 border shadow-sm" id="btnLogout" title="Cerrar sesión">
                  <i class="bi bi-power"></i> <span class="d-none d-md-inline">Salir</span>
               </button>
            </div>

         </div>
      </header>

      <!-- Contenido Principal -->
      <main class="container-fluid px-4 pb-5">

         <!-- Panel de Filtros Destacado (Gris Claro) -->
         <div class="filter-bar p-3 shadow-sm mb-4 bg-white">
            <form id="frmFiltros" class="row g-2 align-items-center">
               
               <!-- Búsqueda Principal -->
               <div class="col-12 col-lg-5">
                  <div class="input-group">
                     <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                     <input type="text" class="form-control border-start-0 ps-0" id="txtBusqueda" placeholder="Buscar por Folio, Paciente o Estudio...">
                  </div>
               </div>

               <!-- Rangos de Fecha -->
               <div class="col-6 col-sm-4 col-lg-2">
                  <input type="date" class="form-control text-muted" id="fDesde" title="Fecha inicial">
               </div>
               <div class="col-6 col-sm-4 col-lg-2">
                  <input type="date" class="form-control text-muted" id="fHasta" title="Fecha final">
               </div>

               <!-- Filtro Estatus -->
               <div class="col-12 col-sm-4 col-lg-2" id="secFiltroEspecial">
                  <select class="form-select text-muted" id="cmbEstado">
                     <option value="">Todos los estatus</option>
                     <option value="COMPLETO">Listos para descarga</option>
                     <option value="PROCESO">En proceso</option>
                  </select>
               </div>

               <!-- Botón Buscar -->
               <div class="col-12 col-lg-1 d-grid">
                  <button type="button" class="btn btn-primary bg-primary-dark fw-semibold shadow-sm rounded-5" id="btnFiltrar">
                     Filtrar
                  </button>
               </div>

            </form>
         </div>

         <!-- Grid de Solicitudes (Cards) -->
         <div class="row g-4" id="containerSolicitudes">

            <!-- CARD 1: Resultado Listo -->
            <div class="col-12 col-md-6 col-xl-4">
               <div class="order-card h-100 d-flex flex-column">
                  
                  <!-- Encabezado con Indicador de Estado -->
                  <div class="card-header-custom d-flex justify-content-between align-items-center">
                     <div class="status-indicator ready"></div>
                     <div class="ps-2">
                        <span class="text-uppercase text-muted fw-bold extra-small d-block">Folio Solicitud</span>
                        <span class="fw-bold text-dark fs-6">#100293</span>
                     </div>
                     <span class="badge status-badge-success rounded-pill px-3 py-1.5 fw-semibold small d-flex align-items-center gap-1">
                        <i class="bi bi-check-circle-fill"></i> Listo
                     </span>
                  </div>

                  <!-- Cuerpo de la Card con Padding Amplio (p-4) -->
                  <div class="card-body p-4 d-flex flex-column justify-content-between gap-3">
                     
                     <!-- Datos del Paciente -->
                     <div>
                        <h6 class="fw-bold text-dark mb-1">García López, Maria Luisa</h6>
                        <div class="text-muted small mb-2">
                           <i class="bi bi-person me-1"></i>Femenino, 34 años
                        </div>
                        <div class="text-muted extra-small">
                           <i class="bi bi-calendar3 me-1"></i> Registrado: 17/09/2026 - 08:30 AM
                        </div>
                     </div>

                     <hr class="my-0 text-black-50 opacity-10">

                     <!-- Lista de Estudios -->
                     <div>
                        <span class="extra-small text-muted fw-bold d-block mb-2">ESTUDIOS SOLICITADOS</span>
                        <div class="d-flex flex-wrap gap-1.5">
                           <span class="study-pill">Biometría Hemática</span>
                           <span class="study-pill">Química Sanguínea 6</span>
                        </div>
                     </div>

                     <!-- Acción de Descarga -->
                     <div class="pt-2">
                        <button class="btn btn-outline-danger btn-sm w-100 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm">
                           <i class="bi bi-file-earmark-pdf-fill fs-6"></i> Descargar Resultados (PDF)
                        </button>
                     </div>

                  </div>
               </div>
            </div>

            <!-- CARD 2: En Proceso -->
            <div class="col-12 col-md-6 col-xl-4">
               <div class="order-card h-100 d-flex flex-column">
                  
                  <div class="card-header-custom d-flex justify-content-between align-items-center">
                     <div class="status-indicator pending"></div>
                     <div class="ps-2">
                        <span class="text-uppercase text-muted fw-bold extra-small d-block">Folio Solicitud</span>
                        <span class="fw-bold text-dark fs-6">#100298</span>
                     </div>
                     <span class="badge status-badge-pending rounded-pill px-3 py-1.5 fw-semibold small d-flex align-items-center gap-1">
                        <i class="bi bi-hourglass-split"></i> En proceso
                     </span>
                  </div>

                  <div class="card-body p-4 d-flex flex-column justify-content-between gap-3">
                     
                     <div>
                        <h6 class="fw-bold text-dark mb-1">Hernández Ruiz, Roberto</h6>
                        <div class="text-muted small mb-2">
                           <i class="bi bi-person me-1"></i>Masculino, 52 años
                        </div>
                        <div class="text-muted extra-small">
                           <i class="bi bi-calendar3 me-1"></i> Registrado: 17/09/2026 - 10:15 AM
                        </div>
                     </div>

                     <hr class="my-0 text-black-50 opacity-10">

                     <div>
                        <span class="extra-small text-muted fw-bold d-block mb-2">ESTUDIOS SOLICITADOS</span>
                        <div class="d-flex flex-wrap gap-1.5">
                           <span class="study-pill">Examen General de Orina</span>
                           <span class="study-pill">Perfil Lipídico</span>
                        </div>
                     </div>

                     <div class="pt-2">
                        <button class="btn btn-light text-muted btn-sm w-100 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 border" disabled>
                           <i class="bi bi-lock-fill"></i> Resultados Pendientes
                        </button>
                     </div>

                  </div>
               </div>
            </div>

            <!-- CARD 3: Resultado Listo -->
            <div class="col-12 col-md-6 col-xl-4">
               <div class="order-card h-100 d-flex flex-column">
                  
                  <div class="card-header-custom d-flex justify-content-between align-items-center">
                     <div class="status-indicator ready"></div>
                     <div class="ps-2">
                        <span class="text-uppercase text-muted fw-bold extra-small d-block">Folio Solicitud</span>
                        <span class="fw-bold text-dark fs-6">#100285</span>
                     </div>
                     <span class="badge status-badge-success rounded-pill px-3 py-1.5 fw-semibold small d-flex align-items-center gap-1">
                        <i class="bi bi-check-circle-fill"></i> Listo
                     </span>
                  </div>

                  <div class="card-body p-4 d-flex flex-column justify-content-between gap-3">
                     
                     <div>
                        <h6 class="fw-bold text-dark mb-1">Morales Castro, Alejandro</h6>
                        <div class="text-muted small mb-2">
                           <i class="bi bi-person me-1"></i>Masculino, 28 años
                        </div>
                        <div class="text-muted extra-small">
                           <i class="bi bi-calendar3 me-1"></i> Registrado: 16/09/2026 - 04:45 PM
                        </div>
                     </div>

                     <hr class="my-0 text-black-50 opacity-10">

                     <div>
                        <span class="extra-small text-muted fw-bold d-block mb-2">ESTUDIOS SOLICITADOS</span>
                        <div class="d-flex flex-wrap gap-1.5">
                           <span class="study-pill">Prueba Rápida Antígenos</span>
                        </div>
                     </div>

                     <div class="pt-2">
                        <button class="btn btn-outline-danger btn-sm w-100 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm">
                           <i class="bi bi-file-earmark-pdf-fill fs-6"></i> Descargar Resultados (PDF)
                        </button>
                     </div>

                  </div>
               </div>
            </div>

         </div>

      </main>

      <script src="../webapp/assets/lib/jquery-3.7.1.min.js"></script>
      <script src="../webapp/assets/lib/jquery-ui-1.14.0/jquery-ui.js"></script>
      <script src="../webapp/assets/lib/sweetAlert2/sweetalert2.min.js"></script>
      <script src="../webapp/assets/lib/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>
      <script src="../webapp/assets/lib/select2/select2.min.js"></script>
      <script src="../webapp/assets/lib/DataTables/datatables.min.js"></script>
   
      <script type="module" src="../webapp/components/globals.js?<?=time()?>"></script>
      <script type="module" src="components/Login/Login.js?<?=time()?>"></script>
   
   </body>
</html>