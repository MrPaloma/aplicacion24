<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        12-09-2018 20:09:46 
* Descripcion : CompraFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Compra\Filters;
   
use \Vendor\ValidaForm;

trait CompraFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}