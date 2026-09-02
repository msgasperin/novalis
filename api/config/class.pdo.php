<?php
   // ini_set('session.cookie_secure', 1); // Descomentar en producción (solo HTTPS)
   ini_set('session.cookie_httponly', 1);   // No accesible desde JS
   ini_set('session.cookie_samesite', 'Strict'); // Bloquea CSRF adicional
   date_default_timezone_set("America/Mexico_City"); 
   session_start();

   $mensajeError = '';
   $bd_cliente   = 'error_bd';

   // 1. Extraer el subdominio desde la URL (HTTP_HOST)
   $host  = $_SERVER['HTTP_HOST'] ?? '';
   $host  = strtok($host, ':'); // Remover puerto si existe
   $parts = explode('.', $host);
   
   $subdominio = null;
   if (count($parts) >= 3 && $parts[0] !== 'www') {
      $subdominio = strtolower($parts[0]);
   }

   // 2. Determinar la base de datos según el subdominio capturado
   if (empty($subdominio)) {
      $mensajeError = 'El subdominio no fue especificado o el enlace es inválido.';
   } else {
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
   
   if($mensajeError == '') {

      class SafePDO extends PDO {
         public static function exception_handler($exception) {   
            // Nota: En producción, es mejor guardar esto en un log en vez de usar die()
            die("Uncaught exception: " . $exception->getMessage());
         }

         public function __construct($dsn, $username='', $password='', $driver_options=array()) {
            set_exception_handler(array(__CLASS__, 'exception_handler'));     
            parent::__construct($dsn, $username, $password, $driver_options);    
            restore_exception_handler();
         }
      }

      class Conexion {
         private $db;
         private $host = 'localhost';
         private $us   = 'root';
         private $pw   = '';
         public $key   = 'l1s26G3neN0v4L1s';
         public $dbh;   

         // Si no se pasa $base_datos, la toma de la sesión activa definida en class.pdo.php
         public function __construct(string $base_datos = '') {
            $this->db = !empty($base_datos) ? $base_datos : ($_SESSION['tenant_db'] ?? '');
            
            if (empty($this->db)) {
               die("Error crítico: No se ha establecido una conexión de laboratorio válida.");
            }
         }

         public function conectar() {
            $opciones = array(
               PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8", 
               PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            );

            $this->dbh = new SafePDO(
               "mysql:host=" . $this->host . ";dbname=" . $this->db, 
               $this->us, 
               $this->pw, 
               $opciones
            );
         }

         public function cerrar() {
            $this->dbh = null;
         }
      }

   }
?>