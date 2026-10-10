<?php
   header('Content-Type: application/json; charset=utf-8');
   require_once('../model/Pacientes.php');
   require_once('../model/Globales.php');
   
   $v = new Pacientes();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
      if (isset($_POST['func'])) {

         // ── Validación CSRF para acciones de escritura / modificación ──
         if (in_array($_POST['func'], ['valida_coincidencia_paciente', 'guardar_paciente', 'eliminar_paciente', 'cambiar_credenciales'])) {
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

            case 'obtiene_credenciales_pacientes':
               if (empty($_POST["idPaciente"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios', 'data' => []]);
                  break;
               }

               $res = $v->obtiene_credenciales_pacientes((int)$_POST["idPaciente"]); 
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'busca_paciente_coincidencia':
               $parametro = trim($_POST["parametro"] ?? '');
               $res = $v->busca_pacientes_coincidencia($parametro); 
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'busca_paciente_fecha_nac':
               $fecha = trim($_POST["fecha"] ?? '');
               $res = $v->busca_pacientes_fecha_nac($fecha); 
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'valida_coincidencia_paciente':   
               if (!isset($_POST["idPaciente"]) || empty($_POST["nomPaciente"]) || empty($_POST["apPaterno"]) || empty($_POST["fechaNacimiento"]) || empty($_POST["sexoBiologico"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $res = $v->valida_coincidencia_paciente($_POST["nomPaciente"], $_POST["apPaterno"], $_POST["apMaterno"] ?? '', $_POST["fechaNacimiento"]);
               echo json_encode($res);
            break;

            case 'guardar_paciente':   
               if (!isset($_POST["idPaciente"]) || empty($_POST["nomPaciente"]) || empty($_POST["apPaterno"]) || empty($_POST["fechaNacimiento"]) || empty($_POST["sexoBiologico"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }
               
               $idPaciente = (int)$_POST["idPaciente"];

               if ($idPaciente === 0) {
                  $res         = $v->guardar_paciente($_POST, $_SESSION["nombre"]);
                  $msjBitacora = 'Paciente registrado: ' . $_POST["nomPaciente"];
                  $idBitacora  = (int)($res["data"][0] ?? 0);
               }
               else {
                  $res         = $v->actualizar_paciente($_POST, $_SESSION["nombre"]);
                  $msjBitacora = 'Paciente modificado: ' . $_POST["nomPaciente"];
                  $idBitacora  = $idPaciente;
               }

               if ($res["estatus"] == 200) {
                  $g->bitacora($msjBitacora, $idBitacora, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'eliminar_paciente':
               if (empty($_POST["idPaciente"]) || empty($_POST["nomPaciente"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $idPaciente  = (int)$_POST["idPaciente"];
               $nomPaciente = $_POST["nomPaciente"];
               $res         = $v->eliminar_paciente($idPaciente);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Paciente eliminado: ' . $nomPaciente, $idPaciente, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'cambiar_credenciales':
               if (empty($_POST["idPaciente"]) || empty($_POST["nomPaciente"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $idPaciente  = (int)$_POST["idPaciente"];
               $nomPaciente = $_POST["nomPaciente"];
               $res         = $v->cambiar_credenciales($idPaciente);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Credenciales actualizadas del paciente: ' . $nomPaciente, $idPaciente, $_SESSION["id_usuario"], $_SESSION["nombre"]);
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