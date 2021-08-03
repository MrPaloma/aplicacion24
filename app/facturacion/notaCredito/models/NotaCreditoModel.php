<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 17:09:42 
 * Descripcion : NotaCreditoModel.php
 * ---------------------------------------
 */

namespace Facturacion\NotaCredito\Models;

class NotaCreditoModel extends \Vendor\DataBase {

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
        $query = "CALL sp_facturacion_notacredito_grid (:idRol,:local,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport,:user);";
        $parms = [
            ":idRol" => @$this->_idRol,
            ":local" => @$this->_idLocal,
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport,
            ":user" => $this->_usuario
        ];
        $data = $this->getRows($query, $parms);

        return $data;
    }

    protected function spMantenimientoNT() {
        $query = "CALL sp_facturacion_notacredito_mantenimiento ("
                . ":clienteApp,"
                . ":flag,"
                . ":key,"
                . ":serie_nc,"
                . ":idVentaAfectado,"
                . ":tipo_nota_credito,"
                . ":txt_motivo,"
                . ":venta_detalle,"
                . ":chk_enviar,"
                . ":cantidad,"
                . ":precio,"
                . ":subtotal,"
                . ":totalUnitario,"
                . ":gravada,"
                . ":igv,"
                . ":totalNT,"
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
            ':serie_nc' => @$this->_form->lst_nc_cerie,
            ':idVentaAfectado' => @$this->_form->_idVentaAfectado,
            ':tipo_nota_credito' => @$this->_form->lst_tipo_nota_credito,
            ':txt_motivo' => @$this->_form->txt_motivo,
            ':venta_detalle' => @implode(',', $this->_form->txt_venta_detalle), //[]
            ':chk_enviar' => @implode(',', $this->_form->chk_enviar), //[]
            ':cantidad' => @implode(',', $this->_form->txt_cantidad), //[]
            ':precio' => @implode(',', $this->_form->txt_precio), //[]
            ':subtotal' => @implode(',', $this->_form->txt_subtotal), //[]
            ':totalUnitario' => @implode(',', $this->_form->txt_total_unitario), //[]
            ':gravada' => @$this->_form->txt_gravada,
            ':igv' => @$this->_form->txt_igv,
            ':totalNT' => @$this->_form->txt_total,
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
                (numero_actual + 1) numero_actual
        FROM fac_serie
        WHERE id_serie = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
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

    protected function qHeadDocumentoFactura() {
        $query = "
        SELECT 
                v.id_venta,
                p.id_tipo_documento_identidad,
                p.documento_identidad,
                e.razon_social,
                e.email_principal,
                CONCAT(e.telefono,' ',e.celular) telefono,
                ifnull(v.direccion_entidad,e.direccion_fiscal) direccion_fiscal,
                v.fecha_emision,
                IF(v.fecha_vencimiento = '0000-00-00','',v.fecha_vencimiento) fecha_vencimiento,
                t.codigo tipo_comprobante,
                er.serie,
                v.numero_documento,
                tm.codigo tipo_moneda,
                v.total_gravada,
                v.total_exonerada,
                v.total_inafecta,
                v.total_igv,
                v.total_venta,
                v.numero_guia_remitente_tmp,
                v.numero_guia_transportista,
                v.orden_compra,
                v.observaciones,
                t.id_tipo_comprobante,
                t.tipo_comprobante,
                tm.tipo_moneda moneda,
                v.name_file_sunat,
                c.ruc,
                v.anulado,
                (SELECT count(*) FROM fac_nota_credito nc WHERE nc.id_venta = v.id_venta) tiene_nota_credito,
                (
			SELECT 
				CONCAT(g.serie,'-',nc.numero_documento) 
			FROM fac_nota_credito nc 
			INNER JOIN fac_serie g ON g.id_serie = nc.id_serie
			WHERE nc.id_venta = v.id_venta
		) num_nota_credito,
                v.enviado_sunat,
                v.hash_cpe,
                td.abreviatura tipo_doc_identidad,
                cc.caja,
                pp.nombre_completo vendedor
        FROM fac_venta v
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        INNER JOIN app_persona p ON p.id_persona = e.id_persona
        INNER JOIN fac_serie er ON er.id_serie = v.id_serie
        INNER JOIN fac_tipo_comprobante t ON t.id_tipo_comprobante = er.id_tipo_comprobante
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN fac_cliente c ON c.id_cliente = v.id_cliente
        INNER JOIN app_tipo_documento_identidad td ON td.id_tipo_documento_identidad = p.id_tipo_documento_identidad
        INNER JOIN fac_local_caja aa ON aa.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja cc ON cc.id_caja = aa.id_caja
        INNER JOIN app_usuario u ON u.id_usuario = v.usuario_crea
        INNER JOIN app_persona pp ON pp.id_persona = u.id_persona
        WHERE er.id_serie = :serie
        AND v.numero_documento = :numdoc
        ";
        $parms = [
            ':serie' => $this->_form->_serie,
            ':numdoc' => $this->_form->_numDoc
        ];

        return $this->getRow($query, $parms);
    }

    protected function qDetailDocumentoFactura() {
        $query = "
        SELECT
                v.id_venta_detalle,
                v.id_local_producto id_catalogo,
                c.catalogo,
                v.cantidad,
                v.id_tipo_igv,
                v.precio_unitario,
                v.sub_total,
                v.total,
                u.codigo u_medida,
                0 descuento,
                (vv.igv * 100) igv
        FROM fac_venta_detalle v
        INNER JOIN fac_local_producto l ON l.id_local_producto = v.id_local_producto
        INNER JOIN fac_venta vv ON vv.id_venta = v.id_venta
        INNER JOIN fac_serie er ON er.id_serie = vv.id_serie
        INNER JOIN fac_catalogo c ON c.id_catalogo = l.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        WHERE er.id_serie = :serie
        AND vv.numero_documento = :numdoc
        ";
        $parms = [
            ':serie' => $this->_form->_serie,
            ':numdoc' => $this->_form->_numDoc
        ];

        return $this->getRows($query, $parms);
    }

    protected function qHeadDocumento($id) {
        $query = "
        SELECT 
                (SELECT valor * 100 FROM app_parametro WHERE codigo = 'APPIGV') igv,
                nc.id_nota_credito,
                p.id_tipo_documento_identidad,
                p.documento_identidad,
                e.razon_social,
                e.email_principal,
                CONCAT(e.telefono,' ',e.celular) telefono,
                e.direccion_fiscal,
                nc.fecha_emision,
                t.codigo tipo_comprobante,
                er.serie,
                nc.numero_documento,
                nc.total_gravada,
                nc.total_igv,
                nc.total_nota_credito,
                nc.motivo,
                t.id_tipo_comprobante,
                t.codigo tipo_comprobante,
                nc.name_file_sunat,
                c.ruc,
                CONCAT(ee.serie,'-',v.numero_documento) num_doc_afectado,
                tt.codigo tipo_doc_afectado,
                nc.id_tipo_nota_credito,
                tm.codigo tipo_moneda,
                t.tipo_comprobante name_tipo_comprobante,
                tt.tipo_comprobante name_tipo_comprobante_afec,
                tdd.abreviatura tipo_doc_c,
                v.fecha_emision fecha_doc_afec,
                tnc.tipo_nota_credito,
                nc.hash_cpe
        FROM fac_nota_credito nc
        INNER JOIN fac_venta v ON v.id_venta = nc.id_venta 
        INNER JOIN fac_serie ee ON ee.id_serie = v.id_serie
        INNER JOIN fac_tipo_comprobante tt ON tt.id_tipo_comprobante = ee.id_tipo_comprobante
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        INNER JOIN app_persona p ON p.id_persona = e.id_persona
        INNER JOIN fac_serie er ON er.id_serie = nc.id_serie
        INNER JOIN fac_tipo_comprobante t ON t.id_tipo_comprobante = er.id_tipo_comprobante
        INNER JOIN fac_cliente c ON c.id_cliente = v.id_cliente
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN app_tipo_documento_identidad tdd ON tdd.id_tipo_documento_identidad = p.id_tipo_documento_identidad
        INNER JOIN fac_tipo_nota_credito tnc ON tnc.id_tipo_nota_credito = nc.id_tipo_nota_credito
        WHERE nc.id_nota_credito = :key
        ";
        $parms = [
            ':key' => $id
        ];

        return $this->getRow($query, $parms);
    }

    protected function qDetailDocumento($id) {
        $query = "
        SELECT
                v.id_local_producto id_catalogo,
                c.catalogo,
                v.cantidad,
                v.precio_unitario,
                v.sub_total,
                v.total,
                u.codigo u_medida,
                vv.igv,
                vd.id_tipo_igv,
                0 descuento
        FROM fac_nota_credito_detalle v
        INNER JOIN fac_nota_credito vv ON vv.id_nota_credito = v.id_nota_credito
        INNER JOIN fac_serie er ON er.id_serie = vv.id_serie
        INNER JOIN fac_local_producto l ON l.id_local_producto = v.id_local_producto
        INNER JOIN fac_catalogo c ON c.id_catalogo = l.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        INNER JOIN fac_venta_detalle vd ON vd.id_venta_detalle = v.id_venta_detalle
        WHERE vv.id_nota_credito = :key
        ";
        $parms = [
            ':key' => $id
        ];

        return $this->getRows($query, $parms);
    }

    protected function qUdpdateRespuestaSunat() {
        $query = "
        UPDATE fac_nota_credito SET
            enviado_sunat = :estado,
            code_respuesta_sunat = :code,
            descripcion_sunat_cdr = :descripcion,
            name_file_sunat = :file,
            hash_cdr = :hcdr,
            hash_cpe = :hcpe
        WHERE id_nota_credito = :id ; 
        ";
        $parms = [
            ':id' => $this->_form->_key,
            ':estado' => $this->_form->_estado,
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
                CONCAT(w.serie,'-',v.numero_documento) numero_documento,
                v.descripcion_sunat_cdr,
                v.name_file_sunat,
                CONCAT(t.simbolo,' ',v.total_nota_credito) total_venta,
                w.id_tipo_comprobante,
                v.name_file_sunat,
                c.ruc
        FROM fac_nota_credito v
        INNER JOIN fac_serie w ON w.id_serie = v.id_serie
        INNER JOIN fac_cliente c ON c.id_cliente = v.id_cliente
        INNER JOIN fac_venta ve ON ve.id_venta = v.id_venta
        INNER JOIN app_tipo_moneda t ON t.id_tipo_moneda = ve.id_tipo_moneda
        WHERE v.id_nota_credito = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }

    protected function qEmailCliente() {
        $query = "
        SELECT
                e.email_principal,
                e.email_1,
                e.email_2,
                c.ruc,
                v.name_file_sunat,
                CONCAT(d.serie,'-',v.numero_documento) num_doc
        FROM fac_nota_credito v
        INNER JOIN fac_venta ve ON ve.id_venta = v.id_venta
        INNER JOIN fac_entidad e ON e.id_entidad = ve.id_entidad
        INNER JOIN fac_cliente c ON c.id_cliente = v.id_cliente
        INNER JOIN fac_serie d ON d.id_serie = v.id_serie
        WHERE v.id_nota_credito = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function spMantenimientoBaja() {
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
            ':serie' => @$this->_form->_serie,
            ':numDoc' => @$this->_form->_numDoc,
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
    
    protected function qHeadDocumentoBaja($id) {
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
    
    protected function qUdpdateRespuestaBajaSunat() {
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
            ':estado' => $this->_form->_estado,
            ':code' => $this->_form->_code,
            ':descripcion' => $this->_form->_descripcionSunat,
            ':file' => $this->_form->_file,
            ':hcdr' => $this->_form->_hcdr,
            ':hcpe' => $this->_form->_hcpe
        ];

        $this->execute($query, $parms);
    }
    
    protected function qRespuestaBajaSunat() {
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
