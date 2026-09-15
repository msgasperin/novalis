<?php
	require_once('../config/class.pdo.php');
	class Pacientes extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	parent::__construct();
	   	$this->conectar();
	  	}
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES cat_lista_precios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

		public function genera_credenciales_paciente() {
			$caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
			$max_index  = strlen($caracteres) - 1;

			// 1. Reintentar la generación de $user hasta que sea único en la BD
			do {
				$user = random_int(100000, 999999);
				// Consulta ligera para validar existencia mediante el índice único
				$stmt = $this->dbh->prepare("SELECT COUNT(id) FROM cat_pacientes WHERE user_portal = ? LIMIT 1");
				$stmt->execute([$user]);
				$existe = $stmt->fetchColumn();
			} while ($existe > 0);

			// 2. Generar el password una vez que se garantiza un $user único
			$password = '';
			for ($i = 0; $i < 6; $i++) {
				$password .= $caracteres[random_int(0, $max_index)];
			}

			return [
				'user'     => $user,
				'password' => $password
			];
		}

		public function valida_coincidencia_paciente(string $nombre, string $paterno, ?string $materno, string $fechaNac) {

			$estatus = 500;
			$mensaje = 'Hubo un problema para validar la coincidencia del paciente';
			$data    = [];

			try {
				$sql = "SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, 
									DATE_FORMAT(fecha_nacimiento, '%d-%m-%Y') AS fecha_nacimiento_format, 
									sexo_biologico, telefono, correo, score
							FROM (
								-- Rama 1: Filtro ultra rápido por fecha de nacimiento (Garantiza score >= 8 por B-Tree)
								SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo_biologico, telefono, correo,
											(8 + 
											IF(apellido_paterno = :paterno1, 5, 0) + 
											IF(apellido_materno = :materno1 AND :materno1 != '', 2, 0) + 
											IF(nombre LIKE CONCAT('%', :nombre1, '%') OR :nombre1 LIKE CONCAT('%', nombre, '%'), 3, 0)
											) AS score
								FROM cat_pacientes
								WHERE fecha_nacimiento = :fecha_nac

								UNION ALL

								-- Rama 2: Filtro por paterno + nombre cuando la fecha es distinta pero los nombres coinciden (Score >= 8)
								SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo_biologico, telefono, correo,
											(5 + 
											IF(apellido_materno = :materno2 AND :materno2 != '', 2, 0) + 
											3
											) AS score
								FROM cat_pacientes
								WHERE apellido_paterno = :paterno2 
									AND (nombre LIKE CONCAT('%', :nombre2, '%') OR :nombre2 LIKE CONCAT('%', nombre, '%'))
									AND fecha_nacimiento != :fecha_nac2
							) AS resultados
							WHERE score >= 8
							ORDER BY score DESC, fecha_nacimiento DESC
							LIMIT 10;";

				$stmt = $this->dbh->prepare($sql);
				
				$nombreClean  = trim($nombre);
				$paternoClean = trim($paterno);
				$maternoClean = trim($materno ?? '');

				$stmt->execute([
					':nombre1'   => $nombreClean,
					':paterno1'  => $paternoClean,
					':materno1'  => $maternoClean,
					':fecha_nac' => $fechaNac,
					
					':nombre2'   => $nombreClean,
					':paterno2'  => $paternoClean,
					':materno2'  => $maternoClean,
					':fecha_nac2'=> $fechaNac
				]);

				$estatus = 200;
				$mensaje = 'ok';
				$data    = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			catch(Exception $error) {
				error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			return [
				'estatus' => $estatus, 
				'mensaje' => $mensaje, 
				'data'    => $data
			];
		}

		public function busca_pacientes_coincidencia(string $parametro) {
			$res = [];
			$parametroClean = trim($parametro);

			if (empty($parametroClean)) {
				return $res;
			}

			// Limpiamos caracteres especiales y preparamos términos con operador + y * (Boolean Mode)
			$palabras = array_filter(explode(' ', preg_replace('/[^\w\s]/u', '', $parametroClean)));
			
			if (empty($palabras)) {
				return $res;
			}

			$matchQuery = '';
			foreach ($palabras as $p) {
				$matchQuery .= '+' . $p . '* ';
			}
			$matchQuery = trim($matchQuery);

			try {
				$sqlTexto = "SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, 
										DATE_FORMAT(fecha_nacimiento, '%d-%m-%Y') AS fecha_nacimiento_format, 
										sexo_biologico, telefono, correo 
								FROM cat_pacientes 
								WHERE activo = ? 
								AND MATCH(nombre, apellido_paterno, apellido_materno, correo) AGAINST(? IN BOOLEAN MODE)
								LIMIT 20";

				$sql = $this->dbh->prepare($sqlTexto);
				$sql->execute([1, $matchQuery]);

				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			return $res;
		}

		public function busca_pacientes_fecha_nac(string $fecha) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, DATE_FORMAT(fecha_nacimiento, '%d-%m-%Y') AS fecha_nacimiento_format, sexo_biologico, telefono, correo FROM cat_pacientes WHERE activo = ? AND fecha_nacimiento = ?");
				$sql->execute([1, $fecha]);
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
				$credenciales = $this->genera_credenciales_paciente();
				$user         = $credenciales["user"];
				$password     = $credenciales["password"];

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
						
			$res = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
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

		public function cambiar_credenciales(int $id_paciente) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al cambiar credenciales al paciente';
			try {

				$credenciales = $this->genera_credenciales_paciente();
				$user         = $credenciales["user"];
				$password     = $credenciales["password"];

				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET user_portal = ?, password_portal = AES_ENCRYPT(?,?) WHERE id = ?");
				$ok = $sql->execute([$user, $password, $this->key, $id_paciente]);

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
	}
?>