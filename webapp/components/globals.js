const comboMeses = `
<option value="1">Enero</option>
<option value="2">Febrero</option>
<option value="3">Marzo</option>
<option value="4">Abril</option>
<option value="5">Mayo</option>
<option value="6">Junio</option>
<option value="7">Julio</option>
<option value="8">Agosto</option>
<option value="9">Septiembre</option>
<option value="10">Octubre</option>
<option value="11">Noviembre</option>
<option value="12">Diciembre</option>`;

const REGIMENES_FISCALES = [
  { clave: '601', descripcion: 'General de Ley Personas Morales', aplicaFisica: false, aplicaMoral: true },
  { clave: '603', descripcion: 'Personas Morales con Fines no Lucrativos', aplicaFisica: false, aplicaMoral: true },
  { clave: '605', descripcion: 'Sueldos y Salarios e Ingresos Asimilados a Salarios', aplicaFisica: true, aplicaMoral: false },
  { clave: '606', descripcion: 'Arrendamiento', aplicaFisica: true, aplicaMoral: false },
  { clave: '607', descripcion: 'Régimen de Enajenación o Adquisición de Bienes', aplicaFisica: true, aplicaMoral: false },
  { clave: '608', descripcion: 'Demás ingresos', aplicaFisica: true, aplicaMoral: false },
  { clave: '610', descripcion: 'Residentes en el Extranjero sin Establecimiento Permanente en México', aplicaFisica: true, aplicaMoral: true },
  { clave: '611', descripcion: 'Ingresos por Dividendos (socios y accionistas)', aplicaFisica: true, aplicaMoral: false },
  { clave: '612', descripcion: 'Personas Físicas con Actividades Empresariales y Profesionales', aplicaFisica: true, aplicaMoral: false },
  { clave: '614', descripcion: 'Ingresos por intereses', aplicaFisica: true, aplicaMoral: false },
  { clave: '615', descripcion: 'Régimen de los ingresos por obtención de premios', aplicaFisica: true, aplicaMoral: false },
  { clave: '616', descripcion: 'Sin obligaciones fiscales', aplicaFisica: true, aplicaMoral: false },
  { clave: '620', descripcion: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos', aplicaFisica: false, aplicaMoral: true },
  { clave: '621', descripcion: 'Incorporación Fiscal', aplicaFisica: true, aplicaMoral: false },
  { clave: '622', descripcion: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras', aplicaFisica: false, aplicaMoral: true },
  { clave: '623', descripcion: 'Opcional para Grupos de Sociedades', aplicaFisica: false, aplicaMoral: true },
  { clave: '624', descripcion: 'Coordinados', aplicaFisica: false, aplicaMoral: true },
  { clave: '625', descripcion: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas', aplicaFisica: true, aplicaMoral: false },
  { clave: '626', descripcion: 'Régimen Simplificado de Confianza (RESICO)', aplicaFisica: true, aplicaMoral: true }
];

const USOS_CFDI = [
  { clave: 'G01', descripcion: 'Adquisición de mercancías', aplicaFisica: true, aplicaMoral: true },
  { clave: 'G02', descripcion: 'Devoluciones, descuentos o bonificaciones', aplicaFisica: true, aplicaMoral: true },
  { clave: 'G03', descripcion: 'Gastos en general', aplicaFisica: true, aplicaMoral: true },
  { clave: 'I01', descripcion: 'Construcciones', aplicaFisica: true, aplicaMoral: true },
  { clave: 'I02', descripcion: 'Mobiliario y equipo de oficina por inversiones', aplicaFisica: true, aplicaMoral: true },
  { clave: 'I03', descripcion: 'Equipo de transporte', aplicaFisica: true, aplicaMoral: true },
  { clave: 'I04', descripcion: 'Equipo de cómputo y accesorios', aplicaFisica: true, aplicaMoral: true },
  { clave: 'I05', descripcion: 'Dados, troqueles, moldes, matrices y herramental', aplicaFisica: true, aplicaMoral: true },
  { clave: 'I06', descripcion: 'Comunicaciones telefónicas', aplicaFisica: true, aplicaMoral: true },
  { clave: 'I07', descripcion: 'Comunicaciones satelitales', aplicaFisica: true, aplicaMoral: true },
  { clave: 'I08', descripcion: 'Otra maquinaria y equipo', aplicaFisica: true, aplicaMoral: true },
  { clave: 'D01', descripcion: 'Honorarios médicos, dentales y gastos hospitalarios', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D02', descripcion: 'Gastos médicos por incapacidad o discapacidad', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D03', descripcion: 'Gastos funerales', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D04', descripcion: 'Donativos', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D05', descripcion: 'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D06', descripcion: 'Aportaciones voluntarias al SAR', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D07', descripcion: 'Primas por seguros de gastos médicos', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D08', descripcion: 'Gastos de transportación escolar obligatoria', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D09', descripcion: 'Depósitos en cuentas especiales para el ahorro, primas que tengan como base planes de pensiones', aplicaFisica: true, aplicaMoral: false },
  { clave: 'D10', descripcion: 'Pagos por servicios educativos (colegiaturas)', aplicaFisica: true, aplicaMoral: false },
  { clave: 'S01', descripcion: 'Sin efectos fiscales', aplicaFisica: true, aplicaMoral: true },
  { clave: 'CP01', descripcion: 'Pagos', aplicaFisica: true, aplicaMoral: true },
  { clave: 'CN01', descripcion: 'Nómina', aplicaFisica: true, aplicaMoral: false }
];

const arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const hoy = new Date();
// Opción con es-MX configurado para dar YYYY-MM-DD
const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
const fecActual = hoy.toLocaleDateString('es-MX', opciones).split('/').reverse().join('-');

// 2. Obtener la fecha con +7 días
const futura = new Date();
futura.setDate(hoy.getDate() + 7); // Maneja automáticamente cambios de mes/año
const fechaRangoAdelante = futura.toISOString().split('T')[0];

// 2. Obtener la fecha con +7 días
const anterior = new Date();
anterior.setDate(hoy.getDate() - 15); // Maneja automáticamente cambios de mes/año
const fechaRangoAtras = anterior.toISOString().split('T')[0];

const getBadgeEstatus = (estatus) => {
   let bgClass = 'bg-secondary';
   switch ((estatus || '').toUpperCase()) {
      case 'RECEPCION': bgClass = 'bg-secondary text-white'; break;
      case 'PROCESO': bgClass = 'bg-warning text-dark'; break;
      case 'LISTO': bgClass = 'bg-success'; break;
      case 'ENTREGADO': bgClass = 'bg-primary'; break;
      case 'CANCELADO': bgClass = 'bg-danger'; break;
   }
   return `<span class="badge ${bgClass} bg-opacity-75 rounded-pill px-2 py-1 fw-normal small">${estatus || 'N/A'}</span>`;
};

const getCeldaPago = (estatusPago, totalNeto, totalAbonado, saldoDeudor) => {
  
  const estatusUpper = (estatusPago || 'PENDIENTE').toUpperCase();

  // 1. Caso PAGADO
  if (estatusUpper === 'PAGADO') {
    return `
        <span class="d-block text-success fw-bold small">
          <i class="bi bi-check-circle-fill me-1"></i>${fmtMoney(totalNeto)}
        </span>
        <span class="extra-small text-muted small">Saldado</span>`;
  }

  // 2. Caso PARCIAL
  if (estatusUpper === 'PARCIAL') {
    return `
        <span class="d-block text-danger fw-bold small">
          Resta ${fmtMoney(saldoDeudor)}
        </span>
        <span class="extra-small text-secondary small">
          <i class="bi bi-wallet2 me-1 opacity-50"></i>Abono: ${fmtMoney(totalAbonado)}
        </span>`;
  }

  // 3. Caso PENDIENTE
  return `
    <span class="d-block text-danger fw-bold small">
        Debe ${fmtMoney(totalNeto)}
    </span>
    <span class="extra-small text-muted small">
        <i class="bi bi-exclamation-circle me-1 opacity-50"></i>Sin abono
    </span>`;
};

export const postJSON = async (url, datos = {}) => {
  try {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    return await res.json();  // ← devuelve directamente el json del servidor

  } catch (err) {
    return manejarErrorRequest(err);
  }
};

export const postFormData = async (url, formData) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData      // no se pone content-type!
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    return await res.json();

  } catch (err) {
    return manejarErrorRequest(err);
  }
};

export const iniciales = (nombre) => {
  const palabras = nombre.trim().split(' ');
  return (palabras[0][0] + (palabras[1] ? palabras[1][0] : '')).toUpperCase();
};

export const manejarErrorRequest = (error) => {
    // Sin internet
    if (!navigator.onLine) {
      return {
        estatus: 0,
        mensaje: "No tienes conexión a internet.",
        data: []
      };
    }

    // Safari / fallo fetch / red caída
    if (
      error.name === 'TypeError' ||
      error.message?.includes('Load failed')
    ) {
      return {
          estatus: 0,
          mensaje: "Error de conexión: No se pudo conectar con el servidor.",
          data: []
      };
    }

    // Servidor caído
    return {
      estatus: 500,
      mensaje: "El servidor no respondió. Intenta de nuevo.",
      data: []
    };
};

const reducirImagen = (file, maxWidth = 1200, quality = 0.7) => {

  return new Promise((resolve)=>{

    const reader = new FileReader();

    reader.onload = function(e){

      const img = new Image();

      img.onload = function(){

        let width = img.width;
        let height = img.height;

        // reducir si es grande
        if(width > maxWidth){
          height = height * (maxWidth / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0,width,height);

        canvas.toBlob(function(blob){

          const newFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, ".jpg"),
            {type:"image/jpeg"}
          );
          resolve(newFile);

        },"image/jpeg",quality);

      };

      img.src = e.target.result;

    };

    reader.readAsDataURL(file);

  });

}

const fmtMoney = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseFloat(val || 0));

