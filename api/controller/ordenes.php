<?php
  require_once('../model/Sucursales.php');
  require_once('../model/Globales.php');
  /** @var string $bd_cliente */ // <- Esto le dice a VS Code de qué tipo es
   $v = new Sucursales($bd_cliente);
   $g = new Globales($bd_cliente);
  $_POST = json_decode(file_get_contents("php://input"), true);
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {

        // Funciones de CRUD de usuarios
        case 'obtiene_sucursales':
          $res = $v->obtiene_sucursales();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'guardar':

          if($_SESSION["perfil"] != 'ADMINISTRADOR') {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          if(!isset($_POST["idSucursal"]) || empty($_POST["nomSucursal"]) || empty($_POST["direccionSucursal"])) {
            $res = array('estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data'=> []);
            echo json_encode($res);
            break;
          }

          if($_POST["idSucursal"] == '0') {
            $res              = $v->guardar_sucursal($_POST, $_SESSION["nombre"]);
            $id_usuario       = $res["data"][0];
            $mensaje_bitacora = 'Sucursal registrada: '.$_POST["nomSucursal"];
          } 
          else {
            $id_usuario       = $_POST["idSucursal"];
            $res              = $v->actualizar_sucursal($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Sucursal modificada: '.$_POST["nomSucursal"];
          }

          if($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $id_usuario, $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }

          echo json_encode($res);
        break;

        case 'eliminar':

          if($_SESSION["perfil"] != 'ADMINISTRADOR') {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          if(empty($_POST["idSucursal"]) || empty($_POST["nomSucursal"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          $response = $v->eliminar_sucursal($_POST["idSucursal"]);
          if($response) {
            $res = array('estatus' => 200, 'data'=>[], 'mensaje' => 'ok');
            $g->bitacora('Sucursal eliminada: '.$_POST["nomSucursal"], $_POST["idSucursal"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          else {
            $res = array('estatus' => 500, 'data'=>[], 'mensaje' => 'error al intentar eliminar usuario');
          }
          
          echo json_encode($res);
        break;

        default:
          echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", "data" => []]);
        break;
      }
    }
    else {
      echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", "data" => []]);
    }
  } 
  else {
    echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", "data" => []]);
  }
?>