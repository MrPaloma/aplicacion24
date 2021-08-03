<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Art  
 * Fecha:        23-11-2018 04:11:07 
 * Descripcion : ClienteController.php
 * ---------------------------------------
 */

namespace Cotizar\Cliente\Controllers;

use \Vendor\Controller;
use \Cotizar\Cliente\Filters\ClienteFilter;
use \Dompdf\Dompdf;

class ClienteController extends \Cotizar\Cliente\Models\ClienteModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use ClienteFilter {
        ClienteFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del ClienteModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del ClienteFilter */
    }

    public function index() {
        
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }

    public function getProducto() {
        echo json_encode($this->qGetProducto());
    }

    public function postNew() {
        $rs = $this->spMantenimiento();
        //generar documento para su impresion
        $pdf = $this->_pdf($rs['id_cotizacion']);

        $data = [
            'rs' => $rs,
            'doc' => $pdf
        ];
        echo json_encode($data);
    }

    public function postEdit() {
        echo json_encode($this->spMantenimiento());
    }

    public function postDelete() {
        echo json_encode($this->spMantenimiento());
    }

    public function find() {
        $data = [
            'head' => $this->qHead($this->_form->_key),
            'detail' => $this->qDetail($this->_form->_key)
        ];

        echo json_encode($data);
    }

    public function getPDF() {
        echo json_encode($this->_pdf($this->_form->_key));
    }

    public function postEmail() {
        $head = $this->qHead($this->_form->_key);

        $pdf = $this->_pdf($this->_form->_key);

        $body = file_get_contents('files' . DS . 'mails' . DS . 'mailCotizacion.phtml');

        $filePDF = $pdf['file'];

        /* reemplazando titulos */
        $body = str_replace("{NUMDOC}", $head['numero'], $body);
        $body = str_replace("{CLIENTE}", $head['razon_social'], $body);


        Obj()->Libs->PHPMailer->setFrom(MAIL_REMITENTE_APP, APP_COMPANY);
        Obj()->Libs->PHPMailer->Subject = 'Cotización N° ' . $head['numero'];
        Obj()->Libs->PHPMailer->CharSet = 'UTF-8';
        //contenido del correo
        Obj()->Libs->PHPMailer->msgHTML($body, ROOT);
        Obj()->Libs->PHPMailer->AltBody = 'Cotización N° ' . $head['numero'];

        Obj()->Libs->PHPMailer->addStringAttachment(file_get_contents($filePDF), $head['numero'] . '.pdf');

        Obj()->Libs->PHPMailer->addAddress($this->_form->txt_email, 'Cotización N° ' . $head['numero']);

        $dom = explode('@', $this->_form->txt_email);

        if (checkdnsrr($dom[1])) {
            Obj()->Libs->PHPMailer->send();
            echo json_encode(['result' => 1]);
        } else {
            echo json_encode(['result' => 2]);
        }
    }

    private function _pdf($id) {
        $company = $this->qCompany();
        $head = $this->qHead($id);
        $detail = $this->qDetail($id);
        $cuentasAll = $this->qCuentas();

        $DomPDF = new DOMPDF();
        $DomPDF->set_option('enable_remote', TRUE);
        $file = ROOT . "files" . DS . "temp" . DS . "tmpCoti".$id.".pdf";
        Obj()->Vendor->Tools->deleteFile($file);

        $productos = '';
        foreach ($detail as $value) {
            $productos .= '
            <tr class="detalletable"> 
              <td>' . $value['catalogo'] . '</td>
              <td style="text-align:right">' . $value['cantidad'] . '</td>
              <td style="text-align:right">' . $value['precio_unitario'] . '</td>
              <td class="ulttable" style="text-align:right">' . $value['total_unitario'] . '</td>
            </tr>';
        }
        $direccionCliente = '';
        
        $cuentas = '';
        foreach ($cuentasAll as $value) {
            $cuentas .= '
            <tr class="detalletable"> 
              <td style="text-align:center">' . $value['banco'] . '</td>
              <td style="text-align:center">' . $value['cuenta_banco'] . '</td>
            </tr>';
        }

        $html = file_get_contents(BASE_URL . 'files/template/comprobante/cotizacion.html');

        $html = str_replace("{BASE_URL}", BASE_URL, $html);
        $html = str_replace("{LOGO}", Obj()->Vendor->Session->get('app_logo'), $html);
        $html = str_replace("{R_SOCIAL_C}", $head['razon_social'], $html);
        $html = str_replace("{FECHA_EMISION}", $head['fecha'], $html);
        $html = str_replace("{TIPO_DOC_C}", $head['tipo_doc_identidad'], $html);
        $html = str_replace("{NUM_DOC}", $head['numero'], $html);
        $html = str_replace("{NUM_DOC_C}", $head['documento_identidad'], $html);
        $html = str_replace("{OBS}", $head['observaciones'], $html);
        $html = str_replace("{R_DIRECCION_C}", $direccionCliente, $html);
        $html = str_replace("{DETAIL}", $productos, $html);
        $html = str_replace("{TOTAL}", $head['total'], $html);
        $html = str_replace("{CUENTAS}", $cuentas, $html);
        
        $html = str_replace("{R_SOCIAL_E}", $company['razon_social'], $html);
        $html = str_replace("{R_DIRECCION_E}", $company['direccion'], $html);
        $html = str_replace("{R_TELEFONO_E}", $company['telefono'], $html);
        $html = str_replace("{R_EMAIL_E}", $company['email'], $html);
        $html = str_replace("{R_RUC_E}", $company['ruc'], $html);

        $DomPDF->load_html($html);


        $DomPDF->render();
        $pdf = $DomPDF->output();
        file_put_contents($file, $pdf);

        if (is_readable($file)) {
            return ['result' => 1, 'file' => BASE_URL . 'files/temp/tmpCoti'.$id.'.pdf'];
        } else {
            return ['result' => 2];
        }
    }

}
