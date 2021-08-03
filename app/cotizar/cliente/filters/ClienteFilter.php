<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        23-11-2018 04:11:07 
* Descripcion : ClienteFilter.php
* ---------------------------------------
*/ 

namespace Cotizar\Cliente\Filters;
   
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