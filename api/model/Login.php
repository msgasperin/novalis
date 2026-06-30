<?php
	require_once('../config/class.pdo.php');
	class Login extends Conexion {

		private $max_intentos  = 5;
      private $bloqueo_min   = 15; // minutos de bloqueo

		//Objeto principal del constructor de la clase
		public function __construct(string $base_datos) {
         parent::__construct($base_datos);
	   	$this->conectar();
	  	}

		public function generarToken(int $length) { 
			return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length); 
		} 

		public function login(string $usuario, string $contrasenia) {	
			try {
				$sql = $this->dbh->prepare("SELECT id_usuario, id_sucursal_fk, nombre, usuario, correo, perfil FROM cat_usuarios WHERE usuario = ? AND AES_DECRYPT(contrasenia,?) = ?");
				$sql->execute(array($usuario, $this->key, $contrasenia));

				if($sql->rowCount() == 1) {
					$row = $sql->fetch(PDO::FETCH_ASSOC);					
					$datos = [
						'id_usuario' 	  => $row["id_usuario"], 
						'id_sucursal_fk' => $row["id_sucursal_fk"], 
						'nombre'         => $row["nombre"], 
						'usuario'        => $row["usuario"],
						'correo'         => $row["correo"],
                  'perfil'         => $row["perfil"]
					];
					$res = array(
						'estatus' => 200,
						'mensaje' => 'login_ok',
						'data'    => $datos
					);
				}
				else	{
					$res = array(
						'estatus' => 202,
						'mensaje' => '',
						'data'    => []
					);
				}
					
			} catch (Exception $e) {
				$res = array(
					'estatus' => 500,
					'message' => 'error',
					'data'    => []
				);
			}
			
			return $res;
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