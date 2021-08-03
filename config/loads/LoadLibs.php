<?php

/*autoload para las librerias*/
function autoloadLibs($class){
    $cad = explode('\\', $class);
    if(isset($cad[1])){
        $file = ROOT . 'libs' . DS . $cad[1] . DS . $cad[1].'.php';
        if(file_exists($file)){
            require_once ($file);
        }
    }
}

/*se registra la funcion autoload*/
spl_autoload_register('autoloadLibs');

