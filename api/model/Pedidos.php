<?php
	require_once('../config/class.pdo.php');
	class Pedidos extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  	}
		
		public function generarCadena(int $longitud = 10) {
			$caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			$max = strlen($caracteres) - 1;
			$cadena = '';

			for ($i = 0; $i < $longitud; $i++) {
				$cadena .= $caracteres[random_int(0, $max)];
			}

			return $cadena;
		}

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES devoluciones ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function agregar_devolucion(int $id_fabrica, array $post, string $user_cap) {
			$res = ['estatus' => 500, 'mensaje' => 'Hubo un problema para agregar la devolución', 'data' => []];
			try {
				$sql = $this->dbh->prepare("INSERT INTO pedido_devolucion (id_fabrica_fk, id_pedido_fk, id_pedido_detalle_fk, cantidad, es_merma, tipo_resolucion, motivo, user_cap) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
				if($sql->execute([$id_fabrica, $post["objDevolucion"]["idPedido"], $post["objDevolucion"]["idPedidoDetalle"], $post["objDevolucion"]["cantidadDevolucion"], $post["objDevolucion"]["esMerma"], $post["objDevolucion"]["resolucionDevolucion"], $post["objDevolucion"]["motivoDevolucion"], $user_cap])) {
					$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => [$this->dbh->lastInsertId()]];
				}
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			return $res;
		}

		public function eliminar_devolucion(int $id_devolucion) {
			$res = ['estatus' => 500, 'mensaje' => 'Hubo un problema para eliminar la devolución', 'data' => []];
			try {
				$sql = $this->dbh->prepare("DELETE FROM pedido_devolucion WHERE id_devolucion = ?");				
				if($sql->execute([$id_devolucion])) {
					$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];
				}
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			return $res;
		}

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES detalle pedidos ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function agregar_producto_pedido(int $id_pedido, int $id_producto, float $cantidad, float $por_descuento, int $id_lista_precios, int $id_fabrica) {
			$res = ['estatus' => 500, 'mensaje' => 'Hubo un problema para agregar el producto', 'data' => []];

			try {
				/*
				// ── 1. Validar existencia y stock ──────────────────────────────────
				$sqlStock = $this->dbh->prepare("SELECT stock FROM existencias WHERE id_producto_fk = ? AND id_fabrica_fk = ?");
				$sqlStock->execute([$id_producto, $id_fabrica]);
				$row = $sqlStock->fetch(PDO::FETCH_ASSOC);

				if (!$row) {
					throw new Exception('No se encontró el producto para validar existencia');
				}

				if ($cantidad > $row['stock']) {
					throw new Exception('Stock insuficiente: disponible ' . $row['stock']);
				}
				*/

				// ── 2. Insertar detalle del pedido ─────────────────────────────────
				// Fix #3: se evita repetir :cantidad usando una subconsulta que
				// materializa los valores calculados una sola vez.
				$sql = $this->dbh->prepare(
						"INSERT INTO pedido_detalle (
							id_fabrica_fk, id_pedido_fk, id_producto_fk,
							sku_hist, nom_producto_hist,
							costo_unitario_hist, precio_unitario_hist,
							cantidad, por_descuento,
							monto_descuento, subtotal_linea, total_linea, utilidad_linea
						)
						SELECT
							base.id_fabrica,
							base.id_pedido,
							base.id_producto_fk,
							base.sku,
							base.nom_producto,
							base.costo,
							base.precio_venta,
							base.cantidad,
							base.por_descuento,
							ROUND(base.subtotal * (base.por_descuento / 100.0), 2)                  AS monto_descuento,
							ROUND(base.subtotal, 2)                                                  AS subtotal_linea,
							ROUND(base.subtotal - (base.subtotal * (base.por_descuento / 100.0)), 2) AS total_linea,
							ROUND((base.subtotal - (base.subtotal * (base.por_descuento / 100.0))) - base.costo_total, 2) AS utilidad_linea
						FROM (
							SELECT
								:id_fabrica                    AS id_fabrica,
								:id_pedido                     AS id_pedido,
								C.id_producto_fk,
								C.sku,
								C.nom_producto,
								P.costo,
								C.precio_venta,
								:cantidad                      AS cantidad,
								:por_descuento                 AS por_descuento,
								C.precio_venta * :cantidad2    AS subtotal,      -- alias para no repetir param
								P.costo        * :cantidad3    AS costo_total
							FROM cat_precios C
							INNER JOIN cat_productos P ON C.id_producto_fk = P.id
							WHERE C.id_lista_precio_fk = :id_lista
								AND C.id_producto_fk     = :id_producto
								AND P.activo             = 1
						) AS base"
				);

				$sql->execute([
						':id_fabrica'    => $id_fabrica,
						':id_pedido'     => $id_pedido,
						':cantidad'      => $cantidad,
						':cantidad2'     => $cantidad,   // misma razón: PDO no permite reusar named params
						':cantidad3'     => $cantidad,
						':por_descuento' => $por_descuento,
						':id_lista'      => $id_lista_precios,
						':id_producto'   => $id_producto,
				]);

				// Fix #2: verificar que realmente se insertó una fila
				if ($sql->rowCount() === 0) {
					throw new Exception('El producto no existe en la lista de precios indicada o está inactivo');
				}

				$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];

			} catch (Exception $error) {
				error_log($error->getMessage());
				$res['mensaje'] = $error->getMessage(); // Fix #1: el llamador recibe el motivo real
			}

			return $res;
		}

		public function eliminar_producto_pedido(int $id_detalle_pedido) {
			$res = ['estatus' => 500, 'mensaje' => 'Hubo un problema para agregar el producto', 'data' => []];
			try {
				$sql = $this->dbh->prepare("DELETE FROM pedido_detalle WHERE id_detalle = ?");
				if($sql->execute([$id_detalle_pedido])) {
					$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];
				}

			} catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			return $res;
		}
		
		public function obtiene_detalle_pedido(int $id_pedido) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id_detalle, id_producto_fk, P.id_pedido_fk, sku_hist, nom_producto_hist, P.cantidad, precio_unitario_hist, por_descuento, monto_descuento, subtotal_linea, total_linea, utilidad_linea, estatus, IFNULL(id_devolucion, 0) AS id_devolucion, PD.cantidad AS cantidad_devolucion, es_merma, tipo_resolucion, motivo
				FROM pedido_detalle AS P
				LEFT JOIN pedido_devolucion AS PD ON P.id_detalle = PD.id_pedido_detalle_fk
				WHERE P.id_pedido_fk = ?");
				$sql->execute(array($id_pedido));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function obtiene_montos_pedido(int $id_pedido) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT subtotal, descuento, total, cargo_extra, debiente, abonos FROM pedido WHERE id_pedido = ?");
				$sql->execute(array($id_pedido));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES pedidos ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function obtiene_pedidos(int $origen, string $estatus, string $fecha_ini, string $fecha_fin) {
			$res    = [];
			$params = [];
			
			if ($origen == 2) {
				$condicion = 'P.estatus = :estatus AND fecha_cap >= :fecha_ini AND fecha_cap <= :fecha_fin';
				$params[':estatus']   = $estatus;
				$params[':fecha_ini'] = $fecha_ini;
				$params[':fecha_fin'] = $fecha_fin;
			} 
			else if ($estatus == 'Debientes') {
				$condicion = 'debiente > 0 AND P.estatus <> "Cancelado"';
			} 
			else {
				$condicion = 'P.estatus = :estatus';
				$params[':estatus'] = $estatus;
			}

			try {
				$query = "SELECT id_pedido, tipo_pedido, folio, nom_cliente_hist, logo, id_categoria_cliente_fk, nom_categoria_cliente_hist, icon_categoria, id_lista_precios_fk, subtotal, descuento, cargo_extra, motivo_cargo_extra, total, costo_total, utilidad_total, abonos, debiente, fecha_entrega, DATE_FORMAT(fecha_entrega,'%d-%m-%Y') AS fecha_entrega_format, fecha_limite_pago, DATE_FORMAT(fecha_limite_pago,'%d-%m-%Y') AS fecha_limite_pago_format, fecha_cap, DATE_FORMAT(fecha_cap,'%d-%m-%Y %H:%i:%s') AS fecha_cap_format, P.user_cap, DATE_FORMAT(fecha_surtido,'%d-%m-%Y %H:%i:%s') AS fecha_surtido_format, DATE_FORMAT(fecha_pagado,'%d-%m-%Y %H:%i:%s') AS fecha_pagado_format, P.estatus, observaciones, key_query, visto
				FROM pedido AS P 
				INNER JOIN cat_categorias_clientes AS C ON C.id = P.id_categoria_cliente_fk
				INNER JOIN cat_clientes AS CL ON P.id_cliente_fk = CL.id_cliente
				WHERE ".$condicion." ORDER BY id_pedido ASC";
				
				$sql = $this->dbh->prepare($query);        
        		// 3. Ejecutar pasando únicamente los parámetros que se usaron
        		$sql->execute($params);

				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		public function registrar_pedido(array $post, array $carrito, string $user_cap, int $id_fabrica) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema procesar el pedido';
			try {	
				// 1. Iniciar la transacción
				$this->dbh->beginTransaction();

				/*
				// 2. Validación de stock
				$ids_productos = array_column($carrito, 'id_producto');
				$placeholders  = implode(',', array_fill(0, count($ids_productos), '?'));

				$stmtStock = $this->dbh->prepare("SELECT id_producto_fk, stock FROM existencias WHERE id_producto_fk IN ($placeholders) AND id_fabrica_fk = ? FOR UPDATE");
				$stmtStock->execute([...$ids_productos, $id_fabrica]);
				$stock_db = $stmtStock->fetchAll(PDO::FETCH_UNIQUE | PDO::FETCH_ASSOC);

				$errores_stock = [];
				foreach ($carrito as $item) {
					$id  = $item['id_producto'];
					$qty = $item['cantidad'];

					if (!isset($stock_db[$id])) {
						$errores_stock[] = "Producto \"{$item['nom_producto']}\" no encontrado en existencias.";
						continue;
					}

					$disponible = (float) $stock_db[$id]['stock'];
					if ($qty > $disponible) {
						$errores_stock[] = sprintf(
							'"%s" — solicitado: %d, disponible: %s',
							$item['nom_producto'],
							$qty,
							$disponible
						);
					}
				}
				
				if (!empty($errores_stock)) {
					// Lanzar excepción con los productos problemáticos
					throw new Exception('Stock insuficiente: ' . implode(' | ', $errores_stock));
				}
				*/
				
				// 3. Asegurar registro del año Y de la fábrica (Atómico)
				// Gracias a tu PK compuesta, esto solo insertará si la combinación no existe.
				$stmtInit = $this->dbh->prepare("INSERT INTO consecutivos (tipo, anio, id_fabrica_fk, ultimo) VALUES ('PEDIDO', ?, ?, 0) ON DUPLICATE KEY UPDATE ultimo = ultimo");
				$stmtInit->execute([date('Y'), $id_fabrica]);

				// 4. Incrementar consecutivo filtrando por los 3 campos de la PK
				$stmtUpd = $this->dbh->prepare("UPDATE consecutivos SET ultimo = LAST_INSERT_ID(ultimo + 1) WHERE tipo = 'PEDIDO' AND anio = ? AND id_fabrica_fk = ?");
				$stmtUpd->execute([date('Y'),  $id_fabrica]);

				// 5. Obtener el número generado de forma segura
				$consecutivo = $this->dbh->query("SELECT LAST_INSERT_ID()")->fetchColumn();
				
				$folio = 'PE-' . date('y') . '-' . $id_fabrica . '-' . $consecutivo;

				$post["fechaEntrega"]     == '' ? $fecha_entrega =  null : $fecha_entrega = $post["fechaEntrega"];
				$post["fechaPagoPedido"]  == '' ? $fecha_pago    =  null : $fecha_pago    = $post["fechaPagoPedido"];
				$post["cargoExtraPedido"] == '' ? $cargo_extra   =  0    : $cargo_extra   = $post["cargoExtraPedido"];

				$key_query = 'PE'. date('y').$id_fabrica.$consecutivo.$this->generarCadena(5);
			
				// 6. Insertar la Cabecera (Venta)
				// Nota: Los campos financieros (total, subtotal, etc.) no se envían porque inician en 0 por DEFAULT
				$sqlVenta = $this->dbh->prepare("INSERT INTO pedido (id_fabrica_fk, anio, id_folio, folio, tipo_pedido, id_cliente_fk, nom_cliente_hist, id_categoria_cliente_fk, nom_categoria_cliente_hist, id_lista_precios_fk, nom_lista_precios_fk, cargo_extra, motivo_cargo_extra, fecha_entrega, fecha_limite_pago, user_cap, observaciones, key_query ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

				$paramsVenta = [
					$id_fabrica,
					date('Y'),
					$consecutivo,
					$folio,
					$post["tipoPedido"],
					$post["clientePedido"],
					$post["nomCliente"],
					$post["idCategoriaCliente"],
					$post["nomCategoriaCliente"],
					$post["idListaPrecios"],
					$post["nomListaPrecios"],
					$cargo_extra,
					$post["motivoCargoExtraPedido"] ?? '',
					$fecha_entrega,
					$fecha_pago,
					$user_cap,
					$post["observaciones"],
					$key_query
				];

				if (!$sqlVenta->execute($paramsVenta)) {
					throw new Exception("Error al insertar la cabecera de venta");
				}

				// 7. Obtener el ID de la venta recién creada
				$idVenta = $this->dbh->lastInsertId();

				// 8. Insertar el Detalle (Bucle de productos del carrito)
				// Asumiendo que $post["carrito"] es un array con los productos
				$sqlDetalle = $this->dbh->prepare("INSERT INTO pedido_detalle (id_fabrica_fk, id_pedido_fk, id_producto_fk, sku_hist, nom_producto_hist, costo_unitario_hist, precio_unitario_hist, cantidad, por_descuento, monto_descuento, subtotal_linea, total_linea, utilidad_linea) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

				foreach ($carrito as $item) {
					// --- CÁLCULOS POR RENGLÓN ---
					$subtotal_linea = $item["precio"] * $item["cantidad"];
					$monto_desc     = $item["descuento"] ?? 0;
					$total_linea    = $subtotal_linea - $monto_desc;
					// Utilidad = Total de línea - (Costo * Cantidad)
					$utilidad_linea = $total_linea - ($item["costo"] * $item["cantidad"]);

					$paramsDetalle = [
						$id_fabrica,
						$idVenta,
						$item["id_producto"],
						$item["sku"],
						$item["nom_producto"],
						$item["costo"],
						$item["precio"],
						$item["cantidad"],
						$item["por_descuento"] ?? 0,
						$monto_desc,
						$subtotal_linea,
						$total_linea,
						$utilidad_linea
					];

					if (!$sqlDetalle->execute($paramsDetalle)) {
							throw new Exception("Error al insertar el producto: " . $item["nombre"]);
					}
				}

				// 9. Si todo salió bien, confirmamos los cambios
				$this->dbh->commit();

				$estatus = 200;
				$data    = [$idVenta, $folio];
				$mensaje = 'Pedido registrado con éxito';
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				$es_error_stock = str_starts_with($error->getMessage(), 'Stock insuficiente');
				$mensaje = $es_error_stock ? $error->getMessage() : 'Hubo un problema al procesar el pedido';
				error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function obtiene_precios_lista_cliente(int $id_lista_precios) {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT C.id, C.id_producto_fk, C.sku, C.nom_producto, precio_base_ref, precio_venta, costo, nom_presentacion, stock
               FROM cat_precios AS C 
               INNER JOIN cat_productos AS P ON C.id_producto_fk = P.id 
               INNER JOIN cat_presentaciones AS PR ON P.id_presentacion_fk = PR.id 
					INNER JOIN existencias AS E ON E.id_producto_fk = C.id_producto_fk
               WHERE id_lista_precio_fk = ? AND P.activo = ?");
				$sql->execute(array($id_lista_precios, 1));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

      public function valida_clave_autorizacion(int $clave) {
			$res = false;
			try {
				$sql = $this->dbh->prepare("SELECT clave FROM clave_autorizacion WHERE clave = ?");
				$sql->execute(array($clave));
				if($sql->rowCount() > 0) {
					$res = true;
				}
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			return $res;
		}

		public function marcar_pedido_visto(int $id_pedido, int $visto, int $id_usuario, string $usuario) {
			$res = ['estatus' => 500, 'mensaje' => 'Error al intentar actualizar a visto', 'data' => []];

			try {
				$this->dbh->beginTransaction();

				// 1. Solo actualizamos si realmente pasa de no visto (0) a visto (1)
				if ($visto === 0) {
					$sql = $this->dbh->prepare("UPDATE pedido SET visto = ? WHERE id_pedido = ?");
					$sql->execute([1, $id_pedido]);
				}

				// 2. Intentar registrar quién lo vio (si ya existe, se ignora gracias al cambio en BD)
				$sqlVisto = $this->dbh->prepare("INSERT INTO pedido_visto (id_pedido_fk, id_usuario_fk, usuario_vio) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id_pedido_fk = id_pedido_fk");
				$sqlVisto->execute([$id_pedido, $id_usuario, $usuario]);

				$this->dbh->commit();
				
				$res['estatus'] = 200;
				$res['mensaje'] = 'ok';
				
			} catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log($error->getMessage());
			}

			return $res;
		}

		public function obtiene_vieron_pedido(int $id_pedido) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, usuario_vio, DATE_FORMAT(fecha, '%d-%m-%Y %H:%i:%s') AS fecha FROM pedido_visto WHERE id_pedido_fk = ?");
				$sql->execute(array($id_pedido));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}


		public function marcar_pedido_transito(int $id_pedido, string $user_cap) {
			$estatus = 500;
			$mensaje = 'error inicial';
			$data    = [];

			try {
				$this->dbh->beginTransaction();

				// 2. Validación de stock ----> Obtenemos el pedido registrado
				$sqlVal = $this->dbh->prepare("SELECT id_producto_fk, nom_producto_hist, cantidad, id_fabrica_fk FROM pedido_detalle WHERE id_pedido_fk = ?");
				$sqlVal->execute(array($id_pedido));

				if($sqlVal->rowCount() <= 0) {
					throw new Exception('Pedido no encontrado');
				}


				$carrito    = $sqlVal->fetchAll(PDO::FETCH_ASSOC);
				$id_fabrica = $carrito[0]["id_fabrica_fk"];

				$ids_productos = array_column($carrito, 'id_producto_fk');
				$placeholders  = implode(',', array_fill(0, count($ids_productos), '?'));

				$stmtStock = $this->dbh->prepare("SELECT id_producto_fk, stock FROM existencias WHERE id_producto_fk IN ($placeholders) AND id_fabrica_fk = ? FOR UPDATE");
				$stmtStock->execute([...$ids_productos, $id_fabrica]);
				$stock_db = $stmtStock->fetchAll(PDO::FETCH_UNIQUE | PDO::FETCH_ASSOC);

				$errores_stock = [];
				foreach ($carrito as $item) {
					$id  = $item['id_producto_fk'];
					$qty = (float)$item['cantidad'];

					if (!isset($stock_db[$id])) {
						$errores_stock[] = "Producto \"{$item['nom_producto_hist']}\" no encontrado en existencias.";
						continue;
					}

					$disponible = (float) $stock_db[$id]['stock'];

					if ($qty > $disponible) {
						$errores_stock[] = sprintf(
							'"%s" — solicitado: %d, disponible: %s',
							$item['nom_producto_hist'],
							$qty,
							$disponible
						);
					}
				}
				
				if (!empty($errores_stock)) {
					// Lanzar excepción con los productos problemáticos
					throw new Exception('Stock insuficiente: ' . implode(' | ', $errores_stock));
				}
				

				$sql = $this->dbh->prepare("UPDATE pedido SET estatus = ?, fecha_transito = ?, user_transito = ? WHERE id_pedido = ? AND estatus = ?");
				$sql->execute(array('Transito', date('Y-m-d H:i:s'), $user_cap, $id_pedido, 'Proceso'));

				if($sql->rowCount() <= 0) {
					throw new Exception('El pedido ya fue procesado previamente');
				}


				$sqlDetalle = $this->dbh->prepare("UPDATE pedido_detalle SET estatus = ? WHERE id_pedido_fk = ?");
				$sqlDetalle->execute(['transito', $id_pedido]);

				$this->dbh->commit();
				$estatus = 200;
				$mensaje = 'ok';			
				
				$res = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
				
			} catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				$es_error_stock = str_starts_with($error->getMessage(), 'Stock insuficiente');
				$mensaje = $es_error_stock ? $error->getMessage() : 'Hubo un problema al procesar el pedido';
				error_log($error->getMessage());
				$res = ['estatus' => 500, 'mensaje' => $mensaje, 'data' => $data];
			}
			
			return $res;
		}

		public function marcar_pedido_surtido(int $id_pedido, string $user_cap) {
			$res = false;
			try {
				$this->dbh->beginTransaction();

				$sql = $this->dbh->prepare("UPDATE pedido SET estatus = ?, fecha_surtido = ?, user_surtido = ? WHERE id_pedido = ? AND estatus = ?");
				$sql->execute(array('Surtido', date('Y-m-d H:i:s'), $user_cap, $id_pedido, 'Transito'));

				$sqlDetalle = $this->dbh->prepare("UPDATE pedido_detalle SET estatus = ? WHERE id_pedido_fk = ?");
				$sqlDetalle->execute(['surtido', $id_pedido]);

				$this->dbh->commit();
				return true;
				
			} catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
            	$this->dbh->rollBack();
        		}
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function cancelar_pedido(int $id_pedido, string $motivo, string $user_cap) {
			$res = ['estatus' => 500, 'mensaje' => 'Hubo un problema para cancelar el pedido', 'data' => []];
			try {
				$this->dbh->beginTransaction();

				$sql = $this->dbh->prepare("UPDATE pedido SET estatus = ?, fecha_cancelado = ?, user_cancelado = ?, motivo_cancelado = ? WHERE id_pedido = ?");
				$sql->execute(['Cancelado', date('Y-m-d H:i:s'), $user_cap, $motivo, $id_pedido]);

				$sqlDetalle = $this->dbh->prepare("UPDATE pedido_detalle SET estatus = ? WHERE id_pedido_fk = ?");
				$sqlDetalle->execute(['cancelado', $id_pedido]);
					
				$this->dbh->commit();
				$res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];

			} catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log($error->getMessage());	
			}
			
			return $res;
		}

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  Adjuntar evidencias ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function agregar_evidencia_pedido(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al intentar insertar evidencia';
			try {
				$sql = $this->dbh->prepare("INSERT INTO pedido_evidencia (id_pedido_fk, tipo_evidencia, nom_archivo, user_cap) VALUES (?,?,?,?)");
				if($sql->execute(array($post["idPedido"], $post["tipoEvidencia"], $post["archivo"], $user_cap))) {
					$estatus = 200;
					$data = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function eliminar_evidencia_pedido(int $id_evidencia) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al eliminar evidencia';
			try {
				$sql = $this->dbh->prepare("DELETE FROM pedido_evidencia WHERE id = ?");
				if($sql->execute(array($id_evidencia))) {
					$estatus = 200;
					$data    = [];
					$mensaje = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function actualiza_archivo_pedido(string $nom_archivo, int $id_evidencia) {
   		$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE pedido_evidencia SET nom_archivo = ? WHERE id = ?");
				if($sql->execute(array($nom_archivo, $id_evidencia))) {
          	$res = true;
        	}
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			return $res;
		}

		public function obtiene_evidencia_pedido(int $id_pedido) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, tipo_evidencia, nom_archivo FROM pedido_evidencia WHERE id_pedido_fk = ?");
				$sql->execute(array($id_pedido));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  Abonos ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function agregar_abono_pedido(array $post, int $id_fabrica, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al agregar un abono';
			try {
				$this->dbh->beginTransaction();

				$sqlVal = $this->dbh->prepare("SELECT id_pedido FROM pedido WHERE id_pedido = ? AND ? <= debiente AND (estatus = ? OR estatus = ? OR estatus = ?) FOR UPDATE");
				$sqlVal->execute(array($post["idPedido"], $post["montoAbono"], 'Proceso', 'Transito', 'Surtido'));
				if($sqlVal->rowCount() > 0) {
					$sql = $this->dbh->prepare("INSERT INTO pedido_abono (id_fabrica_fk, id_pedido_fk, monto_abono, metodo_pago, user_recibio) VALUES (?,?,?,?,?)");
					$sql->execute(array($id_fabrica, $post["idPedido"], $post["montoAbono"], $post["metodoPago"], $user_cap));
					
					$estatus = 200;
					$data    = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
				}
				else {
					$mensaje = 'El pedido no cumple las condiciones para aceptar el abono: Debiente o estatus inconsistentes';
				}
				$this->dbh->commit();
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
        		error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function eliminar_abono_pedido(int $id_abono) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al eliminar un abono';
			try {
				$sql = $this->dbh->prepare("DELETE FROM pedido_abono WHERE id_abono = ?");
				if($sql->execute(array($id_abono))) {
					$estatus = 200;
					$data    = [];
					$mensaje = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function obtiene_abonos_pedido(int $id_pedido) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id_abono, monto_abono, DATE_FORMAT(fecha_abono,'%d-%m-%Y %H:%i:%s') AS fecha_abono, metodo_pago, user_recibio FROM pedido_abono WHERE id_pedido_fk = ?");
				$sql->execute(array($id_pedido));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

	}
?>