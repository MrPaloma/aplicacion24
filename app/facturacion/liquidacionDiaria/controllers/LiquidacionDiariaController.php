<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Art  
 * Fecha:        02-12-2018 06:12:51 
 * Descripcion : LiquidacionDiariaController.php
 * ---------------------------------------
 */

namespace Facturacion\LiquidacionDiaria\Controllers;

use \Vendor\Controller;
use \Facturacion\LiquidacionDiaria\Filters\LiquidacionDiariaFilter;

class LiquidacionDiariaController extends \Facturacion\LiquidacionDiaria\Models\LiquidacionDiariaModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use LiquidacionDiariaFilter {
        LiquidacionDiariaFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del LiquidacionDiariaModel */
        $this->__cConstruct();  /* constructor del Controller */
        $this->__fConstruct();  /* constructor del LiquidacionDiariaFilter */
    }

    public function index() {
        
    }

    public function getLiquidacion() {
        $data = [
            'general' => [
                'cajas' => $this->qCajas(0),
                'monedas' => $this->qMonedas(0),
                'ventas' => $this->qVentas(0)
            ],
            'anulados' => [
                'cajas' => $this->qCajas(1),
                'monedas' => $this->qMonedas(1),
                'ventas' => $this->qVentas(1)
            ],
            'liquidacion' => [
                'cajas' => $this->qCajasAll(),
                'monedas' => $this->qMonedasAll(),
                'liquidacion' => $this->qLiquidacion()
            ]
        ];
        echo json_encode($data);
    }

    public function getDetalle() {
        switch ($this->_form->_formaPago) {
            case 'KE': // egreso caja
                $data = $this->qCaja('E');
                break;
            case 'KI': // ingreso caja
                $data = $this->qCaja('I');
                break;
            case 'C': // creditos
                $data = $this->qCreditos();
                break;
            case 'A': // anulados
                $data = $this->qAnulados();
                break;
            default: // id_forma_pago
                $data = $this->qFormaPago();
                break;
        }
        echo json_encode($data);
    }

}
