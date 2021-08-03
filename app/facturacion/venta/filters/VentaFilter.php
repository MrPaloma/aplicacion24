<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        12-09-2018 20:09:30 
* Descripcion : VentaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Venta\Filters;
   
use \Vendor\ValidaForm;

trait VentaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}