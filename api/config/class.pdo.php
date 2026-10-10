<?php
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
date_default_timezone_set("America/Mexico_City");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$mensajeError = '';
$bd_cliente   = 'error_bd';

// ── 1. Detección Dinámica del Subdominio ─────────────────────────────
$host = strtolower($_SERVER['HTTP_HOST'] ?? '');
$parts = explode('.', $host);
$subdominio = (count($parts) >= 3) ? $parts[0] : 'default';

// $subdominio = 'labdemo'; // ⚠️ Descomentar solo para pruebas locales

if (!empty($subdominio)) {
   $bd_cliente = match ($subdominio) {
      'labdemo'    => 'sagm_lis',
      'saludvital' => 'sagm_saludvital',
      default      => 'error_bd'
   };
}

// ── 2. Protección Cross-Tenant (Validación contra Sesión Activa) ────
if (isset($_SESSION["id_usuario"]) && isset($_SESSION["tenant_subdomain"])) {
   // Si intenta navegar en otro subdominio con una sesión existente, cerramos sesión
   if ($_SESSION["tenant_subdomain"] !== $subdominio) {
      session_unset();
      session_destroy();
      session_start(); // Inicia sesión limpia
   }
}

if ($bd_cliente === 'error_bd' && empty($mensajeError)) {
   $mensajeError = 'El laboratorio especificado en el subdominio no existe o se encuentra inactivo.';
}

$_SESSION["tenant_subdomain"] = $subdominio;
$_SESSION["tenant_db"]        = $bd_cliente;

if ($mensajeError === '') {

   class SafePDO extends PDO {
      // Manejador seguro de errores para no exponer contraseñas/rutas en producción
      public static function exception_handler(\Throwable $exception): void {   
         error_log("Error de conexión BD: " . $exception->getMessage() . "\n" . $exception->getTraceAsString());
         
         // Si es una petición AJAX / JSON devolvemos estructura limpia
         if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(500);
         }
         echo json_encode(["estatus" => 500, "mensaje" => "Error de conexión con el servicio de base de datos.", "data" => []]);
         exit;
      }

      public function __construct(string $dsn, string $username = '', string $password = '', array $driver_options = array()) {
         set_exception_handler(array(__CLASS__, 'exception_handler'));     
         parent::__construct($dsn, $username, $password, $driver_options);    
         restore_exception_handler();
      }
   }

   class Conexion {
      private string $db;
      private string $host = 'localhost';
      private string $us   = 'root';
      private string $pw   = '';
      public  string $key  = 'l1s26G3neN0v4L1s';
      
      protected static ?PDO $instance = null;

      public function __construct(string $base_datos = '') {
         $this->db = !empty($base_datos) ? $base_datos : ($_SESSION['tenant_db'] ?? '');
         
         if (empty($this->db) || $this->db === 'error_bd') {
            if (!headers_sent()) {
               header('Content-Type: application/json; charset=utf-8');
            }
            echo json_encode(["estatus" => 403, "mensaje" => "Error crítico: No se ha establecido una conexión de laboratorio válida.", "data" => []]);
            exit;
         }
      }

      public function conectar(): PDO {
         if (self::$instance === null) {
            $opciones = array(
               PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
               PDO::ATTR_EMULATE_PREPARES => false
            );

            self::$instance = new SafePDO(
               "mysql:host=" . $this->host . ";dbname=" . $this->db . ";charset=utf8mb4", 
               $this->us, 
               $this->pw, 
               $opciones
            );
         }
         return self::$instance;
      }

      public function getDbh(): PDO {
         return $this->conectar();
      }

      public static function cerrar(): void {
         self::$instance = null;
      }
   }
}
?>