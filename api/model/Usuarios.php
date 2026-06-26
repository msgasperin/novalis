<?php
	require_once('../config/class.pdo.php');
	class Usuarios extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
			$this->conectar();
		}

		public function actualizar_llave(int $llave) {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al intentar actualizar la llave';
			try {
				$sqlVal = $this->dbh->prepare("SELECT clave FROM clave_autorizacion WHERE clave = ?");
				$sqlVal->execute(array($llave));
				if($sqlVal->rowCount() <= 0) {
					$sql = $this->dbh->prepare("UPDATE clave_autorizacion SET clave = ?	 WHERE id = ?");
					if($sql->execute(array($llave, 1))) {
						if($sql->rowCount() > 0) {
							$estatus = 200;
							$mensaje = 'ok';
						}
					}
				}
				else {					
					$mensaje = 'Debes ingresar un código de autorización diferente al actual';
				}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			

      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}
	
		public function obtiene_usuarios() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, nombre, usuario, celular, correo, foto, perfil FROM cat_usuarios WHERE estatus = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function obtiene_datos_usuario(int $id_usuario) {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, nombre, celular, correo, foto, usuario, AES_DECRYPT(contrasenia,?) AS contrasenia FROM cat_usuarios WHERE id = ?");
				$sql->execute(array($this->key, $id_usuario));				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function usuario_existente(int $id_usuario, string $usuario) {
			$res = false;
			try {
				$sql = $this->dbh->prepare("SELECT id FROM cat_usuarios WHERE usuario = ? AND id <> ?");
				$sql->execute(array($usuario, $id_usuario));
				if($sql->rowCount() > 0) {
          		$res = true;
        		} 
			}
			catch (Exception $error) {
				error_log($error->getMessage());
			}
						
			return $res;
		}

		public function guardar_usuario(array $post, string $user_cap, int $id_fabrica) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar el usuario';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_usuarios (id_fabrica_fk, nombre, usuario, contrasenia, celular, correo, perfil, user_cap) VALUES (?,?,?,AES_ENCRYPT(?,?),?,?,?,?)");
				if($sql->execute(array($id_fabrica, $post["nomUsuario"], $post["usuario"], $post["contrasenia"], $this->key, $post["celUsuario"], $post["mailUsuario"], $post["perfilUsuario"], $user_cap))) {
					$estatus = 200;
					$data    = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log($error->getMessage());
			}
							
			$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function actualizar_usuario(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar el usuario';
			try {

				if($post["contrasenia"] == '') {
					$sql = $this->dbh->prepare("UPDATE cat_usuarios SET nombre = ?, celular = ?, correo = ?, perfil = ?, user_cap = ?, fec_cap = ? WHERE id = ?");
					if($sql->execute(array($post["nomUsuario"], $post["celUsuario"], $post["mailUsuario"], $post["perfilUsuario"], $user_cap, date('Y-m-d H:i:s'), $post["idUsuario"]))) {				
						$estatus = 200;
						$data    = [$post["idUsuario"]];
						$mensaje = 'ok';
					}
				}
				else {
					$sql = $this->dbh->prepare("UPDATE cat_usuarios SET nombre = ?, contrasenia = AES_ENCRYPT(?,?), celular = ?, correo = ?, perfil = ?, user_cap = ?, fec_cap = ? WHERE id = ?");
					if($sql->execute(array($post["nomUsuario"], $post["contrasenia"], $this->key, $post["celUsuario"], $post["mailUsuario"], $post["perfilUsuario"], $user_cap, date('Y-m-d H:i:s'), $post["idUsuario"]))) {				
						$estatus = 200;
						$data    = [$post["idUsuario"]];
						$mensaje = 'ok';
					}
				}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

    	public function actualizar_foto_user(string $nom_foto, int $id_usuario) {
   		$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_usuarios SET foto = ? WHERE id = ?");
				if($sql->execute(array($nom_foto, $id_usuario))) {
          	$res = true;
        	}
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function eliminar_usuario(int $id_usuario) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_usuarios SET estatus = ? WHERE id = ?");
				if($sql->execute(array(0, $id_usuario))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		public function consulta_log(string $fecha_ini, string $fecha_fin, int $id_usuario) {
			$res = [];
			try {				
				if($id_usuario == 0) {
					$sql = $this->dbh->prepare("SELECT usuario, fecha, DATE_FORMAT(fecha,'%d-%m-%Y %H:%i:%s') AS fecha_format, accion, id_tracking FROM bitacora WHERE fecha >= ? AND fecha <= ?");
					$sql->execute([$fecha_ini, $fecha_fin]);
				}
				else {
					$sql = $this->dbh->prepare("SELECT usuario, fecha, DATE_FORMAT(fecha,'%d-%m-%Y %H:%i:%s') AS fecha_format, accion, id_tracking FROM bitacora WHERE id_usuario = ? AND (fecha >= ? AND fecha <= ?)");
					$sql->execute([$id_usuario, $fecha_ini, $fecha_fin]);
				}
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}
	}
?>