<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        12-09-2018 17:09:36 
* Descripcion : ClienteFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Cliente\Filters;
   
use \Vendor\ValidaForm;

trait ClienteFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}