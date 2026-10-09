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
      <link rel="stylesheet" type="text/css" href="assets/css/styles_ayuda.css?x=<?php echo time();?>" />
      <link rel="stylesheet" href="assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
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
                     <a class="nav-link" href="#cap6"><i class="bi bi-tags me-2"></i>6. Precios, Sucursales, Usuarios y Descuentos</a>
                     <a class="nav-link" href="#cap7"><i class="bi bi-bar-chart-line me-2"></i>7. Reportes e Indicadores</a>
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
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 1: Introducción y Roles</h4>
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
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-shield-lock me-1"></i> Administrador</h6>
                           <p class="small text-secondary mb-0">Acceso total a finanzas, configuración de sucursales, usuarios, catálogos, listas de precios, descuentos y promociones del portal.</p>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3 border">
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-shield-lock me-1"></i> Gerencia</h6>
                           <p class="small text-secondary mb-0">Consulta de ordenes, bandejas operativas, reportes, gestión de pacientes, paquetes, estudios y convenios,.</p>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-3 bg-light rounded-3 border">
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-receipt me-1"></i> Recepción / Caja</h6>
                           <p class="small text-secondary mb-0">Registro de órdenes, cobro, abonos, cancelaciones, tickets y cortes de caja.</p>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-3 bg-light rounded-3 border">
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-file-earmark-pdf me-1"></i> Área Operativa / Químico</h6>
                           <p class="small text-secondary mb-0">Consulta de órdenes, subida de resultados en PDF, previsualización y notificación al cliente.</p>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-3 bg-light rounded-3 border">
                           <h6 class="fw-bold text-primary mb-1"><i class="bi bi-person-circle me-1"></i> Paciente / Convenio (Público)</h6>
                           <p class="small text-secondary mb-0">Consulta y descarga de reportes PDF desde el portal mediante folio de orden y clave web.</p>
                        </div>
                     </div>

                     <div class="col-12">
                        <p class="text-secondary small">Para garantizar la seguridad de la información y la integridad financiera del laboratorio, NOVALIS segmenta el acceso a sus 12 módulos principales según el perfil asignado a cada colaborador:</p>

                        <div class="table-responsive my-3">
                           <table class="table table-bordered table-striped align-middle small">
                              <thead class="table-dark">
                                 <tr>
                                    <th>Módulo / Función</th>
                                    <th class="text-center">Administrador</th>
                                    <th class="text-center">Gerente</th>
                                    <th class="text-center">Recepción / Caja</th>
                                    <th class="text-center">Químico / Analista</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <td class="fw-semibold">1. Recepción</td>
                                    <td class="text-center text-muted"><i class="bi bi-eye"></i> Consulta</td>
                                    <td class="text-center text-muted"><i class="bi bi-eye"></i> Consulta</td>
                                    <td class="text-center text-primary"><i class="bi bi-check-circle"></i> Registro / Cobro / Abonos</td>
                                    <td class="text-center text-muted"><i class="bi bi-eye"></i> Consulta</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">2. Bandejas Operativas</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">3. Reportes y Estadísticas</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">4. Gestión de Pacientes</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">5. Gestión de Convenios</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">6. Datos de Facturación</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">7. Estudios y Paquetes</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">8. Gestión Sucursales</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">9. Gestión de Usuarios</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">10. Listas de Precios</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">11. Descuentos Generales</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                                 <tr>
                                    <td class="fw-semibold">12. Gestión del Portal</td>
                                    <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i> Total</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                    <td class="text-center text-danger"><i class="bi bi-x-circle"></i> Sin Acceso</td>
                                 </tr>
                              </tbody>
                           </table>
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
                        <small class="text-muted">Inicio de sesión y seguridad en entorno Multi-Tenant</small>
                     </div>
                  </div>
                  <hr>

                  <h5 class="fw-bold text-dark">2.1 Identificación Dinámica por Cliente (Multi-Tenant)</h5>
                  <p class="text-secondary small">
                     NOVALIS opera bajo una arquitectura de aislamiento de datos. Al ingresar al subdominio o dominio asignado a su establecimiento (por ejemplo: <code>tulaboratorio.novalis.com</code>), la plataforma detecta automáticamente la identidad de la institución y establece la conexión exclusiva con su base de datos independiente.
                  </p>

                  <div class="alert alert-info d-flex align-items-center gap-3 my-3" role="alert">
                     <i class="bi bi-shield-check fs-3 text-info"></i>
                     <div class="small">
                        <strong>Privacidad y Aislamiento Garantizados:</strong> Ningún laboratorio comparte tablas ni registros de pacientes con otra institución. La sesión de trabajo se restringe al entorno específico de su subdominio.
                     </div>
                  </div>

                  <h5 class="fw-bold text-dark mt-4">2.2 Formulario y Flujo de Inicio de Sesión</h5>
                  <p class="text-secondary small">
                     Para ingresar a la consola operativa, siga el procedimiento estandarizado de autenticación:
                  </p>

                  <div class="row g-4 my-2">
                     <div class="col-md-6">
                        <div class="border rounded-3 p-3 bg-white shadow-sm">
                           <div class="text-center mb-3">
                              <span class="badge bg-dark mb-2">Simulación de Interfaz</span>
                              <h6 class="fw-bold m-0">Acceso a la Plataforma</h6>
                           </div>
                           
                           <div class="mb-3">
                              <label class="form-label small text-muted"><i class="bi bi-person me-1"></i> Usuario</label>
                              <input type="text" class="form-control form-control-sm" value="usuario_laboratorio" disabled>
                           </div>

                           <div class="mb-3">
                              <label class="form-label small text-muted"><i class="bi bi-lock me-1"></i> Contraseña</label>
                              <div class="input-group input-group-sm">
                                 <input type="password" class="form-control" value="************" disabled>
                                 <span class="input-group-text"><i class="bi bi-eye-slash"></i></span>
                              </div>
                           </div>

                           <div class="d-grid">
                              <button class="btn btn-dark btn-sm" disabled>Iniciar sesión</button>
                           </div>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="d-flex flex-column gap-2">
                           <div class="p-2 border rounded bg-light">
                              <strong class="d-block small text-dark"><i class="bi bi-1-circle text-primary me-1"></i> Captura de Credenciales:</strong>
                              <span class="small text-secondary">Ingrese el usuario asignado por el Administrador. El campo de texto ignora auto-correcciones para evitar errores tipográficos.</span>
                           </div>
                           <div class="p-2 border rounded bg-light">
                              <strong class="d-block small text-dark"><i class="bi bi-2-circle text-primary me-1"></i> Visibilidad de Contraseña:</strong>
                              <span class="small text-secondary">Utilice el icono de ojo (<i class="bi bi-eye"></i>) para alternar la visibilidad del texto y verificar los caracteres antes de enviar.</span>
                           </div>
                           <div class="p-2 border rounded bg-light">
                              <strong class="d-block small text-dark"><i class="bi bi-3-circle text-primary me-1"></i> Validación y Redirección:</strong>
                              <span class="small text-secondary">Al presionar <em>"Iniciar sesión"</em> o la tecla <code>Enter</code>, el sistema valida su rol y redirige al panel de control correspondiente a sus permisos.</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <h5 class="fw-bold text-dark mt-4">2.3 Mecanismos de Seguridad Operativa</h5>
                  <div class="row g-3">
                     <div class="col-md-4">
                        <div class="p-3 border rounded bg-light h-100">
                           <h6 class="fw-bold text-dark small mb-1"><i class="bi bi-shield-lock-fill text-danger me-1"></i> Tokens CSRF</h6>
                           <p class="small text-secondary mb-0">Cada intento de inicio de sesión valida un token único contra falsificación de peticiones en segundo plano.</p>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-3 border rounded bg-light h-100">
                           <h6 class="fw-bold text-dark small mb-1"><i class="bi bi-clock-history text-warning me-1"></i> Expiración de Sesión</h6>
                           <p class="small text-secondary mb-0">Las cookies de autenticación operan bajo políticas restrictivas para evitar su lectura mediante scripts externos.</p>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-3 border rounded bg-light h-100">
                           <h6 class="fw-bold text-dark small mb-1"><i class="bi bi-person-exclamation text-primary me-1"></i> Bloqueo por Permisos</h6>
                           <p class="small text-secondary mb-0">Si un usuario intenta ingresar a un módulo fuera de su perfil (ej. Recepción intentando ver Finanzas), el sistema bloquea el acceso.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Capítulo 3 -->
               <div class="doc-card" id="cap3">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-receipt-cutoff"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 3: Módulo de Recepción y Caja</h4>
                        <small class="text-muted">Gestión integral de registro de órdenes, cobros, abonos y control de caja</small>
                     </div>
                  </div>
                  <hr>

                  <p class="text-secondary small">
                     El módulo de Recepción está optimizado para alta velocidad en mostrador mediante una <strong>vista dividida (*Split-Screen*)</strong>: la sección izquierda (<code>col-9</code>) concentra la captura del paciente, estudios y cobranza, mientras que el panel derecho (<code>col-3</code>) funciona como un monitor dinámico de las órdenes del día y acceso a caja.
                  </p>

                  <h5 class="fw-bold text-dark mt-4">3.1 Distribución de la Pantalla Principal</h5>
                  <p class="text-secondary small">
                     La pantalla de Recepción implementa un diseño de pantalla dividida (<em>Split-Screen</em>) que equilibra la velocidad de captura con el control operativo continuo:
                  </p>

                  <div class="row g-3 my-2">
                     <!-- Columna Principal (col-9) -->
                     <div class="col-lg-7">
                        <div class="p-3 border rounded-3 bg-light h-100">
                           <h6 class="fw-bold text-primary small mb-2"><i class="bi bi-layout-two-columns me-1"></i> Área Operativa Principal (col-9)</h6>
                           <p class="small text-secondary mb-2">Zona dedicada a la captura de datos y creación acelerada de la orden de trabajo:</p>
                           <ul class="small text-secondary ps-3 mb-0">
                              <li class="mb-1"><strong>Barra de Búsqueda de Pacientes:</strong> Detección automática por Nombre o Teléfono y alta exprés de nuevos registros.</li>
                              <li class="mb-1"><strong>Catálogo Dinámico de Estudios y Paquetes:</strong> Búsqueda por código o nombre con sugerencias e indicaciones de ayuno.</li>
                              <li class="mb-1"><strong>Asignación Comercial:</strong> Aplicación de Convenios (Empresas/Doctores) y reglas de listas de precios.</li>
                              <li><strong>Lanzador de Modal de Cobranza:</strong> Configuración de urgencias, cargos extra, factura y liquidación de pago.</li>
                           </ul>
                        </div>
                     </div>

                     <!-- Panel Lateral Dinámico (col-3) ampliado -->
                     <div class="col-lg-5">
                        <div class="p-3 border rounded-3 bg-white border-primary border-opacity-25 shadow-sm h-100">
                           <h6 class="fw-bold text-dark small mb-2"><i class="bi bi-journal-text text-primary me-1"></i> Lateral Dinámico de Control (col-3)</h6>
                           <p class="small text-secondary mb-2">
                              Funciona como un monitor en tiempo real que enlista de forma predeterminada las <strong>órdenes del día</strong> y cuenta con un potente motor de búsqueda avanzada.
                           </p>
                           
                           <div class="border-top pt-2 mt-2">
                              <strong class="d-block small text-dark mb-1"><i class="bi bi-funnel text-primary me-1"></i> Búsqueda Avanzada Multi-Criterio:</strong>
                              <p class="small text-muted mb-2">Permite rastrear órdenes históricas o del turno aplicando filtros específicos:</p>
                              <div class="d-flex flex-wrap gap-1 mb-2">
                                 <span class="badge bg-light text-dark border">Día específico</span>
                                 <span class="badge bg-light text-dark border">Mes</span>
                                 <span class="badge bg-light text-dark border">Folio de Orden</span>
                                 <span class="badge bg-light text-dark border">Nombre del Paciente</span>
                                 <span class="badge bg-light text-dark border">Convenio / Empresa</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <!-- Subsección Detallada de Acciones en la Orden (col-3) -->
                  <div class="p-3 border rounded-3 bg-light my-3">
                     <h6 class="fw-bold text-dark small mb-2"><i class="bi bi-gear-fill me-1 text-primary"></i> Menú de Acciones Rápidas por Orden (Panel Lateral)</h6>
                     <p class="small text-secondary mb-3">
                        Cada orden mostrada en el listado del panel lateral cuenta con un menú interactivo de opciones directas para gestionar su flujo operativo sin abandonar la vista de recepción:
                     </p>

                     <div class="row g-2">
                        <div class="col-md-6 col-lg-4">
                           <div class="p-2 bg-white border rounded small h-100">
                              <strong class="text-dark d-block mb-1"><i class="bi bi-file-earmark-text text-primary me-1"></i> Resumen de la Orden (Vista Rápida)</strong>
                              <span class="text-muted d-block fs-7">Abre una ventana emergente con el desglose completo: datos del paciente, estudios solicitados, estatus de pago (Pagado/Saldo), estado analítico de la orden y lista de resultados PDF adjuntados hasta el momento.</span>
                           </div>
                        </div>

                        <div class="col-md-6 col-lg-4">
                           <div class="p-2 bg-white border rounded small h-100">
                              <strong class="text-dark d-block mb-1"><i class="bi bi-printer text-secondary me-1"></i> Reimpresión de Ticket</strong>
                              <span class="text-muted d-block fs-7">Genera e imprime nuevamente el comprobante de pago entregado al cliente con el desglose comercial, Folio de Orden y Clave Web de acceso al portal.</span>
                           </div>
                        </div>

                        <div class="col-md-6 col-lg-4">
                           <div class="p-2 bg-white border rounded small h-100">
                              <strong class="text-dark d-block mb-1"><i class="bi bi-tags text-info me-1"></i> Impresión de Etiquetas</strong>
                              <span class="text-muted d-block fs-7">Genera el archivo de impresión de etiquetas, con código de barras y datos del paciente para la rotulación de tubos y frascos de muestra correspondientes a la orden.</span>
                           </div>
                        </div>

                        <div class="col-md-6 col-lg-4">
                           <div class="p-2 bg-white border rounded small h-100">
                              <strong class="text-dark d-block mb-1"><i class="bi bi-cash-coin text-success me-1"></i> Registrar y Ver Abonos</strong>
                              <span class="text-muted d-block fs-7">Muestra la bitácora de pagos de la orden y despliega el formulario para capturar nuevos abonos a cuentas con saldo deudor, emitiendo su respectivo recibo.</span>
                           </div>
                        </div>

                        <div class="col-md-6 col-lg-4">
                           <div class="p-2 bg-white border rounded small h-100">
                              <strong class="text-dark d-block mb-1"><i class="bi bi-x-circle text-danger me-1"></i> Cancelar Orden</strong>
                              <span class="text-muted d-block fs-7">Inicia el protocolo de anulación de la orden. Solicita la captura del motivo justificado, ajusta el flujo de dinero en caja y notifica al módulo de auditoría.</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <h5 class="fw-bold text-dark mt-4">3.2 Flujo Detallado para Registro de Orden</h5>
                  <div class="d-flex flex-column gap-3 my-3">
                     
                     <div class="d-flex align-items-start gap-3 p-3 bg-white rounded-3 border shadow-sm">
                        <span class="step-badge flex-shrink-0">1</span>
                        <div class="w-100">
                           <h6 class="fw-bold text-dark mb-1">Identificación del Paciente</h6>
                           <p class="small text-secondary mb-2">Escriba el nombre del cliente en el buscador o seleccione su fecha de nacimiento:</p>
                           <div class="row g-2">
                              <div class="col-md-6">
                                 <div class="p-2 bg-light rounded border small">
                                    <strong class="text-dark"><i class="bi bi-search text-primary me-1"></i> Paciente Existente:</strong> Seleccione el registro de la lista desplegable. Se cargarán automáticamente sus datos de contacto y antecedentes.
                                 </div>
                              </div>
                              <div class="col-md-6">
                                 <div class="p-2 bg-light rounded border small">
                                    <strong class="text-dark"><i class="bi bi-person-plus text-success me-1"></i> Paciente Nuevo:</strong> Presione el botón <code>+ Nuevo</code>. Complete Nombre, Sexo, Fecha de Nacimiento y WhatsApp/Correo sin abandonar la pantalla.
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div class="d-flex align-items-start gap-3 p-3 bg-white rounded-3 border shadow-sm">
                        <span class="step-badge flex-shrink-0">2</span>
                        <div class="w-100">
                           <h6 class="fw-bold text-dark mb-1">
                              Selección del tipo de cliente: Particular o Convenio 
                              <span class="text-muted fs-8">(empresa, doctor o laboratorio)</span>
                           </h6>
                           <p class="small text-secondary mb-0">Si el paciente acude por cuenta de una empresa o convenio, selecciónelo del catálogo. El sistema reestructurará automáticamente los precios de lista y aplicará los porcentajes de descuento pactados.</p>
                        </div>
                     </div>

                     <div class="d-flex align-items-start gap-3 p-3 bg-white rounded-3 border shadow-sm">
                        <span class="step-badge flex-shrink-0">3</span>
                        <div class="w-100">
                           <h6 class="fw-bold text-dark mb-1">Carga de Análisis Clínicos y Perfiles</h6>
                           <p class="small text-secondary mb-2">Escriba el nombre del estudio/paquete en la barra de búsqueda y presione <code>Enter</code> o haga clic sobre el ítem:</p>
                           <div class="alert alert-warning py-2 px-3 small mb-0 d-flex align-items-center gap-2">
                              <i class="bi bi-exclamation-triangle-fill fs-5"></i>
                              <span><strong>Indicaciones Médicas:</strong> Al agregar estudios que requieran ayuno o preparación especial, el sistema mostrará una alerta visual con las instrucciones a confirmar con el paciente.</span>
                           </div>
                        </div>
                     </div>

                     <div class="d-flex align-items-start gap-3 p-3 bg-white rounded-3 border shadow-sm">
                        <span class="step-badge flex-shrink-0">4</span>
                        <div class="w-100">
                           <h6 class="fw-bold text-dark mb-1">Procesamiento de Pago y Registro (Modal de Confirmación)</h6>
                           <p class="small text-secondary mb-2">
                              Al presionar el botón de registro, se desplegará una ventana emergente (modal) con el desglose final de la orden para aplicar ajustes comerciales y registrar el cobro:
                           </p>
                           
                           <div class="row g-2 mb-3">
                              <div class="col-md-6">
                                 <div class="p-2 bg-light border rounded small">
                                    <strong class="text-dark"><i class="bi bi-percent me-1 text-primary"></i> Descuento Autorizado:</strong>
                                    <span class="d-block text-muted">Seleccione un descuento dentro de las opciones listadas.</span>
                                 </div>
                              </div>
                              <div class="col-md-6">
                                 <div class="p-2 bg-light border rounded small">
                                    <strong class="text-dark"><i class="bi bi-plus-circle me-1 text-warning"></i> Cargo Adicional:</strong>
                                    <span class="d-block text-muted">Añada un importe extraordinario (ej. servicio a domicilio, toma especial o viáticos).</span>
                                 </div>
                              </div>
                              <div class="col-md-6">
                                 <div class="p-2 bg-light border rounded small">
                                    <strong class="text-dark"><i class="bi bi-exclamation-octagon me-1 text-danger"></i> Marca de Urgencia:</strong>
                                    <span class="d-block text-muted">Active la casilla para priorizar los análisis en el área analítica y bandejar con alerta.</span>
                                 </div>
                              </div>                              
                              <div class="col-md-6">
                                 <div class="p-2 bg-light border rounded small">
                                    <strong class="text-dark"><i class="bi bi-receipt me-1 text-info"></i> Solicitud de Factura:</strong>
                                    <span class="d-block text-muted">Marque si el paciente requiere comprobante fiscal.</span>
                                 </div>
                              </div>
                           </div>

                           <h6 class="fw-bold text-dark small mb-1">Modalidades de Cobro en el Modal:</h6>
                           <div class="row g-2">
                              <div class="col-md-6">
                                 <div class="p-2 bg-light border rounded small">
                                    <strong class="text-dark"><i class="bi bi-cash me-1 text-success"></i> Pago Completo:</strong>
                                    <span class="d-block text-muted">Liquida el 100% de la orden. Habilita la entrega inmediata de resultados al ser publicados.</span>
                                 </div>
                              </div>
                              <div class="col-md-6">
                                 <div class="p-2 bg-light border rounded small">
                                    <strong class="text-dark"><i class="bi bi-piggy-bank me-1 text-warning"></i> Anticipo / Parcial:</strong>
                                    <span class="d-block text-muted">Registra el abono inicial. El remanente se envía automáticamente a <em>Cuentas por Cobrar</em>.</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>

                  <h5 class="fw-bold text-dark mt-4">3.3 Abonos a Saldos Pendientes</h5>
                  <p class="text-secondary small">Para recepcionar un pago de una orden registrada previamente con saldo deudor:</p>
                  <ol class="small text-secondary ps-3">
                     <li class="mb-1">Busque la orden en el panel lateral mediante el nombre o número de folio.</li>
                     <li class="mb-1">Haga clic en la opción <span class="badge bg-primary"><i class="bi bi-cash-stack"></i> Registrar Abono</span>.</li>
                     <li class="mb-1">Capture el importe ingresado y el método de pago recibido.</li>
                     <li>El sistema emitirá un <strong>Comprobante de Abono</strong> actualizando el saldo restante y la clave web del paciente.</li>
                  </ol>

                  <h5 class="fw-bold text-dark mt-4">3.4 Cancelación de Órdenes y Auditoría</h5>
                  <p class="text-secondary small">
                     Las cancelaciones requieren perfil de <strong>Gerente</strong> o <strong>Administrador</strong> o <strong>Recepción</strong>. Al cancelar una orden:
                  </p>
                  <div class="alert alert-danger d-flex align-items-center gap-3 py-2 px-3 small" role="alert">
                     <i class="bi bi-x-octagon-fill fs-4 flex-shrink-0"></i>
                     <div>
                        <strong>Control Financiero:</strong> El sistema solicita obligatoriamente el motivo de cancelación. Si la orden tuvo ingresos de caja, se genera un egreso/devolución que afectará el saldo final del turno y quedará registrado en el módulo de <strong>Auditoría</strong>.
                     </div>
                  </div>

                  <h5 class="fw-bold text-dark mt-4">3.5 Operación de Caja: Arqueo, Turno y Corte</h5>
                  <div class="table-responsive my-2">
                     <table class="table table-bordered table-striped align-middle small">
                        <thead class="table-dark">
                           <tr>
                              <th>Acción</th>
                              <th>Descripción Operativa</th>
                              <th>Frecuencia</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td class="fw-semibold text-dark"><i class="bi bi-box-arrow-in-right text-success me-1"></i> Apertura de Caja</td>
                              <td>Se declara el fondo o saldo inicial en efectivo para cambio al iniciar la jornada.</td>
                              <td>Al inicio del turno</td>
                           </tr>
                           <tr>
                              <td class="fw-semibold text-dark"><i class="bi bi-arrow-down-up text-primary me-1"></i> Entradas / Salidas Manuales</td>
                              <td>Registro de movimientos extraordinarios (ej. compra menor de insumos o ingreso diferido).</td>
                              <td>Según se requiera</td>
                           </tr>
                           <tr>
                              <td class="fw-semibold text-dark"><i class="bi bi-printer text-dark me-1"></i> Pre-Corte de Caja</td>
                              <td>Vista previa en pantalla de los totales cobrados desglosados por método de pago.</td>
                              <td>Consulta continua</td>
                           </tr>
                           <tr>
                              <td class="fw-semibold text-dark"><i class="bi bi-lock-fill text-danger me-1"></i> Cierre / Mi Corte de Caja</td>
                              <td>Consolidación final del turno. Imprime el reporte Z con desglose comercial y envía notificación al administrador.</td>
                              <td>Al finalizar el turno</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>

               <!-- Capítulo 4 -->
               <div class="doc-card" id="cap4">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-journal-medical"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 4: Bandejas Operativas y Resultados PDF</h4>
                        <small class="text-muted">Monitoreo analítico por estatus, gestión de archivos PDF y publicación de resultados</small>
                     </div>
                  </div>
                  <hr>

                  <p class="text-secondary small">
                     El módulo de Bandejas Operativas es el centro de trabajo para el área analítica y químicos. Permite monitorear el ciclo de vida de cada orden desde que ingresa al laboratorio hasta que los resultados son validados, adjuntados en formato PDF y notificados al cliente.
                  </p>

                  <h5 class="fw-bold text-dark mt-4">4.1 Organización por Pestañas de Estatus (Tabs)</h5>
                  <p class="text-secondary small">
                     Las órdenes se clasifican automáticamente en 5 pestañas principales según su avance operativo:
                  </p>

                  <div class="table-responsive my-2">
                     <table class="table table-bordered table-striped align-middle small">
                        <thead class="table-dark">
                           <tr>
                              <th style="width: 20%;">Pestaña / Estatus</th>
                              <th style="width: 50%;">Descripción Operativa</th>
                              <th style="width: 30%;">Acción Siguiente Esperada</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td><span class="badge bg-secondary"><i class="bi bi-clock me-1"></i> Pendientes</span></td>
                              <td>Órdenes registradas en recepción que aún no cuentan con ningún archivo PDF adjunto.</td>
                              <td>Adjuntar primer reporte de resultados en PDF.</td>
                           </tr>
                           <tr>
                              <td><span class="badge bg-warning text-dark"><i class="bi bi-hourglass-split me-1"></i> Resultados Parciales</span></td>
                              <td>Órdenes con al menos un PDF adjunto, pero que tienen estudios pendientes por procesar.</td>
                              <td>Subir PDFs faltantes para completar la orden.</td>
                           </tr>
                           <tr>
                              <td><span class="badge bg-info text-white"><i class="bi bi-check-circle me-1"></i> Órdenes Completadas</span></td>
                              <td>Órdenes con la totalidad de sus estudios adjuntados en PDF. Listas para revisión y liberación.</td>
                              <td>Publicar en portal y notificar al paciente.</td>
                           </tr>
                           <tr>
                              <td><span class="badge bg-success"><i class="bi bi-send-check me-1"></i> Publicadas / Entregadas</span></td>
                              <td>Resultados liberados para consulta pública en el portal web del paciente o convenio.</td>
                              <td>Consulta o reenvío de notificación si aplica.</td>
                           </tr>
                           <tr>
                              <td><span class="badge bg-danger"><i class="bi bi-x-circle me-1"></i> Canceladas</span></td>
                              <td>Órdenes anuladas desde recepción. Se mantienen visibles solo para fines de trazabilidad y auditoría.</td>
                              <td>Sin acción (Solo lectura de motivos).</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  <h5 class="fw-bold text-dark mt-4">4.2 Buscador de Órdenes en Bandeja</h5>
                  <p class="text-secondary small">
                     En el encabezado de las bandejas se ubica la barra de filtro dinámico que permite rastrear cualquier orden en tiempo real escribiendo su <strong>Folio de Orden</strong> o el <strong>Nombre del Paciente</strong>. El filtro se aplica de forma instantánea sobre la pestaña activa.
                  </p>

                  <h5 class="fw-bold text-dark mt-4">4.3 Menú de Acciones y Gestión de Resultados PDF</h5>
                  <p class="text-secondary small">
                     Cada orden mostrada en las bandejas incluye un panel de botones de acción para controlar la subida de documentos y los cambios de estado:
                  </p>

                  <div class="row g-3 my-2">
                     
                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-cloud-upload text-primary me-1"></i> 1. Gestión de Subida de Resultados PDF</h6>
                           <p class="small text-secondary mb-0">
                              Permite seleccionar y adjuntar uno o varios archivos PDF desde su equipo. Puede vincular cada PDF a un estudio específico o subir un archivo consolidado para toda la orden.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-file-earmark-pdf text-danger me-1"></i> 2. Previsualización de Resultados</h6>
                           <p class="small text-secondary mb-0">
                              Despliega un visor integrado con pestañas para inspeccionar cada archivo PDF adjuntado antes de publicarlo, garantizando que el documento corresponda al paciente sin necesidad de descargarlo.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-tag text-warning me-1"></i> 3. Cambio a "Resultados Parciales"</h6>
                           <p class="small text-secondary mb-0">
                              Si solo se han adjuntado parte de los estudios de la orden (ej. Biometría lista pero Copro en proceso), esta opción mueve la orden a la pestaña *Parciales* para informar a recepción del avance.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-check2-all text-info me-1"></i> 4. Cambio a "Orden Completada"</h6>
                           <p class="small text-secondary mb-0">
                              Marca la orden como terminada una vez que todos los PDFs han sido subidos y verificados. La orden se desplaza automáticamente al tab de *Completadas*.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-success mb-2"><i class="bi bi-send text-success me-1"></i> 5. Publicar y Notificar (Envío por Correo)</h6>
                           <p class="small text-secondary mb-0">
                              Cambia el estatus a <strong>Publicado</strong>, haciendo visible el estudio en el Portal Web. En la misma acción, abre el modal para enviar un <strong>correo electrónico automático al paciente</strong> con el enlace de consulta y sus claves de acceso.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-eye text-dark me-1"></i> 6. Ver Resumen General de la Orden</h6>
                           <p class="small text-secondary mb-0">
                              Abre una ventana emergente que muestra la ficha técnica completa: datos del paciente, estudios solicitados, estatus de pago, total abonado/pendiente y la bitácora de archivos adjuntados.
                           </p>
                        </div>
                     </div>

                  </div>

                  <div class="alert alert-info d-flex align-items-center gap-3 my-3" role="alert">
                     <i class="bi bi-info-circle-fill fs-4 flex-shrink-0"></i>
                     <div class="small">
                        <strong>Seguridad en Entregas:</strong> Una vez publicada una orden, el paciente puede consultar y descargar sus reportes en PDF las 24 horas del día introduciendo su Folio y Clave Web desde la cara pública del laboratorio.
                     </div>
                  </div>
               </div>

               <!-- Capítulo 5 -->
               <div class="doc-card" id="cap5">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-people"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 5: Catálogo de Pacientes y Convenios</h4>
                        <small class="text-muted">Administración de expedientes, convenios comerciales, datos fiscales y credenciales web</small>
                     </div>
                  </div>
                  <hr>

                  <p class="text-secondary small">
                     Este módulo centraliza el mantenimiento del padrón de pacientes y la red de convenios comerciales (Empresas, Doctores y Laboratorios Remitentes). Permite estructurar sus datos generales, asociar múltiples razones sociales para facturación y gestionar sus accesos de consulta al portal.
                  </p>

                  <h5 class="fw-bold text-dark mt-4">5.1 Catálogo de Pacientes (Búsqueda Inteligente y Anti-Duplicados)</h5>
                  <p class="text-secondary small">
                     Dada la alta densidad de registros que maneja un laboratorio clínico, el módulo de Pacientes implementa optimizaciones de rendimiento y validaciones de integridad:
                  </p>

                  <div class="row g-3 my-2">
                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-light h-100">
                           <h6 class="fw-bold text-primary small mb-2"><i class="bi bi-search me-1"></i> Búsqueda Previa Obligatoria</h6>
                           <p class="small text-secondary mb-0">
                              Al ingresar al módulo, <strong>no se despliega una lista vacía ni masiva</strong> para evitar la lentitud en el navegador. Es necesario ingresar al menos un parámetro de búsqueda (Nombre o Apellidos) para consultar los expedientes registrados.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-light h-100">
                           <h6 class="fw-bold text-warning-emphasis small mb-2"><i class="bi bi-shield-exclamation text-warning me-1"></i> Detector de Coincidencias (Anti-Duplicados)</h6>
                           <p class="small text-secondary mb-0">
                              Al dar de alta un nuevo paciente, el sistema evalúa en tiempo real coincidencias por <strong>Nombre, Apellidos o Fecha de Nacimiento</strong>. Si detecta un registro similar, mostrará un listado preventivo para verificar si el paciente ya existe antes de crearlo.
                           </p>
                        </div>
                     </div>
                  </div>

                  <h5 class="fw-bold text-dark mt-4">5.2 Catálogo de Convenios (Empresas, Doctores y Laboratorios)</h5>
                  <p class="text-secondary small">
                     A diferencia de los pacientes, el catálogo de convenios se despliega visualmente en un <strong>tablero de tarjetas (*Cards*)</strong> para una identificación ágil y clasificada por tipo de entidad:
                  </p>

                  <div class="row g-2 mb-3">
                     <div class="col-md-4">
                        <div class="p-2 border rounded bg-white text-center small shadow-sm">
                           <i class="bi bi-building fs-4 text-primary d-block mb-1"></i>
                           <strong class="text-dark">Empresas / Corporativos</strong>
                           <span class="d-block text-muted fs-7">Convenios de medicina del trabajo y exámenes periódicos.</span>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-2 border rounded bg-white text-center small shadow-sm">
                           <i class="bi bi-person-vcard fs-4 text-success d-block mb-1"></i>
                           <strong class="text-dark">Médicos Remitentes</strong>
                           <span class="d-block text-muted fs-7">Doctores con tarifa preferencial o seguimiento de pacientes.</span>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-2 border rounded bg-white text-center small shadow-sm">
                           <i class="bi bi-hospital fs-4 text-info d-block mb-1"></i>
                           <strong class="text-dark">Laboratorios Maquiladores</strong>
                           <span class="d-block text-muted fs-7">Unidades externas que derivan muestras al laboratorio.</span>
                        </div>
                     </div>
                  </div>

                  <h5 class="fw-bold text-dark mt-4">5.3 Acciones Disponibles por Registro (Pacientes y Convenios)</h5>
                  <p class="text-secondary small">
                     Cada registro mostrado en el catálogo (sea paciente o convenio) cuenta con las siguientes herramientas avanzadas de gestión:
                  </p>

                  <div class="row g-3 my-2">
                     
                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-receipt text-primary me-1"></i> 1. Gestión de Información de Facturación</h6>
                           <p class="small text-secondary mb-0">
                              Permite asociar <strong>una o múltiples Razones Sociales</strong> (RFC, Nombre/Razón Social, Regimen Fiscal, Código Postal y Uso de CFDI) a un mismo paciente o convenio. Se puede designar cuál actúa como predeterminada al expedir facturas en recepción.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-pencil-square text-warning me-1"></i> 2. Edición de Datos Generales</h6>
                           <p class="small text-secondary mb-0">
                              Actualización de teléfonos, correo electrónico, dirección, fecha de nacimiento, sexo o contacto de referencia en cualquier momento.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-key text-success me-1"></i> 3. Consulta y Actualización de Credenciales Web</h6>
                           <p class="small text-secondary mb-0">
                              El sistema genera automáticamente el <strong>Usuario / Clave Web</strong> para el acceso del paciente o convenio al portal. En esta opción se pueden visualizar las credenciales actuales o restablecer una nueva contraseña a solicitud del usuario.
                           </p>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <h6 class="fw-bold text-dark mb-2"><i class="bi bi-trash text-danger me-1"></i> 4. Eliminación de Registros</h6>
                           <p class="small text-secondary mb-0">
                              Permite dar de baja registros que no tengan órdenes asociadas o dependencias activas, garantizando la integridad de los historiales clínicos.
                           </p>
                        </div>
                     </div>

                  </div>
               </div>

               <!-- Capítulo 6 -->
               <div class="doc-card" id="cap6">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-tags"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 6: Precios, Sucursales, Usuarios y Descuentos</h4>
                        <small class="text-muted">Administración centralizada y parametrización comercial (Exclusivo Perfil Administrador)</small>
                     </div>
                  </div>
                  <hr>

                  <div class="alert alert-dark d-flex align-items-center gap-3 my-2" role="alert">
                     <i class="bi bi-shield-lock-fill fs-3 text-danger"></i>
                     <div class="small">
                        <strong>Restricción de Seguridad:</strong> Este módulo contiene la configuración estructural del laboratorio. Su acceso está reservado exclusivamente para usuarios con perfil de <strong>Administrador</strong>.
                     </div>
                  </div>

                  <!-- 6.1 Sucursales -->
                  <h5 class="fw-bold text-dark mt-4">6.1 Gestión de Sucursales</h5>
                  <p class="text-secondary small">
                     Módulo para registrar la matriz y unidades de toma de muestra del laboratorio. Cada sucursal se representa visualmente en formato de <strong>tarjeta (*Card*)</strong> indicando su Nombre Comercial, Dirección Física y Número Telefónico de atención.
                  </p>
                  <div class="p-3 bg-light rounded-3 border mb-3">
                     <strong class="d-block small text-dark mb-1"><i class="bi bi-globe2 text-primary me-1"></i> Integración con la Landing Page (Disponible en Plan Pro):</strong>
                     <span class="small text-secondary">Si su suscripción activa lo permite (Plan Pro), las sucursales dadas de alta en este catálogo alimentarán automáticamente la sección pública de contacto y ubicación dentro de la Landing Page del laboratorio, evitando la doble captura de datos.</span>
                  </div>

                  <!-- 6.2 Usuarios -->
                  <h5 class="fw-bold text-dark mt-4">6.2 Gestión de Usuarios y Accesos</h5>
                  <p class="text-secondary small">
                     Administración del personal operativo del laboratorio presentado en un tablero de tarjetas dinámicas. Cada usuario cuenta con las siguientes variables de control:
                  </p>
                  <div class="row g-2 mb-3">
                     <div class="col-md-4">
                        <div class="p-2 border rounded bg-white small">
                           <strong class="text-dark d-block"><i class="bi bi-person me-1 text-primary"></i> Datos Personales y Credenciales:</strong>
                           <span class="text-muted">Nombre completo, usuario de acceso, correo electrónico y contraseña.</span>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-2 border rounded bg-white small">
                           <strong class="text-dark d-block"><i class="bi bi-person-badge me-1 text-success"></i> Perfil de Acceso / Rol:</strong>
                           <span class="text-muted">Asignación de nivel (Administrador, Gerente, Recepción, Químico).</span>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="p-2 border rounded bg-white small">
                           <strong class="text-dark d-block"><i class="bi bi-building me-1 text-info"></i> Sucursal Adscrita:</strong>
                           <span class="text-muted">Sucursal base sobre la cual el usuario registrará sus operaciones y cortes.</span>
                        </div>
                     </div>
                  </div>

                  <!-- 6.3 Listas de Precios -->
                  <h5 class="fw-bold text-dark mt-4">6.3 Listas de Precios y Lógica de Herencia de Tarifas</h5>
                  <p class="text-secondary small">
                     Las listas de precios permiten definir tarifas preferenciales o acuerdos especiales para convenios. Las listas se administran en tarjetas donde se configura un <strong>Nombre</strong> y una <strong>Descripción</strong> explicativa.
                  </p>

                  <div class="alert alert-info py-2 px-3 small my-2">
                     <strong class="text-dark"><i class="bi bi-diagram-3-fill text-info me-1"></i> Lógica de Precios por Excepción (Fallback a Precio Base):</strong>
                     <p class="mb-0 text-secondary">Al registrar un estudio o paquete en el catálogo general, se le asigna su <strong>Precio Público Base</strong>. Las listas de precios personalizadas solo requieren almacenar los estudios que tendrán un costo modificado. Si al capturar una orden en Recepción se selecciona una lista que <em>no incluye</em> un estudio específico (ej. Biometría Hemática), el sistema cargará automáticamente el <strong>Precio Público Base</strong> de dicho estudio.</p>
                  </div>

                  <h6 class="fw-bold text-dark small mt-3 mb-2">Herramientas Operativas de la Lista de Precios:</h6>
                  <div class="row g-3 my-1">
                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <strong class="text-dark d-block mb-1"><i class="bi bi-plus-circle text-primary me-1"></i> Carga Individual de Estudios</strong>
                           <span class="small text-secondary d-block">Al agregar un estudio a la lista, el sistema sugiere el precio base predeterminado, permitiendo al administrador conservar dicho valor o sobrescribirlo con la nueva tarifa.</span>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <strong class="text-dark d-block mb-1"><i class="bi bi-download text-success me-1"></i> Importación Masiva con Precios Base</strong>
                           <span class="small text-secondary d-block">Puebla la lista seleccionada de forma instantánea clonando la totalidad del catálogo de estudios activos con sus precios públicos iniciales, listos para ajustes puntuales.</span>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <strong class="text-dark d-block mb-1"><i class="bi bi-percent text-warning me-1"></i> Actualización Masiva de Tarifas</strong>
                           <span class="small text-secondary d-block">Permite aplicar incrementos o decrementos porcentuales/fijos en lote sobre todos los ítems pertenecientes a la lista de precios activa.</span>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <strong class="text-dark d-block mb-1"><i class="bi bi-trash text-danger me-1"></i> Vaciar Lista de Precios</strong>
                           <span class="small text-secondary d-block">Elimina todos los ítems asociados a la lista de precios para reiniciar la configuración tarifaria desde cero.</span>
                        </div>
                     </div>
                  </div>

                  <!-- 6.4 Descuentos Generales -->
                  <h5 class="fw-bold text-dark mt-4">6.4 Gestión de Descuentos Generales</h5>
                  <p class="text-secondary small">
                     CRUD para definir la lista de descuentos estandarizados autorizados por la dirección. Al registrar un descuento, se establece su <strong>Nombre / Concepto</strong> (ej. <em>"Tercera Edad"</em>, <em>"Convenio Sindicato"</em>, <em>"Campaña Preventiva"</em>) y el <strong>Porcentaje de Descuento</strong> correspondiente.
                  </p>
                  <div class="p-2 border rounded bg-light small text-muted">
                     <i class="bi bi-check-circle-fill text-success me-1"></i> Estos descuentos se despliegan en el modal de liquidación de Recepción, permitiendo un control estricto sobre las rebajas que el personal de mostrador puede otorgar.
                  </div>
               </div>

               <!-- Capítulo 7 -->
               <div class="doc-card" id="cap7">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-bar-chart-line"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 7: Módulo de Reportes e Indicadores</h4>
                        <small class="text-muted">Generación de métricas financieras, arqueos de caja e inteligencia de negocio</small>
                     </div>
                  </div>
                  <hr>

                  <p class="text-secondary small">
                     El módulo de Reportes consolida la información transaccional y analítica del laboratorio. Ofrece tableros clasificados para auditar el flujo de efectivo, monitorear el saldo pendiente de cobro y evaluar la rentabilidad del catálogo de estudios y convenios comerciales.
                  </p>

                  <!-- Filtros generales de reporte -->
                  <div class="p-3 bg-light border rounded-3 my-3">
                     <h6 class="fw-bold text-dark small mb-2"><i class="bi bi-funnel-fill text-primary me-1"></i> Parametrización y Filtros de Consulta</h6>
                     <p class="small text-secondary mb-2">
                        Antes de consultar o exportar cualquier informe, el panel de control permite acotar la información mediante los siguientes parámetros generales:
                     </p>
                     <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-white text-dark border"><i class="bi bi-calendar-range text-primary me-1"></i> Rango de Fechas (Desde / Hasta)</span>
                        <span class="badge bg-white text-dark border"><i class="bi bi-building text-info me-1"></i> Sucursal (Todas o Específica)</span>
                        <span class="badge bg-white text-dark border"><i class="bi bi-handbag text-success me-1"></i> Convenio / Empresa</span>
                        <span class="badge bg-white text-dark border"><i class="bi bi-file-earmark-spreadsheet text-danger me-1"></i> Exportación a PDF / Excel</span>
                     </div>
                  </div>

                  <!-- Bloque 1: Financieros, Cajas y Cobranza -->
                  <h5 class="fw-bold text-dark mt-4 mb-3"><i class="bi bi-cash-coin text-success me-2"></i>7.1 Financieros, Cajas y Cobranza</h5>
                  
                  <div class="row g-3 my-1">
                     
                     <!-- Cortes y Arqueos -->
                     <div class="col-md-4">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <div class="d-flex align-items-center gap-2 mb-2">
                              <div class="p-2 bg-success bg-opacity-10 text-success rounded"><i class="bi bi-cash-stack fs-5"></i></div>
                              <h6 class="fw-bold text-dark mb-0">Cortes y Arqueos de Caja</h6>
                           </div>
                           <p class="small text-secondary mb-0">
                              Supervisión histórica de los cierres de turno. Compara el efectivo y voucher declarados por los cajeros contra lo calculado por el sistema, alertando discrepancias, faltantes o sobrantes.
                           </p>
                        </div>
                     </div>

                     <!-- Flujo Operativo de Dinero -->
                     <div class="col-md-4">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <div class="d-flex align-items-center gap-2 mb-2">
                              <div class="p-2 bg-primary bg-opacity-10 text-primary rounded"><i class="bi bi-arrow-left-right fs-5"></i></div>
                              <h6 class="fw-bold text-dark mb-0">Flujo Operativo de Dinero</h6>
                           </div>
                           <p class="small text-secondary mb-0">
                              Consolidado de ingresos reales por cobranza de órdenes (desglosado por Efectivo, Tarjeta y Transferencia), sumado o restado dinámicamente con los movimientos manuales de caja.
                           </p>
                        </div>
                     </div>

                     <!-- Cuentas por Cobrar -->
                     <div class="col-md-4">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <div class="d-flex align-items-center gap-2 mb-2">
                              <div class="p-2 bg-warning bg-opacity-10 text-warning-emphasis rounded"><i class="bi bi-wallet2 fs-5"></i></div>
                              <h6 class="fw-bold text-dark mb-0">Cuentas por Cobrar</h6>
                           </div>
                           <p class="small text-secondary mb-0">
                              Listado detallado de órdenes con saldo deudor o crédito pendiente por liquidar. Permite segmentar por paciente, sucursal o cartera de convenios para acciones de cobranza.
                           </p>
                        </div>
                     </div>

                  </div>

                  <!-- Bloque 2: Operativos y Análisis Comercial -->
                  <h5 class="fw-bold text-dark mt-4 mb-3"><i class="bi bi-graph-up-arrow text-primary me-2"></i>7.2 Operativos y Análisis Comercial</h5>

                  <div class="row g-3 my-1">
                     
                     <!-- Estudios y Rentabilidad -->
                     <div class="col-md-6 col-lg-3">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <div class="d-flex align-items-center gap-2 mb-2">
                              <div class="p-2 bg-info bg-opacity-10 text-info rounded"><i class="bi bi-pie-chart fs-5"></i></div>
                              <h6 class="fw-bold text-dark mb-0">Estudios y Rentabilidad</h6>
                           </div>
                           <p class="small text-secondary mb-0">
                              Ranking (*Top*) de estudios y paquetes con mayor demanda. Analiza el volumen producido vs los ingresos generados para medir el margen de utilidad del catálogo.
                           </p>
                        </div>
                     </div>

                     <!-- Rendimiento Clientes y Convenios -->
                     <div class="col-md-6 col-lg-3">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <div class="d-flex align-items-center gap-2 mb-2">
                              <div class="p-2 bg-secondary bg-opacity-10 text-dark rounded"><i class="bi bi-building-up fs-5"></i></div>
                              <h6 class="fw-bold text-dark mb-0">Rendimiento Clientes</h6>
                           </div>
                           <p class="small text-secondary mb-0">
                              Evaluación del comportamiento comercial de las empresas, doctores remitentes y clientes particulares. Muestra volumen de pacientes derivados y facturación aportada.
                           </p>
                        </div>
                     </div>

                     <!-- Análisis Demográfico de Pacientes -->
                     <div class="col-md-6 col-lg-3">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <div class="d-flex align-items-center gap-2 mb-2">
                              <div class="p-2 bg-success bg-opacity-10 text-success rounded"><i class="bi bi-people-fill fs-5"></i></div>
                              <h6 class="fw-bold text-dark mb-0">Análisis de Pacientes</h6>
                           </div>
                           <p class="small text-secondary mb-0">
                              Métricas demográficas del público atendido: distribución por grupos de edad, sexo y tasa de pacientes recurrentes para diseño de campañas preventivas.
                           </p>
                        </div>
                     </div>

                     <!-- Auditoría y Cancelaciones -->
                     <div class="col-md-6 col-lg-3">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <div class="d-flex align-items-center gap-2 mb-2">
                              <div class="p-2 bg-danger bg-opacity-10 text-danger rounded"><i class="bi bi-shield-exclamation fs-5"></i></div>
                              <h6 class="fw-bold text-dark mb-0">Auditoría y Cancelaciones</h6>
                           </div>
                           <p class="small text-secondary mb-0">
                              Monitoreo de seguridad transaccional: historial de descuentos especiales otorgados, cargos adicionales aplicados y análisis estadístico de motivos de cancelación.
                           </p>
                        </div>
                     </div>

                  </div>
               </div>

               <!-- Capítulo 8 -->
               <div class="doc-card" id="cap8">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="doc-header-icon"><i class="bi bi-browser-chrome"></i></div>
                     <div>
                        <h4 class="fw-bold mb-0 text-dark">Capítulo 8: Configuración del Portal y Landing Page</h4>
                        <small class="text-muted">Administración de canales de contacto, promociones públicas y despliegue estático</small>
                     </div>
                  </div>
                  <hr>

                  <div class="alert alert-primary d-flex align-items-center gap-3 my-2" role="alert">
                     <i class="bi bi-star-fill fs-4 flex-shrink-0"></i>
                     <div class="small">
                        <strong>Módulo Exclusivo Plan Pro:</strong> Las herramientas de parametrización de la Landing Page pública y sincronización dinámica están disponibles únicamente para suscripciones con el módulo comercial activo.
                     </div>
                  </div>

                  <p class="text-secondary small mt-3">
                     Este módulo permite personalizar los elementos comerciales y de atención directa al cliente presentados en la Landing Page institucional del laboratorio, garantizando la actualización en tiempo real sin requerir intervención de personal de desarrollo.
                  </p>

                  <!-- 8.1 Configuración de WhatsApp -->
                  <h5 class="fw-bold text-dark mt-4">8.1 Canal Directo de Atención (WhatsApp)</h5>
                  <p class="text-secondary small">
                     Permite actualizar el número telefónico corporativo configurado para la recepción de mensajes directos.
                  </p>
                  <div class="p-3 bg-light border rounded-3 mb-3">
                     <strong class="d-block small text-dark mb-1"><i class="bi bi-whatsapp text-success me-1"></i> Enlace Unificado de Contacto:</strong>
                     <span class="small text-secondary">
                        Al modificar este parámetro, el sistema reconfigura automáticamente todos los botones de acción rápida (*Call To Action*) repartidos en la Landing Page (encabezado, botón flotante de chat, cotizaciones y pie de página) hacia el nuevo número con la lada correspondiente.
                     </span>
                  </div>

                  <!-- 8.2 Gestión de Promociones -->
                  <h5 class="fw-bold text-dark mt-4">8.2 Catálogo de Promociones y Paquetes Públicos</h5>
                  <p class="text-secondary small">
                     Gestión de tarjetas promocionales destacadas en la página web para incentivar la venta directa de check-ups y paquetes preventivos. Al dar de alta o editar una promoción se capturan los siguientes campos:
                  </p>

                  <div class="row g-3 my-2">
                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <strong class="text-dark d-block small mb-1"><i class="bi bi-tag-fill text-primary me-1"></i> Categoría / Badge Distintivo:</strong>
                           <span class="small text-secondary d-block">
                              Etiqueta visual destacada para clasificar el segmento de salud. Opciones disponibles: 
                              <span class="badge bg-light text-dark border">Popular</span>
                              <span class="badge bg-light text-dark border">Preventivo</span>
                              <span class="badge bg-light text-dark border">Recomendado</span>
                              <span class="badge bg-light text-dark border">Escolar</span>
                              <span class="badge bg-light text-dark border">Infantil</span>
                              <span class="badge bg-light text-dark border">Mujer</span>
                              <span class="badge bg-light text-dark border">Hombre</span>
                              <span class="badge bg-light text-dark border">Adulto Mayor</span>
                           </span>
                        </div>
                     </div>

                     <div class="col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                           <strong class="text-dark d-block small mb-1"><i class="bi bi-card-heading text-info me-1"></i> Nombre y Tarifas Comercial:</strong>
                           <span class="small text-secondary d-block">
                              Definición del título de la oferta, <strong>Precio Original</strong> (mostrado como precio tachado) y <strong>Precio Promoción</strong> (tarifa con descuento aplicada).
                           </span>
                        </div>
                     </div>

                     <div class="col-md-12">
                        <div class="p-3 border rounded-3 bg-white shadow-sm">
                           <strong class="text-dark d-block small mb-1"><i class="bi bi-list-check text-success me-1"></i> Desglose de Estudios Incluidos:</strong>
                           <span class="small text-secondary d-block">
                              Listado viñetado de las pruebas clínicas integradas en la promoción para consulta clara del paciente antes de agendar o solicitar informes.
                           </span>
                        </div>
                     </div>
                  </div>

                  <!-- 8.3 Despliegue y Publicación por JSON -->
                  <h5 class="fw-bold text-dark mt-4">8.3 Compilador de Cambios (*Publicar Cambios*)</h5>
                  <p class="text-secondary small">
                     Para mantener la velocidad de carga de la Landing Page al máximo y no saturar la base de datos con peticiones por cada visitante, NOVALIS utiliza un mecanismo de <strong>generación de snapshots JSON</strong>.
                  </p>

                  <div class="card border-dark mb-3">
                     <div class="card-body bg-light">
                        <h6 class="fw-bold text-dark small mb-2"><i class="bi bi-lightning-charge-fill text-warning me-1"></i> Proceso de Publicación y Sincronización:</h6>
                        <ol class="small text-secondary mb-0 ps-3">
                           <li class="mb-1">Efectúe los cambios requeridos en el número de WhatsApp, precios, sucursales o promociones activos.</li>
                           <li class="mb-1">Presione el botón principal <span class="badge bg-dark"><i class="bi bi-cloud-arrow-up me-1"></i> Publicar Cambios</span>.</li>
                           <li class="mb-1">El sistema consultará la base de datos, extraerá las sucursales vigentes (Capítulo 6) y las promociones activas, y generará automáticamente un archivo comprimido <code>.json</code>.</li>
                           <li>La Landing Page consumirá al instante este archivo estático, desplegando la información actualizada con rendimiento ultra rápido de navegación.</li>
                        </ol>
                     </div>
                  </div>

                  <!-- Nota de arquitectura sobre servicios estáticos -->
                  <div class="p-2 border rounded bg-white small text-muted">
                     <i class="bi bi-info-circle-fill text-secondary me-1"></i> <strong>Nota de Arquitectura:</strong> El apartado de servicios institucionales (toma a domicilio, atención a empresas, estudios especiales) se mantiene en la plantilla base para garantizar consistencia operativa y velocidad de respuesta.
                  </div>
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
      <script src="assets/lib/bootstrap-5.3.2/js/bootstrap.js"></script>

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