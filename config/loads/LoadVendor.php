<?php

/*autolod para bin*/
function autoloadBin($class){
    $cad = explode('\\', $class);
    if(isset($cad[1])){
        $file = ROOT . 'vendor' . DS . $cad[1].'.php';
        if(file_exists($file)){
            require_once ($file);
        }
    }
}

/*se registra la funcion autoload*/
spl_autoload_register('autoloadBin'); 
