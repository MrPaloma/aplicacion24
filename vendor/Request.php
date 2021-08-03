<?php

namespace Vendor;

use stdClass;

class Request {

    private $_module;
    private $_controller;
    private $_method;
    private $_args;
    private $_objectForm;

    public function __construct() {
        if (isset($_GET['ruta'])) {
            $url = $_GET['ruta'];
            $url = array_filter(explode('/', $url));

            $this->_module = strtolower(array_shift($url));         #el nombre de la carpeta de los modulos deben estar en minusculas
            $this->_controller = array_shift($url);
            $this->_method = array_shift($url);
            $this->_args = $url;
        }

        if (!$this->_module) {
            $this->_module = DEFAULT_MODULE;
        }

        if (!$this->_controller) {
            $this->_controller = DEFAULT_CONTROLLER;
        }

        if (!$this->_method) {
            $this->_method = DEFAULT_METHOD;
        }

        if (!$this->_args) {
            $this->_args = [];
        }
    }

    public function getToken() {
        return Obj()->Libs->AesCtr->de(isset($this->allForm()->post()->_qn) ? $this->allForm()->post()->_qn : null);
    }

    public function getKeypassw() {
        return isset($this->allForm()->post()->_keypassw) ? $this->allForm()->post()->_keypassw : null;
    }

    public function getModule() {
        return $this->_module;
    }

    public function getController() {
        return $this->_controller;
    }

    public function getMethod() {
        return $this->_method;
    }

    public function getArgs() {
        return $this->_args;
    }

    public function allForm() {
        $this->_objectForm = new stdClass();                #objeto para almacenar elementos enviados mediante POST, GET, REQUEST, FILES
        return $this;
    }

    /* desencripta valores del formulario enviado */

    private function _decrypt($arrDecrypt, $key, $value) {
        /* si $arrDecrypt es vacio se desencripta todo el form */
        if (count($arrDecrypt) == 0) {
            $this->_objectForm->decrypt->$key = htmlspecialchars(trim(\Libs\Aes::de($value)), ENT_QUOTES);
        } else {
            /* si $arrDecrypt tiene contenido, se desencripta su contenido */
            $this->_objectForm->decrypt->$key = (in_array($key, $arrDecrypt)) ? htmlspecialchars(trim(\Libs\Aes::de($value)), ENT_QUOTES) : htmlspecialchars(trim($value), ENT_QUOTES);
        }
    }

    /* desencripta valores array del formulario enviado */

    private function _decryptArray($arrDecrypt, $array, $key) {
        $arr = [];
        foreach ($array as $k => $value) {
            /* si $arrDecrypt es vacio se desencripta todo el form */
            if (count($arrDecrypt) == 0) {
                $arr[] = htmlspecialchars(trim(\Libs\Aes::de($value)), ENT_QUOTES);
            } else {
                /* si $arrDecrypt tiene contenido, se desencripta su contenido */
                $arr[] = (in_array($key, $arrDecrypt)) ? htmlspecialchars(trim(\Libs\Aes::de($value)), ENT_QUOTES) : htmlspecialchars(trim($value), ENT_QUOTES);
            }
        }
        $this->_objectForm->decrypt->$key = $arr;
    }

    /*
     * Obtiene valores enviados via POST
     */

    public function post($arrDecrypt = []) {
        $this->_objectForm->decrypt = new stdClass();

        foreach ($_POST as $key => $value) {
            $kk = explode('__', $key); //se quita el alias
            $kk = (isset($kk[1])) ? $kk[1] : $key;

            if (is_array($_POST[$key])) {
                $arr = [];
                foreach ($_POST[$key] as $k => $val) {
                    $arr[] = htmlspecialchars(trim($val), ENT_QUOTES);
                }
                $this->_objectForm->$kk = $arr;
                $this->_decryptArray($arrDecrypt, $_POST[$key], $kk);
            } else {
                $this->_objectForm->$kk = htmlspecialchars(trim($value), ENT_QUOTES);
                $this->_decrypt($arrDecrypt, $kk, $value);
            }
        }
        return $this->_objectForm;
    }

    /*
     * Obtiene valores enviados via GET
     */

    public function get($arrDecrypt = []) {
        $this->_objectForm->decrypt = new stdClass();

        foreach ($_GET as $key => $value) {
            $kk = explode('__', $key); //se quita el alias
            $kk = (isset($kk[1])) ? $kk[1] : $key;
            if (is_array($_GET[$key])) {
                $arr = [];
                foreach ($_GET[$key] as $k => $val) {
                    $arr[] = htmlspecialchars(trim($val), ENT_QUOTES);
                }
                $this->_objectForm->$kk = $arr;
                $this->_decryptArray($arrDecrypt, $_GET[$key], $kk);
            } else {
                $this->_objectForm->$kk = htmlspecialchars(trim($value), ENT_QUOTES);
                $this->_decrypt($arrDecrypt, $kk, $value);
            }
        }
        return $this->_objectForm;
    }

    /*
     * Obtiene valores enviados via FILE
     */

    public function file($arrDecrypt = []) {
        if (count($_FILES)) {
            $this->_objectForm->decrypt = new stdClass();

            foreach ($_FILES as $key => $value) {
                $kk = explode('__', $key); //se quita el alias
                $kk = (isset($kk[1])) ? $kk[1] : $key;
                if (is_array($_FILES[$key])) {
                    $arr = [];
                    foreach ($_FILES[$key] as $k => $val) {
                        $arr[$k] = htmlspecialchars(trim($val), ENT_QUOTES);
                    }
                    $this->_objectForm->$kk = $arr;
                    $this->_decryptArray($arrDecrypt, $_FILES[$key], $kk);
                } else {
                    $this->_objectForm->$kk = htmlspecialchars(trim($value), ENT_QUOTES);
                    $this->_decrypt($arrDecrypt, $kk, $value);
                }
            }
            return $this->_objectForm;
        }
        return false;
    }

    /*
     * Obtiene valores enviados via REQUEST
     */

    public function request($arrDecrypt = []) {
        $this->_objectForm->decrypt = new stdClass();

        foreach ($_REQUEST as $key => $value) {
            $kk = explode('__', $key); //se quita el alias
            $kk = (isset($kk[1])) ? $kk[1] : $key;
            if (is_array($_REQUEST[$key])) {
                $arr = [];
                foreach ($_REQUEST[$key] as $k => $val) {
                    $arr[] = htmlspecialchars(trim($val), ENT_QUOTES);
                }
                $this->_objectForm->$kk = $arr;
                $this->_decryptArray($arrDecrypt, $_REQUEST[$key], $kk);
            } else {
                $this->_objectForm->$kk = htmlspecialchars(trim($value), ENT_QUOTES);
                $this->_decrypt($arrDecrypt, $kk, $value);
            }
        }
        return $this->_objectForm;
    }

}
