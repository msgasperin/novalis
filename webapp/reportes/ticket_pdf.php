<?php
require_once '../assets/lib/dompdf-2.0.4/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

require_once('../../api/config/class.pdo.php');
require_once('../../api/config/seguridad.php');

$v = new Conexion();
$v->conectar();

$keyQuery = $_GET["kq"] ?? '';

// 1. CONSULTA ÚNICA DE DATOS PRINCIPALES DE LA ORDEN
$sqlDatosOrden = $v->dbh->prepare(
    "SELECT O.id, folio, DATE_FORMAT(O.fecha_cap, '%d-%m-%Y') AS fecha_registro, 
            DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, 
            paciente_nombre_historico, convenio_nombre_historico, estatus_pago, 
            estatus, subtotal, por_descuento, descuento, cargo_extra, motivo_cargo_extra, 
            total_neto, total_abonado, saldo_deudor, sucursal_historico, direccion, 
            telefono, key_query, DATE_FORMAT(fecha_cancelacion, '%d-%m-%Y %h:%i %p') AS fecha_cancelacion, 
            user_cancela, motivo_cancela, es_urgente, requiere_factura
     FROM ordenes_trabajo AS O
     INNER JOIN cat_sucursales AS S ON S.id = O.sucursal_id
     WHERE key_query = ?"
);
$sqlDatosOrden->execute([$keyQuery]);      
$orden = $sqlDatosOrden->fetch(PDO::FETCH_ASSOC);

if (!$orden) {
    $orden = [
        'id' => 0, 'folio' => 'ORD-0000-0000', 'fecha_registro' => '00/00/0000',
        'hora_registro' => '00:00 AM', 'paciente_nombre_historico' => '------------------',
        'convenio_nombre_historico' => '------------------', 'tipo_cliente' => 'particular',
        'estatus_pago' => 'PENDIENTE', 'estatus' => 'REGISTRADO', 'subtotal' => 0.00,
        'por_descuento' => 0.00, 'descuento' => 0.00, 'cargo_extra' => 0.00,
        'motivo_cargo_extra' => '', 'total_neto' => 0.00, 'total_abonado' => 0.00,
        'saldo_deudor' => 0.00, 'sucursal_historico' => '------------------',
        'direccion' => '------------------', 'telefono' => '------------------',
        'key_query' => '00000000', 'es_urgente' => 0, 'requiere_factura' => 0
    ];
}

// 2. CONSULTAS ÚNICAS DE ESTUDIOS Y ABONOS
$sqlEstudios = $v->dbh->prepare("SELECT nombre_estudio_historico, precio_aplicado, aplico_desc FROM orden_detalles WHERE orden_id = ?");
$sqlEstudios->execute([$orden["id"]]);
$estudios = $sqlEstudios->fetchAll(PDO::FETCH_ASSOC);

$sqlAbonos = $v->dbh->prepare("SELECT DATE_FORMAT(fecha_pago, '%d/%m/%Y') AS fecha, metodo_pago, monto FROM orden_pagos WHERE orden_id = ? ORDER BY id ASC");
$sqlAbonos->execute([$orden["id"]]);
$abonos = $sqlAbonos->fetchAll(PDO::FETCH_ASSOC);

// 3. CÁLCULO DE ALTURA BASADO EN LOS ARREGLOS DE PHP (Sin consultas adicionales)
$totalEstudios = count($estudios);
$totalAbonos   = count($abonos);

$altura_base_mm = 165; 
$altura_calculada_mm = $altura_base_mm + ($totalEstudios * 6) + ($totalAbonos * 4);

// 4. CONFIGURACIÓN DE DOMPDF
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isRemoteEnabled', true);
$options->set('defaultFont', 'Helvetica');
$options->set('chroot', realpath(__DIR__ . '/..'));

$dompdf = new Dompdf($options);

$ancho_pt = 80 * 2.83465; // 80mm
$alto_pt  = $altura_calculada_mm * 2.83465;

$dompdf->setPaper([0, 0, $ancho_pt, $alto_pt], 'portrait');

