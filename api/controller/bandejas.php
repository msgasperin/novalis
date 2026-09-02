<?php
   require_once('../model/Bandejas.php');
   require_once('../model/Globales.php');
   
   $v = new Bandejas();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

            case 'busqueda_ordenes_bandeja':
               // Validar que la diferencia no sea mayor a 30 días
               $fechaInicio = new DateTime($_POST["fechaIni"]);
               $fechaFin    = new DateTime($_POST["fechaFin"]);
               $diff        = $fechaInicio->diff($fechaFin);


               if($_POST["origen"] == 2 && empty($_POST["parametro"])) {
                  echo json_encode(["estatus" => 500, "mensaje" => 'Debes ingresar el parámetro de búsqueda', "data" => []]);
                  break;
               }

               if ($diff->days > 30 && $_POST["origen"] == 1) {
                  echo json_encode(["estatus" => 500, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
                  break;
               }
               
               $res = $v->busqueda_ordenes_bandeja($_SESSION["id_sucursal"], $_SESSION["matriz"], $_POST); 
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'obtiene_estudios_orden':
               
               if(empty($_POST["idOrden"])) {
                  echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
                  break;
               }
               
               $res = $v->obtiene_estudios_orden($_POST["idOrden"]); 
               echo json_encode($res);
            break;

            case 'obtiene_archivos_resultados_orden':
               
               if(empty($_POST["idOrden"])) {
                  echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
                  break;
               }
               
               $res = $v->obtiene_archivos_resultados_orden($_POST["idOrden"]); 
               echo json_encode($res);
            break;

            case 'subir_pdf_resultado':

               if( empty($_POST["idOrden"]) || empty($_POST["folio"]) || empty($_POST["descripcion"]) || empty($_FILES["archivo"]["name"]) ) {
                  $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
                  echo json_encode($res);
                  break;
               }
               
               $nombre_archivo = $_FILES['archivo']['name'];	
               $tmp_archivo    = $_FILES['archivo']['tmp_name'];
               $tamanio        = $_FILES['archivo']['size'];
               $ext            = explode(".",$_FILES['archivo']['name']);
               $extension      = end($ext);
               $nom_servidor   = $_POST["folio"].'_'.date('ymdhis').'_'.rand(1,100).'.pdf';
               $upload_folder  = '../../webapp/assets/docs/resultados/'.$_POST["folio"].'/';
               $archivador     = $upload_folder.$nom_servidor;
               $max_bytes      = 5 * 1024 * 1024;
               $extensiones_permitidas = ['pdf'];


               if ($tamanio > $max_bytes) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'El archivo excede el tamaño máximo permitido de 5 MB.']);
                  break;
               }

               if (!in_array(strtolower($extension), $extensiones_permitidas)) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Tipo de archivo no permitido', 'data' => []]);
                  break;
               }

               $mime_real = mime_content_type($tmp_archivo);

               if($mime_real !== 'application/pdf') {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'El contenido del archivo no coincide con un formato PDF válido.', 'data' => []]);
                  break;
               }

               if(!file_exists($upload_folder)) { //Si no existe la carpeta
                  if(mkdir($upload_folder)) {
                     copy('../../webapp/assets/docs/resultados/index.php', $upload_folder.'/index.php');
                  }
               }

               if (move_uploaded_file($tmp_archivo, $archivador)) {

                  $res = $v->registrar_resultado_pdf($_POST["idOrden"], $_POST["folio"], $_POST["descripcion"], $nombre_archivo, $nom_servidor, $tamanio, $_SESSION["nombre"]);

                  if ($res["estatus"] == 200) {
                     $g->bitacora('Resultado PDF agregado: ' . $nombre_archivo . ' del folio: ' . $_POST["folio"], $_POST["idOrden"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
                  } else {
                     if (file_exists($archivador)) {
                           unlink($archivador);
                     }
                  }
               }
               else {
                  $res = ['estatus' => 208, 'mensaje' => 'Hubo un problema con la subida del archivo', 'data' => []];
               }
                             
               echo json_encode($res);
            break;

            case 'eliminar_pdf_resultado':

               if( empty($_POST["idOrden"]) || empty($_POST["idArchivo"]) || empty($_POST["nomServidor"]) || empty($_POST["nomOriginal"]) || empty($_POST["folio"]) ) {
                  $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
                  echo json_encode($res);
                  break;
               }
               
               $res = $v->eliminar_resultado_pdf($_POST["idArchivo"], $_SESSION["nombre"]);
                  
               if($res["estatus"] == 200) {

                  $g->bitacora('Resultado PDF eliminado ('.$_POST["idArchivo"].'): '.$_POST["nomOriginal"].' del folio: '.$_POST["folio"], $_POST["idOrden"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               
                  $upload_folder  = '../../webapp/assets/docs/resultados/'.$_POST["folio"].'/'.$_POST["nomServidor"];               

                  if(file_exists($upload_folder)) {
                     unlink($upload_folder);                        
                  }
               }              
                             
               echo json_encode($res);
            break;


            // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIOENS DE CAMBIOS DE ESTATUS ++++++++++++++++++++++++++++++++++++++++++++++++++++++

            case 'marcar_orden_como_parcial':

               if( empty($_POST["idOrden"]) || empty($_POST["folio"]) ) {
                  $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
                  echo json_encode($res);
                  break;
               }

               $tieneResultados = $v->valida_tenga_estudios($_POST["idOrden"]);
               if(!$tieneResultados) {
                  $res = ['estatus' => 500, 'mensaje' => 'La orden no tiene resultados adjuntos, primero sube algún resultado', 'data' => []];
                  echo json_encode($res);
                  break;
               }
               
               $res = $v->marcar_orden_como_parcial($_POST["idOrden"]);
                  
               if($res["estatus"] == 200) {
                  $g->bitacora('Orden marcada con resultados parciales ('.$_POST["folio"].')', $_POST["idOrden"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }              
                             
               echo json_encode($res);
            break;

            case 'marcar_orden_como_completada':

               if( empty($_POST["idOrden"]) || empty($_POST["folio"]) ) {
                  $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
                  echo json_encode($res);
                  break;
               }
               
               $tieneResultados = $v->valida_tenga_estudios($_POST["idOrden"]);
               if(!$tieneResultados) {
                  $res = ['estatus' => 500, 'mensaje' => 'La orden no tiene resultados adjuntos, primero sube algún resultado', 'data' => []];
                  echo json_encode($res);
                  break;
               }

               $res = $v->marcar_orden_como_completada($_POST["idOrden"], $_SESSION["nombre"]);
                  
               if($res["estatus"] == 200) {
                  $g->bitacora('Orden marcada como completada ('.$_POST["folio"].')', $_POST["idOrden"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }              
                             
               echo json_encode($res);
            break;

            case 'procesar_publicacion_notificacion':

               if( empty($_POST["idOrden"]) || empty($_POST["folio"]) ) {
                  $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
                  echo json_encode($res);
                  break;
               }
               
               $res = $v->procesar_publicacion_notificacion($_POST["idOrden"], $_SESSION["nombre"]);
                  
               if($res["estatus"] == 200) {
                  $g->bitacora('Orden marcada como publicada ('.$_POST["folio"].')', $_POST["idOrden"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }              
                             
               echo json_encode($res);
            break;

            default:
               echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", 'data' => []]); // Función no encontrada
            break;
         }
      }
      else
         echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]); // Parámatros no enviados
   } else {
      echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", 'data' => []]); // Sin sesión de usuarios
   }
?>