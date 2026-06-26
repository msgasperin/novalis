<?php
   ini_set('session.cookie_httponly', 1);
   ini_set('session.cookie_samesite', 'Strict');
   session_start();
   require("../api/config/seguridad.php");
   header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
   header( "Last-Modified: ". gmdate("D,dMYH:i:s"). " GMT" );
   header( "Cache-Control: no-cache, must-revalidate" );
   header( "Pragma: no-cache" );
?>
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>:: NOM-035 - Guía V ::</title>
      <!-- CSS -->
      <link rel="shortcut icon" href="assets/images/favicon.png"/>
      <link rel="stylesheet" type="text/css" href="assets/lib/sweetAlert2/sweetalert2.min.css"/>
      <link rel="stylesheet" type="text/css" href="assets/lib/bootstrap-5.3.2/css/bootstrap.css"/>
      <link rel="stylesheet" href="assets/lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
      <link rel="stylesheet" type="text/css" href="assets/css/styles.css?x=<?=time();?>" />    
      <style>
         :root {
            --navy:    #0F2744;
            --menta:   #5FA8A3;
            --gris:    #F0F4F8;
            --salmon:  #F26B7C;
            --mostaza: #FFCC66;
         }
         body { background-color: var(--gris); }
         .card-guia { border-radius: 15px; overflow: hidden; border: none; }
         .sticky-header-guia { 
            position: sticky; 
            top: 0; 
            z-index: 1020; 
            background: white; 
            border-bottom: 3px solid var(--menta);
         }
         .seccion-titulo { 
            background-color: var(--navy); 
            color: white; 
            text-transform: uppercase; 
            font-size: 0.85rem; 
            letter-spacing: 1px;
            font-weight: 700;
         }
         .pregunta-row:nth-child(even) { background-color: rgba(15, 39, 68, 0.03); }
         .form-check-input:checked { 
            background-color: var(--menta); 
            border-color: var(--menta); 
         }
         /* Botón SÍ — salmón */
         .btn-outline-si {
            color: var(--salmon);
            border-color: var(--salmon);
         }
         .btn-check:checked + .btn-outline-si {
            background-color: var(--salmon);
            border-color: var(--salmon);
            color: white;
         }
         .btn-outline-si:hover {
            background-color: var(--salmon);
            border-color: var(--salmon);
            color: white;
         }
         /* Botón NO — navy */
         .btn-outline-no {
            color: var(--navy);
            border-color: #c5cfe0;
         }
         .btn-check:checked + .btn-outline-no {
            background-color: var(--navy);
            border-color: var(--navy);
            color: white;
         }
         .btn-outline-no:hover {
            background-color: var(--navy);
            border-color: var(--navy);
            color: white;
         }
         .btn-enviar {
            background-color: var(--navy);
            color: white;
            transition: all 0.3s;
            border: none;
         }
         .btn-enviar:hover {
            background-color: #1a3a5c;
            color: white;
            transform: translateY(-2px);
         }
         .instrucciones-caja {
            border-left: 5px solid var(--mostaza);
            background-color: #fffbee;
         }
         /* Accent en el título de la tarjeta */
         .titulo-guia { color: var(--navy); }
         /* Subtítulo instrucción de sección */
         .seccion-inst { 
            border-left: 4px solid var(--menta);
            background-color: #f0f9f8;
            color: #0a4a46;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 0.6rem 1.2rem;
         }
      </style>
   </head>
   <body>
      <div class="container py-5">
         <div class="row justify-content-center">
               <div class="col-lg-10">
                  
                  <form id="formGuiaUno" onsubmit="event.preventDefault(); enviarGuia();">
                     <div class="card card-guia shadow-lg">
                           
                           <!-- Encabezado Fijo -->
                           <div class="card-header sticky-header-guia py-4 px-4">
                              <div class="d-flex justify-content-between align-items-center">
                                 <div>
                                       <h3 class="fw-bold mb-0 titulo-guia">Guía de Referencia V</h3>
                                       <p class="text-muted mb-0 small">NOM-035-STPS-2018 | Perfil del Trabajador</p>
                                 </div>
                                 <img src="assets/images/logo.png" width="70">
                              </div>
                           </div>

                           <div class="card-body p-0">
                              <!-- Instrucciones -->
                              <div class="p-4 instrucciones-caja m-4 rounded-end">
                                 <h6 class="fw-bold" style="color: var(--navy);"><i class="bi bi-info-circle-fill me-2" style="color: var(--mostaza);"></i>Instrucciones</h6>
                                 <p class="mb-0 small text-secondary">
                                       Complete los siguientes campos con su información personal y laboral. Asegúrese de que los datos sean correctos, ya que serán utilizados para la aplicación de la evaluación de factores de riesgo psicosocial conforme a la <strong>NOM-035-STPS-2018</strong>.
                                 </p>
                              </div>
                           </div>

                           <!-- Sección: Datos Personales -->
                           <div class="px-4 pb-2">
                              <div class="seccion-titulo px-4 py-2 rounded-top">
                                 <i class="bi bi-person-fill me-2"></i>Datos Personales
                              </div>
                              <div class="border border-top-0 rounded-bottom p-4 mb-4">
                                 <div class="row g-3">
                                       <div class="col-md-4">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="nombre">Nombre(s)</label>
                                          <input type="text" class="form-control" id="nombre" name="nombre" placeholder="Nombre(s)" required>
                                       </div>
                                       <div class="col-md-4">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="ap_paterno">Apellido Paterno</label>
                                          <input type="text" class="form-control" id="ap_paterno" name="ap_paterno" placeholder="Apellido paterno" required>
                                       </div>
                                       <div class="col-md-4">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="ap_materno">Apellido Materno</label>
                                          <input type="text" class="form-control" id="ap_materno" name="ap_materno" placeholder="Apellido materno">
                                       </div>

                                       <div class="col-md-4">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="fecha_nacimiento">Fecha de Nacimiento</label>
                                          <input type="date" class="form-control" id="fecha_nacimiento" name="fecha_nacimiento" required>
                                       </div>
                                       <div class="col-md-4">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="curp">CURP</label>
                                          <input type="text" class="form-control text-uppercase" id="curp" name="curp" placeholder="CURP (18 caracteres)" maxlength="18" style="letter-spacing:1px;" required>
                                       </div>
                                       <div class="col-md-4">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="sexo">Sexo</label>
                                          <select class="form-select" id="sexo" name="sexo" required>
                                             <option value="" disabled selected>Seleccione…</option>
                                             <option value="M">Masculino</option>
                                             <option value="F">Femenino</option>
                                             <option value="NB">Prefiero no decir</option>
                                          </select>
                                       </div>

                                       <div class="col-md-6">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="estado_civil">Estado Civil</label>
                                          <select class="form-select" id="estado_civil" name="estado_civil" required>
                                             <option value="" disabled selected>Seleccione…</option>
                                             <option value="soltero">Soltero(a)</option>
                                             <option value="casado">Casado(a)</option>
                                             <option value="union_libre">Unión libre</option>
                                             <option value="divorciado">Divorciado(a)</option>
                                             <option value="separado">Separado(a)</option>
                                             <option value="viudo">Viudo(a)</option>
                                          </select>
                                       </div>
                                       <div class="col-md-6">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="nivel_estudios">Nivel de Estudios</label>
                                          <select class="form-select" id="nivel_estudios" name="nivel_estudios" required>
                                             <option value="" disabled selected>Seleccione…</option>
                                             <option value="sin_estudios">Sin estudios</option>
                                             <option value="primaria">Primaria</option>
                                             <option value="secundaria">Secundaria</option>
                                             <option value="preparatoria">Preparatoria / Bachillerato</option>
                                             <option value="tecnico">Técnico / Tecnólogo</option>
                                             <option value="licenciatura">Licenciatura</option>
                                             <option value="posgrado">Posgrado (Maestría / Doctorado)</option>
                                          </select>
                                       </div>
                                 </div>
                              </div>
                           </div>

                           <!-- Sección: Datos Laborales -->
                           <div class="px-4 pb-2">
                              <div class="seccion-titulo px-4 py-2 rounded-top">
                                 <i class="bi bi-briefcase-fill me-2"></i>Datos Laborales
                              </div>
                              <div class="border border-top-0 rounded-bottom p-4 mb-4">
                                 <div class="row g-3">
                                       <div class="col-md-6">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="tipo_puesto">Tipo de Puesto</label>
                                          <select class="form-select" id="tipo_puesto" name="tipo_puesto" required>
                                             <option value="" disabled selected>Seleccione…</option>
                                             <option value="operativo">Operativo</option>
                                             <option value="administrativo">Administrativo</option>
                                             <option value="directivo">Directivo / Gerencial</option>
                                             <option value="tecnico">Técnico especializado</option>
                                          </select>
                                       </div>
                                       <div class="col-md-6">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="puesto">Puesto / Cargo</label>
                                          <input type="text" class="form-control" id="puesto" name="puesto" placeholder="Nombre del puesto" required>
                                       </div>

                                       <div class="col-md-6">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="tipo_contratacion">Tipo de Contratación</label>
                                          <select class="form-select" id="tipo_contratacion" name="tipo_contratacion" required>
                                             <option value="" disabled selected>Seleccione…</option>
                                             <option value="base">Base / Planta</option>
                                             <option value="temporal">Temporal / Eventual</option>
                                             <option value="honorarios">Honorarios / Servicios profesionales</option>
                                             <option value="confianza">Confianza</option>
                                             <option value="otro">Otro</option>
                                          </select>
                                       </div>
                                       <div class="col-md-6">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="tiempo_puesto">Tiempo en el Puesto</label>
                                          <select class="form-select" id="tiempo_puesto" name="tiempo_puesto" required>
                                             <option value="" disabled selected>Seleccione…</option>
                                             <option value="menos_1">Menos de 1 año</option>
                                             <option value="1_3">De 1 a 3 años</option>
                                             <option value="3_5">De 3 a 5 años</option>
                                             <option value="5_10">De 5 a 10 años</option>
                                             <option value="mas_10">Más de 10 años</option>
                                          </select>
                                       </div>

                                       <div class="col-md-6">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase" for="jornada">Jornada de Trabajo</label>
                                          <select class="form-select" id="jornada" name="jornada" required>
                                             <option value="" disabled selected>Seleccione…</option>
                                             <option value="diurna">Diurna</option>
                                             <option value="nocturna">Nocturna</option>
                                             <option value="mixta">Mixta</option>
                                             <option value="reducida">Reducida</option>
                                             <option value="partida">Partida</option>
                                          </select>
                                       </div>
                                       <div class="col-md-6">
                                          <label class="form-label fw-semibold small text-secondary text-uppercase d-block">¿Rota Turnos?</label>
                                          <div class="d-flex gap-3 mt-1">
                                             <div>
                                                   <input type="radio" class="btn-check" name="rota_turnos" id="rota_si" value="1" required>
                                                   <label class="btn btn-outline-si btn-sm px-4" for="rota_si">SÍ</label>
                                             </div>
                                             <div>
                                                   <input type="radio" class="btn-check" name="rota_turnos" id="rota_no" value="0">
                                                   <label class="btn btn-outline-no btn-sm px-4" for="rota_no">NO</label>
                                             </div>
                                          </div>
                                       </div>
                                 </div>
                              </div>
                           </div>

                           <div class="card-footer bg-white border-top-0 py-5 text-center">
                              <button type="button" class="btn btn-lg px-5 btn-enviar btn-redondo shadow-sm" onclick="fn_guardar_guia_v();">
                                 <i class="bi bi-check2-circle me-2"></i> Guardar información y contestar evaluación
                              </button>
                           </div>
                     </div>
                  </form>

               </div>
         </div>
      </div>

      <!-- Scripts -->
      <script src="assets/lib/jquery-3.7.1.min.js"></script>
      <script src="assets/lib/jquery-ui-1.14.0/jquery-ui.js"></script>
      <script src="assets/lib/sweetAlert2/sweetalert2.min.js"></script>
      <script src="assets/lib/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>
      <script src="assets/lib/select2/select2.min.js"></script>
      <script src="assets/lib/DataTables/datatables.min.js"></script>
      
      <script type="module" src="components/globals.js?<?=time()?>"></script>
      <script type="module" src="components/Evaluaciones/Evaluaciones.js?<?=time()?>"></script>
   </body>
</html>