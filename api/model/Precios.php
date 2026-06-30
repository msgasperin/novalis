<?php
	require_once('../config/class.pdo.php');
	class Precios extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  	}
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_lista_precios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function obtiene_lista_precios() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nom_precio, descripcion FROM cat_listas_precios WHERE activo = 1 ORDER BY nom_precio");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		public function generar_lista_precios_base(int $id_lista_precios, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al guardar lista precios base';
			try {

				$this->dbh->beginTransaction();

				$sqlDel = $this->dbh->prepare("DELETE FROM cat_precios WHERE id_lista_precio_fk = ?");
				$sqlDel->execute([$id_lista_precios]);
				// Insertamos todos los productos con su precio base a esa lista
				$sqlProductos = $this->dbh->prepare("INSERT INTO cat_precios (id_lista_precio_fk, id_producto_fk, sku, nom_producto, precio_base_ref, precio_venta, user_cap) SELECT ?, id, sku, nom_producto, precio_base, precio_base, ? FROM cat_productos WHERE activo = 1");
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

				$sqlDel = $this->dbh->prepare("DELETE FROM cat_precios WHERE id_lista_precio_fk = ?");
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

		public function guardar_lista_precios(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al guardar la lista de precios';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_listas_precios (nom_precio, descripcion, user_cap) VALUES (?,?,?)");
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
				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET nom_precio = ?, descripcion = ?, user_cap = ?, fec_cap = ? WHERE id = ?");
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
				
				$sqlDel = $this->dbh->prepare("DELETE FROM cat_precios WHERE id_lista_precio_fk = ?");
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

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_precios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function obtiene_precios_lista(int $id_lista_precios) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, sku, nom_producto, precio_base_ref, precio_venta FROM cat_precios WHERE id_lista_precio_fk = ?");
				$sql->execute(array($id_lista_precios));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function agregar_producto_lista(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema al agregar el producto';
			try {

				//Validamos que ese producto no exista en la lista de precios
				$sqlVal = $this->dbh->prepare("SELECT id FROM cat_precios WHERE id_lista_precio_fk = ? AND id_producto_fk = ?");
				$sqlVal->execute(array($post["idListaPrecios"], $post["idProducto"]));
				if($sqlVal->rowCount() > 0) {
					$estatus = 500;
					$mensaje = 'Ese producto ya existe en la lista de precios';
				}
				else {
					$sql = $this->dbh->prepare("INSERT INTO cat_precios (id_lista_precio_fk, id_producto_fk, sku, nom_producto, precio_base_ref, precio_venta, user_cap) VALUES (?,?,?,?,?,?,?)");
					if($sql->execute(array($post["idListaPrecios"], $post["idProducto"], $post["sku"], $post["nomProducto"], $post["precioBase"], $post["nuevoPrecio"], $user_cap))) {
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
				$sql = $this->dbh->prepare("UPDATE cat_precios SET precio_venta = ? WHERE id = ?");
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
				$sql = $this->dbh->prepare("DELETE FROM cat_precios WHERE id = ?");
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
					$sql = $this->dbh->prepare("UPDATE cat_precios SET precio_venta = FLOOR(precio_venta + (precio_venta * ? / 100)) WHERE id_lista_precio_fk = ?;");
					$sql->execute(array($porcentaje, $id_lista_precios));
				}
				else if($subir_bajar == 'Bajar') {
					$sql = $this->dbh->prepare("UPDATE cat_precios SET precio_venta = FLOOR(precio_venta - (precio_venta * ? / 100)) WHERE id_lista_precio_fk = ?;");
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
	}
?>