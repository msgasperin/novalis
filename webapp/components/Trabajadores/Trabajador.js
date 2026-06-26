const arrClientes = [
   {
      id:                '1',
      curp:              'ROHAJSHJUHVZHSJ',
      nombre:            'Ing. Roberto Méndez',
      fecha_nac:         '1987-11-29',
      edad:              '38 años',
      sexo:              'Hombre',
      estado_civil:      'Casado',
      nivel_estudios:    'Posgrado',
      puesto:            'Jefe del Departamento de Tecnologías',
      tipo_puesto:       'Administrativo',
      tipo_contratacion: 'Base',
      tiempo_puesto:     '5 años',
      jornada:           'Diurna',
      rotacion_turnos:   'No',
      estatus:           'Activo'
   },
   {
      id:                '2',
      curp:              'MSHSUIWLKWLKWMVZ',
      nombre:            'Ing. Alejandra Floress',
      fecha_nac:         '1986-10-02',
      edad:              '39 años',
      sexo:              'Mujer',
      estado_civil:      'Casado',
      nivel_estudios:    'Posgrado',
      puesto:            'Jefe del Departamento de Recursos Materiales',
      tipo_puesto:       'Administrativo',
      tipo_contratacion: 'Base',
      tiempo_puesto:     '2 años',
      jornada:           'Diurna',
      rotacion_turnos:   'No',
      estatus:           'Activo'
   }
   
];

const ModalTrabajadoresPorCliente = (cliente) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalTrabajadoresCliente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Trabajadores</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body bg-light">
               <div class="p-3 rounded-3 border-start border-4 border-warning bg-white shadow-sm mb-4">
                  <div class="row">
                     <div class="col-7">
                        <h4 class="text-dark fw-bold mb-0">${cliente}</h4>
                        <small class="text-muted">Listado de trabajadores</small>
                     </div>
                     <div class="col-5 text-end">
                        <button type="button" class="btn btn-dark btn-lib btn-redondo" title="Nuevo trabajador" onclick="ModalFormTrabajador();">Nuevo trabajador</button>
                     </div>
                  </div>
               </div>
               <div id="listado_trabajadores_cliente"></div>
            </div>
            <div class="modal-footer bg-light">
               <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">Cerrar</button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalTrabajadoresCliente').modal('show');
   
   // Llamamos a la función para pintar las evaluaciones dentro de la modal
   pintarTrabajadores('listado_trabajadores_cliente', cliente);
}

