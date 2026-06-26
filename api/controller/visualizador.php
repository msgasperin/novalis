<?php
  //ini_set('session.cookie_secure', 1);     // solo HTTPS
	ini_set('session.cookie_httponly', 1);   // no accesible desde JS
	ini_set('session.cookie_samesite', 'Strict'); // bloquea CSRF adicional
  session_start();
  if(isset($_SESSION["login_siev"])) {
    $path = $_GET['path'];
    $ruta = '../assets/'.$path;
    if(file_exists($ruta))  {
      $ext = substr($ruta, strrpos($ruta, '.') + 1); // extension
      if($ext == 'jpg' || $ext == 'png' || $ext == 'jpeg') { 
        header('content-type: image/'.$ext);
        readfile($ruta);
      } 
      else if($ext == 'pdf') { 
        header('Content-type: application/pdf');
        readfile($ruta);
      } 
      else if($ext == 'csv') { 
        header('Content-type: text/csv');
        readfile($ruta);
      } 
      else if($ext == 'xls' || $ext == 'xlsx') { 
        header('Content-type: application/vnd.ms-excel');
        readfile($ruta);
      }
      else if($ext == 'mp4') { 
        header('Content-type: video/'.$ext);
        readfile($ruta);
      }
    } else {
      echo '<div class="alert alert-danger p-2" align="center">No se encontró el archivo seleccionado</div>'.$ruta;
    }
  } else {
    echo 'Necesitas iniciar sesión';
  }
?> 