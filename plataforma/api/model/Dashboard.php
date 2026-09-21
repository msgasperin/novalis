<?php
	require_once('../../../api/config/class.pdo.php');
	class Dashboard extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	parent::__construct();
	   	$this->conectar();
	  	}
		
		public function busqueda_ordenes_bandeja(int $id_sucursal, string $matriz, array $post) {
			$res = [];
			try {
				// Filtro de sucursal mediante parámetro dinámico para evitar inyección SQL
				$filtro_matriz = ($matriz == 1) ? '' : ' AND O.sucursal_id = :id_sucursal';

				if ($post["origen"] == 2) { // Búsqueda por paciente o folio
						$palabras = explode(' ', trim($post["parametro"]));
						$term_boolean = implode('* ', $palabras) . '*';

						// Estructura los SELECT base sin alias duplicados en el SELECT
						$columns = "O.id, O.id_folio, O.folio, O.paciente_nombre_historico, 
										DATE_FORMAT(O.fecha_cap, '%d-%m-%Y') AS fecha_registro, 
										DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, 
										O.tipo_cliente, O.convenio_nombre_historico, O.estatus, O.estatus_pago, 
										O.total_neto, O.total_abonado, O.saldo_deudor, O.key_query, O.es_urgente, 
										O.requiere_factura, O.publicada, DATE_FORMAT(O.fecha_publicada, '%d-%m-%Y') AS fecha_publicada, 
										P.correo, P.telefono, O.sucursal_historico, 
										DATE_FORMAT(O.fecha_completada, '%d-%m-%Y') AS fecha_completada, O.user_completo, 
										DATE_FORMAT(O.fecha_entregado, '%d-%m-%Y') AS fecha_entregado, O.user_entrego, 
										O.user_publico, DATE_FORMAT(O.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, 
										O.user_cancela, O.motivo_cancela";

						// Se utiliza UNION ALL para dividir las rutas de índices y evitar que el OR anule FULLTEXT/folio
						$query = "(
										SELECT {$columns}
										FROM ordenes_trabajo AS O
										INNER JOIN cat_pacientes AS P ON O.paciente_id = P.id
										WHERE MATCH(O.paciente_nombre_historico) AGAINST(:ft_term IN BOOLEAN MODE)
										{$filtro_matriz}
									)
									UNION ALL
									(
										SELECT {$columns}
										FROM ordenes_trabajo AS O
										INNER JOIN cat_pacientes AS P ON O.paciente_id = P.id
										WHERE O.folio = :folio
										AND NOT (MATCH(O.paciente_nombre_historico) AGAINST(:ft_term_dup IN BOOLEAN MODE))
										{$filtro_matriz}
									)
									LIMIT 0, 100";

									echo $query;

						$sql = $this->dbh->prepare($query);

						$params = [
							':ft_term'     => $term_boolean,
							':folio'       => $post["parametro"],
							':ft_term_dup' => $term_boolean
						];

						if ($matriz != 1) {
							$params[':id_sucursal'] = $id_sucursal;
						}

						$sql->execute($params);

				} else { // Búsqueda por estatus y rango de fechas

						// Búsqueda por estatus y rango de fechas
						$fecha_ini = $post["fechaIni"] . ' 00:00:00';
						$fecha_fin = $post["fechaFin"] . ' 23:59:59';

						$params = [
							':fecha_ini' => $fecha_ini,
							':fecha_fin' => $fecha_fin
						];

						if ($post["estatus"] == 'ENTREGADO') {
							// Si filtran entregados o publicados
							$filtro_estatus = '(O.estatus = "ENTREGADO" OR O.publicada = 1)';
						} else {
							$filtro_estatus = 'O.estatus = :estatus';
							$params[':estatus'] = $post["estatus"];
						}

						if ($matriz != 1) {
							$params[':id_sucursal'] = $id_sucursal;
						}

						// Se agrega sugerencia de índice para garantizar la ruta más rápida
						$query = "SELECT O.id, O.id_folio, O.folio, O.paciente_nombre_historico, 
											DATE_FORMAT(O.fecha_cap, '%d-%m-%Y') AS fecha_registro, 
											DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, 
											O.tipo_cliente, O.convenio_nombre_historico, O.estatus, O.estatus_pago, 
											O.total_neto, O.total_abonado, O.saldo_deudor, O.key_query, O.es_urgente, 
											O.requiere_factura, O.publicada, DATE_FORMAT(O.fecha_publicada, '%d-%m-%Y') AS fecha_publicada, 
											P.correo, P.telefono, O.sucursal_historico, 
											DATE_FORMAT(O.fecha_completada, '%d-%m-%Y') AS fecha_completada, O.user_completo, 
											DATE_FORMAT(O.fecha_entregado, '%d-%m-%Y') AS fecha_entregado, O.user_entrego, 
											O.user_publico, DATE_FORMAT(O.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, 
											O.user_cancela, O.motivo_cancela
									FROM ordenes_trabajo AS O FORCE INDEX (idx_ot_sucursal_estatus_fecha)
									INNER JOIN cat_pacientes AS P ON O.paciente_id = P.id
									WHERE {$filtro_estatus} 
										AND O.fecha_cap BETWEEN :fecha_ini AND :fecha_fin
										{$filtro_matriz}";

						$sql = $this->dbh->prepare($query);
						$sql->execute($params);
				}

				$res = $sql->fetchAll(PDO::FETCH_ASSOC);

			} catch (Exception $error) {
				error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			return $res;
		}

      public function obtiene_ordenes_paciente(int $id_cliente) {
			$res = ['estatus' => 500, 'mensaje' => 'error', 'data' => []];
			try {

				$sql = $this->dbh->prepare(
               "SELECT O.id, folio, key_query, paciente_nombre_historico, paciente_edad_registro, paciente_sexo_historico, DATE_FORMAT(O.fecha_cap, '%d/%m/%Y') AS fecha_registro, DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, GROUP_CONCAT(nombre_estudio_historico) AS estudios, estatus_pago, O.estatus
               FROM ordenes_trabajo AS O 
               INNER JOIN orden_detalles AS D ON O.id = D.orden_id 
               WHERE paciente_id = ? AND O.estatus IN ('PROCESO', 'ENTREGADO', 'LISTO')
               GROUP BY O.id
               ORDER BY O.fecha_cap DESC");
				$sql->execute([$id_cliente]);
								
				$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $sql->fetchAll(PDO::FETCH_ASSOC)];

			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
            print_r("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}
		
		public function obtiene_ordenes_convenio(int $id_cliente, string $fecha_ini, string $fecha_fin, string $txt_busqueda) {
			$res = ['estatus' => 500, 'mensaje' => 'error', 'data' => []];
			try {

				if(!empty($txt_busqueda)) {
					$condicion = "AND (paciente_nombre_historico LIKE '%{$txt_busqueda}%' OR folio = '{$txt_busqueda}')";
				}
				else {
					$condicion = "AND (O.fecha_cap >= '{$fecha_ini}' AND O.fecha_cap <= '{$fecha_fin}')";
				}
		
				$sql = $this->dbh->prepare(
               "SELECT O.id, folio, key_query, paciente_nombre_historico, paciente_edad_registro, paciente_sexo_historico, DATE_FORMAT(O.fecha_cap, '%d/%m/%Y') AS fecha_registro, DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, GROUP_CONCAT(nombre_estudio_historico) AS estudios, estatus_pago, O.estatus
               FROM ordenes_trabajo AS O 
               INNER JOIN orden_detalles AS D ON O.id = D.orden_id 
               WHERE convenio_id = ? AND O.estatus IN ('PROCESO', 'ENTREGADO', 'LISTO') $condicion
               GROUP BY O.id
               ORDER BY O.fecha_cap DESC");
				$sql->execute([$id_cliente]);
								
				$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $sql->fetchAll(PDO::FETCH_ASSOC)];

			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
            print_r("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function obtiene_archivos_resultados_orden(int $id_orden) {
			$res = ['estatus' => 500, 'mensaje' => 'error', 'data' => []];
			try {
				$sql = $this->dbh->prepare("SELECT id, descripcion, nombre_original, nombre_servidor, user_cap, DATE_FORMAT(fecha_cap,'%d/%m/%Y') AS fecha,  DATE_FORMAT(fecha_cap,'%H:%i') AS hora, key_query_pdf FROM orden_resultados_pdf WHERE orden_id = ? AND activo = ?");
				$sql->execute([$id_orden, 1]);
								
				$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $sql->fetchAll(PDO::FETCH_ASSOC)];

			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}	
	}
?>