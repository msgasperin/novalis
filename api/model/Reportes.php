<?php
require_once('../config/class.pdo.php');

class Reportes extends Conexion {

   protected PDO $dbh;

   // Objeto principal del constructor de la clase
   public function __construct() {
      parent::__construct();
      $this->dbh = $this->getDbh();
   }

   /**
    * Normaliza un rango de fechas para consultas SQL con datetime.
    *
    * @param string $fechaInicio Fecha en formato Y-m-d
    * @param string $fechaFin    Fecha en formato Y-m-d
    * @return array ['inicio' => 'Y-m-d 00:00:00', 'fin' => 'Y-m-d 23:59:59']
    */
   private function prepararRangoFechas(string $fechaInicio, string $fechaFin): array {
      // Limpia espacios en blanco
      $fechaInicio = trim($fechaInicio);
      $fechaFin    = trim($fechaFin);

      // Si solo viene fecha (Y-m-d), agrega horas extremas
      if (strlen($fechaInicio) === 10) {
         $fechaInicio .= ' 00:00:00';
      }
      if (strlen($fechaFin) === 10) {
         $fechaFin .= ' 23:59:59';
      }

      return [
         'inicio' => $fechaInicio,
         'fin'    => $fechaFin
      ];
   }
   
   public function cortes_caja(string $fechaIni, string $fechaFinal, int $id_sucursal) {
      $res = [];
      try {
         $fechas = $this->prepararRangoFechas($fechaIni, $fechaFinal);
         $params = [$fechas['inicio'], $fechas['fin']];
         
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
                        usuario_registro,
                        s.nombre AS sucursal
                     FROM cajas_sesiones cs
                     INNER JOIN cat_sucursales s ON cs.id_sucursal = s.id
                     WHERE fecha_apertura BETWEEN ? AND ? $whereSucursal
                     ORDER BY id_caja DESC";

         $sql = $this->dbh->prepare($sqlStr);
         $sql->execute($params);            
         $res = $sql->fetchAll(PDO::FETCH_ASSOC);
      } catch (Exception $error) {
         error_log("Error en cortes_caja: " . $error->getMessage());
      }
               
      return $res;
   }

   public function flujo_dinero(string $fechaIni, string $fechaFinal, int $id_sucursal) {
      $res = [];
      try {
         $fechas = $this->prepararRangoFechas($fechaIni, $fechaFinal);
         $params = [$fechas['inicio'], $fechas['fin'], $fechas['inicio'], $fechas['fin']];
         
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
                        op.usuario_recibio AS usuario_registro,
                        sucursal_historico AS sucursal
                     FROM orden_pagos op
                     INNER JOIN ordenes_trabajo ot ON op.orden_id = ot.id
                     WHERE op.estatus = 1 AND op.fecha_pago BETWEEN ? AND ? $whereSucursalOp

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
                        cm.usuario_registro,
                        s.nombre AS sucursal
                     FROM caja_movimientos cm
                     INNER JOIN cat_sucursales s ON cm.sucursal_id = s.id
                     WHERE cm.activo = 1 AND cm.fecha_movimiento BETWEEN ? AND ? $whereSucursalCm
                     ORDER BY fecha_raw DESC";

         $sql = $this->dbh->prepare($sqlStr);
         $sql->execute($params);
         $res = $sql->fetchAll(PDO::FETCH_ASSOC);

      } catch (Exception $error) {
         error_log("Error en flujo_dinero: " . $error->getMessage());
      }

      return $res;
   }

