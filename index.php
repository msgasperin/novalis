<?php
	//ini_set('session.cookie_secure', 1);     // solo HTTPS
	ini_set('session.cookie_httponly', 1);   // no accesible desde JS
	ini_set('session.cookie_samesite', 'Strict'); // bloquea CSRF adicional
	session_start();
	$_SESSION["cliente_masg"] = $_GET["cliente_masg"];
		// ── CSRF ──────────────────────────────────────────────
	if (empty($_SESSION['csrf_token'])) {
		$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
	}
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
	  	<title>:: NovaLIS ::</title>
	  	<!-- CSS -->
	  	<link rel="shortcut icon" href="webapp/assets/images/favicon.png"/>
	  	<link rel="stylesheet" type="text/css" href="webapp/assets/lib/bootstrap-5.3.2/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="webapp/assets/lib/sweetAlert2/sweetalert2.min.css" />
	  	<link rel="stylesheet" type="text/css" href="webapp/assets/css/styles.css?x=<?php echo time();?>" />
		<link rel="stylesheet" type="text/css" href="webapp/assets/css/toast.css?x=<?php echo time();?>" />
		<link rel="stylesheet" href="webapp/assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
	</head>
	<body class="fondo_index">
		<section>
			<div class="row">
				<div class="col-12">
					<div class="row">
						<div class="col-xl-4 offset-xl-4 col-lg-6 offset-lg-3 col-md-6 offset-md-3 col-sm-10 offset-sm-1 col-10 offset-1" align="center">
							<form id="formLogin">
								<input type="hidden" id="csrfToken" value="<?php echo $_SESSION['csrf_token']; ?>">
								<div class="card-login mt-index">
									<div class="card-login-body">
										
										<div class="row mb-2">
											<div class="col-12 text-center">
												<img src="webapp/assets/images/logo.png" class="img img-login"/>
											</div>
										</div>

										<div class="row" align="left">
											<div class="col-12 mt-4 mb-2">
												<label for="userLogin" class="form-label fs-6"><i class="bi bi-person"></i> Usuario</label>
												<input type="text" autocapitalize="none" autocorrect="off" spellcheck="false" class="form-control form-control-lg rounded-1" id="userLogin" placeholder="..." value="">
											</div>
											<div class="col-12 mt-4">
												<label for="passwordLogin" class="form-label fs-6"><i class="bi bi-lock"></i> Contraseña</label>
												<div class="input-group mb-3">
													<input type="password" class="form-control form-control-lg rounded-1" id="passwordLogin" placeholder="***" value="">
													<span class="input-group-text pointer" id="eyePassword" onclick="ver_password('passwordLogin','eyePassword');"><i class="bi bi-eye-slash"></i></span>
												</div>
											</div>
											<div class="col-12 mt-4 mb-4">
												<div class="d-grid gap-2" align="center">
													<button type="button" class="btn btn-lg btn-dark btn-lib btn-redondo" id="btnLogin" onclick="fn_login();">
														Iniciar sesión
													</button>
												</div>
											</div>
										</div>

										<div class="row">
											<div class="col-12 mt-4 text-secondary fs-8" align="right">
												© Akuris - Laboratory Information System <br>Todos los derechos reservados
											</div>
										</div>

									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
		<div id="modalIndex"></div>
	
		<script src="webapp/assets/lib/jquery-3.7.1.min.js"></script>
		<script src="webapp/assets/lib/sweetAlert2/sweetalert2.min.js"></script>
		<script src="webapp/assets/lib/bootstrap-5.3.2/js/bootstrap.js"></script>
		<script type="module" src="webapp/components/globals.js?x=<?=time()?>"></script>
		<script type="module" src="webapp/components/Login/LoginServices.js?x=<?php echo time();?>"></script>
		<script type="module" src="webapp/components/Login/Login.js?x=<?php echo time();?>"></script>
		<script>
			/*
			window.addEventListener("keydown",(e) => {
				if(e.keyCode === 13) {
					fn_login();
				}
			});
			*/
		</script>
	</body>
</html>

