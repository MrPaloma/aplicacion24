<?php
/**
 * Description of ValidaForm
 *
 * @author DAVID
 */
namespace Vendor;

use \Libs\Validate;

trait ValidaForm {
    
    private $_obj;

    public function __construct(){
        $this->_obj = new Validate();
    }
    
    public function valida() {
        return $this->_obj;
    }
    
}
