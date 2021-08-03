<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 17:09:42 
 * Descripcion : NotaCreditoController.php
 * ---------------------------------------
 */

namespace Facturacion\NotaCredito\Controllers;

use \Vendor\Controller;
use \Facturacion\NotaCredito\Filters\NotaCreditoFilter;
use \Dompdf\Dompdf;

class NotaCreditoController extends \Facturacion\NotaCredito\Models\NotaCreditoModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use NotaCreditoFilter {
        NotaCreditoFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del NotaCreditoModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del NotaCreditoFilter */
    }

    public function index() {
        
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }

    public function getFactura() {
        $data = [
            'head' => $this->qHeadDocumentoFactura(),
            'detail' => $this->qDetailDocumentoFactura()
        ];
        echo json_encode($data);
    }

    public function verFactura() {

        $company = $this->qCompany();
        $head = $this->qHeadDocumentoFactura();
        $detail = $this->qDetailDocumentoFactura();

        /* RUC | TIPO DE DOCUMENTO | SERIE | NUMERO | MTO TOTAL IGV | MTO TOTAL DEL COMPROBANTE | FECHA DE EMISION |TIPO DE DOCUMENTO ADQUIRENTE | NUMERO DE DOCUMENTO ADQUIRENTE | */
        $text_qr = $company['ruc'] . '|' . $head['tipo_comprobante'] . '|' . $head['serie'] . '|' . $head['numero_documento'] . '|' . $head['total_igv'] . '|' . $head['total_venta'] . '|' . $head['fecha_emision'] . '|' . $head['id_tipo_documento_identidad'] . '|' . $head['documento_identidad'] . '|';
        $ruta_qr = BASE_URL . 'files/temp/QR_' . $head['id_venta'] . '.png';
        $qr = ROOT . 'files' . DS . 'temp' . DS . 'QR_' . $head['id_venta'] . '.png';
        $ruta_qr = $qr;
        require_once ROOT . 'libs' . DS . 'phpqrcode' . DS . 'qrlib.php';

        \QR\QRcode::png($text_qr, $qr, 'Q', 15, 0);

        $DomPDF = new DOMPDF();
        $DomPDF->set_option('enable_remote', TRUE);
        $file = ROOT . "files" . DS . "temp" . DS . "tmpVenta.pdf";
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
        $html = str_replace("{R_RUC_E}", $company['ruc'], $html);
        $html = str_replace("{NAME_DOC}", $head['tipo_comprobante'], $html);
        $html = str_replace("{NUM_DOC}", $head['serie'] . '-' . $head['numero_documento'], $html);
        $html = str_replace("{R_SOCIAL_C}", $head['razon_social'], $html);
        $html = str_replace("{FECHA_EMISION}", $head['fecha_emision'], $html);
        $html = str_replace("{TIPO_DOC_C}", $head['tipo_doc_identidad'], $html);
        $html = str_replace("{NUM_DOC_C}", $head['documento_identidad'], $html);
        $html = str_replace("{MONEDA}", $head['moneda'], $html);
        $html = str_replace("{R_DIRECCION_C}", $direccionCliente, $html);
        $html = str_replace("{DETAIL}", $productos, $html);
        $html = str_replace("{MONTO_LETRAS}", Obj()->Libs->NumberToString->convert($head['total_venta']), $html);
        $html = str_replace("{SUB_TOTAL}", $head['total_gravada'], $html);
        $html = str_replace("{TOTAL_IGV}", $head['total_igv'], $html);
        $html = str_replace("{TOTAL}", $head['total_venta'], $html);
        $html = str_replace("{LINK}", 'https://bit.ly/2HiRWZI', $html);
        $html = str_replace("{HASH}", $hash, $html);
        $html = str_replace("{QR}", $ruta_qr, $html);
        $html = str_replace("{CAJA}", $head['caja'], $html);
        $html = str_replace("{USER}", $head['vendedor'], $html);
        $html = str_replace("{OBS}", $head['observaciones'], $html);

        $DomPDF->load_html($html);


        $DomPDF->render();
        $pdf = $DomPDF->output();
        file_put_contents($file, $pdf);

        if (is_readable($file)) {
            echo json_encode(['result' => 1, 'file' => BASE_URL . 'files/temp/tmpVenta.pdf']);
        } else {
            echo json_encode(['result' => 2]);
        }
    }

    public function postNotaCredito() {
        $rs = $this->spMantenimientoNT();
        $data = [
            'rs' => $rs,
            'company' => $this->qCompany(),
            'head' => $this->qHeadDocumento($rs['id_nota_credito'])
        ];
        echo json_encode($data);
    }

    public function sendDocSunaht() {
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($this->_form->_key);
        $detail = $this->qDetailDocumento($this->_form->_key);

        $ws = ROOT_WS_SUNAT . "notacredito.php";

        $f = 0;
        $items = [];
        foreach ($detail as $value) {
            $f++;
            $items[] = [
                "txtITEM" => $f,
                "txtUNIDAD_MEDIDA_DET" => $value['u_medida'],
                "txtCANTIDAD_DET" => $value['cantidad'],
                "txtPRECIO_DET" => $value['precio_unitario'],
                "txtSUB_TOTAL_DET" => $value['sub_total'],
                "txtPRECIO_TIPO_CODIGO" => "01",
                "txtIGV" => ($value['id_tipo_igv'] == 20)?"0":number_format(($value['total'] * $value['igv']), 2,'.',''),//number_format(($value['total'] * $value['igv']), 2),
                "txtISC" => "0",
                "txtIMPORTE_DET" => $value['total'],
                "txtCOD_TIPO_OPERACION" => $value['id_tipo_igv'],
                "txtCODIGO_DET" => $value['id_catalogo'],
                "txtDESCRIPCION_DET" => $value['catalogo'],
                "txtPRECIO_SIN_IGV_DET" => number_format(($value['precio_unitario'] - ($value['precio_unitario'] * $value['igv'])), 2,'.','')
            ];
        }

        $data = [
            "tipo_proceso" => FAE_ENTORNO,
            "pass_firma" => $company['pass_firma'],
            //Cabecera del documento
            "total_gravadas" => $head['total_gravada'],
            "porcentaje_igv" => $head['igv'],
            "total_igv" => $head['total_igv'],
            "total" => $head['total_nota_credito'],
            "serie_comprobante" => $head['serie'],
            "numero_comprobante" => $head['numero_documento'],
            "fecha_comprobante" => $head['fecha_emision'],
            "cod_tipo_documento" => $head['tipo_comprobante'],
            "cod_moneda" => $head['tipo_moneda'],
            "tipo_comprobante_modifica" => $head['tipo_doc_afectado'],
            "nro_documento_modifica" => $head['num_doc_afectado'],
            "cod_tipo_motivo" => $head['id_tipo_nota_credito'],
            "descripcion_motivo" => $head['motivo'],
            //Datos del cliente
            "cliente_numerodocumento" => $head['documento_identidad'],
            "cliente_nombre" => $head['razon_social'],
            "cliente_tipodocumento" => $head['id_tipo_documento_identidad'], //1: DNI
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
            "detalle" => $items
        ];

        $token = ''; //en caso quieras utilizar algún token generado desde tu sistema
        $data_json = json_encode($data);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $ws);
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

        $this->qUdpdateRespuestaSunat();

        $result = [
            'message' => $this->_form->_descripcionSunat,
            'response' => @$rs->respuesta,
            'name_file_sunat' => @$rs->file,
            'numero_documento' => $head['serie'] . '-' . $head['numero_documento'],
            'ruc' => $company['ruc'],
            'total_venta' => $head['total_nota_credito'],
            'id_nota_credito' => $head['id_nota_credito'],
            'msn_sunat' => @$rs->msj_sunat
        ];

        echo json_encode($result);
    }

    public function getNumeroDocActual() {
        echo json_encode($this->qGetNumeroDocActual());
    }

    public function getPDF() {
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($this->_form->_key);
        $detail = $this->qDetailDocumento($this->_form->_key);

        /* RUC | TIPO DE DOCUMENTO | SERIE | NUMERO | MTO TOTAL IGV | MTO TOTAL DEL COMPROBANTE | FECHA DE EMISION |TIPO DE DOCUMENTO ADQUIRENTE | NUMERO DE DOCUMENTO ADQUIRENTE | */
        $text_qr = $company['ruc'] . '|' . $head['tipo_comprobante'] . '|' . $head['serie'] . '|' . $head['numero_documento'] . '|' . $head['total_igv'] . '|' . $head['total_nota_credito'] . '|' . $head['fecha_emision'] . '|' . $head['id_tipo_documento_identidad'] . '|' . $head['documento_identidad'] . '|';
        $ruta_qr = BASE_URL . 'files/temp/QRNC_' . $this->_form->_key . '.png';
        $qr = ROOT . 'files' . DS . 'temp' . DS . 'QRNC_' . $this->_form->_key . '.png';
        $ruta_qr = $qr;
        require_once ROOT . 'libs' . DS . 'phpqrcode' . DS . 'qrlib.php';

        \QR\QRcode::png($text_qr, $qr, 'Q', 15, 0);

        $DomPDF = new DOMPDF();
        $DomPDF->set_option('enable_remote', TRUE);
        $file = ROOT . "files" . DS . "temp" . DS . "tmpNT.pdf";
        Obj()->Vendor->Tools->deleteFile($file);

        $productos = '';
        foreach ($detail as $value) {
            $productos .= '
            <tr class="detalletable"> 
              <td style="text-align:right">' . $value['cantidad'] . '</td>
              <td>' . $value['id_catalogo'] . '</td>
              <td>' . $value['catalogo'] . '</td>
              <td style="text-align:right">' . number_format(($value['precio_unitario'] / $value['cantidad']), 2) . '</td>
              <td class="ulttable" style="text-align:right">' . $value['total'] . '</td>
            </tr>';
        }
        $direccionCliente = '&nbsp;';
        if (!empty($head['direccion_fiscal'])) {
            $direccionCliente = $head['direccion_fiscal'];
        }
        $hash = '';
        if (!empty($head['hash_cpe'])) {
            $hash = '<br><span class="codigofac">HASH: ' . $head['hash_cpe'] . '</span>';
        }

        $html = file_get_contents(BASE_URL . 'files/template/comprobante/notaCredito.html');

        $html = str_replace("{BASE_URL}", BASE_URL, $html);
        $html = str_replace("{LOGO}", Obj()->Vendor->Session->get('app_logo'), $html);
        $html = str_replace("{R_SOCIAL_E}", $company['razon_social'], $html);
        $html = str_replace("{R_DIRECCION_E}", $company['direccion'], $html);
        $html = str_replace("{R_TELEFONO_E}", $company['telefono'], $html);
        $html = str_replace("{R_EMAIL_E}", $company['email'], $html);
        $html = str_replace("{R_RUC_E}", $company['ruc'], $html);
        $html = str_replace("{NAME_DOC}", $head['name_tipo_comprobante'], $html);
        $html = str_replace("{NUM_DOC}", $head['serie'] . '-' . $head['numero_documento'], $html);
        $html = str_replace("{FECHA_EMISION}", $head['fecha_emision'], $html);
        $html = str_replace("{R_RAZON_SOCIAL_C}", $head['razon_social'], $html);
        $html = str_replace("{R_DIRECCION_C}", $direccionCliente, $html);
        $html = str_replace("{NAME_DOC_AFEC}", $head['name_tipo_comprobante_afec'], $html);
        $html = str_replace("{NUM_DOC_AFEC}", $head['num_doc_afectado'], $html);
        $html = str_replace("{TIPO_DOC_C}", $head['tipo_doc_c'], $html);
        $html = str_replace("{NUM_DOC_C}", $head['documento_identidad'], $html);
        $html = str_replace("{FECHA_DOC_AFEC}", $head['fecha_doc_afec'], $html);
        $html = str_replace("{TIPO_MOTIVO}", $head['tipo_nota_credito'], $html);

        $html = str_replace("{DETAIL}", $productos, $html);
        $html = str_replace("{MONTO_LETRAS}", Obj()->Libs->NumberToString->convert($head['total_nota_credito']), $html);
        $html = str_replace("{SUB_TOTAL}", $head['total_gravada'], $html);
        $html = str_replace("{TOTAL_IGV}", $head['total_igv'], $html);
        $html = str_replace("{TOTAL}", $head['total_nota_credito'], $html);
        $html = str_replace("{LINK}", 'https://bit.ly/2HiRWZI', $html);
        $html = str_replace("{HASH}", $hash, $html);
        $html = str_replace("{QR}", $ruta_qr, $html);

        $DomPDF->load_html($html);


        $DomPDF->render();
        $pdf = $DomPDF->output();
        file_put_contents($file, $pdf);

        if (is_readable($file)) {
            echo json_encode(['result' => 1, 'file' => BASE_URL . 'files/temp/tmpNT.pdf']);
        } else {
            echo json_encode(['result' => 2]);
        }
    }

    public function getXML() {
        echo json_encode($this->qRespuestaSunat());
    }

    public function getCDR() {
        echo json_encode($this->qRespuestaSunat());
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
        $pdf = BASE_URL . 'files/temp/tmpNT.pdf';

        $body = file_get_contents('files' . DS . 'mails' . DS . 'docsCliente.phtml');

        $filePDF = $pdf;
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
        Obj()->Libs->PHPMailer->addAddress($data['email_principal'], 'Documento Electrónico ' . $data['num_doc']); #correo de calidda
        //enviando
        return Obj()->Libs->PHPMailer->send();
    }

    public function postComunicacionBaja() {
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
        $this->_form->_estado = (@$rsp->respuesta == 'OK') ? '1' : '0';
        $this->_form->_code = @$rsp->cod_sunat;
        $this->_form->_descripcionSunat = @$rsp->msj_sunat;
        $this->_form->_file = @$rsp->file;
        $this->_form->_hcdr = @$rsp->hash_cdr;
        $this->_form->_hcpe = @$rsp->hash_cpe;


        $this->qUdpdateRespuestaBajaSunat();

        $result = [
            'message' => $this->_form->_descripcionSunat,
            'response' => @$rsp->respuesta,
            'name_file_sunat' => @$rsp->file,
            'numero_documento' => $head['numero_baja'],
            'ruc' => $company['ruc'],
            'id_baja' => $rs['id_baja']
        ];

        echo json_encode($result);
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
        $file = ROOT . "files" . DS . "temp" . DS . "tmpBaja.pdf";
        Obj()->Vendor->Tools->deleteFile($file);

        $hash = '';
        if (!empty($head['hash_cpe'])) {
            $hash = '<br><span class="codigofac">Resumen: ' . $head['hash_cpe'] . '</span>';
        }

        $html = file_get_contents(BASE_URL . 'files/template/comprobante/baja.html');

        $html = str_replace("{BASE_URL}", BASE_URL, $html);
        $html = str_replace("{LOGO}", Obj()->Vendor->Session->get('app_logo'), $html);
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
            echo json_encode(['result' => 1, 'file' => BASE_URL . 'files/temp/tmpBaja.pdf']);
        } else {
            echo json_encode(['result' => 2]);
        }
    }

}
