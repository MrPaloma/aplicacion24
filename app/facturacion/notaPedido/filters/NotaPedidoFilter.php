<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        25-09-2018 06:09:53 
* Descripcion : NotaPedidoFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\NotaPedido\Filters;
   
use \Vendor\ValidaForm;

trait NotaPedidoFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}