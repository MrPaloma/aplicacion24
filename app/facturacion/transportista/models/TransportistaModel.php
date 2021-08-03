<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        30-12-2018 01:12:26 
* Descripcion : TransportistaModel.php
* ---------------------------------------
*/ 

namespace Facturacion\Transportista\Models;
  
class TransportistaModel extends \Vendor\DataBase {
    
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
        
        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }
    
    protected function spGrid(){
        $query = "CALL sp_facturacion_transportista_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];       
        $data = $this->getRows($query,$parms);
       
        return $data;
    }
    
    protected function spGridVehiculos(){
        $query = "CALL sp_facturacion_transportista_vehiculo_grid (:transportista,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":transportista" => @$this->_form->_transportista,
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
        $query = "CALL sp_facturacion_transportista_mantenimiento ("
                . ":flag,"
                . ":key,"
                . ":tipo_doc,"
                . ":num_doc,"
                . ":razon_social,"
                . ":activo,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':tipo_doc' => @$this->_form->lst_tipo_doc,
            ':num_doc' => @$this->_form->txt_num_doc,
            ':razon_social' => @$this->_form->txt_razon_social,
            ':activo' => @($this->_form->chk_activo)?$this->_form->chk_activo:0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
       
        return $this->getRow($query, $parms);
    } 
    
    protected function mantenimientoVehiculo() {
        $query = "CALL sp_facturacion_transportista_vehiculo_mantenimiento ("
                . ":flag,"
                . ":key,"
                . ":idTransportista,"
                . ":tipo_doc,"
                . ":num_doc,"
                . ":nombres,"
                . ":apellidos,"
                . ":placa,"
                . ":activo,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_keyVehiculo,
            ':idTransportista' => @$this->_form->_key,
            ':tipo_doc' => @$this->_form->lst_tipo_doc,
            ':num_doc' => @$this->_form->txt_num_doc,
            ':nombres' => @$this->_form->txt_nombres,
            ':apellidos' => @$this->_form->txt_apellidos,
            ':placa' => @$this->_form->txt_placa,
            ':activo' => @($this->_form->chk_activo)?$this->_form->chk_activo:0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
       
        return $this->getRow($query, $parms);
    }
    
    protected function qTransporte(){
        $query = "
        select
                t.id_tipo_documento_identidad,
                t.numero_documento,
                t.razon_social,
                t.activo
        from fact_transportista t
        where t.id_transportista = :id";
        $parms = [
            ":id" => $this->_form->_key
        ];       
        $data = $this->getRow($query,$parms);
       
        return $data;
    }
    
    protected function qVehiculo() {
        $query = "
        SELECT
                id_tipo_documento_identidad,
                numero_documento,
                nombres,
                apellidos,
                placa,
                activo
        FROM fact_transportista_vehiculo
        WHERE id_transportista_vehiculo = :id";
        $parms = [
            ":id" => $this->_form->_keyVehiculo
        ];       
        $data = $this->getRow($query,$parms);
       
        return $data;
    }
    
}