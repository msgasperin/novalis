// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES MODAL LISTADO PEDIDOS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const TabClientes = () => {
   activarLoad('Cargando clientes...');
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-building-gear"></i> Clientes</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevoCliente" onclick="ModalFormCliente();"><i class="bi bi-plus-lg"></i> Nuevo cliente</button>
      </div>
   </div>
   <div class="row mt-2">
      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12" align="right">
         <div class="input-group">
            <input type="text" name="inpBusquedaClientes" id="inpBusquedaClientes" class="form-control border-end-0" placeholder="Buscar cliente"  onkeyUp="fn_buscar_evaluaciones();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_clientes"></div>
   </div>`;

   $('#containerMain').html(html);
   setTimeout(() => {
      pintarClientes('listado_clientes');
      closeLoad();
   }, 500);
}

const pintarClientes = (containerId) => {
   const contenedor = document.getElementById(containerId);

   const clientes = [
      {
         id: '1',
         razonSocial:   'Industrias Alfa S.A. de C.V.',
         rfc:           'IAL850312AB1',
         sector:        'Manufactura',
         contacto:      'Ing. Roberto Méndez',
         telefono:      '228 123 4567',
         correo:        'rmendez@industriasalfa.mx',
         ciudad:        'Veracruz, Ver.',
         empleados:     320,
         registro:      '15-01-2024',
         estatus:       'Activo'
      }
   ];

   const sectorIcono = (sector) => {
      const mapa = {
         'Manufactura':      'bi-gear-fill',
         'Consultoría':      'bi-briefcase-fill',
         'Transporte':       'bi-truck',
         'Recursos Humanos': 'bi-people-fill',
         'Retail':           'bi-shop',
         'Finanzas':         'bi-bank',
      };
      return mapa[sector] || 'bi-building';
   };

   const obtenerEstiloEstatus = (estatus) => {
      return estatus === 'Activo'
         ? { bg: '#5FA8A310', border: '#5FA8A360', color: '#0a5c57', color_badge_bg: '#5FA8A320', color_badge_text: '#0a5c57' }
         : { bg: '#F26B7C10', border: '#F26B7C60', color: '#a8001a', color_badge_bg: '#F26B7C20', color_badge_text: '#a8001a' };
   };

   const iniciales = (nombre) => {
      const palabras = nombre.trim().split(' ');
      return (palabras[0][0] + (palabras[1] ? palabras[1][0] : '')).toUpperCase();
   };

   const coloresAvatar = ['#0F2744', '#5FA8A3', '#F26B7C', '#FFCC66', '#3b6d8f', '#c76b26'];

   let html = `<div class="row g-4">`;

   clientes.forEach((cl, i) => {
      const estilo = obtenerEstiloEstatus(cl.estatus);
      const avatarColor = coloresAvatar[i % coloresAvatar.length];
      const avatarTexto = cl.estatus === 'Activo' ? 'white' : 'white';

      html += `
      <div class="col-12 col-md-6 col-lg-4">
         <div class="card h-100 shadow border-0">

            <!-- Header -->
            <div class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
               <span class="badge rounded-pill px-3 py-1" 
                  style="background-color:${estilo.color_badge_bg}; color:${estilo.color_badge_text}; border: 1px solid ${estilo.border}; font-size:0.75rem;">
                  <i class="bi bi-circle-fill me-1" style="font-size:0.5rem; vertical-align:middle;"></i>${cl.estatus}
               </span>
               <small class="text-muted">ID: #${cl.id}</small>
            </div>

            <!-- Body -->
            <div class="card-body pt-2 mt-2">

               <!-- Avatar + nombre -->
               <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                     style="width:46px; height:46px; background-color:${avatarColor}; color:${avatarTexto}; font-size:0.9rem;">
                     ${iniciales(cl.razonSocial)}
                  </div>
                  <div>
                     <h6 class="mb-0 fw-bold text-dark" style="font-size:0.9rem; line-height:1.3;">${cl.razonSocial}</h6>
                     <small class="text-muted"><i class="bi ${sectorIcono(cl.sector)} me-1"></i>${cl.sector}</small>
                  </div>
               </div>

               <!-- RFC -->
               <div class="mb-2 p-2 rounded" style="background-color:#F0F4F8;">
                  <small class="text-muted d-block" style="font-size:0.7rem; text-transform:uppercase; letter-spacing:.5px;">RFC</small>
                  <span class="fw-bold text-dark" style="font-size:0.82rem; letter-spacing:1px;">${cl.rfc}</span>
               </div>

               <!-- Contacto + teléfono -->
               <div class="row g-2 mb-2">
                  <div class="col-7">
                     <small class="text-muted d-block" style="font-size:0.7rem;">Contacto</small>
                     <small class="fw-medium text-dark">${cl.contacto}</small>
                  </div>
                  <div class="col-5 border-start">
                     <small class="text-muted d-block" style="font-size:0.7rem;">Teléfono</small>
                     <small class="fw-medium text-dark">${cl.telefono}</small>
                  </div>
               </div>

               <!-- Correo -->
               <div class="mb-2">
                  <small class="text-muted d-block" style="font-size:0.7rem;">Correo</small>
                  <small class="text-dark"><i class="bi bi-envelope me-1" style="color:#5FA8A3;"></i>${cl.correo}</small>
               </div>

               <!-- Ciudad + empleados -->
               <div class="mt-3 d-flex gap-2">
                  <div class="flex-fill p-2 rounded text-center" style="background-color:#F0F4F8;">
                     <small class="text-muted d-block" style="font-size:0.68rem;">Ciudad</small>
                     <small class="fw-bold text-dark" style="font-size:0.78rem;">${cl.ciudad}</small>
                  </div>
                  <div class="flex-fill p-2 rounded text-center" style="background-color:#F0F4F8;">
                     <small class="text-muted d-block" style="font-size:0.68rem;">Empleados</small>
                     <small class="fw-bold" style="color:#0F2744; font-size:0.9rem;">${cl.empleados}</small>
                  </div>
                  <div class="flex-fill p-2 rounded text-center" style="background-color:#F0F4F8;">
                     <small class="text-muted d-block" style="font-size:0.68rem;">Registro</small>
                     <small class="fw-bold text-dark" style="font-size:0.78rem;">${cl.registro}</small>
                  </div>
               </div>

            </div>

            <!-- Footer -->
            <div class="card-footer bg-white border-top-0 pb-3">
               <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-menta btn-redondo btn-sm px-3 fs-8" title="Ver resultados globales" onclick="ModalResultadosGlobales('${cl.razonSocial}');">
                     <i class="bi bi-file-bar-graph me-1"></i> Resultados Globales
                  </button>
                  <button class="btn btn-mostaza btn-redondo btn-sm px-3 fs-8" title="Ver evaluaciones" onclick="ModalEvaluacionesPorCliente('${cl.razonSocial}');">
                     <i class="bi bi-clipboard2-pulse me-1"></i> Evaluaciones
                  </button>
                  <button class="btn btn-outline-primary btn-redondo btn-sm px-2" title="Trabajadores" onclick="ModalTrabajadoresPorCliente('${cl.razonSocial}');">
                     <i class="bi bi-people"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormCliente('${cl.id}');">
                     <i class="bi bi-pencil"></i>
                  </button>`;
                  if(cl.estatus == 'Activo') {
                     html+=`
                     <button class="btn btn-salmon btn-redondo btn-sm px-2" title="Eliminar">
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

