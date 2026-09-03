<?php
  header('Content-Type: application/json');
  require_once('../model/Login.php');
  require_once('../model/Globales.php');
  $v = new Login();
  $g = new Globales();

  // ── Obtener IP real del cliente ───────────────────────
  function get_ip(): string {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
    return trim(filter_var($ip, FILTER_VALIDATE_IP) ?: '0.0.0.0');
  }

  $_POST = json_decode(file_get_contents("php://input"), true);

  if(isset($_POST['func'])) {
    switch ($_POST['func']) {
      
      case 'login':
        // ── Validación CSRF ───────────────────────────────────
        $csrf_recibido = $_POST['csrf'] ?? '';
        $csrf_sesion   = $_SESSION['csrf_token'] ?? '';

        if (empty($csrf_recibido) || empty($csrf_sesion) || 
          !hash_equals($csrf_sesion, $csrf_recibido)) {
          echo json_encode([
            'estatus' => 403,
            'mensaje' => 'Petición no autorizada',
            'data'    => []
          ]);
          exit;
        }

        $ip = get_ip();

        if ($v->esta_bloqueada($ip)) {
          $minutos = $v->minutos_restantes($ip);
          echo json_encode([
            'estatus' => 429,
            'mensaje' => "Demasiados intentos fallidos. Intenta de nuevo en {$minutos} minuto(s).",
            'data'    => []
          ]);
          exit;
        }

        if(trim($_POST["usuario"]) != '' and trim($_POST["contrasenia"]) != '') {
          $nom_perfil = 'NA';
          $res = $v->login($_POST["usuario"], $_POST["contrasenia"]);
          if($res["estatus"] == 200) { 
            $v->limpiar_ip($ip);
            // ── Regenerar ID de sesión — invalida IDs previos ────
            session_regenerate_id(true);
            // ───
            $_SESSION["login_novalis"]  = "SI";
            $_SESSION["id_usuario"]     = $res["data"]["id_usuario"];
            $_SESSION["id_sucursal"]    = $res["data"]["id_sucursal_fk"];
            $_SESSION["sucursal"]       = $res["data"]["sucursal"];
            $_SESSION["matriz"]         = $res["data"]["matriz"];
            $_SESSION["usuario"]        = $res["data"]["usuario"];
            $_SESSION["nombre"]         = $res["data"]["nombre"];
            $_SESSION["perfil"]         = $res["data"]["perfil"];

            // Datos de la empresa cliente
            $_SESSION["emp_nombre"]     = $res["data"]["emp_nombre"];
            $_SESSION["emp_logo"]       = $res["data"]["emp_logo"];
            $_SESSION["emp_direccion"]  = $res["data"]["emp_direccion"];
            $_SESSION["emp_rfc"]        = $res["data"]["emp_rfc"];
            $_SESSION["emp_telefono"]   = $res["data"]["emp_telefono"];
            $_SESSION["emp_correo"]     = $res["data"]["emp_correo"];
            $_SESSION["emp_web"]        = $res["data"]["emp_web"];
            
            // Datos de caja
            $_SESSION["id_caja"]        = $res["data"]["id_caja"];
            $_SESSION["estatus_caja"]   = $res["data"]["estatus_caja"];
            $_SESSION["fecha_apertura"] = $res["data"]["fecha_apertura"];
            $_SESSION["fecha_cierre"]   = $res["data"]["fecha_cierre"];

            $g->bitacora('Inicio de sesión', $res["data"]["id_usuario"], $res["data"]["id_usuario"], $res["data"]["nombre"]);
            echo json_encode(['estatus' => $res["estatus"], 'mensaje' => 'ok', 'data' => []]);
          } else {
            $intentos_hechos = $v->registrar_fallo($ip);
            $restantes = max(0, 5 - $intentos_hechos);
            echo json_encode(['estatus' => 202, 'mensaje' => 'Usuario no encontrado', 'data' => []]);  
          }
        } else {
          echo json_encode(['estatus' => 428, 'mensaje' => 'Valores vacíos', 'data' => []]);
        }
      break;  

      case 'cerrar_sesion':
        if (!isset($_SESSION["id_usuario"]) || !isset($_SESSION["nombre"])) {
          $id_usuario = 0;
          $nombre     = 'Sesión caducada';
        } 
        else {
          $id_usuario = $_SESSION["id_usuario"];
          $nombre     = $_SESSION["nombre"];
        }

        if(session_destroy()){
          $g->bitacora('Cierre de sesión', $id_usuario, $id_usuario, $nombre);
          echo json_encode(['estatus'=> 200, 'mensaje' => '', 'data' => []]);
        } else {
          echo json_encode(['estatus'=> 500, 'mensaje' => 'Hubo un problema al cerrar la sesión', 'data' => []]);
        }
      break; 
   
      default:
        echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", 'data' => []]); // Función no encontrada
      break;
    }
  }
  else {
    echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]); // Parámatros no enviados
  }

?>