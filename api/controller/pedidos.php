<?php
   require_once('../model/Pedidos.php');
   require_once('../model/Globales.php');
   $p = new Pedidos();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         // ************************************************************** devolución de pedidos **********************************************************************
         case 'agregar_devolucion':

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if(
               ($_POST["objDevolucion"]["idPedidoDetalle"] == '' || $_POST["objDevolucion"]["idPedidoDetalle"] <= 0) ||
               ($_POST["objDevolucion"]["idPedido"] == '' || $_POST["objDevolucion"]["idPedido"] <= 0) ||
               ($_POST["objDevolucion"]["cantidadDevolucion"] == '' || $_POST["objDevolucion"]["cantidadDevolucion"] <= 0) ||
               ($_POST["objDevolucion"]["resolucionDevolucion"] == 0 || $_POST["objDevolucion"]["motivoDevolucion"] == '')
            ) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
            }
            else {
               $res = $p->agregar_devolucion($_SESSION["id_fabrica"], $_POST, $_SESSION["nombre"]);
               if($res["estatus"] == 200) {
                  $montos = $p->obtiene_montos_pedido($_POST["objDevolucion"]["idPedido"]);
                  $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $montos];
                  $g->bitacora('Devolución registrada del producto '.$_POST["objDevolucion"]["nomProducto"].' del pedido: ', $_POST["objDevolucion"]["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
            }
            echo json_encode($res);
         break;

         case 'eliminar_devolucion':

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if(($_POST["idDetallePedido"] == '' || $_POST["idDetallePedido"] <= 0) || ($_POST["idDevolucion"] == '' || $_POST["idDevolucion"] <= 0)) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
               break;
            }
            
            $res = $p->eliminar_devolucion($_POST["idDevolucion"]);
            if($res["estatus"] == 200) {
               $montos = $p->obtiene_montos_pedido($_POST["idPedido"]);
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $montos];
               $g->bitacora('Devolución eliminada del producto '.$_POST["nomProducto"].' del detalle: '.$_POST["idDetallePedido"].' del pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            
            echo json_encode($res);
         break;

         // *************************************************************** detalle de pedidos **********************************************************************
         case 'obtiene_detalle_pedido':
            $res = $p->obtiene_detalle_pedido($_POST["idPedido"]);
            echo json_encode(["estatus" => 200, "mensaje" => $_SESSION["perfil"], "data" => $res]);
         break;

         case 'agregar_producto_pedido': 

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            if(empty($_POST["idPedido"]) || empty($_POST["idProducto"]) || empty($_POST["cantidad"]) || empty($_POST["idListaPrecios"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            $res = $p->agregar_producto_pedido($_POST["idPedido"], $_POST["idProducto"], $_POST["cantidad"], $_POST["porDescuento"], $_POST["idListaPrecios"], $_SESSION["id_fabrica"]);
            if($res["estatus"] == 200) {
               $montos = $p->obtiene_montos_pedido($_POST["idPedido"]);
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $montos];
               $g->bitacora('Producto '.$_POST["nomProducto"].' agregado al pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'eliminar_producto_pedido':

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if(empty($_POST["idDetallePedido"]) || empty($_POST["nomProducto"]) || empty($_POST["idPedido"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->eliminar_producto_pedido($_POST["idDetallePedido"]);
            if($res["estatus"] == 200) {
               $montos = $p->obtiene_montos_pedido($_POST["idPedido"]);
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $montos];
               $g->bitacora('Producto '.$_POST["nomProducto"].' eliminado al pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         // ********************************************************** Funciones de pedidos **********************************************************************
         case 'obtiene_vieron_pedido':
            $res = $p->obtiene_vieron_pedido($_POST["idPedido"]);
            echo json_encode(["estatus" => 200, "mensaje" => '', "data" => $res]);
         break;
         
         case 'marcar_pedido_visto':

            if(empty($_POST["idPedido"])) {
               $res = ['estatus' => 406, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->marcar_pedido_visto($_POST["idPedido"], $_POST["visto"], $_SESSION["id_usuario"], $_SESSION["nombre"]);

            echo json_encode($res);
            
         break;

         case 'marcar_pedido_transito':

            if(empty($_POST["idPedido"]) || empty($_POST["nomCliente"])) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->marcar_pedido_transito($_POST["idPedido"], $_SESSION["nombre"]);
            if($res["estatus"] == 200) {               
               $g->bitacora('Pedido del cliente: '.$_POST["nomCliente"].' marcado como en tránsito', $_POST["idPedido"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'marcar_pedido_surtido':

            if(empty($_POST["idPedido"]) || empty($_POST["nomCliente"])) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->marcar_pedido_surtido($_POST["idPedido"], $_SESSION["nombre"]);
            if($res) {
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => []]);
               $g->bitacora('Pedido del cliente: '.$_POST["nomCliente"].' marcado como surtido', $_POST["idPedido"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               echo json_encode(["estatus" => 500, "mensaje" => "Hubo un problema para marcar como surtido el pedido", "data" => []]);
            }
         break;

         case 'obtiene_pedidos':

            $fecha_inicial = '';
            $fecha_final   = '';

            if(empty($_POST["origen"]) || empty($_POST["estatus"])) {
               echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
               break;
            }

            if($_POST["origen"] == 2) {
               if(empty($_POST["fechaInicio"]) || empty($_POST["fechaFin"]) || empty($_POST["estatus"])) {
                  echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
                  break;
               }
               // Validar que la diferencia no sea mayor a 30 días
               $fechaInicio = new DateTime($_POST["fechaInicio"]);
               $fechaFin    = new DateTime($_POST["fechaFin"]);
               $diff        = $fechaInicio->diff($fechaFin);

               if ($diff->days > 30) {
                  echo json_encode(["estatus" => 500, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
                  break;
               }
               else {
                  $fecha_inicial = $_POST["fechaInicio"].' 00:00:00';
                  $fecha_final   = $_POST["fechaFin"].' 23:59:59';                  
               }
            }
            
            $res = $p->obtiene_pedidos($_POST["origen"], $_POST["estatus"], $fecha_inicial, $fecha_final);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            
         break;

         case 'registrar_pedido':

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if(!isset($_SESSION["carrito_pedido"]) || empty($_SESSION["carrito_pedido"])) {
               $estatus = 406;
               $mensaje = 'Hubo un problema para obtener el listado de productos';
               $res     = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => []];
            }
            else {
               $res = $p->registrar_pedido($_POST["objPedido"], $_SESSION["carrito_pedido"], $_SESSION["nombre"], $_SESSION["id_fabrica"]);
               if($res["estatus"] == 200) {
                  $g->bitacora('Pedido registrado con folio: '.$res["data"][1], $res["data"][0] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
            }
            
            echo json_encode($res);
         break;

         case 'agregar_carrito_pedido':
            $producto  = $_SESSION["productos_pedido"][$_POST["idProducto"]] ?? null;

            //print_r($producto);

            if($producto) {
               $id_producto   = $_POST["idProducto"];
               $id            = $id_producto.'_'.rand(0,200);
               $cantidad      = (float)$_POST["cantidad"];
               $por_descuento = (float)$_POST["porDescuento"];
               $precio        = (float)$producto["precio_venta"];
               $costo         = (float)$producto["costo"];
               $costo_total   = $costo * $cantidad;

               $subtotal      = $cantidad * $precio;
               $descuento     = ($subtotal * $por_descuento) / 100;
               $total         = $subtotal - $descuento;
               $utilidad      = $total - $costo_total;
               
               $_SESSION["carrito_pedido"][$id] = [
                  'id'               => $id,
                  'id_producto'      => $id_producto,
                  'sku'              => $producto["sku"],
                  'nom_producto'     => $producto["nom_producto"],
                  'nom_presentacion' => $producto["nom_presentacion"],
                  'cantidad'         => $cantidad,
                  'por_descuento'    => $por_descuento,
                  'precio'           => $precio,
                  'costo'            => $costo,
                  'costo_total'      => $costo_total,
                  'subtotal'         => $subtotal,
                  'descuento'        => $descuento,
                  'total'            => $total,
                  'utilidad'         => $utilidad
               ];

               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $_SESSION["carrito_pedido"]];
            }
            else {               
               $res = ['estatus' => 400, 'mensaje' => 'error', 'data' => $_SESSION["carrito_pedido"]];
            }

            echo json_encode($res);
         break;

         case 'borrar_carrito_pedido':
            if(isset($_SESSION["carrito_pedido"])) {
               unset($_SESSION["carrito_pedido"]);  
            }
            
            $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];

            echo json_encode($res);
         break;

         case 'borrar_producto_carrito':
            if(isset($_SESSION["carrito_pedido"][$_POST["idCarrito"]])) {
               unset($_SESSION["carrito_pedido"][$_POST["idCarrito"]]);
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];
            }
            else {
               $res = ['estatus' => 500, 'mensaje' => 'error', 'data' => []];
            }

            echo json_encode($res);
         break;

         case 'obtiene_precios_lista_cliente':
            $productosIndexados = [];
            $res = $p->obtiene_precios_lista_cliente($_POST["idListaPrecios"]);
            foreach ($res as $producto) {
               $productosIndexados[$producto["id_producto_fk"]] = $producto;
            }
            $_SESSION["productos_pedido"] = $productosIndexados;
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'valida_clave_autorizacion':

            if(empty($_POST["clave"])) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->valida_clave_autorizacion($_POST["clave"]);
            if($res) {
               echo json_encode(["estatus" => 200, "mensaje" => "", "data" => []]);
            }
            else {
               echo json_encode(["estatus" => 500, "mensaje" => "clave incorrecta", "data" => []]);
            }
         break;

         case 'cancelar_pedido':

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if(empty($_POST["idPedido"]) || empty($_POST["nomCliente"]) || empty($_POST["motivo"])) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->cancelar_pedido($_POST["idPedido"], $_POST["motivo"], $_SESSION["nombre"]);
            if($res["estatus"] == 200) {
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];
               $g->bitacora('Pedido cancelado del cliente '.$_POST["nomCliente"], $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         // ******************************************************************* Adjuntar evidencias ************************************************************************
         case 'agregar_evidencia_pedido':

            if($_POST["idPedido"] == '' || $_POST["idPedido"] < 0) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            $res = $p->agregar_evidencia_pedido($_POST, $_SESSION["nombre"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Evidencia agregada de tipo:  '.$_POST["tipoEvidencia"].' pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $upload_folder  = '../../webapp/assets/docs/evidencias_pedido/'.$_POST["idPedido"];
               if(file_exists($upload_folder)) {
                  unlink($upload_folder);
                  $g->bitacora('No se registró la evidencia por lo que se borró el archivo '.$_POST["tipoEvidencia"].' pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
               else {
                  $g->bitacora('No se registró la evidencia y no se pudo borrar el archivo '.$_POST["tipoEvidencia"].' pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
            }
            echo json_encode($res);
         break;

         case 'eliminar_evidencia_pedido':

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if($_POST["idPedido"] == '' || $_POST["idPedido"] < 0) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            $res = $p->eliminar_evidencia_pedido($_POST["idEvidencia"]);
            if($res["estatus"] == 200) {
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];
               $g->bitacora('Evidencia eliminada de tipo: '.$_POST["tipoEvidencia"].' archivo: '.$_POST["nomArchivo"].' pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);

               $ruta  = '../../webapp/assets/docs/evidencias_pedido/'.$_POST["idPedido"].'/'.$_POST["nomArchivo"];
               if(file_exists($ruta)) {
                  unlink($ruta);
               }
            }
            echo json_encode($res);
         break;

         case 'subir_evidencia_pedido':
            if(isset($_POST["idPedido"]) && $_POST["idPedido"] > 0) {
               $nombre_archivo = $_FILES['archivo']['name'];	
               $tmp_archivo    = $_FILES['archivo']['tmp_name'];		
               $ext            = explode(".",$_FILES['archivo']['name']);
               $extension      = end($ext);
               $nomFile        = $_POST["idPedido"].'_'.date('ymdhis').'_'.$_POST["tipoEvidencia"].'.'.$extension;
               $upload_folder  = '../../webapp/assets/docs/evidencias_pedido/'.$_POST["idPedido"].'/';
               $archivador     = $upload_folder.$nomFile;

               $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
               if (!in_array(strtolower($extension), $extensiones_permitidas)) {
                  echo json_encode(['estatus' => 400, 'mensaje' => 'Tipo de archivo no permitido', 'data' => []]);
                  break;
               }
               if(!file_exists($upload_folder)) { //Si no existe la carpeta
                  if(mkdir($upload_folder)) {
                     copy('../../webapp/assets/docs/evidencias_pedido/index.php', $upload_folder.'/index.php');
                  }
               }

               if(move_uploaded_file($tmp_archivo, $archivador)) {
                  echo json_encode(['estatus' => 200, 'mensaje' => 'ok', 'data' => [$nomFile]]);
               } 
               else {
                  echo json_encode(['estatus' => 208, 'mensaje' => 'Hubo un problema con la subida del archivo', 'data' => []]);
               }
            } else {
               echo json_encode(['estatus' => 207, 'mensaje' => 'Valores obligatorios', 'data' => []]);
            }
          
         break;

         case 'obtiene_evidencias_pedido':
            $res = $p->obtiene_evidencia_pedido($_POST["idPedido"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         // ******************************************************************* Abonos ************************************************************************
         case 'agregar_abono_pedido':

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            if(empty($_POST["idPedido"]) || $_POST["idPedido"] < 0 || empty($_POST["montoAbono"]) || empty($_POST["metodoPago"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            $res = $p->agregar_abono_pedido($_POST, $_SESSION["id_fabrica"], $_SESSION["nombre"]);
            if($res["estatus"] == 200) {

               $montos = $p->obtiene_montos_pedido($_POST["idPedido"]);
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $montos];
               $g->bitacora('Abono registrado $'.$_POST["montoAbono"].', método de pago:  '.$_POST["metodoPago"].' pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            
            echo json_encode($res);
         break;

         case 'eliminar_abono_pedido':

            if($_SESSION["perfil"] != 1) {
               $res = ['estatus' => 402, 'mensaje' => 'Sin permisos para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if(empty($_POST["idPedido"]) || $_POST["idPedido"] < 0 || empty($_POST["montoAbono"]) || empty($_POST["metodoPago"]) || empty($_POST["idAbono"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan campos obligatorios', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            $res = $p->eliminar_abono_pedido($_POST["idAbono"]);
            if($res["estatus"] == 200) {
               $montos = $p->obtiene_montos_pedido($_POST["idPedido"]);
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $montos];
               $g->bitacora('Abono eliminado $'.$_POST["montoAbono"].', método de pago: '.$_POST["metodoPago"].' pedido: ', $_POST["idPedido"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }

            echo json_encode($res);
         break;

         case 'obtiene_abonos_pedido':
            $res = $p->obtiene_abonos_pedido($_POST["idPedido"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
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