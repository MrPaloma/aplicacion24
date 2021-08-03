<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        26-09-2018 19:09:26 
* Descripcion : KardexProductoFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\KardexProducto\Filters;
   
use \Vendor\ValidaForm;

trait KardexProductoFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}