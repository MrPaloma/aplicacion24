<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        12-09-2018 17:09:36 
* Descripcion : ClienteModel.php
* ---------------------------------------
*/ 

namespace Facturacion\Cliente\Models;
  
class ClienteModel extends \Vendor\DataBase {
    
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
    
    protected function spGrid(){
        $query = "CALL sp_facturacion_entidad_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
        $query = "CALL sp_facturacion_entidad_mantenimiento ("
                . ":cliente,"
                . ":flag,"
                . ":key,"
                . ":tipo_doc,"
                . ":num_doc,"
                . ":razon_social,"
                . ":nombre_comercial,"
                . ":celular,"
                . ":fijo,"
                . ":direccion_fiscal,"
                . ":direccion_1,"
                . ":direccion_2,"
                . ":email_princial,"
                . ":email_1,"
                . ":email_2,"
                . ":ubigeo,"
                . ":activo,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname); ";
        $parms = [
            ':cliente' => $this->_idCliente,
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':tipo_doc' => @$this->_form->lst_tipo_doc,
            ':num_doc' => @$this->_form->txt_num_doc,
            ':razon_social' => @$this->_form->txt_razon_social,
            ':nombre_comercial' => @$this->_form->txt_nombre_comercial,
            ':celular' => @$this->_form->txt_celular,
            ':fijo' => @$this->_form->txt_fijo,
            ':direccion_fiscal' => @$this->_form->txt_direccion_fiscal,
            ':direccion_1' => @$this->_form->txt_direccion_1,
            ':direccion_2' => @$this->_form->txt_direccion_2,
            ':email_princial' => @$this->_form->txt_email_princial,
            ':email_1' => @$this->_form->txt_email_1,
            ':email_2' => @$this->_form->txt_email_2,
            ':ubigeo' => @$this->_form->_ubigeo,
            ':activo' => @($this->_form->chk_activo)?$this->_form->chk_activo:0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        
        return $this->getRow($query, $parms);
    }
    
    protected function qFindEntidad() {
        $query = "
        SELECT 
                p.id_tipo_documento_identidad,
                p.documento_identidad,
                e.razon_social,
                e.nombre_comercial,
                e.celular,
                e.telefono,
                e.direccion_fiscal,
                e.direccion_1,
                e.direccion_2,
                e.email_principal,
                e.email_1,
                e.email_2,
                e.activo,
                e.ubigeo_codigo
        FROM fac_entidad e
        INNER JOIN app_persona p ON p.id_persona = e.id_persona
        WHERE e.id_entidad = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }
    
}