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
    <title>:: NOM-035 - Guía I ::</title>
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
                                    <h3 class="fw-bold mb-0 titulo-guia">Guía de Referencia I</h3>
                                    <p class="text-muted mb-0 small">NOM-035-STPS-2018 | Acontecimientos Traumáticos Severos</p>
                                </div>
                              <img src="assets/images/logo.png" width="70">
                            </div>
                        </div>

                        <div class="card-body p-0">
                            <!-- Instrucciones -->
                            <div class="p-4 instrucciones-caja m-4 rounded-end">
                                <h6 class="fw-bold" style="color: var(--navy);"><i class="bi bi-info-circle-fill me-2" style="color: var(--mostaza);"></i>Instrucciones</h6>
                                <p class="mb-0 small text-secondary">
                                    Lea cuidadosamente cada pregunta y marque la opción <strong>SÍ</strong> o <strong>NO</strong> según corresponda a su situación personal durante el último mes de trabajo o derivado de este.
                                </p>
                            </div>

                            <?php
                            $secciones = [
                              [
                                 "titulo" => "I.- Acontecimiento traumático severo",
                                 "inst" => "¿Ha presenciado o sufrido alguna vez, durante o con motivo del trabajo, un acontecimiento traumático severo como accidentes graves, asaltos, secuestros o amenazas?",
                                 "preguntas" => [
                                       "1" => "Accidente con muerte, pérdida de miembro o lesión grave?",
                                       "2" => "Asaltos?",
                                       "3" => "Secuestros?",
                                       "4" => "Amenazas?",
                                       "5" => "Cualquier otro que ponga en riesgo su vida o salud?"
                                 ]
                              ],
                              [
                                 "titulo" => "II.- Recuerdos persistentes",
                                 "inst" => "Durante el último mes:",
                                 "preguntas" => [
                                       "6" => "¿Ha tenido recuerdos recurrentes que le provocan malestares?",
                                       "7" => "¿Ha tenido sueños de carácter recurrente sobre el acontecimiento?"
                                 ]
                              ],
                              [
                                 "titulo" => "III.- Esfuerzo por evitar circunstancias parecidas",
                                 "inst" => "Durante el último mes:",
                                 "preguntas" => [
                                       "8" => "¿Se ha esforzado por evitar aquello que le pueda recordar el evento?",
                                       "9" => "¿Se ha esforzado por evitar lugares, actividades o personas?",
                                       "10" => "¿Ha tenido dificultad para recordar partes importantes del evento?"
                                 ]
                              ],
                              [
                                 "titulo" => "IV.- Afectación",
                                 "inst" => "Durante el último mes:",
                                 "preguntas" => [
                                       "11" => "¿Ha disminuido su interés en sus actividades cotidianas?",
                                       "12" => "¿Se ha sentido usted alejado o distante de los demás?",
                                       "13" => "¿Ha notado que tiene dificultad para expresar sus sentimientos?",
                                       "14" => "¿Ha tenido la sensación de que su futuro se limitará?",
                                       "15" => "¿Ha tenido dificultad para dormir?",
                                       "16" => "¿Ha estado particularmente irritable o con explosiones de ira?",
                                       "17" => "¿Ha tenido dificultad para concentrarse?",
                                       "18" => "¿Ha estado excesivamente alerta o vigilante?",
                                       "19" => "¿Se ha sobresaltado fácilmente por cualquier cosa?"
                                 ]
                              ]
                            ];

                            foreach ($secciones as $s) {
                              echo '<div class="px-4 py-3 seccion-titulo">'.$s['titulo'].'</div>';
                              echo '<div class="seccion-inst px-4 border-bottom">'.$s['inst'].'</div>';
                              echo '<table class="table table-hover mb-0 align-middle">';
                              echo '<tbody>';
                              foreach ($s['preguntas'] as $id => $texto) {
                                 echo '<tr class="pregunta-row">
                                          <td class="ps-4" style="width: 75%;">'.$texto.'</td>
                                          <td class="pe-4 text-end">
                                             <div class="btn-group" role="group">
                                                   <input type="radio" class="btn-check" name="p'.$id.'" id="p'.$id.'si" value="si" required>
                                                   <label class="btn btn-outline-si btn-sm px-3" for="p'.$id.'si">SÍ</label>
                                                   
                                                   <input type="radio" class="btn-check" name="p'.$id.'" id="p'.$id.'no" value="no">
                                                   <label class="btn btn-outline-no btn-sm px-3" for="p'.$id.'no">NO</label>
                                             </div>
                                          </td>
                                       </tr>';
                              }
                              echo '</tbody></table>';
                            }
                            ?>
                        </div>

                        <div class="card-footer bg-white border-top-0 py-5 text-center">
                            <button type="submit" class="btn btn-lg px-5 btn-enviar btn-redondo shadow-sm">
                                <i class="bi bi-check2-circle me-2"></i> Finalizar y enviar respuestas
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="assets/lib/jquery-3.7.1.min.js"></script>
    <script src="assets/lib/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>
    <script src="assets/lib/sweetAlert2/sweetalert2.min.js"></script>

    <script>
      function enviarGuia() {
         Swal.fire({
               title: '¿Deseas finalizar?',
               text: "Tus respuestas serán procesadas para el diagnóstico.",
               icon: 'question',
               showCancelButton: true,
               confirmButtonColor: '#5FA8A3',
               cancelButtonColor: '#0F2744',
               confirmButtonText: 'Sí, enviar',
               cancelButtonText: 'Cancelar'
         }).then((result) => {
               if (result.isConfirmed) {
                  Swal.fire({
                     title: 'Procesando...',
                     html: 'Guardando respuestas en el sistema',
                     allowOutsideClick: false,
                     didOpen: () => { Swal.showLoading(); }
                  });

                  const datos = new FormData(document.getElementById('formGuiaUno'));
                  console.log("Datos capturados:", Object.fromEntries(datos));

                  setTimeout(() => {
                     Swal.fire({
                           title: '¡Completado!',
                           text: 'Tu evaluación ha sido registrada correctamente.',
                           icon: 'success',
                           confirmButtonColor: '#5FA8A3'
                     }).then(() => {
                           window.location.href = 'index.php'; 
                     });
                  }, 1500);
               }
         });
      }
    </script>
</body>
</html>