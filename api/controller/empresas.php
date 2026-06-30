<?php
   require_once('../model/Empresas.php');
   require_once('../model/Globales.php');
   /** @var string $bd_cliente */ // <- Esto le dice a VS Code de qué tipo es
   $v = new Empresas($bd_cliente);
   $g = new Globales($bd_cliente);

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 

   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
      switch ($_POST['func']) {

         // Funciones de CRUD de clientes
         case 'obtiene_empresas':
            $res = $v->obtiene_empresas();
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar':

            if(!isset($_POST["idEmpresa"]) || empty($_POST["nomComercial"]) || empty($_POST["precioEmpresa"]) || empty($_POST["razonSocialEmpresa"]) || empty($_POST["rfcEmpresa"])  || empty($_POST["telEmpresa"]) || empty($_POST["tipoEmpresa"]) || $_POST["tipoEmpresa"] == 'NA') {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               echo json_encode($res);
               break;
            }

            if($_POST["idEmpresa"] == '0') {
               $res = $v->guardar_empresa($_POST, $_SESSION["nombre"]);
               $mensaje_bitacora = 'Empresa registrada: '.$_POST["nomComercial"];
               $id_empresa = $res["data"][0];
            } 
            else {
               $id_empresa = $_POST["idEmpresa"];
               $res = $v->actualizar_empresa($_POST, $_SESSION["nombre"]);
               $mensaje_bitacora = 'Empresa modificada: '.$_POST["nomComercial"];
            }

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_empresa, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'eliminar':

            if(empty($_POST["idEmpresa"]) || empty($_POST["nomComercial"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->eliminar_empresa($_POST["idEmpresa"]);

            if($res["estatus"] == 200) {
               $g->bitacora('Empresa eliminada: '.$_POST["nomComercial"], $_POST["idEmpresa"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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