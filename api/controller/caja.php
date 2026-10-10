<?php
   header('Content-Type: application/json; charset=utf-8');
   require_once('../model/Caja.php');
   require_once('../model/Globales.php');
   
   $v = new Caja();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
      if (isset($_POST['func'])) {

         // ── Validación CSRF para acciones de escritura / modificación ──
         if (in_array($_POST['func'], ['abrir_caja', 'cerrar_caja', 'registrar_movimiento', 'eliminar_movimiento'])) {
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

            case 'abrir_caja':
               if (!isset($_POST["fondoInicial"]) || $_POST["fondoInicial"] === '' || empty($_SESSION["id_usuario"]) || empty($_SESSION["id_sucursal"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $fondoInicial = (float)$_POST["fondoInicial"];
               $res = $v->abrir_caja($fondoInicial, (int)$_SESSION["id_usuario"], $_SESSION["nombre"], (int)$_SESSION["id_sucursal"]);
               
               if ($res["estatus"] == 200) {
                  $_SESSION["id_caja"]        = $res["data"][0];
                  $_SESSION["estatus_caja"]   = 'abierta';
                  $_SESSION["fecha_apertura"] = date('Y-m-d H:i:s');

                  $g->bitacora('Caja abierta con fondo: $' . number_format($fondoInicial, 2), $res["data"][0], $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'cerrar_caja':
               if (!isset($_POST["decEfectivo"]) || !isset($_POST["decTarjeta"]) || !isset($_POST["decTransferencia"]) || empty($_SESSION["id_usuario"]) || empty($_SESSION["id_caja"]) || empty($_SESSION["id_sucursal"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $decEfec  = (float)$_POST["decEfectivo"];
               $decTarj  = (float)$_POST["decTarjeta"];
               $decTrans = (float)$_POST["decTransferencia"];
               $obs      = $_POST["obsCierre"] ?? '';

               $res = $v->cerrar_caja($decEfec, $decTarj, $decTrans, $obs, (int)$_SESSION["id_caja"], (int)$_SESSION["id_usuario"]);
               
               if ($res["estatus"] == 200) {
                  $idCajaCerrada = $_SESSION["id_caja"];
                  
                  $_SESSION["id_caja"]        = 0;
                  $_SESSION["estatus_caja"]   = 'cerrada';
                  $_SESSION["fecha_apertura"] = '';

                  $g->bitacora('Caja cerrada con saldos decEfec: $' . number_format($decEfec, 2) . ' decTarjeta: $' . number_format($decTarj, 2) . ' decTransferencia: $' . number_format($decTrans, 2), $idCajaCerrada, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'obtener_historial_movimientos_caja':
               if (empty($_POST["fecha"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $res = $v->obtener_historial_movimientos_caja($_POST["fecha"]);
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'registrar_movimiento':

               if (empty($_POST["tipoMovimiento"]) || empty($_POST["montoMovimiento"]) || empty($_POST["conceptoMovimiento"]) || empty($_SESSION["id_usuario"]) || empty($_SESSION["id_caja"]) || empty($_SESSION["id_sucursal"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $res = $v->registrar_movimiento($_POST, (int)$_SESSION["id_usuario"], $_SESSION["nombre"], (int)$_SESSION["id_sucursal"], (int)$_SESSION["id_caja"]);
               
               if ($res["estatus"] == 200) {
                  $g->bitacora('Movimiento de ' . $_POST["tipoMovimiento"] . ' a caja registrado, por un monto de: $' . number_format((float)$_POST["montoMovimiento"], 2), $res["data"][0], $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'eliminar_movimiento':
               if (empty($_POST["tipo"]) || empty($_POST["monto"]) || empty($_POST["idMovimiento"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $idMov = (int)$_POST["idMovimiento"];
               $res   = $v->eliminar_movimiento($idMov);
               
               if ($res["estatus"] == 200) {
                  $g->bitacora('Movimiento de ' . $_POST["tipo"] . ' a caja eliminado, con monto de: $' . number_format((float)$_POST["monto"], 2), $idMov, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'obtener_mis_cortes_caja':
               if (empty($_POST["fecha"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $fecha     = preg_replace('/[^0-9\-]/', '', $_POST["fecha"]);
               $fecha_ini = $fecha . ' 00:00:00'; 
               $fecha_fin = $fecha . ' 23:59:59';

               $res = $v->obtener_mis_cortes_caja($fecha_ini, $fecha_fin);
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'obtener_movimientos_corte':
               if (empty($_POST["idCaja"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $res = $v->obtener_movimientos_corte((int)$_POST["idCaja"]);
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
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