<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        19-09-2018 06:09:26 
* Descripcion : ProveedorFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\Proveedor\Filters;
   
use \Vendor\ValidaForm;

trait ProveedorFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}