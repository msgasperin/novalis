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

const ModalReporteEjecutivoNom35 = () => {

   let html = `
   <div class="modal fade modal-superior-blur"
        id="modalReporteEjecutivoNom35"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1">

      <div class="modal-dialog modal-fullscreen">

         <div class="modal-content border-0 shadow-lg">

            <!-- HEADER -->
            <div class="modal-header modal-head-per">

               <div>

                  <h1 class="modal-title fs-3 fw-bold mb-1">
                     Reporte Ejecutivo NOM-035
                  </h1>

                  <div class="small opacity-75">
                     Industrias Alfa S.A. de C.V. · Ejercicio 2026
                  </div>

               </div>

               <div class="d-flex align-items-center gap-2">

                  <button class="btn btn-outline-light btn-sm btn-redondo">

                     <i class="bi bi-printer me-1"></i>
                     Imprimir

                  </button>

                  <button class="btn btn-light btn-sm btn-redondo">

                     <i class="bi bi-file-earmark-pdf me-1"></i>
                     Exportar PDF

                  </button>

                  <button type="button"
                          class="btn btn-outline-light btn-sm btn-redondo"
                          data-bs-dismiss="modal">

                     <i class="bi bi-x-lg"></i>

                  </button>

               </div>

            </div>

            <!-- BODY -->
            <div class="modal-body bg-light">

               <!-- RESUMEN GENERAL -->
               <div class="row g-3 mb-4">

                  <div class="col-md-3">

                     <div class="card border-0 shadow-sm h-100">

                        <div class="card-body">

                           <div class="small text-muted mb-2">
                              Trabajadores evaluados
                           </div>

                           <div class="fs-2 fw-bold">
                              120
                           </div>

                        </div>

                     </div>

                  </div>

                  <div class="col-md-3">

                     <div class="card border-0 shadow-sm h-100 border-start border-4 border-danger">

                        <div class="card-body">

                           <div class="small text-muted mb-2">
                              Riesgo predominante
                           </div>

                           <div class="fs-4 fw-bold text-danger">
                              Riesgo Medio
                           </div>

                        </div>

                     </div>

                  </div>

                  <div class="col-md-3">

                     <div class="card border-0 shadow-sm h-100 border-start border-4 border-success">

                        <div class="card-body">

                           <div class="small text-muted mb-2">
                              Actividades completadas
                           </div>

                           <div class="fs-2 fw-bold text-success">
                              8
                           </div>

                        </div>

                     </div>

                  </div>

                  <div class="col-md-3">

                     <div class="card border-0 shadow-sm h-100 border-start border-4 border-warning">

                        <div class="card-body">

                           <div class="small text-muted mb-2">
                              Seguimientos registrados
                           </div>

                           <div class="fs-2 fw-bold text-warning">
                              15
                           </div>

                        </div>

                     </div>

                  </div>

               </div>

               <!-- RESULTADOS GLOBALES -->
               <div class="card border-0 shadow-sm mb-4">

                  <div class="card-header bg-white border-0 py-3">

                     <div class="d-flex align-items-center gap-2">

                        <i class="bi bi-bar-chart-line"></i>

                        <h5 class="fw-bold mb-0">
                           Resultados Globales
                        </h5>

                     </div>

                  </div>

                  <div class="card-body">

                     <div class="row g-4">

                        <div class="col-lg-4">

                           <div class="border rounded-4 p-4 h-100">

                              <div class="small text-muted mb-2">
                                 Categoría crítica detectada
                              </div>

                              <div class="fs-5 fw-bold text-danger">
                                 Liderazgo y relaciones laborales
                              </div>

                           </div>

                        </div>

                        <div class="col-lg-4">

                           <div class="border rounded-4 p-4 h-100">

                              <div class="small text-muted mb-2">
                                 Guía con mayor incidencia
                              </div>

                              <div class="fs-5 fw-bold">
                                 Guía de Referencia II
                              </div>

                           </div>

                        </div>

                        <div class="col-lg-4">

                           <div class="border rounded-4 p-4 h-100">

                              <div class="small text-muted mb-2">
                                 Nivel general detectado
                              </div>

                              <div class="fs-5 fw-bold text-warning">
                                 Riesgo Medio
                              </div>

                           </div>

                        </div>

                     </div>

                  </div>

               </div>

               <!-- IMPLEMENTACIÓN -->
               <div class="card border-0 shadow-sm mb-4">

                  <div class="card-header bg-white border-0 py-3">

                     <div class="d-flex align-items-center gap-2">

                        <i class="bi bi-ui-checks-grid"></i>

                        <h5 class="fw-bold mb-0">
                           Implementación y Seguimiento
                        </h5>

                     </div>

                  </div>

                  <div class="card-body">

                     <div class="row g-3">

                        <div class="col-md-4">

                           <div class="border rounded-4 p-4 h-100">

                              <div class="small text-muted mb-2">
                                 Actividades registradas
                              </div>

                              <div class="fs-2 fw-bold">
                                 12
                              </div>

                           </div>

                        </div>

                        <div class="col-md-4">

                           <div class="border rounded-4 p-4 h-100">

                              <div class="small text-muted mb-2">
                                 Actividad más recurrente
                              </div>

                              <div class="fw-bold fs-5">
                                 Capacitaciones internas
                              </div>

                           </div>

                        </div>

                        <div class="col-md-4">

                           <div class="border rounded-4 p-4 h-100">

                              <div class="small text-muted mb-2">
                                 Último seguimiento
                              </div>

                              <div class="fw-bold fs-5">
                                 15/06/2026
                              </div>

                           </div>

                        </div>

                     </div>

                  </div>

               </div>

               <!-- ACTIVIDADES RELEVANTES -->
               <div class="card border-0 shadow-sm mb-4">

                  <div class="card-header bg-white border-0 py-3">

                     <div class="d-flex align-items-center gap-2">

                        <i class="bi bi-clipboard2-check"></i>

                        <h5 class="fw-bold mb-0">
                           Actividades Relevantes
                        </h5>

                     </div>

                  </div>

                  <div class="card-body">

                     <div class="border rounded-4 p-4 mb-3">

                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">

                           <div>

                              <div class="fw-bold fs-5 mb-2">
                                 Taller de liderazgo operativo
                              </div>

                              <div class="small text-muted">

                                 Responsable:
                                 RH Corporativo

                                 · Estatus:
                                 Completado

                              </div>

                           </div>

                           <span class="badge bg-success">
                              Completado
                           </span>

                        </div>

                     </div>

                     <div class="border rounded-4 p-4">

                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">

                           <div>

                              <div class="fw-bold fs-5 mb-2">
                                 Campaña de comunicación organizacional
                              </div>

                              <div class="small text-muted">

                                 Responsable:
                                 Psicología Organizacional

                                 · Estatus:
                                 En proceso

                              </div>

                           </div>

                           <span class="badge bg-warning text-dark">
                              En proceso
                           </span>

                        </div>

                     </div>

                  </div>

               </div>

               <!-- CONCLUSIONES -->
               <div class="card border-0 shadow-sm">

                  <div class="card-header bg-white border-0 py-3">

                     <div class="d-flex align-items-center gap-2">

                        <i class="bi bi-journal-text"></i>

                        <h5 class="fw-bold mb-0">
                           Conclusión Ejecutiva
                        </h5>

                     </div>

                  </div>

                  <div class="card-body">

                     <textarea class="form-control"
                               rows="6"
                               placeholder="Escribe una conclusión ejecutiva general sobre los resultados obtenidos, actividades implementadas y estado actual del cumplimiento NOM-035..."></textarea>

                  </div>

               </div>

            </div>

         </div>

      </div>

   </div>`;

   $('#modalAdminExt').html(html);

   $('#modalReporteEjecutivoNom35').modal('show');
};

window.ModalImplementacionSeguimientoNom35 = ModalImplementacionSeguimientoNom35;
window.ModalGestionarSeguimiento           = ModalGestionarSeguimiento;
window.ModalReporteEjecutivoNom35          = ModalReporteEjecutivoNom35;