   public function cuentas_por_cobrar(string $fechaIni, string $fechaFinal, int $id_sucursal) {
      $res = [];
      try {
         $fechas = $this->prepararRangoFechas($fechaIni, $fechaFinal);
         $params = [$fechas['inicio'], $fechas['fin']];
         
         $whereSucursal = "";
         if ($id_sucursal > 0) {
            $whereSucursal = " AND sucursal_id = ? ";
            $params[] = $id_sucursal;
         }

         $sqlStr = "SELECT 
                     id,
                     anio,
                     mes,
                     id_folio,
                     folio,
                     sucursal_id,
                     sucursal_historico,
                     paciente_id,
                     paciente_nombre_historico,
                     paciente_edad_registro,
                     paciente_sexo_historico,
                     tipo_cliente,
                     convenio_id,
                     convenio_nombre_historico,
                     subtotal,
                     por_descuento,
                     descuento,
                     cargo_extra,
                     total_neto,
                     total_abonado,
                     saldo_deudor,
                     estatus_pago,
                     estatus,
                     requiere_factura,
                     DATE_FORMAT(fecha_cap, '%d/%m/%Y %h:%i %p') AS fecha_cap,
                     user_cap,
                     observaciones
                  FROM ordenes_trabajo
                  WHERE fecha_cap BETWEEN ? AND ? AND estatus != 'CANCELADO' AND estatus_pago != 'PAGADO' AND saldo_deudor > 0 $whereSucursal
                  ORDER BY id DESC";

         $sql = $this->dbh->prepare($sqlStr);
         $sql->execute($params);            
         $res = $sql->fetchAll(PDO::FETCH_ASSOC);

      } catch (Exception $error) {
         error_log("Error en cuentas_por_cobrar: " . $error->getMessage());
      }
               
      return $res;
   }

   public function estudios_rentabilidad(string $fechaIni, string $fechaFinal, int $id_sucursal) {
		$res = [];
		try {
			$fechas = $this->prepararRangoFechas($fechaIni, $fechaFinal);
			$params = [$fechas['inicio'], $fechas['fin']];
			
			$whereSucursal = "";
			if ($id_sucursal > 0) {
				$whereSucursal = " AND sucursal_id = ? ";
				$params[]      = $id_sucursal;
			}

			$sqlStr = "SELECT 
							estudio_id,
							nombre_estudio_historico AS item_nombre,
							COUNT(id) AS cantidad_vendida,
							SUM(precio_aplicado) AS ingreso_total,
							AVG(precio_aplicado) AS precio_promedio,
							SUM(COALESCE(costo_aplicado, 0)) AS costo_total,
							SUM(COALESCE(utilidad, (precio_aplicado - COALESCE(costo_aplicado, 0)))) AS utilidad_bruta,
							CASE 
								WHEN SUM(precio_aplicado) > 0 
								THEN ROUND((SUM(COALESCE(utilidad, (precio_aplicado - COALESCE(costo_aplicado, 0)))) / SUM(precio_aplicado)) * 100, 2)
								ELSE 0 
							END AS porcentaje_margen
						FROM orden_detalles od
						WHERE fecha_cap BETWEEN ? AND ? AND estatus_orden != 'CANCELADO' $whereSucursal 
						GROUP BY estudio_id, nombre_estudio_historico
						ORDER BY cantidad_vendida DESC, ingreso_total DESC";

			$sql = $this->dbh->prepare($sqlStr);
			$sql->execute($params);            
			$res = $sql->fetchAll(PDO::FETCH_ASSOC);

		} catch (Exception $error) {
			error_log("Error en estudios_rentabilidad: " . $error->getMessage());
		}
				
		return $res;
	}

