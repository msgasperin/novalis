<?php
	require_once('../config/class.pdo.php');
	class Precios extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_lista_precios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function obtiene_lista_precios() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nombre, descripcion, es_defecto FROM cat_listas_precios WHERE activo = 1 ORDER BY id");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		public function guardar_lista_precios(array $post, string $user_cap) {
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

		public function actualizar_generales_lista_precios(array $post, string $user_cap) {
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

		public function eliminar_lista_precios(int $id_lista_precios) {
      	$res = false;
			try {
				$this->dbh->beginTransaction();

				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET activo = ? WHERE id = ?");
				$sql->execute(array(0, $id_lista_precios));
				
				$sqlDel = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE lista_precio_id_fk = ?");
				$sqlDel->execute(array($id_lista_precios));

				$this->dbh->commit();
          	$res = true;
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function marcar_precio_defecto(int $id_lista_precios) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al intentar marcar como defecto';
			try {
				$this->dbh->beginTransaction();

				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET es_defecto = 0");
				$sql->execute();

				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET es_defecto = 1 WHERE id = ?");
				$sql->execute([$id_lista_precios]);

				$estatus = 200;
				$mensaje = 'ok';

				$this->dbh->commit();
			} 
			catch (Exception $error) {
				$this->dbh->rollBack();
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_precios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function obtiene_precios_lista(int $id_lista_precios) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, id_estudio_fk, nombre_estudio, precio FROM lista_precio_estudios WHERE id_lista_precio_fk = ?");
				$sql->execute(array($id_lista_precios));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function agregar_estudio_lista(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema al agregar el estudio';
			try {

				//Validamos que ese producto no exista en la lista de precios
				$sqlVal = $this->dbh->prepare("SELECT id FROM lista_precio_estudios WHERE id_lista_precio_fk = ? AND id_estudio_fk = ?");
				$sqlVal->execute(array($post["idListaPrecios"], $post["idEstudio"]));
				if($sqlVal->rowCount() > 0) {
					$estatus = 500;
					$mensaje = 'Ese estudio ya existe en la lista de precios';
				}
				else {
					$sql = $this->dbh->prepare("INSERT INTO lista_precio_estudios (id_lista_precio_fk, id_estudio_fk, nombre_estudio, precio, user_cap) VALUES (?,?,?,?,?)");
					if($sql->execute(array($post["idListaPrecios"], $post["idEstudio"], $post["nomEstudio"], $post["nuevoPrecio"], $user_cap))) {
						$estatus = 200;
						$data    = [$this->dbh->lastInsertId()];
						$mensaje = 'ok';
					}
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function actualizar_precio_especifico(int $id_precio, float $precio) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE lista_precio_estudios SET precio = ? WHERE id = ?");
				if($sql->execute(array($precio, $id_precio))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
					
			return $res;
		}

		public function eliminar_precio_especifico(int $id_precio) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE id = ?");
				if($sql->execute(array($id_precio))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function actualizacion_masiva_precios(int $id_lista_precios, string $subir_bajar, float $porcentaje) {
      	$res = false;
			$sql = false;
			try {
				if($subir_bajar == 'Subir') {
					$sql = $this->dbh->prepare("UPDATE lista_precio_estudios SET precio = FLOOR(precio + (precio * ? / 100)) WHERE id_lista_precio_fk = ?;");
					$sql->execute(array($porcentaje, $id_lista_precios));
				}
				else if($subir_bajar == 'Bajar') {
					$sql = $this->dbh->prepare("UPDATE lista_precio_estudios SET precio = FLOOR(precio - (precio * ? / 100)) WHERE id_lista_precio_fk = ?;");
					$sql->execute(array($porcentaje, $id_lista_precios));
				}

				if($sql) {
					$res = true;
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function generar_lista_precios_base(int $id_lista_precios, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al guardar lista precios base';
			try {

				$this->dbh->beginTransaction();

				$sqlDel = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE id_lista_precio_fk = ?");
				$sqlDel->execute([$id_lista_precios]);
				// Insertamos todos los productos con su precio base a esa lista
				$sqlProductos = $this->dbh->prepare("INSERT INTO lista_precio_estudios (id_lista_precio_fk, id_estudio_fk, nombre_estudio, precio, user_cap) SELECT ?, id, nombre, precio_publico, ? FROM cat_estudios WHERE activo = 1");
				$sqlProductos->execute(array($id_lista_precios, $user_cap));
					
				$this->dbh->commit();

				$estatus = 200;
				$mensaje = 'ok';				
			} 
			catch (Exception $error) {
				// Si algo falló, revertimos todo para no dejar basura en las tablas
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
								
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function vaciar_lista_precios(int $id_lista_precios) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al vaciar lista precios base';
			try {

				$sqlDel = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE id_lista_precio_fk = ?");
				if($sqlDel->execute([$id_lista_precios])) {
					$estatus = 200;
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