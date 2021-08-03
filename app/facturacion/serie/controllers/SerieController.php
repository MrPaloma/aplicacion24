<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:32 
* Descripcion : SerieController.php
* ---------------------------------------
*/ 

namespace Facturacion\Serie\Controllers;
   
use \Vendor\Controller;
use \Facturacion\Serie\Filters\SerieFilter;

class SerieController extends \Facturacion\Serie\Models\SerieModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use SerieFilter {
        SerieFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del SerieModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del SerieFilter */
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
    
    public function findSerie() {
        echo json_encode($this->qFindSerie());
    }
    
}