   public function rendimiento_clientes(string $fechaIni, string $fechaFinal, int $id_sucursal) {
      $res = [];
      try {
         $fechas = $this->prepararRangoFechas($fechaIni, $fechaFinal);
         $params = [$fechas['inicio'], $fechas['fin']];
         
         $whereSucursal = "";
         if ($id_sucursal > 0) {
            $whereSucursal = " AND sucursal_id = ? ";
            $params[] = $id_sucursal;
         }

         $sqlStr = "SELECT 
                        COALESCE(convenio_id, 0) AS convenio_id,
                        COALESCE(NULLIF(TRIM(convenio_nombre_historico), ''), 'PARTICULAR / SIN CONVENIO') AS convenio_nombre,
                        COUNT(id) AS total_ordenes,
                        SUM(subtotal) AS subtotal_bruto,
                        SUM(cargo_extra) AS cargo_extra,
                        SUM(descuento) AS total_descuentos,
                        SUM(total_neto) AS facturacion_neta,
                        SUM(total_abonado) AS total_recaudado,
                        SUM(saldo_deudor) AS total_saldo_deudor,
                        SUM(CASE WHEN requiere_factura = 1 THEN 1 ELSE 0 END) AS ordenes_facturadas,
                        SUM(CASE WHEN estatus_pago = 'CREDITO_EMPRESA' THEN total_neto ELSE 0 END) AS total_credito
                     FROM ordenes_trabajo ot
                     WHERE fecha_cap BETWEEN ? AND ?
                        AND estatus != 'CANCELADO'
                        $whereSucursal
                     GROUP BY COALESCE(convenio_id, 0), COALESCE(NULLIF(TRIM(convenio_nombre_historico), ''), 'PARTICULAR / SIN CONVENIO')
                     ORDER BY facturacion_neta DESC, total_ordenes DESC";

         $sql = $this->dbh->prepare($sqlStr);
         $sql->execute($params);            
         $res = $sql->fetchAll(PDO::FETCH_ASSOC);

      } catch (Exception $error) {
         error_log("Error en rendimiento_clientes: " . $error->getMessage());
      }
               
      return $res;
   }

