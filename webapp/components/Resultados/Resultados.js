// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ RESULTADOS POR EVALUACIÓN  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalResultadosEvaluacion = () => {

   let html = `
   <div class="modal fade modal-superior-blur"
        id="modalResultadosEvaluacion"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1">

      <div class="modal-dialog modal-xl modal-fullscreen-md-down">

         <div class="modal-content border-0 shadow-lg">

            <!-- HEADER -->
            <div class="modal-header modal-head-per">

               <div>
                  <h1 class="modal-title fs-4 fw-bold mb-1">
                     Evaluación NOM-035
                  </h1>

                  <div class="small opacity-75">
                     Industrias Alfa · Enero 2026
                  </div>
               </div>

               <button type="button"
                       class="btn btn-outline-light btn-sm btn-redondo"
                       data-bs-dismiss="modal">

                  <i class="bi bi-x-lg"></i>

               </button>

            </div>

            <!-- BODY -->
            <div class="modal-body bg-light">

               <!-- ESTADO GENERAL -->
               <div id="resumen_general"></div>

               <!-- DISTRIBUCIÓN RIESGO -->
               <div class="mt-4">
                  <div id="indicadores_evaluacion"></div>
               </div>

               <!-- LISTADO -->
               <div class="mt-4">

                  <div class="d-flex justify-content-between align-items-center mb-3">

                     <div>
                        <h5 class="fw-bold mb-0">
                           Trabajadores Evaluados
                        </h5>

                        <div class="small text-muted">
                           Resultados individuales aplicados
                        </div>
                     </div>

                     <button class="btn btn-outline-dark btn-sm">
                        <i class="bi bi-funnel"></i>
                        Filtrar
                     </button>

                  </div>

                  <div id="listado_resultados"></div>

               </div>

            </div>

         </div>

      </div>
   </div>`;

   $('#modalAdminExt').html(html);

   $('#modalResultadosEvaluacion').modal('show');

   setTimeout(() => {

      renderResumenGeneral();
      renderIndicadoresEvaluacion();
      renderListadoResultados();

   }, 100);
};

const renderResumenGeneral = () => {

   $('#resumen_general').html(`
      <div class="card border-0 shadow-sm">

         <div class="card-body">

            <div class="row text-center">

               <div class="col-6 col-md-3 mb-3">

                  <div class="small text-muted">
                     Asignados
                  </div>

                  <div class="fs-2 fw-bold">
                     10
                  </div>

               </div>

               <div class="col-6 col-md-3 mb-3">

                  <div class="small text-muted">
                     Completados
                  </div>

                  <div class="fs-2 fw-bold text-success">
                     8
                  </div>

               </div>

               <div class="col-6 col-md-3 mb-3">

                  <div class="small text-muted">
                     Pendientes
                  </div>

                  <div class="fs-2 fw-bold text-dark">
                     2
                  </div>

               </div>

               <div class="col-6 col-md-3 mb-3">

                  <div class="small text-muted">
                     Avance
                  </div>

                  <div class="fs-2 fw-bold text-primary">
                     80%
                  </div>

               </div>

            </div>

         </div>

      </div>
   `);
};

const renderIndicadoresEvaluacion = () => {

   const indicadores = [
      {
         titulo: 'Muy Alto',
         total: 2,
         color: 'danger',
         icono: 'bi-exclamation-triangle-fill'
      },
      {
         titulo: 'Alto',
         total: 3,
         color: 'warning',
         icono: 'bi-exclamation-octagon-fill'
      },
      {
         titulo: 'Medio',
         total: 2,
         color: 'secondary',
         icono: 'bi-dash-circle-fill'
      },
      {
         titulo: 'Bajo',
         total: 1,
         color: 'success',
         icono: 'bi-check-circle-fill'
      }
   ];

   let html = `
      <div class="mb-3">

         <h5 class="fw-bold mb-0">
            Distribución de Riesgo
         </h5>

         <div class="small text-muted">
            Resultado global de trabajadores evaluados
         </div>

      </div>

      <div class="row g-3">
   `;

   indicadores.forEach(item => {

      html += `
      <div class="col-6 col-md-3">

         <div class="card border-0 shadow-sm h-100">

            <div class="card-body">

               <div class="d-flex justify-content-between align-items-center">

                  <div>

                     <div class="small text-muted mb-1">
                        ${item.titulo}
                     </div>

                     <div class="fs-3 fw-bold text-${item.color}">
                        ${item.total}
                     </div>

                  </div>

                  <div class="text-${item.color} opacity-75">
                     <i class="bi ${item.icono} fs-2"></i>
                  </div>

               </div>

            </div>

         </div>

      </div>
      `;
   });

   html += `</div>`;

   $('#indicadores_evaluacion').html(html);
};

