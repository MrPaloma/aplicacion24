<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        16-09-2018 17:09:58 
 * Descripcion : BajaController.php
 * ---------------------------------------
 */

namespace Facturacion\Baja\Controllers;

use \Vendor\Controller;
use \Facturacion\Baja\Filters\BajaFilter;
use \Dompdf\Dompdf;

class BajaController extends \Facturacion\Baja\Models\BajaModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use BajaFilter {
        BajaFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del BajaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del BajaFilter */
    }

    public function index() {
        
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }

    public function getNumeroDocActual() {
        echo json_encode($this->qGetNumeroDocActual());
    }

    public function verDocumento() {
        $d = $this->qTipoComprobante();
        //segun el tipo se selecciona la data de su tabla respectiva
        switch ($d['id_tipo_comprobante']) {
            case 1://factura
                $tb = 'fac_venta';
                break;
            case 2://boleta
                $tb = 'fac_venta';
                break;
            case 3://nota credito
                $tb = 'fac_nota_credito';
                break;
            case 4://nota debito
                $tb = 'fac_nota_debito';
                break;
            case 5://retencion
                $tb = 'fac_retencion';
                break;
            case 6://percepcion
                $tb = 'fac_percepcion';
                break;
            case 7://guia
                $tb = 'fac_guia';
                break;
        }
        echo json_encode($this->qDocumento($tb,$d['id_tipo_comprobante']));
    }
    
    public function postBaja() {
        $d = $this->qTipoComprobante();
        //segun el tipo se selecciona la data de su tabla respectiva
        switch ($d['id_tipo_comprobante']) {
            case 1://factura
                $tb = 'fac_venta';
                break;
            case 2://boleta
                $tb = 'fac_venta';
                break;
            case 3://nota credito
                $tb = 'fac_nota_credito';
                break;
            case 4://nota debito
                $tb = 'fac_nota_debito';
                break;
            case 5://retencion
                $tb = 'fac_retencion';
                break;
            case 6://percepcion
                $tb = 'fac_percepcion';
                break;
            case 7://guia
                $tb = 'fac_guia';
                break;
        }
        echo json_encode($this->qDocumento($tb,$d['id_tipo_comprobante']));
    }
    
    public function postComunicacionBaja() {
        $rs = $this->spMantenimiento();
        
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($rs['id_baja']);
        
        echo json_encode($this->_enviaDunat($company,$head));
        
    }
    
    public function sendDocSunaht() {
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($this->_form->_key);
        
        echo json_encode($this->_enviaDunat($company,$head));
    }
    
    private function _enviaDunat($company,$head){
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
        
        $this->_form->_key = $head['id_baja'];
        $this->_form->_estado = (@$rsp->respuesta == 'OK') ? '1' : '0';
        $this->_form->_code = @$rsp->cod_sunat;
        $this->_form->_descripcionSunat = @$rsp->msj_sunat.'. '.@$rsp->resp_envio_doc.'. '.@$rsp->resp_consulta_ticket;
        $this->_form->_file = @$rsp->file;
        $this->_form->_hcdr = @$rsp->hash_cdr;
        $this->_form->_hcpe = @$rsp->hash_cpe;
        
        $this->qUdpdateRespuestaSunat();
        
        $result = [
            'message' => $this->_form->_descripcionSunat,
            'response' => @$rsp->respuesta,
            'name_file_sunat' => @$rsp->file,
            'numero_documento' => $head['numero_baja'],
            'ruc' => $company['ruc'],
            'id_baja' => $head['id_baja']
        ];
        return $result;
    }


    public function getPDF() {
//        echo json_encode($this->qRespuestaSunat());
        $company = $this->qCompany();
        $head = $this->qHeadDocumento($this->_form->_key);
        
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
        $html = str_replace("{NUM_DOC_AFEC}", $head['serie'].'-'.$head['numero_documento'], $html);
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

    public function getXML() {
        echo json_encode($this->qRespuestaSunat());
    }

}
