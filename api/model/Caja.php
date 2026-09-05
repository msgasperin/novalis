<?php
	require_once('../config/class.pdo.php');
	class Caja extends Conexion {
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

		public function abrir_caja(float $fondo_inicial, int $id_usuario, int $id_sucursal) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al abrir caja';

			try {

				$key_query = $this->generarCadena(20);

				$sql = $this->dbh->prepare("INSERT INTO cajas_sesiones (id_sucursal, id_usuario, fondo_inicial, fecha_apertura, key_query) VALUES (?,?,?,?,?)");
				$ok = $sql->execute([$id_sucursal, $id_usuario, $fondo_inicial, date('Y-m-d H:i:s'), $key_query]);

				if($ok) {
					$id_caja = $this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$id_caja, date('Y-m-d H:i:s')];
					$mensaje = 'ok';	
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

      public function cerrar_caja(float $dec_efectivo, float $dec_tarjeta, float $dec_transferencia, string $observaciones, int $id_caja, int $id_usuario) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al cerrar caja';

			try {
				// Cálculo de lo registrado realmente
				$sqlMontos = $this->dbh->prepare(
					"SELECT C.fondo_inicial,                  
						-- Total cobrado de órdenes por forma de pago
						COALESCE(SUM(CASE WHEN P.metodo_pago = 'EFECTIVO' AND P.estatus = 1 THEN P.monto ELSE 0 END), 0) AS cobros_efectivo,
						COALESCE(SUM(CASE WHEN P.metodo_pago IN ('TARJETA DE CREDITO', 'TARJETA DE DEBITO') AND P.estatus = 1 THEN P.monto ELSE 0 END), 0) AS cobros_tarjeta,
						COALESCE(SUM(CASE WHEN P.metodo_pago = 'TRANSFERENCIA' AND P.estatus = 1 THEN P.monto ELSE 0 END), 0) AS cobros_transferencia,                  
						
						-- Movimientos manuales: EFECTIVO
						(SELECT COALESCE(SUM(monto), 0) FROM caja_movimientos WHERE caja_id = C.id_caja AND tipo = 'ingreso' AND forma_pago = 'EFECTIVO' AND activo = 1) AS ingresos_efectivo,     
						(SELECT COALESCE(SUM(monto), 0) FROM caja_movimientos WHERE caja_id = C.id_caja AND tipo = 'egreso' AND forma_pago = 'EFECTIVO' AND activo = 1) AS egresos_efectivo,

						-- Movimientos manuales: TARJETA
						(SELECT COALESCE(SUM(monto), 0) FROM caja_movimientos WHERE caja_id = C.id_caja AND tipo = 'ingreso' AND forma_pago IN ('TARJETA DE CREDITO', 'TARJETA DE DEBITO') AND activo = 1) AS ingresos_tarjeta,     
						(SELECT COALESCE(SUM(monto), 0) FROM caja_movimientos WHERE caja_id = C.id_caja AND tipo = 'egreso' AND forma_pago IN ('TARJETA DE CREDITO', 'TARJETA DE DEBITO') AND activo = 1) AS egresos_tarjeta,

						-- Movimientos manuales: TRANSFERENCIA
						(SELECT COALESCE(SUM(monto), 0) FROM caja_movimientos WHERE caja_id = C.id_caja AND tipo = 'ingreso' AND forma_pago = 'TRANSFERENCIA' AND activo = 1) AS ingresos_transferencia,     
						(SELECT COALESCE(SUM(monto), 0) FROM caja_movimientos WHERE caja_id = C.id_caja AND tipo = 'egreso' AND forma_pago = 'TRANSFERENCIA' AND activo = 1) AS egresos_transferencia

					FROM cajas_sesiones C
					LEFT JOIN orden_pagos P ON C.id_caja = P.caja_id
					WHERE C.id_caja = :id_caja
					GROUP BY C.id_caja;"
				);

				$sqlMontos->execute([':id_caja' => $id_caja]);

				if($sqlMontos->rowCount() > 0) {
					
					$rowMontos = $sqlMontos->fetch(PDO::FETCH_ASSOC);

					$ingresos_efectivo      = $rowMontos['cobros_efectivo'] + $rowMontos['ingresos_efectivo'];
					$ingresos_tarjeta       = $rowMontos['cobros_tarjeta'] + $rowMontos['ingresos_tarjeta'];
					$ingresos_transferencia = $rowMontos['cobros_transferencia'] + $rowMontos['ingresos_transferencia'];

					// Totales finales de sistema por método de pago (El efectivo incluye el Fondo Inicial):
					$neto_efectivo      = $ingresos_efectivo - $rowMontos['egresos_efectivo'];
					$neto_tarjeta       = $ingresos_tarjeta - $rowMontos['egresos_tarjeta'];
					$neto_transferencia = $ingresos_transferencia - $rowMontos['egresos_transferencia'];

					// Total esperado global por el sistema:
					$total_esperado_sistema  = $rowMontos["fondo_inicial"] + $neto_efectivo + $neto_tarjeta + $neto_transferencia;

					// Total declarado por el usuario:
					$total_declarado_usuario = $dec_efectivo + $dec_tarjeta + $dec_transferencia;

					// Total general de egresos (para registro de auditoría):
					$sistema_ingresos = $rowMontos['fondo_inicial'] + $ingresos_efectivo + $ingresos_tarjeta + $ingresos_transferencia;
					$sistema_egresos  = $rowMontos['egresos_efectivo'] + $rowMontos['egresos_tarjeta'] + $rowMontos['egresos_transferencia'];

					// Diferencia global real (Declarado - Esperado):
					$diferencia       = $total_declarado_usuario - $total_esperado_sistema;

					$sql = $this->dbh->prepare("UPDATE cajas_sesiones SET 
						fecha_cierre = ?, 
						declarado_efectivo = ?, 
						declarado_tarjeta = ?, 
						declarado_transferencia = ?,
						ingresos_efectivo = ?, 
						egresos_efectivo = ?, 
						sistema_efectivo = ?, 
						ingresos_tarjeta = ?, 
						egresos_tarjeta = ?, 
						sistema_tarjeta = ?, 
						ingresos_transferencia = ?, 
						egresos_transferencia = ?, 
						sistema_transferencia = ?, 
						sistema_ingresos = ?, 
						sistema_egresos = ?, 
						total_declarado = ?, 
						total_esperado_sistema = ?,
						diferencia = ?, 
						observaciones = ?, 
						estatus = ? 
						WHERE id_caja = ? AND id_usuario = ? AND estatus = ?"
					);
					$ok = $sql->execute(
						[
							date('Y-m-d H:i:s'),
							$dec_efectivo,
							$dec_tarjeta,
							$dec_transferencia,

							$ingresos_efectivo,
							$rowMontos["egresos_efectivo"],
							$neto_efectivo,

							$ingresos_tarjeta,
							$rowMontos["egresos_tarjeta"],
							$neto_tarjeta,

							$ingresos_transferencia,
							$rowMontos["egresos_transferencia"],
							$neto_transferencia,

							$sistema_ingresos,
							$sistema_egresos,

							$total_declarado_usuario,
							$total_esperado_sistema,
							$diferencia,

							$observaciones,
							'cerrada',
							$id_caja,
							$id_usuario,
							'abierta'
						]
					);

					if ($ok && $sql->rowCount() > 0) {
						$estatus = 200;
						$data    = [$id_caja, date('Y-m-d H:i:s')];
						$mensaje = 'ok';
					}
					else {
						$mensaje = 'La caja ya fue cerrada previamente o no tienes permisos sobre ella.';
					}
				}
				else {
					$mensaje = 'No se pudieron obtener los montos de cierre, reinicie sesión e inténtelo de nuevo';
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function obtener_historial_movimientos_caja(string $fecha) {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id_movimiento, tipo, concepto, monto, forma_pago, comprobante, DATE_FORMAT(fecha_movimiento, '%d-%m-%Y') AS fecha_movimiento, DATE_FORMAT(fecha_movimiento, '%H:%i %p') AS hora, usuario_registro FROM caja_movimientos WHERE activo = ? AND DATE(fecha_movimiento) = ? ORDER BY id_movimiento");
				$sql->execute([1, $fecha]);				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		public function registrar_movimiento(array $post, int $id_usuario, string $usuario, int $id_sucursal, int $id_caja) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al registrar movimiento en caja';

			try {
				$sql = $this->dbh->prepare("INSERT INTO caja_movimientos (sucursal_id, caja_id, tipo, concepto, monto, forma_pago, comprobante, fecha_movimiento, id_usuario, usuario_registro) VALUES (?,?,?,?,?,?,?,?,?,?)");
				$ok = $sql->execute(
					[
						$id_sucursal,
						$id_caja,
						$post["tipoMovimiento"],
						$post["conceptoMovimiento"], 
						$post["montoMovimiento"],
						$post["formaPagoMov"],
						$post["comprobanteMovimiento"],
						date('Y-m-d H:i:s'),
						$id_usuario,
						$usuario
					]
				);

				if($ok) {
					$id_caja = $this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$id_caja, $id_sucursal, $id_caja, date('Y-m-d'), date('H:i'), $usuario];
					$mensaje = 'ok';	
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function eliminar_movimiento(int $id_movimiento) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al registrar movimiento en caja';

			try {
				$sql = $this->dbh->prepare("UPDATE caja_movimientos SET activo = ? WHERE id_movimiento = ?");
				$ok = $sql->execute([0, $id_movimiento]);

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

		public function obtener_mis_cortes_caja(string $fecha) {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id_caja, id_sucursal, fondo_inicial, DATE_FORMAT(fecha_apertura, '%H:%i %p') AS hora_apertura, DATE_FORMAT(fecha_cierre, '%H:%i %p') AS hora_cierre, declarado_efectivo, declarado_tarjeta, declarado_transferencia, ingresos_efectivo, egresos_efectivo, sistema_efectivo, ingresos_tarjeta, egresos_tarjeta,sistema_tarjeta, ingresos_transferencia, egresos_transferencia, sistema_transferencia, sistema_ingresos, sistema_egresos, total_declarado, total_esperado_sistema, diferencia, observaciones, estatus, key_query FROM cajas_sesiones WHERE DATE(fecha_apertura) = ?");
				$sql->execute([$fecha]);				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		public function obtener_movimientos_corte(int $id_caja) {
			$res = [
				'movimientos_manuales' => [],
				'pagos' => []
			];
			try {

				// Obtenemos los movimientos manuales de caja
				$sqlMovimientos = $this->dbh->prepare("SELECT id_movimiento, tipo, concepto, monto, forma_pago, comprobante, DATE_FORMAT(fecha_movimiento, '%d-%m-%Y %H:%i %p') AS fecha_movimiento, usuario_registro FROM caja_movimientos WHERE activo = ? AND caja_id = ? ORDER BY id_movimiento");
				$sqlMovimientos->execute([1, $id_caja]);				
				$resMovimientos = $sqlMovimientos->fetchAll(PDO::FETCH_ASSOC);

				$res["movimientos_manuales"] = $resMovimientos;

				// Obtenemos abonos registrados
				$sqlPagos = $this->dbh->prepare("SELECT monto, metodo_pago, referencia_pago, usuario_recibio, DATE_FORMAT(fecha_pago,'%d-%m-%Y %H:%i %p') AS fecha_pago FROM orden_pagos WHERE estatus = ? AND caja_id = ?");
				$sqlPagos->execute([1, $id_caja]);
				$resPagos = $sqlPagos->fetchAll(PDO::FETCH_ASSOC);

				$res["pagos"] = $resPagos;

			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}
	}
?>