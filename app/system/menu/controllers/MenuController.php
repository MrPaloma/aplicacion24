<?php

/**
 * Description of InitController
 *
 * @author DC
 */

namespace System\Menu\Controllers;

use \Vendor\Controller;
use System\Menu\Filters\MenuFilter;

class MenuController extends \System\Menu\Models\MenuModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use MenuFilter {
        MenuFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del MenuModel */
        $this->__cConstruct();  /* constructor del System\Menu\Controllers */
        $this->__fConstruct();  /* constructor del MenuFilter */
    }

    public function index() {}

    public function getMenu() {
        echo json_encode($this->qMenu());
    }
    
    public function findMenu() {
        echo json_encode($this->qFindMenu());
    }
    
    public function postOrdenarMenu() {
        echo json_encode($this->ordenar());
    }
    
    public function postNewMenu() {
        if ($this->isValidate()) {
            $data = $this->mantenimiento();
        } else {
            $data = $this->valida()->messages();
        }
        echo json_encode($data);
    }
    
    public function postEditMenu() {
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
