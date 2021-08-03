<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:32 
* Descripcion : SerieModel.php
* ---------------------------------------
*/ 

namespace Facturacion\Serie\Models;
  
class SerieModel extends \Vendor\DataBase {
    
    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_idCliente;
    private $_pFilterCols;
    
    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        $this->_usuario = Obj()->Vendor->Session->get('app_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('app_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('app_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('app_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('app_hostName');
        $this->_idCliente = Obj()->Vendor->Session->get('app_idCliente');
        
        $this->_pFilterCols    =   @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)),ENT_QUOTES);
    }
    
    public function spGrid(){
        $query = "CALL sp_facturacion_serie_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":idCliente" => @$this->_idCliente,
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];       
        $data = $this->getRows($query,$parms);
       
        return $data;
    }
    
    protected function mantenimiento() {
        $query = "CALL sp_facturacion_serie_mantenimiento (:cliente,:flag,:key,:tipoComprobante,:serie,:numActual,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':cliente' => $this->_idCliente,
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':tipoComprobante' => @$this->_form->lst_tipo_comprobante,
            ':serie' => @$this->_form->txt_serie,
            ':numActual' => @$this->_form->txt_numero_actual,
            ':activo' => @($this->_form->chk_activo)?$this->_form->chk_activo:0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        
        return $this->getRow($query, $parms);
    }
    
    protected function qFindSerie() {
        $query = "
        SELECT
                id_tipo_comprobante,
                serie,
                numero_actual,
                activo
        FROM fac_serie
        WHERE id_serie = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }
    
}