<?php
	require_once('../config/class.pdo.php');
	class Estudios extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_lista_precios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function obtiene_lista_estudios() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nombre, tipo, precio_publico, indicaciones_toma, descripcion_estudio FROM cat_estudios WHERE activo = 1 ORDER BY id");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		public function guardar_estudio(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al guardar el estudio';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_estudios (nombre, tipo, precio_publico, descripcion_estudio, indicaciones_toma, user_cap) VALUES (?,?,?,?,?,?)");
				$ok = $sql->execute(array($post["nomEstudio"], $post["tipoEstudio"], $post["precioPublico"], $post["descripcionEstudio"], $post["indicacionesToma"], $user_cap));

				if($ok) {
					$idEstudio = $this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$idEstudio];
					$mensaje = 'ok';	
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function actualizar_estudio(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$message = 'Error al actualizar datos del estudio';
			try {
				$sql = $this->dbh->prepare("UPDATE cat_estudios SET nombre = ?, tipo = ?, precio_publico = ?, descripcion_estudio = ?, indicaciones_toma = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				$ok = $sql->execute(array($post["nomEstudio"], $post["tipoEstudio"], $post["precioPublico"], $post["descripcionEstudio"], $post["indicacionesToma"], $user_cap, date('Y-m-d H:i:s'), $post["idEstudio"]));
				if($ok) {
					$estatus = 200;
					$data    = [$post["idEstudio"]];
					$message = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $message);
			return $res;
		}

		public function eliminar_estudio(int $id_estudio) {
      	$estatus = 500;
			$mensaje = 'Error al eliminar el estudio';
			$data    = [0];
			try {
				$sql = $this->dbh->prepare("UPDATE cat_estudios SET activo = ? WHERE id = ?");
				$ok  = $sql->execute(array(0, $id_estudio));
				
				if($ok) {
					$estatus = 200;
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			$res = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];

			return $res;
		}
	}
?>