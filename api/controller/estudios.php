<?php
   require_once('../model/Estudios.php');
   require_once('../model/Globales.php');
   /** @var string $bd_cliente */ // <- Esto le dice a VS Code de qué tipo es
   $v = new Estudios($bd_cliente);
   $g = new Globales($bd_cliente);

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         // ********************************************************** Funciones de CRUD cat_lista_precios **********************************************************************
         case 'obtiene_estudios':
            $res = $v->obtiene_lista_estudios();          
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar_estudio':   
            
            if(!isset($_POST["idEstudio"]) || empty($_POST["nomEstudio"]) || empty($_POST["tipoEstudio"]) || empty($_POST["precioPublico"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            if(intval($_POST["idEstudio"]) == 0) {
               $res         = $v->guardar_estudio($_POST, $_SESSION["nombre"]);
               $msjBitacora = 'Estudio registrado: ';
            }
            else {
               $res = $v->actualizar_estudio($_POST, $_SESSION["nombre"]);
               $msjBitacora = 'Estudio modificado: ';
            }

            if($res["estatus"] == 200) {
               $g->bitacora($msjBitacora.$_POST["nomEstudio"], $res["data"][0], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'eliminar_estudio':

            if(empty($_POST["idEstudio"]) || empty($_POST["nomEstudio"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->eliminar_estudio($_POST["idEstudio"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Estudio eliminado: '.$_POST["nomEstudio"], $_POST["idEstudio"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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