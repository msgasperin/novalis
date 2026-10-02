<?php
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
date_default_timezone_set("America/Mexico_City");
session_start();

$mensajeError = '';
$bd_cliente   = 'error_bd';

$host = $_SERVER['HTTP_HOST'];
$parts = explode('.', $host);
$subdominio = (count($parts) >= 3) ? $parts[0] : 'default';

$subdominio = 'labdemo'; // Para pruebas

if (!empty($subdominio)) {
   $bd_cliente = match ($subdominio) {
      'labdemo'    => 'sagm_lis',
      'saludvital' => 'sagm_saludvital',
      default      => 'error_bd'
   };

   if ($bd_cliente !== 'error_bd') {
      $_SESSION["tenant_subdomain"] = $subdominio;
   }
}

if ($bd_cliente == 'error_bd' && $mensajeError == '') {
   $mensajeError = 'El laboratorio especificado en el subdominio no existe o se encuentra inactivo.';
}

$_SESSION["tenant_db"] = $bd_cliente;

if ($mensajeError == '') {

   class SafePDO extends PDO {
      public static function exception_handler(\Throwable $exception): void  {   
         die("Uncaught exception: " . $exception->getMessage());
      }

      public function __construct(string $dsn, $username='', $password='', $driver_options=array()) {
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
      public  string $key   = 'l1s26G3neN0v4L1s';
      
      // Instancia PDO compartida con tipo definido (?PDO permite PDO o null)
      protected static ?PDO $instance = null;

      public function __construct(string $base_datos = '') {
         $this->db = !empty($base_datos) ? $base_datos : ($_SESSION['tenant_db'] ?? '');
         
         if (empty($this->db)) {
            die("Error crítico: No se ha establecido una conexión de laboratorio válida.");
         }
      }

      // Reutiliza la misma conexión en todo el ciclo del script
      public function conectar(): PDO {
         if (self::$instance === null) {
            $opciones = array(
               PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
               PDO::ATTR_EMULATE_PREPARES => false
            );

            // Definimos charset directamente en la cadena DSN
            self::$instance = new SafePDO(
               "mysql:host=" . $this->host . ";dbname=" . $this->db . ";charset=utf8mb4", 
               $this->us, 
               $this->pw, 
               $opciones
            );
         }
         return self::$instance;
      }

      // Getter para acceder a la conexión PDO
      public function getDbh(): PDO {
         return $this->conectar();
      }

      public static function cerrar(): void {
         self::$instance = null;
      }
   }
}
?>