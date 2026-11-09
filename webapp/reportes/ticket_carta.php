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
$sqlDatosOrden = $v->getDbh()->prepare(
    "SELECT O.id, folio, DATE_FORMAT(O.fecha_cap, '%d-%m-%Y') AS fecha_registro, 
            DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, 
            paciente_nombre_historico, convenio_nombre_historico, estatus_pago, 
            estatus, subtotal, por_descuento, descuento, cargo_extra, motivo_cargo_extra, 
            total_neto, total_abonado, saldo_deudor, sucursal_historico, direccion, 
            S.telefono, key_query, DATE_FORMAT(fecha_cancelacion, '%d-%m-%Y %h:%i %p') AS fecha_cancelacion, 
            user_cancela, motivo_cancela, es_urgente, requiere_factura,
            user_portal, AES_DECRYPT(password_portal,?) AS contrasenia
     FROM ordenes_trabajo AS O
     INNER JOIN cat_sucursales AS S ON S.id = O.sucursal_id
     INNER JOIN cat_pacientes AS P ON O.paciente_id = P.id
     WHERE key_query = ?"
);
$sqlDatosOrden->execute([$v->key, $keyQuery]);      
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
$sqlEstudios = $v->getDbh()->prepare("SELECT nombre_estudio_historico, precio_aplicado, aplico_desc FROM orden_detalles WHERE orden_id = ?");
$sqlEstudios->execute([$orden["id"]]);
$estudios = $sqlEstudios->fetchAll(PDO::FETCH_ASSOC);

$sqlAbonos = $v->getDbh()->prepare("SELECT DATE_FORMAT(fecha_pago, '%d/%m/%Y') AS fecha, metodo_pago, monto FROM orden_pagos WHERE orden_id = ? ORDER BY id ASC");
$sqlAbonos->execute([$orden["id"]]);
$abonos = $sqlAbonos->fetchAll(PDO::FETCH_ASSOC);

// 3. CONFIGURACIÓN DE DOMPDF PARA TAMAÑO CARTA
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isRemoteEnabled', true);
$options->set('defaultFont', 'Helvetica');
$options->set('chroot', realpath(__DIR__ . '/..'));

$dompdf = new Dompdf($options);
$dompdf->setPaper('letter', 'portrait');

// 4. GENERACIÓN DEL HTML
$html = obtener_html_orden_pro($orden, $estudios, $abonos); 
$dompdf->loadHtml($html);
$dompdf->render();

// 5. IMPRESIÓN Y SALIDA
$canvas = $dompdf->getCanvas();
$canvas->javascript('this.print(true);');
$dompdf->stream("Orden_{$orden['folio']}.pdf", ["Attachment" => false]);

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