const fnFailPeticion = (err = '') => {
  ToastColor.fire({
    text: '¡Hubo un problema, recarga la página e inténtalo de nuevo!' + err,
    icon: 'info',
    position: 'top',
    timerProgressBar: false
  });
  return;
}

const fnNoSesion = () => {
  ToastColor.fire({
    text: '¡Tu sesión ha caducado! Inicia sesión de nueva cuenta',
    icon: 'info',
    position: 'top',
    timer: 4000,
    timerProgressBar: false
  });
  setTimeout("location.href='index'", 3500);
  return;
}

const fnViewFile = (titulo, ruta) => {
  if (titulo != '' && ruta != '') {
    $('#titModalViewFile').html(titulo);
    $('#modalViewFile').modal('show');
    $('#containerViewFile').html(html);
    let html = '<iframe width="100%" height="550" src="' + ruta + '" frameborder="0" allowfullscreen></iframe>';
  }
}

const fnFechaActual = () => {
  var date = new Date();
  var mes;
  var dia;
  date.getMonth() + 1 < 10 ? mes = '0' + (date.getMonth() + 1) : mes = (date.getMonth() + 1);
  date.getDate() < 10 ? dia = '0' + date.getDate() : dia = date.getDate();
  var anio = date.getFullYear();
  var fecha = anio + '-' + mes + '-' + dia;
  return fecha;
}

