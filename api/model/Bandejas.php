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

		
	}
?>