function obtener_html_orden_pro(array $orden, array $estudios, array $abonos): string {
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
                margin: 15mm;
            }
            body {
                font-family: "Helvetica", Helvetica, Arial, sans-serif;
                font-size: 9.5pt;
                line-height: 1.35;
                color: #222;
            }
            .watermark {
                position: fixed;
                top: 38%;
                left: 15%;
                width: 70%;
                text-align: center;
                font-size: 60pt;
                font-weight: bold;
                color: rgba(220, 53, 69, 0.12);
                border: 5px solid rgba(220, 53, 69, 0.12);
                padding: 15px 0;
                transform: rotate(-30deg);
                z-index: -1000;
                border-radius: 8px;
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

            /* Tablas de conceptos */
            .table-conceptos { width: 100%; border-collapse: collapse; margin-top: 5px; }
            .table-conceptos th {
                background-color: #2d3748;
                color: #ffffff;
                font-size: 8.5pt;
                text-transform: uppercase;
                padding: 6px 8px;
                letter-spacing: 0.5px;
            }
            .table-conceptos td {
                padding: 7px 8px;
                border-bottom: 1px solid #edf2f7;
                font-size: 9pt;
            }
            .table-conceptos tr:nth-child(even) { background-color: #fafbfc; }

            /* Totales y Pagos */
            .totales-container { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .totales-container td { padding: 4px 6px; font-size: 9pt; }
            
            .badge-pago {
                display: inline-block;
                padding: 4px 12px;
                font-size: 8.5pt;
                font-weight: bold;
                text-transform: uppercase;
                background-color: #edf2f7;
                border: 1px solid #cbd5e0;
                border-radius: 4px;
                color: #2d3748;
            }

            .legal-text {
                font-size: 7.5pt;
                color: #718096;
                text-align: justify;
                line-height: 1.3;
                margin-top: 15px;
            }
            
            .divider {
                border-top: 1px solid #e2e8f0;
                margin: 12px 0;
            }
        </style>
    </head>
    <body>
        <?php if ($esCancelado): ?>
            <div class="watermark">CANCELADO</div>
        <?php endif; ?>

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
                    <div class="brand-subtitle"><b>Sucursal:</b> <?= htmlspecialchars($orden['sucursal_historico']) ?></div>
                    <div style="font-size: 8pt; color: #718096; margin-top: 2px;">
                        RFC: <?= htmlspecialchars($empresa['rfc']) ?> | Tel: <?= htmlspecialchars($orden['telefono']) ?><br>
                        <?= htmlspecialchars($orden['direccion']) ?>
                    </div>
                </td>
                <td style="width: 25%; vertical-align: middle; text-align: right;">
                    <div style="background-color: #ebf8ff; border: 1px solid #bee3f8; border-radius: 6px; padding: 8px; text-align: center;">
                        <span style="font-size: 7.5pt; color: #2b6cb0; font-weight: bold; text-transform: uppercase; display: block;">Orden de Servicio</span>
                        <span style="font-size: 11pt; font-weight: bold; color: #2c5282;"><?= htmlspecialchars($orden['folio']) ?></span>
                    </div>
                </td>
            </tr>
        </table>

        <!-- DATOS DEL PACIENTE (TARJETA) -->
        <div class="info-box">
            <table class="table-data">
                <tr>
                    <td width="12%" class="fw-bold" style="color: #4a5568;">PACIENTE:</td>
                    <td width="55%" class="text-uppercase fw-bold" style="font-size: 9.5pt; color: #1a202c;"><?= htmlspecialchars($orden['paciente_nombre_historico']) ?></td>
                    <td width="13%" class="fw-bold" style="color: #4a5568;">FECHA:</td>
                    <td width="20%"><?= $orden['fecha_registro'] ?> <?= $orden['hora_registro'] ?></td>
                </tr>
                <?php if ($orden['tipo_cliente'] !== 'particular'): ?>
                <tr>
                    <td class="fw-bold" style="color: #4a5568;">CONVENIO:</td>
                    <td class="text-uppercase" colspan="3"><?= htmlspecialchars($orden['convenio_nombre_historico']) ?></td>
                </tr>
                <?php endif; ?>
                <tr>
                    <td class="fw-bold" style="color: #4a5568;">ESTATUS:</td>
                    <td colspan="3">
                        <span style="font-weight: bold; color: #2b6cb0;"><?= htmlspecialchars($orden['estatus']) ?></span>
                        <?php if (!empty($orden['es_urgente']) && (int)$orden['es_urgente'] === 1): ?>
                            &nbsp;&nbsp;<span style="background-color: #fed7d7; color: #c53030; padding: 1px 6px; border-radius: 3px; font-size: 7.5pt; font-weight: bold;">URGENTE</span>
                        <?php endif; ?>
                        <?php if (!empty($orden['requiere_factura']) && ((int)$orden['requiere_factura'] === 1 || strtoupper((string)$orden['requiere_factura']) === 'SI')): ?>
                            &nbsp;&nbsp;<span style="background-color: #e2e8f0; color: #2d3748; padding: 1px 6px; border-radius: 3px; font-size: 7.5pt; font-weight: bold;">REQUIERE FACTURA</span>
                        <?php endif; ?>
                    </td>
                </tr>
            </table>
        </div>

        <!-- DATOS DE CANCELACIÓN (SI APLICA) -->
        <?php if ($esCancelado): ?>
            <div style="background-color: #fff5f5; border: 1px solid #feb2b2; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 8.5pt;">
                <div class="fw-bold text-uppercase" style="color: #c53030; margin-bottom: 2px;">Datos de Cancelación</div>
                <table class="table-data" style="color: #742a2a;">
                    <tr>
                        <td width="15%" class="fw-bold">Fecha:</td>
                        <td width="85%"><?= $orden['fecha_cancelacion'] ?> | <b>Canceló:</b> <?= htmlspecialchars($orden['user_cancela'] ?? '') ?></td>
                    </tr>
                    <tr>
                        <td class="fw-bold">Motivo:</td>
                        <td class="text-uppercase"><?= htmlspecialchars($orden['motivo_cancela'] ?? '') ?></td>
                    </tr>
                </table>
            </div>
        <?php endif; ?>

        <!-- DESGLOSE DE ESTUDIOS -->
        <table class="table-conceptos">
            <thead>
                <tr>
                    <th class="text-left" width="82%">ESTUDIO / CONCEPTO DESCRITO</th>
                    <th class="text-right" width="18%">IMPORTE</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($estudios as $item): ?>
                <tr>
                    <td>
                        <span class="fw-bold" style="color: #2d3748;"><?= htmlspecialchars($item['nombre_estudio_historico']) ?></span>
                    </td>
                    <td class="text-right fw-bold" style="color: #2d3748;">
                        $<?= number_format((float)$item['precio_aplicado'], 2) ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- RESUMEN FINANCIERO Y ABONOS (DOS COLUMNAS: IZQ HISTORIAL, DER TOTALES) -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
                <td style="width: 55%; vertical-align: top; padding-right: 15px;">
                    <!-- Historial de Pagos -->
                    <?php if (!empty($abonos)): ?>
                    <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px;">
                        <div style="font-weight: bold; font-size: 8pt; text-transform: uppercase; color: #4a5568; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">
                            Historial de Pagos / Abonos
                        </div>
                        <table style="width: 100%; border-collapse: collapse;">
                            <?php foreach ($abonos as $pago): ?>
                            <tr style="font-size: 8.5pt; color: #4a5568;">
                                <td style="padding: 2px 0;"><?= $pago['fecha'] ?> (<?= strtoupper(htmlspecialchars($pago['metodo_pago'])) ?>)</td>
                                <td class="text-right" style="padding: 2px 0; font-weight: bold;">$<?= number_format((float)$pago['monto'], 2) ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </table>
                    </div>
                    <?php endif; ?>

                    <div style="margin-top: 12px; text-align: left;">
                        <span class="badge-pago">
                            Estatus del pago: <?= htmlspecialchars($orden["estatus_pago"]) ?>
                        </span>
                    </div>
                </td>

                <td style="width: 45%; vertical-align: top;">
                    <!-- Totales -->
                    <table class="totales-container">
                        <tr>
                            <td class="text-right" style="color: #4a5568;">Subtotal:</td>
                            <td class="text-right" style="font-weight: bold;">$<?= number_format((float)$orden['subtotal'], 2) ?></td>
                        </tr>
                        <?php if ((float)$orden['descuento'] > 0): ?>
                        <tr>
                            <td class="text-right" style="color: #e53e3e;">
                                <?= ((float)$orden['por_descuento'] > 0) ? 'Descuento ('.(float)$orden['por_descuento'].'%):' : 'Descuento:' ?>
                            </td>
                            <td class="text-right" style="color: #e53e3e;">-$<?= number_format((float)$orden['descuento'], 2) ?></td>
                        </tr>
                        <?php endif; ?>
                        <?php if ((float)$orden['cargo_extra'] > 0): ?>
                        <tr>
                            <td class="text-right" style="color: #4a5568;">Cargo extra:</td>
                            <td class="text-right" style="color: #4a5568;">+$<?= number_format((float)$orden['cargo_extra'], 2) ?></td>
                        </tr>
                        <?php endif; ?>
                        <tr style="font-size: 10pt;">
                            <td class="text-right fw-bold" style="color: #1a202c; border-top: 1px solid #cbd5e0; padding-top: 6px;">TOTAL NETO:</td>
                            <td class="text-right fw-bold" style="color: #1a202c; border-top: 1px solid #cbd5e0; padding-top: 6px;">
                                $<?= number_format((float)$orden['total_neto'], 2) ?>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-right" style="color: #4a5568;">Total Abonado:</td>
                            <td class="text-right" style="color: #2b6cb0;">$<?= number_format((float)$orden['total_abonado'], 2) ?></td>
                        </tr>
                        <tr style="font-size: 10.5pt;">
                            <td class="text-right fw-bold" style="color: #c53030; border-top: 1px dashed #cbd5e0; padding-top: 6px;">SALDO RESTANTE:</td>
                            <td class="text-right fw-bold" style="color: #c53030; border-top: 1px dashed #cbd5e0; padding-top: 6px;">
                                $<?= number_format((float)$orden['saldo_deudor'], 2) ?>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="divider"></div>

        <!-- PORTAL DE RESULTADOS Y QR -->
        <table style="width: 100%; border-collapse: collapse; background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px;">
            <tr>
                <td style="width: 78%; vertical-align: middle; padding: 8px;">
                    <span class="fw-bold" style="font-size: 9pt; color: #2d3748;">CONSULTE SUS RESULTADOS EN LÍNEA</span><br>
                    <span style="font-size: 8.5pt; color: #4a5568;">Ingrese a <b><?= htmlspecialchars($empresa['web']) ?></b> o escanee el código QR.</span>
                    <div style="font-size: 8.5pt; font-family: monospace; color: #1a202c; margin-top: 4px; background: #fff; padding: 4px 8px; border: 1px solid #cbd5e0; display: inline-block; border-radius: 4px;">
                        <b>Folio:</b> <?= htmlspecialchars($orden['folio']) ?> &nbsp;|&nbsp; 
                        <b>Usuario:</b> <?= htmlspecialchars($orden["user_portal"]) ?> &nbsp;|&nbsp; 
                        <b>Contraseña:</b> <?= htmlspecialchars($orden["contrasenia"]) ?>
                    </div>
                </td>
                <td style="width: 22%; vertical-align: middle; text-align: center; padding: 8px;">
                    <?php if (!empty($qrBase64)): ?>
                        <img src="<?= $qrBase64 ?>" style="width: 65px; height: 65px; display: block; margin: 0 auto;">
                    <?php endif; ?>
                </td>
            </tr>
        </table>

        <!-- TÉRMINOS, AVISO DE PRIVACIDAD Y FIRMA -->
        <div class="legal-text">
            * Indispensable presentar este comprobante e identificación oficial para la entrega de resultados impresos.<br>
            * Los horarios de entrega son estimados y están sujetos a validación médica. Conserve este ticket para cualquier aclaración.<br>
            Al firmar este documento, declaro que he tenido a mi disposición y acepto el Aviso de Privacidad de <b><?= htmlspecialchars($_SESSION["emp_nombre"]) ?></b>, autorizando el tratamiento de mis datos de salud para la realización de análisis clínicos y la entrega de mis resultados.
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 25px;">
            <tr>
                <td style="width: 50%; text-align: center;">
                    <div style="width: 220px; margin: 0 auto; border-top: 1px solid #718096; padding-top: 4px; font-size: 8pt; color: #4a5568;">
                        Firma de Conformidad del Paciente
                    </div>
                </td>
                <td style="width: 50%; text-align: center;">
                    <div class="fw-bold" style="font-size: 9pt; color: #2d3748;">
                        ¡Gracias por confiar en nosotros!
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    <?php
    return ob_get_clean();
}