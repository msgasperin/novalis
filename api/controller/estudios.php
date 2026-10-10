<?php
   header('Content-Type: application/json; charset=utf-8');
   require_once('../model/Estudios.php');
   require_once('../model/Globales.php');

   $v = new Estudios();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   }

   if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
      if (isset($_POST['func'])) {

         // ── Validación CSRF para acciones de escritura / modificación ──
         if (in_array($_POST['func'], ['guardar_estudio', 'eliminar_estudio'])) {
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

            case 'obtiene_estudios':
               $res = $v->obtiene_lista_estudios();          
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'guardar_estudio':   
               if (!isset($_POST["idEstudio"]) || empty($_POST["nomEstudio"]) || empty($_POST["tipoEstudio"]) || empty($_POST["precioPublico"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idEstudio = (int)$_POST["idEstudio"];

               // Convertir el arreglo o JSON recibido a string JSON sanitizado
               if (isset($_POST["arrTubosEstudio"]) && is_array($_POST["arrTubosEstudio"])) {
                  $tubosJson = json_encode($_POST["arrTubosEstudio"], JSON_UNESCAPED_UNICODE);
               } else if (isset($_POST["tubosJson"]) && is_string($_POST["tubosJson"])) {
                  $tubosJson = $_POST["tubosJson"];
               } else {
                  $tubosJson = json_encode([], JSON_UNESCAPED_UNICODE);
               }

               if ($idEstudio === 0) {
                  $res         = $v->guardar_estudio($_POST, $_SESSION["nombre"], $tubosJson);
                  $msjBitacora = 'Estudio registrado: ' . $_POST["nomEstudio"];
                  $id_bitacora = (int)($res["data"][0] ?? 0);
               }
               else {
                  $res         = $v->actualizar_estudio($_POST, $_SESSION["nombre"], $tubosJson);
                  $msjBitacora = 'Estudio modificado: ' . $_POST["nomEstudio"];
                  $id_bitacora = $idEstudio;
               }

               if ($res["estatus"] == 200) {
                  $g->bitacora($msjBitacora, $id_bitacora, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'eliminar_estudio':
               if (empty($_POST["idEstudio"]) || empty($_POST["nomEstudio"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $idEstudio  = (int)$_POST["idEstudio"];
               $nomEstudio = $_POST["nomEstudio"];
               $res        = $v->eliminar_estudio($idEstudio);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Estudio eliminado: ' . $nomEstudio, $idEstudio, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            default:
               echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", 'data' => []]);
            break;
         }
      }
      else {
         echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]);
      }
   } else {
      echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", 'data' => []]);
   }
?>