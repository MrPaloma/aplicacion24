<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 20:09:46 
 * Descripcion : CompraController.php
 * ---------------------------------------
 */

namespace Facturacion\Compra\Controllers;

use \Vendor\Controller;
use \Facturacion\Compra\Filters\CompraFilter;
use \Dompdf\Dompdf;
use ZipArchive;

class CompraController extends \Facturacion\Compra\Models\CompraModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use CompraFilter {
        CompraFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del CompraModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del CompraFilter */
    }

    public function index() {
        
    }
    
    public function getChekOpenCaja() {
        echo json_encode($this->qChekOpenCaja());
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }

    public function getProducto() {
        echo json_encode($this->qGetProducto());
    }

    public function getUltimasCompras() {
      echo json_encode($this->qGetUltimasCompras());
    }

    public function postCompra() {
        echo json_encode($this->spMantenimiento());
    }
    
    public function getPDF() {
      $head = $this->qDocCompraHead();
      $detail = $this->qDocCompraDetail();

      $DomPDF = new DOMPDF();

      //$DomPDF->set_paper('letter', 'landscape');

      $file = ROOT . "files" . DS . "temp" . DS . "tmpCompra".$head['id_compra'].".pdf";
      Obj()->Vendor->Tools->deleteFile($file);
      
      $productos = '';
      foreach ($detail as $value) {
          $productos .= '
          <tr class="border_top"> 
            <td style="text-align:center">'.$value['catalogo'].'</td>
            <td style="text-align:right">'.$value['cantidad'].'</td>
            <td style="text-align:right">'.$value['precio_unitario'].'</td>
            <td style="text-align:right">'.$value['sub_total'].'</td>
            <td style="text-align:center">'.$value['total'].'</td>
          </tr>
          ';
      }
      
      if ($head['codigo'] == 'PEN') {
        $contenidoPDF = '
        <style>
            .tabla_borde {border: 1px solid #666;border-radius: 10px }tr.border_bottom td {border-bottom: 1px solid #000 }tr.border_top td {border-top: 1px solid #666 }td.border_right {border-right: 1px solid #666 }.table-valores-totales tbody>tr>td {border: 0 }.table-valores-totales>tbody>tr>td:first-child {text-align: right }.table-valores-totales>tbody>tr>td:last-child {border-bottom: 1px solid #666;text-align: right;width: 30% }hr, img {border: 0 }table td {font-size: 12px }table {border-spacing: 0;border-collapse: collapse }@media print {blockquote, img, tr {page-break-inside: avoid }*, :after, :before {color: #000!important;text-shadow: none!important;background: 0 0!important;-webkit-box-shadow: none!important;box-shadow: none!important }a, a:visited {text-decoration: underline }a[href]:after {content: " (" attr(href) ")" }blockquote {border: 1px solid #999 }img {max-width: 100%!important }p {orphans: 3;widows: 3 }.table {border-collapse: collapse!important }.table td {background-color: #fff!important }}body {line-height: 1.42857143;font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;font-size: 13px;color: #676a6c;overflow-x: hidden }.table>tbody>tr>td {vertical-align: top;border-top: 1px solid #e7eaec;line-height: 1.42857;padding: 8px }.table-valores-totales tbody>tr>td {border-top: 0 none!important }
        </style>
        <table width="100%" border="0" cellspacing="5" cellpadding="0">
            <tr>
              <td style="width:60%">&nbsp;</td>
              <td>
                <div class="tabla_borde">
                    <table width="100%" border="0" cellspacing="0" cellpadding="5">
                    <tr>
                      <td style="text-align:center">'.$head['tipo_comprobante'].'</td>
                    </tr>
                    <tr>
                      <td style="text-align:center">'.$head['serie'].'-'.$head['numero_documento'].'</td>
                    </tr>
                    <tr>
                      <td style="text-align:center">Fecha: '.$head['fecha_compra'].'</td>
                    </tr>
                    <tr>
                      <td style="text-align:center">'.$head['documento_identidad'].' '.$head['razon_social'].'</td>
                    </tr>
                    </table>
                </div>
                </td>
            </tr>
        </table>
        <hr>
        <div class="tabla_borde">
        <table width="100%" border="0" cellspacing="5" cellpadding="5">
            <tr>
              <td style="text-align:center">Producto</td>
              <td style="text-align:center">Cant.</td>
              <td style="text-align:center">Precio Unit.</td>
              <td style="text-align:center">Sub Total</td>
              <td style="text-align:center">Total</td>
            </tr>
            '.$productos.'
        </table>
        </div>
        <hr>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width:60%">&nbsp;</td>
              <td>
                <table width="100%" border="0" cellspacing="5" cellpadding="5" class="table table-valores-totales">
                  <tr class="border_bottom">
                    <td width="56%">Moneda</td>
                    <td width="44%" style="text-align:right">'.$head['tipo_moneda'].'</td>
                  </tr>
                    <tr class="border_bottom">
                      <td width="56%">Gravada</td>
                      <td width="44%" style="text-align:right">'.$head['total_gravada'].'</td>
                    </tr>
                    <tr class="border_bottom">
                      <td>IGV</td>
                      <td style="text-align:right">'.$head['total_igv'].'</td>
                    </tr class="border_bottom">
                    <tr class="border_bottom">
                      <td>Total</td>
                      <td style="text-align:right">'.$head['total_compra'].'</td>
                    </tr>
                </table>
              </td>
            </tr>
        </table>';
      } else {
        $total = $head['total_compra'] * $head['tipo_cambio'];
        $contenidoPDF = '
        <style>
            .tabla_borde {border: 1px solid #666;border-radius: 10px }tr.border_bottom td {border-bottom: 1px solid #000 }tr.border_top td {border-top: 1px solid #666 }td.border_right {border-right: 1px solid #666 }.table-valores-totales tbody>tr>td {border: 0 }.table-valores-totales>tbody>tr>td:first-child {text-align: right }.table-valores-totales>tbody>tr>td:last-child {border-bottom: 1px solid #666;text-align: right;width: 30% }hr, img {border: 0 }table td {font-size: 12px }table {border-spacing: 0;border-collapse: collapse }@media print {blockquote, img, tr {page-break-inside: avoid }*, :after, :before {color: #000!important;text-shadow: none!important;background: 0 0!important;-webkit-box-shadow: none!important;box-shadow: none!important }a, a:visited {text-decoration: underline }a[href]:after {content: " (" attr(href) ")" }blockquote {border: 1px solid #999 }img {max-width: 100%!important }p {orphans: 3;widows: 3 }.table {border-collapse: collapse!important }.table td {background-color: #fff!important }}body {line-height: 1.42857143;font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;font-size: 13px;color: #676a6c;overflow-x: hidden }.table>tbody>tr>td {vertical-align: top;border-top: 1px solid #e7eaec;line-height: 1.42857;padding: 8px }.table-valores-totales tbody>tr>td {border-top: 0 none!important }
        </style>
        <table width="100%" border="0" cellspacing="5" cellpadding="0">
            <tr>
              <td style="width:60%">&nbsp;</td>
              <td>
                <div class="tabla_borde">
                    <table width="100%" border="0" cellspacing="0" cellpadding="5">
                    <tr>
                      <td style="text-align:center">'.$head['tipo_comprobante'].'</td>
                    </tr>
                    <tr>
                      <td style="text-align:center">'.$head['serie'].'-'.$head['numero_documento'].'</td>
                    </tr>
                    <tr>
                      <td style="text-align:center">Fecha: '.$head['fecha_compra'].'</td>
                    </tr>
                    <tr>
                      <td style="text-align:center">'.$head['documento_identidad'].' '.$head['razon_social'].'</td>
                    </tr>
                    </table>
                </div>
                </td>
            </tr>
        </table>
        <hr>
        <div class="tabla_borde">
        <table width="100%" border="0" cellspacing="5" cellpadding="5">
            <tr>
              <td style="text-align:center">Producto</td>
              <td style="text-align:center">Cant.</td>
              <td style="text-align:center">Precio Unit.</td>
              <td style="text-align:center">Sub Total</td>
              <td style="text-align:center">Total</td>
            </tr>
            '.$productos.'
        </table>
        </div>
        <hr>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width:60%">&nbsp;</td>
              <td>
                <table width="100%" border="0" cellspacing="5" cellpadding="5" class="table table-valores-totales">
                <tr class="border_bottom">
                  <td width="56%">Moneda</td>
                  <td width="44%" style="text-align:right">'.$head['tipo_moneda'].'</td>
                </tr>
                  <tr class="border_bottom">
                      <td width="56%">Gravada</td>
                      <td width="44%" style="text-align:right">'.$head['simbolo'].$head['total_gravada'].'</td>
                    </tr>
                    <tr class="border_bottom">
                      <td>IGV</td>
                      <td style="text-align:right">'.$head['simbolo'].$head['total_igv'].'</td>
                    </tr class="border_bottom">
                    <tr class="border_bottom">
                      <td>Total</td>
                      <td style="text-align:right">'.$head['simbolo'].$head['total_compra'].'</td>
                    </tr>
                    <tr class="border_bottom">
                      <td width="56%">Tipo Cambio en soles</td>
                      <td width="44%" style="text-align:right">S/.'.$head['tipo_cambio'].'</td>
                    </tr> 
                    <tr class="border_bottom">
                      <td>Total en soles</td>
                      <td style="text-align:right">S/.'.round($total, 2).'</td>
                    </tr>
                </table>
              </td>
            </tr>
        </table>';
      }

      $DomPDF->load_html($contenidoPDF);

      $DomPDF->render();
      $pdf = $DomPDF->output();
      file_put_contents($file, $pdf);

      if (is_readable($file)) {
          echo json_encode(['result' => 1, 'file' => BASE_URL.'files/temp/tmpCompra'.$head['id_compra'].'.pdf']);
      } else {
          echo json_encode(['result' => 2]);
      }
    }

    // funciones para el modal editar compra


    public function postEdit() {
      $this->recuperar();
      $this->borrark();
      $this->borrarc();
      if(file_exists("./././files/temp/tmpCompra".$this->_form->_key.".pdf")) {
        unlink("./././files/temp/tmpCompra".$this->_form->_key.".pdf");
      }
      echo json_encode($this->spMantenimientoe());

    }

    public function findCompra() {
      echo json_encode($this->qFindCompra());
    }
}
