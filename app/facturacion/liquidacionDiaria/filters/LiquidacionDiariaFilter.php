<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        02-12-2018 06:12:51 
* Descripcion : LiquidacionDiariaFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\LiquidacionDiaria\Filters;
   
use \Vendor\ValidaForm;

trait LiquidacionDiariaFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}