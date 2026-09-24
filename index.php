<?php

    //ini_set('session.cookie_secure', 1);     // solo HTTPS
    ini_set('session.cookie_httponly', 1);   // no accesible desde JS
    ini_set('session.cookie_samesite', 'Strict'); // bloquea CSRF adicional
    session_start();
    // ── CSRF ──────────────────────────────────────────────
    if (empty($_SESSION['csrfTokenPortal'])) {
        $_SESSION['csrfTokenPortal'] = bin2hex(random_bytes(32));
    }
    // 1. Detección dinámica del subdominio
    $host = $_SERVER['HTTP_HOST'];
    $parts = explode('.', $host);
    // Si hay al menos 3 partes (ej. labxyz.novalis.com), tomamos el subdominio
    $subDominio = (count($parts) >= 3) ? $parts[0] : 'default';

    $subDominio = 'labdemo'; // Borrar solo es para pruebas responsive

    // 2. Ruta al archivo JSON estático
    $jsonPath = "api/config/json/{$subDominio}.json";

    if (!file_exists($jsonPath)) {
        $jsonPath = "api/config/json/default.json";
    }

    // 3. Cargar y decodificar datos
    $jsonContent = file_exists($jsonPath) ? file_get_contents($jsonPath) : '{}';
    $config = json_decode($jsonContent, true);

    // Asignación de variables con fallbacks
    $nombreLab   = $config['nombre_comercial'] ?? 'Laboratorio Clínico';
    $slogan      = $config['slogan']           ?? 'Resultados confiables y seguros';
    $favicon     = $config['favicon']          ?? "api/assets/logo.png";
    $logoUrl     = $config['logo_url']         ?? "api/assets/logo.png";
    $colores     = $config['colores']          ?? ['primario' => '#0d6efd', 'secundario' => '#0a58ca', 'acento' => '#0dcaf0'];
    $sizeLogo    = $config['size_logo']        ?? 60;
    $contacto    = $config['contacto']         ?? [];
    $promociones = $config['promociones']      ?? [];
    $servicios   = $config['servicios']        ?? [];
    $sucursales  = $config['sucursales']       ?? [];

    $_SESSION["nombreLab"] = $nombreLab;
    $_SESSION["favicon"]   = $favicon;
    $_SESSION["logoUrl"]   = $logoUrl;
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <link rel="shortcut icon" href="<?= htmlspecialchars($favicon) ?>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?= htmlspecialchars($nombreLab) ?></title>
        <meta name="description" content="Consulta tus resultados de laboratorio en línea de manera rápida y segura.">

        <link href="webapp/assets/lib/bootstrap-5.3.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="webapp/assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css" rel="stylesheet">
        <link href="webapp/assets/lib/sweetAlert2/sweetalert2.min.css" rel="stylesheet" />
        <link href="webapp/assets/css/styles.css?x=<?php echo time();?>" rel="stylesheet"/>
        <link href="webapp/assets/css/toast.css?x=<?php echo time();?>" rel="stylesheet"/>

        <!-- Estilos Personalizados -->
        <style>
            @font-face {
                font-family: "Plus Jakarta Sans";
                src: url("webapp/assets/css/fuentes/Plus_Jakarta_Sans/PlusJakartaSans-Regular.ttf") format("truetype");
            }

            :root {
                --brand-primary: <?= $colores['primario'] ?>;
                --brand-secondary: <?= $colores['secundario'] ?>;
                --brand-accent: <?= $colores['acento'] ?>;
                --brand-primary-rgb: <?= implode(',', sscanf($colores['primario'], "#%02x%02x%02x")) ?>;
                --font-main: 'Plus Jakarta Sans', sans-serif;
            }

            body {
                font-family: var(--font-main);
                color: #2b3445;
                background-color: #f8fafc;
                overflow-x: hidden;
            }

            .pointer {
                cursor: pointer;
            }

            .text-brand-primary { color: var(--brand-primary) !important; }
            .bg-brand-primary { background-color: var(--brand-primary) !important; }
            
            .btn-brand {
                background-color: var(--brand-primary);
                border-color: var(--brand-primary);
                color: #ffffff;
                font-weight: 600;
                padding: 0.75rem 1.5rem;
                border-radius: 10px;
                transition: all 0.25s ease;
                box-shadow: 0 4px 12px rgba(var(--brand-primary-rgb), 0.25);
            }
            .btn-brand:hover {
                background-color: var(--brand-secondary);
                border-color: var(--brand-secondary);
                color: #ffffff;
                transform: translateY(-2px);
                box-shadow: 0 6px 18px rgba(var(--brand-primary-rgb), 0.35);
            }

            .navbar-custom {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
            }

            .hero-section {
                position: relative;
                padding: 90px 0 100px 0;
                background: radial-gradient(100% 100% at 50% 0%, rgba(var(--brand-primary-rgb), 0.08) 0%, rgba(248, 250, 252, 1) 100%);
            }

            /* Tarjeta de Acceso */
            .card-access {
                border: none;
                border-radius: 18px;
                background: #ffffff;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
                transition: transform 0.3s ease;
            }

            /* Selector Paciente / Convenio */
            .access-type-selector .btn-group {
                background-color: #f1f5f9 !important;
                border: 1px solid #e2e8f0;
            }

            .btn-type-select {
                color: #64748b;
                border: none !important;
                padding: 0.5rem 0.75rem;
                font-size: 0.85rem;
                transition: all 0.2s ease-in-out;
            }

            .btn-type-select.active {
                background-color: #ffffff !important;
                color: var(--brand-primary) !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
            }

            .input-group-custom .form-control {
                border-left: none;
                padding: 0.75rem 1rem;
                font-size: 0.95rem;
                border-color: #e2e8f0;
            }
            .input-group-custom .input-group-text {
                background-color: #f8fafc;
                border-right: none;
                border-color: #e2e8f0;
                color: #94a3b8;
            }
            .form-control:focus {
                box-shadow: none;
                border-color: var(--brand-primary);
            }

            .card-service {
                border: 1px solid #f1f5f9;
                border-radius: 16px;
                background: #ffffff;
                transition: all 0.3s ease;
            }
            .card-service:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
                border-color: rgba(var(--brand-primary-rgb), 0.3);
            }

            /* Tarjetas de Promociones */
            .card-promo {
                border: 1px solid #e2e8f0;
                border-radius: 18px;
                background: #ffffff;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .card-promo:hover {
                transform: translateY(-5px);
                box-shadow: 0 18px 35px rgba(0, 0, 0, 0.07);
            }
            .card-promo.promo-featured {
                border: 2px solid var(--brand-primary);
                box-shadow: 0 12px 30px rgba(var(--brand-primary-rgb), 0.15);
            }
            .badge-promo {
                font-size: 0.75rem;
                font-weight: 700;
                padding: 5px 12px;
                border-radius: 20px;
                text-transform: uppercase;
            }

            .icon-wrapper {
                width: 55px;
                height: 55px;
                border-radius: 12px;
                background: rgba(var(--brand-primary-rgb), 0.1);
                color: var(--brand-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
            }

            .badge-portal {
                background-color: rgba(var(--brand-primary-rgb), 0.1);
                color: var(--brand-primary);
                font-size: 0.825rem;
                font-weight: 700;
                letter-spacing: 0.5px;
                padding: 6px 14px;
                border-radius: 30px;
            }

            .footer-brand {
                background-color: var(--brand-accent);
                color: #94a3b8;
            }
        </style>
    </head>
    <body>
        <input type="hidden" id="csrfTokenPortal" value="<?php echo $_SESSION['csrfTokenPortal']; ?>">
        <input type="hidden" name="tipo_cliente" id="tipo_cliente" value="paciente">
        
        <!-- Header / Navbar -->
        <nav class="navbar navbar-expand-lg sticky-top navbar-custom py-3">
            <div class="container">
                <a class="navbar-brand d-flex align-items-center" href="#">
                    <img src="<?= htmlspecialchars($logoUrl) ?>" alt="<?= htmlspecialchars($nombreLab) ?>" height="<?= htmlspecialchars($sizeLogo) ?>" class="me-2">
                </a>
                
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarMain">
                    <ul class="navbar-nav ms-auto align-items-center gap-2">
                        <li class="nav-item"><a class="nav-link fw-medium" href="#inicio">Inicio</a></li>
                        <?php if (!empty($promociones)): ?>
                            <li class="nav-item"><a class="nav-link fw-medium" href="#promociones">Promociones</a></li>
                        <?php endif; ?>
                        <li class="nav-item"><a class="nav-link fw-medium" href="#servicios">Servicios</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="#sucursales">Sucursales</a></li>
                        
                        <?php if (!empty($contacto['whatsapp'])): ?>
                        <li class="nav-item ms-lg-2">
                            <a href="https://wa.me/<?= htmlspecialchars($contacto['whatsapp']) ?>" target="_blank" class="btn btn-outline-success rounded-pill px-3 py-2 btn-sm fw-bold">
                                <i class="bi bi-whatsapp me-1 fs-6"></i> Contactar
                            </a>
                        </li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Hero Section / Formulario de Login -->
        <section id="inicio" class="hero-section">
            <div class="container">
                <div class="row align-items-center gy-5">
                    
                    <!-- Presentación e Identidad -->
                    <div class="col-lg-6">
                        <span class="badge badge-portal mb-3 d-inline-block">PORTAL WEB</span>
                        <h1 class="display-5 fw-extrabold text-dark mb-3">Tus resultados de laboratorio en línea</h1>
                        <p class="lead text-muted mb-4"><?= htmlspecialchars($slogan) ?>. Consulta y descarga tus estudios en formato PDF al instante con tus credenciales de acceso.</p>
                        
                        <div class="d-flex flex-wrap gap-4 pt-2">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-shield-check text-brand-primary fs-4"></i>
                                <span class="small fw-semibold text-secondary">Acceso Seguro</span>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-clock-history text-brand-primary fs-4"></i>
                                <span class="small fw-semibold text-secondary">Disponible 24/7</span>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-file-earmark-pdf text-brand-primary fs-4"></i>
                                <span class="small fw-semibold text-secondary">Descarga Directa PDF</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tarjeta de Acceso a Resultados -->
                    <div class="col-lg-5 offset-lg-1">
                        <div class="card card-access p-4 p-sm-5">
                            
                            <!-- Selector de Tipo de Usuario -->
                            <div class="access-type-selector mb-4">
                                <div class="btn-group w-100 p-1 bg-light rounded-3" role="group" id="userTypeTabs">
                                    <button type="button" class="btn btn-sm rounded-2 fw-bold active btn-type-select" data-type="paciente" onclick="switchUserType('paciente')">
                                        <i class="bi bi-person-heart me-1"></i> Paciente
                                    </button>
                                    <button type="button" class="btn btn-sm rounded-2 fw-bold text-muted btn-type-select" data-type="convenio" onclick="switchUserType('convenio')">
                                        <i class="bi bi-building-gear me-1"></i> Empresa / Doctor
                                    </button>
                                </div>
                            </div>

                            <!-- Encabezado Dinámico -->
                            <div class="text-center mb-4">
                                <h4 class="fw-bold text-dark mb-1" id="accessTitle">Consultar Resultados</h4>
                                <p class="text-muted small" id="accessSubtitle">Ingresa las credenciales impresas en tu comprobante</p>
                            </div>                          

                            <div class="mb-3">
                                <label class="form-label small fw-bold text-secondary" id="labelUsuario">Usuario / Folio</label>
                                <div class="input-group input-group-custom">
                                    <span class="input-group-text"><i class="bi bi-person-circle" id="iconUsuario"></i></span>
                                    <input type="text" inputmode="numeric" name="usuario" id="inputUsuario" class="form-control" placeholder="Ej. 102540">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-bold text-secondary" for="inputPassword">Contraseña / Clave Web</label>
                                <div class="input-group input-group-custom">
                                    <span class="input-group-text"><i class="bi bi-key"></i></span>
                                    <input type="password" name="inputPassword" id="inputPassword" class="form-control" placeholder="••••••••">
                                    <span class="input-group-text pointer" id="eyePassword" onclick="ver_password('inputPassword','eyePassword');"><i class="bi bi-eye-slash"></i></span>
                                </div>
                            </div>

                            <!-- Campo Fecha de Nacimiento (Solo visible en Paciente) -->
                            <div class="mb-4" id="containerFechaNac">
                                <label class="form-label small fw-bold text-secondary" for="inputFechaNac">Fecha de Nacimiento</label>
                                <div class="input-group input-group-custom">
                                    <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
                                    <input type="date" name="inputFechaNac" id="inputFechaNac" class="form-control">
                                </div>
                            </div>

                            <button type="button" class="btn btn-brand w-100 py-3 mb-2" id="btnLogin" onclick="login_portal();"> 
                                <i class="bi bi-file-earmark-arrow-down me-2"></i>
                                <span id="btnAccessText">Ver Mis Resultados</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Sección de Promociones / Paquetes -->
        <?php if (!empty($promociones)): ?>
        <section id="promociones" class="py-5" style="background-color: #f1f5f9;">
            <div class="container py-4">
                <div class="text-center max-w-xl mx-auto mb-5">
                    <span class="badge badge-portal mb-2">PAQUETES ESPECIALES</span>
                    <h2 class="fw-bold text-dark">Promociones del Mes</h2>
                    <p class="text-muted">Aprovecha nuestros perfiles preventivos con precios preferenciales.</p>
                </div>

                <div class="row g-4 align-items-stretch">
                    <?php foreach ($promociones as $promo): ?>
                    <?php $isFeatured = !empty($promo['destacado']); ?>
                    <div class="col-md-6 col-lg-3">
                        <div class="card card-promo p-4 h-100 d-flex flex-column <?= $isFeatured ? 'promo-featured' : '' ?>">
                            
                            <!-- Header / Badge -->
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="badge badge-promo <?= $isFeatured ? 'bg-brand-primary text-white' : 'bg-light text-secondary border' ?>">
                                    <?= htmlspecialchars($promo['badge'] ?? 'Oferta') ?>
                                </span>
                                <?php if ($isFeatured): ?>
                                    <i class="bi bi-star-fill text-warning fs-6"></i>
                                <?php endif; ?>
                            </div>

                            <!-- Título -->
                            <h5 class="fw-bold text-dark mb-3"><?= htmlspecialchars($promo['titulo']) ?></h5>

                            <!-- Precios -->
                            <div class="mb-4">
                                <?php if (!empty($promo['precio_regular'])): ?>
                                    <span class="text-decoration-line-through text-muted small me-2"><?= htmlspecialchars($promo['precio_regular']) ?></span>
                                <?php endif; ?>
                                <span class="h3 fw-extrabold text-brand-primary mb-0"><?= htmlspecialchars($promo['precio_oferta']) ?></span>
                            </div>

                            <!-- Lista de estudios incluidos -->
                            <ul class="list-unstyled small mb-4 flex-grow-1">
                                <?php foreach ($promo['incluye'] as $estudio): ?>
                                <li class="mb-2 d-flex align-items-start">
                                    <i class="bi bi-check-circle-fill text-success me-2 flex-shrink-0 mt-1"></i>
                                    <span><?= htmlspecialchars($estudio) ?></span>
                                </li>
                                <?php endforeach; ?>
                            </ul>

                            <!-- CTA WhatsApp -->
                            <?php if (!empty($contacto['whatsapp'])): ?>
                            <?php 
                                $msgWa = rawurlencode("Hola, me interesa agendar la promoción: " . $promo['titulo']);
                            ?>
                            <a href="https://wa.me/<?= htmlspecialchars($contacto['whatsapp']) ?>?text=<?= $msgWa ?>" target="_blank" class="btn <?= $isFeatured ? 'btn-brand' : 'btn-outline-primary' ?> w-100 btn-sm py-2 fw-bold">
                                <i class="bi bi-whatsapp me-1"></i> Agendar Paquete
                            </a>
                            <?php endif; ?>

                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Servicios del Laboratorio -->
        <?php if (!empty($servicios)): ?>
        <section id="servicios" class="py-5 bg-white">
            <div class="container py-4">
                <div class="text-center max-w-xl mx-auto mb-5">
                    <span class="badge badge-portal mb-2">NUESTROS SERVICIOS</span>
                    <h2 class="fw-bold text-dark">Servicios Integrales de Salud</h2>
                    <p class="text-muted">Ofrecemos atención profesional respaldada por los más altos estándares de calidad.</p>
                </div>

                <div class="row g-4">
                    <?php foreach ($servicios as $servicio): ?>
                    <div class="col-md-6 col-lg-3">
                        <div class="card card-service p-4 h-100">
                            <div class="icon-wrapper mb-3">
                                <i class="<?= htmlspecialchars($servicio['icono']) ?>"></i>
                            </div>
                            <h5 class="fw-bold text-dark mb-2"><?= htmlspecialchars($servicio['titulo']) ?></h5>
                            <p class="text-muted small mb-0"><?= htmlspecialchars($servicio['descripcion']) ?></p>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Sucursales y Ubicaciones -->
        <?php if (!empty($sucursales)): ?>
        <section id="sucursales" class="py-5" style="background-color: #f8fafc;">
            <div class="container py-4">
                <div class="text-center mb-5">
                    <span class="badge badge-portal mb-2">UBICACIONES</span>
                    <h2 class="fw-bold text-dark">Visita Nuestras Sucursales</h2>
                </div>

                <div class="row g-4 justify-content-center">
                    <?php foreach ($sucursales as $sucursal): ?>
                    <div class="col-md-6 col-lg-5">
                        <div class="card card-service p-4 h-100 d-flex flex-row align-items-start gap-3">
                            <div class="icon-wrapper flex-shrink-0">
                                <i class="bi bi-geo-alt"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold text-dark mb-1"><?= htmlspecialchars($sucursal['nombre']) ?></h5>
                                <p class="text-muted small mb-2"><?= htmlspecialchars($sucursal['direccion']) ?></p>
                                <a href="tel:+52<?= htmlspecialchars($sucursal['telefono']) ?>" class="text-decoration-none">
                                    <span class="small fw-semibold text-brand-primary"><i class="bi bi-telephone me-1"></i><?= htmlspecialchars($sucursal['telefono']) ?></span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Footer -->
        <footer class="footer-brand py-5">
            <div class="container">
                <div class="row gy-4 align-items-center border-bottom border-secondary border-opacity-25 pb-4 mb-4">
                    <div class="col-md-6 text-center text-md-start">
                        <img src="<?= htmlspecialchars($logoUrl) ?>" alt="<?= htmlspecialchars($nombreLab) ?>" height="50" class="me-2">
                        <h5 class="text-white fw-bold mb-1"><?= htmlspecialchars($nombreLab) ?></h5>
                        <p class="small text-white mb-0"><?= htmlspecialchars($slogan) ?></p>
                    </div>
                    <div class="col-md-6 text-center text-md-end">
                        <?php if (!empty($contacto['horario'])): ?>
                            <span class="small text-white"><i class="bi bi-clock me-1 text-brand-primary"></i> <?= htmlspecialchars($contacto['horario']) ?></span>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p class="small text-white mb-0">&copy; <?= date('Y') ?> <?= htmlspecialchars($nombreLab) ?>. Todos los derechos reservados.</p>
                    <p class="small text-white mb-0">Desarrollado con <span class="text-white fw-bold">NOVALIS</span></p>
                </div>
            </div>
        </footer>

        <script src="webapp/assets/lib/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>
        <script src="webapp/assets/lib/jquery-3.7.1.min.js"></script>
        <script src="webapp/assets/lib/sweetAlert2/sweetalert2.min.js"></script>
        <script type="module" src="webapp/components/globals.js?<?=time()?>"></script>
        <script type="module" src="plataforma/components/Login/Login.js?x=<?php echo time();?>"></script>

    </body>
</html>