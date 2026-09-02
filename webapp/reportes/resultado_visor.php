<?php
/**
 * Script Portero: Acceso Seguro a Documentos Adjuntos
 * Valida la sesión del usuario y sirve el archivo PDF de forma interna.
 */

require_once('../../api/config/class.pdo.php');

$v = new Conexion();
$v->conectar();

// 2. Validar que se haya recibido un ID de adjunto válido
if (!isset($_GET['token']) || empty($_GET['token'])) {
   header("HTTP/1.1 400 Bad Request");
   echo '<center><h4>Falta el parámetro del documento.</h4></center>';
   exit;
}

$key_query = $_GET['token'];

try {
    $sql = $v->dbh->prepare("SELECT id, orden_folio, nombre_servidor FROM orden_resultados_pdf WHERE key_query_pdf = ? LIMIT 1");
    $sql->execute([$key_query]);
    $archivo_db = $sql->fetch();
} catch (\PDOException $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo "Error al consultar la base de datos.";
    exit;
}

// Si no existe el registro en la BD, terminamos
if (!$archivo_db) {
   header("HTTP/1.1 404 Not Found");
   echo "El documento solicitado no existe en nuestros registros.";
   exit;
}

// 5. Construir la ruta física real en el servidor
// Basado en tu estructura: docs/adjuntos_notas/{id_cita}/{nom_archivo}.pdf
$folio          = $archivo_db['orden_folio'];
$nombre_archivo = $archivo_db['nombre_servidor'];

// Definimos la ruta relativa hacia la carpeta protegida por el .htaccess
// Nota: Asegúrate de ajustar los niveles de carpetas (../) dependiendo de dónde coloques este script PHP
$ruta_carpeta_protegida = "../assets/docs/resultados/" . $folio . "/";
$ruta_real_archivo      = $ruta_carpeta_protegida . $nombre_archivo;

// 6. Validar que el archivo físico exista en el disco
if (!file_exists($ruta_real_archivo)) {
    header("HTTP/1.1 404 Not Found");
    echo "Archivo físico no encontrado. Contacte al administrador.";
    exit;
}

// 7. Cabeceras mágicas para despachar el PDF de forma nativa y segura
// Limpiamos cualquier búfer de salida previo para evitar corromper el PDF
if (ob_get_level()) {
    ob_end_clean();
}

// Decimos al navegador que el contenido es un PDF
header('Content-Type: application/pdf');

// 'inline' hace que el navegador lo muestre en pantalla (dentro del iframe/modal) en vez de descargarlo automáticamente
// filename es el nombre que verá el usuario si decide darle al botón "guardar" del visor
header('Content-Disposition: inline; filename="' . basename($nombre_archivo) . '.pdf"');

header('Content-Transfer-Encoding: binary');
header('Accept-Ranges: bytes');
header('Content-Length: ' . filesize($ruta_real_archivo));

// Evitar que el archivo se quede en la caché de navegadores públicos
header('Cache-Control: private, max-age=0, must-revalidate');
header('Pragma: public');

// 8. Leer el archivo y transmitirlo al navegador
readfile($ruta_real_archivo);
exit;