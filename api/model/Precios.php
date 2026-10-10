<?php
	require_once('../config/class.pdo.php');

	class Precios extends Conexion {
		protected PDO $dbh;

		public function __construct() {
			parent::__construct();
			$this->dbh = $this->getDbh();
		}

		public function obtiene_lista_precios(): array {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nombre, descripcion, es_defecto FROM cat_listas_precios WHERE activo = 1 ORDER BY id DESC");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en obtiene_lista_precios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function guardar_lista_precios(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al guardar la lista de precios';

			try {
				$nombre      = trim($post["nomListaPrecios"] ?? '');
				$descripcion = trim($post["descripcion"] ?? '');

				$sql = $this->dbh->prepare("INSERT INTO cat_listas_precios (nombre, descripcion, user_cap, fecha_cap) VALUES (?, ?, ?, ?)");
				if ($sql->execute([$nombre, $descripcion, $user_cap, date('Y-m-d H:i:s')])) {
					$idLista = (int)$this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$idLista];
					$mensaje = 'ok';	
				}
			} 
			catch (Exception $error) {
				error_log("Error en guardar_lista_precios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizar_generales_lista_precios(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al actualizar generales lista de precios';

			try {
				$idLista     = (int)$post["idListaPrecios"];
				$nombre      = trim($post["nomListaPrecios"] ?? '');
				$descripcion = trim($post["descripcion"] ?? '');

				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET nombre = ?, descripcion = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				if ($sql->execute([$nombre, $descripcion, $user_cap, date('Y-m-d H:i:s'), $idLista])) {
					$estatus = 200;
					$data    = [$idLista];
					$mensaje = $sql->rowCount() > 0 ? 'ok' : 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualizar_generales_lista_precios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function eliminar_lista_precios(int $id_lista_precios): array {
			$estatus = 500;
			$mensaje = 'Error al eliminar la lista de precios';
			$data    = [0];

			try {
				$this->dbh->beginTransaction();

				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET activo = ? WHERE id = ?");
				$sql->execute([0, $id_lista_precios]);
				
				$sqlDel = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE id_lista_precio_fk = ?");
				$sqlDel->execute([$id_lista_precios]);

				$this->dbh->commit();
				$estatus = 200;
				$data    = [$id_lista_precios];
				$mensaje = 'ok';
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log("Error en eliminar_lista_precios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function marcar_precio_defecto(int $id_lista_precios): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar marcar como defecto';

			try {
				$this->dbh->beginTransaction();

				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET es_defecto = 0");
				$sql->execute();

				$sql = $this->dbh->prepare("UPDATE cat_listas_precios SET es_defecto = 1 WHERE id = ?");
				$sql->execute([$id_lista_precios]);

				$this->dbh->commit();
				$estatus = 200;
				$data    = [$id_lista_precios];
				$mensaje = 'ok';
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log("Error en marcar_precio_defecto: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		// ── CRUD cat_precios ──

		public function obtiene_precios_lista(int $id_lista_precios): array {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, id_estudio_fk, nombre_estudio, precio FROM lista_precio_estudios WHERE id_lista_precio_fk = ? ORDER BY id DESC");
				$sql->execute([$id_lista_precios]);
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en obtiene_precios_lista: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function agregar_estudio_lista(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Hubo un problema al agregar el estudio';

			try {
				$idLista     = (int)$post["idListaPrecios"];
				$idEstudio   = (int)$post["idEstudio"];
				$nomEstudio  = trim($post["nomEstudio"] ?? '');
				$nuevoPrecio = (float)($post["nuevoPrecio"] ?? 0);

				$sqlVal = $this->dbh->prepare("SELECT id FROM lista_precio_estudios WHERE id_lista_precio_fk = ? AND id_estudio_fk = ? LIMIT 1");
				$sqlVal->execute([$idLista, $idEstudio]);

				if ($sqlVal->rowCount() > 0) {
					$estatus = 400;
					$mensaje = 'Ese estudio ya existe en la lista de precios';
				}
				else {
					$sql = $this->dbh->prepare("INSERT INTO lista_precio_estudios (id_lista_precio_fk, id_estudio_fk, nombre_estudio, precio, user_cap, fecha_cap) VALUES (?, ?, ?, ?, ?, ?)");
					if ($sql->execute([$idLista, $idEstudio, $nomEstudio, $nuevoPrecio, $user_cap, date('Y-m-d H:i:s')])) {
						$estatus = 200;
						$data    = [(int)$this->dbh->lastInsertId()];
						$mensaje = 'ok';
					}
				}
			} 
			catch (Exception $error) {
				error_log("Error en agregar_estudio_lista: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizar_precio_especifico(int $id_precio, float $precio): array {
			$estatus = 500;
			$mensaje = 'Error al actualizar precio';
			$data    = [0];

			try {
				$sql = $this->dbh->prepare("UPDATE lista_precio_estudios SET precio = ? WHERE id = ?");
				if ($sql->execute([$precio, $id_precio])) {
					$estatus = 200;
					$data    = [$id_precio];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualizar_precio_especifico: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
					
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function eliminar_precio_especifico(int $id_precio): array {
			$estatus = 500;
			$mensaje = 'Error al eliminar precio';
			$data    = [0];

			try {
				$sql = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE id = ?");
				if ($sql->execute([$id_precio])) {
					$estatus = 200;
					$data    = [$id_precio];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en eliminar_precio_especifico: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizacion_masiva_precios(int $id_lista_precios, string $subir_bajar, float $porcentaje): array {
			$estatus = 500;
			$mensaje = 'Error al realizar actualización masiva';
			$data    = [0];

			try {
				if ($subir_bajar === 'Subir') {
					$sql = $this->dbh->prepare("UPDATE lista_precio_estudios SET precio = ROUND(precio + (precio * ? / 100), 2) WHERE id_lista_precio_fk = ?");
					$ok  = $sql->execute([$porcentaje, $id_lista_precios]);
				}
				else if ($subir_bajar === 'Bajar') {
					$sql = $this->dbh->prepare("UPDATE lista_precio_estudios SET precio = ROUND(precio - (precio * ? / 100), 2) WHERE id_lista_precio_fk = ?");
					$ok  = $sql->execute([$porcentaje, $id_lista_precios]);
				} else {
					$ok = false;
				}

				if ($ok) {
					$estatus = 200;
					$data    = [$id_lista_precios];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualizacion_masiva_precios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function generar_lista_precios_base(int $id_lista_precios, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al guardar lista precios base';

			try {
				$this->dbh->beginTransaction();

				$sqlDel = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE id_lista_precio_fk = ?");
				$sqlDel->execute([$id_lista_precios]);

				$sqlProductos = $this->dbh->prepare("INSERT INTO lista_precio_estudios (id_lista_precio_fk, id_estudio_fk, nombre_estudio, precio, user_cap, fecha_cap) SELECT ?, id, nombre, precio_publico, ?, ? FROM cat_estudios WHERE activo = 1");
				$sqlProductos->execute([$id_lista_precios, $user_cap, date('Y-m-d H:i:s')]);
					
				$this->dbh->commit();

				$estatus = 200;
				$data    = [$id_lista_precios];
				$mensaje = 'ok';				
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log("Error en generar_lista_precios_base: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
								
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function vaciar_lista_precios(int $id_lista_precios): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al vaciar la lista de precios';

			try {
				$sqlDel = $this->dbh->prepare("DELETE FROM lista_precio_estudios WHERE id_lista_precio_fk = ?");
				if ($sqlDel->execute([$id_lista_precios])) {
					$estatus = 200;
					$data    = [$id_lista_precios];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en vaciar_lista_precios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}
	}
?>