<?php
	//ini_set('session.cookie_secure', 1);     // solo HTTPS
	ini_set('session.cookie_httponly', 1);   // no accesible desde JS
	ini_set('session.cookie_samesite', 'Strict'); // bloquea CSRF adicional
	session_start();
	require("../api/config/seguridad.php");
	header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
	header( "Last-Modified: ". gmdate("D,dMYH:i:s"). " GMT" );
	header( "Cache-Control: no-cache, must-revalidate" );
	header( "Pragma: no-cache" );
?>
<!DOCTYPE html>
<html lang="es">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>:: Discursos ::</title>
		<!-- CSS -->
		<link rel="shortcut icon" href="assets/images/favicon.png"/>
		<link rel="stylesheet" type="text/css" href="assets/lib/sweetAlert2/sweetalert2.min.css"/>
		<link rel="stylesheet" type="text/css" href="assets/lib/bootstrap-5.3.2/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="assets/css/datatables_modify.css?x=<?php echo time();?>" />
		<link rel="stylesheet" type="text/css" href="assets/css/toast.css" />
		<link rel="stylesheet" href="assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
		<link rel="stylesheet" href="assets/lib/select2/select2.min.css" />
		<link rel="stylesheet" href="assets/lib/select2/select2-bootstrap-5-theme.min.css" />
		<link rel="stylesheet" href="assets/lib/jquery-ui-1.14.0/jquery-ui.css" />
		<link rel="stylesheet" href="assets/lib/DataTables/datatables.css" />
		<link rel="stylesheet" type="text/css" href="assets/css/bs5_personalizado.css" />
		<link rel="stylesheet" type="text/css" href="assets/css/styles.css?x=<?php echo time();?>" />
		<link rel="stylesheet" type="text/css" href="assets/css/menu.css?x=<?php echo time();?>" />
	</head>
	<body onload="opcionActive('opcionEvaluaciones'), TabEvaluaciones();">
		<?php require("menu_cliente.php")	?>
		<div class="container-main">
			<div id="containerMain"></div>
			<div id="modalAdmin"></div>
			<div id="modalAdminExt"></div>
			<div id="modalAdminExt2"></div>
			<div id="modalAdminExt3"></div>
			<div id="modalAdminExt4"></div>
			<div id="modalAdminExt5"></div>
			<div id="modalAdminDocs"></div>
			<div id="modalLoader"></div>
			<input type="hidden" id="perfilUs"  value="<?php echo $_SESSION["perfil"]; ?>" /> 
		</div>

		<div class="modal fade" id="modalLoading" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" style="z-index: 9999 !important;">
			<div class="modal-dialog modal-fullscreen">
				<div class="modal-content modal-loading">
					<div class="modal-body" align="center">
						<div class="container-loader mt-load">
							<div class="loader3"></div>
							<div class="align-middle text-white mt-2" id="mensajeLoading"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<script src="assets/lib/jquery-3.7.1.min.js"></script>
		<script src="assets/lib/jquery-ui-1.14.0/jquery-ui.js"></script>
		<script src="assets/lib/sweetAlert2/sweetalert2.min.js"></script>
		<script src="assets/lib/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>
		<script src="assets/lib/select2/select2.min.js"></script>
		<script src="assets/lib/DataTables/datatables.min.js"></script>
	
		<script type="module" src="components/globals.js?<?=time()?>"></script>
		<script type="module" src="components/Login/Login.js?<?=time()?>"></script>
		<script type="module" src="components/Menu/Menu.js?<?=time()?>"></script>
		<script type="module" src="components/Evaluaciones/Evaluaciones.js?<?=time()?>"></script>
		<script type="module" src="components/Clientes/Clientes.js?<?=time()?>"></script>
		<script type="module" src="components/Reportes/Reportes.js?<?=time()?>"></script>
		<script type="module" src="components/Usuarios/Usuarios.js?<?=time()?>"></script>
		<script type="module" src="components/Trabajadores/Trabajador.js?<?=time()?>"></script>
		<script type="module" src="components/Resultados/Resultados.js?<?=time()?>"></script>
		<script type="module" src="components/Programa/Programa.js?<?=time()?>"></script>
		<script type="module" src="components/Implementacion/Implementacion.js?<?=time()?>"></script>
		<script>
			$(document).on('select2:open', function() {
				let input = document.querySelector('.select2-container--open .select2-search__field');
				if (input) input.focus();
			});
		</script>
	</body>
</html>
