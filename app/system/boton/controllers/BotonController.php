<?php

/**
 *
 * @author DC
 */

namespace System\Boton\Controllers;

use \Vendor\Controller;
use System\Boton\Filters\BotonFilter;

class BotonController extends \System\Boton\Models\BotonModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use BotonFilter {
        BotonFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del BotonModel */
        $this->__cConstruct();  /* constructor del System\Boton\Controllers */
        $this->__fConstruct();  /* constructor del BotonFilter */
    }

    public function index() {
        
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }

    public function findBoton() {
        echo json_encode($this->qFindBoton());
    }

    public function postNew() {
        if ($this->isValidate()) {
            $data = $this->mantenimiento();
        } else {
            $data = $this->valida()->messages();
        }
        echo json_encode($data);
    }

    public function postEdit() {
        if ($this->isValidate()) {
            $data = $this->mantenimiento();
        } else {
            $data = $this->valida()->messages();
        }
        echo json_encode($data);
    }

    public function postDelete() {
        echo json_encode($this->mantenimiento());
    }

}
