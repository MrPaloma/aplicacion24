<?php
namespace Libs;

require_once (ROOT . 'libs' . DS . 'Sunat' . DS . 'src' . DS . 'obj.php');
require_once (ROOT . 'libs' . DS . 'Sunat' . DS . 'src' . DS . 'curl.php');
require_once (ROOT . 'libs' . DS . 'Sunat' . DS . 'src' . DS . 'sunat.php');

class Sunat extends \Sunat\Sunat{
    
    public function __construct() {
        parent::__construct();
        return $this;
    }
}
