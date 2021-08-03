<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 17:09:53 
* Descripcion : NotaVentaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\NotaVenta\Filters;
   
use \Vendor\ValidaForm;

trait NotaVentaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}