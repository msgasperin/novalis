<?php
   // ini_set('session.cookie_secure', 1); // Descomentar en producción (solo HTTPS)
   ini_set('session.cookie_httponly', 1);   // No accesible desde JS
   ini_set('session.cookie_samesite', 'Strict'); // Bloquea CSRF adicional
   date_default_timezone_set("America/Mexico_City"); 
   session_start();

   $mensajeError = '';
   $bd_cliente   = 'error_bd';
   
   if(empty($_SESSION["emp_key"]) && empty($_GET["cliente"])) {
      $mensajeError = 'El enlace de consulta es inválido o el código de acceso ya no existe, faltan parámetros.';
   }
   else if(!empty($_GET["cliente"])) {
      $_SESSION["emp_key"] = $_GET["cliente"];
   } 
   
   if(!empty($_SESSION["emp_key"])) {
      $bd_cliente = ($_SESSION["emp_key"] == 'ALhsj!hsuw?*s') ? 'sagm_lis' : 'error_bd';
   }

   if($bd_cliente == 'error_bd') {
      $mensajeError == '' ? $mensajeError = 'El enlace de consulta es inválido o el código de acceso ya no existe, parámetros incorrectos.' : $mensajeError = $mensajeError;
   } 
   
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
         public $key   = 'l1s26G3neN0v4L1s'; // Si necesitas usarla fuera, se queda pública
         public $dbh;   
         
         // 2. Pasamos el nombre de la base de datos a través del constructor
         public function __construct(string $base_datos) {
            $this->db = $base_datos;
         }
         
         public function conectar() {
            // Usamos UTF-8 de forma estándar compatible con PHP 8+
            $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);

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