<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        13-10-2018 05:10:03 
* Descripcion : MarcaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Marca\Filters;
   
use \Vendor\ValidaForm;

trait MarcaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}