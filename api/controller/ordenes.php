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

        case 'obtiene_ordenes_hoy':
          $res = $v->obtiene_ordenes_hoy($_SESSION["id_sucursal"]);
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
                'indicaciones_toma'   => $estudio["indicaciones_toma"],
                'aplica_desc'         => $estudio["aplica_desc"]
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
        
        case 'registrar_orden':

            if(empty($_POST["idPaciente"]) || empty($_POST["nomPaciente"]) || empty($_POST["sexo"]) || empty($_POST["tipoCliente"]) || !isset($_POST["idPrecio"]) || !isset($_POST["abonoOrden"]) || !isset($_POST["metodoPagoOrden"])) {
              $res = ['estatus' => 406, 'mensaje' => 'Faltan parámetros necesarios y obligatorios', 'data' => []];
              echo json_encode($res);
              break;
            }

            if(!isset($_SESSION["carrito_orden"]) || empty($_SESSION["carrito_orden"])) {
              $res     = ['estatus' => 406, 'mensaje' => 'Hubo un problema para obtener el listado de productos', 'data' => []];
              echo json_encode($res);
              break;
            }

            $subtotal       = 0;
            $montoDescuento = 0;
            $porDescuento   = floatval($_POST["porDescuento"] ?? 0);
            $cargoExtra     = floatval($_POST["cargoExtraOrden"] ?? 0);

            foreach ($_SESSION["carrito_orden"] as $item) {
              $precioItem = floatval($item["precio"]);
              $subtotal  += $precioItem;

              // Se aplica descuento si el porcentaje es mayor a 0 y el estudio lo permite
              if ($porDescuento > 0 && !empty($item["aplica_desc"])) {
                $montoDescuento += round(($precioItem * $porDescuento) / 100, 2);
              }
            }

            $total_neto = ($subtotal - $montoDescuento) + $cargoExtra;
            if ($total_neto < 0) {
              $total_neto = 0;
            }

            if (!isset($_POST["objOrden"]) || !is_array($_POST["objOrden"])) {
              $_POST["objOrden"] = [];
            }

            $_POST["subtotal"]        = $subtotal;
            $_POST["montoDescuento"]  = $montoDescuento;
            $_POST["total_neto"]      = $total_neto;
            $_POST["cargoExtra"]      = $cargoExtra;
            
            $res = $v->registrar_orden($_POST, $_SESSION["carrito_orden"], $_SESSION["nombre"], $_SESSION["id_sucursal"]);
            if($res["estatus"] == 200) {
              $g->bitacora('Orden registrada con folio: '.$res["data"][1], $res["data"][0] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
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