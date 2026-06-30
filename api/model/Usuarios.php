<?php
	require_once('../config/class.pdo.php');
	class Usuarios extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}
	
		public function obtiene_usuarios() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id_usuario, U.nombre, usuario, correo, perfil, S.nombre AS sucursal, id_sucursal_fk FROM cat_usuarios AS U INNER JOIN cat_sucursales AS S ON U.id_sucursal_fk = S.id WHERE U.activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
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
				error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function guardar_usuario(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar guardar el usuario';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_usuarios (id_sucursal_fk, nombre, usuario, contrasenia, correo, perfil, user_cap) VALUES (?,?,?,AES_ENCRYPT(?,?),?,?,?)");
				$ok = $sql->execute(array($post["sucursalUsuario"], $post["nomUsuario"], $post["usuario"], $post["contrasenia"], $this->key, $post["mailUsuario"], $post["perfilUsuario"], $user_cap));

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

		public function actualizar_usuario(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar el usuario';
			try {

				if(empty($post["contrasenia"])) {
					$sql = $this->dbh->prepare("UPDATE cat_usuarios SET id_sucursal_fk = ?, nombre = ?, correo = ?, perfil = ?, user_cap = ?, fecha_cap = ? WHERE id_usuario = ?");
					$ok = $sql->execute(array($post["sucursalUsuario"], $post["usuario"], $post["mailUsuario"], $post["perfilUsuario"], $user_cap, date('Y-m-d H:i:s'), $post["idUsuario"]));

					if($ok) {
						$estatus = 200;
						$data    = [$post["idUsuario"]];
						$mensaje = 'ok';
					}
				}
				else {
					$sql = $this->dbh->prepare("UPDATE cat_usuarios SET id_sucursal_fk = ?, nombre = ?, contrasenia = AES_ENCRYPT(?,?), correo = ?, perfil = ?, user_cap = ?, fecha_cap = ? WHERE id_usuario = ?");
					$ok = $sql->execute(array($post["sucursalUsuario"], $post["nomUsuario"], $post["contrasenia"], $this->key, $post["mailUsuario"], $post["perfilUsuario"], $user_cap, date('Y-m-d H:i:s'), $post["idUsuario"]));

					if($ok) {
						$estatus = 200;
						$data    = [$post["idUsuario"]];
						$mensaje = 'ok';
					}
				}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
				print_r("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_usuario(int $id_usuario) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_usuarios SET activo = ? WHERE id_usuario = ?");
				if($sql->execute(array(0, $id_usuario))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

	}
?>