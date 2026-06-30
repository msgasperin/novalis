<?php
   require_once('../model/Precios.php');
   require_once('../model/Globales.php');
   $p = new Precios();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         // ********************************************************** Funciones de CRUD cat_lista_precios **********************************************************************
         case 'obtiene_lista_precios':
            $res = $p->obtiene_lista_precios();          
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar_lista_precios':

            if(empty($_POST["nomListaPrecios"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->guardar_lista_precios($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Lista de precios registrada: '.$_POST["nomListaPrecios"];
            $id_lista_precio = $res["data"][0]; 
            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_lista_precio, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $g->bitacora($res["mensaje"], $id_lista_precio, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'generar_lista_precios_base':   
            
            if(empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            $res = $p->generar_lista_precios_base($_POST["idListaPrecios"], $_SESSION["nombre"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Precios base importados '.$_POST["nomListaPrecios"], $_POST["idListaPrecios"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'vaciar_lista_precios':

            if(empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->vaciar_lista_precios($_POST["idListaPrecios"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Lista de precios vaciada '.$_POST["nomListaPrecios"], $_POST["idListaPrecios"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'actualizar_generales_lista_precios':   
            
            if(empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            $res = $p->actualizar_generales_lista_precios($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Actualización de generales de la lista de precios: '.$_POST["nomListaPrecios"];
            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $_POST["idListaPrecios"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'eliminar_lista_precios':

            if(empty($_POST["idListaPrecios"]) || empty($_POST["nomListaPrecios"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $response = $p->eliminar_lista_precios($_POST["idListaPrecios"]);
            if($response) {
               $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
               $g->bitacora('Lista de precios eliminada: '.$_POST["nomListaPrecios"], $_POST["idListaPrecios"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar la lista de precios', 'data'=>[]);
            }
            
            echo json_encode($res);
         break;

         // ********************************************************** Funciones de CRUD cat_precios **********************************************************************
         case 'obtiene_precios_lista':
            $res = $p->obtiene_precios_lista($_POST["idListaPrecios"]);          
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'agregar_producto_lista':

            if(empty($_POST["idListaPrecios"]) || empty($_POST["idProducto"]) || empty($_POST["sku"]) || empty($_POST["nomProducto"]) || empty($_POST["precioBase"]) || empty($_POST["nuevoPrecio"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $p->agregar_producto_lista($_POST, $_SESSION["nombre"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Prodcuto agregado: '.$_POST["nomProducto"].' con precio $'.$_POST["nuevoPrecio"]. ' a la lista: '.$_POST["nomListaPrecios"], $_POST["idListaPrecios"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'actualizar_precio_especifico':

            if(empty($_POST["idPrecio"]) || empty($_POST["nuevoPrecio"]) || empty($_POST["nomProducto"]) || empty($_POST["nomListaPrecios"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $response = $p->actualizar_precio_especifico($_POST["idPrecio"], $_POST["nuevoPrecio"]);
            if($response) {
               $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
               $g->bitacora('Precio actualizado a $'.$_POST["nuevoPrecio"].' del producto: '.$_POST["nomProducto"]. ' de la lista: '.$_POST["nomListaPrecios"], $_POST["idListaPrecios"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'mensaje' => 'error al intentar actualizar el precio específico', 'data'=>[]);
            }
            
            echo json_encode($res);
         break;

         case 'eliminar_precio_especifico':

            if(empty($_POST["idPrecio"]) || empty($_POST["precio"]) || empty($_POST["nomProducto"]) || empty($_POST["nomListaPrecios"]) || empty($_POST["idListaPrecios"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $response = $p->eliminar_precio_especifico($_POST["idPrecio"]);
            if($response) {
               $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
               $g->bitacora('Precio eliminado: $'.$_POST["precio"].' del producto: '.$_POST["nomProducto"]. ' de la lista: '.$_POST["nomListaPrecios"], $_POST["idListaPrecios"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar el precio específico', 'data'=>[]);
            }
            
            echo json_encode($res);
         break;

         case 'actualizacion_masiva_precios':

            if(empty($_POST["idListaPrecios"]) || empty($_POST["subirBajar"]) || empty($_POST["porcentaje"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            if($_POST["subirBajar"] === 'Subir' || $_POST["subirBajar"] === 'Bajar') {
               $response = $p->actualizacion_masiva_precios($_POST["idListaPrecios"], $_POST["subirBajar"], $_POST["porcentaje"]);
               if($response) {
                  $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
                  $g->bitacora('Actualización masiva de la lista de precios: '.$_POST["nomListaPrecios"]. ', '.$_POST["subirBajar"].': %'.$_POST["porcentaje"], $_POST["idListaPrecios"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
               else {
                  $res = array('estatus' => 500, 'mensaje' => 'error al intentar realizar la actualización masiva', 'data'=>[]);
               }
            }
            else {
               $res = array('estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data'=>[]);
            }
            
            echo json_encode($res);
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