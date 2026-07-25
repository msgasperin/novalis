<?php
	require_once('../config/class.pdo.php');
	class Descuentos extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}
	
		public function obtiene_descuentos() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, concepto_desc, porcentaje_desc FROM cat_descuentos_generales WHERE activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function guardar_descuento(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar el descuento';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_descuentos_generales (concepto_desc, porcentaje_desc, user_cap) VALUES (?,?,?)");
				$ok = $sql->execute(array($post["conceptoDescuento"], $post["porcentajeDescuento"], $user_cap));

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

		public function actualizar_descuento(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar el descuento';
			try {

				$sql = $this->dbh->prepare("UPDATE cat_descuentos_generales SET concepto_desc = ?, porcentaje_desc = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				$ok = $sql->execute(array($post["conceptoDescuento"], $post["porcentajeDescuento"], $user_cap, date('Y-m-d H:i:s'), $post["idDescuento"]));

				if($ok) {
					$estatus = 200;
					$data    = [$post["idDescuento"]];
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

		public function eliminar_descuento(int $id_descuento) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_descuentos_generales SET activo = ? WHERE id = ?");
				if($sql->execute(array(0, $id_descuento))) {
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