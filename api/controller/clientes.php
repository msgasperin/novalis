<?php
  require_once('../model/Clientes.php');
  require_once('../model/Globales.php');
  $c = new Clientes();
  $g = new Globales();

  $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
  if (strpos($contentType, "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
  } 
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {

        // Funciones de CRUD de clientes
        case 'obtiene_categorias_clientes':
          $res = $c->obtiene_categorias_clientes();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'guardar_categoria':

          if(!isset($_POST["idCategoria"]) || empty($_POST["nomCategoria"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
            echo json_encode($res);
            break;
          }

          if($_POST["idCategoria"] == '0') {
            $res = $c->guardar_categoria($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Categoria registrada: '.$_POST["nomCategoria"];
            $id_categoria     = $res["data"][0];
          } 
          else {
            $id_categoria = $_POST["idCategoria"];
            $res = $c->actualizar_categoria($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Categoria modificada: '.$_POST["nomCategoria"];
          }

          if($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $id_categoria, $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          echo json_encode($res);
        break;

        case 'eliminar_categoria':
          
          if(empty($_POST["idCategoria"]) || empty($_POST["nomCategoria"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
            echo json_encode($res);
            break;
          }

          $response = $c->eliminar_categoria($_POST["idCategoria"]);
          if($response) {
            $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
            $g->bitacora('Categoría eliminada: '.$_POST["nomCategoria"], $_POST["idCategoria"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          else {
            $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar cliente', 'data'=>[]);
          }
          
          echo json_encode($res);
        break;

        case 'obtiene_clientes_saldos':
          $res = $c->obtiene_clientes_saldos($_SESSION["perfil"]);          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'obtiene_clientes':
          $res = $c->obtiene_clientes();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'guardar':

          if(!isset($_POST["idCliente"]) || empty($_POST["nomCliente"]) || empty($_POST["idCategoria"]) || empty($_POST["idListaPrecios"]) || !isset($_POST["diasCreditoCliente"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
            echo json_encode($res);
            break;
          }

          if($_POST["idCliente"] == '0') {
            $res = $c->guardar_cliente($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Cliente registrado: '.$_POST["nomCliente"];
            $id_cliente = $res["data"][0];
          } 
          else {
            $id_cliente = $_POST["idCliente"];
            $res = $c->actualizar_cliente($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Cliente modificado: '.$_POST["nomCliente"];
          }

          if($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $id_cliente, $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          echo json_encode($res);
        break;

        case 'eliminar':

          if(empty($_POST["idCliente"]) || empty($_POST["nomCliente"])) {
            $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
            echo json_encode($res);
            break;
          }

          $response = $c->eliminar_cliente($_POST["idCliente"]);
          if($response) {
            $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
            $g->bitacora('Cliente eliminado: '.$_POST["nomCliente"], $_POST["idCliente"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          else {
            $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar cliente', 'data'=>[]);
          }
          
          echo json_encode($res);
        break;

        case 'subir_logo_cliente':
          if(isset($_POST["idCliente"]) and trim($_POST["idCliente"])) {
            $nombre_archivo = $_FILES['logo']['name'];	
            $tmp_archivo    = $_FILES['logo']['tmp_name'];		
            $ext            = explode(".",$_FILES['logo']['name']);
            $extension      = end($ext);
            $nomFile        = $_POST["idCliente"].'.'.$extension;
            $upload_folder  = '../../webapp/assets/images/logos_clientes/';
            $archivador     = $upload_folder.$nomFile;

            $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'webp'];
            if (!in_array(strtolower($extension), $extensiones_permitidas)) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Tipo de archivo no permitido', 'data' => []]);
                break;
            }
            if(move_uploaded_file($tmp_archivo, $archivador)) {
              $res = $c->actualiza_logo_cliente($nomFile, $_POST["idCliente"]);
              if($res) {
                $g->bitacora('Logo subido: '.$nomFile, $_POST["idCliente"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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