<?php
   header('Content-Type: application/json; charset=utf-8');
   require_once('../model/Precios.php');
   require_once('../model/Globales.php');

   $v = new Precios();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   }

   if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
      if (isset($_POST['func'])) {

         // ── Validación CSRF para acciones de escritura / modificación ──
         if (in_array($_POST['func'], [
            'guardar_lista_precios', 'generar_lista_precios_base', 'vaciar_lista_precios', 
            'actualizar_generales_lista_precios', 'eliminar_lista_precios', 'marcar_precio_defecto', 
            'agregar_estudio_lista', 'actualizar_precio_especifico', 'eliminar_precio_especifico', 
            'actualizacion_masiva_precios'
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

            case 'obtiene_lista_precios':
               $res = $v->obtiene_lista_precios();          
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'guardar_lista_precios':
               if (empty($_POST["nomListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $res              = $v->guardar_lista_precios($_POST, $_SESSION["nombre"]);
               $mensaje_bitacora = 'Lista de precios registrada: ' . $_POST["nomListaPrecios"];
               $id_lista_precio  = (int)($res["data"][0] ?? 0); 

               if ($res["estatus"] == 200) {
                  $g->bitacora($mensaje_bitacora, $id_lista_precio, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               } else {
                  $g->bitacora($res["mensaje"], $id_lista_precio, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }

               echo json_encode($res);
            break;

            case 'generar_lista_precios_base':   
               if (empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idLista = (int)$_POST["idListaPrecios"];
               $res     = $v->generar_lista_precios_base($idLista, $_SESSION["nombre"]);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Precios base importados: ' . $_POST["nomListaPrecios"], $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'vaciar_lista_precios':
               if (empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idLista = (int)$_POST["idListaPrecios"];
               $res     = $v->vaciar_lista_precios($idLista);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Lista de precios vaciada: ' . $_POST["nomListaPrecios"], $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'actualizar_generales_lista_precios':   
               if (empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idLista = (int)$_POST["idListaPrecios"];
               $res     = $v->actualizar_generales_lista_precios($_POST, $_SESSION["nombre"]);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Actualización de generales de la lista de precios: ' . $_POST["nomListaPrecios"], $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'eliminar_lista_precios':
               if (empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idLista = (int)$_POST["idListaPrecios"];
               $res     = $v->eliminar_lista_precios($idLista);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Lista de precios eliminada: ' . $_POST["nomListaPrecios"], $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
               
               echo json_encode($res);
            break;

            case 'marcar_precio_defecto':
               if (empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idLista = (int)$_POST["idListaPrecios"];
               $res     = $v->marcar_precio_defecto($idLista);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Precio marcado por defecto: ' . $_POST["nomListaPrecios"], $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }

               echo json_encode($res);
            break;

            // ── CRUD cat_precios ──
            case 'obtiene_precios_lista':
               if (empty($_POST["idListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios', 'data' => []]);
                  break;
               }

               $res = $v->obtiene_precios_lista((int)$_POST["idListaPrecios"]);          
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'agregar_estudio_lista':
               if (empty($_POST["idListaPrecios"]) || empty($_POST["idEstudio"]) || empty($_POST["nomEstudio"]) || !isset($_POST["nuevoPrecio"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idLista = (int)$_POST["idListaPrecios"];
               $res     = $v->agregar_estudio_lista($_POST, $_SESSION["nombre"]);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Estudio agregado: ' . $_POST["nomEstudio"] . ' con precio $' . $_POST["nuevoPrecio"] . ' a la lista: ' . $_POST["nomListaPrecios"], $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }            
               echo json_encode($res);
            break;

            case 'actualizar_precio_especifico':
               if (empty($_POST["idPrecio"]) || !isset($_POST["nuevoPrecio"]) || empty($_POST["nomEstudio"]) || empty($_POST["nomListaPrecios"]) || empty($_POST["idListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idPrecio = (int)$_POST["idPrecio"];
               $idLista  = (int)$_POST["idListaPrecios"];
               $precio   = (float)$_POST["nuevoPrecio"];
               $res      = $v->actualizar_precio_especifico($idPrecio, $precio);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Precio actualizado a $' . $precio . ' del estudio: ' . $_POST["nomEstudio"] . ' de la lista: ' . $_POST["nomListaPrecios"], $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
               
               echo json_encode($res);
            break;

            case 'eliminar_precio_especifico':
               if (empty($_POST["idPrecio"]) || empty($_POST["nomEstudio"]) || empty($_POST["nomListaPrecios"]) || empty($_POST["idListaPrecios"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idPrecio = (int)$_POST["idPrecio"];
               $idLista  = (int)$_POST["idListaPrecios"];
               $res      = $v->eliminar_precio_especifico($idPrecio);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Precio eliminado: $' . ($_POST["precio"] ?? 0) . ' del estudio: ' . $_POST["nomEstudio"] . ' de la lista: ' . $_POST["nomListaPrecios"], $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
               
               echo json_encode($res);
            break;

            case 'actualizacion_masiva_precios':
               if (empty($_POST["idListaPrecios"]) || empty($_POST["subirBajar"]) || empty($_POST["porcentaje"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idLista    = (int)$_POST["idListaPrecios"];
               $subirBajar = $_POST["subirBajar"];
               $porcentaje = (float)$_POST["porcentaje"];

               if (in_array($subirBajar, ['Subir', 'Bajar'])) {
                  $res = $v->actualizacion_masiva_precios($idLista, $subirBajar, $porcentaje);
                  if ($res["estatus"] == 200) {
                     $g->bitacora('Actualización masiva de la lista de precios: ' . $_POST["nomListaPrecios"] . ', ' . $subirBajar . ': %' . $porcentaje, $idLista, $_SESSION["id_usuario"], $_SESSION["nombre"]);
                  }
               } else {
                  $res = ['estatus' => 400, 'mensaje' => 'Parámetro de actualización no válido', 'data' => []];
               }
               
               echo json_encode($res);
            break;

            default:
               echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", 'data' => []]);
            break;
         }
      }
      else {
         echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]);
      }
   } else {
      echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", 'data' => []]);
   }
?>