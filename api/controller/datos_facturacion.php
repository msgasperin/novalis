<?php
   require_once('../model/DatosFacturacion.php');
   require_once('../model/Globales.php');
   $v = new DatosFacturacion();
   $g = new Globales();
   $_POST = json_decode(file_get_contents("php://input"), true);

   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
      switch ($_POST['func']) {

         // Funciones de CRUD de usuarios
         case 'obtiene_datos_facturacion':
            $res = $v->obtiene_datos_facturacion($_POST["tipoReceptor"], $_POST["idReceptor"]);          
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guarda_datos_facturacion':
            
            if(!isset($_POST["usoCfdiFact"]) || $_POST["usoCfdiFact"] == '000' || !isset($_POST["regimenFiscalFact"]) || $_POST["regimenFiscalFact"] == '000' ||empty($_POST["rfcFact"]) || empty($_POST["razonSocialFact"]) || empty($_POST["codigoPostalFact"]) || empty($_POST["correoFact"]) ) {
               $res = array('estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data'=> []);
               echo json_encode($res);
               break;
            }

            if($_POST["idDatoFacturacion"] == '0') {
               $res              = $v->guardar_datos_facturacion($_POST, $_SESSION["nombre"]);
               $id_dato_facturacion       = $res["data"][0];
               $mensaje_bitacora = 'Datos de facturación registrados: '.$_POST["razonSocialFact"];
            } 
            else {
               $id_dato_facturacion       = $_POST["idDatoFacturacion"];
               $res              = $v->actualizar_datos_facturacion($_POST, $_SESSION["nombre"]);
               $mensaje_bitacora = 'Datos de facturación modificados: '.$_POST["razonSocialFact"];
            }

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_dato_facturacion, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }

            echo json_encode($res);
         break;

         case 'elimina_datos_facturacion':

            if(empty($_POST["idDatosFacturacion"]) || empty($_POST["nomReceptor"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $response = $v->eliminar_dato_facturacion($_POST["idDatosFacturacion"]);

            if($response) {
               $res = array('estatus' => 200, 'data'=>[], 'mensaje' => 'ok');
               $g->bitacora('Datos de facturación eliminado: '.$_POST["nomReceptor"], $_POST["idDatosFacturacion"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'data'=>[], 'mensaje' => 'error al intentar eliminar los datos de facturación');
            }
            
            echo json_encode($res);
         break;

         default:
            echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", "data" => []]);
         break;
      }
      }
      else
      echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", "data" => []]);
   } else {
      echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", "data" => []]);
   }
?>