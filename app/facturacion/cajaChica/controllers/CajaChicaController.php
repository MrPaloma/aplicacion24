<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Adm  
* Fecha:        01-02-2019 06:02:44 
* Descripcion : CajaChicaController.php
* ---------------------------------------
*/ 

namespace Facturacion\CajaChica\Controllers;
   
use \Vendor\Controller;
use \Facturacion\CajaChica\Filters\CajaChicaFilter;

class CajaChicaController extends \Facturacion\CajaChica\Models\CajaChicaModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use CajaChicaFilter {
        CajaChicaFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del CajaChicaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del CajaChicaFilter */
    }
    
    public function index() {}
    
    public function getChekOpenCaja() {
        echo json_encode($this->qChekOpenCaja());
    }
    
    public function postIngreso() {
        echo json_encode($this->spMantenimientoi());
    }
    
    public function postEgreso() {
        echo json_encode($this->spMantenimientoe());
    }

    //egresos
    public function gride() {
        echo json_encode($this->spGride());
    }

    //ingresos
    public function gridi() {
        echo json_encode($this->spGridi());
    }
    
}