<?php
   require_once('../model/Pacientes.php');
   require_once('../model/Globales.php');
   
   $v = new Pacientes();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         // ********************************************************** Funciones de CRUD cat_lista_precios **********************************************************************
         case 'obtiene_pacientes':
            $res = $v->obtiene_pacientes(); 
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'obtiene_credenciales_pacientes':
            $res = $v->obtiene_credenciales_pacientes($_POST["idPaciente"]); 
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'busca_paciente_coincidencia':
            $res = $v->busca_pacientes_coincidencia($_POST["parametro"]); 
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'busca_paciente_fecha_nac':
            $res = $v->busca_pacientes_fecha_nac($_POST["fecha"]); 
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

          case 'valida_coincidencia_paciente':   
            
            if(!isset($_POST["idPaciente"]) || empty($_POST["nomPaciente"]) || empty($_POST["apPaterno"]) || empty($_POST["fechaNacimiento"]) || empty($_POST["sexoBiologico"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->valida_coincidencia_paciente($_POST["nomPaciente"], $_POST["apPaterno"], $_POST["apMaterno"], $_POST["fechaNacimiento"]);
            if(!empty($res)) {
               $estatus = 201;
               $mensaje = 'ok';
               $data    = $res;
               echo json_encode($res);
               break;
            }
                      
            echo json_encode($res);
         break;

         case 'guardar_paciente':   
            
            if(!isset($_POST["idPaciente"]) || empty($_POST["nomPaciente"]) || empty($_POST["apPaterno"]) || empty($_POST["fechaNacimiento"]) || empty($_POST["sexoBiologico"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }
            
            if(intval($_POST["idPaciente"]) == 0) {
               $res         = $v->guardar_paciente($_POST, $_SESSION["nombre"]);
               $msjBitacora = 'Paciente registrado: ';
            }
            else {
               $res = $v->actualizar_paciente($_POST, $_SESSION["nombre"]);
               $msjBitacora = 'Paciente modificado: ';
            }

            if($res["estatus"] == 200) {
               $g->bitacora($msjBitacora.$_POST["nomPaciente"], $res["data"][0], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'eliminar_paciente':

            if(empty($_POST["idPaciente"]) || empty($_POST["nomPaciente"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->eliminar_paciente($_POST["idPaciente"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Paciente eliminado: '.$_POST["nomPaciente"], $_POST["idPaciente"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'cambiar_credenciales':

            if(empty($_POST["idPaciente"]) || empty($_POST["nomPaciente"]) || empty($_POST["apPaterno"])) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltan parámetros para realizar esta acción', 'data' => []];
               echo json_encode($res);
               break;
            }

            $res = $v->cambiar_credenciales($_POST["idPaciente"], $_POST["nomPaciente"], $_POST["apPaterno"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Credenciales actuaalizadas del paciente: '.$_POST["nomPaciente"], $_POST["idPaciente"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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