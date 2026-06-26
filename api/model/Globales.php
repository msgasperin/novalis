<?php
	require_once('../config/class.pdo.php');
	class Globales extends Conexion{
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
         parent::__construct($base_datos);
	   	$this->conectar();         
	  	}
		
		public function bitacora(string $accion, string $id_tracking, int $id_usuario, string $usuario) {
			$ip        = $_SERVER["REMOTE_ADDR"];
			$port      = $_SERVER['REMOTE_PORT'];  
			$userAgent = $_SERVER['HTTP_USER_AGENT'];
			$proveedor = strtolower ($userAgent);
			
			$sql = $this->dbh->prepare("INSERT INTO bitacora (id_usuario, usuario, fecha, accion, id_tracking, ip, puerto, proveedor) VALUES (?,?,?,?,?,?,?,?)");
			$sql->execute(array($id_usuario, $usuario, date('Y-m-d H:i:s'), $accion, $id_tracking, $ip, $port, $proveedor));
		}

	}
?>