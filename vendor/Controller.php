<?php

namespace Vendor;

use Exception;

trait Controller {
    
    public function __construct() {
        $e = new Exception();
        $trace = $e->getTrace();
        $last_call = $trace[1]; /* trae datos de clase donde se ejecuta parent::__construct(); -- de \Controller */

        $clase = explode('\\', $last_call['class']);

        $module = array_shift($clase);
        $controller = array_shift($clase);

        /* verificar si CLASS esta siendo instanciada por otros medios */
        if (Obj()->Vendor->Registry->exists(ucfirst($module), $controller)) {
            throw new Exception('Error: Clase <b>' . $controller . '</b> ya se instancio.');
        }
    }
    
    /*
     * A cada clase hija se le obliga a tener un metodo index()
     */

    abstract public function index();
    
    /*
     * Carga un controldor, facilita el uso de la instancia del controlador
     * $this->import(["admision" => "FaseAdmision"]);
     */

    final protected function import($obj) {
        foreach ($obj as $key => $value) {
            $module = $key;
            $controller = $value;
        }
        $filter = ucfirst($controller) . 'Filter';
        $nameController = ucfirst($controller);

        $url = ROOT . DEFAULT_APP_FOLDER . DS . strtolower($module) . DS . 'controllers' . DS . $nameController . 'Controller.php';
        $urlFilter = ROOT . DEFAULT_APP_FOLDER . DS . $module . DS . 'filters' . DS . $filter . '.php';
        $urlModel = ROOT . DEFAULT_APP_FOLDER . DS . $module . DS . 'models' . DS . $nameController . 'Model.php';

        /* cargando trait filter q contiene validacion de formulario */
        if (is_readable($urlFilter)) {
            require_once ($urlFilter);
        }
        
        /*cargando el modelo*/
        if (is_readable($urlModel)) {
            require_once ($urlModel);
        }
        
        if (is_readable($url)) {
            require_once $url;
            $class = '\\' . ucfirst($module) . '\\Controllers\\' . $nameController . 'Controller';    #clase con namespace

            Obj()->Vendor->Registry->addClass($nameController . 'Controller', $class);
            
            
            /* el namespace */
            $MMDD = ucfirst($module);

            /* se crea objeto por el cual se accedera a sus clases */
            if(!is_callable(Obj()->$MMDD)) {
                eval('
                    use Vendor\Obj;
                    Obj()->' . $MMDD . ' = function(){
                    return Obj::run("' . $MMDD . '");
                };');
            }
            
        } else {
            throw new Exception('Error: Controlador <b>' . $url . '</b> no encontrado');
        }
    }
    
}