   public function analisis_pacientes(string $fechaIni, string $fechaFinal, int $id_sucursal) {
      $res = [
         'demografia'  => [],
         'recurrencia' => []
      ];

      try {
         $fechas = $this->prepararRangoFechas($fechaIni, $fechaFinal);
         $params = [$fechas['inicio'], $fechas['fin']];
         
         $whereSucursal = "";
         if ($id_sucursal > 0) {
            $whereSucursal = " AND ot.sucursal_id = ? ";
            $params[] = $id_sucursal;
         }

         // -----------------------------------------------------------------
         // 1. CONSULTA DEMOGRÁFICA: Agregación Numérica y Mapeo en Subconsulta
         // -----------------------------------------------------------------
         $sqlDemografia = "SELECT 
                              CASE 
                                 WHEN base.edad BETWEEN 0 AND 12 THEN '0 - 12 (Pediátrico)'
                                 WHEN base.edad BETWEEN 13 AND 17 THEN '13 - 17 (Adolescentes)'
                                 WHEN base.edad BETWEEN 18 AND 35 THEN '18 - 35 (Adulto Joven)'
                                 WHEN base.edad BETWEEN 36 AND 59 THEN '36 - 59 (Adulto)'
                                 WHEN base.edad >= 60 THEN '60+ (Adulto Mayor)'
                                 ELSE 'No Especificado'
                              END AS rango_edad,
                              base.sexo,
                              SUM(base.total_atenciones) AS total_atenciones,
                              COUNT(DISTINCT base.paciente_id) AS pacientes_unicos,
                              SUM(base.total_facturado) AS total_facturado
                           FROM (
                              SELECT 
                                 ot.paciente_edad AS edad,
                                 UPPER(TRIM(ot.paciente_sexo_historico)) AS sexo,
                                 ot.paciente_id,
                                 COUNT(ot.id) AS total_atenciones,
                                 SUM(ot.total_neto) AS total_facturado
                              FROM ordenes_trabajo ot
                              WHERE ot.fecha_cap BETWEEN ? AND ?
                                 AND ot.estatus != 'CANCELADO'
                                 $whereSucursal
                              GROUP BY ot.paciente_edad, ot.paciente_sexo_historico, ot.paciente_id
                           ) AS base
                           GROUP BY 
                              CASE 
                                 WHEN base.edad BETWEEN 0 AND 12 THEN 1
                                 WHEN base.edad BETWEEN 13 AND 17 THEN 2
                                 WHEN base.edad BETWEEN 18 AND 35 THEN 3
                                 WHEN base.edad BETWEEN 36 AND 59 THEN 4
                                 WHEN base.edad >= 60 THEN 5
                                 ELSE 6
                              END,
                              base.sexo
                           ORDER BY 
                              CASE 
                                 WHEN base.edad BETWEEN 0 AND 12 THEN 1
                                 WHEN base.edad BETWEEN 13 AND 17 THEN 2
                                 WHEN base.edad BETWEEN 18 AND 35 THEN 3
                                 WHEN base.edad BETWEEN 36 AND 59 THEN 4
                                 WHEN base.edad >= 60 THEN 5
                                 ELSE 6
                              END ASC";

         $sql1 = $this->dbh->prepare($sqlDemografia);
         $sql1->execute($params);            
         $res['demografia'] = $sql1->fetchAll(PDO::FETCH_ASSOC);

         // -----------------------------------------------------------------
         // 2. CONSULTA DE RECURRENCIA: Top Pacientes Frecuentes
         // -----------------------------------------------------------------
         $sqlRecurrencia = "SELECT 
                              ot.paciente_id,
                              MAX(ot.paciente_nombre_historico) AS paciente_nombre,
                              MAX(ot.paciente_sexo_historico) AS sexo,
                              MAX(ot.paciente_edad_registro) AS ultima_edad,
                              COUNT(ot.id) AS total_visitas,
                              SUM(ot.total_neto) AS gasto_total,
                              AVG(ot.total_neto) AS ticket_promedio,
                              MIN(ot.fecha_cap) AS primera_visita,
                              MAX(ot.fecha_cap) AS ultima_visita
                           FROM ordenes_trabajo ot
                           WHERE ot.fecha_cap BETWEEN ? AND ?
                              AND ot.estatus != 'CANCELADO'
                              $whereSucursal
                           GROUP BY ot.paciente_id
                           ORDER BY total_visitas DESC, gasto_total DESC
                           LIMIT 50";

         $sql2 = $this->dbh->prepare($sqlRecurrencia);
         $sql2->execute($params);            
         $res['recurrencia'] = $sql2->fetchAll(PDO::FETCH_ASSOC);

      } catch (Exception $error) {
         error_log("Error en analisis_pacientes: " . $error->getMessage());
      }
               
      return $res;
   }

