<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        24-09-2018 06:09:51 
 * Descripcion : ReporteVentaController.php
 * ---------------------------------------
 */

namespace Facturacion\ReporteVenta\Controllers;

use \Vendor\Controller;
use \Facturacion\ReporteVenta\Filters\ReporteVentaFilter;

class ReporteVentaController extends \Facturacion\ReporteVenta\Models\ReporteVentaModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use ReporteVentaFilter {
        ReporteVentaFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del ReporteVentaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del ReporteVentaFilter */
    }

    public function index() {
        
    }

    public function searchVentaLocal() {
        echo json_encode($this->qVentasLocal());
    }

    public function getTotalesLocal() {
        $data = [
            'totales' => $this->qTotalesLocal(),
            'documentos' => $this->qDocumentosLocal(),
            'categorias_consolidado' => $this->qCategoriasLocal()
        ];
        echo json_encode($data);
    }

    public function getTotalesLocalDos() {
        $data = [
            'totales' => $this->qTotalesLocal(),
            'documentos' => $this->qDocumentosLocal(),
            'categorias_consolidado' => $this->qCategoriasLocal()
        ];
        echo json_encode($data);
    }

    public function searchVentaGeneral() {
        echo json_encode([
            'ventaGeneral' => $this->qVentasGeneral(),
            'ventasEfectivoPagado' => $this->qVentasEfectivoPagado(),
            'ventasEfectivoCredito' => $this->qVentasEfectivoCredito(),
            'cajaChica' => $this->qCajaChica(),
            'porCobrar' => $this->qPorCobrar(),
            'porPagar' => $this->qPorPagar()
        ]);
    }

}
