<?php
	require_once('../config/class.pdo.php');
	class DatosFacturacion extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	parent::__construct();
	   	$this->conectar();
	  	}
	
		public function obtiene_datos_facturacion(string $tipo_receptor, int $id_receptor) {
			$res = [];
			try {				
				$sql = $this->dbh->prepare(
               "SELECT id_datos_facturacion, tipo_receptor, id_receptor, rfc, razon_social, codigo_postal, clave_regimen_fiscal, regimen_fiscal, clave_uso_cfdi, uso_cfdi, calle, numero_exterior, numero_interior, colonia, municipio_alcaldia, estado, email_facturacion, es_predeterminado 
               FROM datos_facturacion 
               WHERE tipo_receptor = ? AND id_receptor = ?"
            );
				$sql->execute([$tipo_receptor, $id_receptor]);				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function guardar_datos_facturacion(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar los datos de facturación';
			try {
				$sql = $this->dbh->prepare("INSERT INTO datos_facturacion (tipo_receptor, id_receptor, rfc, razon_social, codigo_postal, clave_regimen_fiscal, regimen_fiscal,clave_uso_cfdi, uso_cfdi, calle, numero_exterior, numero_interior, colonia, municipio_alcaldia, estado, email_facturacion, es_predeterminado, fecha_cap, user_cap) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
				$ok = $sql->execute([
               $post["tipoReceptor"],
               $post["idReceptor"],
               $post["rfcFact"],
               $post["razonSocialFact"],
               $post["codigoPostalFact"],
               $post["idRegimenFiscalFact"],
               $post["regimenFiscalFact"],
               $post["idUsoCfdiFact"],
               $post["usoCfdiFact"],
               $post["calleFact"],
               $post["noExtFact"],
               $post["noIntFact"],
               $post["coloniaFact"],
               $post["municipioFact"],
               $post["estadoFact"],
               $post["correoFact"],
               $post["esPredeterminado"],
               date('Y-m-d H:i:s'),
               $user_cap
            ]);

				if($ok) {
					$estatus = 200;
					$data    = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
							
			$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function actualizar_datos_facturacion(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar el descuento';
			try {

				$sql = $this->dbh->prepare("UPDATE datos_facturacion SET tipo_receptor = ?, id_receptor = ?, rfc = ?, razon_social = ?, codigo_postal = ?, clave_regimen_fiscal = ?, regimen_fiscal = ?, clave_uso_cfdi = ?, uso_cfdi = ?, calle = ?, numero_exterior = ?, numero_interior = ?, colonia = ?, municipio_alcaldia = ?, estado = ?, email_facturacion = ?, es_predeterminado = ?, fecha_cap = ?, user_cap = ? WHERE id_datos_facturacion = ?");
            
				$ok = $sql->execute([
               $post["tipoReceptor"],
               $post["idReceptor"],
               $post["rfcFact"],
               $post["razonSocialFact"],
               $post["codigoPostalFact"],
               $post["idRegimenFiscalFact"],
               $post["regimenFiscalFact"],
               $post["idUsoCfdiFact"],
               $post["usoCfdiFact"],
               $post["calleFact"],
               $post["noExtFact"],
               $post["noIntFact"],
               $post["coloniaFact"],
               $post["municipioFact"],
               $post["estadoFact"],
               $post["correoFact"],
               $post["esPredeterminado"],
               date('Y-m-d H:i:s'),
               $user_cap,
               $post["idDatoFacturacion"]
            ]);

				if($ok) {
					$estatus = 200;
					$data    = [$post["idDatoFacturacion"]];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_dato_facturacion(int $id_datos_facturacion) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("DELETE FROM datos_facturacion WHERE id_datos_facturacion = ?");
				if($sql->execute(array($id_datos_facturacion))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
            print_r("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

	}
?>