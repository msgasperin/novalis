<?php
   require_once('../model/Caja.php');
   require_once('../model/Globales.php');
   
   $v = new Caja();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {
         

         case 'abrir_caja':

            if(empty($_POST["fondoInicial"]) || empty($_SESSION["id_usuario"]) || empty($_SESSION["id_sucursal"]) ) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->abrir_caja($_POST["fondoInicial"], $_SESSION["id_usuario"], $_SESSION["id_sucursal"]);
            if($res["estatus"] == 200) {
               $_SESSION["id_caja"]        = $res["data"][0];
               $_SESSION["estatus_caja"]   = 'abierta';
               $_SESSION["fecha_apertura"] = date('Y-m-d H:i:s');

               $g->bitacora('Caja abierta con fondo: '.$_POST["fondoInicial"], $res["data"][0], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'cerrar_caja':

            if(( $_POST["decEfectivo"] == "" && $_POST["decTarjeta"] == "" && $_POST["decTransferencia"] == "") || empty($_SESSION["id_usuario"]) || empty($_SESSION["id_caja"]) || empty($_SESSION["id_sucursal"]) ) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->cerrar_caja(floatval($_POST["decEfectivo"]), floatval($_POST["decTarjeta"]), floatval($_POST["decTransferencia"]), $_POST["obsCierre"], $_SESSION["id_caja"], $_SESSION["id_usuario"]);
            if($res["estatus"] == 200) {
               $_SESSION["id_caja"]        = $res["data"][0];
               $_SESSION["estatus_caja"]   = 'abierta';
               $_SESSION["fecha_apertura"] = date('Y-m-d H:i:s');

               $g->bitacora('Caja cerrada con saldos decEfec: '.$_POST["decEfectivo"]. ' decTarjeta: '.$_POST["decTarjeta"]. ' decTransferencia: '.$_POST["decTransferencia"], $_SESSION["id_caja"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'obtener_historial_movimientos_caja':

            if(empty($_POST["fecha"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->obtener_historial_movimientos_caja($_POST["fecha"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'registrar_movimiento':

            if( empty($_POST["tipoMovimiento"]) || empty($_POST["montoMovimiento"]) || empty($_POST["conceptoMovimiento"]) || empty($_SESSION["id_usuario"]) || empty($_SESSION["id_caja"]) || empty($_SESSION["id_sucursal"]) ) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->registrar_movimiento($_POST, $_SESSION["id_usuario"], $_SESSION["nombre"], $_SESSION["id_sucursal"], $_SESSION["id_caja"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Movimiento de '.$_POST["tipoMovimiento"].' a caja registrado, por un monto de: $'.$_POST["montoMovimiento"], $res["data"][0], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'eliminar_movimiento':

            if( empty($_POST["tipo"]) || empty($_POST["monto"]) || empty($_POST["idMovimiento"]) ) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->eliminar_movimiento($_POST["idMovimiento"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Movimiento de '.$_POST["tipo"].' a caja eliminado, con monto de: $'.$_POST["monto"], $_POST["idMovimiento"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'obtener_mis_cortes_caja':

            if(empty($_POST["fecha"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->obtener_mis_cortes_caja($_POST["fecha"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
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