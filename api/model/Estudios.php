<?php
	require_once('../config/class.pdo.php');

	class Estudios extends Conexion {
		protected PDO $dbh;

		public function __construct() {
			parent::__construct();
			$this->dbh = $this->getDbh();
		}

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_estudios ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

		public function obtiene_lista_estudios(): array {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nombre, tipo, precio_publico, costo, indicaciones_toma, descripcion_estudio, aplica_desc, tubos_json FROM cat_estudios WHERE activo = 1 ORDER BY id DESC");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en obtiene_lista_estudios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function guardar_estudio(array $post, string $user_cap, string $tubosJson): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al guardar el estudio';

			try {
				$nombre            = trim($post["nomEstudio"] ?? '');
				$tipo              = trim($post["tipoEstudio"] ?? 'ESTUDIO');
				$precioPublico     = (float)($post["precioPublico"] ?? 0);
				$costo             = (float)($post["costo"] ?? 0);
				$descripcion       = trim($post["descripcionEstudio"] ?? '');
				$indicacionesToma  = trim($post["indicacionesToma"] ?? '');
				$aplicaDesc        = trim($post["estudioAplicaDesc"] ?? 'NO');

				$sql = $this->dbh->prepare("INSERT INTO cat_estudios (nombre, tipo, precio_publico, costo, descripcion_estudio, indicaciones_toma, aplica_desc, tubos_json, user_cap, fecha_cap) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				
				$ok = $sql->execute([
					$nombre,
					$tipo,
					$precioPublico,
					$costo,
					$descripcion,
					$indicacionesToma,
					$aplicaDesc,
					$tubosJson,
					$user_cap,
					date('Y-m-d H:i:s')
				]);

				if ($ok) {
					$idEstudio = (int)$this->dbh->lastInsertId();
					$estatus   = 200;
					$data      = [$idEstudio];
					$mensaje   = 'ok';	
				}
			} 
			catch (Exception $error) {
				error_log("Error en guardar_estudio: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizar_estudio(array $post, string $user_cap, string $tubosJson): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al actualizar datos del estudio';

			try {
				$idEstudio         = (int)$post["idEstudio"];
				$nombre            = trim($post["nomEstudio"] ?? '');
				$tipo              = trim($post["tipoEstudio"] ?? 'ESTUDIO');
				$precioPublico     = (float)($post["precioPublico"] ?? 0);
				$costo             = (float)($post["costo"] ?? 0);
				$descripcion       = trim($post["descripcionEstudio"] ?? '');
				$indicacionesToma  = trim($post["indicacionesToma"] ?? '');
				$aplicaDesc        = trim($post["estudioAplicaDesc"] ?? 'NO');

				$sql = $this->dbh->prepare("UPDATE cat_estudios SET nombre = ?, tipo = ?, precio_publico = ?, costo = ?, descripcion_estudio = ?, indicaciones_toma = ?, aplica_desc = ?, tubos_json = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				
				$ok = $sql->execute([
					$nombre,
					$tipo,
					$precioPublico,
					$costo,
					$descripcion,
					$indicacionesToma,
					$aplicaDesc,
					$tubosJson,
					$user_cap,
					date('Y-m-d H:i:s'),
					$idEstudio
				]);

				if ($ok) {
					$estatus = 200;
					$data    = [$idEstudio];
					$mensaje = $sql->rowCount() > 0 ? 'ok' : 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualizar_estudio: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function eliminar_estudio(int $id_estudio): array {
			$estatus = 500;
			$mensaje = 'Error al eliminar el estudio';
			$data    = [0];

			try {
				$sql = $this->dbh->prepare("UPDATE cat_estudios SET activo = ? WHERE id = ?");
				$ok  = $sql->execute([0, $id_estudio]);
				
				if ($ok) {
					$estatus = 200;
					$data    = [$id_estudio];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en eliminar_estudio: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}
	}
?>