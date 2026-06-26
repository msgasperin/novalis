// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES MODAL LISTADO EVALUACIONES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let dataEvaluaciones = [
   { id: '1', registro: '01-05-2026', aplicacion: '20-07-2026', hora:'12:00', personas: 15, tipo: 'Guía de referencia II', estatus: 'Programada', color: 'primary' },
   { id: '2', registro: '01-05-2026', aplicacion: '10-05-2026', hora:'12:00', personas: 15, tipo: 'Guía de referencia I', estatus: 'Aplicada', color: 'success' },
   { id: '3', registro: '01-05-2026', aplicacion: '20-06-2026', hora:'12:00', personas: 15, tipo: 'Guía de referencia I', estatus: 'Finalizada', color: 'dark' }
];

const TabEvaluaciones = () => {
   let optionAnios = comboAnios();
   activarLoad('Cargando evaluaciones...');
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-clipboard-data"></i> Evaluaciones</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevaCita" onclick="ModalResultadosGlobales(2);">Resultados Globales</button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" align="right">
         <div class="input-group">
            <select name="anioEvaluaciones" id="anioEvaluaciones" class="form-control">
               ${optionAnios}
            </select>
            <button class="btn btn-dark btn-lib" type="button" onclick="fn_obtiene_pedidos_fecha();"><i class="bi bi-arrow-clockwise"></i></button>
         </div>
      </div>
      <div class="col-xl-3 offset-xl-5 col-lg-3 offset-lg-5 col-md-4 offset-md-4 col-sm-6 col-12 mt-3" align="right">
         <div class="input-group">
            <input type="text" name="inpBusquedaEvaluaciones" id="inpBusquedaEvaluaciones" class="form-control border-end-0" placeholder="Buscar evaluaciones"  onkeyUp="fn_buscar_evaluaciones();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_evaluaciones"></div>
   </div>`;

   $('#containerMain').html(html);
   setTimeout(() => {
      pintarEvaluacionesPorCliente('listado_evaluaciones', 'Industrias Alfa', 2);
      closeLoad();
   }, 500);
}

const ModalFormEvaluacion = (cliente) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormEvaluacion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Registrar Nueva Evaluación: ${cliente}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-12 mt-3">
                     <b>Fecha de apliación *</b>
                     <input type="date" name="fechaAplicacion" id="fechaAplicacion" class="form-control">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Hora *</b>
                     <input type="time" name="horaEval" id="horaEval" class="form-control">
                  </div>
                  <div class="col-12 mt-2">
                     <b>Guía de evaluación *</b>
                     <select name="evaluacion" id="evaluacion" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Guía de evaluación I</option>
                        <option value="2">Guía de evaluación II</option>
                        <option value="3">Guía de evaluación III</option>
                     </select>
                  </div>
                  <div class="col-12 mt-3">
                     <b>No. Personas *</b>
                     <input type="text" inputmode="numeric" name="noPersonas" id="noPersonas" class="form-control" onkeypress="return fnValidaNumeros(event);">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Observación</b>
                     <textarea name="obsEval" id="obsEval" class="form-control" rows="2" maxlength="200"></textarea>
                  </div>
               </div>                     
            </div>
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" onclick="fn_nueva_evaluacion('${cliente}');">
                  Registrar Evaluación
               </button>
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminExt').html(html);
   $('#modalFormEvaluacion').modal('show');
   $('.select2').select2({
      dropdownParent: $('#modalFormEvaluacion'),
      theme: 'bootstrap-5'
   });
   $('.select2').on('select2:open', function () {
      setTimeout(() => {
         let input = document.querySelector('.select2-container--open .select2-search__field');
         if (input) input.focus();
      }, 10);
   });
   setTimeout(() => {
      //Se cargará el catálogo de pacientes
   }, 100);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES EVALUACIONES POR CLIENTE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalEvaluacionesPorCliente = (cliente) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalEvaluacionesCliente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Evaluaciones</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body bg-light">
               <div class="p-3 rounded-3 border-start border-4 border-warning bg-white shadow-sm mb-4">
                  <div class="row">
                     <div class="col-7">
                        <h4 class="text-dark fw-bold mb-0">${cliente}</h4>
                        <small class="text-muted">Historial de evaluaciones del cliente</small>
                     </div>
                     <div class="col-5 text-end">
                        <span class="badge rounded-pill bg-mostaza bg-opacity-10 text-dark border border-mostaza">
                           <i class="bi bi-folder2-open me-1"></i> Expediente Digital
                           <select name="anioExpediente" id="anioExpediente" class="border-0 p-2 ms-2 bg-white">
                              <option value="2026">2026</option>
                              <option value="2025">2025</option>
                           </select>
                        </span>
                        <button class="btn btn-dark btn-lib btn-redondo fs-7 ms-2" type="button" id="btnNuevaCita" onclick="ModalFormEvaluacion('${cliente}');">
                           <i class="bi bi-plus-lg"></i> Nueva evaluación
                        </button>
                     </div>
                  </div>
               </div>
               <div id="listado_evaluaciones_cliente"></div>
            </div>
            <div class="modal-footer bg-light">
               <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">Cerrar</button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalEvaluacionesCliente').modal('show');
   
   // Llamamos a la función para pintar las evaluaciones dentro de la modal
   pintarEvaluacionesPorCliente('listado_evaluaciones_cliente', cliente, 1);
}

const pintarEvaluacionesPorCliente = (containerId, clienteNombre, origen) => {
   const contenedor = document.getElementById(containerId);
   
   const obtenerEstiloResultado = (nivel) => {
      const mapeo = {
         'Muy Alto': { color: '#8b0000', icono: 'bi-exclamation-triangle-fill' },
         'Alto':     { color: '#cc5500', icono: 'bi-exclamation-octagon-fill' },
         'Medio':    { color: '#b8860b', icono: 'bi-info-circle-fill' },
         'Bajo':     { color: '#1e5631', icono: 'bi-check-circle-fill' },
         'Nulo':     { color: '#4a4a4a', icono: 'bi-slash-circle' }
      };
      return mapeo[nivel] || mapeo['Nulo'];
   };

   let html = `<div class="row g-3">`;

   dataEvaluaciones.forEach(ev => {
      let htmlResultado = '';
      
      if (ev.estatus === 'Aplicada' && ev.resultado) {
          const estilo = obtenerEstiloResultado(ev.resultado);
          htmlResultado = `
          <div class="mt-auto pt-2"> <!-- mt-auto empuja el resultado al final del card -->
            <div class="p-1 px-2 rounded-2 d-flex align-items-center justify-content-between" 
                  style="background-color: ${estilo.color}10; border: 1px dashed ${estilo.color}40;">
               <small style="color: ${estilo.color}; font-size: 0.7rem;" class="fw-bold">
                  <i class="bi ${estilo.icono} me-1"></i> ${ev.resultado.toUpperCase()}
               </small>
            </div>
          </div>`;
      } else {
          // Placeholder opcional para mantener la simetría perfecta si se desea
          htmlResultado = `<div class="mt-auto pt-2" style="visibility: hidden;">
                             <div class="p-1 px-2"><small>&nbsp;</small></div>
                           </div>`;
      }

      html += `
      <div class="col-12 col-md-4">
         <div class="card h-100 shadow border-0 border-bottom border-3 border-${ev.color}">
            <div class="card-body p-3 d-flex flex-column"> <!-- flex-column permite usar mt-auto -->
               <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge rounded-pill bg-${ev.color} bg-opacity-10 text-${ev.color} fs-9">
                        ${ev.estatus}
                  </span>
                  <small class="text-muted fs-9">#${ev.id}</small>
               </div>
               
               <h6 class="fw-bold mb-1" style="font-size: 0.9rem;">${ev.tipo}</h6>
               
               <div class="d-flex gap-3 mt-2 mb-2">
                  <div>
                        <p class="text-secondary mb-0" style="font-size: 0.7rem;">Aplicación</p>
                        <small class="fw-medium">${ev.aplicacion}</small>
                  </div>
                  <div class="border-start ps-3">
                        <p class="text-secondary mb-0" style="font-size: 0.7rem;">Personal</p>
                        <small class="fw-medium">${ev.personas} pers.</small>
                  </div>
               </div>

               ${htmlResultado}
            </div>
            <div class="card-footer bg-white border-top-0 pb-3">
               <div class="d-flex justify-content-end gap-2">`;
                  if (ev.estatus === 'Aplicada' || ev.estatus === 'Finalizada') {
                     html+=`
                     <button class="btn btn-sm btn-menta px-3 btn-redondo" onclick="ModalResultadosEvaluacion();">
                        Ver Resultados
                     </button>`;
                  }
                  
                  if (origen == 1 && ev.estatus === 'Programada') {
                     html+=`
                     <button class="btn btn-sm btn-mostaza btn-redondo" title="Aplicar test" onclick="ModalAplicarEvaluacion(0, '${clienteNombre}');">
                        Aplicar test
                     </button>
                     <button class="btn btn-sm btn-menta btn-redondo ms-1" title="Marcar como aplicada" onclick="fn_marcar_aplicada('${clienteNombre}');">
                        <i class="bi bi-check-lg"></i>
                     </button>
                     <button class="btn btn-sm btn-outline-secondary btn-redondo ms-1" title="Editar" onclick="ModalFormEvaluacion();">
                        <i class="bi bi-pencil"></i>
                     </button>
                     <button class="btn btn-sm btn-salmon btn-redondo ms-1" title="Eliminar">
                        <i class="bi bi-trash"></i>
                     </button>`;
                  }
                  html+=`
               </div>
            </div>
         </div>
      </div>`;
   });

   html += `</div>`;
   contenedor.innerHTML = html;
}

const fn_marcar_aplicada = async (cliente) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La evaluación será marcada como aplicada y se realizará el cálculo de la calificación final', 'question', 'Sí, calificar', 'Cancelar');
   
   if (!res.result) {
      return;
   }

   dataEvaluaciones[0].estatus   = 'Aplicada';
   dataEvaluaciones[0].resultado = 'Muy Alto';
   dataEvaluaciones[0].color     = 'success';
   showMessageSwalTimer('¡Evaluación aplicada correctamente!', '', 'success', 2500);
   pintarEvaluacionesPorCliente('listado_evaluaciones_cliente', cliente);
}

const fn_nueva_evaluacion = async (cliente) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La evaluación será registrada', 'question', 'Sí, registrar', 'Cancelar');
   
   if (!res.result) {
      return;
   }

   let objEvaluacion = { id: '3', registro: '02-05-2026', aplicacion: '20-05-2026', hora:'14:00', personas: 20, tipo: 'Guía de referencia II', estatus: 'Programada', color: 'primary' };
   dataEvaluaciones.push(objEvaluacion);
   showMessageSwalTimer('¡Evaluación registrada correctamente!', '', 'success', 2500);
   pintarEvaluacionesPorCliente('listado_evaluaciones_cliente', cliente);
   $('#modalFormEvaluacion').modal('hide');
}

const verGuiaReferencia = (destino) => {
   window.open(destino);
}

const ModalAplicarEvaluacion = (idCliente, nomCliente) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalAplicarEvaluacion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">

            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5"><i class="bi bi-clipboard2-pulse me-2"></i>Aplicar Evaluación</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>

            <div class="modal-body bg-light">
               <div class="row">

                  <!-- Empresa -->
                  <div class="col-12 mb-4">
                     <div class="d-flex align-items-center gap-3 p-3 rounded-3 border bg-white">
                        <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-light badge-circular">
                           <i class="bi bi-building fs-7 text-azul-dark"></i>
                        </div>
                        <div>
                           <span class="text-muted small">Empresa seleccionada</span>
                           <p class="fw-bold mb-0 text-azul-dark">${nomCliente || '—'}</p>
                        </div>
                     </div>
                  </div>

                  <!-- Instrucción -->
                  <div class="col-12 mb-3">
                     <div class="d-flex align-items-start gap-2 p-3 rounded-3 separador">
                        <i class="bi bi-info-circle-fill mt-1 text-mostaza"></i>
                        <span class="small text-dark">
                           Selecciona al trabajador al que se le aplicará la evaluación de factores de riesgo psicosocial
                           conforme a la <strong>NOM-035-STPS-2018</strong>. Si el trabajador aún no está registrado,
                           puedes darlo de alta desde esta misma pantalla.
                        </span>
                     </div>
                  </div>

                  <!-- Select trabajador -->
                  <div class="col-12 mb-2 mt-2">
                     <div class="rounded-bottom p-3 bg-white shadow">
                        <label class="form-label small fw-semibold text-azul-dark text-uppercase mb-1">
                           Selecciona un trabajador
                        </label>
                        <select name="trabajadoresTest" id="trabajadoresTest" class="form-select">
                           <option value="0">— Elige una opción —</option>
                           <option value="1">Ing. Roberto Flores</option>
                           <option value="2">Ing. Alejandra Rodríguez</option>
                        </select>
                     </div>
                  </div>

               </div>
            </div>

            <div class="modal-footer bg-light border-0 d-flex justify-content-between align-items-center">
               <button type="button" class="btn btn-outline-dark btn-redondo" onclick="verGuiaReferencia('guia5')">
                  <i class="bi bi-person-plus me-1"></i> Dar de alta trabajador
               </button>
               <div class="d-flex gap-2">
                  <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                     Cancelar
                  </button>
                  <button type="button" class="btn btn-dark btn-lib btn-redondo" onclick="verGuiaReferencia('guia5')">
                     <i class="bi bi-check-lg me-1"></i> Continuar
                  </button>
               </div>
            </div>

         </div>
      </div>
   </div>`;
   $('#modalAdminExt3').html(html);
   $('#modalAplicarEvaluacion').modal('show');
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES GUARDADO DE TEST  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const fn_guardar_guia_v = async (cliente) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información proporcionada será registrada / actualizada', 'question', 'Sí, guardar', 'Cancelar');
   
   if (!res.result) {
      return;
   }

   dataEvaluaciones[0].estatus   = 'Aplicada';
   dataEvaluaciones[0].resultado = 'Muy Alto';
   dataEvaluaciones[0].color     = 'success';
   showMessageSwalTimer('¡Información almacenada correctamente!', '', 'success', 2500);
   window.location.href = "guia1";
}

