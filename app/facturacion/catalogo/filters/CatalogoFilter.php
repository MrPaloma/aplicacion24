<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:25 
* Descripcion : CatalogoFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Catalogo\Filters;
   
use \Vendor\ValidaForm;

trait CatalogoFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}