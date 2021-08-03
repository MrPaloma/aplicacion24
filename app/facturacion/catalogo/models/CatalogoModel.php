<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 18:09:25 
 * Descripcion : CatalogoModel.php
 * ---------------------------------------
 */

namespace Facturacion\Catalogo\Models;

class CatalogoModel extends \Vendor\DataBase {

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
    
    public function spGrid(){
        $query = "CALL sp_facturacion_catalogo_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
        
        $query = "CALL sp_facturacion_catalogo_mantenimiento (:cliente,:flag,:key,:catalogo,:categoria,:umedida,:tipo,:codinterno, :codbarra, :codreferencia, :preciocompra,:marca,:local,:stock,:activo,:nxcaja,:ubicacion,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':cliente' => $this->_idCliente,
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':catalogo' => @$this->_form->txt_descripcion,
            ':categoria' => @$this->_form->lst_categoria,
            ':umedida' => @$this->_form->lst_umedida,
            ':tipo' => @$this->_form->lst_tipo,
            ':codinterno' => @$this->_form->txt_codinterno,
            ':codbarra' => @$this->_form->txt_codbarra,
            ':codreferencia' => @$this->_form->txt_codreferencia,
            ':preciocompra' => @$this->_form->txt_precio_venta,
            ':marca' => @$this->_form->lst_marca,
            ':local' => @$this->_form->lst_local,
            ':stock' => @$this->_form->txt_stock,
            ':nxcaja' => $this->_form->txt_nxcaja,
            ':ubicacion' => $this->_form->txt_ubicacion,
            ':activo' => @($this->_form->chk_activo)?$this->_form->chk_activo:0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        return $this->getRow($query, $parms);
        

        // $query = "SELECT id_catalogo FROM fac_catalogo WHERE codigo_interno = '178652'";
        // $parms = [

        // ];
        // $result = $this->getRow($query, $parms);

        // return $result[0][0];
    }
    
    protected function qFindCatalogo() {
        $query = "
        SELECT
                catalogo,
                id_categoria,
                id_unidad_medida,
                tipo,
                codigo_interno,
                codigo_barra,
                codigo_referencia,
                precio_venta_cigv,
                id_marca,
                activo,
                ubicacion,
                nxcaja
        FROM fac_catalogo
        WHERE id_catalogo = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }

}
