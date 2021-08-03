<?php

/**
 * Description of Tools
 *
 * @author DAVID
 */

namespace Vendor;

use Exception;

final class Tools {
    /* redirecciona a una ruta especifica */

    final protected function redirect($ruta = false) {
        if ($ruta) {
            header('location:' . BASE_URL . $ruta);
        } else {
            header('location:' . BASE_URL);
        }
    }

    /*
     * busca un dato en array
     */

    public function in_array_m($item, $array) {
        return preg_match('/"' . $item . '"/i', json_encode($array));
    }

    /*
     * Retorna implode de array multidiensional
     * Obj()->Tools->multipleImplode($data,'idfichasocioeconomicasaludproblema');
     */

    public function multipleImplode($data, $field, $delimiter = ',') {
        $d = [];
        foreach ($data as $value) {
            $d[] = $value[$field];
        }

        return implode($delimiter, $d);
    }

    /*
     * count array bidimensional
     */

    private function _count($data, $field, $item) {
        $c = 0;
        foreach ($data as $key => $value) {
            if ($value[$field] == $item) {
                $c++;
            }
        }
        return $c;
    }

    /*
     * retira valor unico de array bidimensional
     * $uniqM = Obj()->Tools->multiUnique($dataM,'idmodalidadadmision');
     */

    public function multiUnique($data, $item) {
        $uniq = [];
        $tmp = 'X';
        foreach ($data as $value) {
            if ($tmp != $value[$item]) {
                /* agregando indice count */
                $value['count'] = $this->_count($data, $item, $value[$item]);
                $uniq[] = $value;
            }
            $tmp = $value[$item];
        }
        return $uniq;
    }

    /*
     * bool is_bidimensional($array)
     * devuelve true si $array es solo bidimensional, false en caso contrario.
     */

    private function _is_bidimensional($array) {
        if (!is_array($array))
            return false;  // paranoia si no nos pasan un array

        foreach ($array as $elemento) {
            if (!is_array($elemento))
                return false;
            foreach ($elemento as $elem) {
                if (is_array($elem))
                    return false;
            }
        }

        return true;
    }

    /*
     * Desencripta elementos de un array. EJM: array('dg45wfdgh','@#$%453443','^&*()_++#4345')
     * uso::
     * Obj()->Tools->decriptArray(['data'=>  DATAARRAY, 'fields'=> CAMPO(S)ADESENCRIPTAR])
     */

    public function decriptArray($obj) {
        $data = isset($obj['data']) ? $obj['data'] : [];
        $fields = isset($obj['fields']) ? $obj['fields'] : null; /* debe tener la misma cantidad de elemntos q data */

        if (count($data)) {
            if ($this->_is_bidimensional($fields)) {/* fields es bidimensional */

                $fields = $this->_reorderFields(count($data), $fields); /* generar elementos conforme a data */

                return array_map(function($data, $fields) {
                    $f = explode('*', $fields); /* fields se convierte en array */

                    foreach ($data as $key => $value) {
                        $newvalue = $value;

                        if (!is_null($fields)) {/* se envio campos a envriptar */
                            /* se recorre fields para le encriptacion */
                            foreach ($f as $val) {
                                if ($val == $key && !is_null($fields)) {/* se envio campos a envriptar */
                                    $newvalue = Obj()->Libs->Aes->de($value);
                                }
                            }
                        } else {/* si no se envia fields, se encripta toda la data */
                            $newvalue = Obj()->Libs->Aes->de($value);
                        }


                        $data[$key] = $newvalue;
                    }
                    return $data;
                }, $data, $fields);
            } else {/* array es unidimensional */
                return array_map(function($param) {
                    return Obj()->Libs->Aes->de($param);
                }, $data);
            }
        } else {
            throw new Exception('Array no contiene datos en [Tools->decriptArray()]');
        }
    }

    /*
     * generar array del mismo length q data a encritar o desencripatar
     */

    private function _reorderFields($count, $param) {
        $v = '';
        if (is_array($param)) {
            foreach ($param as $value) {
                $v .= $value . '*';
            }
            $v = substr($v, 0, strlen($v) - 1);
        } else {
            $v = $param;
        }

        /* generar array en base a $count */
        $i = 0;
        $a = [];
        for ($i; $i < $count; $i++) {
            $a[] = $v;
        }
        return $a;
    }

    /*
     * Encripta elementos de un array.
     * uso::
     * Obj()->Tools->encriptArray(['data'=>  DATAARRAY, 'fields'=> CAMPO(S)ADESENCRIPTAR])
     */

