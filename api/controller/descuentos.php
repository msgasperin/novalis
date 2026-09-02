<?php
  require_once('../model/Descuentos.php');
  require_once('../model/Globales.php');
  $v = new Descuentos();
  $g = new Globales();
  $_POST = json_decode(file_get_contents("php://input"), true);
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {

        // Funciones de CRUD de usuarios
        case 'obtiene_descuentos':
          $res = $v->obtiene_descuentos();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'guardar_descuento':

          if($_SESSION["perfil"] != 'ADMINISTRADOR') {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          
          if(!isset($_POST["idDescuento"]) || empty($_POST["conceptoDescuento"]) || empty($_POST["porcentajeDescuento"])) {
            $res = array('estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data'=> []);
            echo json_encode($res);
            break;
          }

          if($_POST["idDescuento"] == '0') {
            $res              = $v->guardar_descuento($_POST, $_SESSION["nombre"]);
            $id_descuento       = $res["data"][0];
            $mensaje_bitacora = 'Descuento registrado: '.$_POST["conceptoDescuento"];
          } 
          else {
            $id_descuento       = $_POST["idDescuento"];
            $res              = $v->actualizar_descuento($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Descuento modificado: '.$_POST["conceptoDescuento"];
          }

          if($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $id_descuento, $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }

          echo json_encode($res);
        break;

        case 'eliminar_descuento':

          if($_SESSION["perfil"] != 'ADMINISTRADOR') {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          if(empty($_POST["idDescuento"]) || empty($_POST["conceptoDescuento"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          $response = $v->eliminar_descuento($_POST["idDescuento"]);
          if($response) {
            $res = array('estatus' => 200, 'data'=>[], 'mensaje' => 'ok');
            $g->bitacora('Descuento eliminado: '.$_POST["conceptoDescuento"], $_POST["idDescuento"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          else {
            $res = array('estatus' => 500, 'data'=>[], 'mensaje' => 'error al intentar eliminar descuento');
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