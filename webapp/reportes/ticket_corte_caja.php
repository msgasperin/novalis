<?php
require_once '../assets/lib/dompdf-2.0.4/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

require_once('../../api/config/class.pdo.php');
require_once('../../api/config/seguridad.php');

$v = new Conexion();
$v->conectar();

$key_query = $_GET["kq"] ?? 0;

// 1. CONSULTA ÚNICA DE LA SESIÓN DE CAJA
$sqlSesion = $v->dbh->prepare(
   "SELECT CS.id_caja, CS.id_sucursal, CS.fondo_inicial, 
      DATE_FORMAT(CS.fecha_apertura, '%d-%m-%Y %h:%i %p') AS fecha_apertura, 
      DATE_FORMAT(CS.fecha_cierre, '%d-%m-%Y %h:%i %p') AS fecha_cierre, 
      CS.declarado_efectivo, CS.declarado_tarjeta, CS.declarado_transferencia,
      CS.ingresos_efectivo, CS.egresos_efectivo, CS.sistema_efectivo,
      CS.ingresos_tarjeta, CS.egresos_tarjeta, CS.sistema_tarjeta,
      CS.ingresos_transferencia, CS.egresos_transferencia, CS.sistema_transferencia,
      CS.sistema_ingresos, CS.sistema_egresos, 
      CS.total_declarado, CS.total_esperado_sistema, CS.diferencia, 
      CS.observaciones, CS.estatus, S.nombre AS nombre_sucursal
   FROM cajas_sesiones AS CS
   LEFT JOIN cat_sucursales AS S ON S.id = CS.id_sucursal
   WHERE CS.key_query = ?"
);
$sqlSesion->execute([$key_query]);
$caja = $sqlSesion->fetch(PDO::FETCH_ASSOC);

if (!$caja) {
   die("La sesión de caja especificada no fue encontrada.");
}

// 2. CONSULTAS ÚNICAS DE MOVIMIENTOS MANUALES Y PAGOS RECIBIDOS
$sqlMovimientos = $v->dbh->prepare(
   "SELECT id_movimiento, tipo, concepto, monto, forma_pago, comprobante, DATE_FORMAT(fecha_movimiento, '%d-%m-%Y %h:%i %p') AS fecha_movimiento, usuario_registro 
   FROM caja_movimientos 
   WHERE activo = 1 AND caja_id = ? 
   ORDER BY id_movimiento ASC"
);
$sqlMovimientos->execute([$caja["id_caja"]]);
$movimientos = $sqlMovimientos->fetchAll(PDO::FETCH_ASSOC);

$sqlPagos = $v->dbh->prepare(
   "SELECT monto, metodo_pago, referencia_pago, usuario_recibio, DATE_FORMAT(fecha_pago, '%d-%m-%Y %h:%i %p') AS fecha_pago 
   FROM orden_pagos 
   WHERE estatus = 1 AND caja_id = ? 
   ORDER BY id ASC"
);
$sqlPagos->execute([$caja["id_caja"]]);
$pagos = $sqlPagos->fetchAll(PDO::FETCH_ASSOC);

// 3. CÁLCULO DE ALTURA DINÁMICA (Sin consultas SQL adicionales)
$totalMovimientos = count($movimientos);
$totalPagos       = count($pagos);

// Altura base aproximada para encabezados, cuadro de totales, observaciones y firmas (mm)
$altura_base_mm = 210; 
// Incremento proporcional por cada elemento mostrado en tablas
$altura_calculada_mm = $altura_base_mm + ($totalMovimientos * 5) + ($totalPagos * 5);

// 4. CONFIGURACIÓN DE DOMPDF
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isRemoteEnabled', true);
$options->set('defaultFont', 'Helvetica');
$options->set('chroot', realpath(__DIR__ . '/..'));

$dompdf = new Dompdf($options);

$ancho_pt = 80 * 2.83465; // 80mm en puntos
$alto_pt  = $altura_calculada_mm * 2.83465;

$dompdf->setPaper([0, 0, $ancho_pt, $alto_pt], 'portrait');

// 5. GENERACIÓN DEL HTML
$html = obtener_html_corte_caja_pro($caja, $movimientos, $pagos);

