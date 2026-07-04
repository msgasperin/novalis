<?php
	require_once('../config/class.pdo.php');
	class Pacientes extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
	   	parent::__construct($base_datos);
	   	$this->conectar();
	  	}
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_lista_precios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

		public function genera_credenciales_paciente(string $nom_paciente, string $ap_paterno) {
			// Usuario: primera letra del nombre + apellido con inicial mayúscula + 2 dígitos aleatorios
			$user = strtolower(substr(trim($nom_paciente), 0, 1)).ucfirst(strtolower(trim($ap_paterno))).random_int(10, 99);
			// Password: 8 caracteres alfanuméricos sin caracteres confusos
			$caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
			$password   = '';

			for ($i = 0; $i < 8; $i++) {
				$password .= $caracteres[random_int(0, strlen($caracteres) - 1)];
			}
			
			return [$user, $password];
		}

		public function obtiene_pacientes() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, DATE_FORMAT(fecha_nacimiento, '%d-%m-%Y') AS fecha_nacimiento_format, sexo_biologico, telefono, correo FROM cat_pacientes WHERE activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function obtiene_credenciales_pacientes(int $id_paciente) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, user_portal, AES_DECRYPT(password_portal, ?) AS contrasenia FROM cat_pacientes WHERE id = ?");
				$sql->execute([$this->key, $id_paciente]);
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function ver_credenciales_paciente() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, DATE_FORMAT(fecha_nacimiento, '%d-%m-%Y') AS fecha_nacimiento_format, sexo_biologico, telefono, correo FROM cat_pacientes WHERE activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function guardar_paciente(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al guardar al paciente';
			try {

				// Usuario: primera letra del nombre + apellido con inicial mayúscula + 2 dígitos aleatorios
				$credenciales = $this->genera_credenciales_paciente($post["nomPaciente"], $post["apPaterno"]);
				$user         = $credenciales[0];
				$password     = $credenciales[1];

				$sql = $this->dbh->prepare("INSERT INTO cat_pacientes (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo_biologico, telefono, correo, user_portal, password_portal, user_cap) VALUES (?,?,?,?,?,?,?,?,AES_ENCRYPT(?,?),?)");

				$ok = $sql->execute(array($post["nomPaciente"], $post["apPaterno"], $post["apMaterno"], $post["fechaNacimiento"], $post["sexoBiologico"], $post["telefonoPaciente"], $post["correoPaciente"], $user, $password, $this->key, $user_cap));

				if($ok) {
					$idPaciente = $this->dbh->lastInsertId();
					$estatus = 200;
					$data    = [$idPaciente];
					$mensaje = 'ok';	
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function actualizar_paciente(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$message = 'Error al actualizar datos del paciente';
			try {
				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, fecha_nacimiento = ?, sexo_biologico = ?, telefono = ?, correo = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");

				$ok = $sql->execute(array($post["nomPaciente"], $post["apPaterno"], $post["apMaterno"], $post["fechaNacimiento"], $post["sexoBiologico"], $post["telefonoPaciente"], $post["correoPaciente"], $user_cap, date('Y-m-d H:i:s'), $post["idPaciente"]));

				if($ok) {
					$estatus = 200;
					$data    = [$post["idPaciente"]];
					$message = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $message);
			return $res;
		}

		public function eliminar_paciente(int $id_estudio) {
      	$estatus = 500;
			$mensaje = 'Error al eliminar el estudio';
			$data    = [0];
			try {
				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET activo = ? WHERE id = ?");
				$ok  = $sql->execute(array(0, $id_estudio));
				
				if($ok) {
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

		public function cambiar_credenciales(int $id_paciente, string $nom_paciente, string $ap_paterno) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al cambiar credenciales al paciente';
			try {

				// Usuario: primera letra del nombre + apellido con inicial mayúscula + 2 dígitos aleatorios
				$credenciales = $this->genera_credenciales_paciente($nom_paciente, $ap_paterno);
				$user         = $credenciales[0];
				$password     = $credenciales[1];

				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET user_portal = ?, password_portal = AES_ENCRYPT(?,?) WHERE id = ?");
				$ok = $sql->execute([$user, $password, $this->key, $id_paciente]);

				if($ok) {
					$estatus = 200;
					$mensaje = 'ok';	
        		}
			} 
			catch (Exception $error) {
        		error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
				print_r("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}
	}
?>