<?php 
  require_once __DIR__ . '/../../webapp/assets/lib/PHPMailer/Exception.php';
  require_once __DIR__ . '/../../webapp/assets/lib/PHPMailer/PHPMailer.php';
  require_once __DIR__ . '/../../webapp/assets/lib/PHPMailer/SMTP.php';
  use PHPMailer\PHPMailer\PHPMailer;

  require_once(__DIR__.'/../config/class.pdo.php');
  $v = new Conexion();
  $v->conectar();

  $fecha     = date("Y-m-d H:i:s");
  $contenido = ''; 
  $mensaje   = 'Iniciando proceso';
  
  $sql = $v->dbh->prepare("SELECT folio, nom_cliente_hist, nom_categoria_cliente_hist, cargo_extra, total, DATE_FORMAT(fecha_entrega,'%d-%m-%Y') AS fecha_entrega_format, 
      fecha_limite_pago, DATE_FORMAT(fecha_limite_pago,'%d-%m-%Y') AS fecha_limite_pago_format, fecha_cap, DATE_FORMAT(fecha_cap,'%d-%m-%Y %H:%i:%s') AS fecha_cap_format, DATE_FORMAT(fecha_surtido,'%d-%m-%Y %H:%i:%s') AS fecha_surtido_format, DATE_FORMAT(fecha_pagado,'%d-%m-%Y %H:%i:%s') AS fecha_pagado_format, estatus, tipo_pedido, debiente, CASE
      WHEN fecha_limite_pago = CURDATE() THEN 'Hoy' 
      WHEN fecha_limite_pago = CURDATE() + INTERVAL 1 DAY THEN 'Mañana' 
      WHEN fecha_limite_pago < CURDATE() THEN 'Vencido' 
      END AS estatus_alerta
      FROM pedido 
      WHERE fecha_limite_pago <= CURDATE() + INTERVAL 1 DAY AND estatus <> 'Pagado'
      ORDER BY fecha_limite_pago ASC;"
  );
  $sql->execute();
  if($sql->rowCount() > 0) {
    $res = $sql->fetchAll(PDO::FETCH_ASSOC);

    $contenido = 
    '<center>
      <div style="border: solid 2px #EFEEED; background-color:#EFEEED; border-radius:5px; width:98%; padding: 10px;">
        <br><br><br>
        <div style="background-color: #BEE3EB; width:80%; padding: 20px; color: #000; font-size:25px;">
          elao<br>
          <span style="font-size:12px;">Notificación automática del sistema</span>
        </div>
        <div style="background-color: #FFFFFF; width:80%; padding: 20px;">
          <div style="color: #696968; font-size:22px; margin-top:10px; text-align: left; padding:20px;">
              <b>Listado de pedidos próximos a vencer / vencidos.</b>
          </div>';

          foreach ($res as $key => $row) {

            if ($row["tipo_pedido"] == 1) {
              $tipo_pedido = 'Punto de venta';
            } elseif ($row["tipo_pedido"] == 2) {
              $tipo_pedido = 'Evento';
            } else {
              $tipo_pedido = 'No identificado';
            }

            if($row["estatus_alerta"] == 'Hoy') {
              $estatus_alerta = '<strong style="color: #eca007">'.$row["estatus_alerta"].'</strong>';
            }
            else if($row["estatus_alerta"] == 'Vencido') {
              $estatus_alerta = '<strong style="color: #a01705">'.$row["estatus_alerta"].'</strong>';
            }
            else {
              $estatus_alerta = '<strong style="color: #0e5ab1">'.$row["estatus_alerta"].'</strong>';
            }

            $contenido.=
            '<div style="color: #696968; margin-top:10px; padding:20px; text-align: left; background-color:#EFEEED; width:92%; border-radius:5px;">
              <table style="width:100%;">
                <tr>
                  <td width="15%">'.$estatus_alerta.'</strong></td>
                  <td width="15%">'.$row["folio"].'</td>
                  <td width="40%"><strong>Cliente:</strong> '.$row["nom_cliente_hist"].'</td>
                  <td width="15%"><strong>Estatus:</strong> '.$row["estatus"].'</td>
                  <td width="15%"><strong>Tipo:</strong> '.$tipo_pedido.'</td>
                </tr>
                <tr>
                  <td><strong>Total:</strong> $ '.number_format(($row["total"] + $row["cargo_extra"]),2).'</td>
                  <td><strong>Debiente:</strong> $ '.$row["debiente"].'</td>
                </tr>
              </table>
              <br>
              <table style="width:100%; font-size:12px; color: #696968;">
                <tr>
                  <td width="20%"><strong>Registrado:</strong> '.$row["fecha_cap_format"].'</td>
                  <td width="20%"><strong>Entrega estimada:</strong> '.$row["fecha_entrega_format"].'</td>
                  <td width="20%"><strong>Límite pago:</strong> '.$row["fecha_limite_pago_format"].'</td>
                  <td width="20%"><strong>Surtido:</strong> '.$row["fecha_surtido_format"].'</td>
                  <td width="20%"><strong>Pagado:</strong> '.$row["fecha_pagado_format"].'</td>
                </tr>
              </table>
            </div>';
          }          

          $contenido.= '
          <div style="color: #666666; font-size:15px; margin-top:20px; text-align: left; padding:20px;">
              DETALLES DEL MOVIMIENTO<br><br>
              <b>Movimiento: </b>Notificación automática de pagos vencidos<br>
              <b>Generado por: </b> elao<br>
              <b>Fecha y hora del sistema: </b>'.$fecha.'
          </div>
          </div>
        <br><br><br>
      </div>
    </center>';

    $oMail                = new PHPMailer();
    $oMail->isSMTP();
    $oMail->CharSet       = 'UTF-8';
    $oMail->Host          = 'elao.com.mx';
    $oMail->Username      = 'notificaciones@elao.com.mx';
    $oMail->Password      = 'VBPgue$@(jZIEoBM';
    $oMail->SMTPSecure    = 'tls'; //Tipo se seguridad
    $oMail->Port          = 587;   //Puerto      
    $oMail->SMTPAuth      = true;  //True indica que se tendrá que aunténticar por SMTP.
    $oMail->Timeout       = 30;   
    $oMail->SMTPKeepAlive = true;
    

    $oMail->setFrom('notificaciones@elao.com.mx','Sistema de notificaciones - elao');
    $oMail->addAddress('miguel.gasperin9@gmail.com', 'Miguel Ángel Sáinz Gasperín');
    
    $oMail->Subject    = 'Alerta pagos vencidos - elao';			
    $oMail->msgHTML($contenido);

    //$oMail->SMTPDebug = 2; //Muestra los errores detallados de la comunicación con el servidor SMTP
    
    if($oMail->send()) {
        $estatus = 200;
        $mensaje = 'Correo enviado';          
    } else {
      $estatus = 500;
      $mensaje = 'Correo no enviado';
    }
    
    $sqlBit = $v->dbh->prepare("INSERT INTO bitacora (id_fabrica_fk, id_usuario, usuario, fecha, accion, id_tracking, ip, puerto, proveedor) VALUES (?,?,?,?,?,?,?,?,?)");
		$sqlBit->execute(array(1, 0, 'Cron sistema', date('Y-m-d H:i:s'), 'Notificación pagos vencidos: '.$mensaje, 0, 0, 0, 0));
  }
  else {
    $sqlBit = $v->dbh->prepare("INSERT INTO bitacora (id_fabrica_fk, id_usuario, usuario, fecha, accion, id_tracking, ip, puerto, proveedor) VALUES (?,?,?,?,?,?,?,?,?)");
		$sqlBit->execute(array(1, 0, 'Cron sistema', date('Y-m-d H:i:s'), 'No hubo pagos vencidos que reportar', 0, 0, 0, 0));
  }

  echo $mensaje;
  exit;
?>