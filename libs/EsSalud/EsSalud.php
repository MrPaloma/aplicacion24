<?php

namespace Libs;

require_once (ROOT . 'libs' . DS . 'EsSalud' . DS . 'src' . DS . 'obj.php');
require_once (ROOT . 'libs' . DS . 'EsSalud' . DS . 'src' . DS . 'curl.php');
require_once (ROOT . 'libs' . DS . 'EsSalud' . DS . 'src' . DS . 'essalud' . DS . 'essalud.php');

class EsSalud extends \EsSalud\EsSalud {

    private $_data;

    public function __construct() {
        //parent::__construct();
        //return $this;
    }

    public function search($param) {
        $url = 'http://aplicaciones007.jne.gob.pe/srop_publico/Consulta/Afiliado/GetNombresCiudadano?DNI=' . $param;
        $this->_data = file_get_contents($url);
        return $this;
    }

    public function json() {
        $c = explode('|', $this->_data);

        $rs = [
            'success' => 1,
            'result' => [
                'paterno' => $c[0],
                'materno' => $c[1],
                'nombre' => $c[2]
            ]
        ];

        return json_encode($rs);
    }

}
