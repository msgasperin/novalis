import { obtiene_promociones, guarda_promocion, elimina_promocion, actualiza_whats, publica_cambios } from "./PortalServices.js";

let arrPromociones   = [];
let arrEstudiosPromo = [];

const TabPromocionesPortal = () => {
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-9 col-sm-8 col-6 mt-2 fw-bold">
         <div class="fs-4"> <i class="bi bi-percent"></i> Promociones portal</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6 mt-2">
         <button class="btn btn-secondary btn-lib btn-redondo w-100" type="button" id="btnNuevaPromocion" onclick="ModalFormPromocion(0, 0,'');"><i class="bi bi-plus-lg"></i> Nueva Promoción</button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 col-md-3" align="right">
         <div class="input-group">
            <input type="text" name="inpBusquedaPromocion" id="inpBusquedaPromocion" class="form-control border-end-0" placeholder="Buscar promoción" onkeyUp="buscar_promocion();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="containerListPromocion"></div>      
   </div>`;

   $('#containerMain').html(html);
   
   listar_promociones();
}

const ModalFormPromocion = (idPromocion, nomPromocion) => {

   let promocionSeleccionada = arrPromociones.filter(descuento => descuento.id == idPromocion);

   let titulo          = 'Registrar nueva promoción';
   let badge           = 'NA';
   let nombre          = '';
   let precioOriginal  = '';
   let precioPromocion = '';
   arrEstudiosPromo    = [];

   if(idPromocion > 0) {
      titulo           = 'Editar Promoción: '+ nomPromocion;
      badge            = promocionSeleccionada[0].badge;
      nombre           = promocionSeleccionada[0].nom_promocion;
      precioOriginal   = promocionSeleccionada[0].precio_original;
      precioPromocion  = promocionSeleccionada[0].precio_promocion;
      arrEstudiosPromo = promocionSeleccionada[0].estudios ? JSON.parse(promocionSeleccionada[0].estudios) : [];
   }
    

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormPromociones" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${titulo}</h1>
               <button type="button" class="btn btn-outline-light btn-sm btn-redondo" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body">
               <div class="row">
                  <div class="col-12 col-sm-4 mt-3">
                     <b>Badge *</b>
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
                     <b>Nombre de la promoción *</b>
                     <input type="text" name="nomPromocion" id="nomPromocion" class="form-control" maxlength="150" value="${nombre}"/>
                  </div>
                  <div class="col-6 mt-3">
                     <b>Precio original *</b>
                     <input type="text" inputmode="numeric" name="precioOriginal" id="precioOriginal" class="form-control" maxlength="3" value="${precioOriginal}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-6 mt-3">
                     <b>Precio promoción *</b>
                     <input type="text" inputmode="numeric" name="precioPromocion" id="precioPromocion" class="form-control" maxlength="3" value="${precioPromocion}" onkeypress="return fnValidaNumeros(event);"/>
                  </div>
                  <div class="col-12 mt-3">
                     <div class="card border-light-subtle shadow-sm">
                        <div class="card-header bg-light fs-6 fw-bold">
                           <i class="bi bi-tags"></i> Configuración de estudios de la promoción
                        </div>
                        <div class="card-body">
                           <div class="row align-items-end">
                              <div class="col-9 col-sm-10 mt-2 mt-sm-0">
                                 <b>Estudio</b>
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
                                    <!-- Aquí se inyectan las pills con JS -->
                                    <span class="text-muted small fst-italic id-sin-tubos">No se han agregado estudios a esta promoción.</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <!-- Input oculto para recolectar el JSON en el submit -->
                  <input type="hidden" name="estudiosPromoPortal" id="estudiosPromoPortal" value="[]" />
               </div>
            </div>
            <div class="modal-footer" align="right">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnSavePromocion" onclick="guardar_promocion('${idPromocion}');">
                <i class="bi bi-save"></i> Guardar
              </button> 
              <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
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
   }, 300);
}

const listar_promociones = async () => {
   activarLoad('Cargando promociones...');
   let respuesta = await obtiene_promociones();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      arrPromociones = respuesta.data;
      pinta_listado_promociones(arrPromociones);
   }
}

const pinta_listado_promociones = (data) => {
   if(data.length == 0) {
      $('#containerListPromocion').html('<div align="center"><img src="assets/images/no_encontrado.png" class="img img-fluid"> <br>No se encontraron promociones registradas</div>');
      closeLoad();
      return;
   }
   
   let html = `<div class="row">`;
   data.map((row, i) => {
      html+=`
      <div class="col-12 col-sm-3 col-md-3 mt-2" id="cardPromocion${row.id}">
         <div class="card mb-3 shadow">
            <div class="card-body">
               <div class="row fs-8">
                  <div class="col-12 mt-2">
                     <div>
                        <span class="badge bg-primary bg-brand-primary text-white text-secondary border">${row.badge}</span>
                     </div>
                     <div class="mt-1 fs-6"><b>${row.nom_promocion}</b></div>
                     <div>Precio original: $${row.precio_original} | <span class="text-success"> Precio promoción: $${row.precio_promocion}</span></div>
                     <div class="alert alert-secondary p-2 mt-1">
                        ${JSON.parse(row.estudios).map(e => e.estudio).join('<br>')}
                     </div>
                  </div>
               </div>
            </div>
            <div class="card-footer bg-white border-top-0 pb-2">
               <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-outline-secondary btn-redondo btn-sm px-2" title="Editar" onclick="ModalFormPromocion(${row.id},'${row.nom_promocion}');">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-salmon btn-redondo btn-sm px-2 btnEliminarPromocion" title="Eliminar" onclick="eliminar_promocion(${row.id},'${row.nom_promocion}');">
                     <i class="bi bi-trash"></i>
                  </button>               
               </div>
            </div>
         </div>
      </div>`;
   });

   html+=`</div>`;
   $('#containerListPromocion').html(html);
   closeLoad();
}

const guardar_promocion = async (idPromocion) => {

   let badgePromocion  = $('#badgePromocion').val().trim();
   let nomPromocion    = $('#nomPromocion').val().trim();
   let precioOriginal  = $('#precioOriginal').val().trim();
   let precioPromocion = $('#precioPromocion').val().trim();
   let msjAccion       = '';

   if (badgePromocion == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un identificador de la promoción',
         icon: 'warning'
      });
      $('#badgePromocion').focus();
      return;
   }
   else if (nomPromocion == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre de la promoción',
         icon: 'warning'
      });
      $('#nomPromocion').focus();
      return;
   }
   else if (precioOriginal == '' || parseInt(precioOriginal) <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un precio original y debe ser mayor a 0',
         icon: 'warning'
      });
      $('#precioOriginal').focus();
      return;
   }
   else if (precioPromocion == '' || parseInt(precioPromocion) <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un precio de promoción y debe ser mayor a 0',
         icon: 'warning'
      });
      $('#precioPromocion').focus();
      return;
   }
   else if (arrEstudiosPromo.length == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes agregar al menos 1 estudio que incluye la promoción',
         icon: 'warning'
      });
      $('#txtEstudio').focus();
      return;
   }
      
   const objPromocion = { func: 'guarda_promocion', idPromocion, badgePromocion, nomPromocion, precioOriginal, precioPromocion, arrEstudiosPromo };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La información de la promoción ' + nomPromocion + ' será almacenada', 'question', 'Sí, guardar', 'Cancelar');
   if (!res.result) {
      $('#btnSavePromocion').prop('disabled', false);
      return;
   }

   $('#btnSavePromocion').prop('disabled', true);
   let respuesta = await guarda_promocion(objPromocion);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      
      idPromocion > 0 ? msjAccion = '¡Información actualizada!' : msjAccion = '¡Promoción guardada correctamente!';

      showMessageSwalTimer(msjAccion, '', 'success', 2500);
      $('#modalFormPromociones').modal('hide');
      listar_promociones();
      $('#btnSavePromocion').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnSavePromocion').prop('disabled', false);
      return;
   }
}

const eliminar_promocion = async (idPromocion, nomPromocion) => {
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La promoción: ' + nomPromocion + ' será eliminada', 'question', 'Sí, eliminar', 'Cancelar');
   
   if (!res.result) {
      $('.btnEliminarPromocion').prop('disabled', false);
      return;
   }

   $('.btnEliminarPromocion').prop('disabled', true);
   let respuesta = await elimina_promocion(idPromocion, nomPromocion);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Promoción eliminada correctamente!', '', 'success', 2500);
      $('#cardPromocion'+idPromocion).remove();
      arrPromociones = arrPromociones.filter(descuento => descuento.id != idPromocion);
      $('.btnEliminarPromocion').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('.btnEliminarPromocion').prop('disabled', false);
      return;
   }
}

const buscar_promocion = () => {
   let busqueda = $('#inpBusquedaPromocion').val().trim();

   const filtrado = arrPromociones.filter(promo => 
      promo.nom_promocion.toLowerCase().includes(busqueda.toLowerCase())
   );
   pinta_listado_promociones(filtrado);
}

const agregar_estudio_promo_lista = () => {

   let estudio = $('#txtEstudio').val().trim();

   if (!estudio) {
      ToastColor.fire({
         text: '¡Atención! Ingrese el estudio.',
         icon: 'warning'
      });
      $('#txtEstudio').focus();
      return;
   }
   
   arrEstudiosPromo.push({ estudio });
   $('#txtEstudio').val('');
   $('#txtEstudio').focus();
   renderizar_estudios_promo();
};

// Pinta las etiquetas (pills) en el DIV y actualiza el campo oculto JSON
const renderizar_estudios_promo = () => {
   let html = '';

   if (arrEstudiosPromo.length === 0) {
      html = '<span class="text-muted small fst-italic">No se han agregado estudios a esta promoción.</span>';
   } else {
      arrEstudiosPromo.forEach((item, index) => {
         html += `
         <span class="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
            <i class="bi bi-vial-fill text-primary"></i> 
            <span class="text-secondary">${item.estudio}</span>
            <button type="button" class="btn-close btn-close-xs ms-1" onclick="eliminar_estudio_promo(${index});" aria-label="Eliminar"></button>
         </span>`;
      });
   }

   // Pintar en el contenedor HTML
   $('#contenedorEstudiosPromoAgregados').html(html);

   // Sincronizar el input hidden con la cadena JSON
   $('#estudiosPromoPortal').val(JSON.stringify(arrEstudiosPromo));
};

// Elimina un ítem por su índice y re-renderiza
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
                     <b>WhatsApp Activo *</b>
                     <input type="text" name="whatsAppActivo" id="whatsAppActivo" class="form-control" maxlength="10" value="${whatsapp}">
                  </div>
               </div>
            </div>
            <div class="modal-footer border-top-0" align="right">
              <button type="buttton" class="btn btn-secondary btn-lib btn-redondo" id="btnActualizaWhats" onclick="actualizar_whats();">
                <i class="bi bi-save"></i> Guardar
              </button> 
              <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
         </div>
      </div>
   </div>`;

   $('#modalAdminExt5').html(html);
   $('#modalActualizaWhats').modal('show');
}

