<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Adm  
* Fecha:        01-02-2019 06:02:44 
* Descripcion : CajaChicaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\CajaChica\Filters;
   
use \Vendor\ValidaForm;

trait CajaChicaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}