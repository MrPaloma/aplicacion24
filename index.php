<?php

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', realpath(dirname(__FILE__)) . DS);

require_once (ROOT . 'config' . DS . 'Config.php');
require_once (ROOT . 'config' . DS . 'Config.ini.php');

try {
    Obj()->Vendor->Session->init();
    if(empty(Obj()->Vendor->Session->get('app_token'))){
        Obj()->Vendor->Session->set('app_token',APP_TMP_TK);
    }
    Obj()->Vendor->Bootstrap->startApp();
} catch (Exception $exc) {
    echo $exc->getMessage();
}

//https://acuario.com.pe/modulos/logistica