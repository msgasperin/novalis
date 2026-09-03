<?php
	require_once('../config/class.pdo.php');
	class Login extends Conexion {

		private $max_intentos  = 5;
      private $bloqueo_min   = 15; // minutos de bloqueo

		//Objeto principal del constructor de la clase
		public function __construct() {
         parent::__construct();
	   	$this->conectar();
	  	}

		public function generarToken(int $length) { 
			return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length); 
		} 

		public function login(string $usuario, string $contrasenia) {	
			try {
				$sql = $this->dbh->prepare(
               "SELECT id_usuario, id_sucursal_fk, U.nombre, usuario, correo, perfil, S.nombre AS sucursal, matriz
               FROM cat_usuarios AS U
               INNER JOIN cat_sucursales AS S ON U.id_sucursal_fk = S.id
               WHERE usuario = ? AND AES_DECRYPT(contrasenia,?) = ?"
            );
				$sql->execute(array($usuario, $this->key, $contrasenia));

            $sqlDataEmpresa = $this->dbh->prepare("SELECT nombre, logo, direccion, rfc, telefono, correo, web, key_client FROM datos_empresa");
            $sqlDataEmpresa->execute();
            $rowEmpresa = $sqlDataEmpresa->fetch(PDO::FETCH_ASSOC);

				if($sql->rowCount() == 1) {
					$row = $sql->fetch(PDO::FETCH_ASSOC);

               $estatus_caja   = 'no_aplica';
               $id_caja        = 0;
               $fecha_apertura = null;
               $fecha_cierre   = null;
               
               if($row["perfil"] == 'RECEPCION') {
                  $sqlCaja = $this->dbh->prepare("SELECT id_caja, estatus, DATE(fecha_apertura) AS fecha_apertura, DATE(fecha_cierre) AS fecha_cierre FROM cajas_sesiones WHERE id_usuario = ? ORDER BY id_caja DESC LIMIT 1");
                  $sqlCaja->execute([$row["id_usuario"]]);
                  

                  if($sqlCaja->rowCount() > 0) {
                     $rowCaja = $sqlCaja->fetch(PDO::FETCH_ASSOC);
                     $estatus_caja   = $rowCaja["estatus"];
                     $id_caja        = $rowCaja["id_caja"];
                     $fecha_apertura = $rowCaja["fecha_apertura"];
                     $fecha_cierre   = $rowCaja["fecha_cierre"];
                  }
               }

					$datos = [
						'id_usuario' 	  => $row["id_usuario"], 
						'nombre'         => $row["nombre"], 
						'usuario'        => $row["usuario"],
						'correo'         => $row["correo"],
                  'perfil'         => $row["perfil"],
                  'matriz'         => $row["matriz"],
                  'id_sucursal_fk' => $row["id_sucursal_fk"],
                  'sucursal'       => $row["sucursal"],
                  // Datos de la empresa cliente
                  'emp_nombre'     => $rowEmpresa["nombre"],
                  'emp_logo'       => $rowEmpresa["logo"],
                  'emp_direccion'  => $rowEmpresa["direccion"],
                  'emp_rfc'        => $rowEmpresa["rfc"],
                  'emp_telefono'   => $rowEmpresa["telefono"],
                  'emp_correo'     => $rowEmpresa["correo"],
                  'emp_web'        => $rowEmpresa["web"],
                  'emp_key'        => $rowEmpresa["key_client"],
                  // Datos de caja
                  'id_caja'        => $id_caja,
                  'estatus_caja'   => $estatus_caja,
                  'fecha_apertura' => $fecha_apertura,
                  'fecha_cierre'   => $fecha_cierre
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