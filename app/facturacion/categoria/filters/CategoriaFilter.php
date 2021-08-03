<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:57 
* Descripcion : CategoriaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Categoria\Filters;
   
use \Vendor\ValidaForm;

trait CategoriaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}