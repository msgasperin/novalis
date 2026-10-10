<?php
  header('Content-Type: application/json');
  require_once('../model/Sucursales.php');
  require_once('../model/Globales.php');
  
  $v = new Sucursales();
  $g = new Globales();
  $_POST = json_decode(file_get_contents("php://input"), true);
  
  if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
    if (isset($_POST['func'])) {

      // ── Validación CSRF para acciones de escritura / modificación ──
      if (in_array($_POST['func'], ['guardar', 'eliminar'])) {
        $csrf_recibido = $_POST['CSRF_TOKEN'] ?? '';
        $csrf_sesion   = $_SESSION['csrf_token'] ?? '';

        if (empty($csrf_recibido) || empty($csrf_sesion) || !hash_equals($csrf_sesion, $csrf_recibido)) {
          echo json_encode([
            'estatus' => 422,
            'mensaje' => 'Petición no autorizada (Token CSRF inválido), reincia sesión e inténtalo de nuevo',
            'data'    => []
          ]);
          exit;
        }
      }

      switch ($_POST['func']) {

        case 'obtiene_sucursales':
          $res = $v->obtiene_sucursales();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'guardar':
          if ($_SESSION["perfil"] != 'ADMINISTRADOR') {
            echo json_encode(['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []]);
            break;
          }

          if (!isset($_POST["idSucursal"]) || empty(trim($_POST["nomSucursal"])) || empty(trim($_POST["direccionSucursal"]))) {
            echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios', 'data' => []]);
            break;
          }

          // Tipado explícito de datos
          $_POST["idSucursal"] = (int)$_POST["idSucursal"];
          $_POST["matriz"]     = (int)$_POST["matriz"];

          if ($_POST["idSucursal"] === 0) {
            $res              = $v->guardar_sucursal($_POST, $_SESSION["nombre"]);
            $id_registro      = $res["data"][0] ?? 0;
            $mensaje_bitacora = 'Sucursal registrada: ' . $_POST["nomSucursal"];
          } 
          else {
            $id_registro      = $_POST["idSucursal"];
            $res              = $v->actualizar_sucursal($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Sucursal modificada: ' . $_POST["nomSucursal"];
          }

          if ($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $id_registro, $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }

          echo json_encode($res);
        break;

        case 'eliminar':
          if ($_SESSION["perfil"] != 'ADMINISTRADOR') {
            echo json_encode(['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []]);
            break;
          }

          if (empty($_POST["idSucursal"]) || empty($_POST["nomSucursal"])) {
            echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios', 'data' => []]);
            break;
          }

          $idSucursal = (int)$_POST["idSucursal"];
          $response   = $v->eliminar_sucursal($idSucursal);

          if ($response) {
            $res = ['estatus' => 200, 'data' => [], 'mensaje' => 'ok'];
            $g->bitacora('Sucursal eliminada: ' . $_POST["nomSucursal"], $idSucursal, $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          else {
            $res = ['estatus' => 500, 'data' => [], 'mensaje' => 'Error al intentar eliminar la sucursal'];
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