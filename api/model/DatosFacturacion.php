<?php
	require_once('../config/class.pdo.php');

	class DatosFacturacion extends Conexion {
		protected PDO $dbh;

		public function __construct() {
			parent::__construct();
			$this->dbh = $this->getDbh();
		}

		public function obtiene_datos_facturacion(string $tipo_receptor, int $id_receptor): array {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id_datos_facturacion, tipo_receptor, id_receptor, rfc, razon_social, codigo_postal, clave_regimen_fiscal, regimen_fiscal, clave_uso_cfdi, uso_cfdi, calle, numero_exterior, numero_interior, colonia, municipio_alcaldia, estado, email_facturacion, es_predeterminado FROM datos_facturacion WHERE tipo_receptor = ? AND id_receptor = ? ORDER BY es_predeterminado DESC, id_datos_facturacion DESC");
				$sql->execute([$tipo_receptor, $id_receptor]);				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en obtiene_datos_facturacion: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function guardar_datos_facturacion(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar los datos de facturación';

			try {
				$tipoReceptor     = $post["tipoReceptor"];
				$idReceptor       = (int)$post["idReceptor"];
				$esPredeterminado = (int)($post["esPredeterminado"] ?? 0);

				// Si el nuevo registro es predeterminado, desmarcar los anteriores del mismo receptor
				if ($esPredeterminado === 1) {
					$sqlReset = $this->dbh->prepare("UPDATE datos_facturacion SET es_predeterminado = 0 WHERE tipo_receptor = ? AND id_receptor = ?");
					$sqlReset->execute([$tipoReceptor, $idReceptor]);
				}

				$sql = $this->dbh->prepare("INSERT INTO datos_facturacion (tipo_receptor, id_receptor, rfc, razon_social, codigo_postal, clave_regimen_fiscal, regimen_fiscal, clave_uso_cfdi, uso_cfdi, calle, numero_exterior, numero_interior, colonia, municipio_alcaldia, estado, email_facturacion, es_predeterminado, fecha_cap, user_cap) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			
				$ok = $sql->execute([
					$tipoReceptor,
					$idReceptor,
					$post["rfcFact"],
					$post["razonSocialFact"],
					$post["codigoPostalFact"],
					$post["idRegimenFiscalFact"],
					$post["regimenFiscalFact"],
					$post["idUsoCfdiFact"],
					$post["usoCfdiFact"],
					$post["calleFact"] ?? '',
					$post["noExtFact"] ?? '',
					$post["noIntFact"] ?? '',
					$post["coloniaFact"] ?? '',
					$post["municipioFact"] ?? '',
					$post["estadoFact"] ?? '',
					$post["correoFact"],
					$esPredeterminado,
					date('Y-m-d H:i:s'),
					$user_cap
				]);

				if ($ok) {
					$idInsertado = (int)$this->dbh->lastInsertId();
					$estatus     = 200;
					$data        = [$idInsertado];
					$mensaje     = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en guardar_datos_facturacion: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
							
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizar_datos_facturacion(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar los datos de facturación';

			try {
				$idDatoFacturacion = (int)$post["idDatoFacturacion"];
				$tipoReceptor      = $post["tipoReceptor"];
				$idReceptor        = (int)$post["idReceptor"];
				$esPredeterminado  = (int)($post["esPredeterminado"] ?? 0);

				// Si se marca como predeterminado, desmarcar los demás registros del mismo receptor
				if ($esPredeterminado === 1) {
					$sqlReset = $this->dbh->prepare("UPDATE datos_facturacion SET es_predeterminado = 0 WHERE tipo_receptor = ? AND id_receptor = ? AND id_datos_facturacion != ?");
					$sqlReset->execute([$tipoReceptor, $idReceptor, $idDatoFacturacion]);
				}

				$sql = $this->dbh->prepare("UPDATE datos_facturacion SET tipo_receptor = ?, id_receptor = ?, rfc = ?, razon_social = ?, codigo_postal = ?, clave_regimen_fiscal = ?, regimen_fiscal = ?, clave_uso_cfdi = ?, uso_cfdi = ?, calle = ?, numero_exterior = ?, numero_interior = ?, colonia = ?, municipio_alcaldia = ?, estado = ?, email_facturacion = ?, es_predeterminado = ?, fecha_cap = ?, user_cap = ? WHERE id_datos_facturacion = ?");
			
				$ok = $sql->execute([
					$tipoReceptor,
					$idReceptor,
					$post["rfcFact"],
					$post["razonSocialFact"],
					$post["codigoPostalFact"],
					$post["idRegimenFiscalFact"],
					$post["regimenFiscalFact"],
					$post["idUsoCfdiFact"],
					$post["usoCfdiFact"],
					$post["calleFact"] ?? '',
					$post["noExtFact"] ?? '',
					$post["noIntFact"] ?? '',
					$post["coloniaFact"] ?? '',
					$post["municipioFact"] ?? '',
					$post["estadoFact"] ?? '',
					$post["correoFact"],
					$esPredeterminado,
					date('Y-m-d H:i:s'),
					$user_cap,
					$idDatoFacturacion
				]);

				if ($ok) {
					$estatus = 200;
					$data    = [$idDatoFacturacion];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualizar_datos_facturacion: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function eliminar_dato_facturacion(int $id_datos_facturacion): array {
			$estatus = 500;
			$mensaje = 'Error al eliminar los datos de facturación';
			$data    = [];

			try {
				$sql = $this->dbh->prepare("DELETE FROM datos_facturacion WHERE id_datos_facturacion = ?");
				if ($sql->execute([$id_datos_facturacion])) {
					$estatus = 200;
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en eliminar_dato_facturacion: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}
	}
?>