const arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const estadosMexico = `
<option value="Aguascalientes">Aguascalientes</option>
<option value="Baja California">Baja California</option>
<option value="Baja California Sur">Baja California Sur</option>
<option value="Campeche">Campeche</option>
<option value="Chiapas">Chiapas</option>
<option value="Chihuahua">Chihuahua</option>
<option value="Ciudad de México">Ciudad de México</option>
<option value="Coahuila">Coahuila</option>
<option value="Colima">Colima</option>
<option value="Durango">Durango</option>
<option value="Estado de México">Estado de México</option>
<option value="Guanajuato">Guanajuato</option>
<option value="Guerrero">Guerrero</option>
<option value="Hidalgo">Hidalgo</option>
<option value="Jalisco">Jalisco</option>
<option value="Michoacán">Michoacán</option>
<option value="Morelos">Morelos</option>
<option value="Nayarit">Nayarit</option>
<option value="Nuevo León">Nuevo León</option>
<option value="Oaxaca">Oaxaca</option>
<option value="Puebla">Puebla</option>
<option value="Querétaro">Querétaro</option>
<option value="Quintana Roo">Quintana Roo</option>
<option value="San Luis Potosí">San Luis Potosí</option>
<option value="Sinaloa">Sinaloa</option>
<option value="Sonora">Sonora</option>
<option value="Tabasco">Tabasco</option>
<option value="Tamaulipas">Tamaulipas</option>
<option value="Tlaxcala">Tlaxcala</option>
<option value="Veracruz">Veracruz</option>
<option value="Yucatan">Yucatán</option>
<option value="Zacatecas">Zacatecas</option>`;

const hoy = new Date();
const fecActual = hoy.toISOString().split('T')[0];

// 2. Obtener la fecha con +7 días
const futura = new Date();
futura.setDate(hoy.getDate() + 7); // Maneja automáticamente cambios de mes/año
const fechaRangoAdelante = futura.toISOString().split('T')[0];

// 2. Obtener la fecha con +7 días
const anterior = new Date();
anterior.setDate(hoy.getDate() - 15); // Maneja automáticamente cambios de mes/año
const fechaRangoAtras = anterior.toISOString().split('T')[0];

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
    console.error("postJSON error:", err);
    throw err; // lo dejamos subir para que el que llame decida qué hacer
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
    console.error("postFormData error:", err);
    throw err;
  }
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

  edad = { anios, meses, dias };
  return edad
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
  let vResult = {};
  vResult = await swal.fire({
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
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    confirmButtonText: textAceptar,
    cancelButtonText: textCancelar ?? "cancelar",
    allowOutsideClick: false,
    allowEscapeKey: false
  })
    .then((result) => {
      // se envia el valor de respuesta de acuerdo al boton seleccionado
      // boton aceptar devuelve boleano true, cancelar devuelve undefined
      vResult.result = result.value
      return vResult;
    });
  return vResult;
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
window.estadosMexico           = estadosMexico;

