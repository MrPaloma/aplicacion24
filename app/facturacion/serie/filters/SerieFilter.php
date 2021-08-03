<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:32 
* Descripcion : SerieFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Serie\Filters;
   
use \Vendor\ValidaForm;

trait SerieFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}