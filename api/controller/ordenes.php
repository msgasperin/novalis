<?php
  require_once('../model/Ordenes.php');
  require_once('../model/Globales.php');
  /** @var string $bd_cliente */ // <- Esto le dice a VS Code de qué tipo es
   $v = new Ordenes($bd_cliente);
   $g = new Globales($bd_cliente);
  $_POST = json_decode(file_get_contents("php://input"), true);
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++ CARRITO DE ESTUDIOS  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        case 'obtiene_estudios_recepcion':
          $estudiosIndexados = [];
          $res = $v->obtiene_estudios_recepcion($_POST["tipoSolicitante"], $_POST["idListaPrecio"]);
          foreach ($res as $estudio) {
            $estudiosIndexados[$estudio["id"]] = $estudio;
          }
          $_SESSION["estudios_orden"] = $estudiosIndexados;
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'agregar_estudio_carrito':
          $estudio = $_SESSION["estudios_orden"][$_POST["idEstudio"]] ?? null;

          if(empty($_POST["idEstudio"])) {
            $res = ['estatus' => 406, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
            echo json_encode($res);
            break;
          }

          if($estudio) {
              $id_estudio = $_POST["idEstudio"];
              $id         = $id_estudio.'_'.rand(0,200);
              
              $precio     = (float)$estudio["precio_publico"];
              $costo      = (float)$estudio["costo"];
              $utilidad   = $precio - $costo;
              
              $_SESSION["carrito_orden"][$id] = [
                'id'                  => $id,
                'id_estudio'          => $id_estudio,
                'nom_estudio'         => $estudio["nombre"],
                'precio'              => $precio,
                'costo'               => $costo,
                'utilidad'            => $utilidad,
                'descripcion_estudio' => $estudio["descripcion_estudio"],
                'indicaciones_toma'   => $estudio["indicaciones_toma"]
              ];

              $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $_SESSION["carrito_orden"]];
          }
          else {               
              $res = ['estatus' => 400, 'mensaje' => 'error', 'data' => $_SESSION["carrito_orden"]];
          }

          echo json_encode($res);
        break;

        case 'borrar_carrito_recepcion':
          if(isset($_SESSION["carrito_orden"])) {
            unset($_SESSION["carrito_orden"]);
          }
          
          $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];

          echo json_encode($res);
        break;

        case 'borrar_estudio_carrito':
          if(isset($_SESSION["carrito_orden"][$_POST["idCarrito"]])) {
              unset($_SESSION["carrito_orden"][$_POST["idCarrito"]]);
              $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $_SESSION["carrito_orden"]];
          }
          else {
              $res = ['estatus' => 500, 'mensaje' => 'error', 'data' => $_SESSION["carrito_orden"]];
          }

          echo json_encode($res);
        break;

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ GUARDADO ORDEN DE TRABAJO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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