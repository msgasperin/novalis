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
					$whereSucursal = " AND cs.id_sucursal = ? ";
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
							WHERE DATE(fecha_apertura) BETWEEN ? AND ? {$whereSucursal}
							ORDER BY id_caja DESC";

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