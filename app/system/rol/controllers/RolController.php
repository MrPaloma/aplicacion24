<?php

/**
 *
 * @author DC
 */

namespace System\Rol\Controllers;

use \Vendor\Controller;
use System\Rol\Filters\RolFilter;

class RolController extends \System\Rol\Models\RolModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use RolFilter {
        RolFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del RolModel */
        $this->__cConstruct();  /* constructor del System\Rol\Controllers */
        $this->__fConstruct();  /* constructor del RolFilter */
    }

    public function index() {
        
    }

    public function grid() {        
        echo json_encode($this->spGrid());
    }

    public function findRol() {
        echo json_encode($this->qFindRol());
    }
    
    public function getAccess() {
        echo json_encode($this->qGetAccess());
    }
    
    public function getAccessPreview() {
        echo json_encode($this->qGetAccessPreview());
    }

    public function postNew() {
        if ($this->isValidate()) {
            $data = $this->spMantenimiento();
        } else {
            $data = $this->valida()->messages();
        }
        echo json_encode($data);
    }

    public function postEdit() {
        if ($this->isValidate()) {
            $data = $this->spMantenimiento();
        } else {
            $data = $this->valida()->messages();
        }
        echo json_encode($data);
    }

    public function postDelete() {
        echo json_encode($this->spMantenimiento());
    }
    
    public function postOpcion() {
        echo json_encode($this->spMantenimientoOpcion());
    }
    
    public function postEvent() {
        echo json_encode($this->spMantenimientoOpcionBoton());
    }
    
    public function postClonar() {
        echo json_encode($this->spClonar());
    }
    
    public function getEventsOpcion() {
        echo json_encode($this->qGetEventsOpcion());
    }

}
