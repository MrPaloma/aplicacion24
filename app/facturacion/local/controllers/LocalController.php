<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 18:09:43 
 * Descripcion : LocalController.php
 * ---------------------------------------
 */

namespace Facturacion\Local\Controllers;

use \Vendor\Controller;
use \Facturacion\Local\Filters\LocalFilter;

class LocalController extends \Facturacion\Local\Models\LocalModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use LocalFilter {
        LocalFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del LocalModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del LocalFilter */
    }

    public function index() {
        
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }

    public function gridProductos() {
        echo json_encode($this->spGridProductos());
    }

    public function gridListaProductos() {
        echo json_encode($this->spGridListaProductos());
    }

    public function postNew() {
        echo json_encode($this->mantenimiento());
    }

    public function postEdit() {
        echo json_encode($this->mantenimiento());
    }

    public function postDelete() {
        echo json_encode($this->mantenimiento());
    }

    public function postDeleteProducto() {
        echo json_encode($this->spMantenimientoProductos());
    }

    public function findLocal() {
        echo json_encode($this->qFindLocal());
    }

    public function postProductos() {
        echo json_encode($this->spMantenimientoProductos());
    }
    
    public function postAllProductos() {
        echo json_encode($this->spMantenimientoProductos());
    }
    
    public function postAllGanancia() {
        echo json_encode($this->qMantenimientoGananciaProductos());
    }

    public function postDataProducto() {
        $rs = 0;
        switch ($this->_form->_type) {
            case '_PCR_'://PRECIO COMPRA REAL
                $rs = ($this->spUpdateProductoPCR() == 1)?1:0;
                break;
            case '_PC_'://PRECIO COMPRA
                $rs = ($this->spUpdateProductoPC() == 1)?1:0;
                break;
            case '_PGPUB_'://PORCANTAJE GANANCIA MAXIMA
                $rs = ($this->spUpdateProductoPGPUB() == 1)?1:0;
                break;
            case '_PGFER_'://PORCANTAJE GANANCIA MINIMA
                $rs = ($this->spUpdateProductoPGFER() == 1)?1:0;
                break;
            case '_PGDIS_'://PORCANTAJE GANANCIA MINIMA
                $rs = ($this->spUpdateProductoPGDIS() == 1)?1:0;
                break;
            case '_PVPUB_'://PORCANTAJE GANANCIA MAXIMA
                $rs = ($this->spUpdateProductoPVPUB() == 1)?1:0;
                break;
            case '_PVFER_'://PORCANTAJE GANANCIA MINIMA
                $rs = ($this->spUpdateProductoPVFER() == 1)?1:0;
                break;
            case '_PVDIS_'://PORCANTAJE GANANCIA MINIMA
                $rs = ($this->spUpdateProductoPVDIS() == 1)?1:0;
                break;
            case '_SM_'://STOCK MINIMO
                $rs = ($this->spUpdateProducto('stock_minimo') == 1)?1:0;
                break;
            case '_SA_'://STOCK ACTUAL
                $rs = ($this->spUpdateProducto('stock_actual') == 1)?1:0;
                break;
        }
        echo json_encode(['ok_error' => $rs]);
    }

    public function getCajas() {
        echo json_encode($this->qGetCajas());
    }
    
    public function postAddCaja() {
        $rs = $this->spMantenimientoCajas();
        $data = [
            'mensaje' => $rs['mensaje'],
            'ok_error' => $rs['ok_error'],
            'cajas' => $this->qGetCajas()
        ];

        echo json_encode($data);
    }
    
    public function postRemoveCaja() {
        $rs = $this->spMantenimientoCajas();
        $data = [
            'mensaje' => $rs['mensaje'],
            'ok_error' => $rs['ok_error'],
            'cajas' => $this->qGetCajas()
        ];

        echo json_encode($data);
    }
    
}
