<?php
	require_once('../config/class.pdo.php');
	class Portal extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	parent::__construct();
	   	$this->conectar();
	  	}
	
		public function obtiene_promociones() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, badge, nom_promocion, precio_original, precio_promocion, estudios FROM portal_promociones WHERE activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}

		public function guarda_promocion(array $post, string $estudios_promo, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar la promoción';
			try {
				$sql = $this->dbh->prepare("INSERT INTO portal_promociones (badge, nom_promocion, precio_original, precio_promocion, estudios, user_cap) VALUES (?,?,?,?,?,?)");
				$ok = $sql->execute(array($post["badgePromocion"], $post["nomPromocion"], $post["precioOriginal"], $post["precioPromocion"], $estudios_promo, $user_cap));

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

		public function actualiza_promocion(array $post, string $estudios_promo, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar la promoción';
			try {

				$sql = $this->dbh->prepare("UPDATE portal_promociones SET badge = ?, nom_promocion = ?, precio_original = ?, precio_promocion = ?, estudios = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				$ok = $sql->execute(array($post["badgePromocion"], $post["nomPromocion"], $post["precioOriginal"], $post["precioPromocion"], $estudios_promo, $user_cap, date('Y-m-d H:i:s'), $post["idPromocion"]));

				if($ok) {
					$estatus = 200;
					$data    = [$post["idPromocion"]];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function elimina_promocion(int $id_promocion) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE portal_promociones SET activo = ? WHERE id = ?");
				if($sql->execute(array(0, $id_promocion))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function actualiza_whats(string $whatsapp) {
			
      	$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar el whatsApp';

			try {
				$sql = $this->dbh->prepare("UPDATE datos_empresa SET whats_app = ?");
				if($sql->execute(array($whatsapp))) {
          		$estatus = 200;
					$mensaje = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function publica_cambios() {
			
			$res = [
				'whatsapp'    => '',
				'promociones' => [],
				'sucursales'  => [],
				'trae_datos'  => false
			];

			try {

				// Obtenemos el whatsApp actualizado
				$sql = $this->dbh->prepare("SELECT whats_app FROM datos_empresa");
				$sql->execute();
				if($sql->rowCount() > 0) {
					$row = $sql->fetch(PDO::FETCH_ASSOC);
					$res["whatsapp"]   = $row["whats_app"];
					$res["trae_datos"] = true;
				}

				// Obtenemos las promociones activas
				$sqlPromociones = $this->dbh->prepare("SELECT badge, nom_promocion, precio_original, precio_promocion, estudios FROM portal_promociones WHERE activo = 1");
				$sqlPromociones->execute();
				if($sqlPromociones->rowCount() > 0) {
					$rowPromociones = $sqlPromociones->fetchAll(PDO::FETCH_ASSOC);
					$res["promociones"] = $rowPromociones;
					$res["trae_datos"]  = true;
				}

				// Obtenemos las sucursales
				$sqlSucursales = $this->dbh->prepare("SELECT nombre, direccion, telefono, matriz FROM cat_sucursales WHERE activo = 1");
				$sqlSucursales->execute();
				if($sqlSucursales->rowCount() > 0) {
					$rowSucursales = $sqlSucursales->fetchAll(PDO::FETCH_ASSOC);
					$res["sucursales"] = $rowSucursales;
					$res["trae_datos"] = true;
				}
          		
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}


	}
?>