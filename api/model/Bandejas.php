<?php
	require_once('../config/class.pdo.php');
	class Bandejas extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}
		
		public function busqueda_ordenes_bandeja(int $id_sucursal, string $matriz, array $post) {
			$res = [];
			try {

				$matriz == 1 ? $filtro_matriz = '' : $filtro_matriz = 'AND sucursal_id = '.$id_sucursal;

				if($post["origen"] == 2) { // Búsqueda por paciente o folio

					$palabras = explode(' ', trim($post["parametro"]));
					$term_boolean = implode('* ', $palabras) . '*';

					$sql = $this->dbh->prepare(
						"SELECT id, id_folio, folio, paciente_nombre_historico, DATE_FORMAT(fecha_cap, '%d-%m-%Y') AS fecha_registro, DATE_FORMAT(fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, convenio_nombre_historico, estatus, estatus_pago, total_neto, total_abonado, saldo_deudor, key_query, es_urgente, requiere_factura 
						FROM ordenes_trabajo 
						WHERE (MATCH(paciente_nombre_historico) AGAINST(? IN BOOLEAN MODE) OR folio = ?) $filtro_matriz LIMIT 0,100"
					);
					$sql->execute([$term_boolean, $post["parametro"]]);
				}
				else { // Búsqueda por estatus

					$fecha_ini = $post["fechaIni"].' 00:00:00';
					$fecha_fin = $post["fechaFin"].' 23:59:59';

					$sql = $this->dbh->prepare(
						"SELECT id, id_folio, folio, paciente_nombre_historico, DATE_FORMAT(fecha_cap, '%d-%m-%Y') AS fecha_registro, DATE_FORMAT(fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, convenio_nombre_historico, estatus, estatus_pago, total_neto, total_abonado, saldo_deudor, key_query, es_urgente, requiere_factura 
						FROM ordenes_trabajo 
						WHERE estatus = ? AND (fecha_cap >= ? AND fecha_cap <= ?) $filtro_matriz"
					);
					$sql->execute([$post["estatus"], $fecha_ini, $fecha_fin]);
				}
				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function obtiene_archivos_resultados_orden(int $id_orden) {
			$res = ['estatus' => 500, 'mensaje' => 'error', 'data' => []];
			try {
				$sql = $this->dbh->prepare("SELECT id, descripcion, nombre_original, nombre_servidor, user_cap, DATE_FORMAT(fecha_cap,'%d/%m/%Y') AS fecha,  DATE_FORMAT(fecha_cap,'%H:%i') AS hora FROM orden_resultados_pdf WHERE orden_id = ? AND activo = ?");
				$sql->execute([$id_orden, 1]);
								
				$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $sql->fetchAll(PDO::FETCH_ASSOC)];

			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function obtiene_estudios_orden(int $id_orden) {
			$res = ['estatus' => 500, 'mensaje' => 'error', 'data' => []];
			try {
				$sql = $this->dbh->prepare("SELECT nombre_estudio_historico FROM orden_detalles WHERE orden_id = ?");
				$sql->execute([$id_orden]);
				
				$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $sql->fetchAll(PDO::FETCH_ASSOC)];
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function registrar_resultado_pdf(int $id_orden, string $descripcion, string $nom_original, string $nom_servidor, float $tamanio, string $user ) {
			$res = ['estatus' => 500, 'mensaje' => 'Error al intentar registrar en bd', 'data' => []];
			try {
				$sql = $this->dbh->prepare("INSERT INTO orden_resultados_pdf (orden_id, descripcion, nombre_original, nombre_servidor, tamanio_bytes, user_cap, fecha_cap) VALUES (?,?,?,?,?,?,?)");
				$sql->execute([$id_orden, $descripcion, $nom_original, $nom_servidor, $tamanio, $user, date('Y-m-d H:i:s')]);
				
				$res = [
					'estatus' => 200,
					'mensaje' => 'ok',
					'data' => [
						'id'              => $this->dbh->lastInsertId(),
						'tamanio_bytes'   => $tamanio,
						'nombre_original' => $nom_original,
						'nombre_servidor' => $nom_servidor, 
						'user_cap'        => $user,
						'fecha'           => date('Y-m-d'),
						'hora'            => date('H:i:s')
					]
				];
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function eliminar_resultado_pdf(int $id_archivo, string $user) {
      	$estatus = 500;
			$mensaje = 'Error al eliminar el estudio';
			$data    = [0];
			try {
				$sql = $this->dbh->prepare("UPDATE orden_resultados_pdf SET activo = ?, fecha_eliminado = ?, user_elimino = ? WHERE id = ?");
				$ok  = $sql->execute(array(0, date('Y-m-d H:i:s'), $user, $id_archivo));
				
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