    public function encriptArray($obj) {
        $data = isset($obj['data']) ? $obj['data'] : [];
        $fields = isset($obj['fields']) ? $obj['fields'] : null; /* debe tener la misma cantidad de elemntos q data */

        $fields = $this->_reorderFields(count($data), $fields); /* generar elementos conforme a data */

        if (count($data)) {
            return array_map(function($data, $fields) {
                $f = explode('*', $fields); /* fields se convierte en array */

                foreach ($data as $key => $value) {
                    $newvalue = $value;

                    if (!is_null($fields)) {/* se envio campos a envriptar */
                        /* se recorre fields para le encriptacion */
                        foreach ($f as $val) {
                            if ($val == $key && !is_null($fields)) {/* se envio campos a envriptar */
                                $newvalue = Obj()->Libs->Aes->en($value);
                            }
                        }
                    } else {/* si no se envia fields, se encripta toda la data */
                        $newvalue = Obj()->Libs->Aes->en($value);
                    }


                    $data[$key] = $newvalue;
                }
                return $data;
            }, $data, $fields);
        } else {
            /* para el datagrid si no hay data devolver array vacio */
            return $data;
        }
    }

    public function dateFormatClient($param) {
        return date("d-m-Y", strtotime($param));
    }

    public function dateFormatServer($param) {
        return date("Y-m-d", strtotime(str_replace('/', '-', $param)));
    }

    public function encrypt($value) {
        return \Libs\Aes::en($value);
    }

    public function dencrypt($value) {
        return \Libs\Aes::de($value);
    }

    public function deleteFile($file) {
        if (is_readable($file)) {
            unlink($file);
        }
    }

    public function objectToString($d) {
        $data_array = "";

        foreach ($d as $e => $f) {

            foreach ($f as $g => $h) {

                $data_array .= "$h^";
            }
            $data_array .= "@";
        }

        return $data_array;
    }

    public function headerPDF() {
        return '<br>         
                <table width="100%" cellpadding="7" cellspacing="7" border="0">
                    <tr>
                        <td rowspan="4" style="width:80%;"><img src="' . ROOT . 'public' . DS . 'img' . DS . 'logo.png' . '"></td>                    
                    </tr>
                    <tr>
                        <td style="font-size: 10px;padding-bottom:5px;padding-top:10px;">' . APP_COMPANY . '</td>
                    </tr>
                    <tr>
                        <td style="font-size: 10px;padding-bottom:5px;">' . date('d-m-Y H:i:s') . '</td>
                    </tr>
                    <tr>
                        <td style="font-size: 10px;padding-bottom:5px;"></td>
                    </tr>
                </table>
                <div style="margin-top:25px;border-bottom:1px solid black;"></div>';
    }

    public function footerPDF() {
        return '    
                <hr width=100% align="center">
                <table style="vertical-align: bottom; font-family: serif; font-size: 8pt; color: #000000; font-weight: bold; font-style: italic;" width="100%">
                    <tr><td>&nbsp;</td></tr>
                    <tbody>
			<tr>
				<td width="33%"><span style="font-weight: bold; font-style: italic;">{DATE j-m-Y}</span></td>
				<td style="font-weight: bold; font-style: italic;" align="center" width="33%">{PAGENO}/{nbpg}</td>
				<td style="text-align: right;" width="33%"></td>
			</tr>
		</tbody>
	</table>';
    }

    /*
     * template para cabecera y footer de pdf
     */

    public function templateFHPdf($param) {
        return '
        <html>
        <head>
          <style>
            @page { margin: 100px 80px; }
            header { position: fixed; top: -60px; left: 0px; right: 0px; height: 50px; }
            footer { position: fixed; bottom: -60px; left: 0px; right: 0px;  height: 50px; }
            /*p { page-break-after: always; }*/
            /*p:last-child { page-break-after: never; }*/
            header img{width:139px;height:35px}
          </style>
        </head>
        <body>
          <header>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:-25px">
                <tr>
                    <td rowspan="4" style="width:80%;"><img src="' . ROOT . 'public' . DS . 'img' . DS . 'logo.png' . '"></td>                    
                </tr>
                <tr>
                    <td style="font-size: 10px;padding-bottom:5px;padding-top:10px;text-align:right">' . APP_COMPANY . '</td>
                </tr>
                <tr>
                    <td style="font-size: 10px;padding-bottom:5px;text-align:right">' . date('d-m-Y H:i:s') . '</td>
                </tr>
                <tr>
                    <td style="font-size: 10px;padding-bottom:5px;text-align:right">' . Obj()->Vendor->Session->get('app_nameUser') . '</td>
                </tr>
            </table>
          </header>
          <footer></footer>
          <main>
            ' . $param . '
          </main>
        </body>
        </html>';
    }

    public function dateSpanish($p = '') {
        $dias = array("Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado");
        $meses = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");

        //return $dias[date('w')] . " " . date('d') . " de " . $meses[date('n') - 1] . " del " . date('Y');
        return date('d') . " de " . $meses[date('n') - 1] . " del " . date('Y');
    }
    
    public function dateDaySpanish() {
        $dias = array("Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado");

        return $dias[date('w')];
    }
    
    public function dateMonthSpanish($p = '') {
        $meses = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");

        return $meses[date('n') - 1];
    }

}
