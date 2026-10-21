<?php

   $host  = $_SERVER['HTTP_HOST'] ?? '';
   $ruta  = 'http://'.$host.'/webapp/reportes/visor_resultados.php';
   
   if (empty($_POST)) {
      $inputJSON = file_get_contents('php://input');
      $inputData = json_decode($inputJSON, true);
      if (is_array($inputData)) {
         $_POST = $inputData;
      }
   }

   require_once('../config/class.pdo.php');
   $v = new Conexion();
   $v->conectar();

   if($_SESSION["plan"] == 'basico') {
      $limit = 1000; // correos al mes
   }
   else if($_SESSION["plan"] == 'pro') {
      $limit = 3000; // correos al mes
   }


   require('../../webapp/assets/lib/PHPMailer/Exception.php');
   require('../../webapp/assets/lib/PHPMailer/PHPMailer.php');
   require('../../webapp/assets/lib/PHPMailer/SMTP.php');

   use PHPMailer\PHPMailer\PHPMailer;

   function bitacora_mail(string $id_tracking, int $id_usuario, string $usuario) {
      require_once('../config/class.pdo.php');
      $v = new Conexion();
      $v->conectar(); 

      $ip        = $_SERVER["REMOTE_ADDR"];
      $port      = $_SERVER['REMOTE_PORT'];  
      $userAgent = $_SERVER['HTTP_USER_AGENT'];
      $proveedor = strtolower ($userAgent);
      
      $sql = $v->getDbh()->prepare("INSERT INTO bitacora_mail (id_usuario, usuario, mes, anio, fecha, id_tracking, ip, puerto, proveedor) VALUES (?,?,?,?,?,?,?,?,?)");
      $sql->execute(array($id_usuario, $usuario, date('m'), date('Y'), date('Y-m-d H:i:s'), $id_tracking, $ip, $port, $proveedor));
   }


   $estatus = 500;
   $mensaje = 'Petición no válida'; 
   $data    = []; 

   // ── Validación CSRF para acciones de escritura / modificación ──   
   $csrf_recibido = $_POST['CSRF_TOKEN'] ?? '';
   $csrf_sesion   = $_SESSION['csrf_token'] ?? '';

   if (!empty($csrf_recibido) || !empty($csrf_sesion) || hash_equals($csrf_sesion, $csrf_recibido)) {

      // Buscamos el límite de correos enviados en el mes 
      $sqlCorreos = $v->getDbh()->prepare("SELECT COUNT(id) AS correos_enviados FROM bitacora_mail WHERE mes = ? AND anio = ?");
      $sqlCorreos->execute([date('m'), date('Y')]);
      $rowCorreos = $sqlCorreos->fetch(PDO::FETCH_ASSOC);

      $correosEnviados = $rowCorreos["correos_enviados"];
      $porcentajeUso   = $limit > 0 ? round(($correosEnviados / $limit) * 100) : 0;

      $data = ['almacenamiento' => $correosEnviados, 'porcentaje' => $porcentajeUso, 'limite' => $limit, 'plan' => $_SESSION["plan"]];

      if($correosEnviados > $limit) {
         $estatus = 507;
         $mensaje = 'Límite de envío superado';
      }
      else {
         if (!empty($_POST["func"]) && $_POST["func"] == "notificar_mail_resultados" && $host != '') {      

            // Validamos que keyQuery no esté vacío
            if (!empty($_POST["keyQuery"]) && !empty($_POST["correo"])) {
               
               $sql = $v->getDbh()->prepare("SELECT paciente_nombre_historico, folio, key_query FROM ordenes_trabajo WHERE key_query = ?");
               $sql->execute(array($_POST["keyQuery"]));

               if ($sql->rowCount() >= 1) {
                  $row = $sql->fetch(PDO::FETCH_ASSOC);

                  // Generamos o tokenizamos el acceso seguro (puedes usar key_query o un hash MD5/SHA256)
                  $tokenAcceso = bin2hex(random_bytes(16)); // O usa $row['key_query']
                  
                  // URL PROVISIONAL para el acceso directo a los PDF del paciente
                  $urlConsulta = $ruta.'?token='. $row['key_query'] .'&lab='.urlencode($_SESSION["emp_nombre"]);

                  // Plantilla de correo médica y responsiva
                  $contenido = '
                  <!DOCTYPE html>
                  <html lang="es">
                  <head>
                     <meta charset="UTF-8">
                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
                     <title>Resultados de Laboratorio</title>
                  </head>
                  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f6f9; padding: 20px 0;">
                        <tr>
                           <td align="center">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                 
                                 <!-- Encabezado -->
                                 <tr>
                                    <td align="center" style="background-color: #0F2744; padding: 30px 20px;">
                                       <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; tracking-spacing: 0.5px;">'.$_SESSION["emp_nombre"].'</h1>
                                       <p style="color: #e0eafd; margin: 5px 0 0 0; font-size: 14px;">Centro de Notificaciones</p>
                                    </td>
                                 </tr>

                                 <!-- Cuerpo del mensaje -->
                                 <tr>
                                    <td style="padding: 40px 30px; color: #333333;">
                                       <h2 style="color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 15px;">Estimado(a) '.htmlspecialchars($row["paciente_nombre_historico"]).':</h2>
                                       <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 25px;">
                                          Le informamos que sus estudios correspondientes a la orden de trabajo <strong style="color: #111827;">#'.htmlspecialchars($row["folio"]).'</strong> ya se encuentran listos y disponibles para su revisión.
                                       </p>

                                       <!-- Botón CTA principal -->
                                       <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                                          <tr>
                                             <td align="center">
                                                <a href="'.$urlConsulta.'" target="_blank" style="background-color: #0F2744; color: #ffffff; display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px; box-shadow: 0 2px 5px rgba(13, 110, 253, 0.3);">
                                                   Ver y Descargar Resultados
                                                </a>
                                             </td>
                                          </tr>
                                       </table>

                                       <p style="font-size: 13px; line-height: 1.5; color: #6b7280; background-color: #f9fafb; padding: 12px; border-left: 4px solid #0d6efd; border-radius: 4px; margin-top: 25px;">
                                          <strong>Nota de seguridad:</strong> Este enlace es personal e intransferible. No requiere contraseña adicionales para facilitar la descarga de sus documentos.
                                       </p>
                                    </td>
                                 </tr>

                                 <!-- Pie de página -->
                                 <tr>
                                    <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                                       <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                                          Fecha de envío: '.date('d/m/Y H:i:s').'
                                       </p>
                                       <p style="font-size: 11px; color: #9ca3af; margin: 5px 0 0 0;">
                                          Este es un correo automático, por favor no responda a este mensaje.
                                       </p>
                                    </td>
                                 </tr>

                              </table>
                           </td>
                        </tr>
                     </table>
                  </body>
                  </html>';

                  $oMail              = new PHPMailer();
                  $oMail->isSMTP();
                  $oMail->CharSet    = 'UTF-8';
                  $oMail->Host       = 'smtp.gmail.com';  
                  $oMail->SMTPSecure = 'tls'; //Tipo se seguridad
                  $oMail->Port       = 587;   //Puerto      
                  $oMail->SMTPAuth   = true;  //True indica que se tendrá que aunténticar por FTP.      
                  // $oMail->Username   = 'segobver.egob@gmail.com';
                  // $oMail->Password   = 'pjczhzqrocikkvjc';
                  $oMail->Username   = 'miguel.gasperin9@gmail.com';
                  $oMail->Password   = 'qresaqxpybbbrojo';

                  $oMail->setFrom('miguel.gasperin9@gmail.com', $_SESSION["emp_nombre"]);
                  $oMail->addAddress($_POST["correo"], $row["paciente_nombre_historico"]);
                  $oMail->Subject    = 'Resultados Disponibles - Orden #' . $row["folio"];        
                  $oMail->msgHTML($contenido);

                  if ($oMail->send()) {
                     $estatus = 200;
                     $mensaje = 'Correo enviado exitosamente';
                     bitacora_mail($row["folio"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
                     
                  } else {
                     $estatus = 500;
                     $mensaje = 'Error al enviar el correo: ' . $oMail->ErrorInfo;
                  }
               } else {
                  $estatus = 404;
                  $mensaje = 'No se encontró la información de la orden especificada';
               }
            } else {
               $estatus = 400;
               $mensaje = 'Parámetros incompletos (keyQuery o correo faltante)';
            }
         }
      }
   }
   else {
      $estatus = 500;
      $mensaje = 'Petición no autorizada (Token CSRF inválido)';
   }

   header('Content-Type: application/json');
   echo json_encode(array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data), JSON_FORCE_OBJECT);
?>