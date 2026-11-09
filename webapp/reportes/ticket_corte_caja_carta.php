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
$sqlSesion = $v->getDbh()->prepare(
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
$sqlMovimientos = $v->getDbh()->prepare(
   "SELECT id_movimiento, tipo, concepto, monto, forma_pago, comprobante, DATE_FORMAT(fecha_movimiento, '%d-%m-%Y %h:%i %p') AS fecha_movimiento, usuario_registro 
   FROM caja_movimientos 
   WHERE activo = 1 AND caja_id = ? 
   ORDER BY id_movimiento ASC"
);
$sqlMovimientos->execute([$caja["id_caja"]]);
$movimientos = $sqlMovimientos->fetchAll(PDO::FETCH_ASSOC);

$sqlPagos = $v->getDbh()->prepare(
   "SELECT monto, metodo_pago, referencia_pago, usuario_recibio, DATE_FORMAT(fecha_pago, '%d-%m-%Y %h:%i %p') AS fecha_pago 
   FROM orden_pagos 
   WHERE estatus = 1 AND caja_id = ? 
   ORDER BY id ASC"
);
$sqlPagos->execute([$caja["id_caja"]]);
$pagos = $sqlPagos->fetchAll(PDO::FETCH_ASSOC);

// 3. CONFIGURACIÓN DE DOMPDF PARA TAMAÑO CARTA
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isRemoteEnabled', true);
$options->set('defaultFont', 'Helvetica');
$options->set('chroot', realpath(__DIR__ . '/..'));

$dompdf = new Dompdf($options);
$dompdf->setPaper('letter', 'portrait');

// 4. GENERACIÓN DEL HTML
$html = obtener_html_corte_caja_pro($caja, $movimientos, $pagos);

$dompdf->loadHtml($html);
$dompdf->render();

// 5. IMPRESIÓN Y SALIDA
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

   ob_start();
   ?>
   <!DOCTYPE html>
   <html lang="es">
   <head>
      <meta charset="UTF-8">
      <style>
         @page {
            margin: 15mm;
         }
         body {
            font-family: "Helvetica", Helvetica, Arial, sans-serif;
            font-size: 9.5pt;
            line-height: 1.35;
            color: #222;
         }
         .text-center { text-align: center; }
         .text-right { text-align: right; }
         .text-left { text-align: left; }
         .fw-bold { font-weight: bold; }
         .text-uppercase { text-transform: uppercase; }

         /* Encabezado */
         .header-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
         .brand-title { font-size: 14pt; font-weight: bold; color: #1a365d; }
         .brand-subtitle { font-size: 9.5pt; color: #4a5568; margin-top: 2px; }

         /* Tarjetas de información */
         .info-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 12px;
            margin-bottom: 12px;
         }
         .table-data { width: 100%; border-collapse: collapse; }
         .table-data td { padding: 3px 0; vertical-align: top; font-size: 9pt; }

         /* Tablas de detalles */
         .table-detalles { width: 100%; border-collapse: collapse; margin-top: 5px; }
         .table-detalles th {
            background-color: #2d3748;
            color: #ffffff;
            font-size: 8.5pt;
            text-transform: uppercase;
            padding: 6px 8px;
            letter-spacing: 0.5px;
         }
         .table-detalles td {
            padding: 6px 8px;
            border-bottom: 1px solid #edf2f7;
            font-size: 9pt;
         }
         .table-detalles tr:nth-child(even) { background-color: #fafbfc; }

         .badge-estatus {
            display: inline-block;
            padding: 3px 10px;
            font-size: 8.5pt;
            font-weight: bold;
            text-transform: uppercase;
            border-radius: 4px;
            border: 1px solid #cbd5e0;
            background-color: #edf2f7;
            color: #2d3748;
         }

         .divider {
            border-top: 1px solid #e2e8f0;
            margin: 12px 0;
         }
      </style>
   </head>
   <body>

      <!-- ENCABEZADO CORPORATIVO -->
      <table class="header-table">
         <tr>
            <td style="width: 30%; vertical-align: middle;">
               <?php if (!empty($logoBase64)): ?>
                  <img src="<?= $logoBase64 ?>" style="max-width: 140px; max-height: 55px;">
               <?php endif; ?>
            </td>
            <td style="width: 45%; vertical-align: middle;" class="text-left">
               <div class="brand-title"><?= htmlspecialchars($empresa['nombre']) ?></div>
               <div class="brand-subtitle"><b>Sucursal:</b> <?= htmlspecialchars($caja['nombre_sucursal'] ?? '------------------') ?></div>
               <div style="font-size: 8pt; color: #718096; margin-top: 2px;">
                  RFC: <?= htmlspecialchars($empresa['rfc']) ?> | Tel: <?= htmlspecialchars($empresa['telefono']) ?><br>
                  <?= htmlspecialchars($empresa['direccion']) ?>
               </div>
            </td>
            <td style="width: 25%; vertical-align: middle; text-align: right;">
               <div style="background-color: #ebf8ff; border: 1px solid #bee3f8; border-radius: 6px; padding: 8px; text-align: center;">
                  <span style="font-size: 7.5pt; color: #2b6cb0; font-weight: bold; text-transform: uppercase; display: block;">Corte de Caja</span>
                  <span style="font-size: 11pt; font-weight: bold; color: #2c5282;">#<?= htmlspecialchars($caja['id_caja']) ?></span>
               </div>
            </td>
         </tr>
      </table>

      <!-- DATOS GENERALES DE LA SESIÓN (TARJETA) -->
      <div class="info-box">
         <table class="table-data">
            <tr>
               <td width="15%" class="fw-bold" style="color: #4a5568;">APERTURA:</td>
               <td width="35%"><?= $caja['fecha_apertura'] ?></td>
               <td width="15%" class="fw-bold" style="color: #4a5568;">CIERRE:</td>
               <td width="35%"><?= $caja['fecha_cierre'] ?? 'EN PROCESO / ABIERTA' ?></td>
            </tr>
            <tr>
               <td class="fw-bold" style="color: #4a5568;">ESTATUS:</td>
               <td colspan="3">
                  <span class="badge-estatus"><?= htmlspecialchars($caja['estatus']) ?></span>
               </td>
            </tr>
         </table>
      </div>

      <!-- RESUMEN DE ARQUEO DE CAJA (DOS COLUMNAS) -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
         <tr>
            <td style="width: 55%; vertical-align: top; padding-right: 10px;">
               <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
                  <div class="fw-bold text-uppercase" style="font-size: 8.5pt; color: #4a5568; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
                     Resumen de Arqueo
                  </div>
                  <table class="table-data" style="font-size: 9pt;">
                     <tr>
                        <td style="color: #4a5568;">Total Declarado:</td>
                        <td class="text-right fw-bold" style="color: #2b6cb0;">+$<?= number_format((float)$caja['total_declarado'], 2) ?></td>
                     </tr>
                     <tr>
                        <td style="color: #4a5568;">Total Esperado (Sistema):</td>
                        <td class="text-right fw-bold" style="color: #2d3748;">-$<?= number_format((float)$caja['total_esperado_sistema'], 2) ?></td>
                     </tr>
                  </table>
                  
                  <?php 
                     $diferencia = (float)$caja['diferencia'];
                     $bgColorDif = '#edf2f7';
                     $textColorDif = '#2d3748';
                     $textoDiferencia = 'SIN DIFERENCIA';

                     if ($diferencia < 0) {
                        $bgColorDif = '#fff5f5';
                        $textColorDif = '#c53030';
                        $textoDiferencia = 'FALTANTE: -$ ' . number_format(abs($diferencia), 2);
                     } else if ($diferencia > 0) {
                        $bgColorDif = '#f0fff4';
                        $textColorDif = '#276749';
                        $textoDiferencia = 'SOBRANTE: +$ ' . number_format($diferencia, 2);
                     }
                  ?>
                  <div class="text-center fw-bold" style="margin-top: 8px; font-size: 9pt; background-color: <?= $bgColorDif ?>; color: <?= $textColorDif ?>; padding: 6px; border-radius: 4px; border: 1px solid #cbd5e0;">
                     <?= $textoDiferencia ?>
                  </div>
               </div>
            </td>

            <td style="width: 45%; vertical-align: top;">
               <!-- DESGLOSE POR FORMA DE PAGO -->
               <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
                  <div class="fw-bold text-uppercase" style="font-size: 8.5pt; color: #4a5568; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
                     Desgloses por Método
                  </div>
                  <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt;">
                     <tr>
                        <td style="padding: 2px 0; color: #4a5568;">Efectivo (c/ fondo):</td>
                        <td class="text-right" style="padding: 2px 0;">Sist: $<?= number_format(($caja['sistema_efectivo'] + $caja["fondo_inicial"]), 2) ?></td>
                     </tr>
                     <tr>
                        <td colspan="2" class="text-right fw-bold" style="padding-bottom: 4px; color: #2b6cb0;">Decl: $<?= $caja['declarado_efectivo'] ?></td>
                     </tr>
                     <tr>
                        <td style="padding: 2px 0; color: #4a5568;">Tarjeta:</td>
                        <td class="text-right" style="padding: 2px 0;">Sist: $<?= $caja['sistema_tarjeta'] ?></td>
                     </tr>
                     <tr>
                        <td colspan="2" class="text-right fw-bold" style="padding-bottom: 4px; color: #2b6cb0;">Decl: $<?= $caja['declarado_tarjeta'] ?></td>
                     </tr>
                     <tr>
                        <td style="padding: 2px 0; color: #4a5568;">Transferencia:</td>
                        <td class="text-right" style="padding: 2px 0;">Sist: $<?= $caja['sistema_transferencia'] ?></td>
                     </tr>
                     <tr>
                        <td colspan="2" class="text-right fw-bold" style="color: #2b6cb0;">Decl: $<?= $caja['declarado_transferencia'] ?></td>
                     </tr>
                  </table>
               </div>
            </td>
         </tr>
      </table>

      <!-- LISTADO DE COBROS Y PAGOS RECIBIDOS -->
      <div class="fw-bold text-uppercase" style="font-size: 9pt; color: #1a365d; margin-top: 15px; margin-bottom: 5px;">
         Detalle de Pagos Recibidos (<?= count($pagos) ?>)
      </div>
      <?php if (!empty($pagos)): ?>
         <table class="table-detalles">
            <thead>
               <tr>
                  <th class="text-left" width="20%">HORA</th>
                  <th class="text-left" width="30%">MÉTODO</th>
                  <th class="text-left" width="30%">USUARIO</th>
                  <th class="text-right" width="20%">MONTO</th>
               </tr>
            </thead>
            <tbody>
               <?php foreach ($pagos as $pago): ?>
               <tr>
                  <td><?= substr($pago['fecha_pago'], 11) ?></td>
                  <td class="text-uppercase"><?= htmlspecialchars($pago['metodo_pago']) ?></td>
                  <td class="text-uppercase"><?= htmlspecialchars($pago['usuario_recibio'] ?? '-') ?></td>
                  <td class="text-right fw-bold" style="color: #2d3748;">$<?= number_format((float)$pago['monto'], 2) ?></td>
               </tr>
               <?php endforeach; ?>
            </tbody>
         </table>
      <?php else: ?>
         <div style="font-size: 8.5pt; color: #718096; font-style: italic; background-color: #f7fafc; padding: 6px; border-radius: 4px; border: 1px solid #e2e8f0;">No se registraron cobros en esta sesión.</div>
      <?php endif; ?>

      <!-- LISTADO DE MOVIMIENTOS MANUALES (INGRESOS / EGRESOS) -->
      <div class="fw-bold text-uppercase" style="font-size: 9pt; color: #1a365d; margin-top: 15px; margin-bottom: 5px;">
         Movimientos Manuales de Caja (<?= count($movimientos) ?>)
      </div>
      <?php if (!empty($movimientos)): ?>
         <table class="table-detalles">
            <thead>
               <tr>
                  <th class="text-left" width="20%">TIPO</th>
                  <th class="text-left" width="60%">CONCEPTO</th>
                  <th class="text-right" width="20%">MONTO</th>
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
         <div style="font-size: 8.5pt; color: #718096; font-style: italic; background-color: #f7fafc; padding: 6px; border-radius: 4px; border: 1px solid #e2e8f0;">No hay movimientos manuales registrados.</div>
      <?php endif; ?>

      <!-- OBSERVACIONES DE LA SESIÓN DE CAJA -->
      <?php if (!empty($caja['observaciones'])): ?>
         <div style="margin-top: 15px;">
            <div class="fw-bold text-uppercase" style="font-size: 8.5pt; color: #4a5568; margin-bottom: 3px;">Observaciones / Notas:</div>
            <div style="font-size: 8.5pt; background-color: #f7fafc; border: 1px solid #e2e8f0; padding: 8px; border-radius: 6px; color: #2d3748;">
               <?= nl2br(htmlspecialchars($caja['observaciones'])) ?>
            </div>
         </div>
      <?php endif; ?>

      <!-- SECCIÓN DE FIRMAS Y PIE -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 35px;">
         <tr>
            <td style="width: 50%; text-align: center;">
               <div style="width: 240px; margin: 0 auto; border-top: 1px solid #718096; padding-top: 5px; font-size: 8.5pt; color: #4a5568; font-weight: bold;">
                  Firma del Cajero / Responsable
               </div>
            </td>
            <td style="width: 50%; text-align: center;">
               <div style="width: 240px; margin: 0 auto; border-top: 1px solid #718096; padding-top: 5px; font-size: 8.5pt; color: #4a5568; font-weight: bold;">
                  Firma de Autorización / Supervisor
               </div>
            </td>
         </tr>
      </table>

      <div class="text-center" style="font-size: 7.5pt; color: #a0aec0; margin-top: 25px;">
         Reporte generado el: <?= date('d/m/Y h:i A') ?> — <?= htmlspecialchars($empresa['nombre']) ?>
      </div>
   </body>
   </html>
   <?php
   return ob_get_clean();
}