<?php
  require_once('../model/Usuarios.php');
  require_once('../model/Globales.php');
  /** @var string $bd_cliente */ // <- Esto le dice a VS Code de qué tipo es
   $v = new Usuarios($bd_cliente);
   $g = new Globales($bd_cliente);
  $_POST = json_decode(file_get_contents("php://input"), true);
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {

        // Funciones de CRUD de usuarios
        case 'obtiene_usuarios':
          $res = $v->obtiene_usuarios();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'guardar':

          if($_SESSION["perfil"] != 'ADMINISTRADOR') {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          $userExist = $v->usuario_existente($_POST["idUsuario"], $_POST["usuario"]);
          if($userExist) {
            $res = array('estatus' => 202, 'mensaje' => 'El usuario ya existe', 'data'=> []);
          } 
          else {
            if(!isset($_POST["idUsuario"]) || empty($_POST["nomUsuario"]) || empty($_POST["usuario"]) || !isset($_POST["contrasenia"]) || empty($_POST["perfilUsuario"]) || empty($_POST["sucursalUsuario"])) {
              $res = array('estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data'=> []);
              echo json_encode($res);
              break;
            }

            if($_POST["idUsuario"] == '0') {
              $res              = $v->guardar_usuario($_POST, $_SESSION["nombre"]);
              $id_usuario       = $res["data"][0];
              $mensaje_bitacora = 'Usuario registrado: '.$_POST["nomUsuario"];
            } 
            else {
              $id_usuario       = $_POST["idUsuario"];
              $res              = $v->actualizar_usuario($_POST, $_SESSION["nombre"]);
              $mensaje_bitacora = 'Usuario modificado: '.$_POST["nomUsuario"];
            }

            if($res["estatus"] == 200) {
              $g->bitacora($mensaje_bitacora, $id_usuario, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
          }

          echo json_encode($res);
        break;

        case 'eliminar':

          if($_SESSION["perfil"] != 'ADMINISTRADOR') {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          if(empty($_POST["idUsuario"]) || empty($_POST["nomUsuario"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          $response = $v->eliminar_usuario($_POST["idUsuario"]);
          if($response) {
            $res = array('estatus' => 200, 'data'=>[], 'mensaje' => 'ok');
            $g->bitacora('Usuario eliminado: '.$_POST["nomUsuario"], $_POST["idUsuario"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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
    else
      echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", "data" => []]);
  } else {
    echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", "data" => []]);
  }
?>