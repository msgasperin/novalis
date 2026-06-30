<?php
	require_once('../config/class.pdo.php');
	class Empresas extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}

		// ************************************************************************** CLIENTES ********************************************************************************************

		public function obtiene_empresas() {
			try {
				$res = [];
				$sql = $this->dbh->prepare("SELECT id_empresa, razon_social, nombre_comercial, rfc, persona_contacto, telefono_contacto, correo_contacto, direccion, lista_precio_id, tipo FROM cat_empresas WHERE activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);				
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}
	
    	public function guardar_empresa(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al intentar insertar';
			try {        		
				$sql = $this->dbh->prepare("INSERT INTO cat_empresas (razon_social, nombre_comercial, rfc, persona_contacto, telefono_contacto, correo_contacto, direccion, lista_precio_id, tipo, user_cap, fecha_cap) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
				
            $ok  = $sql->execute(array($post["razonSocialEmpresa"], $post["nomComercial"], $post["rfcEmpresa"], $post["personaContactoEmpresa"], $post["telEmpresa"], $post["correoEmpresa"], $post["direccionEmpresa"], $post["precioEmpresa"], $post["tipoEmpresa"], $user_cap, date('Y-m-d H:i:s')));

				if($ok) {
					$id = $this->dbh->lastInsertId();
					if((int)$id > 0) {
						$estatus = 200;
						$data    = [$id];
						$mensaje = 'ok';
					}
					else {
						$estatus = 200;
						$data    = [$id];
						$mensaje = 'Registro guardado, pero no se pudo obtener el ID';
					}
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
            //print_r("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function actualizar_empresa(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al intentar actualizar';
			try {
				$sql = $this->dbh->prepare("UPDATE cat_empresas SET razon_social = ?, nombre_comercial = ?, rfc = ?, persona_contacto = ?, telefono_contacto = ?, correo_contacto = ?, direccion = ?, lista_precio_id = ?, tipo = ?, user_cap = ?, fecha_cap = ? WHERE id_empresa = ?");
				
            $ok  = $sql->execute(array($post["razonSocialEmpresa"], $post["nomComercial"], $post["rfcEmpresa"], $post["personaContactoEmpresa"], $post["telEmpresa"], $post["correoEmpresa"], $post["direccionEmpresa"], $post["precioEmpresa"], $post["tipoEmpresa"], $user_cap, date('Y-m-d H:i:s'), $post["idEmpresa"]));

				if($ok) {
					$estatus = 200;
					$data    = [$post["idEmpresa"]];
					$sql->rowCount() > 0 ? $mensaje = 'ok' : $mensaje = 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_empresa(int $id_empresa) {
      	$estatus = 500;
         $mensaje = 'Error al eliminar la empresa';
         $data    = [];
			try {
				$sql = $this->dbh->prepare("UPDATE cat_empresas SET activo = ? WHERE id_empresa = ?");
				if($sql->execute(array(0, $id_empresa))) {
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