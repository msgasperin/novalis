<?php
   header('Content-Type: application/json; charset=utf-8');
   require_once('../model/DatosFacturacion.php');
   require_once('../model/Globales.php');

   $v = new DatosFacturacion();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   }

   if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
      if (isset($_POST['func'])) {

         // ── Validación CSRF para acciones de escritura / modificación ──
         if (in_array($_POST['func'], ['guarda_datos_facturacion', 'elimina_datos_facturacion'])) {
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

            case 'obtiene_datos_facturacion':
               if (empty($_POST["tipoReceptor"]) || !isset($_POST["idReceptor"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $res = $v->obtiene_datos_facturacion($_POST["tipoReceptor"], (int)$_POST["idReceptor"]);          
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'guarda_datos_facturacion':
               if (
                  !isset($_POST["idUsoCfdiFact"]) || $_POST["idUsoCfdiFact"] === '000' || 
                  !isset($_POST["idRegimenFiscalFact"]) || $_POST["idRegimenFiscalFact"] === '000' || 
                  empty($_POST["rfcFact"]) || empty($_POST["razonSocialFact"]) || 
                  empty($_POST["codigoPostalFact"]) || empty($_POST["correoFact"])
               ) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para guardar los datos de facturación', 'data' => []]);
                  break;
               }

               $idDatoFacturacion = (int)($_POST["idDatoFacturacion"] ?? 0);

               if ($idDatoFacturacion === 0) {
                  $res                  = $v->guardar_datos_facturacion($_POST, $_SESSION["nombre"]);
                  $id_dato_facturacion  = (int)($res["data"][0] ?? 0);
                  $mensaje_bitacora     = 'Datos de facturación registrados: ' . $_POST["razonSocialFact"];
               } 
               else {
                  $id_dato_facturacion  = $idDatoFacturacion;
                  $res                  = $v->actualizar_datos_facturacion($_POST, $_SESSION["nombre"]);
                  $mensaje_bitacora     = 'Datos de facturación modificados: ' . $_POST["razonSocialFact"];
               }

               if ($res["estatus"] == 200) {
                  $g->bitacora($mensaje_bitacora, $id_dato_facturacion, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }

               echo json_encode($res);
            break;

            case 'elimina_datos_facturacion':
               $idDatoFact = (int)($_POST["idDatoFacturacion"] ?? $_POST["idDatosFacturacion"] ?? 0);
               $razonSocial = $_POST["razonSocial"] ?? $_POST["nomReceptor"] ?? '';

               if ($idDatoFact === 0) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $res = $v->eliminar_dato_facturacion($idDatoFact);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Datos de facturación eliminados: ' . $razonSocial, $idDatoFact, $_SESSION["id_usuario"], $_SESSION["nombre"]);
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