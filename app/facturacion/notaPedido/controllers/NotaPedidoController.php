<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        25-09-2018 06:09:53 
* Descripcion : NotaPedidoController.php
* ---------------------------------------
*/ 

namespace Facturacion\NotaPedido\Controllers;
   
use \Vendor\Controller;
use \Facturacion\NotaPedido\Filters\NotaPedidoFilter;

class NotaPedidoController extends \Facturacion\NotaPedido\Models\NotaPedidoModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use NotaPedidoFilter {
        NotaPedidoFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del NotaPedidoModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del NotaPedidoFilter */
    }
    
    public function index() {}
    
    public function getProducto() {
        echo json_encode($this->qGetProducto());
    }
    
    public function post() {
        echo json_encode($this->spMantenimiento());
    }
    
}