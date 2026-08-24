<?php
// Desactivar salida de errores para evitar corromper la imagen PNG
error_reporting(0);
ini_set('display_errors', 0);

// Limpiar buffer previo de salida (espacios en blanco o marcas BOM)
if (ob_get_length()) {
    ob_clean();
}

$code   = isset($_GET['code']) && !empty($_GET['code']) ? trim($_GET['code']) : '000000';
$height = isset($_GET['height']) ? intval($_GET['height']) : 50;
$scale  = isset($_GET['scale'])  ? intval($_GET['scale'])  : 2;

// Mapa Code128 Auto/B
function getCode128Bars($text) {
    $code128_patterns = [
        '212222','222122','222221','121223','121322','131222','122213','122312','132212','221213',
        '221312','231212','112232','122132','122231','113222','123122','123221','223211','221132',
        '221231','213212','223112','312131','311222','321122','321221','312212','322112','322211',
        '212123','212321','232121','111323','131123','131321','112313','132113','132311','211313',
        '231113','231311','112133','112331','132131','113123','113321','133121','313121','211331',
        '231131','311123','311321','331121','312113','312311','332111','314111','221411','431111',
        '111224','111422','121124','121421','141122','141221','112214','112412','122114','122411',
        '142112','142211','241211','221114','411211','214111','111242','121142','121241','114212',
        '124112','124211','411122','421112','421211','212141','214121','412121','111143','111341',
        '131141','114113','114311','411113','411311','113141','114131','311141','411131','211412',
        '211214','211232','2331112'
    ];

    $chars = str_split($text);
    $checksum = 104; // Start Code B
    $structure = $code128_patterns[104];

    foreach ($chars as $i => $char) {
        $val = ord($char) - 32;
        if ($val < 0 || $val > 95) $val = 0;
        $checksum += $val * ($i + 1);
        $structure .= $code128_patterns[$val];
    }

    $checksum = $checksum % 103;
    $structure .= $code128_patterns[$checksum];
    $structure .= $code128_patterns[106]; // Stop Code

    return $structure;
}

$bars = getCode128Bars($code);

// Calcular dimensiones
$total_units = 0;
for ($i = 0; $i < strlen($bars); $i++) {
    $total_units += intval($bars[$i]);
}

$quiet_zone = 10;
$img_width  = ($total_units + ($quiet_zone * 2)) * $scale;
$img_height = $height;

$im = imagecreate($img_width, $img_height);
$bg = imagecolorallocate($im, 255, 255, 255);
$black = imagecolorallocate($im, 0, 0, 0);

$x = $quiet_zone * $scale;
for ($i = 0; $i < strlen($bars); $i++) {
    $bar_width = intval($bars[$i]) * $scale;
    if ($i % 2 == 0) {
        imagefilledrectangle($im, $x, 0, $x + $bar_width - 1, $img_height, $black);
    }
    $x += $bar_width;
}

// Enviar cabecera de imagen
header('Content-Type: image/png');
header('Cache-Control: no-store, no-cache, must-revalidate');

imagepng($im);

// Destrucción limpia según la versión de PHP
if (PHP_VERSION_ID < 80000) {
    imagedestroy($im);
} else {
    unset($im);
}

exit;