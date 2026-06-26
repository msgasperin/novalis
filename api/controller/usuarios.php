<?php
  require_once('../model/Usuarios.php');
  require_once('../model/Globales.php');
  $u = new Usuarios();
  $g = new Globales();
  $_POST = json_decode(file_get_contents("php://input"), true);
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {

        case 'actualizar_llave':

          if(empty($_POST["clave"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }
          
          $res = $u->actualizar_llave($_POST["clave"]);
          if($res["estatus"] == 200) {
            $g->bitacora('Llave de autorización actualizada', $_POST["clave"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
                                        
          echo json_encode($res);
        break;

        // Funciones de CRUD de usuarios
        case 'obtiene_usuarios':
          $res = $u->obtiene_usuarios();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'guardar':

          if($_SESSION["perfil"] != 1) {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }


          $userExist = $u->usuario_existente($_POST["idUsuario"], $_POST["usuario"]);
          if($userExist) {
            $res = array('estatus' => 202, 'mensaje' => 'El usuario ya existe', 'data'=> []);
          } 
          else {
            if(!isset($_POST["idUsuario"]) || empty($_POST["nomUsuario"]) || empty($_POST["usuario"]) || !isset($_POST["contrasenia"]) || empty($_POST["celUsuario"]) || empty($_POST["perfilUsuario"])) {
              $res = array('estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data'=> []);
              echo json_encode($res);
              break;
            }

            if($_POST["idUsuario"] == '0') {
              $res              = $u->guardar_usuario($_POST, $_SESSION["nombre"], $_SESSION["id_fabrica"]);
              $id_usuario       = $res["data"][0];
              $mensaje_bitacora = 'Usuario registrado: '.$_POST["nomUsuario"];
            } 
            else {
              $id_usuario       = $_POST["idUsuario"];
              $res              = $u->actualizar_usuario($_POST, $_SESSION["nombre"]);
              $mensaje_bitacora = 'Usuario modificado: '.$_POST["nomUsuario"];
            }

            if($res["estatus"] == 200) {
              $g->bitacora($mensaje_bitacora, $id_usuario, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
          }

          echo json_encode($res);
        break;

        case 'eliminar':

          if($_SESSION["perfil"] != 1) {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          if(empty($_POST["idUsuario"]) || empty($_POST["nomUsuario"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
          }

          $response = $u->eliminar_usuario($_POST["idUsuario"]);
          if($response) {
            $res = array('estatus' => 200, 'data'=>[], 'mensaje' => 'ok');
            $g->bitacora('Usuario eliminado: '.$_POST["nomUsuario"], $_POST["idUsuario"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          else {
            $res = array('estatus' => 500, 'data'=>[], 'mensaje' => 'error al intentar eliminar usuario');
          }
          
          echo json_encode($res);
        break;

        case 'subirFotoUser':
          if(isset($_POST["idUsuario"]) and trim($_POST["idUsuario"])) {
            $nombre_archivo = $_FILES['foto']['name'];	
            $tmp_archivo    = $_FILES['foto']['tmp_name'];		
            $ext            = explode(".",$_FILES['foto']['name']);
            $extension      = end($ext);
            $nomFile        = $_POST["idUsuario"].'.'.$extension;
            $upload_folder  = '../assets/images/user_fotos/';
            $archivador     = $upload_folder.$nomFile;

            $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'webp'];
            if (!in_array(strtolower($extension), $extensiones_permitidas)) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Tipo de archivo no permitido', 'data' => []]);
                break;
            }
            if(move_uploaded_file($tmp_archivo, $archivador)) {
              $res = $u->actualizar_foto_user($nomFile, $_POST["idUsuario"]);
              if($res) {
                $g->bitacora('Archivo subido: '.$nomFile, $_POST["idUsuario"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
                echo json_encode(['estatus' => 200, 'mensaje' => 'ok', 'data' => [$nomFile]]);  
              } else {
                if(file_exists($archivador)) {
                  unlink($archivador);
                }
                echo json_encode(['estatus' => 208, 'mensaje' => 'Hubo un problema en el update', 'data' => []]);  
              }
            } else {
              echo json_encode(['estatus' => 208, 'mensaje' => 'Hubo un problema con la subida del archivo', 'data' => []]);
            }
          } else {
            echo json_encode(['estatus' => 207, 'mensaje' => 'Valores obligatorios', 'data' => []]);
          }
          
        break;

        case 'consulta_log':

          if(empty($_POST["fecIni"]) || empty($_POST["fecFin"])) {
              echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
              break;
          }
          // Validar que la diferencia no sea mayor a 30 días
          $fechaInicio = new DateTime($_POST["fecIni"]);
          $fechaFin    = new DateTime($_POST["fecFin"]);
          $diff        = $fechaInicio->diff($fechaFin);

          if ($diff->days > 30) {
            echo json_encode(["estatus" => 500, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
            break;
          }

          $fecha_ini = $_POST["fecIni"].' 00:00:00';
          $fecha_fin = $_POST["fecFin"].' 23:59:59';

          $res = $u->consulta_log($fecha_ini, $fecha_fin, $_POST["idUsuario"]);
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
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