$dompdf->loadHtml($html);
$dompdf->render();

// 6. IMPRESIÓN Y SALIDA
$canvas = $dompdf->getCanvas();
$canvas->javascript('this.print(true);');
$dompdf->stream("Corte_Caja_#{$caja['id_caja']}.pdf", ["Attachment" => false]);

/**
 * Convierte una imagen a Base64 de forma segura
 */
function obtenerLogoBase64Corte(string $rutaImagen): string {
   if (empty($rutaImagen) || !file_exists($rutaImagen)) {
      return '';
   }
   $type = pathinfo($rutaImagen, PATHINFO_EXTENSION);
   $data = file_get_contents($rutaImagen);
   return 'data:image/' . ($type === 'svg' ? 'svg+xml' : $type) . ';base64,' . base64_encode($data);
}

function obtener_html_corte_caja_pro(array $caja, array $movimientos, array $pagos): string {
   $empresa = [
      'nombre'    => $_SESSION["emp_nombre"] ?? 'LABORATORIO CLÍNICO NOVALIS',
      'logo'      => $_SESSION["emp_logo"] ?? '',            
      'direccion' => $_SESSION["emp_direccion"] ?? '',
      'rfc'       => $_SESSION["emp_rfc"] ?? 'XAXX010101000',
      'telefono'  => $_SESSION["emp_telefono"] ?? ''
   ];

   $rutaLogo = __DIR__ . '/../assets/images/' . basename($empresa['logo']);
   $logoBase64 = obtenerLogoBase64Corte($rutaLogo);

   $totalEnCajaEfectivo = $caja["fondo_inicial"] + $caja["sistema_efectivo"];

   ob_start();
   ?>
   <!DOCTYPE html>
   <html lang="es">
   <head>
      <meta charset="UTF-8">
      <style>
         @page {
            margin: 1mm 2mm 1mm 2mm;
         }
         body {
            font-family: "Helvetica", Helvetica, Arial, sans-serif;
            font-size: 7pt;
            line-height: 1.1;
            color: #000;
         }
         .text-center { text-align: center; }
         .text-right { text-align: right; }
         .text-left { text-align: left; }
         .fw-bold { font-weight: bold; }
         .text-uppercase { text-transform: uppercase; }

         .brand-title { font-size: 8pt; font-weight: bold; }
         .brand-subtitle { font-size: 6.5pt; color: #333; }

         .divider {
            border-top: 1px dashed #000;
            margin: 2px 0;
         }
         .divider-solid {
            border-top: 1px solid #000;
            margin: 2px 0;
         }

         .table-data, .table-resumen, .table-detalles {
            width: 100%;
            border-collapse: collapse;
         }
         .table-data td {
            padding: 1px 0;
            vertical-align: top;
         }
         .table-detalles th {
            border-bottom: 1px solid #000;
            font-size: 6pt;
            padding-bottom: 1px;
         }
         .table-detalles td {
            padding: 1px 0;
            border-bottom: 0.5px dotted #ccc;
            font-size: 6pt;
         }

         .badge-estatus {
            display: inline-block;
            padding: 1px 4px;
            font-size: 6.5pt;
            font-weight: bold;
            border: 1px solid #000;
            border-radius: 2px;
         }

         .box-section {
            border: 1px solid #000;
            padding: 3px;
            margin: 2px 0;
            border-radius: 2px;
         }

         .firma-linea {
            border-top: 1px solid #000;
            width: 70%;
            margin: 18px auto 2px auto;
            text-align: center;
            font-size: 6pt;
         }
      </style>
   </head>
      <body>

         <!-- ENCABEZADO DE LA EMPRESA -->
         <div class="text-center">
            <?php if (!empty($logoBase64)): ?>
               <img src="<?= $logoBase64 ?>" style="max-width: 110px; max-height: 35px; margin-bottom: 2px;"><br>
            <?php endif; ?>
            <div class="brand-title"><?= htmlspecialchars($empresa['nombre']) ?></div>
            <div class="brand-subtitle">Sucursal: <?= htmlspecialchars($caja['nombre_sucursal'] ?? '------------------') ?></div>
            <div style="font-size: 7.5pt; font-weight: bold; margin-top: 2px;">
               *** CORTE DE CAJA #<?= htmlspecialchars($caja['id_caja']) ?> ***
            </div>
         </div>

         <div class="divider"></div>

         <!-- INFORMACIÓN GENERAL DE LA SESIÓN -->
         <table class="table-data">
            <tr>
               <td width="35%" class="fw-bold">APERTURA:</td>
               <td width="65%"><?= $caja['fecha_apertura'] ?></td>
            </tr>
            <tr>
               <td class="fw-bold">CIERRE:</td>
               <td><?= $caja['fecha_cierre'] ?? 'EN PROCESO / ABIERTA' ?></td>
            </tr>
            <tr>
               <td class="fw-bold">ESTATUS:</td>
               <td class="fw-bold text-uppercase"><?= htmlspecialchars($caja['estatus']) ?></td>
            </tr>
         </table>

         <div class="divider"></div>

         <!-- CUADRO GENERAL DE FLUJO DE CAJA Y BALANCE -->
         <div class="box-section">
            <div class="fw-bold text-center text-uppercase" style="font-size: 6.5pt; margin-bottom: 2px;">
               RESUMEN DE ARQUEO DE CAJA
            </div>
            <table class="table-data">
               <tr>
                  <td>Total declarado:</td>
                  <td class="text-right">+$<?= number_format((float)$caja['total_declarado'], 2) ?></td>
               </tr>
               <tr>
                  <td>Total esperado (sistema):</td>
                  <td class="text-right">-$<?= number_format((float)$caja['total_esperado_sistema'], 2) ?></td>
               </tr>
            </table>
            <!-- CÁLCULO DE DIFERENCIA (SABRÁ SI HAY SOBRANTE O FALTANTE) -->
            <?php 
               $diferencia = (float)$caja['diferencia'];
               $textoDiferencia = 'SIN DIFERENCIA';
               if ($diferencia < 0) {
                  $textoDiferencia = 'FALTANTE: -$ ' . number_format(abs($diferencia), 2);
               } else if ($diferencia > 0) {
                  $textoDiferencia = 'SOBRANTE: +$ ' . number_format($diferencia, 2);
               }
            ?>
            <div class="text-center fw-bold" style="margin-top: 3px; font-size: 7pt; background-color: #eee; padding: 2px;">
               DIFERENCIA: <?= $textoDiferencia ?>
            </div>

         </div>

         <!-- CUADRO DE VENTAS POR MÉTODO DE PAGO (SISTEMA VS DECLARADO) -->
         <div class="box-section">
            <div class="fw-bold text-center text-uppercase" style="font-size: 6.5pt; margin-bottom: 2px;">
               DESGLOSE POR FORMA DE PAGO
            </div>
            <table class="table-detalles">
               <thead>
                  <tr>
                     <th class="text-left">MÉTODO</th>
                     <th class="text-right">SISTEMA</th>
                     <th class="text-right">DECLARADO</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>Efectivo (incluye fondo inicial)</td>
                     <td class="text-right">$<?= number_format(($caja['sistema_efectivo'] + $caja["fondo_inicial"]),2); ?></td>
                     <td class="text-right">$<?= $caja['declarado_efectivo']; ?></td>
                  </tr>
                  <tr>
                     <td>Tarjeta</td>
                     <td class="text-right">$<?= $caja['sistema_tarjeta']; ?></td>
                     <td class="text-right">$<?= $caja['declarado_tarjeta']; ?></td>
                  </tr>
                  <tr>
                     <td>Transferencia</td>
                     <td class="text-right">$<?= $caja['sistema_transferencia']; ?></td>
                     <td class="text-right">$<?= $caja['declarado_transferencia']; ?></td>
                  </tr>
               </tbody>
               <tfoot>
                  <tr style="font-weight: bold; font-size: 6.5pt;">
                     <td style="border-top: 1px solid #000;">TOTALES</td>
                     <td class="text-right" style="border-top: 1px solid #000;">$<?= $caja["total_esperado_sistema"] ?></td>
                     <td class="text-right" style="border-top: 1px solid #000;">$<?= $caja["total_declarado"] ?></td>
                  </tr>
               </tfoot>
            </table>

            
         </div>

         <div class="divider"></div>

         <!-- LISTADO DE COBROS Y PAGOS REGISTRADOS EN ORDENES -->
         <div class="fw-bold text-center text-uppercase" style="font-size: 6.5pt; margin-top: 3px; margin-bottom: 2px;">
            DETALLE DE PAGOS RECIBIDOS (<?= count($pagos) ?>)
         </div>
         <?php if (!empty($pagos)): ?>
            <table class="table-detalles">
               <thead>
                  <tr>
                     <th class="text-left" width="22%">HORA</th>
                     <th class="text-left" width="28%">MÉTODO</th>
                     <th class="text-left" width="25%">USUARIO</th>
                     <th class="text-right" width="25%">MONTO</th>
                  </tr>
               </thead>
               <tbody>
                  <?php foreach ($pagos as $pago): ?>
                  <tr>
                     <td><?= substr($pago['fecha_pago'], 11) ?></td>
                     <td class="text-uppercase"><?= htmlspecialchars($pago['metodo_pago']) ?></td>
                     <td class="text-uppercase"><?= htmlspecialchars($pago['usuario_recibio'] ?? '-') ?></td>
                     <td class="text-right fw-bold">$<?= number_format((float)$pago['monto'], 2) ?></td>
                  </tr>
                  <?php endforeach; ?>
               </tbody>
            </table>
         <?php else: ?>
            <div class="text-center" style="font-size: 6pt; color: #555;">No se registraron cobros en esta sesión.</div>
         <?php endif; ?>

         <div class="divider"></div>

         <!-- LISTADO DE MOVIMIENTOS MANUALES (INGRESOS / EGRESOS) -->
         <div class="fw-bold text-center text-uppercase" style="font-size: 6.5pt; margin-top: 3px; margin-bottom: 2px;">
            MOVIMIENTOS MANUALES DE CAJA (<?= count($movimientos) ?>)
         </div>
         <?php if (!empty($movimientos)): ?>
            <table class="table-detalles">
               <thead>
                  <tr>
                     <th class="text-left" width="20%">TIPO</th>
                     <th class="text-left" width="55%">CONCEPTO</th>
                     <th class="text-right" width="25%">MONTO</th>
                  </tr>
               </thead>
               <tbody>
                  <?php foreach ($movimientos as $mov): ?>
                  <tr>
                     <td class="fw-bold text-uppercase"><?= htmlspecialchars($mov['tipo']) ?></td>
                     <td><?= htmlspecialchars($mov['concepto']) ?></td>
                     <td class="text-right fw-bold">
                           <?= ($mov['tipo'] === 'EGRESO' || $mov['tipo'] === 'RETIRO') ? '-' : '+' ?>$<?= number_format((float)$mov['monto'], 2) ?>
                     </td>
                  </tr>
                  <?php endforeach; ?>
               </tbody>
            </table>
         <?php else: ?>
            <div class="text-center" style="font-size: 6pt; color: #555;">No hay movimientos manuales registrados.</div>
         <?php endif; ?>

         <!-- OBSERVACIONES DE LA SESIÓN DE CAJA -->
         <?php if (!empty($caja['observaciones'])): ?>
            <div class="divider"></div>
            <div style="font-size: 6pt; font-weight: bold; text-transform: uppercase;">OBSERVACIONES / NOTAS:</div>
            <div style="font-size: 6pt; border: 0.5px solid #aaa; padding: 2px; margin-top: 1px;">
                  <?= nl2br(htmlspecialchars($caja['observaciones'])) ?>
            </div>
         <?php endif; ?>

         <div class="divider-solid"></div>

         <!-- SECCIÓN DE FIRMAS -->
         <div class="firma-linea">
            FIRMA CAJERO / RESPONSABLE
         </div>
         
         <div class="text-center" style="font-size: 5.5pt; color: #444; margin-top: 10px;">
            Impreso el: <?= date('d/m/Y h:i A') ?>
         </div>
      </body>
   </html>
   <?php
   return ob_get_clean();
}