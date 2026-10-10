<?php
   header('Content-Type: application/json; charset=utf-8');
   require_once('../model/Portal.php');
   require_once('../model/Globales.php');

   $v = new Portal();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   }

   if (isset($_SESSION["id_usuario"]) && !empty($_SESSION["id_usuario"])) {
      if (isset($_POST['func'])) {

         // ── Validación CSRF para acciones de escritura / modificación ──
         if (in_array($_POST['func'], ['guarda_promocion', 'elimina_promocion', 'actualiza_whats', 'publica_cambios'])) {
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

            // ── PROMOCIONES ──
            case 'obtiene_promociones':
               $res = $v->obtiene_promociones();          
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            break;

            case 'guarda_promocion':
               if (($_SESSION["perfil"] ?? '') !== 'ADMINISTRADOR') {
                  echo json_encode(['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []]);
                  break;
               }

               if (!isset($_POST["idPromocion"]) || empty($_POST["nomPromocion"]) || ($_POST["badgePromocion"] ?? 'NA') === 'NA' || empty($_POST["precioOriginal"]) || empty($_POST["precioPromocion"]) || empty($_POST["arrEstudiosPromo"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros obligatorios para realizar esta acción', 'data' => []]);
                  break;
               }

               $idPromocion = (int)$_POST["idPromocion"];

               if (isset($_POST["arrEstudiosPromo"]) && is_array($_POST["arrEstudiosPromo"])) {
                  $estudiosPromo = json_encode($_POST["arrEstudiosPromo"], JSON_UNESCAPED_UNICODE);
               } else if (isset($_POST["estudiosPromoPortal"]) && is_string($_POST["estudiosPromoPortal"])) {
                  $estudiosPromo = $_POST["estudiosPromoPortal"];
               } else {
                  $estudiosPromo = json_encode([], JSON_UNESCAPED_UNICODE);
               }

               if ($idPromocion === 0) {
                  $res              = $v->guarda_promocion($_POST, $estudiosPromo, $_SESSION["nombre"]);
                  $id_promocion     = (int)($res["data"][0] ?? 0);
                  $mensaje_bitacora = 'Promoción de portal registrada: ' . $_POST["nomPromocion"];
               } 
               else {
                  $id_promocion     = $idPromocion;
                  $res              = $v->actualiza_promocion($_POST, $estudiosPromo, $_SESSION["nombre"]);
                  $mensaje_bitacora = 'Promoción de portal modificada: ' . $_POST["nomPromocion"];
               }

               if ($res["estatus"] == 200) {
                  $g->bitacora($mensaje_bitacora, $id_promocion, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }

               echo json_encode($res);
            break;

            case 'elimina_promocion':
               if (($_SESSION["perfil"] ?? '') !== 'ADMINISTRADOR') {
                  echo json_encode(['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []]);
                  break;
               }

               if (empty($_POST["idPromocion"]) || empty($_POST["nomPromocion"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []]);
                  break;
               }

               $idPromocion  = (int)$_POST["idPromocion"];
               $nomPromocion = $_POST["nomPromocion"];
               $res          = $v->elimina_promocion($idPromocion);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Promoción de portal eliminada: ' . $nomPromocion, $idPromocion, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
               
               echo json_encode($res);
            break;

            // ── WHATSAPP ──
            case 'actualiza_whats':
               if (($_SESSION["perfil"] ?? '') !== 'ADMINISTRADOR') {
                  echo json_encode(['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []]);
                  break;
               }

               if (empty($_POST["whatsapp"])) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Debes ingresar el nuevo número de whatsApp', 'data' => []]);
                  break;
               }

               $whatsapp = trim($_POST["whatsapp"]);
               $res      = $v->actualiza_whats($whatsapp);

               if ($res["estatus"] == 200) {
                  $g->bitacora('Contacto whatsApp de portal actualizado', 0, $_SESSION["id_usuario"], $_SESSION["nombre"]);
                  $_SESSION["emp_whats"] = $whatsapp;
               }
               
               echo json_encode($res);
            break;

            // ── PUBLICAR CAMBIOS ──
            case 'publica_cambios':
               if (($_SESSION["perfil"] ?? '') !== 'ADMINISTRADOR') {
                  echo json_encode(['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []]);
                  break;
               }

               $response = ['estatus' => 200, 'mensaje' => 'No hubo información que actualizar', 'data' => []];
               $res      = $v->publica_cambios();

               if (!empty($res["trae_datos"])) {

                  $host       = $_SERVER['HTTP_HOST'] ?? '';
                  $parts      = explode('.', $host);
                  $subdominio = (count($parts) >= 3) ? $parts[0] : 'default';

                  $jsonPath   = "../config/json/{$subdominio}.json";

                  if (!file_exists($jsonPath)) {
                     echo json_encode(['estatus' => 500, 'mensaje' => "El archivo JSON de configuración no existe en la ruta especificada.", 'data' => []]);
                     break;
                  }

                  $jsonContent = file_get_contents($jsonPath);
                  $config      = json_decode($jsonContent, true) ?? [];

                  if (!empty($res["whatsapp"])) {
                     $config['contacto']['whatsapp'] = '+52' . $res['whatsapp'];
                  }

                  if (!empty($res['promociones']) && is_array($res['promociones'])) {
                     $nuevasPromociones = [];

                     foreach ($res['promociones'] as $promo) {
                        $estudiosRaw   = is_string($promo['estudios']) ? json_decode($promo['estudios'], true) : $promo['estudios'];
                        $listaEstudios = [];

                        if (is_array($estudiosRaw)) {
                           foreach ($estudiosRaw as $item) {
                              if (!empty($item['estudio'])) {
                                 $listaEstudios[] = $item['estudio'];
                              }
                           }
                        }

                        $isDestacado = (strtoupper($promo['badge'] ?? '') === 'RECOMENDADO');

                        $nuevasPromociones[] = [
                           'titulo'         => $promo['nom_promocion'] ?? '',
                           'destacado'      => $isDestacado,
                           'badge'          => ucfirst(strtolower($promo['badge'] ?? 'Oferta')),
                           'precio_regular' => isset($promo['precio_original']) ? '$' . number_format((float)$promo['precio_original'], 2) : '',
                           'precio_oferta'  => isset($promo['precio_promocion']) ? '$' . number_format((float)$promo['precio_promocion'], 2) : '',
                           'incluye'        => $listaEstudios
                        ];
                     }

                     $config['promociones'] = $nuevasPromociones;
                  }

                  if (!empty($res['sucursales']) && is_array($res['sucursales'])) {
                     $nuevasSucursales = [];

                     foreach ($res['sucursales'] as $suc) {
                        $nuevasSucursales[] = [
                           'nombre'    => $suc['nombre'] ?? '',
                           'direccion' => $suc['direccion'] ?? '',
                           'telefono'  => $suc['telefono'] ?? ''
                        ];
                     }

                     $config['sucursales'] = $nuevasSucursales;
                  }

                  $nuevoJsonString = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

                  if (file_put_contents($jsonPath, $nuevoJsonString, LOCK_EX) !== false) {
                     $response["mensaje"] = 'Información actualizada correctamente';
                     $g->bitacora('Cambios de portal publicados', 0, $_SESSION["id_usuario"], $_SESSION["nombre"]);
                  } else {
                     $response["estatus"] = 500;
                     $response["mensaje"] = 'Hubo un problema para actualizar la información a publicar';
                  }
               }
                          
               echo json_encode($response);
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