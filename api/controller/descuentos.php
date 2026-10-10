<?php
  header('Content-Type: application/json; charset=utf-8');
  require_once('../model/Descuentos.php');
  require_once('../model/Globales.php');

  $v = new Descuentos();
  $g = new Globales();

  $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
  if (strpos($contentType, "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
  }

  if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
    if (isset($_POST['func'])) {

        // ── Validación CSRF para acciones de escritura / modificación ──
        if (in_array($_POST['func'], ['guardar_descuento', 'eliminar_descuento'])) {
          $csrf_recibido = $_POST['CSRF_TOKEN'] ?? $_POST['csrf'] ?? '';
          $csrf_sesion   = $_SESSION['csrf_token'] ?? '';

          if (empty($csrf_recibido) || empty($csrf_sesion) || !hash_equals($csrf_sesion, $csrf_recibido)) {
              echo json_encode([
                'estatus' => 422,
                'mensaje' => 'Petición no autorizada (Token CSRF inválido), reinicia sesión e inténtalo de nuevo',
                'data'    => []
              ]);
              exit;
          }
        }

        switch ($_POST['func']) {

          case 'obtiene_descuentos':
              $res = $v->obtiene_descuentos();          
              echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          break;

          case 'guardar_descuento':
              if (($_SESSION["perfil"] ?? '') !== 'ADMINISTRADOR') {
                echo json_encode(['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []]);
                break;
              }

              if (!isset($_POST["idDescuento"]) || empty($_POST["conceptoDescuento"]) || empty($_POST["porcentajeDescuento"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                break;
              }

              $idDescuento = (int)$_POST["idDescuento"];

              if ($idDescuento === 0) {
                $res                  = $v->guardar_descuento($_POST, $_SESSION["nombre"]);
                $id_descuento_bitacora = (int)($res["data"][0] ?? 0);
                $mensaje_bitacora     = 'Descuento registrado: ' . $_POST["conceptoDescuento"];
              } 
              else {
                $id_descuento_bitacora = $idDescuento;
                $res                  = $v->actualizar_descuento($_POST, $_SESSION["nombre"]);
                $mensaje_bitacora     = 'Descuento modificado: ' . $_POST["conceptoDescuento"];
              }

              if ($res["estatus"] == 200) {
                $g->bitacora($mensaje_bitacora, $id_descuento_bitacora, $_SESSION["id_usuario"], $_SESSION["nombre"]);
              }

              echo json_encode($res);
          break;

          case 'eliminar_descuento':
              if (($_SESSION["perfil"] ?? '') !== 'ADMINISTRADOR') {
                echo json_encode(['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []]);
                break;
              }

              if (empty($_POST["idDescuento"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                break;
              }

              $idDescuento = (int)$_POST["idDescuento"];
              $concepto    = $_POST["conceptoDescuento"] ?? '';
              $res         = $v->eliminar_descuento($idDescuento);

              if ($res["estatus"] == 200) {
                $g->bitacora('Descuento eliminado: ' . $concepto, $idDescuento, $_SESSION["id_usuario"], $_SESSION["nombre"]);
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
  } else {
    echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", "data" => []]);
  }
?>