const pintarTrabajadores = (containerId, cliente) => {
   const contenedor = document.getElementById(containerId);  

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

   arrClientes.forEach((cl, i) => {
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
                     ${iniciales(cl.nombre)}
                  </div>
                  <div>
                     <h6 class="mb-0 fw-bold text-dark" style="font-size:0.9rem; line-height:1.3;">${cl.nombre}</h6>
                     <small class="text-muted"></i>${cl.edad}</small>
                  </div>
               </div>

               <div class="mb-2 p-2 rounded" style="background-color:#F0F4F8;">
                  <small class="text-muted d-block" style="font-size:0.7rem; text-transform:uppercase; letter-spacing:.5px;">CURP</small>
                  <span class="fw-bold text-dark" style="font-size:0.82rem; letter-spacing:1px;">${cl.curp}</span>
               </div>

               <div class="row g-2 mb-2">
                  <div class="col-7">
                     <small class="text-muted d-block" style="font-size:0.7rem;">Estudios</small>
                     <small class="fw-medium text-dark">${cl.nivel_estudios}</small>
                  </div>
                  <div class="col-5 border-start">
                     <small class="text-muted d-block" style="font-size:0.7rem;">Tipo Puesto</small>
                     <small class="fw-medium text-dark">${cl.tipo_puesto}</small>
                  </div>
               </div>

               <!-- Correo -->
               <div class="mb-2">
                  <small class="text-muted d-block" style="font-size:0.7rem;">Puesto</small>
                  <small class="text-dark"><i class="bi bi-briefcase me-1 text-primary opacity-10"></i>${cl.puesto}</small>
               </div>

               <!-- Ciudad + empleados -->
               <div class="mt-3 d-flex gap-2">
                  <div class="flex-fill p-2 rounded text-center" style="background-color:#F0F4F8;">
                     <small class="text-muted d-block" style="font-size:0.68rem;">Contratación</small>
                     <small class="fw-bold text-dark" style="font-size:0.78rem;">${cl.tipo_contratacion}</small>
                  </div>
                  <div class="flex-fill p-2 rounded text-center" style="background-color:#F0F4F8;">
                     <small class="text-muted d-block" style="font-size:0.68rem;">Tiempo</small>
                     <small class="fw-bold" style="color:#0F2744; font-size:0.9rem;">${cl.tiempo_puesto}</small>
                  </div>
                  <div class="flex-fill p-2 rounded text-center" style="background-color:#F0F4F8;">
                     <small class="text-muted d-block" style="font-size:0.68rem;">Jornada</small>
                     <small class="fw-bold text-dark" style="font-size:0.78rem;">${cl.jornada}</small>
                  </div>
               </div>

            </div>

            <!-- Footer -->
            <div class="card-footer bg-white border-top-0 pb-3">
               <div class="d-flex justify-content-end gap-2">
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

const ModalFormTrabajador = () => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormTrabajador" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5"><i class="bi bi-person-vcard me-2"></i>Perfil del Trabajador</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            
            <div class="modal-body bg-light">

               <!-- Datos Personales -->
               <div class="mb-4">
                  <div class="px-3 py-2 rounded-top mb-0 d-flex align-items-center gap-2 fs-6 bg-primary-lib opacity-10 text-white">
                     <i class="bi bi-person-fill"></i> Datos Personales
                  </div>
                  <div class="border border-top-0 rounded-bottom p-3">
                     <div class="row g-3">
                        <div class="col-md-4 col-sm-12 col-12">
                           <b>Nombre(s) *</b>
                           <input type="text" name="nombre" id="nombre" class="form-control" maxlength="100" placeholder="Nombre(s)">
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Apellido Paterno *</b>
                           <input type="text" name="ap_paterno" id="ap_paterno" class="form-control" maxlength="80" placeholder="Apellido paterno">
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Apellido Materno</b>
                           <input type="text" name="ap_materno" id="ap_materno" class="form-control" maxlength="80" placeholder="Apellido materno">
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Fecha de Nacimiento *</b>
                           <input type="date" name="fecha_nacimiento" id="fecha_nacimiento" class="form-control">
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>CURP *</b>
                           <input type="text" name="curp" id="curp" class="form-control text-uppercase" maxlength="18" placeholder="18 caracteres" style="letter-spacing:1px;">
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Sexo *</b>
                           <select name="sexo" id="sexo" class="form-select">
                              <option value="">Seleccionar</option>
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                              <option value="NB">Prefiero no decir</option>
                           </select>
                        </div>
                        <div class="col-md-6 col-sm-6 col-12">
                           <b>Estado Civil *</b>
                           <select name="estado_civil" id="estado_civil" class="form-select">
                              <option value="">Seleccionar</option>
                              <option value="soltero">Soltero(a)</option>
                              <option value="casado">Casado(a)</option>
                              <option value="union_libre">Unión libre</option>
                              <option value="divorciado">Divorciado(a)</option>
                              <option value="separado">Separado(a)</option>
                              <option value="viudo">Viudo(a)</option>
                           </select>
                        </div>
                        <div class="col-md-6 col-sm-6 col-12">
                           <b>Nivel de Estudios *</b>
                           <select name="nivel_estudios" id="nivel_estudios" class="form-select">
                              <option value="">Seleccionar</option>
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

               <!-- Datos Laborales -->
               <div class="mb-2">
                  <div class="px-3 py-2 rounded-top mb-0 d-flex align-items-center gap-2 fs-6 bg-primary-lib opacity-10 text-white">
                     <i class="bi bi-briefcase-fill"></i> Datos Laborales
                  </div>
                  <div class="border border-top-0 rounded-bottom p-3">
                     <div class="row g-3">
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Departamento *</b>
                           <input type="text" name="departamento" id="departamento" class="form-control" maxlength="120" placeholder="Nombre del departamento">
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Tipo de Puesto *</b>
                           <select name="tipo_puesto" id="tipo_puesto" class="form-select">
                              <option value="">Seleccionar</option>
                              <option value="operativo">Operativo</option>
                              <option value="administrativo">Administrativo</option>
                              <option value="directivo">Directivo / Gerencial</option>
                              <option value="tecnico">Técnico especializado</option>
                           </select>
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Puesto / Cargo *</b>
                           <input type="text" name="puesto" id="puesto" class="form-control" maxlength="120" placeholder="Nombre del puesto">
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Tipo de Contratación *</b>
                           <select name="tipo_contratacion" id="tipo_contratacion" class="form-select">
                              <option value="">Seleccionar</option>
                              <option value="base">Base / Planta</option>
                              <option value="temporal">Temporal / Eventual</option>
                              <option value="honorarios">Honorarios / Servicios profesionales</option>
                              <option value="confianza">Confianza</option>
                              <option value="otro">Otro</option>
                           </select>
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Tiempo en el Puesto *</b>
                           <select name="tiempo_puesto" id="tiempo_puesto" class="form-select">
                              <option value="">Seleccionar</option>
                              <option value="menos_1">Menos de 1 año</option>
                              <option value="1_3">De 1 a 3 años</option>
                              <option value="3_5">De 3 a 5 años</option>
                              <option value="5_10">De 5 a 10 años</option>
                              <option value="mas_10">Más de 10 años</option>
                           </select>
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b>Jornada de Trabajo *</b>
                           <select name="jornada" id="jornada" class="form-select">
                              <option value="">Seleccionar</option>
                              <option value="diurna">Diurna</option>
                              <option value="nocturna">Nocturna</option>
                              <option value="mixta">Mixta</option>
                              <option value="reducida">Reducida</option>
                              <option value="partida">Partida</option>
                           </select>
                        </div>
                        <div class="col-md-4 col-sm-6 col-12">
                           <b class="d-block mb-2">¿Rota Turnos? *</b>
                           <div class="d-flex gap-2">
                              <input type="radio" class="btn-check" name="rota_turnos" id="rota_si" value="1">
                              <label class="btn btn-outline-success btn-sm px-4 btn-redondo" for="rota_si">SÍ</label>
                              <input type="radio" class="btn-check" name="rota_turnos" id="rota_no" value="0">
                              <label class="btn btn-outline-secondary btn-sm px-4 btn-redondo" for="rota_no">NO</label>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
            
            <div class="modal-footer bg-light border-0">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" onclick="guardarTrabajador()">
                  <i class="bi bi-check2-circle me-1"></i> Guardar
               </button>
               <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>

         </div>
      </div>
   </div>`;
   $('#modalAdminExt').html(html);
   $('#modalFormTrabajador').modal('show');
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.ModalFormTrabajador         = ModalFormTrabajador; 
window.ModalTrabajadoresPorCliente = ModalTrabajadoresPorCliente;
