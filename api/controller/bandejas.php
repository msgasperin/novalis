<?php
   require_once('../model/Bandejas.php');
   require_once('../model/Globales.php');
   /** @var string $bd_cliente */ // <- Esto le dice a VS Code de qué tipo es
   $v = new Bandejas($bd_cliente);
   $g = new Globales($bd_cliente);

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         case 'busqueda_ordenes_bandeja':

            // Validar que la diferencia no sea mayor a 30 días
            $fechaInicio = new DateTime($_POST["fechaIni"]);
            $fechaFin    = new DateTime($_POST["fechaFin"]);
            $diff        = $fechaInicio->diff($fechaFin);


            if($_POST["origen"] == 2 && empty($_POST["parametro"])) {
               echo json_encode(["estatus" => 500, "mensaje" => 'Debes ingresar el parámetro de búsqueda', "data" => []]);
               break;
            }

            if ($diff->days > 30 && $_POST["origen"] == 1) {
               echo json_encode(["estatus" => 500, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
               break;
            }
            
            $res = $v->busqueda_ordenes_bandeja($_SESSION["id_sucursal"], $_SESSION["matriz"], $_POST); 
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