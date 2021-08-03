<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        24-09-2018 06:09:02 
* Descripcion : ReporteProductoFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\ReporteProducto\Filters;
   
use \Vendor\ValidaForm;

trait ReporteProductoFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}