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
   $subDominio = (count($parts) >= 3) ? $parts[0] : 'default';

   $ruta       = '../api/assets/'.$subDominio.'/images/logo.png';
   $jsonPath   = "../api/config/json/{$subDominio}.json";

   if (!file_exists($jsonPath)) {
      $jsonPath = "../api/config/json/default.json";
   }

   $jsonContent = file_exists($jsonPath) ? file_get_contents($jsonPath) : '{}';
   $config      = json_decode($jsonContent, true);

   // Asignación de variables con fallbacks específicos del laboratorio
   $nombreLab   = $config['nombre_comercial'] ?? 'Laboratorio Clínico';
   $favicon     = "../".$config['favicon'];
   $whatsapp    = $config['whatsapp'] ?? '521XXXXXXXXXX'; 
   $telefono    = $config['contacto']['telefono'] ?? 'Atención Telefónica';
?>
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>:: <?= htmlspecialchars($nombreLab) ?> - Sistema en Mantenimiento ::</title>
      <!-- CSS -->
      <link rel="shortcut icon" href="<?= htmlspecialchars($favicon) ?>"/>
      <link rel="stylesheet" type="text/css" href="assets/lib/bootstrap-5.3.2/css/bootstrap.css"/>
      <link rel="stylesheet" type="text/css" href="assets/lib/sweetAlert2/sweetalert2.min.css" />
      <link rel="stylesheet" type="text/css" href="assets/css/styles.css?x=<?php echo time();?>" />
      <link rel="stylesheet" type="text/css" href="assets/css/toast.css?x=<?php echo time();?>" />
      <link rel="stylesheet" href="assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
   </head>
   <body>
      
      <main class="container min-vh-100 d-flex align-items-center justify-content-center py-4">
         <div class="row justify-content-center w-100">
            <div class="col-12 col-md-10 col-lg-8 col-xl-8">
               
               <div class="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                  
                  <!-- FRANJA SUPERIOR INFORMATIVA -->
                  <div class="bg-primary bg-opacity-25 text-dark py-3 px-4 text-center fw-semibold">
                     <i class="bi bi-clock-history me-2"></i> Actualización temporal de plataforma
                  </div>

                  <!-- LOGO DEL LABORATORIO EN TURNO (Protagonista) -->
                  <div class="shadow-lg text-center rounded-5">
                     <div class="p-3">
                        <img src="<?= $ruta; ?>" class="img-fluid" style="max-height: 80px;" alt="<?= htmlspecialchars($nombreLab) ?>">
                     </div>
                  </div>

                  <div class="card-body p-4 p-md-5">

                     <!-- ICONO Y MENSAJE PRINCIPAL -->
                     <div class="text-center mb-4">
                        <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center p-4 mb-3">
                           <i class="bi bi-tools display-5"></i>
                        </div>
                        <h3 class="fw-bold text-dark">Portal de Resultados en Mantenimiento</h3>
                        <p class="text-muted small mt-2 px-md-3 lh-lg">
                           Estimado paciente, en <strong><?= htmlspecialchars($nombreLab) ?></strong> estamos realizando mejoras en nuestro sistema en línea para brindarle un mejor servicio y una consulta más rápida y segura.
                        </p>
                     </div>

                     <!-- CAJA DE AYUDA / ALTERNATIVA -->
                     <div class="alert alert-light border rounded-3 p-4 mb-4 text-secondary small">
                        <div class="d-flex">
                           <div class="me-3 text-success fs-4 flex-shrink-0">
                              <i class="bi bi-headset"></i>
                           </div>
                           <div>
                              <span class="fw-bold text-dark d-block mb-1">¿Necesita sus resultados con urgencia?</span>
                              Si requiere la entrega inmediata de sus estudios clínicos o tiene alguna duda sobre sus análisis, comuníquese directamente con nuestro personal de atención. al teléfono: <b><?= htmlspecialchars($telefono) ?></b>
                           </div>
                        </div>
                     </div>

                     <!-- ACCIONES DE CONTACTO DIRECTO AL LAB -->
                     <div class="mb-4 text-center">
                        <a href="https://wa.me/<?= $whatsapp ?>?text=Hola,%20necesito%20asistencia%20con%20la%20entrega%20de%20mis%20resultados%20clínicos." target="_blank" class="btn btn-success btn-lg rounded-pill shadow-sm align-items-center justify-content-center">
                           <i class="bi bi-whatsapp fs-5 me-2"></i> Contactar al Laboratorio vía WhatsApp
                        </a>
                     </div>

                     <!-- FOOTER PROFESIONAL (Sin quemar la marca base, o sutil) -->
                     <div class="text-center text-secondary fs-8 border-top pt-4">
                        <strong><?= htmlspecialchars($nombreLab) ?></strong> <br>Su salud en manos confiables.
                     </div>

                  </div>
               </div>

            </div>
         </div>
      </main>

      <!-- SCRIPTS -->
      <script src="assets/lib/jquery-3.7.1.min.js"></script>
      <script src="assets/lib/sweetAlert2/sweetalert2.min.js"></script>
      <script src="assets/lib/bootstrap-5.3.2/js/bootstrap.js"></script>
   </body>
</html>