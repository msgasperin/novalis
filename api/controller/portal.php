<?php
   require_once('../model/Portal.php');
   require_once('../model/Globales.php');
   $v = new Portal();
   $g = new Globales();
   $_POST = json_decode(file_get_contents("php://input"), true);
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
      switch ($_POST['func']) {

         //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ PROMOCIONES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
         case 'obtiene_promociones':
            $res = $v->obtiene_promociones();          
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guarda_promocion':

            if($_SESSION["perfil"] != 'ADMINISTRADOR') {
            $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
            echo json_encode($res);
            break;
            }

            
            if(!isset($_POST["idPromocion"]) || empty($_POST["nomPromocion"]) || $_POST["badgePromocion"] == 'NA' || empty($_POST["precioOriginal"]) || empty($_POST["precioPromocion"]) || empty($_POST["arrEstudiosPromo"]) ) {
            $res = array('estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data'=> []);
            echo json_encode($res);
            break;
            }

            $estudiosPromo = isset($_POST["arrEstudiosPromo"]) ? json_encode($_POST["arrEstudiosPromo"], JSON_UNESCAPED_UNICODE) : json_encode([]);

            if($_POST["idPromocion"] == '0') {
            $res              = $v->guarda_promocion($_POST, $estudiosPromo, $_SESSION["nombre"]);
            $id_promocion     = $res["data"][0];
            $mensaje_bitacora = 'Promoción de portal registrada: '.$_POST["nomPromocion"];
            } 
            else {
            $id_promocion     = $_POST["idPromocion"];
            $res              = $v->actualiza_promocion($_POST, $estudiosPromo, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Promoción de portal modificada: '.$_POST["nomPromocion"];
            }

            if($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $id_promocion, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }

            echo json_encode($res);
         break;

         case 'elimina_promocion':

            if($_SESSION["perfil"] != 'ADMINISTRADOR') {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if(empty($_POST["idPromocion"]) || empty($_POST["nomPromocion"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $response = $v->elimina_promocion($_POST["idPromocion"]);
            if($response) {
               $res = array('estatus' => 200, 'data'=>[], 'mensaje' => 'ok');
               $g->bitacora('Promoción de portal eliminada: '.$_POST["nomPromocion"], $_POST["idPromocion"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'data'=>[], 'mensaje' => 'error al intentar eliminar la promoción');
            }
            
            echo json_encode($res);
         break;

         //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ WHATSAPP +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
         case 'actualiza_whats':

            if($_SESSION["perfil"] != 'ADMINISTRADOR') {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if(empty($_POST["whatsapp"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Debes ingresar el nuevo número de whatsApp', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->actualiza_whats($_POST["whatsapp"]);

            if($res["estatus"] == 200) {
               $g->bitacora('Contacto whatsApp de portal actualizado ', 0, $_SESSION["id_usuario"], $_SESSION["nombre"]);
               $_SESSION["emp_whats"] = $_POST["whatsapp"];
            }
            
            echo json_encode($res);
         break;

         //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ PUBLICAR CAMBIOS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

         case 'publica_cambios':

            if($_SESSION["perfil"] != 'ADMINISTRADOR') {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $response = ['estatus' => 200, 'mensaje' => 'No hubo información que actualizar', 'data' => []];

            $res = $v->publica_cambios();


            if($res["trae_datos"]) {

               $host = $_SERVER['HTTP_HOST'];
               $parts = explode('.', $host);
               $subdominio = (count($parts) >= 3) ? $parts[0] : 'default';

               $jsonPath   = "../config/json/{$subdominio}.json"; // Ajusta la ruta a tu proyecto

               if (!file_exists($jsonPath)) {
                  die("El archivo JSON de configuración no existe en la ruta: " . $jsonPath);
               }

               $jsonContent = file_get_contents($jsonPath);
               $config = json_decode($jsonContent, true) ?? [];

               if (isset($res["whatsapp"])) {
                  $config['contacto']['whatsapp'] = '+52'.$res['whatsapp'];
               }

               if (!empty($res['promociones']) && is_array($res['promociones'])) {
                  $nuevasPromociones = [];

                  foreach ($res['promociones'] as $index => $promo) {
                     // Decodificar el JSON de los estudios incluidos
                     $estudiosRaw = is_string($promo['estudios']) ? json_decode($promo['estudios'], true) : $promo['estudios'];
                     $listaEstudios = [];

                     if (is_array($estudiosRaw)) {
                        foreach ($estudiosRaw as $item) {
                           if (isset($item['estudio'])) {
                              $listaEstudios[] = $item['estudio'];
                           }
                        }
                     }

                     // Determinar si es destacado (ejemplo: si el badge dice "RECOMENDADO" o por posición)
                     $isDestacado = (strtoupper($promo['badge'] ?? '') === 'RECOMENDADO');

                     $nuevasPromociones[] = [
                        'titulo'         => $promo['nom_promocion'] ?? '',
                        'destacado'      => $isDestacado,
                        'badge'          => ucfirst(strtolower($promo['badge'] ?? 'Oferta')),
                        'precio_regular' => isset($promo['precio_original']) ? '$' . number_format($promo['precio_original'], 0) : '',
                        'precio_oferta'  => isset($promo['precio_promocion']) ? '$' . number_format($promo['precio_promocion'], 0) : '',
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

               // 7. Guardar el JSON actualizado de forma segura con LOCK_EX
               $nuevoJsonString = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

               if (file_put_contents($jsonPath, $nuevoJsonString, LOCK_EX) !== false) {
                  $response["mensaje"] = 'Información actualizada correctamente';
               } else {
                  $response["estatus"] = 500;
                  $response["mensaje"] = 'Hubo un problema para actualizar la información a publicar';
               }

               //$g->bitacora('Cabios de portal publicados ', 0, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
                       
            echo json_encode($response);
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