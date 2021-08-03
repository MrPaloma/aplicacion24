<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super  User  
* Fecha:        07-02-2019 16:02:26 
* Descripcion : MovimientoAlmacenController.php
* ---------------------------------------
*/ 

namespace Facturacion\MovimientoAlmacen\Controllers;
   
use \Vendor\Controller;
use \Facturacion\MovimientoAlmacen\Filters\MovimientoAlmacenFilter;

class MovimientoAlmacenController extends \Facturacion\MovimientoAlmacen\Models\MovimientoAlmacenModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use MovimientoAlmacenFilter {
        MovimientoAlmacenFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del MovimientoAlmacenModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del MovimientoAlmacenFilter */
    }
    
    public function index() {}
    
    public function grid() {
        echo json_encode($this->spGrid());
    }
    
    public function getProducto() {
        echo json_encode($this->qGetProducto());
    }
    
    public function postMovimiento() {
        echo json_encode($this->spMantenimiento());
    }
    
    public function getDetalle() {
        echo json_encode($this->qDetalle());
    }
    
}