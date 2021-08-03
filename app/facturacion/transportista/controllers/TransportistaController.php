<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Art  
 * Fecha:        30-12-2018 01:12:26 
 * Descripcion : TransportistaController.php
 * ---------------------------------------
 */

namespace Facturacion\Transportista\Controllers;

use \Vendor\Controller;
use \Facturacion\Transportista\Filters\TransportistaFilter;

class TransportistaController extends \Facturacion\Transportista\Models\TransportistaModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use TransportistaFilter {
        TransportistaFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del TransportistaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del TransportistaFilter */
    }

    public function index() {
        
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }
    
    public function gridVehiculos() {
        echo json_encode($this->spGridVehiculos());
    }

    public function postNew() {
        echo json_encode($this->mantenimiento());
    }

    public function postNewVehiculo() {
        echo json_encode($this->mantenimientoVehiculo());
    }

    public function postEditVehiculo() {
        echo json_encode($this->mantenimientoVehiculo());
    }
    
    public function postEdit() {
        echo json_encode($this->mantenimiento());
    }

    public function postDelete() {
        echo json_encode($this->mantenimiento());
    }

    public function findTransporte() {
        echo json_encode($this->qTransporte());
    }
    
    public function findVehiculo() {
        echo json_encode($this->qVehiculo());
    }

}
