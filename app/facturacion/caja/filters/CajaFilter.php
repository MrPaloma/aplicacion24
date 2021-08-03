<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        29-11-2018 07:11:20 
* Descripcion : CajaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Caja\Filters;
   
use \Vendor\ValidaForm;

trait CajaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}