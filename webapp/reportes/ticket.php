<?php
  header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
  header( "Last-Modified: ". gmdate("D,dMYH:i:s"). " GMT" );
  header( "Cache-Control: no-cache, must-revalidate" );
  header( "Pragma: no-cache" );
  ob_clean();  
  date_default_timezone_set("America/Mexico_City");
  require_once('../../api/config/class.pdo.php');
  require_once("../../api/config/seguridad.php");
  $v = new Conexion();
  $v->conectar();

  $sql = $v->dbh->prepare("SELECT id_pedido, folio, tipo_pedido, nom_cliente_hist, nom_categoria_cliente_hist, nom_lista_precios_fk, subtotal, descuento, total, cargo_extra, motivo_cargo_extra, abonos, debiente, monto_devoluciones, DATE_FORMAT(fecha_entrega,'%d-%m-%Y') AS fecha_entrega, DATE_FORMAT(fecha_cap,'%d-%m-%Y') AS fecha_cap, user_cap, estatus FROM pedido WHERE key_query = ?");
  $sql->execute(array($_GET["k"]));
  $row = $sql->fetch(PDO::FETCH_ASSOC);

  $row["tipo_pedido"] == 1 ? $tipo_pedido = 'Punto de venta' : ($row["tipo_pedido"] == 2 ?$tipo_pedido = 'Evento' : $tipo_pedido = 'No identificado');

  $html = 
  '<html>
    <head>
      <style>
        body {
          font-family: "Helvetica";
          font-size:12px;
          text-decoration:none;
        }

        table {
          width:6cm;
          z-index:100;
          font-family: "Helvetica" !important;
          font-size:12px;
          text-decoration:none;
          border-collapse: collapse;    
        }

        .justificado {
          text-align: justify;
        }

        .text-xs {
          font-size: 0.6em;
        }

        .watermark {
          top: 15%;
          position: fixed;              
          left:     0cm;
          text-align:center;

          width:    40%;
          height:   auto;
          overflow: hidden;

          z-index:  -1000;
          rotate: -160 !important;
          font-size: 30;
          opacity: 0.4;
          color: #DE9383;
        }

        .watermark2 {
          top: 25%;
          position: fixed;              
          left:     0cm;
          text-align:center;

          width:    40%;
          height:   auto;
          overflow: hidden;

          z-index:  -1000;
          rotate: -160 !important;
          font-size: 30;
          opacity: 0.4;
          color: #DE9383;
        }

        .watermark3 {
          top: 35%;
          position: fixed;              
          left:     0cm;
          text-align:center;

          width:    40%;
          height:   auto;
          overflow: hidden;

          z-index:  -1000;
          rotate: -160 !important;
          font-size: 30;
          opacity: 0.4;
          color: #DE9383;
        }
        
        .text10 {
          font-size: 10px;
        }

        .text9 {
          font-size: 9px;
        }

        .text8 {
          font-size: 8px;
        }

        .text11 {
          font-size:11px;
        }
      
        
        .text13 {
          font-size:13px;
        }

        .text14 {
          font-size:14px;
        }

        .tachado {
          text-decoration: line-through;
        }
      
        .borde_top {
          border-top: #F0F3F5 1px solid;
        }

        .borde {
          border-top: #D5DBDB 2px solid;
          border-bottom: #D5DBDB 2px solid;
        }

        .borde2 {
          border-bottom: #0c0c0c 1px dashed;
        }

        .bordetotal {
          border: #0c0c0c 1px solid;
        }


        .mt-1 {
          margin-top: 5px;
        }

        #contenido {
          z-index:100;
          font-family: "Helvetica" !important;      
        }
                
        @media print {
          @page {
            size: auto;         
            margin: 0.5cm;
          }
        }
      </style>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
      <script>
        function imprimir() {
          var printContents = document.getElementById("contenido").innerHTML;
          var originalContents = document.body.innerHTML;
          document.body.innerHTML = printContents;
          window.print();
          document.body.innerHTML = originalContents;
        }
      </script>
    </head>
    <body onload="imprimir();">';
    
      if($row["estatus"] == 'Cancelado') {
        $html.='
        <div class="watermark"> CANCELADO </div>
        <div class="watermark2"> CANCELADO </div>
        <div class="watermark3"> CANCELADO </div>';
      }
      $html.='
      <div id="contenido">      
        
        <table>
          <tr align="center">
            <td>
              <img src="../../webapp/assets/images/logo_text.png" width="150">
            </td>
          </tr>
          <tr align="center">
            <td>
              <span class="text13">Xalapa Veracruz</span><br>
              <span class="text11">Teléfono: 2281781918</span>
            </td>
          </tr>
          <tr>
            <td align="center">
              <br>
              <b>'.$row["nom_cliente_hist"].'</b>
            </td>
          </tr>
        </table>
        <table class="text11" border="0" width="100%" cellpadding="3">
          <tr>
            <td class="borde2">'.$row["fecha_cap"].'</td>
            <td align="right" class="borde2">'.$tipo_pedido.'</td>
          </tr>
        </table>

        <table class="mt-1" border="0" width="100%" cellpadding="2">
          <tr align="center" class="borde2 text10">
            <td width="15% align="center"">CANT.</td>
            <td width="45% align="center"">PRODUCTO</td>
            <td width="20% align="center"">PRECIO</td>
            <td width="20% align="center"">TOTAL</td>
          </tr>
        </table>

        <table class="mt-1 borde2 text11" border="0" width="100%" cellpadding="2">';
          $det = $v->dbh->prepare("SELECT nom_producto_hist, cantidad, precio_unitario_hist, por_descuento, monto_descuento, subtotal_linea, total_linea FROM pedido_detalle WHERE id_pedido_fk = ?");
          $det->execute(array($row["id_pedido"]));
          $alto = 280;
          $c    = 0;
          while($row_det = $det->fetch(PDO::FETCH_ASSOC)) {
            if($row_det["monto_descuento"] > 0) {
              $html.=
              '<tr>
                <td width="15%" align="center">'.$row_det["cantidad"].'</td>
                <td width="45%">'.$row_det["nom_producto_hist"].'</td>
                <td width="20%" align="right">'.$row_det["precio_unitario_hist"].'</td>
                <td width="20%" align="right" class="tachado">'.$row_det["subtotal_linea"].'</td>
              </tr>
              <tr>
                <td></td>
                <td colspan="2" class="text10">Descuento - $'.$row_det["monto_descuento"].' <span class="text8">('.$row_det["por_descuento"].' %)</span></td>
                <td align="right">'.$row_det["total_linea"].'</td>
              </tr>';
            }
            else {
              $html.=
              '<tr>
                <td width="15%" align="center">'.$row_det["cantidad"].'</td>
                <td width="45%">'.$row_det["nom_producto_hist"].'</td>
                <td width="20%" align="right">'.$row_det["precio_unitario_hist"].'</td>
                <td width="20%" align="right">'.$row_det["total_linea"].'</td>
              </tr>';
            }
            $c++;
          }

          $html.='
        </table>

        <table class="text11 mt-1 borde2" border="0" width="100%" cellpadding="2">
          <tr>    
            <td width="70%">Productos: '.$c.'</td>
            <td width="30%"></td>
          </tr>
          <tr>
            <td align="right"><b>Subtotal: $ </b></td>
            <td align="right">&nbsp; <b>'.$row["subtotal"].'</b></td>
          </tr>';

          if($row["cargo_extra"] > 0) {
            $html.=
            '<tr>
              <td align="right"><b>Cargo extra: + $</b></td>
              <td align="right"><b>'.$row["cargo_extra"].'</b></td>
            </tr>
            <tr>
              <td colspan="2" align="right" class="text9">
                '.$row["motivo_cargo_extra"].'
              </td>
            </tr>';
          }

          if($row["descuento"] > 0) {
            $html.=
            '<tr>
              <td align="right"><b>Descuento: - $</b></td>
              <td align="right"><b>'.$row["descuento"].'</b></td>
            </tr>';
          }

          if($row["monto_devoluciones"] > 0) {
            $html.=
            '<tr>
              <td align="right"><b>Devoluciones:</b></td>
              <td align="right"><b>- $ '.$row["monto_devoluciones"].'</b></td>
            </tr>';
          }

          $html.='
          <tr align="center">
            <td colspan="2" class="text13">
              <br><b>TOTAL A PAGAR: $'.number_format($row["total"] + $row["cargo_extra"],2).'</b><br><br>
            </td>
          </tr>';
          $html.='
        </table>

        <!--
        <table class="text8 mt-1" border="0" width="100%" cellpadding="2">
          <tr>
            <td class="bordetotal" align="center">
              <b>RECEPCIÓN DE MERCANCÍA</b><br><br><br><br><br><br>
                _______________________________<br>
                NOMBRE Y APELLIDO <br>
                FIRMA
              </div>
              <br><br>
            </td>
          </tr>
        </table>
        -->

        <table class="text11 mt-1">
          <tr>
            <td align="center" class="text11">
              Le atendió: '.$row["user_cap"].'<br><br>
              ¡Gracias por su compra!
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>';

  echo $html;
?>