<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        13-10-2018 05:10:03 
* Descripcion : MarcaController.php
* ---------------------------------------
*/ 

namespace Facturacion\Marca\Controllers;
   
use \Vendor\Controller;
use \Facturacion\Marca\Filters\MarcaFilter;

class MarcaController extends \Facturacion\Marca\Models\MarcaModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use MarcaFilter {
        MarcaFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del MarcaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del MarcaFilter */
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
    
    public function findMarca() {
        echo json_encode($this->qFindMarca());
    }
    
}