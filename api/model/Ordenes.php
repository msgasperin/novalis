<?php
	require_once('../config/class.pdo.php');
	class Sucursales extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}
	
		public function obtiene_sucursales() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, nombre, direccion, telefono FROM cat_sucursales WHERE activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function guardar_sucursal(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar la sucursal';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_sucursales (nombre, direccion, telefono, user_cap) VALUES (?,?,?,?)");
				$ok = $sql->execute(array($post["nomSucursal"], $post["direccionSucursal"], $post["telSucursal"], $user_cap));

				if($ok) {
					$estatus = 200;
					$data    = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
							
			$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function actualizar_sucursal(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar la sucursal';
			try {
				$sql = $this->dbh->prepare("UPDATE cat_sucursales SET nombre = ?, direccion = ?, telefono = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				$ok = $sql->execute(array($post["nomSucursal"], $post["direccionSucursal"], $post["telSucursal"], $user_cap, date('Y-m-d H:i:s'), $post["idSucursal"]));

				if($ok) {
					$estatus = 200;
					$data    = [$post["idSucursal"]];
					$mensaje = 'ok';
				}				
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
				print_r("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_sucursal(int $id_sucursal) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_sucursales SET activo = ? WHERE id = ?");
				if($sql->execute(array(0, $id_sucursal))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

	}
?>