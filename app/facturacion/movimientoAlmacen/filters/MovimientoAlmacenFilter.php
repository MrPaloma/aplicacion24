<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super  User  
* Fecha:        07-02-2019 16:02:26 
* Descripcion : MovimientoAlmacenFilter.php
* ---------------------------------------
*/ 

namespace Facturacion\MovimientoAlmacen\Filters;
   
use \Vendor\ValidaForm;

trait MovimientoAlmacenFilter {
    
    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }
    
}