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
				$sql = $this->dbh->prepare("SELECT id, codigo_interno, nombre, tipo, precio_publico FROM cat_estudios WHERE activo = 1 ORDER BY id");
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
			$mensaje = 'Error al guardar la lista de precios';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_listas_precios (nombre, descripcion, user_cap) VALUES (?,?,?)");
				if($sql->execute(array($post["nomListaPrecios"], $post["descripcion"], $user_cap))) {
					$idLista = $this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$idLista];
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
			$message = 'Error al actualizar generales lista de precios';
			try {
				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET nombre = ?, descripcion = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				if($sql->execute(array($post["nomListaPrecios"], $post["descripcion"], $user_cap, date('Y-m-d H:i:s'), $post["idListaPrecios"]))) {
					$estatus = 200;
					$data    = [$post["idListaPrecios"]];
					$message = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $message);
			return $res;
		}

		public function eliminar_estudio(int $id_lista_precios) {
      	$estatus = 500;
			$mensaje = 'Error al eliminar el estudio';
			$data    = [0];
			try {
				$this->dbh->beginTransaction();

				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET activo = ? WHERE id = ?");
				$sql->execute(array(0, $id_lista_precios));
				
				$sqlDel = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE lista_precio_id_fk = ?");
				$sqlDel->execute(array($id_lista_precios));

				$this->dbh->commit();
          	$estatus = 200;
				$mensaje = 'ok';
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			$res = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];

			return $res;
		}
	}
?>