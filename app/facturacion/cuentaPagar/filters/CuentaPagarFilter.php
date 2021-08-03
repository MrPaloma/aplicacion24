<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        21-09-2018 05:09:23 
* Descripcion : CuentaPagarFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\CuentaPagar\Filters;
   
use \Vendor\ValidaForm;

trait CuentaPagarFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}