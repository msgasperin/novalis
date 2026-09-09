<?php
	require_once('../config/class.pdo.php');
	class Reportes extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	parent::__construct();
	   	$this->conectar();
	  	}
		
		public function cortes_caja(string $fechaIni, string $fechaFinal, int $id_sucursal) {
			$res = [];
			try {
				$params = [$fechaIni, $fechaFinal];
				
				$whereSucursal = "";
				if ($id_sucursal > 0) {
					$whereSucursal = " AND id_sucursal = ? ";
					$params[] = $id_sucursal;
				}

				$sqlStr = "SELECT 
								id_caja, 
								id_sucursal, 
								fondo_inicial, 
								DATE_FORMAT(fecha_apertura, '%d/%m/%Y %h:%i %p') AS fecha_apertura, 
								DATE_FORMAT(fecha_cierre, '%d/%m/%Y %h:%i %p') AS fecha_cierre, 
								declarado_efectivo, 
								declarado_tarjeta, 
								declarado_transferencia, 
								ingresos_efectivo, 
								egresos_efectivo, 
								sistema_efectivo, 
								ingresos_tarjeta, 
								egresos_tarjeta,
								sistema_tarjeta, 
								ingresos_transferencia, 
								egresos_transferencia, 
								sistema_transferencia, 
								sistema_ingresos, 
								sistema_egresos, 
								total_declarado, 
								total_esperado_sistema, 
								diferencia, 
								observaciones, 
								estatus,
								usuario_registro
							FROM cajas_sesiones
							WHERE DATE(fecha_apertura) BETWEEN ? AND ? $whereSucursal
							ORDER BY id_caja DESC";

				$sql = $this->dbh->prepare($sqlStr);
				$sql->execute($params);            
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
						
			return $res;
		}

		public function flujo_dinero(string $fechaIni, string $fechaFinal, int $id_sucursal) {
			$res = [];
			try {
				$params = [$fechaIni, $fechaFinal, $fechaIni, $fechaFinal];
				
				$whereSucursalOp = "";
				$whereSucursalCm = "";

				if ($id_sucursal > 0) {
					$whereSucursalOp = " AND op.sucursal_id = ? ";
					$whereSucursalCm = " AND cm.sucursal_id = ? ";
					$params[] = $id_sucursal;
					$params[] = $id_sucursal;
				}

				$sqlStr = "SELECT 
								'INGRESO' AS tipo_movimiento,
								'ORDEN_PAGO' AS origen,
								op.caja_id,
								op.orden_id AS referencia_id,
								ot.folio,
								CONCAT('Pago de estudio / Orden #', ot.folio) AS concepto,
								ot.paciente_nombre_historico AS paciente_nombre,
								op.monto,
								op.metodo_pago,
								op.referencia_pago,
								DATE_FORMAT(op.fecha_pago, '%d/%m/%Y %h:%i %p') AS fecha_movimiento,
								op.fecha_pago AS fecha_raw,
								op.usuario_recibio AS usuario_registro
							FROM orden_pagos op
							INNER JOIN ordenes_trabajo ot ON op.orden_id = ot.id
							WHERE op.estatus = 1 
								AND DATE(op.fecha_pago) BETWEEN ? AND ? $whereSucursalOp

							UNION ALL

							SELECT 
								UPPER(cm.tipo) AS tipo_movimiento,
								'MOVIMIENTO_MANUAL' AS origen,
								cm.caja_id,
								cm.id_movimiento AS referencia_id,
								NULL AS folio,
								cm.concepto,
								NULL AS paciente_nombre,
								cm.monto,
								cm.forma_pago AS metodo_pago,
								cm.comprobante AS referencia_pago,
								DATE_FORMAT(cm.fecha_movimiento, '%d/%m/%Y %h:%i %p') AS fecha_movimiento,
								cm.fecha_movimiento AS fecha_raw,
								cm.usuario_registro
							FROM caja_movimientos cm
							WHERE cm.activo = 1 
								AND DATE(cm.fecha_movimiento) BETWEEN ? AND ? $whereSucursalCm

							ORDER BY fecha_raw DESC";

				$sql = $this->dbh->prepare($sqlStr);
				$sql->execute($params);
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);

			} catch (Exception $error) {
				error_log($error->getMessage());
			}

			return $res;
		}
	}
?>