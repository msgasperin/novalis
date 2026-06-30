<?php
	require_once('../config/class.pdo.php');
	class Clientes extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}

		// ************************************************************************** CLIENTES ********************************************************************************************

		public function obtiene_clientes() {
			try {
				$res = [];
				$sql = $this->dbh->prepare("SELECT id_cliente, razon_social, nombre_comercial, rfc, persona_contacto, telefono_contacto, correo_contacto, direccion, lista_precio_id, tipo FROM cat_clientes WHERE activo = 1");
				$sql->execute();
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);				
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}
	
    	public function guardar_cliente(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al intentar insertar';
			try {        		
				$sql = $this->dbh->prepare("INSERT INTO cat_clientes (razon_social, nombre_comercial, rfc, persona_contacto, telefono_contacto, correo_contacto, direccion, lista_precio_id, tipo, password_plataforma, user_cap, fecha_cap) VALUES (?,?,?,?,?,?,?,?,?,AES_ENCRYPT(?,?),?,?)");
				
            $ok  = $sql->execute(array($post["razonSocialCliente"], $post["nomCliente"], $post["rfcCliente"], $post["personaContactoCliente"], $post["telCliente"], $post["correoCliente"], $post["direccionCliente"], $post["precioCliente"], $post["tipoCliente"], $post["passwordPlataformaCliente"], $this->key, $user_cap, date('Y-m-d H:i:s')));

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

		public function actualizar_cliente(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al intentar actualizar';
			try {

				if(empty($post["passwordPlataformaCliente"])) {
					$sql = $this->dbh->prepare("UPDATE cat_clientes SET razon_social = ?, nombre_comercial = ?, rfc = ?, persona_contacto = ?, telefono_contacto = ?, correo_contacto = ?, direccion = ?, lista_precio_id = ?, tipo = ?, user_cap = ?, fecha_cap = ? WHERE id_cliente = ?");
					
					$ok  = $sql->execute(array($post["razonSocialCliente"], $post["nomCliente"], $post["rfcCliente"], $post["personaContactoCliente"], $post["telCliente"], $post["correoCliente"], $post["direccionCliente"], $post["precioCliente"], $post["tipoCliente"], $user_cap, date('Y-m-d H:i:s'), $post["idCliente"]));
				}
				else {
					$sql = $this->dbh->prepare("UPDATE cat_clientes SET razon_social = ?, nombre_comercial = ?, rfc = ?, persona_contacto = ?, telefono_contacto = ?, correo_contacto = ?, direccion = ?, lista_precio_id = ?, tipo = ?, password_plataforma = AES_ENCRYPT(?,?), user_cap = ?, fecha_cap = ? WHERE id_cliente = ?");
					
					$ok  = $sql->execute(array($post["razonSocialCliente"], $post["nomCliente"], $post["rfcCliente"], $post["personaContactoCliente"], $post["telCliente"], $post["correoCliente"], $post["direccionCliente"], $post["precioCliente"], $post["tipoCliente"], $post["passwordPlataformaCliente"], $this->key, $user_cap, date('Y-m-d H:i:s'), $post["idCliente"]));
				}

				if($ok) {
					$estatus = 200;
					$data    = [$post["idCliente"]];
					$sql->rowCount() > 0 ? $mensaje = 'ok' : $mensaje = 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_cliente(int $id_cliente) {
      	$estatus = 500;
         $mensaje = 'Error al eliminar al cliente';
         $data    = [];
			try {
				$sql = $this->dbh->prepare("UPDATE cat_clientes SET activo = ? WHERE id_cliente = ?");
				if($sql->execute(array(0, $id_cliente))) {
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