<?php
	require_once('../config/class.pdo.php');
	class Bandejas extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	parent::__construct();
	   	$this->conectar();
	  	}

		public function generarCadena(int $longitud = 10) {
			$caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			$max = strlen($caracteres) - 1;
			$cadena = '';

			for ($i = 0; $i < $longitud; $i++) {
				$cadena .= $caracteres[random_int(0, $max)];
			}

			return $cadena;
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

		public function registrar_resultado_pdf(int $id_orden, string $folio, string $descripcion, string $nom_original, string $nom_servidor, float $tamanio, string $user ) {
			$res = ['estatus' => 500, 'mensaje' => 'Error al intentar registrar en bd', 'data' => []];
			try {

				$key_query = $folio.$this->generarCadena(20);

				$sql = $this->dbh->prepare("INSERT INTO orden_resultados_pdf (orden_id, orden_folio, descripcion, nombre_original, nombre_servidor, tamanio_bytes, user_cap, fecha_cap, key_query_pdf) VALUES (?,?,?,?,?,?,?,?,?)");
				$sql->execute([$id_orden, $folio, $descripcion, $nom_original, $nom_servidor, $tamanio, $user, date('Y-m-d H:i:s'), $key_query]);
				
				$res = [
					'estatus' => 200,
					'mensaje' => 'ok',
					'data' => [
						'id'              => $this->dbh->lastInsertId(),
						'orden_folio'     => $folio,
						'tamanio_bytes'   => $tamanio,
						'nombre_original' => $nom_original,
						'nombre_servidor' => $nom_servidor, 
						'user_cap'        => $user,
						'fecha'           => date('Y-m-d'),
						'hora'            => date('H:i:s'),
						'key_query_pdf'   => $key_query
					]
				];
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
				print_r("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
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

		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES DE CAMBIOS DE ESTATUS ++++++++++++++++++++++++++++++++++++++++++++++++++++++

		public function valida_tenga_estudios(int $id_orden) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("SELECT id FROM orden_resultados_pdf WHERE orden_id = ?");
				$sql->execute(array($id_orden));
				if($sql->rowCount() > 0) {
					$res = true;
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			return $res;
		}

		public function marcar_orden_como_parcial(int $id_orden) {
      	$estatus = 500;
			$mensaje = 'Error al cambiar el estatus a parcial';
			$data    = [0];
			try {
				$sql = $this->dbh->prepare("UPDATE ordenes_trabajo SET estatus = ? WHERE id = ?");
				$ok  = $sql->execute(array('PROCESO', $id_orden));
				
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

		public function marcar_orden_como_completada(int $id_orden, string $user) {
      	$estatus = 500;
			$mensaje = 'Error al cambiar el estatus a completada';
			$data    = [0];
			try {
				$sql = $this->dbh->prepare("UPDATE ordenes_trabajo SET estatus = ?, fecha_completada = ?, user_completo = ? WHERE id = ?");
				$ok  = $sql->execute(array('LISTO', date('Y-m-d H:i:s'), $user, $id_orden));
				
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

		public function procesar_publicacion_notificacion(int $id_orden, string $user) {
      	$estatus = 500;
			$mensaje = 'Error al publicar / notificar resultado en plataforma';
			$data    = [0];
			try {
				$sql = $this->dbh->prepare("UPDATE ordenes_trabajo SET publicada = ?, fecha_publicada = ?, user_publico = ? WHERE id = ?");
				$ok  = $sql->execute(array(1, date('Y-m-d H:i:s'), $user, $id_orden));
				
				if($ok) {
					$estatus = 200;
					$mensaje = 'ok';
					$data    = [date('Y-m-d H:i:s')];
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