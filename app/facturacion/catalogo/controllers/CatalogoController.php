<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:25 
* Descripcion : CatalogoController.php
* ---------------------------------------
*/ 

namespace Facturacion\Catalogo\Controllers;
   
use \Vendor\Controller;
use \Facturacion\Catalogo\Filters\CatalogoFilter;

class CatalogoController extends \Facturacion\Catalogo\Models\CatalogoModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use CatalogoFilter {
        CatalogoFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del CatalogoModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del CatalogoFilter */
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
    
    public function findCatalogo() {
        echo json_encode($this->qFindCatalogo());
    }
    
}