const fnValidaMail = (correo) => {
  let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  if (emailRegex.test(correo))
    return true;
  else
    return false;
}

const fnObtieneEdad = (dateString) => {
  let hoy = new Date()
  let fechaNacimiento = new Date(dateString)

  var dias = hoy.getDate() - fechaNacimiento.getDate();
  var meses = hoy.getMonth() - fechaNacimiento.getMonth();
  var anios = hoy.getFullYear() - fechaNacimiento.getFullYear();

  if (meses < 0 || (meses === 0 && dias < 1)) {
    anios--;
  }

  let edad = { anios, meses, dias };
  return edad
}

const quitarAcentos = (texto) => {
  return texto
    .trim()
    .normalize("NFD") // Separa la letra del acento (ej: 'á' se vuelve 'a' + '´')
    .replace(/[\u0300-\u036f]/g, ""); // Borra todos los acentos combinados
}

const fnReglaEscritura = () => {
  jQuery('.reglaEscritura').keypress(function (tecla) {
    // Bloqueo de caracteres acento(243)
    if (tecla.charCode == 39 || tecla.charCode == 34 || tecla.charCode == 193 || tecla.charCode == 201 || tecla.charCode == 205 || tecla.charCode == 211 || tecla.charCode == 218 || tecla.charCode == 225 || tecla.charCode == 233 || tecla.charCode == 237 || tecla.charCode == 243 || tecla.charCode == 250) {
      id = $(this).attr("id");
      return false;
    }
  });

  jQuery('.reglaEscritura').keyup(function () {
    this.value = this.value.toUpperCase();
  });
}

