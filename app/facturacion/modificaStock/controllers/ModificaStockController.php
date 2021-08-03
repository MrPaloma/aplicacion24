<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Adm  
* Fecha:        30-01-2019 06:01:17 
* Descripcion : ModificaStockController.php
* ---------------------------------------
*/ 

namespace Facturacion\ModificaStock\Controllers;
   
use \Vendor\Controller;
use \Facturacion\ModificaStock\Filters\ModificaStockFilter;

class ModificaStockController extends \Facturacion\ModificaStock\Models\ModificaStockModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use ModificaStockFilter {
        ModificaStockFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del ModificaStockModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del ModificaStockFilter */
    }
    
    public function index() {}
    
    public function grid() {
        echo json_encode($this->spGrid());
    }
    
    public function getProducto() {
        echo json_encode($this->qGetProducto());
    }
    
    public function postModicacion() {
        echo json_encode($this->spMantenimiento());
    }
    
    public function postDelete() {
        echo json_encode($this->spMantenimiento());
    }
    
    public function postReset() {
        echo json_encode($this->volver_cero());
    }
    
    //preview update
    public function getDetalle() {
        echo json_encode($this->qDetalle());
    }
}