<?php
   $nombreSistema = "NOVALIS";
   $slogan        = "Sistema de Información de Laboratorio (LIS) Integral";
   $logoUrl       = "webapp/assets/images/novalis_2_2.webp";
   
   // Configuración de contacto
   $whatsappPhone = "522280000000"; // Reemplazar con tu número real
   $correoContacto = "contacto@novalis.com";
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <link rel="shortcut icon" href="webapp/assets/images/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NOVALIS - Sistema de Información de Laboratorio Clínico (LIS)</title>
        <meta name="description" content="El LIS moderno para laboratorios clínicos que gestiona tu operación y te conecta con tus pacientes a través de tu propio portal web.">

        <link href="webapp/assets/lib/bootstrap-5.3.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="webapp/assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css" rel="stylesheet">
        <link href="webapp/assets/lib/sweetAlert2/sweetalert2.min.css" rel="stylesheet" />
        <link href="webapp/assets/css/styles.css?x=<?php echo time();?>" rel="stylesheet"/>
        <link href="webapp/assets/css/toast.css?x=<?php echo time();?>" rel="stylesheet"/>
        <link href="webapp/assets/css/styles_novalis.css?x=<?php echo time();?>" rel="stylesheet"/>

        <!-- Estilos Personalizados NOVALIS -->
        <style>
           
                        
        </style>
    </head>
    <body>
        <input type="hidden" id="csrfTokenPortal" value="<?php echo $_SESSION['csrfTokenPortal']; ?>">

        <!-- Header / Navbar -->
        <nav class="navbar navbar-expand-lg sticky-top navbar-custom py-2">
            <div class="container">
                <a class="navbar-brand d-flex align-items-center gap-2" href="#">
                    <img src="<?= htmlspecialchars($logoUrl) ?>" alt="<?= htmlspecialchars($nombreSistema) ?>" height="55" class="d-inline-block align-text-top">
                </a>
                
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarMain">
                    <ul class="navbar-nav ms-auto align-items-center gap-3 mt-3 mt-lg-0">
                        <li class="nav-item"><a class="nav-link fw-semibold" href="#inicio">Inicio</a></li>
                        <li class="nav-item"><a class="nav-link fw-semibold" href="#modulos">Módulos</a></li>
                        <li class="nav-item"><a class="nav-link fw-semibold" href="#diferenciadores">¿Por qué NOVALIS?</a></li>
                        <li class="nav-item"><a class="nav-link fw-semibold" href="#planes">Planes</a></li>
                        
                        <li class="nav-item ms-lg-2">
                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me interesa agendar una demo gratuita de NOVALIS') ?>" target="_blank" class="btn btn-outline-success rounded-pill px-3 py-2 btn-sm fw-bold">
                                <i class="bi bi-whatsapp me-1 fs-6"></i> Solicitar Demo
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section id="inicio" class="hero-section">
            <div class="container">
                <div class="row align-items-center gy-5">
                    
                    <div class="col-lg-7 text-center text-lg-start">
                        <span class="badge badge-portal mb-3 d-inline-block">SOFTWARE LIS PARA LABORATORIOS CLÍNICOS</span>
                        <h1 class="display-4 fw-extrabold text-dark mb-3 lh-sm">
                            La plataforma integral que <span class="text-brand-primary">moderniza</span> la operación de tu laboratorio
                        </h1>
                        <p class="lead text-muted mb-4 fs-5">
                            Administra órdenes, recepción, cajas y resultados de forma ágil, mientras le das a tus pacientes un portal web propio y una landing page que atrae nuevos clientes.
                        </p>
                        
                        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-4">
                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me gustaría agendar una demo de NOVALIS para mi laboratorio') ?>" target="_blank" class="btn btn-brand btn-lg fs-6">
                                <i class="bi bi-whatsapp me-2"></i> Agendar Demo Gratuita
                            </a>
                            <a href="#modulos" class="btn btn-brand-outline btn-lg fs-6">
                                <i class="bi bi-grid-3x3-gap me-2"></i> Ver Funcionalidades
                            </a>
                        </div>

                        <div class="row pt-4 border-top border-secondary border-opacity-25 text-start">
                           <div class="col-6 col-sm-3">
                              <div class="fw-bold text-primary-emphasis fs-5">+100%</div>
                              <div class="small text-muted">Órdenes ilimitadas</div>
                           </div>
                           <div class="col-6 col-sm-3">
                              <div class="fw-bold text-primary-emphasis fs-5">24/7</div>
                              <div class="small text-muted">Portal de Resultados</div>
                           </div>
                           <div class="col-6 col-sm-3">
                              <div class="fw-bold text-primary-emphasis fs-5">Multi-Sede</div>
                              <div class="small text-muted">Matriz y Tomas</div>
                           </div>
                           <div class="col-6 col-sm-3">
                              <div class="fw-bold text-primary-emphasis fs-5">Landing Page</div>
                              <div class="small text-muted">Incluye tu propia página</div>
                           </div>
                        </div>
                       
                    </div>

                    <div class="col-lg-5">
                        <div class="card border-0 rounded-4 shadow-lg p-4 bg-white position-relative">
                            <div class="text-center mb-4">
                                <div class="icon-wrapper mx-auto mb-3">
                                    <i class="bi bi-display"></i>
                                </div>
                                <h4 class="fw-bold text-dark mb-1">Prueba NOVALIS en vivo</h4>
                                <p class="text-muted small">Te mostramos el sistema adaptado a los formatos de tu laboratorio en una breve llamada de 15 min.</p>
                            </div>

                            <div class="bg-light p-3 rounded-3 mb-4">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-shield-check text-primary me-2"></i>
                                    <span class="small fw-bold text-dark">Sin contratos forzosos</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-headset text-primary me-2"></i>
                                    <span class="small fw-bold text-dark">Soporte y acompañamiento directo</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-rocket-takeoff text-primary me-2"></i>
                                    <span class="small fw-bold text-dark">Implementación rápida</span>
                                </div>
                            </div>

                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, quiero agendar una demostración en vivo de NOVALIS') ?>" target="_blank" class="btn btn-success btn-lg w-100 fw-bold py-3">
                                <i class="bi bi-whatsapp me-2"></i> Contactar por WhatsApp
                            </a>
                            <p class="text-center text-muted small mt-3 mb-0">O escríbenos a: <a href="mailto:<?= $correoContacto ?>" class="text-decoration-none fw-semibold"><?= $correoContacto ?></a></p>
                        </div>
                    </div>

                </div>
            </div>
        </section>


        <!-- Sección: Flujo Operativo Simplificado (Workflow) -->
        <section id="workflow" class="bg-gradient-portal position-relative overflow-hidden">
            <div class="container py-4">
                <!-- Encabezado de Sección -->
                <div class="text-center max-w-xl mx-auto mb-5">
                    <span class="badge badge-portal px-3 py-2 text-uppercase fw-semibold mb-2">Flujo de Trabajo</span>
                    <h2 class="fw-bold text-dark-blue display-6 mb-3">Del paciente a la validación en 4 pasos</h2>
                    <p class="text-muted fs-6">Procesos optimizados para reducir tiempos de espera y eliminar errores de captura.</p>
                </div>

                <!-- Pasos del Flujo -->
                <div class="row g-4 position-relative">
                    <!-- Paso 1 -->
                    <div class="col-md-6 col-lg-3">
                        <div class="card-step p-4 h-100 position-relative shadow-sm border-0 rounded-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="step-badge">01</span>
                                <div class="icon-shape bg-primary-subtle text-primary rounded-3 p-2">
                                    <i class="bi bi-person-plus-fill fs-4"></i>
                                </div>
                            </div>
                            <h5 class="fw-bold text-dark mb-2">1. Registro & Cobro</h5>
                            <p class="text-muted small mb-0">Alta de orden express, cobro en caja con diversos métodos e impresión de tickets.</p>
                        </div>
                    </div>

                    <!-- Paso 2 -->
                    <div class="col-md-6 col-lg-3">
                        <div class="card-step p-4 h-100 position-relative shadow-sm border-0 rounded-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="step-badge">02</span>
                                <div class="icon-shape bg-info-subtle text-info rounded-3 p-2">
                                    <i class="bi bi-upc-scan fs-4"></i>
                                </div>
                            </div>
                            <h5 class="fw-bold text-dark mb-2">2. Recepción & Etiquetado</h5>
                            <p class="text-muted small mb-0">Recepciona las muestras y genera etiquetas con códigos de barras para identificar fácilmente cada estudio y mantener el control de las órdenes.</p>
                        </div>
                    </div>

                    <!-- Paso 3 -->
                    <div class="col-md-6 col-lg-3">
                        <div class="card-step p-4 h-100 position-relative shadow-sm border-0 rounded-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="step-badge">03</span>
                                <div class="icon-shape bg-primary-subtle text-primary rounded-3 p-2">
                                    <i class="bi bi-file-earmark-medical-fill fs-4"></i>
                                </div>
                            </div>
                            <h5 class="fw-bold text-dark mb-2">3. Gestión de Resultados</h5>
                            <p class="text-muted small mb-0">Bandejas operativas para organizar las órdenes, adjuntar resultados en PDF y gestionar su publicación.</p>
                        </div>
                    </div>

                    <!-- Paso 4 -->
                    <div class="col-md-6 col-lg-3">
                        <div class="card-step p-4 h-100 position-relative shadow-sm border-0 rounded-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="step-badge">04</span>
                                <div class="icon-shape bg-success-subtle text-success rounded-3 p-2">
                                    <i class="bi bi-cloud-check-fill fs-4"></i>
                                </div>
                            </div>
                            <h5 class="fw-bold text-dark mb-2">4. Entrega Digital</h5>
                            <p class="text-muted small mb-0">Publica los resultados para que el paciente pueda consultarlos en la plataforma o recibirlos directamente por correo electrónico.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        

        <!-- Módulos Operativos -->
        <section id="modulos" class="py-5 bg-white">
            <div class="container py-4">
                <div class="text-center max-w-xl mx-auto mb-5">
                    <span class="badge badge-portal mb-2">MÓDULOS DE SISTEMA</span>
                    <h2 class="fw-bold text-dark">Todo lo que tu laboratorio necesita para operar</h2>
                    <p class="text-muted">Diseñado para simplificar la atención en recepción, el área analítica y la administración.</p>
                </div>

                <div class="row g-4">
                    <div class="col-md-6 col-lg-4">
                        <div class="card card-feature p-4 h-100">
                            <div class="icon-wrapper mb-3"><i class="bi bi-receipt-cutoff"></i></div>
                            <h5 class="fw-bold text-dark mb-2">Recepción y Caja</h5>
                            <p class="text-muted small mb-0">Registro rápido de órdenes, cobros con múltiples formas de pago, cortes de caja dinámicos y arqueos en tiempo real.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card card-feature p-4 h-100">
                            <div class="icon-wrapper mb-3"><i class="bi bi-journal-medical"></i></div>
                            <h5 class="fw-bold text-dark mb-2">Bandejas Operativas</h5>
                            <p class="text-muted small mb-0">Captura eficiente de resultados, validación por estatus, generación e impresión de etiquetas para tubos de muestra.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card card-feature p-4 h-100">
                            <div class="icon-wrapper mb-3"><i class="bi bi-send-check"></i></div>
                            <h5 class="fw-bold text-dark mb-2">Entrega Digital de Resultados</h5>
                            <p class="text-muted small mb-0">Adjunta y envía resultados en PDF, o permite que tus pacientes los consulten directamente en la plataforma.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card card-feature p-4 h-100">
                            <div class="icon-wrapper mb-3"><i class="bi bi-bar-chart-line"></i></div>
                            <h5 class="fw-bold text-dark mb-2">Reportes y Rentabilidad</h5>
                            <p class="text-muted small mb-0">Análisis detallado de flujo de efectivo, cuentas por cobrar, estudios más vendidos, rendimiento de clientes y auditoría de cancelaciones.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card card-feature p-4 h-100">
                            <div class="icon-wrapper mb-3"><i class="bi bi-building"></i></div>
                            <h5 class="fw-bold text-dark mb-2">Gestión de Convenios</h5>
                            <p class="text-muted small mb-0">Listas de precios y descuentos especiales configurables para empresas, doctores remitentes y laboratorios maquiladores.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card card-feature p-4 h-100">
                            <div class="icon-wrapper mb-3"><i class="bi bi-diagram-3"></i></div>
                            <h5 class="fw-bold text-dark mb-2">Multi-Sucursal Integrado</h5>
                            <p class="text-muted small mb-0">Administra matrices y tomas de muestra centralizando la información de pacientes, usuarios y catálogos en un solo lugar.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Diferenciador Clave: La Landing Page -->
        <section id="diferenciadores" class="py-5" style="background-color: #f1f5f9;">
            <div class="container py-4">
                <div class="row align-items-center gy-5">
                    <div class="col-lg-6">
                        <span class="badge badge-portal mb-2">VENTAJA EXCLUSIVA DE NOVALIS</span>
                        <h2 class="fw-bold text-dark mb-3">Tu laboratorio con presencia web profesional desde el primer día</h2>
                        <p class="text-muted mb-4">
                            A diferencia de otros sistemas que solo te dan una pantalla interna, NOVALIS te incluye tu **Landing Page propia** pública. Un canal digital listo para proyectar tu marca y atender a tus pacientes.
                        </p>

                        <div class="d-flex flex-column gap-3">
                            <div class="d-flex align-items-start gap-3 bg-white p-3 rounded-3 border">
                                <div class="icon-wrapper flex-shrink-0" style="width:45px; height:45px; font-size:1.2rem;"><i class="bi bi-globe"></i></div>
                                <div>
                                    <h6 class="fw-bold text-dark mb-1">Portal de Consulta de Resultados</h6>
                                    <p class="small text-muted mb-0">Tus pacientes y médicos convenidos acceden a sus resultados en PDF ingresando su folio y clave de forma segura.</p>
                                </div>
                            </div>

                            <div class="d-flex align-items-start gap-3 bg-white p-3 rounded-3 border">
                                <div class="icon-wrapper flex-shrink-0" style="width:45px; height:45px; font-size:1.2rem;"><i class="bi bi-stars"></i></div>
                                <div>
                                    <h6 class="fw-bold text-dark mb-1">Promociones y Servicios Visibles</h6>
                                    <p class="small text-muted mb-0">Muestra tus paquetes preventivos, catálogo de servicios, horarios de atención y sucursales.</p>
                                </div>
                            </div>

                            <div class="d-flex align-items-start gap-3 bg-white p-3 rounded-3 border">
                                <div class="icon-wrapper flex-shrink-0" style="width:45px; height:45px; font-size:1.2rem;"><i class="bi bi-whatsapp"></i></div>
                                <div>
                                    <h6 class="fw-bold text-dark mb-1">Enlace Directo a WhatsApp</h6>
                                    <p class="small text-muted mb-0">Botón directo para que los visitantes te contacten o coticen estudios al instante.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 text-center">
                        <div class="p-4 bg-white rounded-4 shadow border text-start">
                            <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                                <div class="d-flex align-items-center gap-2">
                                    <div class="bg-danger rounded-circle" style="width:12px; height:12px;"></div>
                                    <div class="bg-warning rounded-circle" style="width:12px; height:12px;"></div>
                                    <div class="bg-success rounded-circle" style="width:12px; height:12px;"></div>
                                </div>
                                <span class="small text-muted font-monospace">tulaboratorio.novalis.com</span>
                            </div>
                            <div class="p-3 bg-light rounded-3 text-center py-5">
                                <i class="bi bi-laptop display-1 text-brand-accent"></i>
                                <h5 class="fw-bold text-dark mt-3">Tu Marca + Sistema LIS</h5>
                                <p class="small text-muted">Una sola solución integral para la gestión interna y la cara pública de tu laboratorio.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sección de Planes -->
        <section id="planes" class="py-5 bg-white">
            <div class="container py-4">
                <div class="text-center max-w-xl mx-auto mb-5">
                    <span class="badge badge-portal mb-2">PLANES Y PRECIOS</span>
                    <h2 class="fw-bold text-dark">Precios transparentes adaptados a tu escala</h2>
                    <p class="text-muted">Sin costos ocultos por volumen de pacientes ni cobros por orden procesada.</p>
                </div>

                <div class="row g-4 justify-content-center align-items-stretch">
                    
                    <!-- Plan Básico -->
                    <div class="col-md-6 col-lg-5">
                        <div class="card card-plan p-4 h-100 d-flex flex-column">
                            <div class="mb-3">
                                <span class="badge bg-light text-secondary border fw-bold px-3 py-2 rounded-pill">PLAN INICIAL</span>
                            </div>
                            <h4 class="fw-bold text-dark mb-2">Básico / Matriz</h4>
                            <p class="text-muted small">Ideal para laboratorios independientes que buscan agilizar su operación diaria.</p>
                            
                            <div class="my-3">
                                <span class="display-5 fw-extrabold text-dark">$799</span>
                                <span class="text-muted">MXN / mes</span>
                            </div>

                            <ul class="list-unstyled small mb-4 flex-grow-1">
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-lg text-success fs-5 me-2"></i> <strong>1 Sucursal / Matriz</strong></li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-lg text-success fs-5 me-2"></i> Órdenes y pacientes  <strong>ilimitados</strong></li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-lg text-success fs-5 me-2"></i> Módulos completos (Recepción, Caja, Resultados y más)</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-lg text-success fs-5 me-2"></i> Envío de resultados por correo electrónico</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-lg text-success fs-5 me-2"></i> Impresión de etiquetas para tubos</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-lg text-success fs-5 me-2"></i> Landing Page pública estática inicial</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-lg text-success fs-5 me-2"></i> Portal web de consulta de resultados</li>
                            </ul>

                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me interesa contratar el Plan Básico de NOVALIS') ?>" target="_blank" class="btn btn-brand-outline w-100 py-2 fw-bold">
                                Solicitar Plan Básico
                            </a>
                        </div>
                    </div>

                    <!-- Plan Pro -->
                    <div class="col-md-6 col-lg-5">
                        <div class="card card-plan plan-featured p-4 h-100 d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="badge bg-brand-primary text-white fw-bold px-3 py-2 rounded-pill">RECOMENDADO</span>
                                <i class="bi bi-star-fill text-warning fs-5"></i>
                            </div>
                            <h4 class="fw-bold text-dark mb-2">Pro Multi-Sucursal</h4>
                            <p class="text-muted small">Para laboratorios con varias sedes que requieren control comercial y financiero activo.</p>
                            
                            <div class="my-3">
                                <span class="display-5 fw-extrabold text-brand-primary">$1,399</span>
                                <span class="text-muted">MXN / mes</span>
                            </div>

                            <ul class="list-unstyled small mb-4 flex-grow-1">
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-6 me-2"></i> <strong>Hasta 5 Sucursales incluidas</strong></li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-6 me-2"></i> Todo lo del Plan Básico</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-6 me-2"></i> <strong>Módulo de Autogestión de la Landing Page</strong> (Promociones y sucursales)</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-6 me-2"></i> Módulo completo de Rentabilidad, Flujo y Auditoría</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-6 me-2"></i> Gestión avanzada de Convenios y Empresas</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-6 me-2"></i> Sucursal adicional extra: +$300 MXN/mes</li>
                            </ul>

                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me interesa solicitar información del Plan Pro de NOVALIS') ?>" target="_blank" class="btn btn-brand w-100 py-2 fw-bold">
                                Solicitar Plan Pro
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer-brand py-5">
            <div class="container">
                <div class="row gy-4 align-items-center border-bottom border-slate-700 pb-4 mb-4">
                    <div class="col-md-6 text-center text-md-start">
                        <img src="webapp/assets/images/logo_text_blanco.webp" alt="<?= htmlspecialchars($nombreSistema) ?>" height="50" class="mb-2 d-block mx-auto mx-md-0">
                        <p class="small text-slate-400 mb-0"><?= htmlspecialchars($slogan) ?></p>
                    </div>
                    <div class="col-md-6 text-center text-md-end">
                        <p class="small text-slate-300 mb-1"><i class="bi bi-envelope me-2 text-brand-accent"></i><?= $correoContacto ?></p>
                        <p class="small text-slate-300 mb-0"><i class="bi bi-whatsapp me-2 text-success"></i>Atención directa vía WhatsApp</p>
                    </div>
                </div>

                <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p class="small text-slate-400 mb-0">&copy; <?= date('Y') ?> <?= htmlspecialchars($nombreSistema) ?>. Todos los derechos reservados.</p>
                    <p class="small text-slate-400 mb-0">Sistema de Información de Laboratorio Clínico</p>
                </div>
            </div>
        </footer>

        <!-- Botón Flotante de WhatsApp -->
        <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me interesa agendar una demo de NOVALIS') ?>" target="_blank" class="btn btn-success rounded-circle p-3 floating-wa-btn d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;" title="Hablar por WhatsApp">
            <i class="bi bi-whatsapp fs-2"></i>
        </a>

        <script src="webapp/assets/lib/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>
        <script src="webapp/assets/lib/jquery-3.7.1.min.js"></script>
        <script src="webapp/assets/lib/sweetAlert2/sweetalert2.min.js"></script>
    </body>
</html>