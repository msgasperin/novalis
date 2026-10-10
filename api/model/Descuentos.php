<?php
	require_once('../config/class.pdo.php');

	class Descuentos extends Conexion {
		protected PDO $dbh;

		public function __construct() {
			parent::__construct();
			$this->dbh = $this->getDbh();
		}

		public function obtiene_descuentos(): array {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, concepto_desc, porcentaje_desc FROM cat_descuentos_generales WHERE activo = 1 ORDER BY id DESC");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en obtiene_descuentos: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function guardar_descuento(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar el descuento';

			try {
				$concepto   = trim($post["conceptoDescuento"] ?? '');
				$porcentaje = (float)($post["porcentajeDescuento"] ?? 0);

				$sql = $this->dbh->prepare("INSERT INTO cat_descuentos_generales (concepto_desc, porcentaje_desc, user_cap, fecha_cap) VALUES (?, ?, ?, ?)");
				$ok  = $sql->execute([$concepto, $porcentaje, $user_cap, date('Y-m-d H:i:s')]);

				if ($ok) {
					$idInsertado = (int)$this->dbh->lastInsertId();
					$estatus     = 200;
					$data        = [$idInsertado];
					$mensaje     = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en guardar_descuento: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
							
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizar_descuento(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar el descuento';

			try {
				$idDescuento = (int)$post["idDescuento"];
				$concepto    = trim($post["conceptoDescuento"] ?? '');
				$porcentaje  = (float)($post["porcentajeDescuento"] ?? 0);

				$sql = $this->dbh->prepare("UPDATE cat_descuentos_generales SET concepto_desc = ?, porcentaje_desc = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				$ok  = $sql->execute([$concepto, $porcentaje, $user_cap, date('Y-m-d H:i:s'), $idDescuento]);

				if ($ok) {
					$estatus = 200;
					$data    = [$idDescuento];
					$mensaje = $sql->rowCount() > 0 ? 'ok' : 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualizar_descuento: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function eliminar_descuento(int $id_descuento): array {
			$estatus = 500;
			$mensaje = 'Error al eliminar el descuento';
			$data    = [];

			try {
				$sql = $this->dbh->prepare("UPDATE cat_descuentos_generales SET activo = ? WHERE id = ?");
				if ($sql->execute([0, $id_descuento])) {
					$estatus = 200;
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en eliminar_descuento: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

	}
?>