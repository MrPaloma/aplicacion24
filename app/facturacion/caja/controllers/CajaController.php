<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        29-11-2018 07:11:19 
* Descripcion : CajaController.php
* ---------------------------------------
*/ 

namespace Facturacion\Caja\Controllers;
   
use \Vendor\Controller;
use \Facturacion\Caja\Filters\CajaFilter;

class CajaController extends \Facturacion\Caja\Models\CajaModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use CajaFilter {
        CajaFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del CajaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del CajaFilter */
    }
    
    public function index() {}
    
    public function grid() {
        echo json_encode($this->spGrid());
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
    
    public function findCaja() {
        echo json_encode($this->qFindCaja());
    }
    
}