const actualizar_whats = async () => {

   let whatsapp = $('#whatsAppActivo').val().trim();

   if (whatsapp == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nuevo número de contacto por whatsApp',
         icon: 'warning'
      });
      $('#whatsAppActivo').focus();
      return;
   }

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El contacto del portal por whatsApp quedará vinculado al número: ' + whatsapp, 'question', 'Sí, actualizar', 'Cancelar');
   
   if (!res.result) {
      $('#btnActualizaWhats').prop('disabled', false);
      return;
   }

   $('#btnActualizaWhats').prop('disabled', true);
   let respuesta = await actualiza_whats(whatsapp);
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡WhatsApp Actualizado!', '', 'success', 2500);
      $('#modalActualizaWhats').modal('hide');
      $('#whatsAppEmpresa').val(whatsapp)
      $('#btnActualizaWhats').prop('disabled', false);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      $('#btnActualizaWhats').prop('disabled', false);
      return;
   }
}

const publicar_cambios = async () => {

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se obtendrán los últimos cambios realizados y se publicarán en el portal', 'question', 'Sí, publicar', 'Cancelar');
   
   if (!res.result) {
      return;
   }

   let respuesta = await publica_cambios();
      if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Cambios publicados!', '', 'success', 2500);
   } else {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
}

// Interfaces
window.TabPromocionesPortal        = TabPromocionesPortal;
window.ModalFormPromocion          = ModalFormPromocion;
window.ModalActualizaWhatsApp      = ModalActualizaWhatsApp;

// Funciones
window.eliminar_promocion          = eliminar_promocion
window.guardar_promocion           = guardar_promocion; 
window.buscar_promocion            = buscar_promocion;

window.agregar_estudio_promo_lista = agregar_estudio_promo_lista;
window.eliminar_estudio_promo      = eliminar_estudio_promo;

window.actualizar_whats            = actualizar_whats;

window.publicar_cambios            = publicar_cambios;