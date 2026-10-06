<?php
   header('Content-Type: application/json');
   session_start();
   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func']) && isset($_POST['page'])) {

         if( ($_POST["page"] == 'recepcion' || $_POST["page"] == 'caja' || $_POST["page"] == 'convenios' || $_POST["page"] == 'pacientes') && $_SESSION["perfil"] != 'QUIMICO') {
            echo json_encode(["estatus" => 200, "mensaje" => "ok", 'data' => []]);
         }

         else if($_POST["page"] == 'bandejas' && $_SESSION["perfil"] != 'REPCEPCION') {
            echo json_encode(["estatus" => 200, "mensaje" => "ok", 'data' => []]);
         }

         else if($_POST["page"] == 'bandejas' && $_SESSION["perfil"] != 'REPCEPCION') {
            echo json_encode(["estatus" => 200, "mensaje" => "ok", 'data' => []]);
         }

         else if( ($_POST["page"] == 'reportes' || $_POST["page"] == 'descuentos'|| $_POST["page"] == 'estudios' || $_POST["page"] == 'portal' || $_POST["page"] == 'precios' || $_POST["page"] == 'sucursales' || $_POST["page"] == 'usuarios') && ($_SESSION["perfil"] == 'ADMINISTRADOR' || $_SESSION["perfil"] == 'GERENTE') ) {
            echo json_encode(["estatus" => 200, "mensaje" => "ok", 'data' => []]);
         }

         else {
            echo json_encode(["estatus" => 403, "mensaje" => "Sin permisos para ingresar al módulo", 'data' => []]);
         }
      }
      else {
         echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]);
      }
   } else {
      echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", 'data' => []]); // Sin sesión de usuarios
   }
?>