const ModalFormCliente = () => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormCliente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Nuevo Cliente</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            
            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-md-6 col-sm-12 col-12 mt-3">
                     <b>Razón social *</b>
                     <input type="text" name="nomCliente" id="nomCliente" class="form-control" maxlength="150">
                  </div>
                  <div class="col-md-3 col-sm-6 col-6 mt-3">
                     <b>Giro</b>
                     <select name="giroCliente" id="giroCliente" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Manufactura</option>
                        <option value="2">Logística</option>
                     </select>
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>RFC</b>
                     <input type="text" name="rfcCliente" id="rfcCliente" class="form-control" maxlength="11">
                  </div>
                  <div class="col-md-5 col-sm-5 col-12 mt-3">
                     <b>Persona de Contacto *</b>
                     <input type="text" name="contactoCliente" id="contactoCliente" class="form-control" maxlength="150">
                  </div>
                  <div class="col-md-3 col-sm-3 col-12 mt-3">
                     <b>Teléfono *</b>
                     <input type="tel" inputmode="tel" name="telCliente" id="telCliente" class="form-control" onkeypress="return fnValidaNumeros(event);">
                  </div>
                  <div class="col-md-4 col-sm-4 col-12 mt-3">
                     <b>Correo *</b>
                     <input type="mail" inputmode="mail" name="mailCliente" id="mailCliente" class="form-control" maxlength="150">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Dirección *</b>
                     <textarea name="dirCliente" id="dirCliente" class="form-control" rows="3"></textarea>
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Ciudad *</b>
                     <input type="text" name="ciudadCliente" id="ciudadCliente" class="form-control" maxlength="150">
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>No. Empleados *</b>
                     <input type="number" inputmode="numeric" name="noEmpleadosCliente" id="noEmpleadosCliente" class="form-control" onkeypress="return fnValidaNumeros(event);">
                  </div>
               </div>
            </div>
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib">
                  Guardar
               </button>
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminExt').html(html);
   $('#modalFormCliente').modal('show');
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabClientes                      = TabClientes;
window.ModalFormCliente                 = ModalFormCliente; 
