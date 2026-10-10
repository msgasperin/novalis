<?php
	require_once('../config/class.pdo.php');

	class Convenios extends Conexion {
		protected PDO $dbh;

		public function __construct() {
			parent::__construct();
			$this->dbh = $this->getDbh();
		}

		// *********************************************************************** CONVENIOS ******************************************************************************************

		public function genera_credenciales_convenios(): array {
			$caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
			$max_index  = strlen($caracteres) - 1;

			// 1. Reintentar la generación de $user hasta que sea único en la BD
			do {
				$user = random_int(100000, 999999);
				$stmt = $this->dbh->prepare("SELECT COUNT(id_convenio) FROM cat_convenios WHERE user_plataforma = ? LIMIT 1");
				$stmt->execute([$user]);
				$existe = (int)$stmt->fetchColumn();
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

		public function obtiene_convenios(): array {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id_convenio, nombre_comercial, persona_contacto, telefono_contacto, correo_contacto, direccion, lista_precio_id, nombre, tipo FROM cat_convenios AS C INNER JOIN cat_listas_precios AS P ON C.lista_precio_id = P.id WHERE C.activo = 1 ORDER BY C.id_convenio DESC");
				$sql->execute();
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);				
			} catch (Exception $error) {
				error_log("Error en obtiene_convenios: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return $res;
		}
	
		public function guardar_convenio(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar insertar';

			try {
				$credenciales = $this->genera_credenciales_convenios();
				$user         = $credenciales["user"];
				$password     = $credenciales["password"];

				$sql = $this->dbh->prepare("INSERT INTO cat_convenios (nombre_comercial, persona_contacto, telefono_contacto, correo_contacto, direccion, lista_precio_id, tipo, user_plataforma, password_plataforma, user_cap, fecha_cap) VALUES (?, ?, ?, ?, ?, ?, ?, ?, AES_ENCRYPT(?,?), ?, ?)");
				
				$ok = $sql->execute([
					$post["nomConvenio"], 
					$post["personaContacto"], 
					$post["telefono"], 
					$post["correo"], 
					$post["direccion"], 
					(int)$post["precio"], 
					$post["tipo"], 
					$user, 
					$password, 
					$this->key, 
					$user_cap, 
					date('Y-m-d H:i:s')
				]);

				if ($ok) {
					$id = (int)$this->dbh->lastInsertId();
					if ($id > 0) {
						$estatus = 200;
						$data    = [$id];
						$mensaje = 'ok';
					} else {
						$estatus = 200;
						$data    = [0];
						$mensaje = 'Registro guardado, pero no se pudo obtener el ID';
					}
				}
			} 
			catch (Exception $error) {
				error_log("Error en guardar_convenio: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizar_convenio(array $post, string $user_cap): array {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al intentar actualizar';

			try {
				$idConvenio = (int)$post["idConvenio"];

				$sql = $this->dbh->prepare("UPDATE cat_convenios SET nombre_comercial = ?, persona_contacto = ?, telefono_contacto = ?, correo_contacto = ?, direccion = ?, lista_precio_id = ?, tipo = ?, user_cap = ?, fecha_cap = ? WHERE id_convenio = ?");
				
				$ok = $sql->execute([
					$post["nomConvenio"], 
					$post["personaContacto"], 
					$post["telefono"], 
					$post["correo"], 
					$post["direccion"], 
					(int)$post["precio"], 
					$post["tipo"], 
					$user_cap, 
					date('Y-m-d H:i:s'), 
					$idConvenio
				]);

				if ($ok) {
					$estatus = 200;
					$data    = [$idConvenio];
					$mensaje = $sql->rowCount() > 0 ? 'ok' : 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
				error_log("Error en actualizar_convenio: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function eliminar_convenio(int $id_convenio): array {
			$estatus = 500;
			$mensaje = 'Error al eliminar el convenio';
			$data    = [];

			try {
				$sql = $this->dbh->prepare("UPDATE cat_convenios SET activo = ? WHERE id_convenio = ?");
				if ($sql->execute([0, $id_convenio])) {
					$estatus = 200;
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log("Error en eliminar_convenio: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function obtiene_credenciales_convenio(int $id_convenio): array {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id_convenio, user_plataforma, AES_DECRYPT(password_plataforma, ?) AS contrasenia FROM cat_convenios WHERE id_convenio = ?");
				$sql->execute([$this->key, $id_convenio]);
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log("Error en obtiene_credenciales_convenio: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return $res;
		}

		public function cambiar_credenciales_convenio(int $id_convenio): array {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al cambiar credenciales al convenio';

			try {
				$credenciales = $this->genera_credenciales_convenios();
				$user         = $credenciales["user"];
				$password     = $credenciales["password"];

				$sql = $this->dbh->prepare("UPDATE cat_convenios SET user_plataforma = ?, password_plataforma = AES_ENCRYPT(?,?) WHERE id_convenio = ?");
				$ok  = $sql->execute([$user, $password, $this->key, $id_convenio]);

				if ($ok) {
					$estatus = 200;
					$mensaje = 'ok';	
				}
			} 
			catch (Exception $error) {
				error_log("Error en cambiar_credenciales_convenio: " . $error->getMessage() . "\nTraza:\n" . $error->getTraceAsString());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}
	}
?>