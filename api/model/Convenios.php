<?php
	require_once('../config/class.pdo.php');
	class Convenios extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	parent::__construct();
	   	$this->conectar();
	  	}

		// *********************************************************************** CONVENIOS ******************************************************************************************

		public function obtiene_convenios() {
			try {
				$res = [];
				$sql = $this->dbh->prepare("SELECT id_convenio, nombre_comercial, persona_contacto, telefono_contacto, correo_contacto, direccion, lista_precio_id, nombre, tipo FROM cat_convenios AS C INNER JOIN cat_listas_precios AS P ON C.lista_precio_id = P.id WHERE C.activo = 1");
				$sql->execute();
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);				
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}
	
    	public function guardar_convenio(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al intentar insertar';
			try {        		
				$sql = $this->dbh->prepare("INSERT INTO cat_convenios (nombre_comercial, persona_contacto, telefono_contacto, correo_contacto, direccion, lista_precio_id, tipo, password_plataforma, user_cap, fecha_cap) VALUES (?,?,?,?,?,?,?,AES_ENCRYPT(?,?),?,?)");
				
            $ok  = $sql->execute(array($post["nomConvenio"], $post["personaContacto"], $post["telefono"], $post["correo"], $post["direccion"], $post["precio"], $post["tipo"], $post["passwordPlataforma"], $this->key, $user_cap, date('Y-m-d H:i:s')));

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
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function actualizar_convenio(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al intentar actualizar';
			try {

				if(empty($post["passwordPlataforma"])) {
					$sql = $this->dbh->prepare("UPDATE cat_convenios SET nombre_comercial = ?, persona_contacto = ?, telefono_contacto = ?, correo_contacto = ?, direccion = ?, lista_precio_id = ?, tipo = ?, user_cap = ?, fecha_cap = ? WHERE id_convenio = ?");
					
					$ok  = $sql->execute(array($post["nomConvenio"], $post["personaContacto"], $post["telefono"], $post["correo"], $post["direccion"], $post["precio"], $post["tipo"], $user_cap, date('Y-m-d H:i:s'), $post["idConvenio"]));
				}
				else {
					$sql = $this->dbh->prepare("UPDATE cat_convenios SET nombre_comercial = ?, persona_contacto = ?, telefono_contacto = ?, correo_contacto = ?, direccion = ?, lista_precio_id = ?, tipo = ?, password_plataforma = AES_ENCRYPT(?,?), user_cap = ?, fecha_cap = ? WHERE id_convenio = ?");
					
					$ok  = $sql->execute(array($post["nomConvenio"], $post["personaContacto"], $post["telefono"], $post["correo"], $post["direccion"], $post["precio"], $post["tipo"], $post["passwordPlataforma"], $this->key, $user_cap, date('Y-m-d H:i:s'), $post["idConvenio"]));
				}

				if($ok) {
					$estatus = 200;
					$data    = [$post["idConvenio"]];
					$sql->rowCount() > 0 ? $mensaje = 'ok' : $mensaje = 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_convenio(int $id_convenio) {
      	$estatus = 500;
         $mensaje = 'Error al eliminar el convenio';
         $data    = [];
			try {
				$sql = $this->dbh->prepare("UPDATE cat_convenios SET activo = ? WHERE id_convenio = ?");
				if($sql->execute(array(0, $id_convenio))) {
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