const renderListadoResultados = () => {

   const resultados = [

      {
         empleado: 'Juan Pérez',
         departamento: 'Producción',
         guia: 'Guía I',
         nivel: 'Muy Alto'
      },

      {
         empleado: 'Ana López',
         departamento: 'RH',
         guia: 'Guía I',
         nivel: 'Bajo'
      },

      {
         empleado: 'Carlos Méndez',
         departamento: 'Operaciones',
         guia: 'Guía III',
         nivel: 'Alto'
      },

      {
         empleado: 'María Ruiz',
         departamento: 'Ventas',
         guia: 'Guía I',
         nivel: 'Medio'
      },

      {
         empleado: 'José Hernández',
         departamento: 'Logística',
         guia: 'Guía I',
         nivel: 'Alto'
      },

      {
         empleado: 'Fernanda Torres',
         departamento: 'Compras',
         guia: 'Guía I',
         nivel: 'Muy Alto'
      },

      {
         empleado: 'Luis García',
         departamento: 'Finanzas',
         guia: 'Guía I',
         nivel: 'Medio'
      },

      {
         empleado: 'Patricia León',
         departamento: 'Calidad',
         guia: 'Guía I',
         nivel: 'Alto'
      }

   ];

   const obtenerConfig = (nivel) => {

      const niveles = {

         'Muy Alto': {
            color: 'danger',
            icono: 'bi-exclamation-triangle-fill'
         },

         'Alto': {
            color: 'warning',
            icono: 'bi-exclamation-octagon-fill'
         },

         'Medio': {
            color: 'secondary',
            icono: 'bi-dash-circle-fill'
         },

         'Bajo': {
            color: 'success',
            icono: 'bi-check-circle-fill'
         }
      };

      return niveles[nivel];
   };

   let html = `
      <div class="row g-3">
   `;

   resultados.forEach(item => {

      const config = obtenerConfig(item.nivel);

      html += `
      <div class="col-md-6 col-xl-4">

         <div class="card border-0 shadow-sm h-100 pointer">

            <div class="card-body">

               <div class="d-flex justify-content-between align-items-start">

                  <div>

                     <div class="fw-bold fs-5">
                        ${item.empleado}
                     </div>

                     <div class="small text-muted">
                        ${item.departamento}
                     </div>

                  </div>

                  <div class="text-${config.color}">
                     <i class="bi ${config.icono} fs-4"></i>
                  </div>

               </div>

               <hr>

               <div class="mb-2">

                  <div class="small text-muted">
                     Guía aplicada
                  </div>

                  <div class="fw-semibold">
                     ${item.guia}
                  </div>

               </div>

               <div class="mb-3">

                  <div class="small text-muted">
                     Nivel detectado
                  </div>

                  <span class="badge bg-${config.color}">
                     ${item.nivel}
                  </span>

               </div>

               <button class="btn btn-outline-dark btn-sm w-100">
                  <i class="bi bi-bar-chart-line"></i>
                  Ver resultado completo
               </button>

            </div>

         </div>

      </div>`;
   });

   html += `</div>`;

   $('#listado_resultados').html(html);
};


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ RESULTADOS GLOBALES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ModalResultadosGlobales = (origen) => {

   let html = `
   <div class="modal fade modal-superior-blur"
        id="modalResultadosGlobales"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1">

      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content border-0 shadow-lg">
            <!-- HEADER -->
            <div class="modal-header modal-head-per">
               <div>
                  <h1 class="modal-title fs-3 fw-bold mb-1">
                     Resultados Globales NOM-035
                  </h1>
               </div>

               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal"> 
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <!-- BODY -->
            <div class="modal-body bg-light">
               <!-- EXPEDIENTE -->
               <div class="p-3 rounded-3 border-start border-4 border-warning bg-white shadow-sm mb-4">
                  <div class="row align-items-center">
                     <div class="col-lg-7 mb-3 mb-lg-0">
                        <h4 class="text-dark fw-bold mb-0">
                           Industrias Alfa S.A. de C.V.
                        </h4>
                        <small class="text-muted">
                           Resultados Globales
                        </small>
                     </div>

                     <div class="col-lg-5 text-lg-end">
                        <span class="badge rounded-pill bg-mostaza bg-opacity-10 text-dark border border-mostaza p-2">
                           <i class="bi bi-folder2-open me-1"></i>
                           Expediente Digital
                           <select name="anioExpediente" id="anioExpediente" class="border-0 p-1 ms-2 bg-white">
                              <option value="2026">2026</option>
                              <option value="2025">2025</option>
                           </select>
                        </span>
                     </div>
                  </div>
               </div>`;

               if(1 == 1 ) {
                  html+=`
                  <!-- BARRA DE ACCIONES -->
                  <div class="card border-0 shadow-sm mb-4">
                     <div class="card-body py-3">
                        <div class="d-flex flex-wrap gap-2">
                           <button class="btn btn-dark btn-redondo" onclick="ModalAdjuntarPrograma();">
                              <i class="bi bi-clipboard2-plus me-2"></i>
                              Adjuntar Programa
                           </button>
                           <button class="btn btn-outline-dark btn-redondo" onclick="ModalImplementacionSeguimientoNom35();">
                              <i class="bi bi-ui-checks-grid me-2"></i>
                              Implementación y Seguimiento
                           </button>
                           <button class="btn btn-outline-dark btn-redondo" onclick="ModalReporteEjecutivoNom35();">
                              <i class="bi bi-file-earmark-text me-2"></i>
                              Reporte Ejecutivo
                           </button>
                        </div>
                     </div>
                  </div>`;
               }

               html+=`
               <!-- RESUMEN -->
               <div id="resumen_global_nom35"></div>

               <!-- TABS -->
               <div class="mt-4 text-center">
                  <ul class="nav nav-pills gap-2 flex-wrap justify-content-center" id="tabs_guias_nom35">
                     <li class="nav-item">
                        <button class="btn btn-outline-success active btn-redondo"onclick="renderResultadosGuia('I')">
                           Guía I
                        </button>
                     </li>
                     <li class="nav-item">
                        <button class="btn btn-outline-success btn-redondo" onclick="renderResultadosGuia('II')">
                           Guía II
                        </button>
                     </li>
                     <li class="nav-item">
                        <button class="btn btn-outline-success btn-redondo" onclick="renderResultadosGuia('III')">
                           Guía III
                        </button>
                     </li>
                  </ul>
               </div>

               <!-- CONTENIDO -->
               <div class="mt-4">
                  <div id="contenido_resultados_guia"></div>
               </div>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);

   $('#modalResultadosGlobales').modal('show');

   setTimeout(() => {

      renderResumenGlobalNom35();
      renderResultadosGuia('I');

   }, 100);
};

const renderResumenGlobalNom35 = () => {

   $('#resumen_global_nom35').html(`
      <div class="card border-0 shadow-sm">

         <div class="card-body">

            <div class="row text-center">

               <div class="col-6 col-md-3 mb-3">

                  <div class="small text-muted">
                     Evaluaciones
                  </div>

                  <div class="fs-2 fw-bold">
                     4
                  </div>

               </div>

               <div class="col-6 col-md-3 mb-3">

                  <div class="small text-muted">
                     Trabajadores Evaluados
                  </div>

                  <div class="fs-2 fw-bold text-primary">
                     84
                  </div>

               </div>

               <div class="col-6 col-md-3 mb-3">

                  <div class="small text-muted">
                     Guías Aplicadas
                  </div>

                  <div class="fs-2 fw-bold text-dark">
                     3
                  </div>

               </div>

               <div class="col-6 col-md-3 mb-3">

                  <div class="small text-muted">
                     Riesgo Organizacional
                  </div>

                  <div class="fs-2 fw-bold text-danger">
                     Alto
                  </div>

               </div>

            </div>

         </div>

      </div>
   `);
};

const renderResultadosGuia = (guia) => {

   let html = ``;

   html += `
      <div class="card border-0 shadow-sm">

         <div class="card-body">

            <!-- HEADER -->
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

               <div>

                  <h4 class="fw-bold mb-1">
                     Guía de Referencia ${guia}
                  </h4>

                  <div class="small text-muted">
                     Resultados organizacionales agrupados por estructura NOM-035
                  </div>

               </div>

               <button class="btn btn-outline-dark btn-sm">

                  <i class="bi bi-file-earmark-pdf"></i>
                  Exportar PDF

               </button>

            </div>

            <!-- RESUMEN RIESGO -->
            <div class="row g-3 mb-5">

               <div class="col-6 col-md-3">

                  <div class="card border-0 bg-danger bg-opacity-10">

                     <div class="card-body text-center">

                        <div class="small text-muted">
                           Muy Alto
                        </div>

                        <div class="fs-3 fw-bold text-danger">
                           12
                        </div>

                     </div>

                  </div>

               </div>

               <div class="col-6 col-md-3">

                  <div class="card border-0 bg-warning bg-opacity-10">

                     <div class="card-body text-center">

                        <div class="small text-muted">
                           Alto
                        </div>

                        <div class="fs-3 fw-bold text-warning">
                           26
                        </div>

                     </div>

                  </div>

               </div>

               <div class="col-6 col-md-3">

                  <div class="card border-0 bg-secondary bg-opacity-10">

                     <div class="card-body text-center">

                        <div class="small text-muted">
                           Medio
                        </div>

                        <div class="fs-3 fw-bold text-secondary">
                           34
                        </div>

                     </div>

                  </div>

               </div>

               <div class="col-6 col-md-3">

                  <div class="card border-0 bg-success bg-opacity-10">

                     <div class="card-body text-center">

                        <div class="small text-muted">
                           Bajo
                        </div>

                        <div class="fs-3 fw-bold text-success">
                           12
                        </div>

                     </div>

                  </div>

               </div>

            </div>

            <!-- CATEGORÍAS -->
            <div class="mb-5">

               <div class="d-flex align-items-center gap-2 mb-3">

                  <i class="bi bi-diagram-3 fs-5"></i>

                  <h5 class="fw-bold mb-0">
                     Categorías
                  </h5>

               </div>

               <div class="row g-3">

                  ${renderCardResultado(
                     'Ambiente de trabajo',
                     'Medio',
                     18,
                     '14 - 20'
                  )}

                  ${renderCardResultado(
                     'Factores propios de la actividad',
                     'Alto',
                     27,
                     '23 - 30'
                  )}

                  ${renderCardResultado(
                     'Organización del tiempo',
                     'Muy Alto',
                     35,
                     '29 - 40'
                  )}

                  ${renderCardResultado(
                     'Liderazgo y relaciones',
                     'Medio',
                     16,
                     '13 - 20'
                  )}

               </div>

            </div>

            <!-- DOMINIOS -->
            <div class="mb-5">

               <div class="d-flex align-items-center gap-2 mb-3">

                  <i class="bi bi-grid-1x2 fs-5"></i>

                  <h5 class="fw-bold mb-0">
                     Dominios
                  </h5>

               </div>

               <div class="row g-3">

                  ${renderCardResultado(
                     'Carga de trabajo',
                     'Muy Alto',
                     34,
                     '29 - 40'
                  )}

                  ${renderCardResultado(
                     'Jornadas de trabajo',
                     'Alto',
                     21,
                     '17 - 28'
                  )}

                  ${renderCardResultado(
                     'Interferencia trabajo-familia',
                     'Medio',
                     14,
                     '11 - 16'
                  )}

                  ${renderCardResultado(
                     'Violencia laboral',
                     'Bajo',
                     5,
                     '0 - 6'
                  )}

               </div>

            </div>

            <!-- DIMENSIONES -->
            <div>

               <div class="d-flex align-items-center gap-2 mb-3">

                  <i class="bi bi-bar-chart fs-5"></i>

                  <h5 class="fw-bold mb-0">
                     Dimensiones
                  </h5>

               </div>

               <div class="row g-3">

                  ${renderCardResultado(
                     'Distribución de carga mental',
                     'Alto',
                     23,
                     '19 - 28'
                  )}

                  ${renderCardResultado(
                     'Rotación de turnos',
                     'Medio',
                     14,
                     '11 - 16'
                  )}

                  ${renderCardResultado(
                     'Reconocimiento del desempeño',
                     'Bajo',
                     7,
                     '0 - 10'
                  )}

                  ${renderCardResultado(
                     'Claridad de funciones',
                     'Medio',
                     15,
                     '12 - 18'
                  )}

               </div>

            </div>

         </div>

      </div>
   `;

   $('#contenido_resultados_guia').html(html);
};

const renderCardResultado = (
   titulo,
   nivel,
   puntaje,
   rango = ''
) => {

   const config = obtenerConfigResultado(nivel);

   return `
      <div class="col-md-6 col-xl-3">

         <div class="card border-0 shadow-sm h-100">

            <div class="card-body">

               <!-- HEADER -->
               <div class="d-flex justify-content-between align-items-start mb-3">

                  <div class="fw-semibold lh-sm">
                     ${titulo}
                  </div>

                  <div class="text-${config.color}">

                     <i class="bi ${config.icono} fs-5"></i>

                  </div>

               </div>

               <!-- PUNTAJE -->
               <div class="mb-2">

                  <div class="display-6 fw-bold text-${config.color} lh-1">
                     ${puntaje}
                  </div>

                  <div class="small text-muted">
                     Puntaje obtenido
                  </div>

               </div>

               <!-- NIVEL -->
               <div class="mb-2">

                  <span class="badge bg-${config.color}">
                     ${nivel}
                  </span>

               </div>

               <!-- RANGO -->
               ${
                  rango
                  ?
                  `
                  <div class="small text-muted mt-3">

                     Rango NOM35:
                     <span class="fw-semibold">
                        ${rango}
                     </span>

                  </div>
                  `
                  :
                  ''
               }

            </div>

         </div>

      </div>
   `;
};

const obtenerConfigResultado = (nivel) => {

   const niveles = {

      'Muy Alto': {
         color: 'danger',
         icono: 'bi-exclamation-triangle-fill'
      },

      'Alto': {
         color: 'warning',
         icono: 'bi-exclamation-octagon-fill'
      },

      'Medio': {
         color: 'secondary',
         icono: 'bi-dash-circle-fill'
      },

      'Bajo': {
         color: 'success',
         icono: 'bi-check-circle-fill'
      }
   };

   return niveles[nivel];
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FASE 2 SEGUIMIENTO, IMPLEMENTACION ETC ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ModalAdjuntarPrograma = () => {

   let html = `
   <div class="modal fade modal-superior-blur" id="modalAdjuntarPrograma" data-bs-backdrop="static" data-bs-keyboard="false"tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
         <div class="modal-content border-0 shadow-lg">
            <!-- HEADER -->
            <div class="modal-header modal-head-per">
               <div>
                  <h1 class="modal-title fs-4 fw-bold mb-1">
                     Adjuntar Programa NOM-035
                  </h1>
                  <div class="small opacity-75">
                     Expediente Digital · Industrias Alfa S.A. de C.V.
                  </div>
               </div>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>

            <!-- BODY -->
            <div class="modal-body bg-light">
               <!-- INFO GENERAL -->
               <div class="p-3 rounded-3 bg-white border shadow-sm mb-4">
                  <div class="row g-3">
                     <div class="col-md-4">
                        <div class="small text-muted">
                           Empresa
                        </div>
                        <div class="fw-semibold">
                           Industrias Alfa S.A. de C.V.
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="small text-muted">
                           Ejercicio
                        </div>
                        <div class="fw-semibold">
                           2026
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="small text-muted">
                           Fecha actual
                        </div>
                        <div class="fw-semibold">
                           13/05/2026
                        </div>
                     </div>
                  </div>
               </div>

               <!-- PROGRAMA VIGENTE -->
               <div class="card border-0 shadow-sm mb-4 border-start border-4 border-success">
                  <div class="card-body">
                     <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div>
                           <div class="d-flex align-items-center gap-2 mb-2">
                              <i class="bi bi-patch-check-fill text-success"></i>
                              <h5 class="fw-bold mb-0">
                                 Programa vigente
                              </h5>
                           </div>
                           <div class="fw-semibold fs-5">
                              Programa_NOM35_2026_v2.pdf
                           </div>
                           <div class="small text-muted mt-1">
                              Programa de intervención ·
                              Registrado el 13/05/2026 ·
                              Versión 2
                           </div>
                        </div>

                        <div class="d-flex gap-2">
                           <button class="btn btn-outline-dark btn-sm">
                              <i class="bi bi-eye me-1"></i>Ver
                           </button>
                           <button class="btn btn-dark btn-sm">
                              <i class="bi bi-download me-1"></i>Descargar
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- HISTORIAL -->
               <div class="card border-0 shadow-sm mb-4">
                  <div class="card-header bg-white border-0 py-3">
                     <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-clock-history"></i>
                        <h5 class="fw-bold mb-0">
                           Historial documental
                        </h5>
                     </div>
                  </div>
                  <div class="card-body pt-0">
                     <div class="table-responsive">
                        <table class="table align-middle">
                           <thead>
                              <tr>
                                 <th>Documento</th>
                                 <th>Versión</th>
                                 <th>Fecha</th>
                                 <th>Estatus</th>
                                 <th width="140">Acciones</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>
                                    <div class="fw-semibold">
                                       Programa_NOM35_2026_v2.pdf
                                    </div>
                                    <div class="small text-muted">
                                       Programa de intervención
                                    </div>
                                 </td>
                                 <td>v2</td>
                                 <td>13/05/2026</td>
                                 <td>
                                    <span class="badge bg-success">
                                       Vigente
                                    </span>
                                 </td>
                                 <td>
                                    <div class="d-flex gap-2">
                                       <button class="btn btn-outline-dark btn-sm">
                                          <i class="bi bi-eye"></i>
                                       </button>
                                       <button class="btn btn-outline-dark btn-sm">
                                          <i class="bi bi-download"></i>
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                              <tr>
                                 <td>
                                    <div class="fw-semibold">
                                       Programa_NOM35_2026_v1.pdf
                                    </div>
                                    <div class="small text-muted">
                                       Programa inicial
                                    </div>
                                 </td>
                                 <td>v1</td>
                                 <td>05/05/2026</td>
                                 <td>
                                    <span class="badge bg-secondary">
                                       Histórico
                                    </span>
                                 </td>
                                 <td>
                                    <div class="d-flex gap-2">
                                       <button class="btn btn-outline-dark btn-sm">
                                          <i class="bi bi-eye"></i>
                                       </button>
                                       <button class="btn btn-outline-dark btn-sm">
                                          <i class="bi bi-download"></i>
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
               <!-- NUEVA VERSIÓN -->
               <div class="card border-0 shadow">
                  <div class="card-header bg-white border-0 py-3">
                     <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-cloud-arrow-up"></i>
                        <h5 class="fw-bold mb-0">
                           Registrar nueva versión
                        </h5>
                     </div>
                  </div>
                  <div class="card-body">
                     <div class="row g-4">
                        <!-- TIPO -->
                        <div class="col-md-6">
                           <label class="form-label fw-semibold">
                              Tipo de documento
                           </label>
                           <select class="form-select">
                              <option value="programa">
                                 Programa de intervención
                              </option>
                           </select>
                        </div>

                        <!-- FECHA -->
                        <div class="col-md-6">
                           <label class="form-label fw-semibold">
                              Fecha del documento
                           </label>
                           <input type="date" class="form-control">
                        </div>

                        <!-- NOMBRE -->
                        <div class="col-12">
                           <label class="form-label fw-semibold">
                              Nombre del documento
                           </label>
                           <input type="text" class="form-control" placeholder="Ej. Programa_NOM35_2026_v3">
                        </div>

                        <!-- OBSERVACIONES -->
                        <div class="col-12">
                           <label class="form-label fw-semibold">
                              Observaciones
                           </label>
                           <textarea class="form-control" rows="4" placeholder="Describe cambios, ajustes o comentarios sobre esta nueva versión..."></textarea>
                        </div>

                        <!-- ARCHIVO -->
                        <div class="col-12">
                           <label class="form-label fw-semibold">
                              Archivo
                           </label>
                           <div class="border rounded-3 bg-white p-4 text-center">
                              <div class="mb-3 text-secondary">
                                 <i class="bi bi-file-earmark-arrow-up fs-1"></i>
                              </div>                              
                              <div class="fw-semibold mb-2">
                                 Selecciona el archivo
                              </div>
                              <div class="small text-muted mb-3">
                                 PDF, DOCX o XLSX
                              </div>
                              <input type="file" id="archivoPrograma" class="form-control">
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <!-- FOOTER -->
            <div class="modal-footer bg-light border-0">
               <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cancelar
               </button>
               <button type="button" class="btn btn-dark btn-redondo">
                  <i class="bi bi-floppy me-2"></i>
                  Registrar nueva versión
               </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminExt').html(html);
   $('#modalAdjuntarPrograma').modal('show');
};

