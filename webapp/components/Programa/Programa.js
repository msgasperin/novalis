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

window.ModalAdjuntarPrograma               = ModalAdjuntarPrograma;


