<?php

namespace Vendor;

use Exception;

final class View {

    private $_module;
    private $_controller;

    public function render($vista = '', $ajax = true) {

        $rutaLayout = [
            'img' => BASE_URL . 'public/theme/' . DEFAULT_LAYOUT . '/img/',
            'css' => BASE_URL . 'public/theme/' . DEFAULT_LAYOUT . '/css/',
            'js' => BASE_URL . 'public/theme/' . DEFAULT_LAYOUT . '/js/'
        ];

        /* detectar en que metodo se ejecuta render(); */
        $e = new Exception();
        $trace = $e->getTrace();
        $last_call = $trace[1]; /* trae datos de clase donde se ejecuta Obj()->Vendor->View->render() */

        $this->_setRoot($last_call);

        if (empty($vista)) {
            $vista = $last_call['function']; #si no se envia $vista, se toma el metodo donde se ejecuta Obj()->Vendor->View->render()
        }

        $urlVista = ROOT . DEFAULT_APP_FOLDER . DS . $this->_module . DS . strtolower($this->_controller) . DS . 'views' . DS . $vista . '.phtml';

        if (is_readable($urlVista)) {
            if ($ajax) {
                /* cuando peticion es via ajax no se necesita el header y el footer */
                require_once ($urlVista);
            } else {
                require_once (ROOT . 'public' . DS . 'theme' . DS . DEFAULT_LAYOUT . DS . 'header.phtml');
                require_once ($urlVista);
                require_once (ROOT . 'public' . DS . 'theme' . DS . DEFAULT_LAYOUT . DS . 'footer.phtml');
            }
        } else {
            throw new Exception('Error: Vista <b>' . $urlVista . '</b> no encontrada .');
        }
    }

    private function _setRoot($last_call) {
        $clase = explode('\\', $last_call['class']);

        $this->_module = strtolower(array_shift($clase));
        $this->_controller = array_shift($clase);
    }

}
