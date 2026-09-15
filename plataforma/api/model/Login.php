<?php
	require_once('../../../api/config/class.pdo.php');
	class Login extends Conexion {

		private $max_intentos  = 5;
      private $bloqueo_min   = 15; // minutos de bloqueo

		//Objeto principal del constructor de la clase
		public function __construct() {
         parent::__construct();
	   	$this->conectar();
	  	}

		public function login(string $usuario, string $contrasenia, string $fecha_nacimiento, string $tipo_cliente) {	

         $estatus = 500;
         $mensaje = 'Error al intentar iniciar sesión';
         $data    = [];

         try {

            if($tipo_cliente == 'paciente') {
               $sql = $this->dbh->prepare("SELECT id AS id_cliente, CONCAT(nombre,' ',apellido_paterno,' ',apellido_materno) AS nombre FROM cat_pacientes WHERE fecha_nacimiento = ? AND user_portal = ? AND AES_DECRYPT(password_portal,?) = ?");
               $sql->execute([$fecha_nacimiento, $usuario, $this->key, $contrasenia]);
            }
            else if($tipo_cliente == 'convenio') {
               $sql = $this->dbh->prepare("SELECT id_convenio AS id_cliente, nombre_comercial AS nombre FROM cat_convenios WHERE user_plataforma = ? AND AES_DECRYPT(password_plataforma,?) = ?");
               $sql->execute([$usuario, $this->key, $contrasenia]);
            }
            else {
               $mensaje = 'Tipo de cliente no válido';
               throw new Exception('Tipo de cliente no válido');
            }

				if($sql->rowCount() == 1) {
               $estatus = 200;
               $mensaje = 'ok';
					$data    = $sql->fetch(PDO::FETCH_ASSOC);
				}
            else {
               $mensaje = 'No se encontró ningún usuario con esas credenciales';
            }					
			} catch (Exception $error) {
            error_log($error->getMessage());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Rate Limit ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// Verificar si la IP está bloqueada
      public function esta_bloqueada(string $ip): bool {
         $sql = "SELECT bloqueado_hasta FROM login_intentos WHERE ip = :ip LIMIT 1";
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute([':ip' => $ip]);
         $row = $stmt->fetch(PDO::FETCH_ASSOC);

         if (!$row) return false;

         if (!empty($row['bloqueado_hasta'])) {
            // Si el bloqueo ya expiró, limpiar
            if (new DateTime() > new DateTime($row['bloqueado_hasta'])) {
               $this->limpiar_ip($ip);
               return false;
            }
            return true; // sigue bloqueada
         }

         return false;
      }

      // Registrar un intento fallido
      public function registrar_fallo(string $ip): int {
         // ¿Ya existe registro para esta IP?
         $sql = "SELECT id, intentos FROM login_intentos WHERE ip = :ip LIMIT 1";
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute([':ip' => $ip]);
         $row = $stmt->fetch(PDO::FETCH_ASSOC);

         if ($row) {
            $nuevos_intentos = $row['intentos'] + 1;
            $bloqueado_hasta = null;

            // Si ya llegó al límite, calcular bloqueo
            if ($nuevos_intentos >= $this->max_intentos) {
               $bloqueado_hasta = date('Y-m-d H:i:s', 
               strtotime("+{$this->bloqueo_min} minutes"));
            }

            $sql  = "UPDATE login_intentos SET intentos = :intentos, ultimo_intento = NOW(), bloqueado_hasta = :bloqueado_hasta WHERE ip = :ip";
            $stmt = $this->dbh->prepare($sql);
            $stmt->execute([
               ':intentos'        => $nuevos_intentos,
               ':bloqueado_hasta' => $bloqueado_hasta,
               ':ip'              => $ip
            ]);

            return $nuevos_intentos;

         } else {
            // Primer intento fallido de esta IP
            $sql = "INSERT INTO login_intentos (ip, intentos, ultimo_intento) VALUES (:ip, 1, NOW())";
            $stmt = $this->dbh->prepare($sql);
            $stmt->execute([':ip' => $ip]);
            return 1;
         }
      }

      // Limpiar intentos tras login exitoso
      public function limpiar_ip(string $ip): void {
         $sql = "DELETE FROM login_intentos WHERE ip = :ip";
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute([':ip' => $ip]);
      }

      // Minutos restantes de bloqueo (para el mensaje al usuario)
      public function minutos_restantes(string $ip): int {
         $sql = "SELECT bloqueado_hasta FROM login_intentos WHERE ip = :ip LIMIT 1";
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute([':ip' => $ip]);
         $row = $stmt->fetch(PDO::FETCH_ASSOC);

         if (!$row || empty($row['bloqueado_hasta'])) return 0;

         $ahora   = new DateTime();
         $expira  = new DateTime($row['bloqueado_hasta']);
         $diff    = $ahora->diff($expira);

         return max(1, ($diff->h * 60) + $diff->i + 1);
      }
	}
?>