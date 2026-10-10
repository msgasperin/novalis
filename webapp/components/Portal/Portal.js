import { obtiene_promociones, guarda_promocion, elimina_promocion, actualiza_whats, publica_cambios } from "./PortalServices.js";

let arrPromociones   = [];
let arrEstudiosPromo = [];

const TabPromocionesPortal = async () => {
   const res = await valida_menu('portal');

   if (!res || res.estatus != 200) {
      ModalAccesoDenegado('Portal');
      $('#containerMain').html(`<div class="alert alert-danger mt-3 p-2 text-center">No tienes permisos para ver este módulo.</div>`);
      return;
   }

   let html = `
   <div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-12 mt-2 fw-bold">
         <div class="fs-4"><i class="bi bi-percent me-2"></i>Promociones portal</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-12 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevaPromocion" onclick="ModalFormPromocion(0);">
            <i class="bi bi-plus-lg"></i> Nueva Promoción
         </button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 col-md-4 ms-auto text-end">
         <div class="input-group">
            <input type="text" name="inpBusquedaPromocion" id="inpBusquedaPromocion" class="form-control border-end-0" placeholder="Buscar promoción..." onkeyup="buscar_promocion();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="containerListPromocion"></div>      
   </div>`;

   $('#containerMain').html(html);
   listar_promociones();
};

const ModalFormPromocion = (idPromocion = 0) => {
   let idNum = parseInt(idPromocion) || 0;
   let promocionSeleccionada = arrPromociones.find(promo => promo.id == idNum);

   let titulo          = 'Registrar nueva promoción';
   let badge           = 'NA';
   let nombre          = '';
   let precioOriginal  = '';
   let precioPromocion = '';
   arrEstudiosPromo    = [];

   if (idNum > 0 && promocionSeleccionada) {
      titulo           = 'Editar Promoción: ' + (promocionSeleccionada.nom_promocion || '');
      badge            = promocionSeleccionada.badge || 'NA';
      nombre           = promocionSeleccionada.nom_promocion || '';
      precioOriginal   = promocionSeleccionada.precio_original || '';
      precioPromocion  = promocionSeleccionada.precio_promocion || '';
      
      try {
         arrEstudiosPromo = promocionSeleccionada.estudios ? JSON.parse(promocionSeleccionada.estudios) : [];
      } catch (e) {
         arrEstudiosPromo = [];
      }
   }

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormPromociones" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${escapeHTML(titulo)}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="col-12 col-sm-4 mt-3">
                     <label class="form-label fw-bold mb-1" for="badgePromocion">Badge *</label>
                     <select id="badgePromocion" class="form-select">
                        <option value="NA">Seleccionar...</option>
                        <option value="POPULAR">POPULAR</option>
                        <option value="PREVENTIVO">PREVENTIVO</option>
                        <option value="RECOMENDADO">RECOMENDADO</option>
                        <option value="ESCOLAR">ESCOLAR</option>
                        <option value="INFANTIL">INFANTIL</option>
                        <option value="MUJER">MUJER</option>
                        <option value="HOMBRE">HOMBRE</option>
                        <option value="ADULTO MAYOR">ADULTO MAYOR</option>
                     </select>
                  </div>
                  <div class="col-12 col-sm-8 mt-3">
                     <label class="form-label fw-bold mb-1" for="nomPromocion">Nombre de la promoción *</label>
                     <input type="text" name="nomPromocion" id="nomPromocion" class="form-control" maxlength="150" value="${escapeHTML(nombre)}"/>
                  </div>
                  <div class="col-6 mt-3">
                     <label class="form-label fw-bold mb-1" for="precioOriginal">Precio original *</label>
                     <input type="number" inputmode="decimal" step="0.01" name="precioOriginal" id="precioOriginal" class="form-control" maxlength="10" value="${escapeHTML(precioOriginal.toString())}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-6 mt-3">
                     <label class="form-label fw-bold mb-1" for="precioPromocion">Precio promoción *</label>
                     <input type="number" inputmode="decimal" step="0.01" name="precioPromocion" id="precioPromocion" class="form-control" maxlength="10" value="${escapeHTML(precioPromocion.toString())}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-12 mt-3">
                     <div class="card border-light-subtle shadow-sm">
                        <div class="card-header bg-light fs-6 fw-bold">
                           <i class="bi bi-tags me-1"></i> Configuración de estudios de la promoción
                        </div>
                        <div class="card-body">
                           <div class="row align-items-end">
                              <div class="col-9 col-sm-10 mt-2 mt-sm-0">
                                 <label class="form-label fw-bold mb-1" for="txtEstudio">Estudio</label>
                                 <input type="text" id="txtEstudio" class="form-control" placeholder="Ej. Biometría Hemática Completa" maxlength="150"/>
                              </div>
                              <div class="col-3 col-sm-2 mt-2 mt-sm-0 text-end">
                                 <button type="button" class="btn btn-primary w-100 btn-redondo" onclick="agregar_estudio_promo_lista();">
                                    <i class="bi bi-plus-lg"></i>
                                 </button>
                              </div>
                           </div>
                           <div class="row mt-3">
                              <div class="col-12">
                                 <div id="contenedorEstudiosPromoAgregados" class="d-flex flex-wrap gap-2 p-2 border rounded bg-white" style="min-height: 48px;">
                                    <span class="text-muted small fst-italic id-sin-tubos">No se han agregado estudios a esta promoción.</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <input type="hidden" name="estudiosPromoPortal" id="estudiosPromoPortal" value="[]" />
               </div>
            </div>
            <div class="modal-footer border-0 text-end">
              <button type="button" class="btn btn-secondary btn-lib btn-redondo" id="btnSavePromocion" onclick="guardar_promocion(${idNum});">
                <i class="bi bi-save"></i> Guardar
              </button> 
              <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalFormPromociones').modal('show');   
   setTimeout(() => {
      $('#badgePromocion').val(badge);
      renderizar_estudios_promo();
   }, 200);
};

