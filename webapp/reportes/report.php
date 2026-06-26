<?php
  ob_clean();
  require("../lib/fpdf186/fpdf.php");
  require("../config/class.pdo.php");

  $v = new Conexion();
  $v->conectar();
  $pdf = '';

  $sql = $v->dbh->prepare("SELECT cs.Nombre AS Sucursal, InfoGeneral, ApPaterno, ApMaterno, cp.Nombre, Edad, Genero, Telefono, TipoCliente, FolioClienteFK, FolioSolicitud, DATE_FORMAT(FechaHoraSol, '%d-%m-%Y %H:%i:%s') AS FechaHoraSol, DATE_FORMAT(FechaHoraEntrega,'%d-%m-%Y %H:%i:%s') AS FechaHoraEntrega, DATE(FechaHoraSol) AS FecSol, FactNota, us.Nombre AS NomRec,Apellidos, SubTotal, Iva, Total, Descuento, ROUND((Subtotal * Descuento)/100,2) AS Descuento2, CargoExtra, MotivoCargo, Abono, FolioPaciente, Correo, Estatus, FolioDoctorFK, DescEdad,MetPago, Remision, Cupon, ms.Sucursal AS IdSucu, Urgente, Descripcion, OrdenMedica, Promo_Aplicada, cs.Promocion, Ap_Promocion, No_Promociones, Promo, cs.Vig_Promocion AS VigPromoSuc, ms.Vig_Promocion, Res_Qr FROM mastersolicitud AS ms INNER JOIN catpacientes AS cp ON ms.FolioPacienteFK = cp.FolioPaciente INNER JOIN catsucursales AS cs ON ms.Sucursal = cs.Id INNER JOIN usuarios AS us ON ms.UserRec = us.IdUsuario WHERE FolioSolicitud LIKE ?");
  $sql->execute(array('%'.$_GET["f"]));
  $rowsql = $sql->fetch(PDO::FETCH_ASSOC);

  $GLOBALS["Sucursal"] = $rowsql["Sucursal"];
  $GLOBALS["IdSucu"]   = $rowsql["IdSucu"];
  $GLOBALS["InfoGral"] = $rowsql["InfoGeneral"];
  $GLOBALS["Estatus"]  = $rowsql["Estatus"];

  if($GLOBALS["Estatus"] == "COTIZACION") {
    $GLOBALS["Estatus"] = "COTIZACIÓN";
    $tipo               = 'Cotización de Análisis Clínicos';
  } else {
    $tipo               = '';
    $GLOBALS["Estatus"] = "SOLICITUD";
  }

  class PDF extends FPDF {
    //Cabecera de página
    function Header() {      
      $this->Image('../images/logo.png',7,7,70);
      if($GLOBALS["IdSucu"] == 15)//Sucursal Vidaimagen
        $this->Image('images/vidaimagen.jpeg',80,7,35);
      $this->SetFont('Arial','B',9);    
      $this->Cell(110,4,'',0,0,'C');
      $this->Cell(90,4,utf8_decode($GLOBALS["Sucursal"]),0,0,'C');
      $this->SetFont('Arial','B',8);
      $this->Ln();
      $this->Cell(110,4,'',0,0,'C');
      $this->MultiCell(90,3,$GLOBALS["InfoGral"],0,'C');
      $this->Ln();
    }

    function Footer() {
       $this->SetY(-10);
       $this->SetFont('Arial','I',8);
       $this->Cell(0,10,utf8_decode('Consulta tus resultados en www.lib-laboratorios.com'),0,0,'C');
    }
  }

  //Creación del objeto de la clase heredada
  $pdf = new PDF('P','mm','Letter');
  $pdf->SetMargins(7,5,7);
  $pdf->AddPage();
  $pdf->SetFont('Arial','B',9);
  $pdf->SetTextColor(253,254,254);
  $pdf->SetFillColor(192,57,43);

  function bitacora($accion, $num_afec) {
    require_once('../config/class.pdo.php');
    $v = new Conexion();
    $v->conectar();

    $ip  = $_SERVER["REMOTE_ADDR"];
    $port = $_SERVER['REMOTE_PORT'];  
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    $proveedor = strtolower ($userAgent);

    $bit = $v->dbh->prepare("INSERT INTO bitacora (IdUsuarioFK, Fecha ,Hora ,Accion ,NumAfec ,Ip ,Puerto, Proveedor) values (?,?,?,?,?,?,?,?)");
    $bit->execute(array($_SESSION["IdUsuario"],date('Y-m-d'),date('H:i:s'),utf8_decode($accion),$num_afec,$ip,$port,$proveedor));
  }

  // Validamos que ese folio tenga estudios agregados
  $sqlBus = $v->dbh->prepare("SELECT Id FROM detallesolicitud WHERE FolioSolicitudFK LIKE ? AND Estatus = ?");
  $sqlBus->execute(array('%'.$_GET["f"],1));
  if($sqlBus->rowCount() >= 1)  {
    $sumtot  = 0;
    $sumdesc = 0;
    if($rowsql["TipoCliente"] == "PACIENTE" or $rowsql["TipoCliente"] == "DOCTOR")
      $remision = "A-".$rowsql["Remision"];  
    elseif($rowsql["TipoCliente"] == "LABORATORIO")
      $remision = "B-FACTURACIÓN";   
    else
      $remision = "C-FACTURACIÓN";

    $ver_precios = 1;

    if($rowsql["TipoCliente"] == "PACIENTE" and $rowsql["FolioClienteFK"] == 0) {
      $rowtip["Nombre"] = "A QUIEN CORRESPONDA";
      $correo   = $rowsql["Correo"];
      $telefono = $rowsql["Telefono"];
      $rowtip["Contrato"] = "";
    } else {
      $sqltip = $v->dbh->prepare("select Nombre,Correo,Telefono,LPAD(Contrato,3,'0') as Contrato FROM catdoctores where Folio = ?");
      $sqltip->execute(array($rowsql["FolioClienteFK"]));
      $rowtip   = $sqltip->fetch(PDO::FETCH_ASSOC);
      $correo   = $rowsql["Correo"]; 
      $telefono = $rowsql["Telefono"]; 
    } if($rowsql["TipoCliente"] == "DOCTOR") {
      $sqltip = $v->dbh->prepare("select Nombre,Correo,Telefono,LPAD(Contrato,3,'0') as Contrato, VerPrecios FROM catdoctores where Folio = ?");
      $sqltip->execute(array($rowsql["FolioClienteFK"]));
      $rowtip      = $sqltip->fetch(PDO::FETCH_ASSOC);
      $correo      = $rowtip["Correo"]; 
      $telefono    = $rowtip["Telefono"];
      $ver_precios = $rowtip["VerPrecios"];
    } if($rowsql["TipoCliente"] == "LABORATORIO") {
      $sqltip = $v->dbh->prepare("select Nombre,Correo,Telefono,LPAD(Contrato,3,'0') as Contrato,VerPrecios FROM catlaboratorios where Folio = ?");
      $sqltip->execute(array($rowsql["FolioClienteFK"]));
      $rowtip      = $sqltip->fetch(PDO::FETCH_ASSOC);
      $correo      = $rowtip["Correo"]; 
      $telefono    = $rowtip["Telefono"];
      $ver_precios = $rowtip["VerPrecios"];
    } if($rowsql["TipoCliente"] == "EMPRESA") {
      $sqltip = $v->dbh->prepare("select Nombre,Correo,Telefono,LPAD(Contrato,3,'0') as Contrato, VerPrecios FROM catempresas where Folio = ?");
      $sqltip->execute(array($rowsql["FolioClienteFK"]));
      $rowtip      = $sqltip->fetch(PDO::FETCH_ASSOC);
      $correo      = $rowtip["Correo"]; 
      $telefono    = $rowtip["Telefono"];
      $nomempresa  = $rowtip["Nombre"];
      $ver_precios = $rowtip["VerPrecios"];

      if($rowsql["FolioDoctorFK"] == 0) //No eligió a un doctor
        $rowtip["Nombre"] = "A QUIEN CORRESPONDA";
      else {
        $sqltip = $v->dbh->prepare("select Nombre,Correo,Telefono,LPAD(Contrato,3,'0') as Contrato FROM catdoctores where Folio = ?");
        $sqltip->execute(array($rowsql["FolioDoctorFK"]));
        $rowtip = $sqltip->fetch(PDO::FETCH_ASSOC);
        $rowtip["Contrato"] = "";
      }
    }

    //Suma de abonos
    $sqlAbono = $v->dbh->prepare("SELECT SUM(Abono) AS Abono FROM abonos WHERE FolioSolicitudFK = ?");
    $sqlAbono->execute(array($rowsql["FolioSolicitud"]));
    $rowAbono = $sqlAbono->fetch(PDO::FETCH_ASSOC);
          
    //Formateando el nombre de quien atendió
    $n  = explode(" ", $rowsql["NomRec"]);
    if(isset($n[0]))
      $n1 = substr($n[0], 0,1);
    else
      $n1 = "";
    if(isset($n[1]))
      $n2 = substr($n[1], 0,1);
    else
      $n2="";

    $a  = explode(" ", $rowsql["Apellidos"]);

    if(isset($a[0]))
      $a1 = substr($a[0], 0,1);
    else
      $a1="";

    if(isset($a[1]))
      $a2 = substr($a[1], 0,1);
    else
      $a2="";

    $nombre = $n1.$n2.$a1.$a2;

    if($rowsql["Urgente"] == 1)
      $pdf->MultiCell(200,5,utf8_decode('URGENTE  '.$rowsql["Descripcion"]),'T','C','1');

    $pdf->SetFont('Arial','B',9);
    $pdf->SetTextColor(255,255,255); //Blanco
    $pdf->SetFillColor(21,92,157); //Azul
    $pdf->SetDrawColor(21,92,157);
    $pdf->Cell(140,5,'Datos Generales de la Solicitud','T','','L',1);
    $pdf->Cell(60,5,utf8_decode($tipo),'T','','R',1);
    $pdf->Ln();

    $pdf->SetTextColor(000,000,000); //Negro
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(17,5,'Edad:','T','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(23,5,$rowsql["Edad"]." ".utf8_decode($rowsql["DescEdad"]),'T','','L');    
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(18,5,'Paciente:','T','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(82,5,utf8_decode($rowsql["ApPaterno"]." ".$rowsql["ApMaterno"]." ".$rowsql["Nombre"]),'T','','L');
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(60,5,utf8_decode('Escanea y consulta tus resultados'),'T','','C');
        
    $pdf->Ln();
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(17,5,utf8_decode('Género:'),'','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(23,5,$rowsql["Genero"],'','','L');
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(17,5,'Solicitante: ','','','L');
    $pdf->SetFont('Arial','',8);
    if($rowsql["TipoCliente"] == "EMPRESA") {
      $pdf->SetFont('Arial','',6);
      $pdf->cell(113,5,utf8_decode("EMPRESA: ".$rowtip["Nombre"]." ".$rowtip["Contrato"]).' - '.$nomempresa,'','','','');
    } else    
      $pdf->cell(113,5,utf8_decode($rowtip["Nombre"]." ".$rowtip["Contrato"]),'','','L');

    if(file_exists('codigos_qr/'.$rowsql["FolioSolicitud"].'.png')) {  
      $pdf->Cell(10,5,$pdf->Image('codigos_qr/'.$rowsql["FolioSolicitud"].'.png', $pdf->GetX(), $pdf->GetY(),15),'','');
      $pdf->Ln();
    }
      
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(17,5,utf8_decode('Teléfono:'),'','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(23,5,$telefono,'','','L');
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(17,5,'Correo:','','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(133,5,$correo,'','','L');

    $pdf->Ln();
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(17,5,'# Solicitud:','','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(23,5,$rowsql["FolioSolicitud"],'','','L');
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(17,5,'Fecha/Hora:','','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(38,5,$rowsql["FechaHoraSol"],'','','L');
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(12,5,utf8_decode('Atendió:'),'','','R');    
    $pdf->SetFont('Arial','',8);
    $pdf->MultiCell(11,5,utf8_decode($nombre),'','R','');      


    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(20,5,utf8_decode('No. Remisión:'),'','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(25,5,utf8_decode($remision),'','L','');
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(25,5,utf8_decode('Método de Pago:'),'','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(23,5,$rowsql["MetPago"],'','L','');
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(24,5,'Fecha Entrega:','','','L');
    $pdf->SetFont('Arial','',8);
    $pdf->Cell(35,5,$rowsql["FechaHoraEntrega"],'','','L');
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(42,5,'ID Paciente:'.utf8_decode($rowsql["FolioPaciente"]),'','','C');        
    $pdf->Ln();

    $pdf->SetFont('Arial','B',8);
    $pdf->SetTextColor(169,50,38); //Rojo
    if($rowsql["OrdenMedica"] == 1)//Si presentó orden medica
      $pdf->Cell(100,5,utf8_decode('*¡El solicitante presentó orden médica al momento del servicio!'),0,'C',1);    
    elseif($rowsql["OrdenMedica"] == 2)
      $pdf->Cell(100,5,utf8_decode('* El solicitante NO presentó orden médica al momento del servicio.'),0,'C',1);

    if($rowsql["FactNota"] == 1)//Si pidió factura
      $pdf->Cell(100,5,utf8_decode('* ¡El solicitante requiere factura. Favor de corroborar datos de facturación!'),0,'C',1);    
    else
      $pdf->Cell(100,5,utf8_decode('* El solicitante NO requirió factura al momento del servicio.'),0,'C',1);

    $pdf->SetFont('Arial','B',9);
    $pdf->SetTextColor(255,255,255); //Blanco
    $pdf->SetFillColor(21,92,157); //Azul

    $pdf->Ln();
    $pdf->Cell(200,5,'Estudios Solicitados','T','','C',1);
    $pdf->Ln();

    $pdf->SetFont('Arial','B',8);
    $pdf->SetTextColor(000,000,000); //Negro
    $pdf->SetFillColor(221,221,221); // Gris

    if($ver_precios == 1) {
      $pdf->Cell(10,5,'#','T','','C',1);
      $pdf->Cell(140,5,'Estudio','T','','C',1);
      $pdf->Cell(20,5,'Costo','T','','C',1);
      $pdf->Cell(15,5,'Desc Ind.','T','','C',1);
      $pdf->Cell(15,5,'Total','T','','C',1);
      $pdf->Ln();
    } else {
      $pdf->Cell(10,5,'#','T','','C',1);
      $pdf->Cell(190,5,'Estudio','T','','C',1);  
      $pdf->Ln(); 
    }

    $pdf->SetFont('Arial','',8);
    $pdf->SetTextColor(000,000,000); //Negro

    $cdes=0;
    $sqlEst = $v->dbh->prepare("SELECT ce.Id, ce.Estudio, Costo,ds.Descuento, Total, ce.Descuento AS Des, DescuentoVer, Detalles, HoraEntrega FROM detallesolicitud AS ds INNER JOIN catestudios AS ce ON ds.Estudio = ce.Id WHERE FolioSolicitudFK = ? AND ds.Estatus = ? ORDER BY ds.Id");
    $sqlEst->execute(array($rowsql["FolioSolicitud"],1));
    if($sqlEst->rowCount() >= 1) {
      while($rowest = $sqlEst->fetch(PDO::FETCH_ASSOC)) {  
        //validamos si ese estudio el subestudio de biometría
        $sqlBiome = $v->dbh->prepare("SELECT Id FROM rel_est_sub WHERE IdEstudioFK = ? AND IdSubEstudioFK = ?");
        $sqlBiome->execute(array($rowest["Id"],943));

        //Por cada estudio deberemos buscar las pruebas que están seleccionadas como visibles
        $sqlPrub = $v->dbh->prepare("SELECT re.Id,SubEstudio, re.IdSubEstudioFK, IdPruebaFK, cp.Nombre, GROUP_CONCAT(cp.Nombre SEPARATOR ',') AS detalle FROM rel_est_sub AS re INNER JOIN catsubestudios AS cs ON re.IdSubEstudioFK = cs.Id INNER JOIN rel_sub_pru AS rsp ON cs.Id = rsp.IdSubEstudioFK INNER JOIN catpruebas AS cp ON rsp.IdPruebaFK = cp.Id WHERE re.IdEstudioFK = ? AND rsp.Visible = ? GROUP BY re.IdEstudioFK");
        $sqlPrub->execute(array($rowest["Id"],1));
        $row_prub_vis = $sqlPrub->fetch(PDO::FETCH_ASSOC);

        //Sucursal vigaimagen o boca del río
        if($rowsql["IdSucu"] == 15 || $rowsql["IdSucu"] == 4)
          $sin_descuento = $rowest["DescuentoVer"];
        else
          $sin_descuento = $rowest["Des"];

        if($sin_descuento == 1) { //Sin descuento
          $cdes = 1;
          $ast  = "**"; 
        } else {
          $ast = "";
          $sumdesc = $sumdesc + $rowest["Total"];
        }

        if($sqlBiome->rowCount() >= 1)//Tiene una biome
          $complemento_biome = 'SERIE ROJA, SERIE BLANCA, DIFERENCIAL, SERIE PLAQUETARIA';
        else
          $complemento_biome = '';

        $pdf->SetFont('Arial','',7);
        if($ver_precios == 1) {
          $pdf->Cell(10,4,$rowest["Id"],'T','','L');
          $pdf->Cell(140,4,$ast.$rowest["Estudio"],'T','','L');  
          $pdf->Cell(20,4,'$'.number_format($rowest["Costo"],2),'T','','R');
          $pdf->Cell(15,4,$rowest["Descuento"],'T','','C');
          $pdf->Cell(15,4,'$'.number_format($rowest["Total"],2),'T','','R');
          $pdf->Ln();

          if($sqlPrub->rowCount() >= 1) {
            $detallePrueba = $row_prub_vis["detalle"];
          } else {
            $detallePrueba = '';
          }

          if($detallePrueba  != '' or $rowest["Detalles"] != '') {
            $pdf->SetFont('Arial','',4);
            $pdf->Cell(10,2,'','','L');
            $pdf->MultiCell(130,2,utf8_decode($detallePrueba.' '.$complemento_biome.$rowest["Detalles"]),0,'L','');
            $pdf->SetFont('Arial','',7);
            $pdf->Ln();
          }
          $sumtot = $sumtot+$rowest["Total"];
        } else {
          $pdf->Cell(10,4,$rowest["Id"],'T','','L');
          $pdf->Cell(190,4,$ast.$rowest["Estudio"],'T','','L'); 
          $pdf->Ln();
          if($row_prub_vis["detalle"] != '' or $rowest["Detalles"] != '')
          {
            $pdf->SetFont('Arial','',4);
            $pdf->Cell(10,2,'','','L');
            $pdf->MultiCell(130,2,utf8_decode($row_prub_vis["detalle"].$rowest["Detalles"]),0,'L','');
            $pdf->SetFont('Arial','',7);
            $pdf->Ln();
          }
        }
      }
    } else {
      $pdf->SetFont('Arial','',12);
      $pdf->Cell(200,5,utf8_decode('No se encontraron estudios relacionados a este Folio, Comunícate con el administrador'),'1','','L',0);
      $pdf->Ln();
    }
    $pdf->SetFillColor(221,221,221); // Gris
    if($cdes == 1)
      $pdf->Cell(160,5,'**Estos estudios no aplican para descuento por ser de alta especialidad y/o ya tener un descuento aplicado.','','','L');
    else
      $pdf->Cell(160,5,'','','','L');

    if($ver_precios == 1) {
      $pdf->SetFont('Arial','B',8);
      $pdf->Cell(20,5,'SubTotal','T','','L',1);
      $pdf->SetFont('Arial','',8);
      $pdf->Cell(20,5,'$'.number_format($sumtot,2),'T','','R',1);
      $pdf->Ln();
      if($rowsql["Descuento"] != 0) {
        $desc = ($sumdesc * $rowsql["Descuento"]) / 100;
        $pdf->Cell(160,5,'','','','R');
        $pdf->SetFont('Arial','B',8);
        $pdf->Cell(15,5,'Desc Tot.','T','','L',1);
        $pdf->SetFont('Arial','',8);
        $pdf->Cell(5,5,$rowsql["Descuento"]."%",'T','','C',1);
        $pdf->Cell(20,5,'$'.number_format($desc,2),'T','','R',1);
        $pdf->Ln();
      }

      if($rowsql["CargoExtra"] != 0) {
        $pdf->Cell(160,5,utf8_decode($rowsql["MotivoCargo"]),'','','R');
        $pdf->SetFont('Arial','B',8);
        $pdf->Cell(20,5,'Cargo Extra','T','','L',1);
        $pdf->SetFont('Arial','',8);
        $pdf->Cell(20,5,'$'.number_format($rowsql["CargoExtra"],2),'T','','R',1);
        $pdf->Ln();
      }

      if($rowAbono["Abono"] != 0) {
        $pdf->SetFont('Arial','B',8);
        $pdf->Cell(160,5,'','','','R');
        $pdf->Cell(20,5,'Abono','T','','L',1);
        $pdf->SetFont('Arial','',8);
        $pdf->Cell(20,5,'$'.number_format($rowAbono["Abono"],2),'T','','R',1);
        $pdf->Ln();
      }

      if($rowsql["Cupon"] != 0) {
        $cupon = $sumtot * 0.10;
        $pdf->Cell(160,5,'','','','R');
        $pdf->SetFont('Arial','B',8);
        $pdf->Cell(20,5,utf8_decode('Cupón Prom.'),'T','','L',1);
        $pdf->SetFont('Arial','',8);
        $pdf->Cell(20,5,'-'.$cupon,'T','','L',1);
        $pdf->Ln(); 
      }
      $pdf->SetFont('Arial','B',8);
      $pdf->Cell(160,5,'','','','R');
      $pdf->Cell(20,5,'Debe','T','','L',1);
      $pdf->SetFont('Arial','',8);
      $pdf->Cell(20,5,'$'.number_format($rowsql["Total"],2),'T','','R',1);
    }
    $pdf->Ln();$pdf->Ln();

    if($rowsql["Estatus"] == "COTIZACION") {
      $pdf->Cell(200,5,utf8_decode('* Cotización vigente durante 33 días hábiles del año en curso de la cotización. Los precios pueden cambiar sin previo aviso.'),'','','C','');
      $pdf->Ln();
    }
    
    $pdf->SetFont('Arial','B',10);
    $pdf->SetFillColor(221,221,221);//Gris

    //Mostrando promo
    $mostrar_promo = 0;
    $num_ale       = 0;
          
    if($rowsql["TipoCliente"] == "EMPRESA") {
      $pdf->SetFont('Arial','B',9);
      $pdf->Ln();
      $pdf->MultiCell(200,4,utf8_decode('*LIB Laboratorios comprende al cliente, la empresa, como cliente directo y final. Por lo cual el(los) resultado(s) de está solicitud de trabajo será(n) entregados directamente al coordinador del área la empresa en cuestión. En caso de que la empresa requiera que el(los) resultado(s) sea(n) entregados al paciente(colaborador) se deberá realizar previo aviso a LIB Laboratorios por el coordinador para autorización del hecho. '),0,'J',1);  
    }

    $pdf->SetFont('Arial','',6);
    $pdf->Ln();

    $pdf->MultiCell(200,2,utf8_decode('**Al firmar de autorización, el usuario acepta lo siguiente:
    He revisado que mis datos personales estén correctos y que los estudios aquí mencionados son los únicos que solicité al momento del servicio para que sean realizados por LIB Laboratorios, liberando a la empresa de cualquier responsabilidad sobre un estudio no solicitado dentro de la presente orden de trabajo. Que soy responsable de la consulta y entrega de mis resultados, y que al firmar de recibido libero de responsabilidad a LIB Laboratorios de cualquier evento de pérdida del resultado entregado. En caso de solicitar entregar el resultado a terceros y/o sin orden de trabajo, LIB Laboratorios podrá solicitar autorización del paciente en cuestión para efectuar la entrega. Reconozco que estoy informado(a) y de acuerdo con los riesgos que el procedimiento conlleve y que soy responsable de informar al laboratorio de complicaciones personales para consideraciones especiales durante el proceso. Reconozco que estoy de acuerdo con las condiciones de uso de LIB Laboratorios y el aviso de privacidad el cual puedo solicitar en mi sucursal de atención y/o consultar en www.lib-laboratorios.com SERVICIOS LIBDUSA S.C., otorga un plazo de 24 horas de la solicitud/entrega de los resultados para que el paciente o cliente pueda manifestar desacuerdos, reclamaciones o quejas al servicio otorgado a los teléfonos de la empresa. SERVICIOS LIBDUSA. De ser requerido, el servicio de asesoría biomédica o servicio de quejas/aclaraciones es y será exclusivamente vía telefónica. Dicho departamento puede y redirigirá en caso de ser necesario a otros departamentos de la empresa para la solución de la petición. Por disposición oficial del SAT la FACTURACIÓN DEBERÁ SER SOLICITADA AL MOMENTO DEL SERVICIO. Para modificaciones o cancelación de facturación deberá realizarse dentro del MISMO DÍA en el que se realiza la solicitud y pago, de lo contrario su modificación o cancelación no procederá. LIB Laboratorios agradece su comprensión y lamenta los inconvenientes que esto pueda ocasionar. Para muestras con estatus de "pendiente" el paciente tendrá 10 días a partir de la fecha de solicitud para la entrega de la muestra pendiente para su proceso. De lo contrario la muestra será cancelada sin posibilidad de reembolso. Se sugiere otorgar entre los datos personales el correo electrónico, y de ser requerido por esta vía el resultado deberá solicitarse en ventanilla o vía telefónica a la sucursal de atención. Le sugerimos revisar la bandeja de spam/no deseados. El paciente podrá consultar sus resultados en cualquier momento en la página de internet www.lib-laboratorios.com con su ID de paciente o consultándolo haciendo uso del código QR impreso en la solicitud el cual lo redirigirá inmediatamente a su resultado. El uso y resguardo de la información contenida en este comprobante y su código QR es responsabilidad del paciente o el responsable solidario del mismo. Al dirigir expresamente los estudios a un médico en particular, se autoriza la posibilidad de que el médico pueda ver los resultados mediante código QR. El anexo, modificación o cancelación de estudios de la presente orden está sujeta a disponibilidad de la muestra y etapa del proceso. Una vez comenzado el proceso analítico de la orden no podrá ser modificada o cancelada. (0) Por políticas de LIB Laboratorios, el almacenamiento de la documentación proporcionada por y para el paciente sólo será conservada durante 3 meses. Por lo cual, en caso de requerir documentación como órdenes médicas, registros de archivo interno, registros de orden de trabajo, etc., solo podrán ser recuperados si el folio y fecha de asistencia a las instalaciones se encuentra dentro del periodo establecido. LIB Laboratorios sugiere la descarga de sus resultados y/o conservación del resultado en físico debido a la constante depuración de la base de datos, por lo cual las solicitudes de reimpresión de históricos de estudios lejanos a la fecha del día de hoy, están sujetos a disponibilidad del mismo y del periodo establecido de archivo interno.'),0,'J','');

    if($rowsql["Promo_Aplicada"] == 0 and date('H') <= 14 and $rowsql["Ap_Promocion"] == 1 and $rowsql["TipoCliente"] == 'PACIENTE' and $_GET["k"] == '1sg' and $_GET['o'] == 1) {  
      $num_ale = rand(1,5);
      if(5 == $num_ale) //ganador aleatorio
        $ganador = 1;
      else
        $ganador = 0;
      
      if($ganador == 1 and ($rowsql["Promocion"] != '' or $rowsql["Promocion"] != '0')) {    
        //Buscamos que en el día de hoy en esa sucursal no haya más ganadores
        $sql_gan = $v->dbh->prepare("select Id from mastersolicitud where Promo_Aplicada = ? and date(FechaHoraSol) = ? and Sucursal = ?");
        $sql_gan->execute(array(1,date('Y-m-d'),$rowsql["IdSucu"]));
        if($sql_gan->rowCount() < $rowsql["No_Promociones"])
        {
          //Actualizamos para que esta orden se ponga como promo aplicada
          $sql_apl = $v->dbh->prepare("update mastersolicitud set Promo_Aplicada = ?, Promo = ?, Vig_Promocion = ? where FolioSolicitud = ?");
          if($sql_apl->execute(array(1,$rowsql["Promocion"],$rowsql["Vig_Promocion"],$rowsql["FolioSolicitud"])))
            $mostrar_promo = 1;
          else
            $mostrar_promo = 0;
        }
      }
    }
    
    if($rowsql["Promo_Aplicada"] == 1 or $mostrar_promo == 1) {
      if($_GET["o"] == 1) { //Viene desde el guardado inicial de la orden
        $promo_aplicada = $rowsql["Promocion"];
        $vig_promocion  = $rowsql["VigPromoSuc"];
      } else {
        $promo_aplicada = $rowsql["Promo"];
        $vig_promocion  = $rowsql["Vig_Promocion"];
      }

      $fecha       = $rowsql["FecSol"];
      $nuevafecha1 = strtotime ('+3 day',strtotime($fecha));
      $nuevafecha  = date('d-m-Y', $nuevafecha1);

      $pdf->Ln();$pdf->Ln();
      $pdf->SetFont('Arial','B',9);
      $pdf->SetFillColor(221,221,221);//Gris
      $pdf->Cell(25,20,$pdf->Image('images/ganaste_promo.png', $pdf->GetX(), $pdf->GetY(),26),'','');
      $pdf->MultiCell(165,5,$promo_aplicada,0,'L');
      $pdf->SetFont('Arial','',7);
      $pdf->Cell(25,5,'','','');
      $pdf->MultiCell(120,3,utf8_decode('El presente cupón no es acumulable. Se deberá presentar este comprobante para la entrega de su producto.'. $vig_promocion),0,'L');
      $pdf->Ln();$pdf->Ln();
    }
    else {
      $pdf->Ln();$pdf->Ln();$pdf->Ln();
    }

    $pdf->Ln(); $pdf->Ln();$pdf->Ln();

    $pdf->Cell(40,3,'','','','L','');
    $pdf->Cell(50,3,'','T','','L','');
    $pdf->Cell(20,3,'','','','L','');
    $pdf->Cell(50,3,'','T','','L','');
    $pdf->Cell(40,3,'','','','L','');
    $pdf->Ln();
    $pdf->SetFont('Arial','B',8);
    $pdf->Cell(40,3,'','','','L','');
    $pdf->Cell(50,3,utf8_decode('Nombre y firma de autorización *'),'','','C','');
    $pdf->Cell(20,3,'','','','L','');
    $pdf->Cell(50,3,'Nombre y firma de recibido *','','','C','');
    $pdf->Cell(40,3,'','','','L','');
    $pdf->Ln();

  } else {  
    $pdf->SetTextColor(169,50,38); //rojo
    bitacora('No se enontraron estudios activos en la impresión de orden del folio:',$_GET["f"]);
    $pdf->SetFont('Arial','B',12);
    $pdf->Ln();$pdf->Ln(); $pdf->Ln();
    $pdf->Cell(190,3,utf8_decode('No se encontraron estudios relacionados a este folio, Comunícate con el Administrador'),'','','C','');
  }

  $pdf->Output();
?>








