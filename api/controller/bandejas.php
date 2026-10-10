<?php
   header('Content-Type: application/json');
   require_once('../model/Bandejas.php');
   require_once('../model/Globales.php');
   
   $v = new Bandejas();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
      if (isset($_POST['func'])) {

         // ── Validación CSRF para acciones de escritura / modificación ──
         if (in_array($_POST['func'], ['procesar_publicacion_notificacion', 'marcar_orden_como_completada', 'marcar_orden_como_parcial', 'eliminar_pdf_resultado', 'subir_pdf_resultado'])) {
            $csrf_recibido = $_POST['CSRF_TOKEN'] ?? $_POST['csrf'] ?? '';
            $csrf_sesion   = $_SESSION['csrf_token'] ?? '';

            if (empty($csrf_recibido) || empty($csrf_sesion) || !hash_equals($csrf_sesion, $csrf_recibido)) {
               echo json_encode([
                  'estatus' => 422,
                  'mensaje' => 'Petición no autorizada (Token CSRF inválido), reinicia sesión e inténtalo de nuevo',
                  'data'    => []
               ]);
               exit;
            }
         }

         switch ($_POST['func']) {

            case 'busqueda_ordenes_bandeja':
               $fechaInicio = new DateTime($_POST["fechaIni"] ?? 'now');
               $fechaFin    = new DateTime($_POST["fechaFin"] ?? 'now');
               $diff        = $fechaInicio->diff($fechaFin);

               if (($_POST["origen"] ?? 0) == 2 && empty($_POST["parametro"])) {
                  echo json_encode(["estatus" => 400, "mensaje" => 'Debes ingresar el parámetro de búsqueda', "data" => []]);
                  break;
               }

               if ($diff->days > 30 && ($_POST["origen"] ?? 0) == 1) {
                  echo json_encode(["estatus" => 400, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
                  break;
               }
               
               $res = $v->busqueda_ordenes_bandeja((int)$_SESSION["id_sucursal"], (string)$_SESSION["matriz"], $_POST); 
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'obtiene_estudios_orden':
               if (empty($_POST["idOrden"])) {
                  echo json_encode(["estatus" => 400, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
                  break;
               }
               
               $res = $v->obtiene_estudios_orden((int)$_POST["idOrden"]); 
               echo json_encode($res);
            break;

            case 'obtiene_archivos_resultados_orden':
               if (empty($_POST["idOrden"])) {
                  echo json_encode(["estatus" => 400, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
                  break;
               }
               
               $res = $v->obtiene_archivos_resultados_orden((int)$_POST["idOrden"]); 
               echo json_encode($res);
            break;

            case 'subir_pdf_resultado':
               if (empty($_POST["idOrden"]) || empty($_POST["folio"]) || empty($_POST["descripcion"]) || empty($_FILES["archivo"]["name"]) || empty($_SESSION["tenant_subdomain"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan campos obligatorios', 'data' => []]);
                  break;
               }
               
               $idOrden        = (int)$_POST["idOrden"];
               $folioSeguro    = preg_replace('/[^a-zA-Z0-9_\-]/', '', $_POST["folio"]);
               $nombre_archivo = $_FILES['archivo']['name'];	
               $tmp_archivo    = $_FILES['archivo']['tmp_name'];
               $tamanio        = $_FILES['archivo']['size'];
               $ext            = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));
               $nom_servidor   = $folioSeguro . '_' . date('ymdhis') . '_' . rand(10, 99) . '.pdf';
               
               // Aislamiento físico de archivos por subdominio de tenant
               $upload_folder  = '../../webapp/assets/docs/resultados/' . $_SESSION["tenant_subdomain"] . '/' . $folioSeguro . '/';
               $archivador     = $upload_folder . $nom_servidor;
               $max_bytes      = 5 * 1024 * 1024;

               if ($tamanio > $max_bytes) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'El archivo excede el tamaño máximo permitido de 5 MB.']);
                  break;
               }

               if ($ext !== 'pdf') {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Tipo de archivo no permitido. Solo se permiten archivos PDF.', 'data' => []]);
                  break;
               }

               $mime_real = mime_content_type($tmp_archivo);
               if ($mime_real !== 'application/pdf') {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'El contenido del archivo no coincide con un formato PDF válido.', 'data' => []]);
                  break;
               }

               if (!file_exists($upload_folder)) {
                  if (mkdir($upload_folder, 0755, true)) {
                     copy('../../webapp/assets/docs/resultados/index.php', $upload_folder . 'index.php');
                  }
               }

               if (move_uploaded_file($tmp_archivo, $archivador)) {
                  $res = $v->registrar_resultado_pdf($idOrden, $folioSeguro, $_POST["descripcion"], $nombre_archivo, $nom_servidor, $tamanio, $_SESSION["nombre"]);

                  if ($res["estatus"] == 200) {
                     $g->bitacora('Resultado PDF agregado: ' . $nombre_archivo . ' del folio: ' . $folioSeguro, $idOrden, $_SESSION["id_usuario"], $_SESSION["nombre"]);
                  } else {
                     if (file_exists($archivador)) {
                        unlink($archivador);
                     }
                  }
               } else {
                  $res = ['estatus' => 500, 'mensaje' => 'Hubo un problema con la subida del archivo al servidor', 'data' => []];
               }
                             
               echo json_encode($res);
            break;

            case 'eliminar_pdf_resultado':
               if (empty($_POST["idOrden"]) || empty($_POST["idArchivo"]) || empty($_POST["nomServidor"]) || empty($_POST["folio"]) || empty($_SESSION["tenant_subdomain"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan campos obligatorios', 'data' => []]);
                  break;
               }
               
               $idOrden     = (int)$_POST["idOrden"];
               $idArchivo   = (int)$_POST["idArchivo"];
               $folioSeguro = preg_replace('/[^a-zA-Z0-9_\-]/', '', $_POST["folio"]);
               
               // Prevención de Path Traversal mediante basename()
               $archivoLimpio = basename($_POST["nomServidor"]);
               
               $res = $v->eliminar_resultado_pdf($idArchivo, $_SESSION["nombre"]);
                  
               if ($res["estatus"] == 200) {
                  $nomOriginalLimpio = $_POST["nomOriginal"] ?? '';
                  $g->bitacora('Resultado PDF eliminado (' . $idArchivo . '): ' . $nomOriginalLimpio . ' del folio: ' . $folioSeguro, $idOrden, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               
                  $ruta_archivo = '../../webapp/assets/docs/resultados/' . $_SESSION["tenant_subdomain"] . '/' . $folioSeguro . '/' . $archivoLimpio;

                  if (file_exists($ruta_archivo)) {
                     unlink($ruta_archivo);                        
                  }
               }              
                             
               echo json_encode($res);
            break;

            case 'marcar_orden_como_parcial':
               if (empty($_POST["idOrden"]) || empty($_POST["folio"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan campos obligatorios', 'data' => []]);
                  break;
               }

               $idOrden = (int)$_POST["idOrden"];
               $tieneResultados = $v->valida_tenga_estudios($idOrden);
               if (!$tieneResultados) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'La orden no tiene resultados adjuntos, primero sube algún resultado', 'data' => []]);
                  break;
               }
               
               $res = $v->marcar_orden_como_parcial($idOrden);
                  
               if ($res["estatus"] == 200) {
                  $g->bitacora('Orden marcada con resultados parciales (' . $_POST["folio"] . ')', $idOrden, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }              
                             
               echo json_encode($res);
            break;

            case 'marcar_orden_como_completada':
               if (empty($_POST["idOrden"]) || empty($_POST["folio"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan campos obligatorios', 'data' => []]);
                  break;
               }
               
               $idOrden = (int)$_POST["idOrden"];
               $tieneResultados = $v->valida_tenga_estudios($idOrden);
               if (!$tieneResultados) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'La orden no tiene resultados adjuntos, primero sube algún resultado', 'data' => []]);
                  break;
               }

               $res = $v->marcar_orden_como_completada($idOrden, $_SESSION["nombre"]);
                  
               if ($res["estatus"] == 200) {
                  $g->bitacora('Orden marcada como completada (' . $_POST["folio"] . ')', $idOrden, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }              
                             
               echo json_encode($res);
            break;

            case 'procesar_publicacion_notificacion':
               if (empty($_POST["idOrden"]) || empty($_POST["folio"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan campos obligatorios', 'data' => []]);
                  break;
               }
               
               $idOrden = (int)$_POST["idOrden"];
               $res = $v->procesar_publicacion_notificacion($idOrden, $_SESSION["nombre"]);
                  
               if ($res["estatus"] == 200) {
                  $g->bitacora('Orden marcada como publicada (' . $_POST["folio"] . ')', $idOrden, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }              
                             
               echo json_encode($res);
            break;

            default:
               echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", 'data' => []]);
            break;
         }
      } else {
         echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]);
      }
   } else {
      echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", 'data' => []]);
   }
?>