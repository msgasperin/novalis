<?php
	require_once('../config/class.pdo.php');
	class Recepcion extends Conexion {
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

		public function obtiene_ordenes_hoy(int $id_sucursal) {
			$res = [];
			try {
				$fecha_ini = date('Y-m-d').' 00:00:00';
				$fecha_fin = date('Y-m-d').' 23:59:59';

				$sql = $this->dbh->prepare(
					"SELECT O.id, id_folio, folio, paciente_nombre_historico, DATE_FORMAT(O.fecha_cap, '%d-%m-%Y') AS fecha_registro, DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, convenio_nombre_historico, estatus, estatus_pago, total_neto, total_abonado, saldo_deudor, key_query, es_urgente, requiere_factura, publicada, DATE_FORMAT(fecha_publicada, '%d-%m-%Y') AS fecha_publicada, correo, telefono, sucursal_historico, DATE_FORMAT(O.fecha_completada, '%d-%m-%Y') AS fecha_completada, user_completo, DATE_FORMAT(O.fecha_entregado, '%d-%m-%Y') AS fecha_entregado, user_entrego, DATE_FORMAT(O.fecha_publicada, '%d-%m-%Y') AS fecha_publicada, user_publico, DATE_FORMAT(O.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, user_cancela, motivo_cancela
					FROM ordenes_trabajo AS O
					INNER JOIN cat_pacientes AS P ON O.paciente_id = P.id
					WHERE (O.fecha_cap >= ? AND O.fecha_cap <= ?) AND sucursal_id = ? ORDER BY O.id DESC"
				);

				//$sql = $this->dbh->prepare("SELECT id, id_folio, folio, paciente_nombre_historico, DATE_FORMAT(fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, convenio_nombre_historico, estatus, estatus_pago, key_query, total_neto, total_abonado, saldo_deudor, es_urgente, requiere_factura, publicada FROM ordenes_trabajo WHERE fecha_cap >= ? AND fecha_cap <= ? AND sucursal_id = ? ORDER BY id DESC");
				$sql->execute([$fecha_ini, $fecha_fin, $id_sucursal]);				
				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function busqueda_avanzada_ordenes(int $id_sucursal, string $filtro, string $parametro, string $estatus) {
			$res = [];
			try {

				$estatus == 'TODOS' ? $filtro_estatus = '' : $filtro_estatus = 'AND estatus = '.$estatus;

				if($filtro == 'paciente') {

					$palabras = explode(' ', trim($parametro));
					$term_boolean = implode('* ', $palabras) . '*';

					$sql = $this->dbh->prepare(
						"SELECT O.id, id_folio, folio, paciente_nombre_historico, DATE_FORMAT(O.fecha_cap, '%d-%m-%Y') AS fecha_registro, DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, convenio_nombre_historico, estatus, estatus_pago, total_neto, total_abonado, saldo_deudor, key_query, es_urgente, requiere_factura, publicada, DATE_FORMAT(fecha_publicada, '%d-%m-%Y') AS fecha_publicada, correo, telefono, sucursal_historico, DATE_FORMAT(O.fecha_completada, '%d-%m-%Y') AS fecha_completada, user_completo, DATE_FORMAT(O.fecha_entregado, '%d-%m-%Y') AS fecha_entregado, user_entrego, DATE_FORMAT(O.fecha_publicada, '%d-%m-%Y') AS fecha_publicada, user_publico, DATE_FORMAT(O.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, user_cancela, motivo_cancela
						FROM ordenes_trabajo AS O
						INNER JOIN cat_pacientes AS P ON O.paciente_id = P.id 
						WHERE sucursal_id = ? AND MATCH(paciente_nombre_historico) AGAINST(? IN BOOLEAN MODE) $filtro_estatus"
					);
					$sql->execute([$id_sucursal, $term_boolean]);
				}
				else {
					if($filtro == 'folio') {
						$condicion = "AND folio = '".$parametro."'";
					}
					else if($filtro == 'fecha') {
						$fecha_ini = $parametro.' 00:00:00';
						$fecha_fin = $parametro.' 23:59:59';

						$condicion = "AND fecha_cap >= '".$fecha_ini."' AND fecha_cap <= '".$fecha_fin."'";
					}
					else if($filtro == 'mes') {
						$condicion = 'AND mes = '.$parametro;
					}
					else if($filtro == 'convenio') {
						$condicion = 'AND convenio_id = '.$parametro;
					}
					else {
						$condicion = '';
					}

					$sql = $this->dbh->prepare(
						"SELECT O.id, id_folio, folio, paciente_nombre_historico, DATE_FORMAT(O.fecha_cap, '%d-%m-%Y') AS fecha_registro, DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, convenio_nombre_historico, estatus, estatus_pago, total_neto, total_abonado, saldo_deudor, key_query, es_urgente, requiere_factura, publicada, DATE_FORMAT(fecha_publicada, '%d-%m-%Y') AS fecha_publicada, correo, telefono, sucursal_historico, DATE_FORMAT(O.fecha_completada, '%d-%m-%Y') AS fecha_completada, user_completo, DATE_FORMAT(O.fecha_entregado, '%d-%m-%Y') AS fecha_entregado, user_entrego, DATE_FORMAT(O.fecha_publicada, '%d-%m-%Y') AS fecha_publicada, user_publico, DATE_FORMAT(O.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, user_cancela, motivo_cancela
						FROM ordenes_trabajo AS O
						INNER JOIN cat_pacientes AS P ON O.paciente_id = P.id 
						WHERE sucursal_id = ? $condicion $filtro_estatus"
					);
					$sql->execute([$id_sucursal]);
				}
				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function obtiene_estudios_recepcion(string $tipo_solicitante, int $id_precio) {
			$res = [];
			try {

				if($tipo_solicitante == 'particular') {
					$sql = $this->dbh->prepare("SELECT id, nombre, tipo, precio_publico, costo, descripcion_estudio, indicaciones_toma, aplica_desc FROM cat_estudios WHERE activo = 1");
				$sql->execute();
				}
				else {
					$sql = $this->dbh->prepare("SELECT E.id, nombre, tipo, precio_publico AS precio_estudio, precio AS precio_publico, costo, descripcion_estudio, indicaciones_toma, 
						aplica_desc 
						FROM cat_estudios AS E 
						INNER JOIN lista_precio_estudios AS P ON P.id_estudio_fk = E.id
						WHERE activo = 1 AND id_lista_precio_fk = ?"
					);
					$sql->execute([$id_precio]);
				}
				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function registrar_orden(array $post, array $carrito, int $id_usuario, string $user_cap, int $id_sucursal, string $sucursal, int $id_caja) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema procesar el pedido';
			try {	
				// 1. Iniciar la transacción
				$this->dbh->beginTransaction();			

				// Gracias a tu PK compuesta, esto solo insertará si la combinación no existe.
				$stmtInit = $this->dbh->prepare("INSERT INTO consecutivos (tipo, anio, ultimo) VALUES ('ORDEN', ?, 0) ON DUPLICATE KEY UPDATE ultimo = ultimo");
				$stmtInit->execute([date('Y')]);
				
				$stmtUpd = $this->dbh->prepare("UPDATE consecutivos SET ultimo = LAST_INSERT_ID(ultimo + 1) WHERE tipo = 'ORDEN' AND anio = ?");
				$stmtUpd->execute([date('Y')]);

				$consecutivo = $this->dbh->query("SELECT LAST_INSERT_ID()")->fetchColumn();
				
				$folio = 'O-' . date('y') . '-' . $id_sucursal . '-' . $consecutivo;

				$key_query = 'OD'. date('y').$id_sucursal.$consecutivo.$this->generarCadena(15);
			
				// Nota: Los campos financieros (total, subtotal, etc.) no se envían porque inician en 0 por DEFAULT
				$sqlOrden = $this->dbh->prepare("INSERT INTO ordenes_trabajo (anio, mes, id_folio, folio, sucursal_id, sucursal_historico, paciente_id, paciente_nombre_historico, paciente_edad_registro, paciente_sexo_historico, tipo_cliente, convenio_id, convenio_nombre_historico, lista_precio_id, lista_precio_nombre_historico, subtotal, por_descuento, descuento, cargo_extra, motivo_cargo_extra, total_neto, es_urgente, requiere_factura, key_query, observaciones, user_cap) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

				$paramsOrden = [
					date('Y'),
					date('m'),
					$consecutivo,
					$folio,
					$id_sucursal,
					$sucursal,
					$post["idPaciente"],
					$post["nomPaciente"],
					$post["edad"],
					$post["sexo"],
					$post["tipoCliente"],
					$post["idConvenio"],
					$post["nomConvenio"],
					$post["idPrecio"],
					$post["nomPrecio"],
					$post["subtotal"],
					$post["porDescuento"],
					$post["montoDescuento"],
					$post["cargoExtra"],
					$post["motivoCargoExtraOrden"] ?? '',
					$post["total_neto"],
					$post["esUrgente"],
					$post["requiereFactura"],
					$key_query,
					$post["observacion"],
					$user_cap
				];

				if (!$sqlOrden->execute($paramsOrden)) {
					throw new Exception("Error al insertar la cabecera de la orden");
				}

				$id_orden = $this->dbh->lastInsertId();

				$sqlDetalle = $this->dbh->prepare("INSERT INTO orden_detalles (orden_id, estudio_id, nombre_estudio_historico, precio_aplicado, costo_aplicado, aplico_desc, utilidad) VALUES (?, ?, ?, ?, ?, ?, ?)");

				foreach ($carrito as $item) {

					$utilidad_linea = $item["precio"] - $item["costo"];

					$paramsDetalle = [
						$id_orden,
						$item["id_estudio"],
						$item["nom_estudio"],
						$item["precio"],
						$item["costo"],
						$item["aplica_desc"] ?? 0,
						$utilidad_linea
					];

					if (!$sqlDetalle->execute($paramsDetalle)) {
						throw new Exception("Error al insertar el estudio: " . $item["nom_estudio"]);
					}
				}

				if(floatval($post["abonoOrden"]) > 0) {
					$sqlAbono = $this->dbh->prepare("INSERT INTO orden_pagos (orden_id, sucursal_id, caja_id, monto, metodo_pago, referencia_pago, id_usuario_recibio, usuario_recibio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
					$ok = $sqlAbono->execute([$id_orden, $id_sucursal, $id_caja, $post["abonoOrden"], $post["metodoPagoOrden"], 'RECEPCIÓN', $id_usuario, $user_cap]);
					if(!$ok) {
						throw new Exception("Error al insertar el abono");
					}
				}

				$this->dbh->commit();

				$estatus = 200;
				$data    = [$id_orden, $folio, $post["total_neto"], $key_query];
				$mensaje = 'Orden registrada con éxito';
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				$mensaje = 'Hubo un problema al procesar la orden';
				error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function obtiene_saldos_orden(int $id_orden) {
			$res = [];
			try {

				$sql = $this->dbh->prepare("SELECT total_neto, total_abonado, saldo_deudor FROM ordenes_trabajo WHERE id = ?");
				$sql->execute([$id_orden]);				
				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function obtener_abonos_orden(int $id_orden) {
			$res = [];
			try {

				$sql = $this->dbh->prepare("SELECT id, monto, metodo_pago, referencia_pago, usuario_recibio, DATE_FORMAT(fecha_pago, '%d-%m-%Y') AS fecha_pago, DATE_FORMAT(fecha_pago, '%h:%i %p') AS hora_pago FROM orden_pagos WHERE orden_id = ? AND estatus = ? ORDER BY id DESC");
				$sql->execute([$id_orden, 1]);				
				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function registrar_abono(int $id_orden, float $monto, string $metodo_pago, int $sucursal, int $id_usuario, string $user_cap, int $id_caja) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al registrar abono';
			try {
				$sql = $this->dbh->prepare("INSERT INTO orden_pagos (orden_id, sucursal_id, caja_id, monto, metodo_pago, referencia_pago, id_usuario_recibido, usuario_recibio) VALUES (?,?,?,?,?,?,?,?)");
				$ok = $sql->execute(array($id_orden, $sucursal, $id_caja, $monto, $metodo_pago, 'ABONO', $id_usuario, $user_cap));

				if($ok) {
					$idAbono = $this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$idAbono];
					$mensaje = 'ok';	
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function eliminar_abonos(int $id_abono) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al eliminar el abono';
			try {
				$sql = $this->dbh->prepare("UPDATE orden_pagos SET estatus = ? WHERE id = ?");
				$ok = $sql->execute(array(0, $id_abono));

				if($ok) {
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

		public function cancelar_orden(int $id_orden, string $motivo, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al cancelar la orden';
			try {
				$sql = $this->dbh->prepare("UPDATE ordenes_trabajo SET estatus = ?, fecha_cancelacion = ?, user_cancela = ?, motivo_cancela = ? WHERE id = ? AND estatus != ?");
				$ok = $sql->execute(array('CANCELADO', date('Y-m-d H:i:s'), $user_cap, $motivo, $id_orden, 'CANCELADO'));

				if($ok) {
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

		public function marcar_orden_como_entregada(int $id_orden, string $user) {
      	$estatus = 500;
			$mensaje = 'Error al cambiar el estatus a entregada';
			$data    = [0];
			try {
				$sql = $this->dbh->prepare("UPDATE ordenes_trabajo SET estatus = ?, fecha_entregado = ?, user_entrego = ?, fecha_publicada = ?, user_publico = ?, publicada = ? WHERE id = ?");
				$ok  = $sql->execute(array('ENTREGADO', date('Y-m-d H:i:s'), $user, date('Y-m-d H:i:s'), $user, 1, $id_orden));
				
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