// ++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES DE DETALLE EVALUACIÓN  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



const ModalSubirPrograma = () => {

   let html = `
   <div class="modal fade modal-superior-blur" id="modalSubirPrograma" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Subir programa</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body bg-light">
               <div class="p-3 rounded-3 shadow-sm">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                     <div>
                        <h5 class="text-dark fw-bold mb-0">Servicios Beta</h5>
                        <small class="text-muted">ID de Seguimiento: #2</small>
                     </div>
                     <span class="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary-subtle">
                        <i class="bi bi-file-earmark-arrow-up me-1"></i> Adjuntar Programa
                     </span>
                  </div>

                  <hr class="my-2 opacity-25">

                  <div class="row g-2">
                     <div class="col-sm-6">
                        <div class="d-flex align-items-center">
                           <div class="icon-box bg-white btn-redondo shadow-sm p-2 me-2">
                              <i class="bi bi-file-earmark-text"></i>
                           </div>
                           <div>
                              <p class="text-secondary mb-0 fs-7">Tipo de Evaluación</p>
                              <span class="fw-medium d-block fs-8">Guía de Referencia II</span>
                           </div>
                        </div>
                     </div>
                     <div class="col-sm-6">
                        <div class="d-flex align-items-center">
                           <div class="icon-box bg-white btn-redondo shadow-sm p-2 me-2">
                              <i class="bi bi-calendar-check text-primary"></i>
                           </div>
                           <div>
                              <p class="text-secondary mb-0 fs-7">Fecha de Aplicación</p>
                              <span class="fw-medium d-block fs-8">08-05-2026</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="row mt-5">
                  <div class="col-12">
                     <label class="text-dark fw-bold">
                        Seleccionar archivo
                     </label>
                     <input type="file" name="programa" id="programa" class="form-control" accept=".pdf">
                     <span class="small text-secondary">
                        <i class="bi bi-info-circle me-1"></i> 
                        Por favor, seleccione el archivo PDF correspondiente al programa de trabajo resultante de esta evaluación.
                     </span>
                  </div>
                  <div class="col-12 mt-4 mb-3">
                     <label class="text-dark fw-bold">Observación adicional</label>
                     <textarea name="obsPrograma" id="obsPrograma" class="form-control fs-7" rows="3" maxlength="200">Ingresa aquí algún comentario adicional</textarea>
                  </div>
               </div>

            </div>
            <div class="modal-footer bg-light" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib">
                  Subir programa
               </button>
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdmin').html(html);
   $('#modalSubirPrograma').modal('show');
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabEvaluaciones             = TabEvaluaciones;
window.ModalFormEvaluacion         = ModalFormEvaluacion; 

window.ModalSubirPrograma          = ModalSubirPrograma;
window.ModalEvaluacionesPorCliente = ModalEvaluacionesPorCliente;
window.ModalAplicarEvaluacion      = ModalAplicarEvaluacion;

window.verGuiaReferencia           = verGuiaReferencia;
window.fn_marcar_aplicada          = fn_marcar_aplicada;
window.fn_nueva_evaluacion         = fn_nueva_evaluacion;
window.fn_guardar_guia_v           = fn_guardar_guia_v;