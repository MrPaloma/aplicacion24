<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        26-09-2018 19:09:26 
 * Descripcion : KardexProductoController.php
 * ---------------------------------------
 */

namespace Facturacion\KardexProducto\Controllers;

use \Vendor\Controller;
use \Facturacion\KardexProducto\Filters\KardexProductoFilter;

class KardexProductoController extends \Facturacion\KardexProducto\Models\KardexProductoModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use KardexProductoFilter {
        KardexProductoFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del KardexProductoModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del KardexProductoFilter */
    }

    public function index() {
        
    }

    public function search() {
        $data = [
            'head' => $this->qHead(),
            'detail' => $this->qDetail()
        ];
        echo json_encode($data);
    }

}
