<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        30-12-2018 01:12:26 
* Descripcion : TransportistaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Transportista\Filters;
   
use \Vendor\ValidaForm;

trait TransportistaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}