const fnValidaNumeros = (e) => {
  let tecla  = e.which || e.keyCode;
  let patron = /\d/; // Solo acepta números
  let te     = String.fromCharCode(tecla);
  return (patron.test(te) || tecla == 9 || tecla == 8 || tecla == 127 || tecla == 46);
  // 46 es el punto, 127 DEL, 9 TAB, 8 Retroceso, 45 guion
}


/* Funciones para ejecutar SweetAlert */
const showMessageSwal = (title, message, type) => {
  swal.fire({
    title: title,
    html: message,
    icon: type,
    customClass: {
      popup: 'sweetAlert2Popup',
      header: 'sweetAlert2PopupHeader',
      title: 'sweetAlert2PopupTitle',
      icon: 'sweetAlert2PopupIcon',
      confirmButton: 'sweetAlert2PopupConfirm',
      cancelButton: 'sweetAlert2PopupCancel',
      container: 'my-swal'
    },
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#3085d6',
    allowOutsideClick: false,
    allowEscapeKey: false
  });
}

const showMessageSwalTimer = async (title, message = '', type, time = 2500) => {
  await swal.fire({
    title: title,
    html: message,
    timer: time,
    icon: type,
    customClass: {
      popup: 'sweetAlert2Popup',
      header: 'sweetAlert2PopupHeader',
      title: 'sweetAlert2PopupTitle',
      icon: 'sweetAlert2PopupIcon',
      confirmButton: 'sweetAlert2PopupConfirm',
      cancelButton: 'sweetAlert2PopupCancel',
      container: 'my-swal'
    },
    showConfirmButton: false
  }).then((result) => {
    // se envia solo return por que no se espera un valor de respuesta
    return;
  });
  return;
}

const showMessageSwalAction = async (title, message, type) => {
  let aResult = await swal.fire({
    title: title,
    html: message,
    icon: type,
    customClass: {
      popup: 'sweetAlert2Popup',
      header: 'sweetAlert2PopupHeader',
      title: 'sweetAlert2PopupTitle',
      icon: 'sweetAlert2PopupIcon',
      confirmButton: 'sweetAlert2PopupConfirm',
      cancelButton: 'sweetAlert2PopupCancel',
      container: 'my-swal'
    },
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#3085d6',
    allowOutsideClick: false,
    allowEscapeKey: false,

  }).then((result) => {
    // se envia solo return por que no se espera un valor de respuesta
    return;
  });
  return;
}

const showMessageSwalQuestion = async (title, message, type, textAceptar, textCancelar) => {
  const result = await swal.fire({
    title: title,
    html: message, // <-- Renderiza HTML sin problemas
    icon: type,
    customClass: {
      popup: 'sweetAlert2Popup',
      header: 'sweetAlert2PopupHeader',
      title: 'sweetAlert2PopupTitle',
      icon: 'sweetAlert2PopupIcon',
      confirmButton: 'sweetAlert2PopupConfirm',
      cancelButton: 'sweetAlert2PopupCancel',
      container: 'my-swal'
    },
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    confirmButtonText: textAceptar,
    cancelButtonText: textCancelar ?? "Cancelar",
    allowOutsideClick: false,
    allowEscapeKey: false
  });

  // Retorna directamente el valor booleano (true si dio clic en aceptar, false/undefined si canceló)
  return { result: !!result.isConfirmed };
}

// Funciones para el toast de SweetAlert2

/* Crear Toast de SweetAlert2 */
const crearToastColor = () => {
  const myObj = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
      container: 'my-swal'
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  return myObj;
}

/* Crear Toast básico con fondo blanco e iconos de color de acuerdo al tipo warning, success, info, question, error */
const crearToastBase = () => {
  const myObj = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    customClass: { popup: 'custom-toast', container: 'my-swal' },
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  return myObj;
}

const ToastColor = crearToastColor();
const ToastBase = crearToastBase();

