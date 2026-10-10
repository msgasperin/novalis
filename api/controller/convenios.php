<?php
   header('Content-Type: application/json; charset=utf-8');
   require_once('../model/Convenios.php');
   require_once('../model/Globales.php');

   $v = new Convenios();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 

   if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
      if (isset($_POST['func'])) {

         // ── Validación CSRF para acciones de escritura / modificación ──
         if (in_array($_POST['func'], ['guardar', 'eliminar', 'cambiar_credenciales'])) {
            $csrf_recibido = $_POST['csrf'] ?? '';
            $csrf_sesion   = $_SESSION['csrf_token'] ?? '';

            if (empty($csrf_recibido) || empty($csrf_sesion) || !hash_equals($csrf_sesion, $csrf_recibido)) {
               echo json_encode([
                  'estatus' => 422,
                  'mensaje' => 'Petición no autorizada (Token CSRF inválido), reinicia sesión e inténtalo de nuevo',
                  'data'    => [$csrf_recibido, $csrf_sesion]
               ]);
               exit;
            }
         }

         switch ($_POST['func']) {

            // Funciones de CRUD de clientes/convenios
            case 'obtiene_convenios':
               $res = $v->obtiene_convenios();
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'guardar':
               if (!isset($_POST["idConvenio"]) || empty($_POST["nomConvenio"]) || empty($_POST["precio"]) || empty($_POST["telefono"]) || empty($_POST["tipo"]) || $_POST["tipo"] === 'NA') {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []]);
                  break;
               }

               $idConvenio = (int)$_POST["idConvenio"];

               if ($idConvenio === 0) {
                  $res = $v->guardar_convenio($_POST, $_SESSION["nombre"]);
                  $mensaje_bitacora = 'Convenio registrado: ' . $_POST["nomConvenio"];
                  $id_convenio_bitacora = (int)($res["data"][0] ?? 0);
               } 
               else {
                  $res = $v->actualizar_convenio($_POST, $_SESSION["nombre"]);
                  $mensaje_bitacora = 'Convenio modificado: ' . $_POST["nomConvenio"];
                  $id_convenio_bitacora = $idConvenio;
               }

               if ($res["estatus"] == 200) {
                  $g->bitacora($mensaje_bitacora, $id_convenio_bitacora, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
               echo json_encode($res);
            break;

            case 'eliminar':
               if (empty($_POST["idConvenio"]) || empty($_POST["nomConvenio"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []]);
                  break;
               }

               $idConvenio = (int)$_POST["idConvenio"];
               $res = $v->eliminar_convenio($idConvenio);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Convenio eliminado: ' . $_POST["nomConvenio"], $idConvenio, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
                              
               echo json_encode($res);
            break;

            case 'obtiene_credenciales_convenio':
               if (empty($_POST["idConvenio"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []]);
                  break;
               }

               $res = $v->obtiene_credenciales_convenio((int)$_POST["idConvenio"]); 
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'cambiar_credenciales':
               if (empty($_POST["idConvenio"]) || empty($_POST["nomConvenio"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $idConvenio = (int)$_POST["idConvenio"];
               $res = $v->cambiar_credenciales_convenio($idConvenio);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Credenciales actualizadas del convenio: ' . $_POST["nomConvenio"], $idConvenio, $_SESSION["id_usuario"], $_SESSION["nombre"]);
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