   public function auditoria_cancelaciones(string $fechaIni, string $fechaFinal, int $id_sucursal) {
      $res = [
         'resumen_kpis'   => [],
         'cancelaciones'  => [],
         'top_descuentos' => [],
         'cargos_extra'   => []
      ];

      try {
         $fechas = $this->prepararRangoFechas($fechaIni, $fechaFinal);
         $params = [$fechas['inicio'], $fechas['fin']];
         
         $whereSucursal = "";
         if ($id_sucursal > 0) {
            $whereSucursal = " AND sucursal_id = ? ";
            $params[] = $id_sucursal;
         }

         // -----------------------------------------------------------------
         // 1. KPIs GLOBALES DE AUDITORÍA
         // -----------------------------------------------------------------
         $sqlKPIs = "SELECT 
                        COUNT(id) AS total_ordenes_creadas,
                        SUM(CASE WHEN estatus = 'CANCELADO' THEN 1 ELSE 0 END) AS total_canceladas,
                        SUM(CASE WHEN estatus = 'CANCELADO' THEN total_neto ELSE 0 END) AS monto_cancelado,
                        SUM(CASE WHEN estatus != 'CANCELADO' THEN 1 ELSE 0 END) AS total_activas,
                        SUM(CASE WHEN estatus != 'CANCELADO' THEN subtotal ELSE 0 END) AS subtotal_bruto_activo,
                        SUM(CASE WHEN estatus != 'CANCELADO' THEN descuento ELSE 0 END) AS total_descuentos_otorgados,
                        SUM(CASE WHEN estatus != 'CANCELADO' THEN cargo_extra ELSE 0 END) AS total_cargos_extra,
                        SUM(CASE WHEN estatus != 'CANCELADO' THEN total_neto ELSE 0 END) AS total_neto_activo
                     FROM ordenes_trabajo 
                     WHERE fecha_cap BETWEEN ? AND ? $whereSucursal";

         $sql1 = $this->dbh->prepare($sqlKPIs);
         $sql1->execute($params);            
         $res['resumen_kpis'] = $sql1->fetch(PDO::FETCH_ASSOC);

         // -----------------------------------------------------------------
         // 2. DETALLE DE ÓRDENES CANCELADAS
         // -----------------------------------------------------------------
         $sqlCanceladas = "SELECT 
                              id AS orden_id,
                              folio,
                              paciente_nombre_historico AS paciente,
                              convenio_nombre_historico AS convenio,
                              subtotal,
                              descuento,
                              cargo_extra,
                              total_neto,
                              total_abonado,
                              motivo_cancela,
                              user_cancela,
                              fecha_cancelacion,
                              user_cap,
                              fecha_cap
                           FROM ordenes_trabajo ot FORCE INDEX (idx_ot_cancelaciones)
                           WHERE fecha_cap BETWEEN ? AND ?
                              AND estatus = 'CANCELADO'
                              $whereSucursal
                           ORDER BY fecha_cancelacion DESC, fecha_cap DESC";

         $sql2 = $this->dbh->prepare($sqlCanceladas);
         $sql2->execute($params);            
         $res['cancelaciones'] = $sql2->fetchAll(PDO::FETCH_ASSOC);

         // -----------------------------------------------------------------
         // 3. AUDITORÍA DE DESCUENTOS OTORGADOS
         // -----------------------------------------------------------------
         $sqlDescuentos = "SELECT 
                              id AS orden_id,
                              folio,
                              paciente_nombre_historico AS paciente,
                              convenio_nombre_historico AS convenio,
                              subtotal,
                              descuento,
                              por_descuento,
                              total_neto,
                              user_cap,
                              fecha_cap
                           FROM ordenes_trabajo ot
                           WHERE fecha_cap BETWEEN ? AND ?
                              AND estatus != 'CANCELADO'
                              AND descuento > 0
                              $whereSucursal
                           ORDER BY descuento DESC, por_descuento DESC
                           LIMIT 50";

         $sql3 = $this->dbh->prepare($sqlDescuentos);
         $sql3->execute($params);            
         $res['top_descuentos'] = $sql3->fetchAll(PDO::FETCH_ASSOC);

         // -----------------------------------------------------------------
         // 4. AUDITORÍA DE CARGOS EXTRA
         // -----------------------------------------------------------------
         $sqlCargosExtra = "SELECT 
                              id AS orden_id,
                              folio,
                              paciente_nombre_historico AS paciente,
                              convenio_nombre_historico AS convenio,
                              subtotal,
                              cargo_extra,
                              motivo_cargo_extra,
                              total_neto,
                              user_cap,
                              fecha_cap
                           FROM ordenes_trabajo ot
                           WHERE fecha_cap BETWEEN ? AND ?
                              AND estatus != 'CANCELADO'
                              AND cargo_extra > 0
                              $whereSucursal
                           ORDER BY cargo_extra DESC";

         $sql4 = $this->dbh->prepare($sqlCargosExtra);
         $sql4->execute($params);            
         $res['cargos_extra'] = $sql4->fetchAll(PDO::FETCH_ASSOC);

      } catch (Exception $error) {
         error_log("Error en auditoria_cancelaciones: " . $error->getMessage());
      }
               
      return $res;
   }
}
?>