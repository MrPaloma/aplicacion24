<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        24-09-2018 06:09:51 
* Descripcion : ReporteVentaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\ReporteVenta\Filters;
   
use \Vendor\ValidaForm;

trait ReporteVentaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}