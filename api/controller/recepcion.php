<?php
  header('Content-Type: application/json; charset=utf-8');
  require_once('../model/Recepcion.php');
  require_once('../model/Globales.php');

  $v = new Recepcion();
  $g = new Globales();

  $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
  if (strpos($contentType, "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
  }

  if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
    if (isset($_POST['func'])) {

        // ── Validación CSRF para acciones de escritura / mutación ──
        if (in_array($_POST['func'], [
          'agregar_estudio_carrito', 'borrar_carrito_recepcion', 'borrar_estudio_carrito', 
          'registrar_orden', 'registra_abono', 'elimina_abono', 'cancela_orden', 
          'marcar_orden_como_entregada'
        ])) {
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

          // ── CARRITO DE ESTUDIOS ──
          case 'obtiene_estudios_recepcion':
              $tipoSolicitante = $_POST["tipoSolicitante"] ?? 'particular';
              $idListaPrecio   = (int)($_POST["idListaPrecio"] ?? 0);

              $estudiosIndexados = [];
              $res = $v->obtiene_estudios_recepcion($tipoSolicitante, $idListaPrecio);
              foreach ($res as $estudio) {
                $estudiosIndexados[$estudio["id"]] = $estudio;
              }
              $_SESSION["estudios_orden"] = $estudiosIndexados;
              echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          break;

          case 'obtiene_ordenes_hoy':
              $res = $v->obtiene_ordenes_hoy((int)$_SESSION["id_sucursal"]);
              echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          break;

          case 'busqueda_avanzada_ordenes':
              $filtro    = $_POST["filtro"] ?? 'paciente';
              $parametro = trim($_POST["parametro"] ?? '');
              $estatus   = $_POST["estatus"] ?? 'TODOS';

              $res = $v->busqueda_avanzada_ordenes((int)$_SESSION["id_sucursal"], $filtro, $parametro, $estatus);
              echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          break;

          case 'agregar_estudio_carrito':
              $idEstudio = (int)($_POST["idEstudio"] ?? 0);
              $estudio   = $_SESSION["estudios_orden"][$idEstudio] ?? null;

              if ($idEstudio <= 0) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Faltaron parámetros obligatorios', 'data' => []]);
                break;
              }

              if ($estudio) {
                $id       = $idEstudio . '_' . rand(100, 999);
                $precio   = (float)$estudio["precio_publico"];
                $costo    = (float)$estudio["costo"];
                $utilidad = $precio - $costo;
                
                $_SESSION["carrito_orden"][$id] = [
                    'id'                  => $id,
                    'id_estudio'          => $idEstudio,
                    'nom_estudio'         => $estudio["nombre"],
                    'precio'              => $precio,
                    'costo'               => $costo,
                    'utilidad'            => $utilidad,
                    'descripcion_estudio' => $estudio["descripcion_estudio"],
                    'indicaciones_toma'   => $estudio["indicaciones_toma"],
                    'aplica_desc'         => $estudio["aplica_desc"]
                ];

                $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $_SESSION["carrito_orden"]];
              } else {               
                $res = ['estatus' => 400, 'mensaje' => 'El estudio no fue encontrado en la sesión', 'data' => $_SESSION["carrito_orden"] ?? []];
              }

              echo json_encode($res);
          break;

          case 'borrar_carrito_recepcion':
              if (isset($_SESSION["carrito_orden"])) {
                unset($_SESSION["carrito_orden"]);
              }
              echo json_encode(['estatus' => 200, 'mensaje' => 'ok', 'data' => []]);
          break;

          case 'borrar_estudio_carrito':
              $idCarrito = $_POST["idCarrito"] ?? '';

              if (isset($_SESSION["carrito_orden"][$idCarrito])) {
                unset($_SESSION["carrito_orden"][$idCarrito]);
                $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $_SESSION["carrito_orden"]];
              } else {
                $res = ['estatus' => 400, 'mensaje' => 'El item no existe en el carrito', 'data' => $_SESSION["carrito_orden"] ?? []];
              }

              echo json_encode($res);
          break;

          // ── REGISTRO ORDEN DE TRABAJO ──
          case 'registrar_orden':
              if (empty($_SESSION["id_caja"])) {
                echo json_encode(['estatus' => 500, 'mensaje' => 'No hay una sesión de caja activa, es necesaria para realizar esta acción', 'data' => []]);
                break;
              }

              if (empty($_POST["idPaciente"]) || empty($_POST["nomPaciente"]) || empty($_POST["sexo"]) || empty($_POST["tipoCliente"]) || !isset($_POST["idPrecio"]) || !isset($_POST["abonoOrden"]) || !isset($_POST["metodoPagoOrden"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros necesarios y obligatorios', 'data' => []]);
                break;
              }

              if (!isset($_SESSION["carrito_orden"]) || empty($_SESSION["carrito_orden"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Hubo un problema para obtener el listado de productos agregados', 'data' => []]);
                break;
              }

              $subtotal       = 0;
              $montoDescuento = 0;
              $porDescuento   = (float)($_POST["porDescuento"] ?? 0);
              $cargoExtra     = (float)($_POST["cargoExtraOrden"] ?? 0);
              $totalConDesc   = 0;

              foreach ($_SESSION["carrito_orden"] as $item) {
                $precioItem = (float)$item["precio"];
                $subtotal  += $precioItem;

                if (($item["aplica_desc"] ?? 'NO') === 'SI') {
                    $totalConDesc += $precioItem;
                }
              }

              $montoDescuento = round(($totalConDesc * $porDescuento) / 100);
              $total_neto     = ($subtotal - $montoDescuento) + $cargoExtra;
              if ($total_neto < 0) {
                $total_neto = 0;
              }

              $_POST["subtotal"]       = $subtotal;
              $_POST["montoDescuento"] = $montoDescuento;
              $_POST["total_neto"]     = $total_neto;
              $_POST["cargoExtra"]     = $cargoExtra;
              
              $res = $v->registrar_orden($_POST, $_SESSION["carrito_orden"], (int)$_SESSION["id_usuario"], $_SESSION["nombre"], (int)$_SESSION["id_sucursal"], $_SESSION["sucursal"], (int)$_SESSION["id_caja"]);
              
              if ($res["estatus"] == 200) {
                $g->bitacora('Orden registrada con folio: ' . $res["data"][1], (int)$res["data"][0], (int)$_SESSION["id_usuario"], $_SESSION["nombre"]);
                unset($_SESSION["carrito_orden"]);
              }
                          
              echo json_encode($res);
          break;

          // ── ABONOS ──
          case 'obtener_saldos_orden':
              if (empty($_POST["idOrden"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Parámetro no enviado', 'data' => []]);
                break;
              }

              $res = $v->obtiene_saldos_orden((int)$_POST["idOrden"]);
              echo json_encode(["estatus" => 200, "mensaje" => "ok", "data" => $res]);
          break;

          case 'obtener_abonos_orden':
              if (empty($_POST["idOrden"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Parámetro no enviado', 'data' => []]);
                break;
              }

              $res = $v->obtener_abonos_orden((int)$_POST["idOrden"]);
              echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          break;       

          case 'registra_abono':
              if (empty($_SESSION["id_caja"])) {
                echo json_encode(['estatus' => 500, 'mensaje' => 'No hay una sesión de caja activa, es necesaria para realizar esta acción', 'data' => []]);
                break;
              }
              
              if (empty($_POST["idOrden"]) || empty($_POST["monto"]) || !isset($_POST["metodoPago"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                break;
              }

              $idOrden    = (int)$_POST["idOrden"];
              $monto      = (float)$_POST["monto"];
              $metodoPago = trim($_POST["metodoPago"]);

              $res = $v->registrar_abono($idOrden, $monto, $metodoPago, (int)$_SESSION["id_sucursal"], (int)$_SESSION["id_usuario"], $_SESSION["nombre"], (int)$_SESSION["id_caja"]);

              if ($res["estatus"] == 200) {
                $g->bitacora('Abono registrado con ID: ' . $res["data"][0] . ' a la orden: ' . $idOrden, $idOrden, (int)$_SESSION["id_usuario"], $_SESSION["nombre"]);
                $saldos = $v->obtiene_saldos_orden($idOrden);
                $res    = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $saldos];
              }            
              echo json_encode($res);
          break;

          case 'elimina_abono':
              if (empty($_POST["idOrden"]) || empty($_POST["idAbono"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                break;
              }

              $idAbono = (int)$_POST["idAbono"];
              $idOrden = (int)$_POST["idOrden"];
              $res     = $v->eliminar_abonos($idAbono);

              if ($res["estatus"] == 200) {
                $g->bitacora('Abono eliminado con ID: ' . $idAbono . ' a la orden: ' . $idOrden, $idOrden, (int)$_SESSION["id_usuario"], $_SESSION["nombre"]);
                $saldos = $v->obtiene_saldos_orden($idOrden);
                $res    = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $saldos];
              }            
              echo json_encode($res);
          break;

          // ── CANCELACIÓN ──
          case 'cancela_orden':
              if (empty($_POST["idOrden"]) || empty($_POST["folioOrden"]) || empty($_POST["motivo"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios', 'data' => []]);
                break;
              }

              $idOrden    = (int)$_POST["idOrden"];
              $folioOrden = trim($_POST["folioOrden"]);
              $motivo     = trim($_POST["motivo"]);

              $res = $v->cancelar_orden($idOrden, $motivo, $_SESSION["nombre"]);

              if ($res["estatus"] == 200) {
                $g->bitacora('Orden cancelada con Folio: ' . $folioOrden, $idOrden, (int)$_SESSION["id_usuario"], $_SESSION["nombre"]);
              }            
              echo json_encode($res);
          break;

          // ── ENTREGA DE RESULTADOS ──
          case 'marcar_orden_como_entregada':
              if (empty($_POST["idOrden"]) || empty($_POST["folio"])) {
                echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan campos obligatorios', 'data' => []]);
                break;
              }

              $idOrden = (int)$_POST["idOrden"];
              $folio   = trim($_POST["folio"]);
              
              $res = $v->marcar_orden_como_entregada($idOrden, $_SESSION["nombre"]);

              if ($res["estatus"] == 200) {
                $g->bitacora('Orden marcada como entregada (' . $folio . ')', $idOrden, (int)$_SESSION["id_usuario"], $_SESSION["nombre"]);
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