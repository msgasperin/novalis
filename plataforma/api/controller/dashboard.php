<?php
   require_once('../model/Dashboard.php');
   require_once('../model/Global.php');
   
   $v = new Dashboard();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_cliente_portal"]) && $_SESSION["id_cliente_portal"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

            case 'obtiene_resultados_cliente':

               $res = ['estatus' => 500, 'mensaje' => 'Erorr al intentar obtener los datos', 'data' => []];

               if($_SESSION["tipo_cliente"] == 'paciente') {
                  $res = $v->obtiene_ordenes_paciente($_SESSION["id_cliente_portal"]);
               }
               else if($_SESSION["tipo_cliente"] == 'convenio') { 

                  $fDesde  = new DateTime($_POST["fDesde"]);
                  $fHasta  = new DateTime($_POST["fHasta"]);
                  $diff    = $fDesde->diff($fHasta);

                  if ($diff->days > 30 && $_POST["origen"] == 1) {
                     echo json_encode(["estatus" => 500, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
                     break;
                  }
               }
               else {
                  echo json_encode(["estatus" => 403, "mensaje" => 'Sin permiso, por falta de sesión activa', "data" => []]);
                  break;
               }

               echo json_encode($res);
            break;

            case 'obtiene_archivos_resultados_orden':
               
               if(empty($_POST["idOrden"])) {
                  echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
                  break;
               }
               
               $res = $v->obtiene_archivos_resultados_orden($_POST["idOrden"]); 
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