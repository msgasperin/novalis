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

            if(( $_POST["decEfectivo"] <= 0 && $_POST["decTarjeta"] <= 0 && $_POST["decTransferencia"] <= 0) || empty($_SESSION["id_usuario"]) || empty($_SESSION["id_caja"]) || empty($_SESSION["id_sucursal"]) ) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->cerrar_caja($_POST["decEfectivo"], $_POST["decTarjeta"], $_POST["decTransferencia"], $_POST["obsCierre"], $_SESSION["id_caja"], $_SESSION["id_usuario"]);
            if($res["estatus"] == 200) {
               $_SESSION["id_caja"]        = $res["data"][0];
               $_SESSION["estatus_caja"]   = 'abierta';
               $_SESSION["fecha_apertura"] = date('Y-m-d H:i:s');

               $g->bitacora('Caja cerrada con saldos decEfec: '.$_POST["decEfectivo"]. ' decTarjeta: '.$_POST["decTarjeta"]. ' decTransferencia: '.$_POST["decTransferencia"], $_SESSION["id_caja"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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