const TabCatalogos = () => {
  let html =
    `<div class="row">
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-3 col-12">
        <div class="submenu">
          <div class="opt-sub-menu active" onclick="TabUsuarios();">Usuarios</div>
          <div class="opt-sub-menu active">Maestros invitados</div>
          <div class="opt-sub-menu">Aulas</div>
          <div class="opt-sub-menu">Banco de Tésis</div>
          <div class="opt-sub-menu">Especialidades</div>
          <div class="opt-sub-menu">Materias</div>
          <div class="opt-sub-menu">Modalidades</div>
          <div class="opt-sub-menu">Niveles</div>
        </div>
      </div>
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-9 col-12">
        <div id="vistaCatalogo"></div>
      </div>
    </div>`;
  $('#containerMain').html(html);
}