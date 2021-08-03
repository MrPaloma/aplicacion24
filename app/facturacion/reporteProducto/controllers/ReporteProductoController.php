<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        24-09-2018 06:09:02 
 * Descripcion : ReporteProductoController.php
 * ---------------------------------------
 */

namespace Facturacion\ReporteProducto\Controllers;

use \Vendor\Controller;
use \Facturacion\ReporteProducto\Filters\ReporteProductoFilter;

class ReporteProductoController extends \Facturacion\ReporteProducto\Models\ReporteProductoModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use ReporteProductoFilter {
        ReporteProductoFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del ReporteProductoModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del ReporteProductoFilter */
    }

    public function index() {
        
    }

    public function getProductosLocal() {
        $data = [
            'categorias' => $this->qCategoriaLocal(),
            'productos' => $this->qProductoCategoriaLocal()
        ];
        echo json_encode($data);
    }

}
