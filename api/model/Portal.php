<?php
	require_once('../config/class.pdo.php');

	class Portal extends Conexion {
		protected PDO $dbh;

		public function __construct() {
			parent::__construct();
			$this->dbh = $this->getDbh();
		}

		public function obtiene_promociones(): array {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, badge, nom_promocion, precio_original, precio_promocion, estudios FROM portal_promociones WHERE activo = 1 ORDER BY id DESC");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en obtiene_promociones: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function guarda_promocion(array $post, string $estudios_promo, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar la promoción';

			try {
				$badge          = trim($post["badgePromocion"] ?? 'NA');
				$nomPromocion   = trim($post["nomPromocion"] ?? '');
				$precioOriginal  = (float)($post["precioOriginal"] ?? 0);
				$precioPromocion = (float)($post["precioPromocion"] ?? 0);

				$sql = $this->dbh->prepare("INSERT INTO portal_promociones (badge, nom_promocion, precio_original, precio_promocion, estudios, user_cap, fecha_cap) VALUES (?, ?, ?, ?, ?, ?, ?)");
				$ok  = $sql->execute([$badge, $nomPromocion, $precioOriginal, $precioPromocion, $estudios_promo, $user_cap, date('Y-m-d H:i:s')]);

				if ($ok) {
					$idInsertado = (int)$this->dbh->lastInsertId();
					$estatus     = 200;
					$data        = [$idInsertado];
					$mensaje     = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en guarda_promocion: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
							
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualiza_promocion(array $post, string $estudios_promo, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar la promoción';

			try {
				$idPromocion     = (int)$post["idPromocion"];
				$badge           = trim($post["badgePromocion"] ?? 'NA');
				$nomPromocion    = trim($post["nomPromocion"] ?? '');
				$precioOriginal  = (float)($post["precioOriginal"] ?? 0);
				$precioPromocion = (float)($post["precioPromocion"] ?? 0);

				$sql = $this->dbh->prepare("UPDATE portal_promociones SET badge = ?, nom_promocion = ?, precio_original = ?, precio_promocion = ?, estudios = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				$ok  = $sql->execute([$badge, $nomPromocion, $precioOriginal, $precioPromocion, $estudios_promo, $user_cap, date('Y-m-d H:i:s'), $idPromocion]);

				if ($ok) {
					$estatus = 200;
					$data    = [$idPromocion];
					$mensaje = $sql->rowCount() > 0 ? 'ok' : 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualiza_promocion: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function elimina_promocion(int $id_promocion): array {
			$estatus = 500;
			$mensaje = 'Error al intentar eliminar la promoción';
			$data    = [0];

			try {
				$sql = $this->dbh->prepare("UPDATE portal_promociones SET activo = ? WHERE id = ?");
				if ($sql->execute([0, $id_promocion])) {
					$estatus = 200;
					$data    = [$id_promocion];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en elimina_promocion: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualiza_whats(string $whatsapp): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar el whatsApp';

			try {
				$sql = $this->dbh->prepare("UPDATE datos_empresa SET whats_app = ?");
				if ($sql->execute([$whatsapp])) {
					$estatus = 200;
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualiza_whats: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function publica_cambios(): array {
			$res = [
				'whatsapp'    => '',
				'promociones' => [],
				'sucursales'  => [],
				'trae_datos'  => false
			];

			try {
				// Obtenemos el whatsApp actualizado
				$sql = $this->dbh->prepare("SELECT whats_app FROM datos_empresa LIMIT 1");
				$sql->execute();
				if ($row = $sql->fetch(PDO::FETCH_ASSOC)) {
					$res["whatsapp"]   = $row["whats_app"];
					$res["trae_datos"] = true;
				}

				// Obtenemos las promociones activas
				$sqlPromociones = $this->dbh->prepare("SELECT badge, nom_promocion, precio_original, precio_promocion, estudios FROM portal_promociones WHERE activo = 1 ORDER BY id DESC");
				$sqlPromociones->execute();
				$rowPromociones = $sqlPromociones->fetchAll(PDO::FETCH_ASSOC);

				if (!empty($rowPromociones)) {
					$res["promociones"] = $rowPromociones;
					$res["trae_datos"]  = true;
				}

				// Obtenemos las sucursales activas
				$sqlSucursales = $this->dbh->prepare("SELECT nombre, direccion, telefono, matriz FROM cat_sucursales WHERE activo = 1");
				$sqlSucursales->execute();
				$rowSucursales = $sqlSucursales->fetchAll(PDO::FETCH_ASSOC);

				if (!empty($rowSucursales)) {
					$res["sucursales"] = $rowSucursales;
					$res["trae_datos"] = true;
				}
			} 
			catch (Exception $error) {
				error_log("Error en publica_cambios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}
	}
?>