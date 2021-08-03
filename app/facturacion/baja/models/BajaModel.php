<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        16-09-2018 17:09:58 
* Descripcion : BajaModel.php
* ---------------------------------------
*/ 

namespace Facturacion\Baja\Models;
  
class BajaModel extends \Vendor\DataBase {
    
    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_idCliente;
    private $_pFilterCols;
    private $_idRol;
    private $_idLocal;
    
    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        $this->_usuario = Obj()->Vendor->Session->get('app_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('app_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('app_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('app_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('app_hostName');
        $this->_idCliente = Obj()->Vendor->Session->get('app_idCliente');
        $this->_idRol = Obj()->Vendor->Session->get('app_defaultIdRol');
        $this->_idLocal = Obj()->Vendor->Session->get('app_idLocal');

        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }
    
    protected function spGrid() {
        $query = "CALL sp_facturacion_baja_grid (:idRol,:local,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport,:user);";
        $parms = [
            ":idRol" => @$this->_idRol,
            ":local" => @$this->_idLocal,
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport,
            ":user" => @$this->_usuario
        ];
        $data = $this->getRows($query, $parms);

        return $data;
    }
    
    protected function spMantenimiento() {
        $query = "CALL sp_facturacion_baja_mantenimiento ("
                . ":clienteApp,"
                . ":flag,"
                . ":key,"
                . ":local,"
                . ":serie,"
                . ":numDoc,"
                . ":motivo,"
                . ":tipoComprobante,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname"
                . "); ";
        $parms = [
            ':clienteApp' => @$this->_idCliente,
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':local' => @$this->_idLocal,
            ':serie' => @$this->_form->lst_serie,
            ':numDoc' => @$this->_form->txt_num_doc,
            ':motivo' => @$this->_form->txt_motivo,
            ':tipoComprobante' => @$this->_form->_tipoComprobante,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qGetNumeroDocActual() {
        $query = "
        SELECT 
                (IFNULL(MAX(numero_baja),0) + 1) numero_actual
        FROM fac_baja
        WHERE id_cliente = :key
        ";
        $parms = [
            ':key' => $this->_idCliente
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qTipoComprobante() {
        $query = "
        SELECT 
                id_tipo_comprobante
        FROM fac_serie
        WHERE id_serie = :serie
        ";
        $parms = [
            ':serie' => $this->_form->_serie
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qDocumento($tb,$tipoComp) {
        $query = "
        SELECT
                v.name_file_sunat,
                c.ruc,
                v.enviado_sunat,
                v.anulado,
                ${tipoComp} tipo_comprobante,
                DATEDIFF(CURDATE(),v.fecha_emision) dias_transcurridos,
                (SELECT valor FROM app_parametro WHERE codigo = 'APPDIASANULADOC') dias_habiles
        FROM ${tb} v
        INNER JOIN fac_cliente c ON c.id_cliente = v.id_cliente
        WHERE v.id_serie = :serie
        AND v.numero_documento = :num
        ";
        $parms = [
            ':serie' => $this->_form->_serie,
            ':num' => $this->_form->_numDoc
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qCompany() {
        $query = "
        SELECT
                c.ruc,
                c.razon_social,
                c.nombre_comercial,
                RIGHT(c.ubigeo_codigo,6) ubigeo_codigo,
                c.email,
                c.telefono,
                c.direccion,
                c.usuario_sol,
                c.clave_sol,
                c.usuario_app,
                c.clave_app,
                (SELECT ubigeo_nombre FROM app_ubigeo WHERE RIGHT(ubigeo_codigo,6) = CONCAT(LEFT(c.ubigeo_codigo,2),'0000')) departamento,
                (SELECT ubigeo_nombre FROM app_ubigeo WHERE RIGHT(ubigeo_codigo,6) = CONCAT(LEFT(c.ubigeo_codigo,4),'00')) provincia,
                u.ubigeo_nombre distrito,
                c.pass_firma,
                c.logo
        FROM fac_cliente c
        INNER JOIN app_ubigeo u ON u.ubigeo_codigo = c.ubigeo_codigo
        WHERE c.id_cliente = :key
        ";
        $parms = [
            ':key' => $this->_idCliente
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qHeadDocumento($id) {
        $query = "
        SELECT
                b.id_baja,
                b.numero_baja,
                t.codigo,
                r.serie,
                b.numero_documento,
                b.motivo,
                b.fecha_anulacion,
                t.tipo_comprobante,
                b.hash_cpe
        FROM fac_baja b
        INNER JOIN fac_serie r ON r.id_serie = b.id_serie
        INNER JOIN fac_tipo_comprobante t ON t.id_tipo_comprobante = r.id_tipo_comprobante
        WHERE b.id_baja = :key
        ";
        $parms = [
            ':key' => $id
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qUdpdateRespuestaSunat() {
        $query = "
        UPDATE fac_baja SET
            enviado_sunat = :estado,
            code_respuesta_sunat = :code,
            descripcion_sunat_cdr = :descripcion,
            name_file_sunat = :file,
            hash_cdr = :hcdr,
            hash_cpe = :hcpe
        WHERE id_baja = :id ; 
        ";
        $parms = [
            ':id' => $this->_form->_key,
            ':estado' => 1,
            ':code' => $this->_form->_code,
            ':descripcion' => $this->_form->_descripcionSunat,
            ':file' => $this->_form->_file,
            ':hcdr' => $this->_form->_hcdr,
            ':hcpe' => $this->_form->_hcpe
        ];

        $this->execute($query, $parms);
        return ['result' => 1];
    }
    
    protected function qRespuestaSunat() {
        $query = "
        SELECT 
                v.numero_baja numero_documento,
                v.descripcion_sunat_cdr,
                v.name_file_sunat,
                v.name_file_sunat,
                c.ruc
        FROM fac_baja v
        INNER JOIN fac_cliente c ON c.id_cliente = v.id_cliente
        WHERE v.id_baja = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }

}