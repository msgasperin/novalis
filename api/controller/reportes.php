<?php
   require_once('../model/Reportes.php');
   require_once('../model/Globales.php');
   
   $v = new Reportes();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {
         
         case 'genera_reporte':

            if(empty($_POST["idTipo"]) || empty($_POST["fechaIni"]) || empty($_POST["fechaFin"]) ) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            // Validar que la diferencia no sea mayor a 30 días
            $fechaInicio = new DateTime($_POST["fechaIni"]);
            $fechaFin    = new DateTime($_POST["fechaFin"]);
            $diff        = $fechaInicio->diff($fechaFin);

            if ($diff->days > 30) {
               $res = ['estatus' => 500, 'mensaje' => 'El rango de fechas no puede ser mayor a 30 días', 'data' => []];
               break;
            }

            $estatus = 200;
            $mensaje = 'ok';
            $data    = [];

            switch (intval($_POST["idTipo"])) {
               case 1:
                  $data = $v->cortes_caja($_POST["fechaIni"], $_POST["fechaFin"], $_POST["idSucursal"]);
               break;

               case 2:
                  $data = $v->flujo_dinero($_POST["fechaIni"], $_POST["fechaFin"], $_POST["idSucursal"]);
               break;

               case 3:
                  $data = $v->cuentas_por_cobrar($_POST["fechaIni"], $_POST["fechaFin"], $_POST["idSucursal"]);
               break;

               case 4:
                  $data = $v->estudios_rentabilidad($_POST["fechaIni"], $_POST["fechaFin"], $_POST["idSucursal"]);
               break;

               case 5:
                  $data = $v->rendimiento_clientes($_POST["fechaIni"], $_POST["fechaFin"], $_POST["idSucursal"]);
               break;

               case 6:
                  $data = $v->analisis_pacientes($_POST["fechaIni"], $_POST["fechaFin"], $_POST["idSucursal"]);
               break;

               case 7:
                  $data = $v->auditoria_cancelaciones($_POST["fechaIni"], $_POST["fechaFin"], $_POST["idSucursal"]);
               break;
               
               default:
                  $estatus = 500;
                  $mensaje = 'Tipo de reporte inválido';
               break;
            }

            echo json_encode(['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data]);
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