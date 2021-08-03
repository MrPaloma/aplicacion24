<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:57 
* Descripcion : CategoriaController.php
* ---------------------------------------
*/ 

namespace Facturacion\Categoria\Controllers;
   
use \Vendor\Controller;
use \Facturacion\Categoria\Filters\CategoriaFilter;

class CategoriaController extends \Facturacion\Categoria\Models\CategoriaModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use CategoriaFilter {
        CategoriaFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del CategoriaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del CategoriaFilter */
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
    
    public function findCategoria() {
        echo json_encode($this->qFindCategoria());
    }
    
}