<?php
   require_once('../model/Clientes.php');
   require_once('../model/Globales.php');
   /** @var string $bd_cliente */ // <- Esto le dice a VS Code de qué tipo es
   $v = new Clientes($bd_cliente);
   $g = new Globales($bd_cliente);

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 

   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
      switch ($_POST['func']) {

         // Funciones de CRUD de clientes
         case 'obtiene_clientes':
            $res = $v->obtiene_clientes();
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar':

            if(!isset($_POST["idCliente"]) || empty($_POST["nomCliente"]) || empty($_POST["precioCliente"]) || empty($_POST["razonSocialCliente"]) || empty($_POST["rfcCliente"])  || empty($_POST["telCliente"]) || empty($_POST["tipoCliente"]) || $_POST["tipoCliente"] == 'NA') {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               echo json_encode($res);
               break;
            }

            if($_POST["idCliente"] == '0') {
               $res = $v->guardar_cliente($_POST, $_SESSION["nombre"]);
               $mensaje_bitacora = 'Cliente registrado: '.$_POST["nomCliente"];
               $id_cliente = $res["data"][0];
            } 
            else {
               $id_cliente = $_POST["idCliente"];
               $res = $v->actualizar_cliente($_POST, $_SESSION["nombre"]);
               $mensaje_bitacora = 'Cliente modificado: '.$_POST["nomCliente"];
            }

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_cliente, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'eliminar':

            if(empty($_POST["idCliente"]) || empty($_POST["nomCliente"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->eliminar_cliente($_POST["idCliente"]);

            if($res["estatus"] == 200) {
               $g->bitacora('Cliente eliminado: '.$_POST["nomCliente"], $_POST["idCliente"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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