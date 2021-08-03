<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Adm  
* Fecha:        01-02-2019 06:02:44 
* Descripcion : CajaChicaModel.php
* ---------------------------------------
*/ 

namespace Facturacion\CajaChica\Models;
  
class CajaChicaModel extends \Vendor\DataBase {
    
    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_idCliente;
    private $_pFilterCols;
    private $_idPersona;
    
    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        $this->_usuario = Obj()->Vendor->Session->get('app_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('app_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('app_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('app_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('app_hostName');
        $this->_idCliente = Obj()->Vendor->Session->get('app_idCliente');
        $this->_idPersona = Obj()->Vendor->Session->get('app_idPersona');
        
        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }
    
    public function spMantenimientoe() {

        $concepto = @$this->_form->_concepto;
        $rd_egreso = @$this->_form->_tipo_e;

        if ($rd_egreso == "servicio") {
            $concepto_f = $concepto;
        } 
        elseif ($rd_egreso == "remuneracion") {
            $personal = @$this->_form->_personal;
            $concepto_f = "Remuneración hacia ".$personal.": ".$concepto;
        }
                

        $query = "CALL sp_facturacion_caja_chica_mantenimiento (:flag,:keyLocal,:tipo,:fecha,:importe,:concepto,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':keyLocal' => @$this->_form->_keyLocalCaja,
            ':tipo' => @$this->_form->_tipo,
            ':fecha' => @$this->_form->_fecha,
            ':importe' => @$this->_form->_importe,
            ':concepto' => $concepto_f,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        
        return $this->getRow($query, $parms);
    }

    public function spMantenimientoi() {

        $query = "CALL sp_facturacion_caja_chica_mantenimiento (:flag,:keyLocal,:tipo,:fecha,:importe,:concepto,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':keyLocal' => @$this->_form->_keyLocalCaja,
            ':tipo' => @$this->_form->_tipo,
            ':fecha' => @$this->_form->_fecha,
            ':importe' => @$this->_form->_importe,
            ':concepto' => @$this->_form->_concepto,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        
        return $this->getRow($query, $parms);
    }
    
    protected function qChekOpenCaja() {
        $query = "
        SELECT
                l.id_local_caja,
                c.caja
        FROM fac_local_caja l
        INNER JOIN fac_caja c ON c.id_caja = l.id_caja
        WHERE l.id_persona = :persona
        AND l.estado = :estado;";
        $parms = [
            ':persona' => $this->_idPersona,
            ':estado' => 'A'
        ];

        return $this->getRow($query, $parms);
    }
    

    protected function spGride() {
        $query = "CALL sp_facturacion_caja_chica_egre_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":idCliente" => @$this->_idCliente,
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];
        $data = $this->getRows($query, $parms);

        return $data;
    }

    protected function spGridi() {
        $query = "CALL sp_facturacion_caja_chica_ingr_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":idCliente" => @$this->_idCliente,
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];
        $data = $this->getRows($query, $parms);

        return $data;
    }
}