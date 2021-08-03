<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        21-09-2018 05:09:33 
* Descripcion : CuentaCobrarFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\CuentaCobrar\Filters;
   
use \Vendor\ValidaForm;

trait CuentaCobrarFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}