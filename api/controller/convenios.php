<?php
   require_once('../model/Convenios.php');
   require_once('../model/Globales.php');

   $v = new Convenios();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 

   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
      switch ($_POST['func']) {

         // Funciones de CRUD de clientes
         case 'obtiene_convenios':
            $res = $v->obtiene_convenios();
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar':

            if(!isset($_POST["idConvenio"]) || empty($_POST["nomConvenio"]) || empty($_POST["precio"]) || empty($_POST["telefono"]) || empty($_POST["tipo"]) || $_POST["tipo"] == 'NA') {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               echo json_encode($res);
               break;
            }

            if($_POST["idConvenio"] == '0') {
               $res = $v->guardar_convenio($_POST, $_SESSION["nombre"]);
               $mensaje_bitacora = 'Convenio registrado: '.$_POST["nomConvenio"];
               $id_convenio = $res["data"][0];
            } 
            else {
               $id_convenio = $_POST["idConvenio"];
               $res = $v->actualizar_convenio($_POST, $_SESSION["nombre"]);
               $mensaje_bitacora = 'Convenio modificado: '.$_POST["nomConvenio"];
            }

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_convenio, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'eliminar':

            if(empty($_POST["idConvenio"]) || empty($_POST["nomConvenio"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->eliminar_convenio($_POST["idConvenio"]);

            if($res["estatus"] == 200) {
               $g->bitacora('Convenio eliminado: '.$_POST["nomConvenio"], $_POST["idConvenio"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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