// Funciones para cargar la información de catálogos genéricos
const comboUsuarios = () => {
  let datos = { func: 'comboUsuarios' };
  $.ajax({
    url: "../../api/controller/fnGlobales.php",
    type: "POST",
    data: datos
  }).done((res) => {
    if (res.length > 0) {
      arrUsuarios = res;
    }
  }).fail((err) => {
    ToastColor.fire({
      text: '¡Atención! No se obtuvieron los docentes, recarga la página y vuelve a intentarlo',
      icon: 'info',
      position: 'top',
      timerProgressBar: false
    });
    return;
  });
}

const comboAnios = () => {
  let fecha = fnFechaActual();
  let fec = fecha.split('-');
  let optionAnios = '';
  for (let index = fec[0]; index >= 2024; index--) {
    optionAnios += `<option value="${index}">${index}</option>`;    
  }

  return optionAnios;
}


function initDataTableExport({ tableId, titulo = '', alignment = [], exportColumns = [], posicionOrden = 0, order = 'asc', columnDefs = [], columnAlignments = {}}, orientation = 'portrait') {
  return new DataTable(tableId, {
    layout: {
      topStart: {
        buttons: [
          'copy',
          {
            extend: 'excel',
            title: titulo,
            exportOptions: {
              columns: exportColumns
            }
          },
          {
            extend: 'pdf',
            title: titulo,
            orientation: orientation,
            exportOptions: {
              columns: exportColumns
            },
            customize: function(doc) {

              // ✅ Ajuste de ancho dinámico
              if (alignment.length === exportColumns.length) {
                doc.content[1].table.widths = alignment;
              }              

              const body = doc.content[1].table.body;

              // ✅ Alineación dinámica por columna exportada
              for (let i = 1; i < body.length; i++) {
                for (let j = 0; j < body[i].length; j++) {
                  
                  if (columnAlignments[j]) {
                    body[i][j].alignment = columnAlignments[j];
                  } else {
                    body[i][j].alignment = 'center'; // default
                  }

                }
              }
            }
          }
        ]
      }
    },

    columnDefs: columnDefs.length > 0 ? columnDefs : [
      {
        targets: 0,
        visible: false,
        searchable: false
      }
    ],

    language: {
      url: "assets/lib/DataTables/es-ES.json",
    },

    responsive: true,

    order: [[posicionOrden, order]]
  });
}

function formatoMoneda (numero) {
  return parseFloat(numero).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


function esStringNumerico(cadena) {
  // Intenta convertir a número y verifica si no es NaN y si el original no estaba vacío/espacio
  const num = Number(cadena);
  return !isNaN(num) && typeof cadena === 'string' && cadena.trim() !== '';
}

window.initDataTableExport     = initDataTableExport;
window.comboUsuarios           = comboUsuarios;
window.comboAnios              = comboAnios;
window.showMessageSwal         = showMessageSwal;
window.showMessageSwalTimer    = showMessageSwalTimer;
window.showMessageSwalAction   = showMessageSwalAction;
window.showMessageSwalQuestion = showMessageSwalQuestion;
window.fnValidaNumeros         = fnValidaNumeros;
window.fnObtieneEdad           = fnObtieneEdad;
window.fnValidaMail            = fnValidaMail;
window.fnFechaActual           = fnFechaActual;
window.fnNoSesion              = fnNoSesion;
window.fnFailPeticion          = fnFailPeticion;
window.ToastColor              = ToastColor;
window.ToastBase               = ToastBase;
window.arrayMeses              = arrayMeses;
window.fnReglaEscritura        = fnReglaEscritura;
window.fnViewFile              = fnViewFile;
window.fnFailPeticion          = fnFailPeticion;
window.esStringNumerico        = esStringNumerico;
window.fecActual               = fecActual;
window.fechaRangoAdelante      = fechaRangoAdelante;
window.fechaRangoAtras         = fechaRangoAtras;
window.reducirImagen           = reducirImagen;
window.formatoMoneda           = formatoMoneda;
window.iniciales               = iniciales;
window.quitarAcentos           = quitarAcentos;
window.comboMeses              = comboMeses;
window.fmtMoney                = fmtMoney;
window.getBadgeEstatus         = getBadgeEstatus;
window.getCeldaPago            = getCeldaPago;
window.REGIMENES_FISCALES      = REGIMENES_FISCALES;
window.USOS_CFDI               = USOS_CFDI;


