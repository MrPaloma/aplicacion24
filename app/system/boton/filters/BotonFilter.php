<?php

namespace System\Boton\Filters;

use \Vendor\ValidaForm;

trait BotonFilter {

    private $_frm;

    use ValidaForm {
        ValidaForm::__construct as private __fvConstruct;
    }

    public function __construct() {
        $this->__fvConstruct();
        $this->_frm = Obj()->Vendor->Request->allForm()->post();
    }

    public function isValidate() {
        $this->valida()
            ->filter(["field" => "txt_descripcion", "label" => $this->_frm->descripcion])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "minlength:3"])
            ->filter(["field" => "txt_icono", "label" => $this->_frm->icono])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "minlength:3"])
            ->filter(["field" => "txt_css", "label" => $this->_frm->css])
                ->rule(["rule" => "required"])
                ->rule(["rule" => "minlength:3"])
            ->filter(["field" => "txt_alias", "label" => $this->_frm->alias])
                ->rule(["rule" => "minlength:3"])
                ->rule(["rule" => "maxlength:10"]);

        if ($this->valida()->isTrue()) {
            return true;
        }
        return false;
    }

}
