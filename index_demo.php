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
        <title>NOVALIS - LIS de Nueva Generación para Laboratorios Clínicos</title>
        <meta name="description" content="El LIS moderno para laboratorios clínicos que gestiona tu operación y te conecta con tus pacientes a través de tu propio portal web.">

        <link href="webapp/assets/lib/bootstrap-5.3.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="webapp/assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css" rel="stylesheet">
        <link href="webapp/assets/lib/sweetAlert2/sweetalert2.min.css" rel="stylesheet" />
        <link href="webapp/assets/css/styles.css?x=<?php echo time();?>" rel="stylesheet"/>
        <link href="webapp/assets/css/toast.css?x=<?php echo time();?>" rel="stylesheet"/>

        <!-- Estilos Personalizados - Idea 2: Sci-Tech Dark Premium -->
        <style>
            @font-face {
                font-family: "Plus Jakarta Sans";
                src: url("webapp/assets/css/fuentes/Plus_Jakarta_Sans/PlusJakartaSans-Regular.ttf") format("truetype");
            }

            :root {
                --bg-main: #080c14;
                --bg-card: #0f172a;
                --brand-primary: #38bdf8;
                --brand-accent: #00f2fe;
                --brand-glow: rgba(0, 242, 254, 0.15);
                --text-main: #f8fafc;
                --text-muted: #94a3b8;
                --font-main: 'Plus Jakarta Sans', sans-serif;
            }

            body {
                font-family: var(--font-main);
                color: var(--text-main);
                background-color: var(--bg-main);
                overflow-x: hidden;
            }

            .navbar-custom {
                background: rgba(8, 12, 20, 0.85);
                backdrop-filter: blur(16px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }

            .nav-link {
                color: #cbd5e1 !important;
                transition: color 0.3s ease;
            }
            .nav-link:hover {
                color: var(--brand-accent) !important;
            }

            .btn-glow {
                background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
                border: none;
                color: #ffffff;
                font-weight: 700;
                padding: 0.8rem 1.8rem;
                border-radius: 12px;
                box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
                transition: all 0.3s ease;
            }
            .btn-glow:hover {
                box-shadow: 0 0 30px rgba(6, 182, 212, 0.7);
                transform: translateY(-2px);
                color: #ffffff;
            }

            .btn-outline-glow {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(56, 189, 248, 0.4);
                color: #38bdf8;
                font-weight: 600;
                padding: 0.8rem 1.8rem;
                border-radius: 12px;
                transition: all 0.3s ease;
            }
            .btn-outline-glow:hover {
                background: rgba(56, 189, 248, 0.1);
                border-color: var(--brand-accent);
                color: #ffffff;
                transform: translateY(-2px);
            }

            .hero-section {
                padding: 100px 0 80px 0;
                background: radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15) 0%, rgba(8, 12, 20, 1) 70%);
                position: relative;
            }

            .badge-tech {
                background: rgba(56, 189, 248, 0.1);
                color: var(--brand-accent);
                border: 1px solid rgba(56, 189, 248, 0.3);
                font-size: 0.8rem;
                font-weight: 700;
                letter-spacing: 1px;
                padding: 6px 16px;
                border-radius: 50px;
            }

            /* Tarjetas Oscuras Tech */
            .card-tech {
                background: #0f172a;
                border: 1px solid rgba(255, 255, 255, 0.07);
                border-radius: 20px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .card-tech:hover {
                border-color: rgba(6, 182, 212, 0.5);
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--brand-glow);
            }

            .icon-box-tech {
                width: 50px;
                height: 50px;
                border-radius: 12px;
                background: linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(6, 182, 212, 0.05) 100%);
                border: 1px solid rgba(56, 189, 248, 0.3);
                color: var(--brand-accent);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
            }

            /* Mockup de Sistema simulado */
            .system-preview-frame {
                background: #0f172a;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 18px;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            }
            .preview-header {
                background: #1e293b;
                padding: 12px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }

            /* Workflow Step Badges */
            .step-number {
                width: 32px;
                height: 32px;
                background: var(--brand-accent);
                color: #080c14;
                font-weight: 800;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.9rem;
            }

            .floating-wa-btn {
                position: fixed;
                bottom: 25px;
                right: 25px;
                z-index: 999;
                box-shadow: 0 0 20px rgba(37, 211, 102, 0.5);
                transition: all 0.3s ease;
            }
            .floating-wa-btn:hover {
                transform: scale(1.1);
            }
        </style>
    </head>
    <body>
        <input type="hidden" id="csrfTokenPortal" value="<?php echo $_SESSION['csrfTokenPortal']; ?>">

        <!-- Navbar estilo Dark Glass -->
        <nav class="navbar navbar-expand-lg fixed-top navbar-custom py-3">
            <div class="container">
                <a class="navbar-brand d-flex align-items-center gap-2" href="#">
                    <img src="<?= htmlspecialchars($logoUrl) ?>" alt="<?= htmlspecialchars($nombreSistema) ?>" height="45" class="d-inline-block align-text-top">
                </a>
                
                <button class="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                    <i class="bi bi-list fs-1 text-white"></i>
                </button>

                <div class="collapse navbar-collapse" id="navbarMain">
                    <ul class="navbar-nav ms-auto align-items-center gap-4 mt-3 mt-lg-0">
                        <li class="nav-item"><a class="nav-link fw-semibold" href="#inicio">Inicio</a></li>
                        <li class="nav-item"><a class="nav-link fw-semibold" href="#workflow">Flujo LIS</a></li>
                        <li class="nav-item"><a class="nav-link fw-semibold" href="#modulos">Módulos</a></li>
                        <li class="nav-item"><a class="nav-link fw-semibold" href="#planes">Planes</a></li>
                        
                        <li class="nav-item">
                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me interesa agendar una demo de NOVALIS') ?>" target="_blank" class="btn btn-outline-glow btn-sm px-3">
                                <i class="bi bi-whatsapp me-1"></i> Demo en Vivo
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
                    
                    <div class="col-lg-6 text-center text-lg-start">
                        <span class="badge-tech mb-3 d-inline-block"><i class="bi bi-cpu me-1"></i> LIS DE NÚCLEO MODERNO</span>
                        <h1 class="display-4 fw-extrabold text-white mb-3 lh-sm">
                            Control total para tu laboratorio, <span style="color: var(--brand-accent);">sin complicaciones</span>.
                        </h1>
                        <p class="text-muted mb-4 fs-5">
                            Automatiza la recepción, el área analítica y las cajas. Entrega resultados directamente a tus pacientes y posiciónate con una web propia e integrada.
                        </p>
                        
                        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-4">
                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me gustaría solicitar una demo de NOVALIS') ?>" target="_blank" class="btn btn-glow fs-6">
                                <i class="bi bi-whatsapp me-2"></i> Agendar Demo Gratuita
                            </a>
                            <a href="#planes" class="btn btn-outline-glow fs-6">
                                Ver Precios y Planes
                            </a>
                        </div>

                        <div class="row g-3 pt-3 border-top border-secondary border-opacity-25 text-start">
                            <div class="col-6 col-sm-4">
                                <div class="fw-bold text-white fs-5">+100%</div>
                                <div class="small text-muted">Órdenes ilimitadas</div>
                            </div>
                            <div class="col-6 col-sm-4">
                                <div class="fw-bold text-white fs-5">24/7</div>
                                <div class="small text-muted">Portal de Resultados</div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="fw-bold text-white fs-5">Multi-Sede</div>
                                <div class="small text-muted">Matriz y Tomas</div>
                            </div>
                        </div>
                    </div>

                    <!-- Mockup de Interfaz Simulado en CSS -->
                    <div class="col-lg-6">
                        <div class="system-preview-frame">
                            <div class="preview-header d-flex align-items-center justify-content-between">
                                <div class="d-flex gap-2">
                                    <div class="rounded-circle bg-danger" style="width:10px; height:10px;"></div>
                                    <div class="rounded-circle bg-warning" style="width:10px; height:10px;"></div>
                                    <div class="rounded-circle bg-success" style="width:10px; height:10px;"></div>
                                </div>
                                <span class="small font-monospace text-muted">novalis.lis/panel-operativo</span>
                                <i class="bi bi-shield-check text-info"></i>
                            </div>
                            <div class="p-4 bg-slate-900">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="text-white mb-0 fw-bold"><i class="bi bi-activity text-info me-2"></i>Monitoreo de Recepción</h6>
                                    <span class="badge bg-success bg-opacity-25 text-success border border-success">En Línea</span>
                                </div>
                                <div class="card bg-dark border-secondary border-opacity-25 p-3 mb-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div class="text-white fw-semibold small">Paciente: Maria Garcia L.</div>
                                            <div class="text-muted extra-small" style="font-size:0.75rem;">Folio: #ORD-2026-8849</div>
                                        </div>
                                        <span class="badge bg-info text-dark font-monospace">Captura Completa</span>
                                    </div>
                                </div>
                                <div class="card bg-dark border-secondary border-opacity-25 p-3 mb-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div class="text-white fw-semibold small">Estudio: Biometría Hemática Completa</div>
                                            <div class="text-muted extra-small" style="font-size:0.75rem;">Muestra: Tubo Tapón Morado (EDTA)</div>
                                        </div>
                                        <span class="badge bg-warning text-dark font-monospace">Validación Pendiente</span>
                                    </div>
                                </div>
                                <div class="p-3 bg-info bg-opacity-10 border border-info border-opacity-25 rounded-3 text-center">
                                    <span class="small text-info"><i class="bi bi-printer me-1"></i> Etiqueta de código de barras lista para impresión</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Nueva Sección: Flujo Operativo Simplificado (Workflow) -->
        <section id="workflow" class="py-5" style="background-color: #0b111e;">
            <div class="container py-4">
                <div class="text-center max-w-xl mx-auto mb-5">
                    <span class="badge-tech mb-2">FLUJO DE TRABAJO</span>
                    <h2 class="fw-bold text-white">Del paciente a la validación en 4 pasos</h2>
                </div>

                <div class="row g-4">
                    <div class="col-md-6 col-lg-3">
                        <div class="card-tech p-4 h-100 position-relative">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="step-number">1</div>
                                <i class="bi bi-person-plus fs-3 text-muted"></i>
                            </div>
                            <h5 class="fw-bold text-white mb-2">Registro & Cobro</h5>
                            <p class="text-muted small mb-0">Alta de orden express, cobro en caja con diversos métodos e impresión automática de tickets y etiquetas.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-3">
                        <div class="card-tech p-4 h-100 position-relative">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="step-number">2</div>
                                <i class="bi bi-eyedropper fs-3 text-muted"></i>
                            </div>
                            <h5 class="fw-bold text-white mb-2">Toma de Muestra</h5>
                            <p class="text-muted small mb-0">Identificación clara de contenedores con códigos de barras para evitar confusiones en laboratorio.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-3">
                        <div class="card-tech p-4 h-100 position-relative">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="step-number">3</div>
                                <i class="bi bi-file-earmark-medical fs-3 text-muted"></i>
                            </div>
                            <h5 class="fw-bold text-white mb-2">Captura & Validación</h5>
                            <p class="text-muted small mb-0">Bandejas ágiles de resultados por estatus con valores de referencia ajustables por edad y sexo.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-3">
                        <div class="card-tech p-4 h-100 position-relative">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="step-number">4</div>
                                <i class="bi bi-cloud-check fs-3 text-muted"></i>
                            </div>
                            <h5 class="fw-bold text-white mb-2">Entrega Digital</h5>
                            <p class="text-muted small mb-0">Envío automático de PDF por e-mail y disponibilidad inmediata en el portal web del paciente.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Módulos del Sistema -->
        <section id="modulos" class="py-5 bg-main">
            <div class="container py-4">
                <div class="text-center max-w-xl mx-auto mb-5">
                    <span class="badge-tech mb-2">FUNCIONALIDADES CLAVE</span>
                    <h2 class="fw-bold text-white">Diseñado para la eficiencia operativa</h2>
                </div>

                <div class="row g-4">
                    <div class="col-md-6 col-lg-4">
                        <div class="card-tech p-4 h-100">
                            <div class="icon-box-tech mb-3"><i class="bi bi-receipt-cutoff"></i></div>
                            <h5 class="fw-bold text-white mb-2">Recepción & Arqueos</h5>
                            <p class="text-muted small mb-0">Gestión de órdenes, desglose de IVA, cobros parciales y corte de caja operativo al cierre de turno.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card-tech p-4 h-100">
                            <div class="icon-box-tech mb-3"><i class="bi bi-bar-chart-line-fill"></i></div>
                            <h5 class="fw-bold text-white mb-2">Módulo Financiero</h5>
                            <p class="text-muted small mb-0">Monitorea flujo de efectivo, cuentas por cobrar, estudios de mayor margen y rentabilidad por periodo.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card-tech p-4 h-100">
                            <div class="icon-box-tech mb-3"><i class="bi bi-building-gear"></i></div>
                            <h5 class="fw-bold text-white mb-2">Gestión de Convenios</h5>
                            <p class="text-muted small mb-0">Tarifarios personalizados para empresas, médicos remitentes y laboratorios de maquila.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card-tech p-4 h-100">
                            <div class="icon-box-tech mb-3"><i class="bi bi-globe2"></i></div>
                            <h5 class="fw-bold text-white mb-2">Landing Page & Portal</h5>
                            <p class="text-muted small mb-0">Tu propio sitio web integrado para consulta de resultados en línea y atracción de nuevos clientes.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card-tech p-4 h-100">
                            <div class="icon-box-tech mb-3"><i class="bi bi-diagram-3-fill"></i></div>
                            <h5 class="fw-bold text-white mb-2">Red Multi-Sucursal</h5>
                            <p class="text-muted small mb-0">Conecta matrices y sucursales de toma de muestras bajo una sola base de datos centralizada.</p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card-tech p-4 h-100">
                            <div class="icon-box-tech mb-3"><i class="bi bi-shield-lock-fill"></i></div>
                            <h5 class="fw-bold text-white mb-2">Seguridad & Auditoría</h5>
                            <p class="text-muted small mb-0">Roles de usuario restringidos, registro de cancelaciones y trazabilidad completa de cambios.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sección de Planes -->
        <section id="planes" class="py-5" style="background-color: #0b111e;">
            <div class="container py-4">
                <div class="text-center max-w-xl mx-auto mb-5">
                    <span class="badge-tech mb-2">SUSCRIPCIONES</span>
                    <h2 class="fw-bold text-white">Planes sencillos, sin letras chiquitas</h2>
                </div>

                <div class="row g-4 justify-content-center align-items-stretch">
                    
                    <!-- Plan Básico -->
                    <div class="col-md-6 col-lg-5">
                        <div class="card-tech p-4 h-100 d-flex flex-column">
                            <div class="mb-3">
                                <span class="badge bg-secondary bg-opacity-25 text-light border border-secondary px-3 py-2 rounded-pill">MATRIZ ÚNICA</span>
                            </div>
                            <h4 class="fw-bold text-white mb-2">Plan Básico</h4>
                            <p class="text-muted small">Para laboratorios individuales que buscan digitalizar su proceso entero.</p>
                            
                            <div class="my-3">
                                <span class="display-5 fw-bold text-white">$799</span>
                                <span class="text-muted">MXN / mes</span>
                            </div>

                            <ul class="list-unstyled small mb-4 flex-grow-1 text-muted">
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check2 text-info fs-5 me-2"></i> <strong class="text-white">1 Sucursal / Matriz</strong></li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check2 text-info fs-5 me-2"></i> Pacientes y órdenes <strong class="text-white">&nbsp;ilimitados</strong></li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check2 text-info fs-5 me-2"></i> Recepción, Caja y Resultados</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check2 text-info fs-5 me-2"></i> Envío de PDF por correo</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check2 text-info fs-5 me-2"></i> Portal de resultados web para pacientes</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check2 text-info fs-5 me-2"></i> Landing Page pública estática</li>
                            </ul>

                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me interesa contratar el Plan Básico de NOVALIS') ?>" target="_blank" class="btn btn-outline-glow w-100 py-2">
                                Elegir Plan Básico
                            </a>
                        </div>
                    </div>

                    <!-- Plan Pro -->
                    <div class="col-md-6 col-lg-5">
                        <div class="card-tech p-4 h-100 d-flex flex-column style-featured" style="border-color: var(--brand-accent);">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="badge bg-info bg-opacity-25 text-info border border-info px-3 py-2 rounded-pill">RECOMENDADO</span>
                                <i class="bi bi-stars text-info fs-5"></i>
                            </div>
                            <h4 class="fw-bold text-white mb-2">Pro Multi-Sucursal</h4>
                            <p class="text-muted small">Para empresas de salud en expansión con requerimientos comerciales y financieros.</p>
                            
                            <div class="my-3">
                                <span class="display-5 fw-bold text-info">$1,399</span>
                                <span class="text-muted">MXN / mes</span>
                            </div>

                            <ul class="list-unstyled small mb-4 flex-grow-1 text-muted">
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-info me-2"></i> <strong class="text-white">Hasta 3 Sucursales incluidas</strong></li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-info me-2"></i> Todo lo incluido en Plan Básico</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-info me-2"></i> <strong class="text-white">Autogestión de Landing Page</strong> (Promociones)</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-info me-2"></i> Módulo de Rentabilidad y Auditoría</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-info me-2"></i> Tarjetas y convenios con empresas</li>
                                <li class="mb-2 d-flex align-items-center"><i class="bi bi-check-circle-fill text-info me-2"></i> Sucursal extra: +$300 MXN/mes</li>
                            </ul>

                            <a href="https://wa.me/<?= $whatsappPhone ?>?text=<?= rawurlencode('Hola, me interesa solicitar información del Plan Pro de NOVALIS') ?>" target="_blank" class="btn btn-glow w-100 py-2">
                                Elegir Plan Pro
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-5" style="background-color: #05080e; border-top: 1px solid rgba(255,255,255,0.08);">
            <div class="container">
                <div class="row gy-4 align-items-center border-bottom border-secondary border-opacity-25 pb-4 mb-4">
                    <div class="col-md-6 text-center text-md-start">
                        <img src="webapp/assets/images/logo_text_blanco.webp" alt="<?= htmlspecialchars($nombreSistema) ?>" height="40" class="mb-2 d-block mx-auto mx-md-0">
                        <p class="small text-muted mb-0"><?= htmlspecialchars($slogan) ?></p>
                    </div>
                    <div class="col-md-6 text-center text-md-end">
                        <p class="small text-muted mb-1"><i class="bi bi-envelope me-2 text-info"></i><?= $correoContacto ?></p>
                        <p class="small text-muted mb-0"><i class="bi bi-whatsapp me-2 text-success"></i>Atención directa vía WhatsApp</p>
                    </div>
                </div>

                <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p class="small text-muted mb-0">&copy; <?= date('Y') ?> <?= htmlspecialchars($nombreSistema) ?>. Todos los derechos reservados.</p>
                    <p class="small text-muted mb-0">Sistema de Información de Laboratorio Clínico</p>
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