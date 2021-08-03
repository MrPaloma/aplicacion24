<?php

namespace Vendor;

use Exception;
use Vendor\Obj;

final class Bootstrap {

    public function startApp() {
        $module = Obj()->Vendor->Request->getModule();
        $controller = Obj()->Vendor->Request->getController();
        $method = Obj()->Vendor->Request->getMethod();
        $args = Obj()->Vendor->Request->getArgs();
        $token = Obj()->Vendor->Request->getToken();

        $refresh = 0;
        if ($method == DEFAULT_METHOD && $module == DEFAULT_MODULE) {
            $refresh = 1;
        }
        /*
         * valida cuando se pretende ingresar a algun metodo a traves de un link de manera directa
         */
        if (($token != Obj()->Vendor->Session->get('app_token') || empty($token)) && $refresh == 0) {
//            if($refresh){
//                Obj()->Vendor->View->render('error404', false);
//            }else{
                throw new Exception('Error de acceso.');
//            }
        } else {
            $controllerFile = ucfirst($controller) . 'Controller';
            $filterFile = ucfirst($controller) . 'Filter';
            $modelFile = ucfirst($controller) . 'Model';

            $namespace = '\\' . ucfirst($module) . '\\' . ucfirst($controller) . '\\Controllers\\' . $controllerFile;    #namespace del controlador

            $urlController = ROOT . DEFAULT_APP_FOLDER . DS . $module . DS . $controller . DS . 'controllers' . DS . $controllerFile . '.php';
            $urlFilter = ROOT . DEFAULT_APP_FOLDER . DS . $module . DS . $controller . DS . 'filters' . DS . $filterFile . '.php';
            $urlModel = ROOT . DEFAULT_APP_FOLDER . DS . $module . DS . $controller . DS . 'models' . DS . $modelFile . '.php';

            /* cargando trait filter q contiene validacion de formulario */
            if (is_readable($urlFilter)) {
                require_once ($urlFilter);
            }
            /* cargando el modelo */
            if (is_readable($urlModel)) {
                require_once ($urlModel);
            }

            if (is_readable($urlController)) {
                require_once ($urlController);
                /*
                 * Se registra la clase, como identificador de la clase se envia $controller, 
                 * el cual no contiene la palabra Controller, esto es para que al momento de llamarla
                 * a traves de Obj() no se haga muy extenso el codigo
                 */
                Obj()->Vendor->Registry->addClass(ucfirst($controller), $namespace); #registro de clase

                /*
                 * Se crea el namespace dentro de Obj()
                 */
                $NMP = ucfirst($module);
                if (!is_callable(Obj()->$NMP)) {
                    eval('
                        use Vendor\Obj;
                        Obj()->' . $NMP . ' = function(){
                        return Obj::run("' . $NMP . '");
                    };');
                }

                /* se verifica si el metodo existe en el controller */
                $nmp = ucfirst($controller);
                if (!is_callable([Obj()->$NMP->$nmp, $method])) {
                    throw new Exception('Error de Controlador Metodo: <b>' . $method . '</b> no encontrado. ' . $urlController);
                }

                /* si se envia parametros se ejecuta el metodo y se los envia */
                if (isset($args)) {
                    call_user_func_array([Obj()->$NMP->$nmp, $method], $args);
                } else {
                    /* si no tiene parametros solo se ejecuta el metodo */
                    call_user_func([Obj()->$NMP->$nmp, $method]);
                }
            } else {
                throw new Exception('Error de Controlador: <b>' . $urlController . '</b> no encontrado. Bootstrap.php: linea 35');
            }
        }
    }

}