// 5. GENERACIÓN DEL HTML (Pasando los datos previamente consultados)
$html = obtener_html_ticket_pro($orden, $estudios, $abonos); 
$dompdf->loadHtml($html);
$dompdf->render();

// 6. IMPRESIÓN Y SALIDA
$canvas = $dompdf->getCanvas();
$canvas->javascript('this.print(true);');
$dompdf->stream("Ticket_Orden_{$orden['folio']}.pdf", ["Attachment" => false]);

/**
 * Convierte una imagen a Base64 de forma segura
 */
function obtenerLogoBase64(string $rutaImagen): string {
    if (empty($rutaImagen) || !file_exists($rutaImagen)) {
        return '';
    }
    $type = pathinfo($rutaImagen, PATHINFO_EXTENSION);
    $data = file_get_contents($rutaImagen);
    return 'data:image/' . ($type === 'svg' ? 'svg+xml' : $type) . ';base64,' . base64_encode($data);
}

function obtener_html_ticket_pro(array $orden, array $estudios, array $abonos): string {
    $empresa = [
        'nombre'    => $_SESSION["emp_nombre"] ?? 'LABORATORIO CLÍNICO NOVALIS',
        'logo'      => $_SESSION["emp_logo"] ?? '',            
        'direccion' => $_SESSION["emp_direccion"] ?? '',
        'rfc'       => $_SESSION["emp_rfc"] ?? 'XAXX010101000',
        'telefono'  => $_SESSION["emp_telefono"] ?? '',
        'correo'    => $_SESSION["emp_correo"] ?? '',
        'web'       => $_SESSION["emp_web"] ?? ''
    ];

    $rutaLogo = __DIR__ . '/../assets/images/' . basename($empresa['logo']);
    $logoBase64 = obtenerLogoBase64($rutaLogo);

    $rutaQr = __DIR__ . '/../assets/images/qr_resultados.png';
    $qrBase64 = obtenerLogoBase64($rutaQr);

    $esCancelado = (strtoupper(trim($orden['estatus'])) === 'CANCELADO');

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
            .watermark {
                position: fixed;
                top: 35%;
                left: 0;
                width: 100%;
                text-align: center;
                font-size: 20pt;
                font-weight: bold;
                color: rgba(200, 0, 0, 0.25);
                border: 2px solid rgba(200, 0, 0, 0.25);
                padding: 4px 0;
                transform: rotate(-30deg);
                z-index: -1000;
                border-radius: 6px;
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

            .table-data, .table-conceptos, .totales-container {
                width: 100%;
                border-collapse: collapse;
            }
            .table-data td {
                padding: 0px 0;
                vertical-align: top;
            }
            .table-conceptos th {
                border-bottom: 1px solid #000;
                font-size: 6.5pt;
                padding-bottom: 1px;
            }
            .table-conceptos td {
                padding: 1px 0;
                border-bottom: 0.5px dotted #ccc;
            }

            .badge-pago {
                display: inline-block;
                padding: 1px 4px;
                font-size: 6.5pt;
                font-weight: bold;
                border: 1px solid #000;
                border-radius: 2px;
            }

            .legal-text {
                font-size: 5.5pt;
                color: #333;
                text-align: justify;
                line-height: 1.05;
            }
        </style>
    </head>
    <body>
        <?php if ($esCancelado): ?>
            <div class="watermark">CANCELADO</div>
        <?php endif; ?>

        <!-- ENCABEZADO -->
        <div class="text-center">
            <?php if (!empty($logoBase64)): ?>
                <img src="<?= $logoBase64 ?>" style="max-width: 110px; max-height: 35px; margin-bottom: 2px;"><br>
            <?php endif; ?>
            <div class="brand-title"><?= htmlspecialchars($empresa['nombre']) ?></div>
            <div class="brand-subtitle">Sucursal: <?= htmlspecialchars($orden['sucursal_historico']) ?></div>
            <div style="font-size: 6pt;">
                RFC: <?= htmlspecialchars($empresa['rfc']) ?><br>
                <?= htmlspecialchars($orden['direccion']) ?><br>
                Tel: <?= htmlspecialchars($orden['telefono']) ?>
            </div>
        </div>

        <div class="divider"></div>

        <!-- DATOS DE LA ORDEN Y PACIENTE -->
        <table class="table-data">
            <tr>
                <td width="32%" class="fw-bold">FOLIO:</td>
                <td width="68%" class="fw-bold" style="font-size: 8pt;"><?= htmlspecialchars($orden['folio']) ?></td>
            </tr>
            <tr>
                <td class="fw-bold">FECHA:</td>
                <td><?= $orden['fecha_registro'] ?> - <?= $orden['hora_registro'] ?></td>
            </tr>
            <tr>
                <td class="fw-bold">PACIENTE:</td>
                <td class="text-uppercase fw-bold"><?= htmlspecialchars($orden['paciente_nombre_historico']) ?></td>
            </tr>
            <?php if ($orden['tipo_cliente'] !== 'particular'): ?>
            <tr>
                <td class="fw-bold">CONVENIO:</td>
                <td class="text-uppercase"><?= htmlspecialchars($orden['convenio_nombre_historico']) ?></td>
            </tr>
            <?php endif; ?>
            <?php if (!empty($orden['es_urgente']) && (int)$orden['es_urgente'] === 1): ?>
            <tr>
                <td class="fw-bold" style="color: #c00;">PRIORIDAD:</td>
                <td class="fw-bold" style="color: #c00;">*** URGENTE ***</td>
            </tr>
            <?php endif; ?>
            <?php if (!empty($orden['requiere_factura']) && ((int)$orden['requiere_factura'] === 1 || strtoupper((string)$orden['requiere_factura']) === 'SI')): ?>
            <tr>
                <td class="fw-bold">FACTURA:</td>
                <td class="fw-bold">REQUIERE FACTURA</td>
            </tr>
            <?php endif; ?>
        </table>

        <!-- DATOS DE CANCELACIÓN -->
        <?php if ($esCancelado): ?>
            <div class="divider"></div>
            <div style="border: 1px dashed #000; padding: 2px; border-radius: 2px; font-size: 6pt;">
                <div class="fw-bold text-center text-uppercase" style="font-size: 6.5pt;">DATOS DE CANCELACIÓN</div>
                <table class="table-data">
                    <tr>
                        <td width="35%" class="fw-bold">FECHA CANC:</td>
                        <td width="65%"><?= $orden['fecha_cancelacion'] ?></td>
                    </tr>
                    <tr>
                        <td class="fw-bold">CANCELÓ:</td>
                        <td class="text-uppercase"><?= htmlspecialchars($orden['user_cancela'] ?? '') ?></td>
                    </tr>
                    <tr>
                        <td class="fw-bold">MOTIVO:</td>
                        <td class="text-uppercase"><?= htmlspecialchars($orden['motivo_cancela'] ?? '') ?></td>
                    </tr>
                </table>
            </div>
        <?php endif; ?>

        <div class="divider"></div>

        <!-- DESGLOSE DE ESTUDIOS -->
        <table class="table-conceptos">
            <thead>
                <tr>
                    <th class="text-left" width="70%">ESTUDIO / CONCEPTO</th>
                    <th class="text-right" width="30%">IMPORTE</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($estudios as $item): ?>
                <tr>
                    <td>
                        <span class="fw-bold"><?= htmlspecialchars($item['nombre_estudio_historico']) ?></span>
                    </td>
                    <td class="text-right fw-bold" style="vertical-align: middle;">
                        $<?= number_format((float)$item['precio_aplicado'], 2) ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- RESUMEN FINANCIERO -->
        <table class="totales-container" style="margin-top: 2px;">
            <tr>
                <td class="text-right" width="65%">Subtotal:</td>
                <td class="text-right" width="35%">$<?= number_format((float)$orden['subtotal'], 2) ?></td>
            </tr>
            <?php if ((float)$orden['descuento'] > 0): ?>
            <tr>
                <td class="text-right" style="color: #444;">
                    <?= ((float)$orden['por_descuento'] > 0) ? 'Descuento ('.(float)$orden['por_descuento'].'%):' : 'Descuento:' ?>
                </td>
                <td class="text-right" style="color: #444;">-$<?= number_format((float)$orden['descuento'], 2) ?></td>
            </tr>
            <?php endif; ?>
            <?php if ((float)$orden['cargo_extra'] > 0): ?>
            <tr>
                <td class="text-right" style="color: #444;">
                    Cargo extra:
                </td>
                <td class="text-right" style="color: #444;">+$<?= number_format((float)$orden['cargo_extra'], 2) ?></td>
            </tr>
            <?php endif; ?>
            <tr style="font-size: 7.5pt;">
                <td class="text-right fw-bold">TOTAL:</td>
                <td class="text-right fw-bold" style="border-top: 1px solid #000;">
                    $<?= number_format((float)$orden['total_neto'], 2) ?>
                </td>
            </tr>
            <tr>
                <td class="text-right">Abonado:</td>
                <td class="text-right">$<?= number_format((float)$orden['total_abonado'], 2) ?></td>
            </tr>
            <tr style="font-size: 7.5pt;">
                <td class="text-right fw-bold">SALDO RESTANTE:</td>
                <td class="text-right fw-bold" style="border-top: 1px dashed #000;">
                    $<?= number_format((float)$orden['saldo_deudor'], 2) ?>
                </td>
            </tr>

            <!-- DESGLOSE DE ABONOS -->
            <?php if (!empty($abonos)): ?>
            <tr>
                <td colspan="2" style="padding-top: 2px;">
                    <div style="font-weight: bold; font-size: 6pt; text-transform: uppercase; border-bottom: 0.5px dashed #aaa;">
                        Historial de Pagos:
                    </div>
                </td>
            </tr>
            <?php foreach ($abonos as $pago): ?>
            <tr style="font-size: 6pt; color: #333;">
                <td class="text-left" style="padding-left: 2px;">
                    <?= $pago['fecha'] ?> (<?= strtoupper(htmlspecialchars($pago['metodo_pago'])) ?>)
                </td>
                <td class="text-right">
                    $<?= number_format((float)$pago['monto'], 2) ?>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php endif; ?>
        </table>

        <div class="divider"></div>

        <!-- ESTATUS DE PAGO -->
        <div class="text-center" style="margin: 2px 0;">
            <span class="badge-pago">
                Estatus del pago: <?= htmlspecialchars($orden["estatus_pago"]) ?>
            </span>
        </div>

        <div class="divider"></div>

        <!-- CONSULTA ONLINE Y QR -->
        <div class="text-center">
            <span class="fw-bold" style="font-size: 7pt;">CONSULTE SUS RESULTADOS EN LÍNEA</span><br>
            <span style="font-size: 6pt;">Escanee el código QR o ingrese a <b><?= htmlspecialchars($empresa['web']) ?></b></span>
            
            <?php if (!empty($qrBase64)): ?>
                <div style="margin: 2px 0;">
                    <img src="<?= $qrBase64 ?>" style="width: 55px; height: 55px;">
                </div>
            <?php endif; ?>

            <div style="font-size: 6pt; font-family: monospace;">
                <b>Folio:</b> <?= htmlspecialchars($orden['folio']) ?><br>
                <b>Clave Acceso:</b> <?= htmlspecialchars($orden["key_query"]) ?>
            </div>
        </div>

        <div class="divider-solid"></div>

        <!-- TÉRMINOS Y PIE -->
        <div class="legal-text">
            * Indispensable presentar este comprobante e identificación oficial para la entrega de resultados impresos.<br>
            * Los horarios de entrega son estimados y están sujetos a validación médica.<br>
            * Para cualquier aclaración conserve este ticket.
        </div>

        <div class="text-center fw-bold" style="margin-top: 3px; font-size: 7pt;">
            ¡Gracias por confiar en nosotros!
        </div>
    </body>
    </html>
    <?php
    return ob_get_clean();
}