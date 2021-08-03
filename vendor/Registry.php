<?php

namespace Vendor;

/**
 * Description of Registry
 *
 * @author DC
 */
class Registry {

    public static $get;
    public static $data = [];
    private static $_instancias = array();

    /**
     * Registra variables y objetos         
     */
    static private $registry = array();

    /*
     * No se puede instanciar
     */

    private function __construct() {
        
    }

    /*
     * Inicia el singleton
     */

//    private static function init() {
//        if (!self::$get) {
//            self::$get = Singleton::getInstancia();
//        }
//    }

    /*
     * Para el registro de nuestras clases
     */

    public static function addClass($class, $namespace) {
        $c = explode('\\', $namespace);
        $spacePlace = $c[1];

//        self::init();
        if (!isset(self::$data[$spacePlace][$class])) {//echo $spacePlace.'->'.$class.'='.$namespace.'<br>';
            /* el objeto se instancia solo una vez */
            self::$data[$spacePlace][$class] = new $namespace;
        } else {
            throw new Exception('Error: Clase <b>' . $class . '</b> ya se registro.');
        }
    }

    public static function singleton($class = '') {
        if (!empty($class)) {
            if (in_array($class, self::$_instancias)) {
                // throw new Exception('Error: objeto <b>'.$class.'</b> ya se instancio, para acceder hacerlo es a travez de su Controlador.');
            } else {
                self::$_instancias[$class] = $class;
            }
        }
    }

    /**
     * Método que añade objetos
     * Recibe el objeto (por referencia) y la clave
     * Devuelve un booleano para confirmar si se ha insertado
     * o si en cambio estaba duplicado.
     */
//    public static function add($key, $elemento) {
//        if (!self::exists($key)) {
//            self::$registry[$key] = $elemento;
//            return true;
//        } else {
//            throw new Exception('Error: <b>' . $key . '</b> ya se registro.');
//        }
//    }

    /**
     * Función que comprueba la existencia de una clave.
     * Devuelve un booleano confirmando si existe o no.
     */
    public static function exists($namespace, $class) {
        foreach (self::$data as $key => $value) {
            if ($key == $namespace) {
                foreach ($value as $kkey => $vvalue) {
                    if ($class == $kkey) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Función que devuelve un item dada la clave          
     */
    public static function get($key) {
        if (self::exists($key)) {
            return self::$registry[$key];
        } else {
            throw new Exception('Error: Clase <b>' . $key . '</b> no existe.');
        }
    }

    /**
     * Elimina una entrada recibiendo su clave y devuelve confirmación.
     * Si la clave no existe devuelve false.
     */
//    public static function remove($name) {
//        if (self::exists($name)) {
//            unset(self::$registry[$name]);
//            return true;
//        } else {
//            throw new Exception('Error: Clase <b>' . $name . '</b> no existe.');
//        }
//    }

    /**
     * Limpia el registro totalmente.         
     */
//    public static function clear() {
//        self::$registry = array();
//    }

}
