<?php

define('DEFAULT_LAYOUT','default');
define('APP_COMPANY','Software de Gestion Comercial');
define('MAIL_DEVELOPER','users3vfact@corporacion3v.com');
define('MAIL_REMITENTE_APP','info@corporacion3v.com');
define('ROOT_WS_SUNAT', 'http://localhost/UBL21/ws/');
define('FAE_ENTORNO','3');// 3: demo ...... 1: produccion
define('ROOT_UBL21', 'http://localhost/UBL21/archivos_xml_sunat/cpe_xml/'.((FAE_ENTORNO == 1)?'produccion':'beta').'/'); // en prod cambiar /beta por /produccion/


//configurar llamada de SPs
switch (DB_MOTOR) {
    case 'mysql':
        define('SP_CALL', 'CALL ');
        define('SP_INI', '(');
        define('SP_FIN', ')');
        break;
    case 'sql':
        define('SP_CALL', 'EXEC ');
        define('SP_INI', '');
        define('SP_FIN', '');
        break;
}

require_once ROOT . 'config' . DS . 'loads' . DS . 'LoadVendor.php';
require_once ROOT . 'config' . DS . 'loads' . DS . 'LoadLibs.php';
require_once ROOT . 'libs' . DS . 'DomPdf' . DS . 'lib' . DS . 'html5lib' . DS . 'Parser.php';
require_once ROOT . 'libs' . DS . 'DomPdf' . DS . 'src' . DS . 'Autoloader.php';


\Dompdf\Autoloader::register();

use Vendor\Obj;
use Vendor\Registry;

/*
 *  Clase que almacenara todos los namespaces
 */

class NP {

    private $_data = [];

    public function __set($name, $value) {
        $this->_data[$name] = $value;
    }

    public function __get($name) {
        if (isset($this->_data[$name])) {
            return $this->_data[$name]();
        } else {
            return false;
        }
    }

}

$NP = new NP();

/*
 * Agregando metodo global para el namescpace VENDOR
 */
$NP->Vendor = function(){
    return Obj::run('Vendor');
};

/*
 * Agregando metodo global para el namescpace LIBS
 */
$NP->Libs = function(){
    return Obj::run('Libs');
};

/*funcion global que devuelve variable global que contiene la CLASE que retorna los OBJETOS por NAMESPACE*/
function Obj(){
    return $GLOBALS['NP'];
}

/*
 * Registro de Clases Base para acceder a travez de Obj()
 */
Registry::addClass('Registry', '\\Vendor\\Registry');
Registry::addClass('Request', '\\Vendor\\Request');
Registry::addClass('Bootstrap', '\\Vendor\\Bootstrap');
Registry::addClass('Session', '\\Vendor\\Session');
Registry::addClass('Aes', '\\Libs\\Aes');
Registry::addClass('AesCtr', '\\Libs\\AesCtr');
Registry::addClass('View', '\\Vendor\\View');
Registry::addClass('Tools', '\\Vendor\\Tools');
Registry::addClass('Upload', '\\Libs\\Upload');
Registry::addClass('PHPMailer', '\\Libs\\PHPMailer');
Registry::addClass('NumberToString', '\\Libs\\NumberToString');
Registry::addClass('EsSalud', '\\Libs\\EsSalud');
Registry::addClass('Sunat', '\\Libs\\Sunat');