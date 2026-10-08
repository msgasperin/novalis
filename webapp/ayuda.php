<?php
   //ini_set('session.cookie_secure', 1);     // solo HTTPS
   ini_set('session.cookie_httponly', 1);   // no accesible desde JS
   ini_set('session.cookie_samesite', 'Strict'); // bloquea CSRF adicional
   session_start();

   header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
   header("Last-Modified: " . gmdate("D,dMYH:i:s") . " GMT");
   header("Cache-Control: no-cache, must-revalidate");
   header("Pragma: no-cache");

   $host = $_SERVER['HTTP_HOST'];
   $parts = explode('.', $host);
   $subDominio = (count($parts) >= 3) ? $parts[0] : 'default';
   $subDominio = 'labdemo'; // borrar solo para pruebas responsive

   $ruta = '../api/assets/' . $subDominio . '/images/logo.png';
?>
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>:: NovaLIS - Manual de Usuario ::</title>

      <!-- CSS -->
      <link rel="shortcut icon" href="assets/images/favicon.ico"/>
      <link rel="stylesheet" type="text/css" href="assets/lib/bootstrap-5.3.2/css/bootstrap.css"/>
      <link rel="stylesheet" type="text/css" href="assets/lib/sweetAlert2/sweetalert2.min.css"/>
      <link rel="stylesheet" type="text/css" href="assets/css/styles.css?x=<?php echo time();?>" />
      <link rel="stylesheet" type="text/css" href="assets/css/toast.css?x=<?php echo time();?>" />
      <link rel="stylesheet" href="assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">

      <style>
         body {
            background-color: #f8fafc;
            color: #334155;
         }
         .sticky-sidebar {
            position: sticky;
            top: 20px;
            max-height: calc(100vh - 40px);
            overflow-y: auto;
         }
         .nav-manual .nav-link {
            color: #475569;
            font-size: 0.9rem;
            padding: 0.5rem 0.8rem;
            border-radius: 6px;
            transition: all 0.2s ease;
         }
         .nav-manual .nav-link:hover, .nav-manual .nav-link.active {
            background-color: #e2e8f0;
            color: #0f172a;
            font-weight: 600;
         }
         .doc-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            margin-bottom: 2rem;
            padding: 1.75rem;
         }
         .doc-header-icon {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            background: #e0f2fe;
            color: #0284c7;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
         }
         .step-badge {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #0284c7;
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.85rem;
         }
         .search-box {
            border-radius: 10px;
            border: 1px solid #cbd5e1;
            padding: 0.75rem 1rem;
         }
      </style>
   </head>
   <body>

      <!-- Header Superior -->
      <header class="bg-white border-bottom py-3 mb-4 shadow-sm">
         <div class="container-fluid px-4">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
               <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/logo.webp" class="img-fluid" style="max-height: 45px;" alt="NOVALIS">
                  <span class="border-end h-100 py-2"></span>
                  <img src="<?= $ruta; ?>" class="img-fluid" style="max-height: 40px;" alt="Laboratorio">
                  <div class="ms-2">
                     <h5 class="fw-bold mb-0 text-dark">Centro de Ayuda & Manual de Usuario</h5>
                     <small class="text-muted">NOVALIS LIS - Plataforma de Gestión Operativa</small>
                  </div>
               </div>
            </div>
         </div>
      </header>

      <div class="container-fluid px-4 pb-5">
         <div class="row g-4">

            <!-- Menú Lateral Nav / Búsqueda -->
            <div class="col-lg-3">
               <div class="sticky-sidebar bg-white p-3 border rounded-3 shadow-sm">
                  <div class="mb-3">
                     <label for="inputSearchManual" class="form-label fw-bold text-dark small mb-1">
                        <i class="bi bi-search me-1 text-primary"></i> Buscar en el manual
                     </label>
                     <input type="text" class="form-control form-control-sm search-box" id="inputSearchManual" placeholder="Ej. recepción, pago, pdf, cortes...">
                  </div>

                  <hr class="my-3">

                  <nav class="nav nav-pills flex-column nav-manual" id="manualNav">
                     <a class="nav-link active" href="#cap1"><i class="bi bi-info-circle me-2"></i>1. Introducción y Roles</a>
                     <a class="nav-link" href="#cap2"><i class="bi bi-key me-2"></i>2. Acceso e Identificación</a>
                     <a class="nav-link" href="#cap3"><i class="bi bi-receipt-cutoff me-2"></i>3. Recepción y Caja</a>
                     <a class="nav-link" href="#cap4"><i class="bi bi-journal-medical me-2"></i>4. Bandejas y PDFs</a>
                     <a class="nav-link" href="#cap5"><i class="bi bi-people me-2"></i>5. Pacientes y Convenios</a>
                     <a class="nav-link" href="#cap6"><i class="bi bi-tags me-2"></i>6. Precios y Sucursales</a>
                     <a class="nav-link" href="#cap7"><i class="bi bi-bar-chart-line me-2"></i>7. Reportes y Finanzas</a>
                     <a class="nav-link" href="#cap8"><i class="bi bi-globe me-2"></i>8. Portal y Landing Page</a>
                  </nav>
               </div>
            </div>

            <!-- Contenido Principal -->
            <div class="col-lg-9" id="manualContent">

               <!-- Capítulo 1 -->
               <div class="doc-card" id="cap1">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-info-circle"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 1: Introducción y Arquitectura</h4>
                        <small class="text-muted">Visión general de NOVALIS LIS y niveles de acceso</small>
                     </div>
                  </div>
                  <hr>
                  <h5>1.1 Propósito del Sistema</h5>
                  <p class="text-secondary">NOVALIS es un Sistema de Información de Laboratorio (LIS) bajo arquitectura multi-tenant enfocado en la gestión operativa, comercial y administrativa de laboratorios clínicos pequeños y medianos. Optimiza desde el registro de la orden hasta la entrega digital de resultados en PDF y su publicación en el portal web.</p>

                  <h5 class="mt-4">1.2 Perfiles y Roles de Usuario</h5>
                  <div class="row g-3 mt-1">
                     <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3 border">
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-shield-lock me-1"></i> Administrador / Gerencia</h6>
                           <p class="small text-secondary mb-0">Acceso total a finanzas, configuración de sucursales, usuarios, catálogos, listas de precios, descuentos y promociones del portal.</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3 border">
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-receipt me-1"></i> Recepción / Caja</h6>
                           <p class="small text-secondary mb-0">Registro de órdenes, cobro, abonos, cancelaciones, tickets y cortes de caja.</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3 border">
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-file-earmark-pdf me-1"></i> Área Operativa / Químico</h6>
                           <p class="small text-secondary mb-0">Consulta de órdenes, subida de resultados en PDF, previsualización y notificación al cliente.</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3 border">
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-person-circle me-1"></i> Paciente / Convenio (Público)</h6>
                           <p class="small text-secondary mb-0">Consulta y descarga de reportes PDF desde el portal mediante folio de orden y clave web.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Capítulo 2 -->
               <div class="doc-card" id="cap2">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-key"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 2: Acceso e Identificación</h4>
                        <small class="text-muted">Inicio de sesión en entorno Multi-Tenant</small>
                     </div>
                  </div>
                  <hr>
                  <h5>2.1 Identificación Dinámica por Cliente</h5>
                  <p class="text-secondary">Al ingresar a su subdominio o dominio asignado (ej. <code>tulaboratorio.novalis.com</code>), la plataforma identifica automáticamente al laboratorio y establece conexión con su base de datos independiente.</p>

                  <div class="alert alert-info d-flex align-items-center gap-2 mt-3" role="alert">
                     <i class="bi bi-info-circle-fill fs-5"></i>
                     <div class="small">Cada usuario opera sobre una base de datos aislada, garantizando privacidad total entre laboratorios.</div>
                  </div>
               </div>

               <!-- Capítulo 3 -->
               <div class="doc-card" id="cap3">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-receipt-cutoff"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 3: Módulo de Recepción y Caja</h4>
                        <small class="text-muted">Interfaz dividida para atención continua en mostrador</small>
                     </div>
                  </div>
                  <hr>
                  <p class="text-secondary mb-4">El módulo de Recepción organiza la atención en una vista dividida de alta velocidad: columna principal (<code>col-9</code>) para el flujo de captura y panel lateral (<code>col-3</code>) para consulta de órdenes del día.</p>

                  <h5 class="mb-3">3.1 Flujo de Registro de Orden</h5>
                  <div class="d-flex flex-column gap-3">
                     <div class="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
                        <span class="step-badge flex-shrink-0">1</span>
                        <div>
                           <h6 class="fw-bold mb-1">Búsqueda o Registro Express de Paciente</h6>
                           <p class="small text-secondary mb-0">Busque por nombre o teléfono. Si no existe, abra el registro rápido para darlo de alta sin salir de la pantalla.</p>
                        </div>
                     </div>
                     <div class="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
                        <span class="step-badge flex-shrink-0">2</span>
                        <div>
                           <h6 class="fw-bold mb-1">Selección de Convenio (Opcional)</h6>
                           <p class="small text-secondary mb-0">Asigne una empresa, doctor o laboratorio para aplicar tarifas o descuentos automáticos.</p>
                        </div>
                     </div>
                     <div class="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
                        <span class="step-badge flex-shrink-0">3</span>
                        <div>
                           <h6 class="fw-bold mb-1">Carga de Estudios y Precios</h6>
                           <p class="small text-secondary mb-0">Seleccione los estudios o paquetes requeridos. Los costos se actualizarán según la lista de precios seleccionada.</p>
                        </div>
                     </div>
                  </div>

                  <h5 class="mt-4">3.2 Cobro, Abonos y Cancelaciones</h5>
                  <ul class="text-secondary small">
                     <li><strong>Cobro Total o Parcial:</strong> Permite pagos completos o anticipos (el remanente se envía a <em>Cuentas por Cobrar</em>).</li>
                     <li><strong>Ticket de Pago:</strong> Incluye el resumen comercial, Folio de Orden y Clave Web de acceso para el cliente.</li>
                     <li><strong>Cancelaciones:</strong> Exigen motivo justificado y quedan auditadas en el sistema.</li>
                  </ul>

                  <h5 class="mt-4">3.3 Arqueos y Corte de Caja</h5>
                  <p class="small text-secondary mb-0">Inicie el turno registrando el saldo inicial. Durante el día capture entradas/salidas manuales y al finalizar genere <strong>Mi Corte de Caja</strong> para imprimir el resumen de efectivo, tarjeta y transferencia.</p>
               </div>

               <!-- Capítulo 4 -->
               <div class="doc-card" id="cap4">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-journal-medical"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 4: Bandejas Operativas y Resultados PDF</h4>
                        <small class="text-muted">Monitoreo por estados y notificación por correo</small>
                     </div>
                  </div>
                  <hr>
                  <h5>4.1 Organización por Pestañas (Tabs)</h5>
                  <div class="table-responsive">
                     <table class="table table-bordered table-hover small">
                        <thead class="table-light">
                           <tr>
                              <th>Estatus</th>
                              <th>Descripción</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td><span class="badge bg-secondary">Pendientes</span></td>
                              <td>Órdenes registradas que aún no cuentan con PDF cargado.</td>
                           </tr>
                           <tr>
                              <td><span class="badge bg-warning text-dark">Parciales</span></td>
                              <td>Órdenes con al menos un estudio/PDF adjunto, pero faltan otros.</td>
                           </tr>
                           <tr>
                              <td><span class="badge bg-info text-white">Completadas</span></td>
                              <td>Órdenes con el 100% de sus PDFs cargados. Lista para publicar.</td>
                           </tr>
                           <tr>
                              <td><span class="badge bg-success">Publicadas</span></td>
                              <td>Órdenes liberadas para consulta del paciente en el portal web.</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  <h5 class="mt-3">4.2 Carga y Notificación</h5>
                  <p class="text-secondary small">Seleccione la orden, elija el estudio correspondiente y adjunte el PDF desde su equipo. Cada archivo genera una pestaña de previsualización inmediata. Al dar clic en <strong>Publicar y Notificar</strong>, el sistema envía automáticamente un correo electrónico al paciente con su enlace directo y credenciales web.</p>
               </div>

               <!-- Capítulo 5 -->
               <div class="doc-card" id="cap5">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-people"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 5: Catálogos, Pacientes y Convenios</h4>
                        <small class="text-muted">Estructuración comercial y de clientes</small>
                     </div>
                  </div>
                  <hr>
                  <ul class="text-secondary small">
                     <li><strong>Pacientes & Datos Fiscales:</strong> Historial completo del paciente. Permite asociar múltiples RFC/Datos de facturación marcando cuál actúa como predeterminado.</li>
                     <li><strong>Convenios:</strong> Registro de acuerdos comerciales con empresas, doctores remitentes y laboratorios maquiladores.</li>
                     <li><strong>Estudios y Paquetes:</strong> Creación y edición de análisis individuales o perfiles preventivos agrupados.</li>
                  </ul>
               </div>

               <!-- Capítulo 6 -->
               <div class="doc-card" id="cap6">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-tags"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 6: Precios, Sucursales y Usuarios</h4>
                        <small class="text-muted">Control comercial y administración interna</small>
                     </div>
                  </div>
                  <hr>
                  <ul class="text-secondary small">
                     <li><strong>Listas de Precios:</strong> Soporta importación masiva en hojas estructuradas y actualización de costos o porcentajes en lote.</li>
                     <li><strong>Descuentos Generales:</strong> Define límites para controlar qué porcentajes puede aplicar el personal de recepción.</li>
                     <li><strong>Multi-Sucursal & Usuarios:</strong> Configuración de matrices, tomas de muestra y asignación de permisos por rol.</li>
                  </ul>
               </div>

               <!-- Capítulo 7 -->
               <div class="doc-card" id="cap7">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-bar-chart-line"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 7: Reportes y Finanzas</h4>
                        <small class="text-muted">Inteligencia de negocio y auditoría operacional</small>
                     </div>
                  </div>
                  <hr>
                  <p class="text-secondary small">El módulo incluye consultas avanzadas para toma de decisiones:</p>
                  <div class="row g-2">
                     <div class="col-md-6"><div class="p-2 border rounded bg-light small"><i class="bi bi-journal-check me-2 text-primary"></i>Histórico de Cortes y Arqueos</div></div>
                     <div class="col-md-6"><div class="p-2 border rounded bg-light small"><i class="bi bi-cash-stack me-2 text-success"></i>Flujo Operativo de Dinero</div></div>
                     <div class="col-md-6"><div class="p-2 border rounded bg-light small"><i class="bi bi-clock-history me-2 text-warning"></i>Cuentas por Cobrar Pendientes</div></div>
                     <div class="col-md-6"><div class="p-2 border rounded bg-light small"><i class="bi bi-graph-up me-2 text-info"></i>Estudios de Mayor Rentabilidad</div></div>
                  </div>
               </div>

               <!-- Capítulo 8 -->
               <div class="doc-card" id="cap8">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-globe"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 8: Portal de Consulta y Landing Page</h4>
                        <small class="text-muted">Presencia web pública del laboratorio</small>
                     </div>
                  </div>
                  <hr>
                  <p class="text-secondary small">Desde el panel interno se gestionan las promociones dinámicas y el número de atención WhatsApp que se muestran en la cara pública del laboratorio. Los pacientes acceden a su portal introduciendo su <strong>Folio</strong> y <strong>Clave Web</strong> impresos en su ticket para descargar sus resultados de manera inmediata.</p>
               </div>

            </div>
         </div>
      </div>

      <!-- Footer -->
      <footer class="bg-white border-top py-3 text-center text-muted small">
         <div class="container-fluid">
            © NOVALIS - Sistema de Información de Laboratorio | Todos los derechos reservados
         </div>
      </footer>

      <!-- JS Scripts -->
      <script src="assets/lib/jquery-3.7.1.min.js"></script>
      <script src="assets/lib/sweetAlert2/sweetalert2.min.js"></script>
      <script src="assets/lib/bootstrap-5.3.2/js/bootstrap.js"></script>
      <script type="module" src="components/globals.js?x=<?=time()?>"></script>

      <script>
         // Buscador en tiempo real
         document.getElementById('inputSearchManual').addEventListener('keyup', function() {
            let filter = this.value.toLowerCase();
            let cards = document.querySelectorAll('#manualContent .doc-card');
            
            cards.forEach(card => {
               let text = card.textContent.toLowerCase();
               if(text.includes(filter)) {
                  card.style.display = '';
               } else {
                  card.style.display = 'none';
               }
            });
         });

         // Scroll Suave para los links del menú lateral
         document.querySelectorAll('#manualNav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
               e.preventDefault();
               document.querySelectorAll('#manualNav a').forEach(a => a.classList.remove('active'));
               this.classList.add('active');
               
               let targetId = this.getAttribute('href');
               let targetElement = document.querySelector(targetId);
               if (targetElement) {
                  window.scrollTo({
                     top: targetElement.offsetTop - 80,
                     behavior: 'smooth'
                  });
               }
            });
         });
      </script>
   </body>
</html>