const ModalImplementacionSeguimientoNom35 = () => {

   let html = `
   <div class="modal fade modal-superior-blur" id="ModalImplementacionSeguimientoNom35" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content border-0 shadow-lg">
            <!-- HEADER -->
            <div class="modal-header modal-head-per">
               <div>
                  <h1 class="modal-title fs-3 fw-bold mb-1">
                     Implementación y Seguimiento
                  </h1>
                  <div class="small opacity-75">
                     Expediente Digital · Industrias Alfa S.A. de C.V.
                  </div>
               </div>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>

            <!-- BODY -->
            <div class="modal-body bg-light">

               <!-- RESUMEN -->
               <div class="row g-3 mb-4">

                  <div class="col-md-3">
                     <div class="card border-0 shadow h-100">
                        <div class="card-body">
                           <div class="small text-muted mb-2">
                              Actividades registradas
                           </div>
                           <div class="fs-2 fw-bold">
                              12
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="col-md-3">
                     <div class="card border-0 shadow h-100 border-start border-4 border-success">
                        <div class="card-body">
                           <div class="small text-muted mb-2">
                              Completadas
                           </div>
                           <div class="fs-2 fw-bold text-success">
                              8
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="col-md-3">
                     <div class="card border-0 shadow h-100 border-start border-4 border-warning">
                        <div class="card-body">
                           <div class="small text-muted mb-2">
                              En proceso
                           </div>
                           <div class="fs-2 fw-bold text-warning">
                              3
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="col-md-3">
                     <div class="card border-0 shadow h-100 border-start border-4 border-danger">
                        <div class="card-body">
                           <div class="small text-muted mb-2">
                              Vencidas
                           </div>
                           <div class="fs-2 fw-bold text-danger">
                              1
                           </div>
                        </div>
                     </div>
                  </div>

               </div>

               <!-- FORMULARIO -->
               <div class="card border-0 shadow mb-4">

                  <div class="card-header bg-white border-0 py-3">
                     <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-ui-checks-grid"></i>
                        <h5 class="fw-bold mb-0">
                           Registrar actividad de implementación
                        </h5>
                     </div>
                  </div>

                  <div class="card-body">

                     <div class="row g-4">

                        <div class="col-md-6">
                           <label class="form-label fw-semibold">
                              Actividad
                           </label>

                           <input type="text" class="form-control" placeholder="Ej. Taller de liderazgo operativo">
                        </div>

                        <div class="col-md-3">
                           <label class="form-label fw-semibold">
                              Tipo
                           </label>

                           <select class="form-select">
                              <option value="">Seleccionar</option>
                              <option>Capacitación</option>
                              <option>Campaña interna</option>
                              <option>Evaluación interna</option>
                              <option>Ajuste organizacional</option>
                              <option>Reunión</option>
                           </select>
                        </div>

                        <div class="col-md-3">
                           <label class="form-label fw-semibold">
                              Estatus
                           </label>

                           <select class="form-select">
                              <option>Pendiente</option>
                              <option>En proceso</option>
                              <option>Completado</option>
                           </select>
                        </div>

                        <div class="col-md-4">
                           <label class="form-label fw-semibold">
                              Responsable
                           </label>

                           <input type="text" class="form-control" placeholder="Nombre del responsable">
                        </div>

                        <div class="col-md-4">
                           <label class="form-label fw-semibold">Fecha programada</label>
                           <input type="date" class="form-control">
                        </div>

                        <div class="col-md-4">
                           <label class="form-label fw-semibold">Relacionado con</label>

                           <select class="form-select">
                              <option value="">General</option>
                              <option>Carga de trabajo</option>
                              <option>Liderazgo</option>
                              <option>Violencia laboral</option>
                           </select>
                        </div>

                        <div class="col-12">
                           <label class="form-label fw-semibold">Descripción</label>
                           <textarea class="form-control" rows="4" placeholder="Describe la actividad realizada, alcance o comentarios relevantes..."></textarea>
                        </div>
                     </div>

                  </div>

                  <div class="card-footer bg-white border-0 text-end pb-4">
                     <button class="btn btn-dark btn-redondo">
                        <i class="bi bi-floppy me-2"></i>
                        Registrar actividad
                     </button>
                  </div>

               </div>

               <!-- LISTADO -->
               <div class="card border-0 shadow">
                  <div class="card-header bg-white border-0 py-3">
                     <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-2">
                           <i class="bi bi-list-check"></i>
                           <h5 class="fw-bold mb-0">Actividades registradas</h5>
                        </div>
                        <div>
                           <input type="text" class="form-control" placeholder="Buscar actividad...">
                        </div>
                     </div>
                  </div>

                  <div class="card-body">

                     <!-- ACTIVIDAD -->
                     <div class="border rounded-4 p-4 mb-3 bg-white">
                        <div class="row align-items-start">
                           <div class="col-lg-8">
                              <div class="d-flex align-items-center gap-2 mb-2">
                                 <span class="badge bg-success">Completado</span>
                                 <span class="badge bg-light text-dark border">Capacitación</span>
                              </div>

                              <h5 class="fw-bold mb-2">Taller de liderazgo operativo</h5>

                              <div class="text-muted small mb-3">
                                 Responsable:
                                 <strong>RH Corporativo</strong>
                                 · Fecha:
                                 <strong>12/06/2026</strong>
                              </div>
                              <p class="mb-3 text-secondary">
                                 Capacitación dirigida a líderes de área enfocada en comunicación organizacional y manejo de personal.
                              </p>
                           </div>

                           <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
                              <div class="d-flex flex-wrap gap-2 justify-content-lg-end">
                                 <button class="btn btn-outline-dark btn-sm btn-redondo" onclick="ModalGestionarSeguimiento();">
                                    <i class="bi bi-journal-check me-1"></i>Gestionar seguimiento
                                 </button>
                                 <button class="btn btn-outline-dark btn-sm btn-redondo">
                                    <i class="bi bi-pencil-square me-1"></i>Editar
                                 </button>
                                 <button class="btn btn-outline-danger btn-sm btn-redondo">
                                    <i class="bi bi-trash me-1"></i>Eliminar
                                 </button>
                              </div>
                           </div>
                        </div>

                     </div>

                     <!-- ACTIVIDAD -->
                     <div class="border rounded-4 p-4 mb-3 bg-white">
                        <div class="row align-items-start">
                           <div class="col-lg-8">
                              <div class="d-flex align-items-center gap-2 mb-2">
                                 <span class="badge bg-warning text-dark">En proceso</span>
                                 <span class="badge bg-light text-dark border">Campaña interna</span>
                              </div>

                              <h5 class="fw-bold mb-2">Campaña de comunicación organizacional</h5>

                              <div class="text-muted small mb-3">
                                 Responsable:
                                 <strong>Psicología Organizacional</strong>
                                 · Fecha:
                                 <strong>20/06/2026</strong>
                              </div>
                              <p class="mb-3 text-secondary">
                                 Difusión de materiales internos relacionados con factores de riesgo psicosocial.
                              </p>
                           </div>

                           <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
                              <div class="d-flex flex-wrap gap-2 justify-content-lg-end">
                                 <button class="btn btn-outline-dark btn-sm btn-redondo" onclick="ModalGestionarSeguimiento();">
                                    <i class="bi bi-journal-check me-1"></i>Gestionar seguimiento
                                 </button>
                                 <button class="btn btn-outline-dark btn-sm btn-redondo">
                                    <i class="bi bi-pencil-square me-1"></i>Editar
                                 </button>
                                 <button class="btn btn-outline-danger btn-sm btn-redondo">
                                    <i class="bi bi-trash me-1"></i>Eliminar
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminExt').html(html);
   $('#ModalImplementacionSeguimientoNom35').modal('show');
};

const ModalGestionarSeguimiento = () => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalGestionarSeguimiento" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
         <div class="modal-content border-0 shadow-lg">
            <!-- HEADER -->
            <div class="modal-header modal-head-per">
               <div>
                  <h1 class="modal-title fs-4 fw-bold mb-1">Seguimiento de Implementación</h1>
                  <div class="small opacity-75">
                     Taller de liderazgo operativo · Industrias Alfa S.A. de C.V.
                  </div>
               </div>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>

            <!-- BODY -->
            <div class="modal-body bg-light">
               <!-- RESUMEN ACTIVIDAD -->
               <div class="card border-0 shadow-sm mb-4">
                  <div class="card-body">
                     <div class="row g-3">
                        <div class="col-md-4">
                           <div class="small text-muted">
                              Estatus actual
                           </div>
                           <span class="badge bg-warning text-dark mt-1">
                              En proceso
                           </span>
                        </div>
                        <div class="col-md-4">
                           <div class="small text-muted">
                              Responsable
                           </div>
                           <div class="fw-semibold">
                              RH Corporativo
                           </div>
                        </div>
                        <div class="col-md-4">
                           <div class="small text-muted">
                              Fecha programada
                           </div>
                           <div class="fw-semibold">
                              12/06/2026
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- FORMULARIO -->
               <div class="card border-0 shadow-sm mb-4">
                  <div class="card-header bg-white border-0 py-3">
                     <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-journal-check"></i>
                        <h5 class="fw-bold mb-0">
                           Registrar seguimiento
                        </h5>
                     </div>
                  </div>
                  <div class="card-body">
                     <div class="row g-4">
                        <!-- AVANCE -->
                        <div class="col-md-4">
                           <label class="form-label fw-semibold">
                              Nivel de avance
                           </label>
                           <select class="form-select">
                              <option value="">Seleccionar</option>
                              <option>Inicio de actividad</option>
                              <option>Avance parcial</option>
                              <option>Actividad completada</option>
                           </select>
                        </div>

                        <!-- FECHA -->
                        <div class="col-md-4">
                           <label class="form-label fw-semibold">
                              Fecha del seguimiento
                           </label>
                           <input type="date" class="form-control">
                        </div>

                        <!-- ESTATUS -->
                        <div class="col-md-4">
                           <label class="form-label fw-semibold">
                              Actualizar estatus
                           </label>
                           <select class="form-select">
                              <option>Pendiente</option>
                              <option selected>En proceso</option>
                              <option>Completado</option>
                           </select>
                        </div>

                        <!-- OBSERVACIONES -->
                        <div class="col-12">
                           <label class="form-label fw-semibold">
                              Observaciones
                           </label>
                           <textarea class="form-control" rows="4" placeholder="Describe avances, resultados, incidencias o comentarios relevantes..."></textarea>
                        </div>

                        <!-- EVIDENCIA -->
                        <div class="col-12">
                           <label class="form-label fw-semibold">
                              Evidencia
                           </label>
                           <div class="border rounded-4 bg-white p-4 text-center">
                              <div class="mb-3 text-secondary">
                                 <i class="bi bi-cloud-arrow-up fs-1"></i>
                              </div>
                              <div class="fw-semibold mb-2">
                                 Selecciona tus archivos aquí
                              </div>
                              <div class="small text-muted mb-3">
                                 PDF, imágenes, constancias o documentos relacionados
                              </div>
                              <input type="file" class="form-control" multiple>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="card-footer bg-white border-0 text-end pb-4">
                     <button class="btn btn-dark btn-redondo">
                        <i class="bi bi-floppy me-2"></i>
                        Registrar seguimiento
                     </button>
                  </div>
               </div>

               <!-- HISTORIAL -->
               <div class="card border-0 shadow-sm">
                  <div class="card-header bg-white border-0 py-3">
                     <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-clock-history"></i>
                        <h5 class="fw-bold mb-0">
                           Historial de seguimiento
                        </h5>
                     </div>
                  </div>
                  <div class="card-body">
                     <!-- ITEM -->
                     <div class="border rounded-4 p-4 mb-3 bg-white">
                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                           <div>
                              <div class="d-flex align-items-center gap-2 mb-2">
                                 <span class="badge bg-warning text-dark">
                                    Avance parcial
                                 </span>
                                 <span class="badge bg-light text-dark border">
                                    En proceso
                                 </span>
                              </div>
                              <div class="fw-bold fs-5">
                                 Seguimiento registrado
                              </div>
                              <div class="small text-muted mt-1">
                                 10/06/2026 · RH Corporativo
                              </div>
                           </div>

                           <div class="d-flex gap-2">
                              <button class="btn btn-outline-dark btn-sm btn-redondo">
                                 <i class="bi bi-pencil-square"></i>
                              </button>
                              <button class="btn btn-outline-danger btn-sm btn-redondo">
                                 <i class="bi bi-trash"></i>
                              </button>
                           </div>
                        </div>
                        <div class="text-secondary mb-3">
                           Se realizó primera sesión de capacitación con supervisores de área y entrega inicial de material informativo.
                        </div>
                        <!-- ARCHIVOS -->
                        <div class="d-flex flex-wrap gap-2">
                           <span class="badge bg-light text-dark border p-2">
                              <i class="bi bi-image text-primary me-1"></i>
                              taller_1.jpg
                           </span>
                           <span class="badge bg-light text-dark border p-2">
                              <i class="bi bi-file-earmark-pdf text-danger me-1"></i>
                              lista_asistencia.pdf
                           </span>
                        </div>
                     </div>

                     <!-- ITEM -->
                     <div class="border rounded-4 p-4 bg-white">
                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                           <div>
                              <div class="d-flex align-items-center gap-2 mb-2">
                                 <span class="badge bg-success">
                                    Actividad completada
                                 </span>
                                 <span class="badge bg-success">
                                    Completado
                                 </span>
                              </div>
                              <div class="fw-bold fs-5">
                                 Cierre de actividad
                              </div>
                              <div class="small text-muted mt-1">
                                 15/06/2026 · Psicología Organizacional
                              </div>
                           </div>
                           <div class="d-flex gap-2">
                              <button class="btn btn-outline-dark btn-sm btn-redondo">
                                 <i class="bi bi-pencil-square"></i>
                              </button>
                              <button class="btn btn-outline-danger btn-sm btn-redondo">
                                 <i class="bi bi-trash"></i>
                              </button>
                           </div>
                        </div>

                        <div class="text-secondary mb-3">
                           Actividad concluida satisfactoriamente. Se entregaron constancias y se registró participación completa de líderes operativos.
                        </div>
                        <!-- ARCHIVOS -->
                        <div class="d-flex flex-wrap gap-2">
                           <span class="badge bg-light text-dark border p-2">
                              <i class="bi bi-file-earmark-text text-secondary me-1"></i>
                              constancias.docx
                           </span>
                           <span class="badge bg-light text-dark border p-2">
                              <i class="bi bi-file-earmark-pdf text-danger me-1"></i>
                              reporte_final.pdf
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminExt2').html(html);
   $('#modalGestionarSeguimiento').modal('show');
};

window.ModalResultadosEvaluacion           = ModalResultadosEvaluacion;
window.ModalResultadosGlobales             = ModalResultadosGlobales;

window.ModalAdjuntarPrograma               = ModalAdjuntarPrograma;
window.ModalImplementacionSeguimientoNom35 = ModalImplementacionSeguimientoNom35;
window.ModalGestionarSeguimiento           = ModalGestionarSeguimiento;

