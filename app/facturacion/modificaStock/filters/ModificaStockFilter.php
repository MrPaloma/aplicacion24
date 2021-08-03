<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Adm  
* Fecha:        30-01-2019 06:01:17 
* Descripcion : ModificaStockFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\ModificaStock\Filters;
   
use \Vendor\ValidaForm;

trait ModificaStockFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}