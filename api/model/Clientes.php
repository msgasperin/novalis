<?php
	require_once('../config/class.pdo.php');
	class Clientes extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  	}
	
		// *********************************************************************** CATEGORÍAS *****************************************************************************************
		public function obtiene_categorias_clientes() {
			try {
				$res = [];
				$sql = $this->dbh->prepare("SELECT id, nom_categoria, icon_categoria FROM cat_categorias_clientes WHERE activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			return $res;
		}

		public function guardar_categoria(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al intentar guardar categoría';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_categorias_clientes (nom_categoria, icon_categoria, user_cap) VALUES (?,?,?)");			
				$ok  = $sql->execute(array($post["nomCategoria"], $post["iconCategoria"], $user_cap));

				if($ok) {
					$id = $this->dbh->lastInsertId();
					if((int)$id > 0) {
						$estatus = 200;
						$data    = [$id];
						$mensaje = 'ok';
					}
					else {
						$estatus = 200;
						$data    = [0];
						$mensaje = 'Se insertó pero no se generó un ID, hablar con el administrador';
					}
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}		
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function actualizar_categoria(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al actualizar categoría';
			try {
				$sql = $this->dbh->prepare("UPDATE cat_categorias_clientes SET nom_categoria = ?, icon_categoria = ?, user_cap = ?, fec_cap = ? WHERE id = ?");
				$ok  = $sql->execute(array($post["nomCategoria"], $post["iconCategoria"], $user_cap, date('Y-m-d H:i:s'), $post["idCategoria"]));
				if($ok) {
					$estatus = 200;
					$data    = [];
					$sql->rowCount() > 0 ? $mensaje = 'ok' : $mensaje = 'No hubo cambios que actualizar';
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_categoria(int $id_categoria) {
			$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_categorias_clientes SET activo = ? WHERE id = ?");
				$ok = $sql->execute([0, $id_categoria]);
				if($ok) {
					$res = true; // se ejecutó correctamente
				}
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			return $res;
		}

		// ************************************************************************** CLIENTES ********************************************************************************************
		public function obtiene_clientes_saldos(int $perfil) {
			$res = [];
			try {
				if($perfil == 1) {
					$sql = $this->dbh->prepare("SELECT id_cliente, cliente, id_categoria, nom_categoria, icon_categoria, rfc, telefono, celular, correo, dias_credito, direccion, logo, COALESCE(SUM(P.total + P.cargo_extra), 0) AS total, COALESCE(SUM(P.abonos), 0) AS abonos, id_lista_precios
						FROM cat_clientes AS C 	
						INNER JOIN cat_categorias_clientes AS B ON C.id_categoria = B.id
						LEFT JOIN pedido AS P ON C.id_cliente = P.id_cliente_fk AND P.estatus <> 'Cancelado' AND P.fecha_cap >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
						WHERE C.estatus = 1
						GROUP BY id_cliente"
					);
				}
				else {
					$sql = $this->dbh->prepare("SELECT id_cliente, cliente, id_categoria, nom_categoria, icon_categoria, rfc, telefono, celular, correo, dias_credito, direccion, logo, 0 AS total, 0 AS abonos, id_lista_precios
						FROM cat_clientes AS C 	
						INNER JOIN cat_categorias_clientes AS B ON C.id_categoria = B.id
						WHERE C.estatus = 1"
					);
				}
				$sql->execute();
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function obtiene_clientes() {
			try {
				$res = [];
				$sql = $this->dbh->prepare("SELECT id_cliente, cliente, id_categoria, nom_categoria, icon_categoria, id_lista_precios, nom_precio, rfc, telefono, celular, correo, dias_credito, direccion, logo
					FROM cat_clientes AS C 
					INNER JOIN cat_categorias_clientes AS B ON C.id_categoria = B.id 
					INNER JOIN cat_listas_precios AS L ON C.id_lista_precios = L.id 
					WHERE C.estatus = 1"
				);
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);				
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}
	
    	public function guardar_cliente(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al intentar insertar';
			try {        		
				$sql = $this->dbh->prepare("INSERT INTO cat_clientes (cliente, id_categoria, id_lista_precios, rfc, telefono, celular, correo, dias_credito, direccion, user_cap) VALUES (?,?,?,?,?,?,?,?,?,?)");
				$ok  = $sql->execute(array($post["nomCliente"], $post["idCategoria"], $post["idListaPrecios"], $post["rfcCliente"], $post["telCliente"], $post["celCliente"], $post["mailCliente"], $post["diasCreditoCliente"], $post["direccionCliente"], $user_cap));

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
        		error_log($error->getMessage());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function actualizar_cliente(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al intentar actualizar';
			try {
				$sql = $this->dbh->prepare("UPDATE cat_clientes SET cliente = ?, id_categoria = ?, id_lista_precios = ?, rfc = ?, telefono = ?, celular = ?, correo = ?, dias_credito = ?, direccion = ?, user_cap = ?, fec_cap = ? WHERE id_cliente = ?");
				$ok = $sql->execute(array($post["nomCliente"], $post["idCategoria"], $post["idListaPrecios"], $post["rfcCliente"], $post["telCliente"], $post["celCliente"], $post["mailCliente"], $post["diasCreditoCliente"], $post["direccionCliente"], $user_cap, date('Y-m-d H:i:s'), $post["idCliente"]));

				if($ok) {
					$estatus = 200;
					$data    = [$post["idCliente"]];
					$sql->rowCount() > 0 ? $mensaje = 'ok' : $mensaje = 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

    	public function actualiza_logo_cliente(string $nom_foto, int $id_cliente) {
   		$res = false;
			try {        		
				$sql = $this->dbh->prepare("UPDATE cat_clientes SET logo = ? WHERE id_cliente = ?");
				if($sql->execute(array($nom_foto, $id_cliente))) {
          	$res = true;
        	}
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function eliminar_cliente(int $id_cliente) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_clientes SET estatus = ? WHERE id_cliente = ?");
				if($sql->execute(array(0, $id_cliente))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}
	}
?>