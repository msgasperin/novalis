<?php
   session_start();
	$host = $_SERVER['HTTP_HOST'];
   $parts = explode('.', $host);
   // Si hay al menos 3 partes (ej. labxyz.novalis.com), tomamos el subdominio
   $subdominio = (count($parts) >= 3) ? $parts[0] : 'default';

	$logo    = "../".$_SESSION["logoUrl"];
	$favicon = "../".$_SESSION["favicon"];
?>
<!DOCTYPE html>
<html lang="es">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <title>:: <?= htmlspecialchars($_SESSION["nombreLab"] ?? 'NOVALIS') ?> - Ayuda Portal ::</title>

   <!-- CSS Locales del Proyecto -->
   <link rel="shortcut icon" href="<?= htmlspecialchars($favicon) ?>"/>
   <link rel="stylesheet" type="text/css" href="../webapp/assets/lib/bootstrap-5.3.2/css/bootstrap.css"/>   
   <link rel="stylesheet" type="text/css" href="../webapp/assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
   <link rel="stylesheet" type="text/css" href="assets/css/styles.css" />
</head>
<body>

   <div class="container-fluid py-4">
      <div class="row g-4">
         
         <!-- Navegación Lateral (Índice Rápido) -->
         <div class="col-lg-3 col-xl-2 d-none d-lg-block">
            <div class="position-sticky" style="top: 1rem;">
               <div class="p-3 bg-white rounded-3 border shadow-sm">
                  <h6 class="fw-bold text-dark mb-3"><i class="bi bi-compass me-2"></i>Ayuda Portal Web</h6>
                  <nav class="nav flex-column sidebar-nav">
                     <a class="nav-link active" href="#p-cap1"><i class="bi bi-shield-lock me-2"></i>1. Acceso y Perfiles</a>
                     <a class="nav-link" href="#p-cap2"><i class="bi bi-person-workspace me-2"></i>2. Módulo Pacientes</a>
                     <a class="nav-link" href="#p-cap3"><i class="bi bi-building me-2"></i>3. Módulo Convenios</a>
                  </nav>
               </div>
            </div>
         </div>

         <!-- Contenido Principal -->
         <div class="col-lg-9 col-xl-10">
            
            <!-- Banner Encabezado -->
            <div class="doc-card bg-primary text-white mb-4" >
               <div class="d-flex align-items-center gap-3">
                  <div class="p-3 bg-white bg-opacity-10 rounded-3 text-white fs-2"><i class="bi bi-journal-medical"></i></div>
                  <div>
                     <h3 class="fw-bold mb-1">Manual de Uso del Portal de Consulta de Resultados</h3>
                     <p class="mb-0 text-white-50 small">Guía de consulta para Pacientes y Convenios (Empresas, Doctores y Laboratorios)</p>
                  </div>
               </div>
            </div>

            <!-- CAPÍTULO 1 -->
            <div class="doc-card" id="p-cap1">
               <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="doc-header-icon"><i class="bi bi-shield-lock"></i></div>
                  <div>
                     <h5 class="fw-bold mb-0 text-dark">Capítulo 1: Autenticación y Credenciales de Ingreso</h5>
                     <small class="text-muted">Diferencias en los requerimientos de acceso según el tipo de usuario</small>
                  </div>
               </div>
               <hr>
               
               <p class="text-secondary small">
                  El portal web segmenta el tipo de inicio de sesión para garantizar la confidencialidad de los expedientes clínicos y adaptar las herramientas según el perfil que ingresa:
               </p>

               <div class="row g-3 my-2">
                  
                  <div class="col-md-6">
                     <div class="p-3 border rounded-3 bg-light h-100 shadow-sm">
                        <h6 class="fw-bold text-primary small mb-2"><i class="bi bi-person-badge me-1"></i> 1.1 Ingreso para Pacientes</h6>
                        <p class="small text-secondary mb-2">
                           Por normatividad de protección de datos de salud, el paciente requiere 3 datos de autenticación para consultar sus estudios:
                        </p>
                        <ul class="small text-secondary ps-3 mb-0">
                           <li class="mb-1"><strong>Usuario / Folio:</strong> Asignado dinámicamente en recepción.</li>
                           <li class="mb-1"><strong>Clave Web:</strong> Clave de acceso generada por el sistema.</li>
                           <li><strong>Fecha de Nacimiento:</strong> Mecanismo de validación de identidad.</li>
                        </ul>
                     </div>
                  </div>

                  <div class="col-md-6">
                     <div class="p-3 border rounded-3 bg-light h-100 shadow-sm">
                        <h6 class="fw-bold text-success small mb-2"><i class="bi bi-building-check me-1"></i> 1.2 Ingreso para Convenios (Empresas, Doctores y Laboratorios)</h6>
                        <p class="small text-secondary mb-2">
                           Las entidades corporativas y médicos de la red acceden con sus credenciales institucionales permanentes:
                        </p>
                        <ul class="small text-secondary ps-3 mb-0">
                           <li class="mb-1"><strong>Usuario Institucional:</strong> Identificador único del convenio.</li>
                           <li><strong>Contraseña / Clave:</strong> Contraseña de acceso al portal corporativo.</li>
                        </ul>
                     </div>
                  </div>

               </div>
            </div>

            <!-- CAPÍTULO 2 -->
            <div class="doc-card" id="p-cap2">
               <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="doc-header-icon"><i class="bi bi-person-workspace"></i></div>
                  <div>
                     <h5 class="fw-bold mb-0 text-dark">Capítulo 2: Consulta de Resultados para Pacientes</h5>
                     <small class="text-muted">Visualización de historial de órdenes, estatus analítico y descarga de reportes PDF</small>
                  </div>
               </div>
               <hr>

               <p class="text-secondary small">
                  Al autenticarse correctamente, el paciente accede directamente a su tablero personal con el listado completo de sus órdenes registradas en el laboratorio, **ordenadas cronológicamente de la más reciente a la más antigua**.
               </p>

               <h5 class="fw-bold text-dark mt-4">2.1 Estructura de las Tarjetas de Orden (*Cards*)</h5>
               <p class="text-secondary small">
                  Cada orden solicitada se presenta en una tarjeta independiente que contiene la siguiente ficha informativa:
               </p>

               <div class="row g-2 mb-3">
                  <div class="col-md-3">
                     <div class="p-2 border rounded bg-white text-center small shadow-sm">
                        <i class="bi bi-hash fs-4 text-primary d-block mb-1"></i>
                        <strong class="text-dark d-block">Folio de Orden</strong>
                        <span class="text-muted fs-7">Identificador de la atención</span>
                     </div>
                  </div>
                  <div class="col-md-3">
                     <div class="p-2 border rounded bg-white text-center small shadow-sm">
                        <i class="bi bi-person-vcard fs-4 text-info d-block mb-1"></i>
                        <strong class="text-dark d-block">Datos del Paciente</strong>
                        <span class="text-muted fs-7">Nombre y titular del expediente</span>
                     </div>
                  </div>
                  <div class="col-md-3">
                     <div class="p-2 border rounded bg-white text-center small shadow-sm">
                        <i class="bi bi-calendar-check fs-4 text-success d-block mb-1"></i>
                        <strong class="text-dark d-block">Fecha y Hora</strong>
                        <span class="text-muted fs-7">Registro exacto en recepción</span>
                     </div>
                  </div>
                  <div class="col-md-3">
                     <div class="p-2 border rounded bg-white text-center small shadow-sm">
                        <i class="bi bi-journal-check fs-4 text-warning d-block mb-1"></i>
                        <strong class="text-dark d-block">Estudios Solicitados</strong>
                        <span class="text-muted fs-7">Desglose de pruebas de la orden</span>
                     </div>
                  </div>
               </div>

               <h5 class="fw-bold text-dark mt-4">2.2 Estado de Liberación y Descarga</h5>
               <p class="text-secondary small">
                  El botón de acción o mensaje dentro de la tarjeta varía automáticamente según el avance en el laboratorio:
               </p>

               <div class="row g-3 my-1">
                  <div class="col-md-6">
                     <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                        <div class="d-flex align-items-center gap-2 mb-2">
                           <span class="badge bg-warning text-dark"><i class="bi bi-clock-history me-1"></i> Pendiente / En Proceso</span>
                        </div>
                        <p class="small text-secondary mb-0">
                           Si la orden o alguno de sus estudios aún se encuentra en análisis por el área química, la tarjeta mostrará un mensaje notificando que los resultados están en proceso de validación.
                        </p>
                     </div>
                  </div>

                  <div class="col-md-6">
                     <div class="p-3 border rounded-3 bg-white h-100 shadow-sm">
                        <div class="d-flex align-items-center gap-2 mb-2">
                           <span class="badge bg-success"><i class="bi bi-file-earmark-pdf me-1"></i> Descargar Resultados</span>
                        </div>
                        <p class="small text-secondary mb-0">
                           Cuando los estudios son liberados y publicados por el laboratorio, se habilita este botón que despliega un **visualizador integrado** para examinar e imprimir todos los archivos PDF adjuntos a la orden.
                        </p>
                     </div>
                  </div>
               </div>

               <h5 class="fw-bold text-dark mt-4">2.3 Buscador en Tiempo Real</h5>
               <p class="text-secondary small">
                  En la esquina superior derecha del panel se ubica la barra de filtro dinámico que permite acotar las tarjetas del historial escribiendo el **Folio de la Orden** o el **Nombre del Estudio**.
               </p>
            </div>

            <!-- CAPÍTULO 3 -->
            <div class="doc-card" id="p-cap3">
               <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="doc-header-icon"><i class="bi bi-building"></i></div>
                  <div>
                     <h5 class="fw-bold mb-0 text-dark">Capítulo 3: Panel de Monitoreo para Convenios</h5>
                     <small class="text-muted">Consulta filtrada de órdenes para Empresas, Doctores Remitentes y Laboratorios</small>
                  </div>
               </div>
               <hr>

               <p class="text-secondary small">
                  El módulo de convenios presenta la misma interfaz basada en tarjetas (*Cards*) explicada en el capítulo anterior, pero incorpora **mecanismos avanzados de filtrado por rango de fechas y parámetros globales** para gestionar grandes volúmenes de pacientes.
               </p>

               <h5 class="fw-bold text-dark mt-4">3.1 Reglas de Filtrado y Rango Operativo</h5>
               <p class="text-secondary small">
                  Para preservar la velocidad de la plataforma y evitar sobrecargar las consultas, el panel aplica las siguientes reglas de negocio:
               </p>

               <div class="p-3 bg-light rounded-3 border mb-3">
                  <ul class="small text-secondary mb-0 ps-3">
                     <li class="mb-2">
                        <strong>Límite Máximo de Periodo (30 Días):</strong> Se puede seleccionar cualquier rango de fechas en el calendario (Desde / Hasta), siempre y cuando el periodo consultado <strong>no supere los 30 días continuos</strong>.
                     </li>
                     <li class="mb-2">
                        <strong>Búsqueda por Rango de Fecha:</strong> Si el campo de texto (Paciente / Folio) se encuentra vacío, el botón <span class="badge bg-primary"><i class="bi bi-funnel me-1"></i> Filtrar</span> recuperará todas las órdenes registradas dentro del intervalo seleccionado.
                     </li>
                     <li>
                        <strong>Búsqueda Prioritaria por Paciente o Folio (Global):</strong> Si se ingresa el <strong>Nombre de un Paciente</strong> o un <strong>Folio específico</strong> en el campo de búsqueda, el sistema omitirá la restricción de fechas y buscará la coincidencia en **todo el historial histórico** registrado para el convenio.
                     </li>
                  </ul>
               </div>

               <h5 class="fw-bold text-dark mt-4">3.2 Acciones Disponibles en Convenios</h5>
               <p class="text-secondary small">
                  Al igual que en el perfil del paciente, las empresas o doctores pueden supervisar el estatus de sus pacientes derivados, verificar las órdenes en proceso y abrir el visor para **descargar, guardar o imprimir los PDFs oficiales** en cuanto sean publicados por el laboratorio.
               </p>
            </div>

         </div>
      </div>
   </div>

   <!-- Scripts Locales del Proyecto -->
   <script src="../webapp/assets/lib/jquery-3.7.1.min.js"></script>
   <script src="../webapp/assets/lib/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>

   <script>
      document.addEventListener('DOMContentLoaded', function() {
         // Seleccionamos todos los enlaces de la navegación lateral
         const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

         navLinks.forEach(link => {
            link.addEventListener('click', function() {
               // Removemos la clase 'active' de todos los enlaces
               navLinks.forEach(item => item.classList.remove('active'));
               
               // Agregamos la clase 'active' únicamente al enlace cliqueado
               this.classList.add('active');
            });
         });
      });
   </script>
</body>
</html>