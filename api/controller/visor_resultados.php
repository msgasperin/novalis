<?php
// visor_resultados.php
require_once('../config/class.pdo.php');

/** @var string $bd_cliente */
$v = new Conexion($bd_cliente);
$v->conectar();

$token = isset($_GET['token']) ? trim($_GET['token']) : '';
$ordenEncontrada = false;
$mensajeError = '';
$datosOrden = [];
$archivosPDF = [];

if (!empty($token)) {
   // Consulta para validar el token y traer los datos de la orden
   $stmt = $v->dbh->prepare("
      SELECT 
         id_orden,
         folio,
         paciente_nombre_historico,
         fecha_orden,
         token_expiracion
      FROM ordenes_trabajo 
      WHERE token_notificacion = ? AND estatus = 1
      LIMIT 1
   ");
   $stmt->execute([$token]);

   if ($stmt->rowCount() > 0) {
      $datosOrden = $stmt->fetch(PDO::FETCH_ASSOC);

      // Validación opcional de expiración (ejemplo: 60 días)
      if (!empty($datosOrden['token_expiracion']) && strtotime($datosOrden['token_expiracion']) < time()) {
         $mensajeError = 'El enlace de consulta ha expirado por razones de seguridad. Por favor solicite una reexpedición al laboratorio.';
      } else {
         $ordenEncontrada = true;

         // Consultar los PDF adjuntos/asociados a esta orden de trabajo
         // Ajusta la tabla y campos según tu estructura de base de datos
         $stmtPdf = $v->dbh->prepare("
               SELECT 
                  id_resultado,
                  nombre_estudio,
                  nombre_archivo_pdf,
                  fecha_subida
               FROM resultados_pdf 
               WHERE id_orden = ? AND disponible_paciente = 1
               ORDER BY id_resultado ASC
         ");
         $stmtPdf->execute([$datosOrden['id_orden']]);
         $archivosPDF = $stmtPdf->fetchAll(PDO::FETCH_ASSOC);
      }
   } else {
      $mensajeError = 'El enlace de consulta es inválido o el código de acceso ya no existe.';
   }
} else {
   $mensajeError = 'No se proporcionó ningún token de consulta válido.';
}
?>
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Consulta de Resultados | Laboratorio Clínico</title>
      <!-- Bootstrap 5 CSS & FontAwesome Icons -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
      <style>
         body { background-color: #f4f6f9; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
         .header-brand { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; }
         .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
         .pdf-frame { width: 100%; height: 680px; border: none; border-radius: 8px; }
         .list-group-item.active { background-color: #0d6efd; border-color: #0d6efd; }
      </style>
   </head>
   <body>

      <!-- Header Principal -->
      <header class="header-brand py-3 mb-4 shadow-sm">
         <div class="container d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-file-earmark-medical fs-2"></i>
                  <h1 class="h4 m-0 fw-bold">Portal de Resultados</h1>
            </div>
            <span class="badge bg-white text-primary px-3 py-2 fw-semibold">Consulta Segura</span>
         </div>
      </header>

      <div class="container pb-5">
         <?php if (!$ordenEncontrada): ?>
            <!-- Vista de Error o Enlace Invalido -->
            <div class="row justify-content-center mt-5">
                  <div class="col-md-6">
                     <div class="card card-custom p-4 text-center">
                        <div class="text-danger mb-3">
                              <i class="bi bi-exclamation-triangle-fill display-1"></i>
                        </div>
                        <h3 class="h4 text-gray-800 mb-2">Acceso No Disponible</h3>
                        <p class="text-muted mb-4"><?= htmlspecialchars($mensajeError); ?></p>
                        <p class="small text-secondary mb-0">Si requiere sus estudios, comuníquese con el personal de recepción de su sucursal.</p>
                     </div>
                  </div>
            </div>
         <?php else: ?>
            <!-- Encabezado con datos del Paciente -->
            <div class="card card-custom p-4 mb-4">
                  <div class="row align-items-center">
                     <div class="col-md-8">
                        <span class="badge bg-light text-dark border mb-2">Orden #<?= htmlspecialchars($datosOrden['folio']); ?></span>
                        <h2 class="h3 fw-bold text-dark mb-1"><?= htmlspecialchars($datosOrden['paciente_nombre_historico']); ?></h2>
                        <p class="text-muted mb-0 small">
                              <i class="bi bi-calendar3 me-1"></i> Fecha de Atención: <?= date('d/m/Y', strtotime($datosOrden['fecha_orden'])); ?>
                        </p>
                     </div>
                     <div class="col-md-4 text-md-end mt-3 mt-md-0">
                        <span class="badge bg-success-subtle text-success fs-6 px-3 py-2 border border-success-subtle">
                              <i class="bi bi-check-circle-fill me-1"></i> Estudios Concluidos
                        </span>
                     </div>
                  </div>
            </div>

            <!-- Listado y Visor de PDF -->
            <?php if (count($archivosPDF) === 0): ?>
                  <div class="alert alert-warning text-center card-custom p-4">
                     <i class="bi bi-hourglass-split fs-2 d-block mb-2"></i>
                     Sus resultados están procesándose. En breve se adjuntarán los reportes correspondientes.
                  </div>
            <?php else: ?>
                  <div class="row g-4">
                     <!-- Panel Izquierdo: Lista de PDF disponibles -->
                     <div class="col-lg-4">
                        <div class="card card-custom p-3">
                              <h3 class="h6 fw-bold text-uppercase text-muted mb-3 px-2">Documentos de la Orden</h3>
                              <div class="list-group list-group-flush" id="pdfTabs" role="tablist">
                                 <?php foreach ($archivosPDF as $index => $pdf): 
                                    $rutaPdf = "../uploads/resultados/" . htmlspecialchars($pdf['nombre_archivo_pdf']);
                                    $isFirst = ($index === 0);
                                 ?>
                                    <div class="list-group-item list-group-item-action p-3 rounded-3 mb-2 <?= $isFirst ? 'active' : ''; ?>" 
                                          id="list-<?= $pdf['id_resultado']; ?>-list" 
                                          data-bs-toggle="list" 
                                          href="#list-<?= $pdf['id_resultado']; ?>" 
                                          role="tab"
                                          onclick="cambiarPdf('<?= $rutaPdf; ?>')">
                                          <div class="d-flex w-100 justify-content-between align-items-center">
                                             <h4 class="h6 mb-1 fw-bold text-truncate me-2"><?= htmlspecialchars($pdf['nombre_estudio']); ?></h4>
                                             <i class="bi bi-file-pdf fs-4"></i>
                                          </div>
                                          <p class="mb-2 small opacity-75">PDF Disponible</p>
                                          
                                          <!-- Botones para vista móvil -->
                                          <div class="d-lg-none d-flex gap-2 mt-2">
                                             <a href="<?= $rutaPdf; ?>" target="_blank" class="btn btn-sm btn-light text-primary w-50">
                                                <i class="bi bi-eye"></i> Ver
                                             </a>
                                             <a href="<?= $rutaPdf; ?>" download class="btn btn-sm btn-primary w-50">
                                                <i class="bi bi-download"></i> Descargar
                                             </a>
                                          </div>
                                    </div>
                                 <?php endforeach; ?>
                              </div>
                        </div>
                     </div>

                     <!-- Panel Derecho: Visor Integrado para Computadoras/Tablets -->
                     <div class="col-lg-8 d-none d-lg-block">
                        <div class="card card-custom p-3">
                              <div class="d-flex justify-content-between align-items-center mb-3 px-2">
                                 <span class="fw-semibold text-muted" id="tituloVisor">Vista previa del documento</span>
                                 <a id="btnDescargar" href="../uploads/resultados/<?= htmlspecialchars($archivosPDF[0]['nombre_archivo_pdf']); ?>" download class="btn btn-outline-primary btn-sm">
                                    <i class="bi bi-download me-1"></i> Descargar este PDF
                                 </a>
                              </div>
                              <div class="bg-light rounded text-center">
                                 <iframe id="visorIframe" class="pdf-frame" src="../uploads/resultados/<?= htmlspecialchars($archivosPDF[0]['nombre_archivo_pdf']); ?>#toolbar=1"></iframe>
                              </div>
                        </div>
                     </div>
                  </div>
            <?php endif; ?>
         <?php endif; ?>
      </div>

      <!-- Script de Interacción -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
      <script>
         function cambiarPdf(rutaArchivo) {
            const iframe = document.getElementById('visorIframe');
            const btnDescargar = document.getElementById('btnDescargar');
            
            if (iframe && btnDescargar) {
                  iframe.src = rutaArchivo + '#toolbar=1';
                  btnDescargar.href = rutaArchivo;
            }
         }
      </script>
   </body>
</html>