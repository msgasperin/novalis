<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8">
      <title>Imprimir Etiquetas</title>
      <style>
         /* Configurar tamaño exacto de la etiqueta (ej. 50mm x 25mm) */
         @page {
            size: 50mm 25mm;
            margin: 0;
         }
         body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 8pt;
            background: #fff;
         }
         .etiqueta-page {
            width: 50mm;
            height: 25mm;
            box-sizing: border-box;
            padding: 2mm 3mm;
            page-break-after: always; /* Nueva página por cada tubo/etiqueta */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 1px dotted #000203;
         }
         .header {
            font-weight: bold;
            font-size: 7pt;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
         }
         .paciente {
            font-weight: bold;
            font-size: 8.5pt;
            line-height: 1.1;
            max-height: 2.2em;
            overflow: hidden;
         }
         .info-secundaria {
            font-size: 7pt;
            display: flex;
            justify-content: space-between;
         }
         .barcode-container {
            text-align: center;
            margin-top: 1mm;
         }
         .barcode-container img {
            max-width: 100%;
            height: 7mm; /* Ajustar altura del código de barras */
         }
         
         /* Ocultar elementos en la impresión */
         @media print {
            .no-print { display: none !important; }
         }

      </style>
   </head>
   <body>

   <?php
      require_once('../../api/config/class.pdo.php'); 
      require_once('../../api/config/seguridad.php');
      
      /** @var string $bd_cliente */
      $v = new Conexion($bd_cliente);
      $v->conectar();   

      $keyQuery = $_GET["kq"] ?? '';

      $sqlDatosOrden = $v->dbh->prepare(
         "SELECT O.folio, O.paciente_nombre_historico, C.tubos_json, DATE_FORMAT(O.fecha_cap, '%d/%m/%Y') AS fecha_registro
         FROM ordenes_trabajo AS O
         INNER JOIN orden_detalles AS OD ON O.id = OD.orden_id
         INNER JOIN cat_estudios AS C ON C.id = OD.estudio_id
         WHERE O.key_query = ?"
      );
      $sqlDatosOrden->execute([$keyQuery]);
      $filasOrden = $sqlDatosOrden->fetchAll(PDO::FETCH_ASSOC);

      $listaEtiquetasCSV = []; // Arreglo para acumular datos del CSV

      if (!empty($filasOrden)):
         $folio    = $filasOrden[0]['folio'];
         $paciente = $filasOrden[0]['paciente_nombre_historico'];
         $fecha    = $filasOrden[0]['fecha_registro'];
   ?>

      <div class="no-print" style="padding: 10px; background: #f4f4f4; text-align: center; display: flex; justify-content: center; gap: 10px;">
         <button onclick="window.print();" style="padding: 8px 16px; font-weight: bold; cursor: pointer; background-color: #012b58; color: white; border: none; border-radius: 4px;">
            🖨️ Imprimir Etiquetas
         </button>
         
         <button onclick="fn_descargar_csv_etiquetas();" style="padding: 8px 16px; font-weight: bold; cursor: pointer; background-color: #2e8843; color: white; border: none; border-radius: 4px;">
            💾 Descargar CSV
         </button>
      </div>
      <div align="center">

         <?php
               foreach ($filasOrden as $estudio):
                  $tubos = !empty($estudio['tubos_json']) ? json_decode($estudio['tubos_json'], true) : [];

                  if (is_array($tubos)):
                     foreach ($tubos as $item):
                        $cantidad = intval($item['cantidad'] ?? 1);
                        $muestra  = $item['muestra'] ?? '';

                        for ($i = 0; $i < $cantidad; $i++):
                           // Guardar registro individual para la exportación CSV
                           $listaEtiquetasCSV[] = [
                              'folio'    => $folio,
                              'paciente' => $paciente,
                              'muestra'  => $muestra,
                              'fecha'    => $fecha
                           ];
         ?>
                           <div class="etiqueta-page">
                              <div class="header">ORD: #<?= htmlspecialchars($folio); ?></div>
                              <div class="paciente"><?= htmlspecialchars($paciente); ?></div>
                              <div class="info-secundaria">
                                 <span><b>Muestra:</b> <?= htmlspecialchars($muestra); ?></span>
                                 <span><b>Fec:</b> <?= $fecha; ?></span>
                              </div>
                              <div class="barcode-container">
                                 <img src="barcode.php?code=<?= urlencode($folio); ?>&height=40&scale=2" alt="Código de barras">
                              </div>
                           </div>
         <?php 
                        endfor;
                     endforeach;
                  endif;
               endforeach;
            else:
         ?>
               <div style="text-align: center; margin-top: 20px;">
                  <p>No se encontraron datos para la orden especificada.</p>
               </div>
         <?php 
            endif; 
         ?>
   </div>

   <script>
   function fn_descargar_csv_etiquetas() {
      // Inyección del arreglo recopilado desde PHP
      const data = <?= json_encode($listaEtiquetasCSV, JSON_UNESCAPED_UNICODE); ?>;
      const folioOrden = "<?= $folio ?? 'orden'; ?>";

      if (!data || data.length === 0) {
         alert("No hay datos de etiquetas para exportar.");
         return;
      }

      // BOM UTF-8 (\uFEFF) para forzar a Excel a abrir caracteres e tildes correctamente
      let csvContent = "\uFEFFFolio,Paciente,Muestra,Fecha,CodigoBarras\r\n";

      data.forEach(row => {
         let fila = [
            `"${row.folio}"`,
            `"${row.paciente.replace(/"/g, '""')}"`, // Escapar comillas dobles
            `"${row.muestra.replace(/"/g, '""')}"`,
            `"${row.fecha}"`,
            `"${row.folio}"`
         ].join(",");
         csvContent += fila + "\r\n";
      });

      // Crear archivo Blob e iniciar descarga
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", `Etiquetas_Orden_${folioOrden}.csv`);
      document.body.appendChild(link);
      
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
   }
   </script>

   </body>
</html>