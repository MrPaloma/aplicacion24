<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        19-09-2018 06:09:26 
* Descripcion : ProveedorController.php
* ---------------------------------------
*/ 

namespace Facturacion\Proveedor\Controllers;
   
use \Vendor\Controller;
use \Facturacion\Proveedor\Filters\ProveedorFilter;

class ProveedorController extends \Facturacion\Proveedor\Models\ProveedorModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use ProveedorFilter {
        ProveedorFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del ProveedorModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del ProveedorFilter */
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
    
    public function findProveedor() {
        echo json_encode($this->qFindProveedor());
    }
    
    public function extraerDahtaEsSalud() {
        echo Obj()->Libs->EsSalud->search($this->_form->_numDoc)->json();
    }
    
    public function extraerDahtaSunaht() {
        echo Obj()->Libs->Sunat->search($this->_form->_numDoc)->json();
    }
    
}