<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 20:09:30 
 * Descripcion : VentaController.php
 * ---------------------------------------
 */

namespace Facturacion\Venta\Controllers;

use \Vendor\Controller;
use \Facturacion\Venta\Filters\VentaFilter;
use \Dompdf\Dompdf;

class VentaController extends \Facturacion\Venta\Models\VentaModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use VentaFilter {
        VentaFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del VentaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del VentaFilter */
    }

    public function index() {
        
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }

    public function getProducto() {
        echo json_encode($this->qGetProducto());
    }

    public function getNumeroDocActual() {
        echo json_encode($this->qGetNumeroDocActual());
    }

    public function postVenta() {
        $rs = $this->spMantenimientoVenta();
        $pdf = [];

        //verificar si es pdf o ticketera
        switch ($rs['tipo_formato']) {
            case 'PDF':
                //generar documento para su impresion
                $pdf = $this->_pdfDocumento($rs['id_venta'], true);
                break;

            case 'TIK':
                $company = $this->qCompany();
                $head = $this->qHeadDocumento($rs['id_venta']);
                $detail = $this->qDetailDocumento($rs['id_venta']);

                /* RUC | TIPO DE DOCUMENTO | SERIE | NUMERO | MTO TOTAL IGV | MTO TOTAL DEL COMPROBANTE | FECHA DE EMISION |TIPO DE DOCUMENTO ADQUIRENTE | NUMERO DE DOCUMENTO ADQUIRENTE | */
                $text_qr = $company['ruc'] . '|' . $head['tipo_comprobante'] . '|' . $head['serie'] . '|' . $head['numero_documento'] . '|' . $head['total_igv'] . '|' . $head['total_venta'] . '|' . $head['fecha_emision'] . '|' . $head['id_tipo_documento_identidad'] . '|' . $head['documento_identidad'] . '|';
                $qr = ROOT . 'files' . DS . 'temp' . DS . 'QR_' . $rs['id_venta'] . '.png';
                require_once ROOT . 'libs' . DS . 'phpqrcode' . DS . 'qrlib.php';

                \QR\QRcode::png($text_qr, $qr, 'Q', 15, 0);

                $ruta_qr = BASE_URL . 'files/temp/QR_' . $rs['id_venta'] . '.png';

                $head['total_letra'] = Obj()->Libs->NumberToString->convert($head['total_venta']);

                $pdf = ['file' => [
                        'company' => $company,
                        'head' => $head,
                        'detail' => $detail,
                        'qr' => $ruta_qr
                    ]
                ];

                break;
        }

        $data = [
            'rs' => $rs,
            'file' => $pdf['file']
        ];

        echo json_encode($data);
    }

    public function postEditVenta() {
        echo json_encode($this->spMantenimientoVenta());
    }

    public function postDeleteVenta() {
        echo json_encode($this->spMantenimientoVenta());
    }

    public function postGuia() {
        echo json_encode($this->spMantenimientoGuia());
    }

    public function postEditGuia() {
        echo json_encode($this->spMantenimientoGuia());
    }

    public function getPDF() {
        echo json_encode($this->_pdfDocumento($this->_form->_key, true));
    }

    public function getTICKET() {
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($this->_form->_key);
        $detail = $this->qDetailDocumento($this->_form->_key);

        /* RUC | TIPO DE DOCUMENTO | SERIE | NUMERO | MTO TOTAL IGV | MTO TOTAL DEL COMPROBANTE | FECHA DE EMISION |TIPO DE DOCUMENTO ADQUIRENTE | NUMERO DE DOCUMENTO ADQUIRENTE | */
        $text_qr = $company['ruc'] . '|' . $head['tipo_comprobante'] . '|' . $head['serie'] . '|' . $head['numero_documento'] . '|' . $head['total_igv'] . '|' . $head['total_venta'] . '|' . $head['fecha_emision'] . '|' . $head['id_tipo_documento_identidad'] . '|' . $head['documento_identidad'] . '|';
        $qr = ROOT . 'files' . DS . 'temp' . DS . 'QR_' . $this->_form->_key . '.png';
        require_once ROOT . 'libs' . DS . 'phpqrcode' . DS . 'qrlib.php';

        \QR\QRcode::png($text_qr, $qr, 'Q', 15, 0);

        $ruta_qr = BASE_URL . 'files/temp/QR_' . $this->_form->_key . '.png';

        switch ($head['simbolo']) {
            case 'S/':
                $m = 'Nuevos Soles';
                break;
            case '$':
                $m = 'Dolares';
                break;
            case '€':
                $m = 'Euros';
                break;
        }

        $head['total_letra'] = Obj()->Libs->NumberToString->convert($head['total_venta'], $m);

        $pdf = [
            'company' => $company,
            'head' => $head,
            'detail' => $detail,
            'qr' => $ruta_qr
        ];

        echo json_encode($pdf);
    }

    public function getXML() {
        echo json_encode($this->qRespuestaSunat());
    }

    public function getCDR() {
        echo json_encode($this->qRespuestaSunat());
    }

    public function getPDFGuia() {
        $id = $this->_form->_keyGuia;
        $company = $this->qCompany();
        $head = $this->qHeadGuia($id);
        $detail = $this->qDetailGuia($id);

        /* RUC | TIPO DE DOCUMENTO | SERIE | NUMERO | MTO TOTAL IGV | MTO TOTAL DEL COMPROBANTE | FECHA DE EMISION |TIPO DE DOCUMENTO ADQUIRENTE | NUMERO DE DOCUMENTO ADQUIRENTE | */
        /* $text_qr = $company['ruc'] . '|' . $head['tipo_comprobante'] . '|' . $head['serie'] . '|' . $head['numero_documento'] . '|' . $head['fecha_guia'] . '|' . $head['id_tipo_documento_identidad_destinatario'] . '|' . $head['documento_identidad_destinatario'] . '|';
          $ruta_qr = BASE_URL . 'files/temp/QR_' . $id . '.png';
          $qr = ROOT . 'files' . DS . 'temp' . DS . 'QR_' . $id . '.png';
          $ruta_qr = $qr;
          require_once ROOT . 'libs' . DS . 'phpqrcode' . DS . 'qrlib.php';

          \QR\QRcode::png($text_qr, $qr, 'Q', 15, 0); */

        $DomPDF = new DOMPDF();
        $DomPDF->set_option('enable_remote', TRUE);
        $file = ROOT . "files" . DS . "temp" . DS . "tmpGuia".$head['id_venta'].".pdf";
        Obj()->Vendor->Tools->deleteFile($file);

        $productos = '';
        $i = 1;
        foreach ($detail as $value) {
            $productos .= '
            <tr class="detalletable"> 
                <td style="text-align:center">' . $i++ . '</td>
                <td>' . $value['catalogo'] . '</td>
                <td style="text-align:center">' . $value['u_medida'] . '</td>
                <td style="text-align:right">' . $value['cantidad'] . '</td>
            </tr>';
        }
        $hash = '';
        if (!empty($head['hash_cpe'])) {
            $hash = '<br><span class="codigofac">HASH: ' . $head['hash_cpe'] . '</span>';
        }

        $html = file_get_contents(BASE_URL . 'files/template/comprobante/guiaRemision.html');

        $html = str_replace("{BASE_URL}", BASE_URL, $html);
        $html = str_replace("{LOGO}", Obj()->Vendor->Session->get('app_logo'), $html);
        $html = str_replace("{R_SOCIAL_E}", $company['razon_social'], $html);
        $html = str_replace("{R_DIRECCION_E}", $company['direccion'], $html);
        $html = str_replace("{R_TELEFONO_E}", $company['telefono'], $html);
        $html = str_replace("{R_EMAIL_E}", $company['email'], $html);
        $html = str_replace("{R_RUC_E}", $company['ruc'], $html);
        $html = str_replace("{NAME_DOC}", $head['name_tipo_comprobante'] . ' ELECTRONICA', $html);
        $html = str_replace("{NUM_DOC}", $head['serie'] . '-' . $head['numero_documento'], $html);

        $html = str_replace("{R_SOCIAL_D}", $head['razon_social_destinatario'], $html);
        $html = str_replace("{DIRECCION_D}", $head['direccion_drestinatario'], $html);
        $html = str_replace("{TIPO_DOC_D}", $head['tipo_doc_identidad_destinatario'], $html);
        $html = str_replace("{NUM_DOC_D}", $head['documento_identidad_destinatario'], $html);

        $html = str_replace("{FECHA_TRASLADO}", $head['fecha_traslado'], $html);
        $html = str_replace("{MODALIDAD_TRASLADO}", $head['modalidad_transporte'], $html);
        $html = str_replace("{MOTIVO_TRASLADO}", $head['motivo_traslado_guia'], $html);
        $html = str_replace("{NRO_BULTO}", $head['num_bultos'], $html);
        $html = str_replace("{PUNTO_PARTIDA}", $head['punto_partida'], $html);
        $html = str_replace("{PUNTO_LLEGADA}", $head['punto_llegada'], $html);

        $html = str_replace("{TIPO_DOC_T}", $head['tipo_doc_identidad_transporte'], $html);
        $html = str_replace("{R_SOCIAL_T}", $head['razon_social_transporte'], $html);
        $html = str_replace("{NUM_DOC_T}", $head['numero_documento_transporte'], $html);

        $html = str_replace("{PLACA_TRASLADO}", $head['placa_vehiculo'], $html);
        $html = str_replace("{TIPO_DOC_C}", $head['tipo_doc_identidad_transportista'], $html);
        $html = str_replace("{NUM_DOC_C}", $head['numero_documento_transportista'], $html);
        $html = str_replace("{OBS}", $head['observaciones'], $html);
        $html = str_replace("{DETAIL}", $productos, $html);
        $html = str_replace("{HASH}", $hash, $html);
        $html = str_replace("{TIPODOC}", ucfirst(strtolower($head['name_tipo_comprobante'])), $html);

        $DomPDF->load_html($html);

        $DomPDF->render();
        $pdf = $DomPDF->output();
        file_put_contents($file, $pdf);

        if (is_readable($file)) {
            echo json_encode(['result' => 1, 'file' => BASE_URL . "files/temp/tmpGuia".$head['id_venta'].".pdf"]);
        } else {
            echo json_encode(['result' => 2]);
        }
    }

    public function sendCliente() {
        $data = $this->qEmailCliente();
        if (!empty($data['email_principal'])) {
            if (DB_ENTORNO == 'P') {
                if ($this->_sendMailCliente($data)) {
                    $data = ['ok_error' => 'ok'];
                } else {
                    $data = ['ok_error' => 'error'];
                }
            } else {
                $data = ['ok_error' => 'ok'];
            }
        } else {
            $data = ['ok_error' => 'nomail'];
        }
        echo json_encode($data);
    }

    private function _sendMailCliente($data) {
        $pdf = $this->_pdfDocumento($this->_form->_key, true);

        $body = file_get_contents('files' . DS . 'mails' . DS . 'docsCliente.phtml');

        $filePDF = $pdf['file'];
        $fileXML = ROOT_UBL21 . $data['ruc'] . '/' . $data['name_file_sunat'] . '.XML';

        /* reemplazando titulos */
        $body = str_replace("{NUMDOC}", $data['num_doc'], $body);
        $body = str_replace("{LOGO}", Obj()->Vendor->Session->get('app_logo'), $body);
        $body = str_replace("{PDF}", $filePDF, $body);
        $body = str_replace("{XML}", $fileXML, $body);

        Obj()->Libs->PHPMailer->setFrom(MAIL_REMITENTE_APP, APP_COMPANY);
        Obj()->Libs->PHPMailer->Subject = 'Documento Electrónico ' . $data['num_doc'];
        Obj()->Libs->PHPMailer->CharSet = 'UTF-8';
        //contenido del correo
        Obj()->Libs->PHPMailer->msgHTML($body, ROOT);
        Obj()->Libs->PHPMailer->AltBody = 'Documento Electrónico ' . $data['num_doc'];



        Obj()->Libs->PHPMailer->addStringAttachment(file_get_contents($filePDF), $data['name_file_sunat'] . '.pdf');
        Obj()->Libs->PHPMailer->addStringAttachment(file_get_contents($fileXML), $data['name_file_sunat'] . '.XML');

        //correos y nombres de destinatario
        if (!empty($data['email_1'])) {
            Obj()->Libs->PHPMailer->addAddress($data['email_1'], 'Documento Electrónico ' . $data['num_doc']); #correo de calidda
        }
        if (!empty($data['email_2'])) {
            Obj()->Libs->PHPMailer->addAddress($data['email_2'], 'Documento Electrónico ' . $data['num_doc']); #correo de calidda
        }
        if(!empty($data['email_principal'])){
            Obj()->Libs->PHPMailer->addAddress($data['email_principal'], 'Documento Electrónico ' . $data['num_doc']); #correo de calidda
        }
        //enviando
        return Obj()->Libs->PHPMailer->send();
    }

    public function sendGuiaSunaht() {
        $company = $this->qCompany();
        $head = $this->qHeadGuia($this->_form->_keyGuia);
        $detail = $this->qDetailGuia($this->_form->_keyGuia);

        $products = [];
        $i = 0;
        foreach ($detail as $value) {
            $i++;
            $products[] = [
                "ITEM" => $i,
                "CODIGO_PRODUCTO" => $value['id_catalogo'],
                "DESCRIPCION" => $value['catalogo'],
                "U_MEDIDA" => $value['u_medida'],
                "CANTIDAD" => $value['cantidad']
            ];
        }

        $ruta = ROOT_WS_SUNAT . "guia_remision.php";

        $data = [
            //Cabecera del documento
            "tipo_proceso" => FAE_ENTORNO,
            "pass_firma" => $company['pass_firma'],
            "serie_comprobante" => $head['serie'],
            "numero_comprobante" => $head['numero_documento'],
            "fecha_comprobante" => $head['fecha_guia'],
            "cod_tipo_documento" => $head['tipo_comprobante'],
            "nota" => $head['observaciones'],
            "codmotivo_traslado" => $head['id_motivo_traslado_guia'],
            "motivo_traslado" => $head['motivo_traslado_guia'],
            "peso" => "0",
            "numero_paquetes" => $head['num_bultos'],
            "codtipo_transportista" => $head['modalidad_transporte'],
            "tipo_documento_transporte" => $head['id_tipo_documento_identidad_transporte'],
            "nro_documento_transporte" => $head['numero_documento_transporte'],
            "razon_social_transporte" => $head['razon_social_transporte'],
            "ubigeo_destino" => "130101",
            "dir_destino" => $head['punto_llegada'],
            "ubigeo_partida" => "130101",
            "dir_partida" => $head['punto_partida'],
            //Datos del cliente
            "cliente_numerodocumento" => $head['documento_identidad_destinatario'],
            "cliente_nombre" => $head['razon_social_destinatario'],
            "cliente_tipodocumento" => $head['id_tipo_documento_identidad_destinatario'],
            "emisor" => [
                "ruc" => $company['ruc'],
                "tipo_doc" => "6",
                "nom_comercial" => $company['nombre_comercial'],
                "razon_social" => $company['razon_social'],
                "codigo_ubigeo" => $company['ubigeo_codigo'],
                "direccion" => $company['direccion'],
                "direccion_departamento" => $company['departamento'],
                "direccion_provincia" => $company['provincia'],
                "direccion_distrito" => $company['distrito'],
                "direccion_codigopais" => "PE",
                "usuariosol" => $company['usuario_sol'],
                "clavesol" => $company['clave_sol']
            ],
            //items del documento
            "detalle" => $products
        ];

        //Invocamos el servicio
        $token = ''; //en caso quieras utilizar algún token generado desde tu sistema
        //codificamos la data
        $data_json = json_encode($data);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $ruta);
        curl_setopt(
                $ch, CURLOPT_HTTPHEADER, array(
            'Authorization: Token token="' . $token . '"',
            'Content-Type: application/json',
                )
        );
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $rs = json_decode(curl_exec($ch));
        curl_close($ch);

        $this->_form->_estado = (@$rs->respuesta == 'OK') ? '1' : '0';
        $this->_form->_code = @$rs->cod_sunat;
        $this->_form->_descripcionSunat = @$rs->msj_sunat;
        $this->_form->_file = @$rs->file;
        $this->_form->_hcdr = @$rs->hash_cdr;
        $this->_form->_hcpe = @$rs->hash_cpe;

        $this->qUdpdateRespuestaSunatGuia();

        $result = [
            'message' => @$this->_form->_descripcionSunat,
            'response' => @$rs->respuesta,
            'name_file_sunat' => @$rs->file,
            'numero_documento' => $head['serie'] . '-' . $head['numero_documento'],
            'ruc' => $company['ruc'],
            'id_guia' => $this->_form->_keyGuia
        ];

        echo json_encode($result);
    }

    public function sendDocSunaht() {
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($this->_form->_key);
        $detail = $this->qDetailDocumento($this->_form->_key);

        $products = [];
        $i = 0;
        foreach ($detail as $value) {
            $i++;
            $txtIGV = $value['total_igv'];
            $txtIMPORTE_DET = $value['sub_total'];
            $txtPRECIO_TIPO_CODIGO = '01';
            $txtPRECIO_SIN_IGV_DET = number_format(($value['sub_total'] / $value['cantidad']), 2,'.','');
            
            if($value['id_tipo_igv'] == 11){//gravada gratuita po premio
                $txtIGV = $value['sub_total'] - ($value['sub_total'] / 1.18);
                $txtIMPORTE_DET = $value['sub_total'] / 1.18;
                $txtPRECIO_TIPO_CODIGO = '02';
                $txtPRECIO_SIN_IGV_DET = 0;
            }
            $products[] = [
                "ITEM" => "1",
                "PESO" => "100.000",
                "NUMERO_ORDEN" => "1",
                "DESCRIPCION" => "Producto 01",
                "CODIGO_PRODUCTO" => "PIUU8",
                "txtITEM" => $i,
                "txtUNIDAD_MEDIDA_DET" => $value['u_medida'],
                "txtCANTIDAD_DET" => $value['cantidad'],
                "txtPRECIO_DET" => $value['precio_unitario'],
                //"txtSUB_TOTAL_DET" => $value['sub_total'],
                "txtPRECIO_TIPO_CODIGO" => $txtPRECIO_TIPO_CODIGO,
                "txtIGV" => number_format($txtIGV,2,'.',''),
                "txtISC" => "0",
                "txtIMPORTE_DET" => number_format($txtIMPORTE_DET,2,'.',''),
                "txtCOD_TIPO_OPERACION" => $value['id_tipo_igv'],
                "txtCODIGO_DET" => $value['id_catalogo'],
                "txtDESCRIPCION_DET" => $value['catalogo'],
                "txtPRECIO_SIN_IGV_DET" => $txtPRECIO_SIN_IGV_DET
            ];
        }

        $doc = ($head['tipo_comprobante'] == '01') ? 'factura' : 'boleta';

$ruta = ROOT_WS_SUNAT . "${doc}.php";
/*   
$rutasunat='http://ferro-innova.com/apifact/ws/';
$ruta =$rutasunat."${doc}.php";
*/
        $data = [
            //Cabecera del documento
            "tipo_proceso" => FAE_ENTORNO,
            "pass_firma" => $company['pass_firma'],
            "tipo_operacion" => "0101",
            "total_gravadas" => $head['total_gravada'],
            "total_inafecta" => $head['total_inafecta'],
            "total_exoneradas" => $head['total_exonerada'],
            "total_gratuitas" => $head['total_gratuita'],
            "total_exportacion" => "0",
            "total_descuento" => "0",
            "sub_total" => $head['total_gravada'],
            "porcentaje_igv" => $head['igv'],
            "total_igv" => $head['total_igv'],
            "total_isc" => "0",
            "total_otr_imp" => "0",
            "total" => $head['total_venta'],
            "total_letras" => "",
            "nro_guia_remision" => "",
            "cod_guia_remision" => "",
            "nro_otr_comprobante" => "",
            "serie_comprobante" => $head['serie'], //Para boletas la serie debe comenzar por la letra B, seguido de tres dígitos
            "numero_comprobante" => $head['numero_documento'],
            "fecha_comprobante" => $head['fecha_comprobante'],
            "fecha_vto_comprobante" => $head['fecha_vencimiento'],
            "cod_tipo_documento" => $head['tipo_comprobante'],
            "cod_moneda" => "PEN",
            //Datos del cliente
            "cliente_numerodocumento" => $head['documento_identidad'],
            "cliente_nombre" => $head['razon_social'],
            "cliente_tipodocumento" => $head['id_tipo_documento_identidad'], //1: DNI
            "cliente_direccion" => $head['direccion_fiscal'],
            "cliente_pais" => "PE",
            "cliente_ciudad" => "Lima",
            "cliente_codigoubigeo" => "",
            "cliente_departamento" => "",
            "cliente_provincia" => "",
            "cliente_distrito" => "",
            //data de la empresa emisora o contribuyente que entrega el documento electrónico.
            "emisor" => [
                "ruc" => $company['ruc'],
                "tipo_doc" => "6",
                "nom_comercial" => $company['nombre_comercial'],
                "razon_social" => $company['razon_social'],
                "codigo_ubigeo" => $company['ubigeo_codigo'],
                "direccion" => $company['direccion'],
                "direccion_departamento" => $company['departamento'],
                "direccion_provincia" => $company['provincia'],
                "direccion_distrito" => $company['distrito'],
                "direccion_codigopais" => "PE",
                "usuariosol" => $company['usuario_sol'],
                "clavesol" => $company['clave_sol']
            ],
            //items del documento
            "detalle" => $products
        ];

        //Invocamos el servicio
        $token = ''; //en caso quieras utilizar algún token generado desde tu sistema
        //codificamos la data
        $data_json = json_encode($data);


        $ch = curl_init($ruta);
        curl_setopt(
                $ch, CURLOPT_HTTPHEADER, array(
            'Authorization: Token token="' . $token . '"',
            'Content-Type: application/json',
                )
        );
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $rs = json_decode($response);
        curl_close($ch);

        $this->_form->_estado = (@$rs->respuesta == 'OK') ? '1' : '0';
        $this->_form->_code = @$rs->cod_sunat;
        $this->_form->_descripcionSunat = @$rs->msj_sunat;
        $this->_form->_file = @$rs->file;
        $this->_form->_hcdr = @$rs->hash_cdr;
        $this->_form->_hcpe = @$rs->hash_cpe;

        $this->qUdpdateRespuestaSunat();

        $result = [
            'message' => @$this->_form->_descripcionSunat,
            'message2' => $response,
            'response' => @$rs->respuesta,
            'name_file_sunat' => @$rs->file,
            'numero_documento' => $head['serie'] . '-' . $head['numero_documento'],
            'id_tipo_comprobante' => $head['id_tipo_comprobante'],
            'ruc' => $company['ruc'],
            'total_venta' => $head['total_venta'],
            'id_venta' => $head['id_venta']
        ];

        echo json_encode($result);
    }

    public function postComunicacionBaja() {

        //si es una boleta no le permite anular
        if ($this->_form->_tipoComprobante == 2) {
            $result = [
                'response' => 'BOL_NO'
            ];
            echo json_encode($result);
            exit;
        }

        $rs = $this->spMantenimientoBaja();

        $company = $this->qCompany();
        $head = $this->qHeadDocumentoBaja($rs['id_baja']);

        $ruta = ROOT_WS_SUNAT . "baja.php";

        $data = [
            "tipo_proceso" => FAE_ENTORNO,
            "pass_firma" => $company['pass_firma'],
            //Cabecera del documento
            "codigo" => "RA",
            "serie" => str_replace('-', '', $head['fecha_anulacion']),
            "secuencia" => $head['numero_baja'],
            "fecha_referencia" => $head['fecha_anulacion'],
            "fecha_baja" => $head['fecha_anulacion'],
            //data de la empresa emisora o contribuyente que entrega el documento electrónico.
            "emisor" => [
                "ruc" => $company['ruc'],
                "tipo_doc" => "6",
                "nom_comercial" => $company['nombre_comercial'],
                "razon_social" => $company['razon_social'],
                "codigo_ubigeo" => $company['ubigeo_codigo'],
                "direccion" => $company['direccion'],
                "direccion_departamento" => $company['departamento'],
                "direccion_provincia" => $company['provincia'],
                "direccion_distrito" => $company['distrito'],
                "direccion_codigopais" => "PE",
                "usuariosol" => $company['usuario_sol'],
                "clavesol" => $company['clave_sol']
            ],
            //items
            "detalle" => [
                    [
                    "ITEM" => "1",
                    "TIPO_COMPROBANTE" => $head['codigo'],
                    "SERIE" => $head['serie'],
                    "NUMERO" => $head['numero_documento'],
                    "MOTIVO" => $head['motivo']
                ]
            ]
        ];

        $token = ''; //en caso quieras utilizar algún token generado desde tu sistema
        $data_json = json_encode($data);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $ruta);
        curl_setopt(
                $ch, CURLOPT_HTTPHEADER, array(
            'Authorization: Token token="' . $token . '"',
            'Content-Type: application/json',
                )
        );
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $rsp = json_decode(curl_exec($ch));
        curl_close($ch);

        $this->_form->_key = $rs['id_baja'];
        $this->_form->_estado = ($rsp->respuesta == 'OK') ? '1' : '0';
        $this->_form->_code = @$rsp->cod_sunat;
        $this->_form->_descripcionSunat = $rsp->msj_sunat . '. ' . @$rsp->resp_envio_doc . '. ' . @$rsp->resp_consulta_ticket;
        $this->_form->_file = @$rsp->file;
        $this->_form->_hcdr = @$rsp->hash_cdr;
        $this->_form->_hcpe = @$rsp->hash_cpe;

        $this->qUdpdateRespuestaBajaSunat();

        $result = [
            'message' => @$this->_form->_descripcionSunat,
            'response' => @$rsp->respuesta,
            'name_file_sunat' => @$rsp->file,
            'numero_documento' => $head['numero_baja'],
            'ruc' => $company['ruc'],
            'id_baja' => $rs['id_baja'],
            'mensaje' => @$this->_form->_descripcionSunat
        ];

        echo json_encode($result);
    }

    public function getPedido() {
        echo json_encode($this->qPedido());
    }

    public function getVenta() {
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($this->_form->_key);
        $detail = $this->qDetailDocumento($this->_form->_key);
        echo json_encode(['head' => $head, 'detail' => $detail]);
    }

    public function getNumGuia() {
        echo json_encode($this->qtNumGuia());
    }

    public function haveGuide() {
        $data = [
            'id_guia' => $this->qGetIdGuia()['id_gruia_remision'],
            'have' => $this->qHaveGuide()
        ];
        echo json_encode($data);
    }

    public function getXMLGuia() {
        $data = [
            'company' => $this->qCompany(),
            'file' => $this->qFileGuia(),
        ];
        echo json_encode($data);
    }

    public function getDataGuia() {
        $head = $this->qHeadDocumento($this->_form->_key);
        $detail = $this->qDetailDocumento($this->_form->_key);
        $data = [
            'company' => $company = $this->qCompany(),
            'head' => $head,
            'detail' => $detail
        ];
        echo json_encode($data);
    }

    public function getDataEditGuia() {
        $guia = $this->qGetIdGuia()['id_gruia_remision'];
        $head = $this->qHeadGuia($guia);
        $detail = $this->qDetailGuia($guia);
        $data = [
            'company' => $company = $this->qCompany(),
            'head' => $head,
            'detail' => $detail
        ];
        echo json_encode($data);
    }

    public function getDetailBox() {
        $data = [
            'fecha' => $this->qFechasVentaCloseCaja(),
            'detail' => $this->qDetailBox()
        ];
        echo json_encode($data);
    }

    public function postCloseCaja() {
        echo json_encode($this->spCloseCaja());
    }

    public function postOpenCaja() {
        echo json_encode($this->qOpenCaja());
    }

    public function getChekOpenCaja() {
        echo json_encode($this->qChekOpenCaja());
    }

    private function _pdfDocumento($id, $return = false) {
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($id);
        $detail = $this->qDetailDocumento($id);

        /* RUC | TIPO DE DOCUMENTO | SERIE | NUMERO | MTO TOTAL IGV | MTO TOTAL DEL COMPROBANTE | FECHA DE EMISION |TIPO DE DOCUMENTO ADQUIRENTE | NUMERO DE DOCUMENTO ADQUIRENTE | */
        $text_qr = $company['ruc'] . '|' . $head['tipo_comprobante'] . '|' . $head['serie'] . '|' . $head['numero_documento'] . '|' . $head['total_igv'] . '|' . $head['total_venta'] . '|' . $head['fecha_emision'] . '|' . $head['id_tipo_documento_identidad'] . '|' . $head['documento_identidad'] . '|';
        $ruta_qr = BASE_URL . 'files/temp/QR_' . $id . '.png';
        $qr = ROOT . 'files' . DS . 'temp' . DS . 'QR_' . $id . '.png';
        $ruta_qr = $qr;
        require_once ROOT . 'libs' . DS . 'phpqrcode' . DS . 'qrlib.php';

        \QR\QRcode::png($text_qr, $qr, 'Q', 15, 0);

        $DomPDF = new DOMPDF();
        $DomPDF->set_option('enable_remote', TRUE);
        $file = ROOT . "files" . DS . "temp" . DS . "tmpVenta".$head['id_venta'].".pdf";
        Obj()->Vendor->Tools->deleteFile($file);

        $productos = '';
        foreach ($detail as $value) {
            $productos .= '
            <tr class="detalletable"> 
              <td>' . $value['catalogo'] . '</td>
              <td style="text-align:right">' . $value['cantidad'] . '</td>
              <td style="text-align:right">' . $value['precio_unitario'] . '</td>
              <td style="text-align:right">' . $value['sub_total'] . '</td>
              <td class="ulttable" style="text-align:right">' . $value['total'] . '</td>
            </tr>';
        }
        $direccionCliente = '';
        if (!empty($head['direccion_fiscal'])) {
            $direccionCliente = '<tr>
                                    <td class="tdatoslabel">
                                            <div style="padding-bottom: 10px; padding-right: 19px;">
                                                    <span style="float: left;">Dirección:</span>
                                                    <div style="margin-left: 105px; border-bottom: solid 1px #000;"> ' . $head['direccion_fiscal'] . '</div>
                                            </div>
                                    </td>
                                </tr>';
        }
        $hash = '';
        if (!empty($head['hash_cpe'])) {
            $hash = '<br><span class="codigofac">HASH: ' . $head['hash_cpe'] . '</span>';
        }

        $html = file_get_contents(BASE_URL . 'files/template/comprobante/boletaFactura.html');

        $html = str_replace("{BASE_URL}", BASE_URL, $html);
        $html = str_replace("{LOGO}", Obj()->Vendor->Session->get('app_logo'), $html);
        $html = str_replace("{R_SOCIAL_E}", $company['razon_social'], $html);
        $html = str_replace("{R_DIRECCION_E}", $company['direccion'], $html);
        $html = str_replace("{R_TELEFONO_E}", $company['telefono'], $html);
        $html = str_replace("{R_EMAIL_E}", $company['email'], $html);
        $html = str_replace("{R_RUC_E}", $company['ruc'], $html);
        $html = str_replace("{NAME_DOC}", $head['name_tipo_comprobante'] . ' ELECTRONICA', $html);
        $html = str_replace("{NUM_DOC}", $head['serie'] . '-' . $head['numero_documento'], $html);
        $html = str_replace("{R_SOCIAL_C}", $head['razon_social'], $html);
        $html = str_replace("{FECHA_EMISION}", $head['fecha_emision'], $html);
        $html = str_replace("{TIPO_DOC_C}", $head['tipo_doc_identidad'], $html);
        $html = str_replace("{NUM_DOC_C}", $head['documento_identidad'], $html);
        $html = str_replace("{MONEDA}", $head['tipo_moneda_name'], $html);
        $html = str_replace("{R_DIRECCION_C}", $direccionCliente, $html);
        $html = str_replace("{DETAIL}", $productos, $html);
        $html = str_replace("{MONTO_LETRAS}", Obj()->Libs->NumberToString->convert($head['total_venta'], $head['tipo_moneda_name']), $html);
        $html = str_replace("{SUB_TOTAL}", $head['total_gravada'], $html);
        $html = str_replace("{TOTAL_IGV}", $head['total_igv'], $html);
        $html = str_replace("{TOTAL}", $head['total_venta'], $html);
        $html = str_replace("{LINK}", 'https://bit.ly/2HiRWZI', $html);
        $html = str_replace("{HASH}", $hash, $html);
        $html = str_replace("{QR}", $ruta_qr, $html);
        $html = str_replace("{TIPODOC}", ucfirst(strtolower($head['name_tipo_comprobante'])), $html);
        $html = str_replace("{CAJA}", $head['caja'], $html);
        $html = str_replace("{USER}", $head['vendedor'], $html);
        $html = str_replace("{OBS}", $head['observaciones'], $html);

        $DomPDF->load_html($html);


        $DomPDF->render();
        $pdf = $DomPDF->output();
        file_put_contents($file, $pdf);

        if (is_readable($file)) {
            if ($return) {
                return ['result' => 1, 'file' => BASE_URL . "files/temp/tmpVenta".$head['id_venta'].".pdf"];
            } else {
                echo json_encode(['result' => 1, 'file' => BASE_URL . "files/temp/tmpVenta".$head['id_venta'].".pdf"]);
            }
        } else {
            if ($return) {
                return ['result' => 2];
            } else {
                echo json_encode(['result' => 2]);
            }
        }
    }

    public function getPDFBaja() {
        $company = $this->qCompany();
        $head = $this->qHeadDocumentoBaja($this->_form->_key);

        $text_qr = $company['ruc'] . '|' . $head['codigo'] . '|' . $head['numero_baja'] . '|' . $head['fecha_anulacion'] . '|' . $head['serie'] . '|' . $head['numero_documento'] . '|';
        $ruta_qr = BASE_URL . 'files/temp/QRBAJA_' . $this->_form->_key . '.png';
        $qr = ROOT . 'files' . DS . 'temp' . DS . 'QRBAJA_' . $this->_form->_key . '.png';
        $ruta_qr = $qr;
        require_once ROOT . 'libs' . DS . 'phpqrcode' . DS . 'qrlib.php';

        \QR\QRcode::png($text_qr, $qr, 'Q', 15, 0);

        $DomPDF = new DOMPDF();
        $DomPDF->set_option('enable_remote', TRUE);
        $file = ROOT . "files" . DS . "temp" . DS . "tmpBaja".$head['id_venta'].".pdf";
        Obj()->Vendor->Tools->deleteFile($file);

        $hash = '';
        if (!empty($head['hash_cpe'])) {
            $hash = '<br><span class="codigofac">Resumen: ' . $head['hash_cpe'] . '</span>';
        }

        $html = file_get_contents(BASE_URL . 'files/template/comprobante/baja.html');

        $html = str_replace("{BASE_URL}", BASE_URL, $html);
        $html = str_replace("{R_SOCIAL_E}", $company['razon_social'], $html);
        $html = str_replace("{R_DIRECCION_E}", $company['direccion'], $html);
        $html = str_replace("{R_TELEFONO_E}", $company['telefono'], $html);
        $html = str_replace("{R_EMAIL_E}", $company['email'], $html);
        $html = str_replace("{R_RUC_E}", $company['ruc'], $html);
        $html = str_replace("{NUM_DOC}", $head['numero_baja'], $html);
        $html = str_replace("{FECHA}", $head['fecha_anulacion'], $html);
        $html = str_replace("{T_DOC_AFEC}", $head['tipo_comprobante'], $html);
        $html = str_replace("{NUM_DOC_AFEC}", $head['serie'] . '-' . $head['numero_documento'], $html);
        $html = str_replace("{MOTIVO}", $head['motivo'], $html);
        $html = str_replace("{LINK}", 'https://bit.ly/2HiRWZI', $html);
        $html = str_replace("{HASH}", $hash, $html);
        $html = str_replace("{QR}", $ruta_qr, $html);

        $DomPDF->load_html($html);


        $DomPDF->render();
        $pdf = $DomPDF->output();
        file_put_contents($file, $pdf);

        if (is_readable($file)) {
            echo json_encode(['result' => 1, 'file' => BASE_URL . "files/temp/tmpBaja".$head['id_venta'].".pdf"]);
        } else {
            echo json_encode(['result' => 2]);
        }
    }

}
