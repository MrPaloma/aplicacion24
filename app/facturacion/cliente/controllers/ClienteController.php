<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        12-09-2018 17:09:36 
* Descripcion : ClienteController.php
* ---------------------------------------
*/ 

namespace Facturacion\Cliente\Controllers;
   
use \Vendor\Controller;
use \Facturacion\Cliente\Filters\ClienteFilter;

class ClienteController extends \Facturacion\Cliente\Models\ClienteModel {
    
    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use ClienteFilter {
        ClienteFilter::__construct as private __fConstruct;
    }
    
    public function __construct() {
        parent::__construct();  /* constructor del ClienteModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del ClienteFilter */
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
    
    public function findCliente() {
        echo json_encode($this->qFindEntidad());
    }
    
    public function extraerDahtaEsSalud() {
//        $url = 'http://aplicaciones007.jne.gob.pe/srop_publico/Consulta/Afiliado/GetNombresCiudadano?DNI=' . $this->_form->_numDoc;
//        $data = file_get_contents($url);
//        echo $data;
        echo Obj()->Libs->EsSalud->search($this->_form->_numDoc)->json();
    }
    
    public function extraerDahtaSunaht() {
        echo Obj()->Libs->Sunat->search($this->_form->_numDoc)->json();
    }
    
}