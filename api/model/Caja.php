<?php
	require_once('../config/class.pdo.php');
	class Caja extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	parent::__construct();
	   	$this->conectar();
	  	}
		
		public function abrir_caja(float $fondo_inicial, int $id_usuario, int $id_sucursal) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al abrir caja';

			try {
				$sql = $this->dbh->prepare("INSERT INTO cajas_sesiones (id_sucursal, id_usuario, fondo_inicial, fecha_apertura) VALUES (?,?,?,?)");
				$ok = $sql->execute([$id_sucursal, $id_usuario, $fondo_inicial, date('Y-m-d H:i:s')]);

				if($ok) {
					$id_caja = $this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$id_caja, date('Y-m-d H:i:s')];
					$mensaje = 'ok';	
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

      public function cerrar_caja(float $dec_efectivo, float $dec_tarjeta, float $dec_transferencia, string $observaciones, int $id_caja, int $id_usuario) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al cerrar caja';

			try {
				$sql = $this->dbh->prepare("UPDATE cajas_sesiones SET fecha_cierre = ?, declarado_efectivo = ?, declarado_tarjeta = ?, declarado_transferencia = ?, observaciones = ? WHERE id_caja = ? AND id_usuario = ?");
				$ok = $sql->execute([date('Y-m-d H:i:s'), $dec_efectivo, $dec_tarjeta, $dec_transferencia, $observaciones, $id_caja, $id_usuario]);

				if($ok) {
					$id_caja = $this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$id_caja, date('Y-m-d H:i:s')];
					$mensaje = 'ok';	
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}
	}
?>