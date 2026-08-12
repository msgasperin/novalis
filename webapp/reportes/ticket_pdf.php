<?php
   require_once '../assets/lib/dompdf-2.0.4/vendor/autoload.php';
   
   use Dompdf\Dompdf;
   use Dompdf\Options;

   // 1. Configuración optimizada para Dompdf 2.0.4
   $options = new Options();
   $options->set('isHtml5ParserEnabled', true);
   $options->set('isRemoteEnabled', true); // Necesario para imágenes externas o Data URIs
   $options->set('defaultFont', 'Helvetica');
   $options->set('chroot', realpath(__DIR__));

   $dompdf = new Dompdf($options);

   // 2. Definir dimensiones exactas para Papel Térmico de 80mm
   // Factor de conversión: 1mm = 2.83465 pt.
   // 80mm ancho = 226.77pt | 220mm alto = 623.62pt (alto suficiente para cortar)
   $ancho_pt = 80 * 2.83465;
   $alto_pt  = 220 * 2.83465;

   $dompdf->setPaper([0, 0, $ancho_pt, $alto_pt], 'portrait');

   // 3. Cargar la vista HTML (puedes pasarle la orden activa desde la BD)
   $html = obtener_html_ticket_pro(); 

   $dompdf->loadHtml($html);
   $dompdf->render();

   // --- INYECCIÓN DEL SCRIPT NATIVO DE IMPRESIÓN ---
   // Esto le dice al visor de PDF del navegador que lance el diálogo de impresión al cargar
   $canvas = $dompdf->getCanvas();
   $canvas->javascript('this.print(true);');

   // 4. Salida en pantalla (stream) para previsualizar/imprimir directo
   $dompdf->stream("Ticket_Orden.pdf", ["Attachment" => false]);

   function obtenerLogoBase64(string $rutaImagen) {
      // Verificar si el archivo existe
      if (!file_exists($rutaImagen)) {
         return '';
      }

      // Leer el archivo y obtener su tipo mime (png, jpg, etc.)
      $type = pathinfo($rutaImagen, PATHINFO_EXTENSION);
      $data = file_get_contents($rutaImagen);
      
      // Retornar en formato Data URI listo para HTML
      return 'data:image/' . $type . ';base64,' . base64_encode($data);
   }

   function obtener_html_ticket_pro() {
      
      require_once('../../api/config/class.pdo.php');
      /** @var string $bd_cliente */ // <- Esto le dice a VS Code de qué tipo es
      $v = new Conexion($bd_cliente);
      $v->conectar();

      $sqlDatosEmpresa = $v->dbh->prepare("SELECT nombre, logo, direccion, rfc, telefono, correo, 'www.novalis-lab.com' AS web FROM datos_empresa");
      $sqlDatosEmpresa->execute();      
      $empresa = $sqlDatosEmpresa->fetch(PDO::FETCH_ASSOC);

      // Opción de respaldo (Fallback) por si la tabla datos_empresa está vacía
      if (!$empresa) {
         $empresa = [
            'nombre'    => 'LABORATORIO CLÍNICO NOVALIS',
            'logo'      => '',            
            'rfc'       => 'XAXX010101000',
            'web'       => 'www.novalis-lab.com'
         ];
      }

      $sqlDatosOrden = $v->dbh->prepare(
         "SELECT O.id, folio, DATE_FORMAT(O.fecha_cap, '%d-%m-%Y') AS fecha_registro, DATE_FORMAT(O.fecha_cap, '%h:%i %p') AS hora_registro, tipo_cliente, paciente_nombre_historico, convenio_nombre_historico, estatus_pago, estatus, subtotal, por_descuento, descuento, cargo_extra, motivo_cargo_extra, total_neto, total_abonado, saldo_deudor, sucursal_historico, direccion, telefono, key_query, DATE_FORMAT(fecha_cancelacion, '%d-%m-%Y %h:%i %p') AS fecha_cancelacion, user_cancela, motivo_cancela
         FROM ordenes_trabajo AS O
         INNER JOIN cat_sucursales AS S ON S.id = O.sucursal_id
         WHERE key_query = ?"
      );
      $sqlDatosOrden->execute([$_GET["kq"]]);      
      $orden = $sqlDatosOrden->fetch(PDO::FETCH_ASSOC);
      
      if(!$orden) {
         $orden = [
            'folio'              => 'ORD-0000-0000',
            'fecha_registro'     => '00/00/0000',
            'hora_registro'      => '00:00 AM',
            'paciente'           => '------ ------, -------',
            'convenio'           => '------',
            'estatus_pago'       => '-------', // PAGADO, PARCIAL, PENDIENTE
            'subtotal'           => 0.00,
            'descuento'          => 0.00,
            'cargo_extra'        => 0.00,
            'motivo_cargo_extra' => '----------',
            'total_neto'         => 0.00,
            'total_abonado'      => 0.00,
            'saldo_deudor'       => 0.00,
            'sucursal'           => '----------',
            'direccion'          => '----------',
            'telefono'           => '----------',
            'correo'             => '----------',
            'key_query'          => '----------'
         ];
      }

      $sqlAbonos = $v->dbh->prepare("SELECT DATE_FORMAT(fecha_pago, '%d/%m/%Y') AS fecha, metodo_pago, monto FROM orden_pagos WHERE orden_id = ? ORDER BY id ASC");
      $sqlAbonos->execute([$orden["id"]]);
      $abonos    = $sqlAbonos->fetchAll(PDO::FETCH_ASSOC);

      $sqlEstudios = $v->dbh->prepare("SELECT nombre_estudio_historico, precio_aplicado, aplico_desc FROM orden_detalles WHERE orden_id = ?");
      $sqlEstudios->execute([$orden["id"]]);
      $estudios = $sqlEstudios->fetchAll(PDO::FETCH_ASSOC);

      $rutaLogo = __DIR__ . '/../assets/images/favicon.png'; // Ruta física en el servidor
      $logoBase64 = obtenerLogoBase64($rutaLogo);

      $rutaQr = __DIR__ . '/../assets/images/qr_resultados.png'; // Ruta física en el servidor
      $qrBase64 = obtenerLogoBase64($rutaQr);

      $esCancelado = (strtoupper(trim($orden['estatus'])) === 'CANCELADO');

      ob_start();

      echo '
         <!DOCTYPE html>
         <html lang="es">
            <head>
               <meta charset="UTF-8">
               <style>
                     /* Reset y márgenes para ticket térmico */
                     @page {
                        margin: 4mm 4mm 4mm 4mm;
                     }
                        
                     body {
                        font-family: "Helvetica", Helvetica, Arial, sans-serif;
                        font-size: 7pt;
                        line-height: 1.15;
                        color: #000;
                     }

                     .watermark {
                        position: fixed;
                        top: 50%;
                        left: 0%;
                        width: 100%;
                        text-align: center;
                        font-size: 26pt;
                        font-weight: bold;
                        color: rgba(200, 0, 0, 0.25);
                        border: 3px solid rgba(200, 0, 0, 0.25);
                        padding: 8px 0;
                        transform: rotate(-30deg);
                        transform-origin: center center;
                        z-index: -1000;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        border-radius: 10px;
                     }

                     /* Utilidades */
                     .text-center { text-align: center; }
                     .text-right { text-align: right; }
                     .text-left { text-align: left; }
                     .fw-bold { font-weight: bold; }
                     .text-uppercase { text-transform: uppercase; }

                     /* Encabezado */
                     .brand-title { font-size: 9pt; font-weight: bold; letter-spacing: 0.5px; }
                     .brand-subtitle { font-size: 7pt; color: #333; margin-bottom: 2px; }

                     /* Separadores estilo ticket */
                     .divider {
                        border-top: 1px dashed #000;
                        margin: 5px 0;
                     }
                     .divider-solid {
                        border-top: 1px solid #000;
                        margin: 5px 0;
                     }

                     /* Tablas estructuradas */
                     .table-data {
                        width: 100%;
                        border-collapse: collapse;
                     }
                     .table-data td {
                        padding: 1px 0;
                        vertical-align: top;
                     }

                     /* Tabla de conceptos */
                     .table-conceptos {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 3px;
                     }
                     .table-conceptos th {
                        border-bottom: 1px solid #000;
                        font-size: 7pt;
                        padding-bottom: 2px;
                        text-transform: uppercase;
                     }
                     .table-conceptos td {
                        padding: 3px 0;
                        border-bottom: 0.5px dotted #ccc;
                     }

                     /* Badges de Estado */
                     .badge-pago {
                        display: inline-block;
                        padding: 2px 6px;
                        font-size: 7pt;
                        font-weight: bold;
                        border: 1px solid #000;
                        border-radius: 3px;
                     }

                     /* Bloque de Totales */
                     .totales-container {
                        width: 100%;
                        margin-top: 4px;
                     }
                     .totales-container td {
                        padding: 1px 0;
                     }

                     /* Footer y QR */
                     .qr-code {
                        width: 75px;
                        height: 75px;
                        margin: 4px auto;
                     }
                     .legal-text {
                        font-size: 6pt;
                        color: #444;
                        text-align: justify;
                        line-height: 1.1;
                     }
               </style>
            </head>
            <body>
               '.($esCancelado ? '<div class="watermark">CANCELADO</div>' : '').'
               <div class="text-center">
                  <img src="'.$logoBase64.'" style="max-width: 140px; max-height: 50px; margin-bottom: 4px;"><br>
                  <div class="brand-title">'.$empresa['nombre'].'</div>
                  <div class="brand-subtitle">Sucursal: '.$orden['sucursal_historico'].'</div>
                  <div style="font-size: 6.5pt;">
                     RFC: '.$empresa['rfc'].'<br>
                     '.$orden['direccion'].'<br>
                     Tel: '.$orden['telefono'].'
                  </div>
               </div>

               <div class="divider"></div>

               <!-- 2. DATOS DE LA ORDEN Y PACIENTE -->
               <table class="table-data">
                  <tr>
                     <td width="35%" class="fw-bold">FOLIO:</td>
                     <td width="65%" class="fw-bold" style="font-size: 8.5pt;">'.$orden['folio'].'</td>
                  </tr>
                  <tr>
                     <td class="fw-bold">FECHA:</td>
                     <td>'.$orden['fecha_registro'].' - '.$orden['hora_registro'].'</td>
                  </tr>
                  <tr>
                     <td class="fw-bold">PACIENTE:</td>
                     <td class="text-uppercase fw-bold">'.$orden['paciente_nombre_historico'].'</td>
                  </tr>';
                  if ($orden['tipo_cliente'] !== 'particular') {
                     echo '
                     <tr>
                        <td class="fw-bold">CONVENIO:</td>
                        <td class="text-uppercase">'.$orden['convenio_nombre_historico'].'</td>
                     </tr>';
                  }  
                  echo '                  
               </table>';

               // --- INICIO: DATOS DE CANCELACIÓN ---
                  if ($esCancelado) {
                     echo '
                     <div class="divider"></div>

                     <div style="border: 1px dashed #000; padding: 4px; border-radius: 3px; font-size: 6.5pt;">
                        <div class="fw-bold text-center text-uppercase" style="font-size: 7pt; margin-bottom: 2px;">DATOS DE CANCELACIÓN</div>
                        <table class="table-data">
                           <tr>
                              <td width="35%" class="fw-bold">FECHA CANC:</td>
                              <td width="65%">'.$orden['fecha_cancelacion'].'</td>
                           </tr>
                           <tr>
                              <td class="fw-bold">CANCELÓ:</td>
                              <td class="text-uppercase">'.$orden['user_cancela'].'</td>
                           </tr>
                           <tr>
                              <td class="fw-bold">MOTIVO:</td>
                              <td class="text-uppercase">'.$orden['motivo_cancela'].'</td>
                           </tr>
                        </table>
                     </div>';
                  }
                  // --- FIN: DATOS DE CANCELACIÓN ---
                  echo '

               <div class="divider"></div>

               <!-- 3. DESGLOSE DE ESTUDIOS -->
               <table class="table-conceptos">
                  <thead>
                     <tr>
                        <th class="text-left" width="70%">ESTUDIO / CONCEPTO</th>
                        <th class="text-right" width="30%">IMPORTE</th>
                     </tr>
                  </thead>
                  <tbody>';
                     foreach ($estudios as $item) {
                        echo '
                        <tr>
                           <td>
                              <span class="fw-bold">'.$item['nombre_estudio_historico'].'</span><br>';
                                 if($item["aplico_desc"] == 'SI') {
                                    echo '<span style="font-size: 6pt; color: #555;">Aplica para descuento</span>';
                                 }
                              echo '                              
                           </td>
                           <td class="text-right fw-bold" style="vertical-align: middle;">
                              $'.number_format($item['precio_aplicado'], 2).'
                           </td>
                        </tr>';
                     }
                     echo'
                  </tbody>
               </table>

               <!-- 4. RESUMEN FINANCIERO -->
               <table class="totales-container">
                  <tr>
                     <td class="text-right" width="65%">Subtotal:</td>
                     <td class="text-right" width="35%">$'.number_format($orden['subtotal'], 2).'</td>
                  </tr>';

                  // Mostrar Descuento solo si aplica
                  if ((float)$orden['descuento'] > 0) {
                     $lblDesc = ((float)$orden['por_descuento'] > 0) ? 'Descuento ('.(float)$orden['por_descuento'].'%):' : 'Descuento:';
                     echo '
                     <tr>
                        <td class="text-right" style="color: #444;">'.$lblDesc.'</td>
                        <td class="text-right" style="color: #444;">-$'.number_format($orden['descuento'], 2).'</td>
                     </tr>';
                  }

                  // Mostrar Cargo Extra solo si aplica
                  if ((float)$orden['cargo_extra'] > 0) {
                     $motivoCargo = !empty($orden['motivo_cargo_extra']) ? ' ('.$orden['motivo_cargo_extra'].')' : '';
                     echo '
                     <tr>
                        <td class="text-right" style="color: #444;">Cargo extra'.$motivoCargo.':</td>
                        <td class="text-right" style="color: #444;">+$'.number_format($orden['cargo_extra'], 2).'</td>
                     </tr>';
                  }

                  echo '
                  <tr style="font-size: 8pt;">
                     <td class="text-right fw-bold" style="padding-top: 2px;">TOTAL:</td>
                     <td class="text-right fw-bold" style="padding-top: 2px; border-top: 1px solid #000;">
                        $'.number_format($orden['total_neto'], 2).'
                     </td>
                  </tr>
                  <tr>
                     <td class="text-right">Abonado:</td>
                     <td class="text-right">$'.number_format($orden['total_abonado'], 2).'</td>
                  </tr>
                  <tr style="font-size: 8pt;">
                     <td class="text-right fw-bold">SALDO RESTANTE:</td>
                     <td class="text-right fw-bold" style="border-top: 1px dashed #000;">
                        $'.number_format($orden['saldo_deudor'], 2).'
                     </td>
                  </tr>
                  <tr style="font-size: 8pt;">
                     <td class="text-right fw-bold" style="padding-top: 2px;">TOTAL:</td>
                     <td class="text-right fw-bold" style="padding-top: 2px; border-top: 1px solid #000;">
                        $'.number_format($orden['total_neto'], 2).'
                     </td>
                  </tr>';

                  // --- INICIO: DESGLOSE DE ABONOS ---
                  if (!empty($abonos)) {
                     echo '
                     <tr>
                        <td colspan="2" style="padding-top: 4px;">
                           <div style="font-weight: bold; font-size: 6.5pt; text-transform: uppercase; border-bottom: 0.5px dashed #aaa; margin-bottom: 2px;">
                              Historial de Pagos:
                           </div>
                        </td>
                     </tr>';

                     foreach ($abonos as $pago) {
                        echo '
                        <tr style="font-size: 6.5pt; color: #333;">
                           <td class="text-left" style="padding-left: 5px;">
                              '.$pago['fecha'].' ('.strtoupper($pago['metodo_pago']).')
                           </td>
                           <td class="text-right">
                              $'.number_format($pago['monto'], 2).'
                           </td>
                        </tr>';
                     }
                  }
                  // --- FIN: DESGLOSE DE ABONOS ---

                  echo '
                  <tr>
                     <td class="text-right" style="padding-top: 3px;">Total Abonado:</td>
                     <td class="text-right" style="padding-top: 3px;">$'.number_format($orden['total_abonado'], 2).'</td>
                  </tr>
                  <tr>
                     <td class="text-right fw-bold">SALDO RESTANTE:</td>
                     <td class="text-right fw-bold" style="border-top: 1px dashed #000;">
                        $'.number_format($orden['saldo_deudor'], 2).'
                     </td>
                  </tr>
               </table>

               <div class="divider"></div>

               <!-- 5. ESTATUS DE PAGO Y FORMA -->
               <div class="text-center" style="margin: 4px 0;">
                  <span class="badge-pago">
                     Estatus del pago: '.$orden["estatus_pago"].'
                  </span>
               </div>

               <div class="divider"></div>

               <!-- 6. ACCESO A RESULTADOS ONLINE (QR ESTILO CHOPO/SALUD DIGNA) -->
               <div class="text-center">
                  <span class="fw-bold">CONSULTE SUS RESULTADOS EN LÍNEA</span><br>
                  <span style="font-size: 6.5pt;">Escanee el código QR o ingrese a <b>'.$empresa['web'].'</b></span>
                  
                  <div>
                     <img src="'.$qrBase64.'" style="max-width: 140px; max-height: 50px; margin-bottom: 4px;"><br>
                  </div>

                  <div style="font-size: 6.5pt; font-family: monospace;">
                     <b>Folio:</b> '.$orden['folio'].'<br>
                     <b>Clave Acceso:</b> '.$orden["key_query"].'
                  </div>
               </div>

               <div class="divider-solid"></div>

               <!-- 7. TÉRMINOS Y CONDICIONES (PIE CORPORATIVO) -->
               <div class="legal-text">
                  * Indispensable presentar este comprobante e identificación oficial para la entrega de resultados impresos.<br>
                  * Los horarios de entrega son estimados y están sujetos a validación médica.<br>
                  * Para cualquier aclaración conserve este ticket.
               </div>

               <div class="text-center fw-bold" style="margin-top: 6px; font-size: 7.5pt;">
                  ¡Gracias por confiar en nosotros!
               </div>

            </body>
         </html>';
      return ob_get_clean();
   }