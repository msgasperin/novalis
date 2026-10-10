<?php
	require_once('../config/class.pdo.php');

	class Pacientes extends Conexion {
		protected PDO $dbh;

		public function __construct() {
			parent::__construct();
			$this->dbh = $this->getDbh();
		}

		public function genera_credenciales_paciente(): array {
			$caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
			$max_index  = strlen($caracteres) - 1;

			do {
				$user = random_int(100000, 999999);
				$stmt = $this->dbh->prepare("SELECT COUNT(id) FROM cat_pacientes WHERE user_portal = ? LIMIT 1");
				$stmt->execute([$user]);
				$existe = (int)$stmt->fetchColumn();
			} while ($existe > 0);

			$password = '';
			for ($i = 0; $i < 6; $i++) {
				$password .= $caracteres[random_int(0, $max_index)];
			}

			return [
				'user'     => $user,
				'password' => $password
			];
		}

		public function valida_coincidencia_paciente(string $nombre, string $paterno, ?string $materno, string $fechaNac): array {
			$estatus = 500;
			$mensaje = 'Hubo un problema para validar la coincidencia del paciente';
			$data    = [];

			try {
				$sql = "SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, 
               DATE_FORMAT(fecha_nacimiento, '%d-%m-%Y') AS fecha_nacimiento_format, 
               sexo_biologico, telefono, correo, score
					FROM (
						SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo_biologico, telefono, correo,
									(8 + 
									IF(apellido_paterno = ?, 5, 0) + 
									IF(apellido_materno = ? AND ? != '', 2, 0) + 
									IF(nombre LIKE CONCAT('%', ?, '%') OR ? LIKE CONCAT('%', nombre, '%'), 3, 0)
									) AS score
						FROM cat_pacientes
						WHERE fecha_nacimiento = ?

						UNION ALL

						SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo_biologico, telefono, correo,
									(5 + 
									IF(apellido_materno = ? AND ? != '', 2, 0) + 
									3
									) AS score
						FROM cat_pacientes
						WHERE apellido_paterno = ? 
							AND (nombre LIKE CONCAT('%', ?, '%') OR ? LIKE CONCAT('%', nombre, '%'))
							AND fecha_nacimiento != ?
					) AS resultados
					WHERE score >= 8
					ORDER BY score DESC, fecha_nacimiento DESC
					LIMIT 10;";

				$stmt = $this->dbh->prepare($sql);

				$nombreClean  = trim($nombre);
				$paternoClean = trim($paterno);
				$maternoClean = trim($materno ?? '');

				$stmt->execute([
					// Mapeo para la Rama 1
					$paternoClean, // IF(apellido_paterno = ?)
					$maternoClean, // IF(apellido_materno = ?)
					$maternoClean, // AND ? != ''
					$nombreClean,  // LIKE CONCAT('%', ?, '%')
					$nombreClean,  // OR ? LIKE...
					$fechaNac,     // WHERE fecha_nacimiento = ?

					// Mapeo para la Rama 2
					$maternoClean, // IF(apellido_materno = ?)
					$maternoClean, // AND ? != ''
					$paternoClean, // WHERE apellido_paterno = ?
					$nombreClean,  // LIKE CONCAT('%', ?, '%')
					$nombreClean,  // OR ? LIKE...
					$fechaNac      // AND fecha_nacimiento != ?
				]);

					$estatus = 200;
					$mensaje = 'ok';
					$data    = $stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			catch (Exception $error) {
				error_log("Error en valida_coincidencia_paciente: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			return [
				'estatus' => $estatus, 
				'mensaje' => $mensaje, 
				'data'    => $data
			];
		}

		public function busca_pacientes_coincidencia(string $parametro): array {
			$res = [];
			$parametroClean = trim($parametro);

			if (empty($parametroClean)) {
				return $res;
			}

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
				error_log("Error en busca_pacientes_coincidencia: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			return $res;
		}

		public function busca_pacientes_fecha_nac(string $fecha): array {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, DATE_FORMAT(fecha_nacimiento, '%d-%m-%Y') AS fecha_nacimiento_format, sexo_biologico, telefono, correo FROM cat_pacientes WHERE activo = ? AND fecha_nacimiento = ?");
				$sql->execute([1, $fecha]);
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en busca_pacientes_fecha_nac: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function obtiene_credenciales_pacientes(int $id_paciente): array {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, user_portal, AES_DECRYPT(password_portal, ?) AS contrasenia FROM cat_pacientes WHERE id = ?");
				$sql->execute([$this->key, $id_paciente]);
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en obtiene_credenciales_pacientes: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function guardar_paciente(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al guardar al paciente';

			try {
				$credenciales = $this->genera_credenciales_paciente();
				$user         = $credenciales["user"];
				$password     = $credenciales["password"];

				$sql = $this->dbh->prepare("INSERT INTO cat_pacientes (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo_biologico, telefono, correo, user_portal, password_portal, user_cap, fecha_cap) VALUES (?,?,?,?,?,?,?,?,AES_ENCRYPT(?,?),?,?)");

				$ok = $sql->execute([
					trim($post["nomPaciente"]), 
					trim($post["apPaterno"]), 
					trim($post["apMaterno"] ?? ''), 
					$post["fechaNacimiento"], 
					$post["sexoBiologico"], 
					trim($post["telefonoPaciente"]), 
					trim($post["correoPaciente"] ?? ''), 
					$user, 
					$password, 
					$this->key, 
					$user_cap,
					date('Y-m-d H:i:s')
				]);

				if ($ok) {
					$idPaciente = (int)$this->dbh->lastInsertId();
					$estatus    = 200;
					$data       = [$idPaciente];
					$mensaje    = 'ok';	
				}
			} 
			catch (Exception $error) {
				error_log("Error en guardar_paciente: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizar_paciente(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al actualizar datos del paciente';

			try {
				$idPaciente = (int)$post["idPaciente"];

				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, fecha_nacimiento = ?, sexo_biologico = ?, telefono = ?, correo = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");

				$ok = $sql->execute([
					trim($post["nomPaciente"]), 
					trim($post["apPaterno"]), 
					trim($post["apMaterno"] ?? ''), 
					$post["fechaNacimiento"], 
					$post["sexoBiologico"], 
					trim($post["telefonoPaciente"]), 
					trim($post["correoPaciente"] ?? ''), 
					$user_cap, 
					date('Y-m-d H:i:s'), 
					$idPaciente
				]);

				if ($ok) {
					$estatus = 200;
					$data    = [$idPaciente];
					$mensaje = $sql->rowCount() > 0 ? 'ok' : 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualizar_paciente: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $mensaje];
		}

		public function eliminar_paciente(int $id_paciente): array {
			$estatus = 500;
			$mensaje = 'Error al eliminar el paciente';
			$data    = [0];

			try {
				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET activo = ? WHERE id = ?");
				$ok  = $sql->execute([0, $id_paciente]);
				
				if ($ok) {
					$estatus = 200;
					$data    = [$id_paciente];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en eliminar_paciente: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}

			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function cambiar_credenciales(int $id_paciente): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al cambiar credenciales al paciente';

			try {
				$credenciales = $this->genera_credenciales_paciente();
				$user         = $credenciales["user"];
				$password     = $credenciales["password"];

				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET user_portal = ?, password_portal = AES_ENCRYPT(?,?) WHERE id = ?");
				$ok  = $sql->execute([$user, $password, $this->key, $id_paciente]);

				if ($ok) {
					$estatus = 200;
					$data    = [$id_paciente];
					$mensaje = 'ok';	
				}
			} 
			catch (Exception $error) {
				error_log("Error en cambiar_credenciales: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}
	}
?>