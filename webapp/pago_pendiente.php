<?php
   //ini_set('session.cookie_secure', 1);     // solo HTTPS
   ini_set('session.cookie_httponly', 1);   // no accesible desde JS
   ini_set('session.cookie_samesite', 'Strict'); // bloquea CSRF adicional
   session_start();

   header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
   header( "Last-Modified: ". gmdate("D,dMYH:i:s"). " GMT" );
   header( "Cache-Control: no-cache, must-revalidate" );
   header( "Pragma: no-cache" );

   $host = $_SERVER['HTTP_HOST'];
   $parts = explode('.', $host);
   // Si hay al menos 3 partes (ej. labxyz.novalis.com), tomamos el subdominio
   $subDominio = (count($parts) >= 3) ? $parts[0] : 'default';

   $ruta       = '../api/assets/'.$subDominio.'/images/logo.png';
   $jsonPath   = "../api/config/json/{$subDominio}.json";

   if (!file_exists($jsonPath)) {
      $jsonPath = "../api/config/json/default.json";
   }

   $jsonContent = file_exists($jsonPath) ? file_get_contents($jsonPath) : '{}';
   $config      = json_decode($jsonContent, true);

   // Asignación de variables con fallbacks
   $nombreLab   = $config['nombre_comercial'] ?? 'Laboratorio Clínico';
   $favicon     = "../".$config['favicon'];
   $whatsapp    = $config['whatsapp'] ?? '521XXXXXXXXXX'; // Opcional si lo tienes en tu JSON
   $telefono    = $config['telefono'] ?? 'Atención a Clientes';
?>
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>:: Novalis - Aviso de Suspensión ::</title>
      <!-- CSS -->
      <link rel="shortcut icon" href="<?= htmlspecialchars($favicon) ?>"/>
      <link rel="stylesheet" type="text/css" href="assets/lib/bootstrap-5.3.2/css/bootstrap.css"/>
      <link rel="stylesheet" type="text/css" href="assets/lib/sweetAlert2/sweetalert2.min.css" />
      <link rel="stylesheet" type="text/css" href="assets/css/styles.css?x=<?php echo time();?>" />
      <link rel="stylesheet" type="text/css" href="assets/css/toast.css?x=<?php echo time();?>" />
      <link rel="stylesheet" href="assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
   </head>
   <body>
      <section>
         <div class="row">
            <div class="col-12">
               <div class="row">
                  <div class="col-xl-6 offset-xl-3 col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-10 offset-1" align="center">
                     <div class="card-login mt-index shadow-lg border-0 rounded-4">
                        
                        <!-- FRANJA SUPERIOR INFORMATIVA -->
                        <div class="card-login-body px-4 px-md-5 bg-white rounded-4">
                           <div class="bg-primary bg-opacity-25 text-dark py-3 px-4 text-center fw-semibold rounded-4">
                              <i class="bi bi-exclamation-circle me-2"></i> Suspensión temporal
                           </div>
                        </div>
                           

                        <div class="card-login-body p-4 p-md-5 bg-white rounded-4">
                           
                           <!-- LOGOS -->
                           <div class="row mb-4 align-items-center justify-content-center">
                              <div class="col-6 text-center">
                                 <img src="assets/images/logo.webp" class="img-fluid" style="max-height: 80px;" alt="Novalis">
                              </div>
                              <div class="col-6 text-center">
                                 <img src="<?= $ruta; ?>" class="img-fluid" style="max-height: 60px;" alt="<?= htmlspecialchars($nombreLab) ?>">
                              </div>
                           </div>

                           <!-- ICONO DE AVISO / ESTADO -->
                           <div class="text-center my-4">
                              <div class="display-4 text-warning mb-2">
                                 <i class="bi bi-exclamation-circle"></i>
                              </div>
                              <h4 class="fw-bold text-dark">Servicio Suspendido Temporalmente</h4>
                              <p class="text-muted small mt-2">
                                 Estimado cliente <strong><?= htmlspecialchars($nombreLab) ?></strong>, su cuenta presenta un saldo pendiente o retraso en su facturación.
                              </p>
                           </div>

                           <!-- MENSAJE INFORMATIVO -->
                           <div class="alert alert-warning border-0 bg-light text-secondary small p-3 mb-4 rounded-3 text-start">
                              <i class="bi bi-info-circle-fill text-warning me-1"></i> 
                              Para reactivar el acceso a la plataforma y continuar con la consulta, gestión y descarga de sus estudios clínicos, por favor comuníquese con el área administrativa o realice su pago correspondiente.
                           </div>

                           <!-- BOTONES DE ACCIÓN / CONTACTO -->
                           <div class="d-grid gap-2 mb-4">
                              <a href="https://wa.me/<?= $whatsapp ?>?text=Hola,%20necesito%20información%20sobre%20el%20estado%20de%20mi%20cuenta%20y%20pagos%20pendientes." target="_blank" class="btn btn-lg btn-success btn-redondo shadow-sm">
                                 <i class="bi bi-whatsapp me-2"></i> Contactar vía WhatsApp
                              </a>
                           </div>

                           <!-- FOOTER -->
                           <div class="row">
                              <div class="col-12 mt-3 text-secondary fs-8 border-top pt-3" align="center">
                                 © NOVALIS - Sistema de Información de Laboratorio <br>Todos los derechos reservados
                              </div>
                           </div>

                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- SCRIPTS -->
      <script src="assets/lib/jquery-3.7.1.min.js"></script>
      <script src="assets/lib/sweetAlert2/sweetalert2.min.js"></script>
      <script src="assets/lib/bootstrap-5.3.2/js/bootstrap.js"></script>
   </body>
</html>