const listar_promociones = async () => {
   activarLoad('Cargando promociones...');
   let respuesta = await obtiene_promociones();
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      closeLoad();
      return;
   }
   else {
      arrPromociones = respuesta.data || [];
      pinta_listado_promociones(arrPromociones);
   }
};

const pinta_listado_promociones = (data) => {
   if (!data || data.length === 0) {
      $('#containerListPromocion').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron promociones registradas</div>');
      closeLoad();
      return;
   }
   
   let html = `<div class="row">`;
   data.forEach((row) => {
      let listaEstudiosHtml = '';
      try {
         const estudiosArr = JSON.parse(row.estudios || '[]');
         listaEstudiosHtml = estudiosArr.map(e => escapeHTML(e.estudio || '')).join('<br>');
      } catch (e) {
         listaEstudiosHtml = '<span class="text-muted small fst-italic">Sin detalles</span>';
      }

      html += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mt-2" id="cardPromocion${row.id}">
         <div class="card mb-3 shadow-sm border-light-subtle h-100">
            <div class="card-body d-flex flex-column">
               <div class="mb-2">
                  <span class="badge bg-primary bg-brand-primary text-white border">${escapeHTML(row.badge || 'PROMO')}</span>
               </div>
               <div class="fs-6 fw-bold text-dark mb-1">${escapeHTML(row.nom_promocion || '')}</div>
               <div class="small text-muted mb-2">
                  Original: <span class="text-decoration-line-through">$${parseFloat(row.precio_original || 0).toFixed(2)}</span> | 
                  <span class="text-success fw-bold">Promoción: $${parseFloat(row.precio_promocion || 0).toFixed(2)}</span>
               </div>
               <div class="alert alert-secondary p-2 mt-auto mb-0 small">
                  ${listaEstudiosHtml}
               </div>
            </div>
            <div class="card-footer bg-white border-top-0 pb-3 pt-0">
               <div class="d-flex justify-content-end gap-2">
                  <!-- Invocaciones numéricas seguras -->
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormPromocion(${row.id});">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarPromocion" title="Eliminar" onclick="eliminar_promocion(${row.id});">
                     <i class="bi bi-trash"></i>
                  </button>               
               </div>
            </div>
         </div>
      </div>`;
   });

   html += `</div>`;
   $('#containerListPromocion').html(html);
   closeLoad();
};

const guardar_promocion = async (idPromocion = 0) => {
   let idNum           = parseInt(idPromocion) || 0;
   let badgePromocion  = $('#badgePromocion').val().trim();
   let nomPromocion    = $('#nomPromocion').val().trim();
   let precioOriginal  = $('#precioOriginal').val().trim();
   let precioPromocion = $('#precioPromocion').val().trim();
   let msjAccion       = '';

   if (badgePromocion === 'NA') {
      ToastColor.fire({ text: '¡Atención! Debes seleccionar un identificador de la promoción', icon: 'warning' });
      $('#badgePromocion').focus();
      return;
   }
   else if (nomPromocion === '') {
      ToastColor.fire({ text: '¡Atención! Debes ingresar el nombre de la promoción', icon: 'warning' });
      $('#nomPromocion').focus();
      return;
   }
   else if (precioOriginal === '' || parseFloat(precioOriginal) <= 0) {
      ToastColor.fire({ text: '¡Atención! Debes ingresar un precio original y debe ser mayor a 0', icon: 'warning' });
      $('#precioOriginal').focus();
      return;
   }
   else if (precioPromocion === '' || parseFloat(precioPromocion) <= 0) {
      ToastColor.fire({ text: '¡Atención! Debes ingresar un precio de promoción y debe ser mayor a 0', icon: 'warning' });
      $('#precioPromocion').focus();
      return;
   }
   else if (arrEstudiosPromo.length === 0) {
      ToastColor.fire({ text: '¡Atención! Debes agregar al menos 1 estudio que incluye la promoción', icon: 'warning' });
      $('#txtEstudio').focus();
      return;
   }
      
   const objPromocion = { 
      func: 'guarda_promocion', 
      idPromocion: idNum, 
      badgePromocion, 
      nomPromocion, 
      precioOriginal, 
      precioPromocion, 
      arrEstudiosPromo,
      csrf: CSRF_TOKEN
   };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información de la promoción ' + escapeHTML(nomPromocion) + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnSavePromocion').prop('disabled', false);
      return;
   }

   $('#btnSavePromocion').prop('disabled', true);
   let respuesta = await guarda_promocion(objPromocion);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      msjAccion = idNum > 0 ? '¡Información actualizada!' : '¡Promoción guardada correctamente!';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormPromociones').modal('hide');
      listar_promociones();
      $('#btnSavePromocion').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnSavePromocion').prop('disabled', false);
      return;
   }
};

const eliminar_promocion = async (idPromocion) => {
   let idNum = parseInt(idPromocion) || 0;
   let promoSeleccionada = arrPromociones.find(p => p.id == idNum);
   if (!promoSeleccionada) return;

   let nomPromocion = promoSeleccionada.nom_promocion || '';

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La promoción: ' + escapeHTML(nomPromocion) + ' será eliminada', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarPromocion').prop('disabled', false);
      return;
   }

   $('.btnEliminarPromocion').prop('disabled', true);
   let respuesta = await elimina_promocion(idNum, nomPromocion, CSRF_TOKEN);
   
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('¡Promoción eliminada correctamente!', '', 'success', 2500);
      $('#cardPromocion' + idNum).remove();
      arrPromociones = arrPromociones.filter(p => p.id != idNum);
      $('.btnEliminarPromocion').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarPromocion').prop('disabled', false);
      return;
   }
};

const buscar_promocion = () => {
   let busqueda = $('#inpBusquedaPromocion').val().trim().toLowerCase();

   const filtrado = arrPromociones.filter(promo => 
      (promo.nom_promocion || '').toLowerCase().includes(busqueda)
   );
   pinta_listado_promociones(filtrado);
};

const agregar_estudio_promo_lista = () => {
   let estudio = $('#txtEstudio').val().trim();

   if (!estudio) {
      ToastColor.fire({ text: '¡Atención! Ingrese el estudio.', icon: 'warning' });
      $('#txtEstudio').focus();
      return;
   }
   
   arrEstudiosPromo.push({ estudio });
   $('#txtEstudio').val('');
   $('#txtEstudio').focus();
   renderizar_estudios_promo();
};

const renderizar_estudios_promo = () => {
   let html = '';

   if (arrEstudiosPromo.length === 0) {
      html = '<span class="text-muted small fst-italic">No se han agregado estudios a esta promoción.</span>';
   } else {
      arrEstudiosPromo.forEach((item, index) => {
         html += `
         <span class="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
            <i class="bi bi-vial-fill text-primary"></i> 
            <span class="text-secondary">${escapeHTML(item.estudio || '')}</span>
            <button type="button" class="btn-close btn-close-xs ms-1" onclick="eliminar_estudio_promo(${index});" aria-label="Eliminar"></button>
         </span>`;
      });
   }

   $('#contenedorEstudiosPromoAgregados').html(html);
   $('#estudiosPromoPortal').val(JSON.stringify(arrEstudiosPromo));
};

const eliminar_estudio_promo = (index) => {
   arrEstudiosPromo.splice(index, 1);
   renderizar_estudios_promo();
};

const ModalActualizaWhatsApp = () => {
   let whatsapp = $('#whatsAppEmpresa').val().trim();

   let html = `
   <div class="modal fade modal-superior-blur" id="modalActualizaWhats" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Actualiza WhatsApp del Portal</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="col-12 mt-3">
                     <label class="form-label fw-bold mb-1" for="whatsAppActivo">WhatsApp Activo *</label>
                     <input type="tel" inputmode="numeric" name="whatsAppActivo" id="whatsAppActivo" class="form-control" maxlength="10" value="${escapeHTML(whatsapp)}" onkeypress="return fnValidaNumeros(event);">
                  </div>
               </div>
            </div>
            <div class="modal-footer border-top-0 text-end">
              <button type="button" class="btn btn-secondary btn-lib btn-redondo" id="btnActualizaWhats" onclick="actualizar_whats();">
                <i class="bi bi-save"></i> Guardar
              </button> 
              <button type="button" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminExt5').html(html);
   $('#modalActualizaWhats').modal('show');
};

const actualizar_whats = async () => {
   let whatsapp = $('#whatsAppActivo').val().trim();

   if (whatsapp === '') {
      ToastColor.fire({ text: '¡Atención! Debes ingresar el nuevo número de contacto por whatsApp', icon: 'warning' });
      $('#whatsAppActivo').focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El contacto del portal por whatsApp quedará vinculado al número: ' + escapeHTML(whatsapp), 'question', 'Sí, actualizar', 'Cancelar');
   
   if (!res.result) {
      $('#btnActualizaWhats').prop('disabled', false);
      return;
   }

   $('#btnActualizaWhats').prop('disabled', true);
   let respuesta = await actualiza_whats(whatsapp, CSRF_TOKEN);
   
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('¡WhatsApp Actualizado!', '', 'success', 2500);
      $('#modalActualizaWhats').modal('hide');
      $('#whatsAppEmpresa').val(whatsapp);
      $('#btnActualizaWhats').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnActualizaWhats').prop('disabled', false);
      return;
   }
};

const publicar_cambios = async () => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se obtendrán los últimos cambios realizados y se publicarán en el portal', 'question', 'Sí, publicar', 'Cancelar');
   
   if (!res.result) {
      return;
   }

   let respuesta = await publica_cambios(CSRF_TOKEN);
   if (respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if (respuesta.estatus == 200) {
      showMessageSwalTimer('¡Cambios publicados!', '', 'success', 2500);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
};

// Interfaces
window.TabPromocionesPortal        = TabPromocionesPortal;
window.ModalFormPromocion          = ModalFormPromocion;
window.ModalActualizaWhatsApp      = ModalActualizaWhatsApp;

// Funciones
window.eliminar_promocion          = eliminar_promocion;
window.guardar_promocion           = guardar_promocion; 
window.buscar_promocion            = buscar_promocion;

window.agregar_estudio_promo_lista = agregar_estudio_promo_lista;
window.eliminar_estudio_promo      = eliminar_estudio_promo;

window.actualizar_whats            = actualizar_whats;
window.publicar_cambios            = publicar_cambios;