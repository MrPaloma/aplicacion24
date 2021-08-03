<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 20:09:30 
 * Descripcion : VentaModel.php
 * ---------------------------------------
 */

namespace Facturacion\Venta\Models;

class VentaModel extends \Vendor\DataBase {

    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_idCliente;
    private $_pFilterCols;
    private $_idLocal;
    private $_idRol;
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
        $this->_idLocal = Obj()->Vendor->Session->get('app_idLocal');
        $this->_idRol = Obj()->Vendor->Session->get('app_defaultIdRol');
        $this->_idPersona = Obj()->Vendor->Session->get('app_idPersona');

        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }

    protected function spGrid() {
        $query = "CALL sp_facturacion_ventas_grid (:idRol,:local,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport,:user);";
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

    protected function spMantenimientoVenta() {
        $query = "CALL sp_facturacion_venta_mantenimiento ("
                . ":clienteApp,"
                . ":flag,"
                . ":key,"
                . ":tipo_doc,"
                . ":serie,"
                . ":num_doc,"
                . ":fecha_emision,"
                . ":fecha_vencimiento,"
                . ":tipo_moneda,"
                . ":tipo_cambio,"
                . ":orden_compra,"
                . ":cliente,"
                . ":direccion,"
                . ":chk_guia,"
                . ":serie_guia_remision,"
                . ":guia_remitente,"
                . ":guia_remitente_tmp,"
                . ":guia_transportista,"
                . ":hhbbproducto,"
                . ":cantidad,"
                . ":tipo_igv,"
                . ":precio,"
                . ":subtotal,"
                . ":totalUnitario,"
                . ":observaciones,"
                . ":exonerada,"
                . ":inafecta,"
                . ":gravada,"
                . ":igv,"
                . ":gratuita,"
                . ":totalVenta,"
                . ":pagado,"
                . ":formaPago,"
                . ":local,"
                . ":idLocalCaja,"
                . ":recibido,"
                . ":vuelto,"
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
            ':tipo_doc' => @$this->_form->lst_tipo_doc,
            ':serie' => @$this->_form->lst_serie,
            ':num_doc' => @$this->_form->txt_num_doc,
            ':fecha_emision' => @$this->_form->txt_fecha_emision,
            ':fecha_vencimiento' => @$this->_form->txt_fecha_vencimiento,
            ':tipo_moneda' => @$this->_form->lst_tipo_moneda,
            ':tipo_cambio' => @$this->_form->txt_tipo_cambio,
            ':orden_compra' => @$this->_form->txt_orden_compra,
            ':cliente' => @$this->_form->lst_cliente,
            ':direccion' => @$this->_form->lst_direccion,
            ':chk_guia' => @($this->_form->chk_guia) ? $this->_form->chk_guia : 0,
            ':serie_guia_remision' => @$this->_form->lst_serie_guia_remision,
            ':guia_remitente' => @$this->_form->txt_guia_remitente,
            ':guia_remitente_tmp' => @$this->_form->txt_guia_remitente_tmp,
            ':guia_transportista' => @$this->_form->txt_guia_transportista,
            ':hhbbproducto' => @implode(',', $this->_form->hhbbproducto), //[]
            ':cantidad' => @implode(',', $this->_form->txt_cantidad), //[]
            ':tipo_igv' => @implode(',', $this->_form->lst_tipo_igv), //[]
            ':precio' => @implode(',', $this->_form->txt_precio), //[]
            ':subtotal' => @implode(',', $this->_form->txt_subtotal), //[]
            ':totalUnitario' => @implode(',', $this->_form->txt_total_unitario), //[]
            ':observaciones' => @$this->_form->txt_observaciones,
            ':exonerada' => @$this->_form->txt_exonerada,
            ':inafecta' => @$this->_form->txt_inafecta,
            ':gravada' => @$this->_form->txt_gravada,
            ':igv' => @$this->_form->txt_igv,
            ':gratuita' => @$this->_form->txt_gratuita,
            ':totalVenta' => @$this->_form->txt_total,
            ':pagado' => @($this->_form->rd_pagado) ? $this->_form->rd_pagado : 0,
            ':formaPago' => @$this->_form->lst_forma_pago,
            ':local' => $this->_idLocal,
            ':idLocalCaja' => @$this->_form->_keyLocalCaja,
            ':recibido' => @$this->_form->txt_recibido,
            ':vuelto' => @$this->_form->txt_vuelto,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function spMantenimientoGuia() {
        $query = "CALL sp_facturacion_venta_mantenimiento_guia ("
                . ":flag,"
                . ":key,"
                . ":key_venta,"
                . ":id_local,"
                . ":id_serie,"
                . ":transportitsta,"
                . ":fecha_traslado,"
                . ":punto_partida,"
                . ":punto_llegada,"
                . ":modalidad_transporte,"
                . ":num_bultos,"
                . ":observaciones,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname"
                . "); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_keyGuia,
            ':key_venta' => @$this->_form->_key,
            ':id_local' => $this->_idLocal,
            ':id_serie' => @$this->_form->lst_serie_g,
            ':transportitsta' => @$this->_form->lst_conductor,
            ':fecha_traslado' => @$this->_form->txt_fecha_traslado,
            ':punto_partida' => @$this->_form->txt_partida,
            ':punto_llegada' => @$this->_form->txt_llegada,
            ':modalidad_transporte' => @$this->_form->lst_modalidad_transporte,
            ':num_bultos' => @$this->_form->txt_nbulto,
            ':observaciones' => @$this->_form->txt_gobservaciones,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }

    protected function qGetProducto() {
        $query = "
        SELECT
        " . $this->_form->f . " fila,
        l.id_local_producto id,
        a.catalogo value,
        a.codigo_interno codigo,
        m.marca marca,
        l.precio_compra_real precio_compra,
        l.precio_publico precio_publico,
        l.precio_ferreteria precio_ferreteria,
        l.precio_distribuidor precio_distribuidor,
        u.codigo unidad_medida,
        round(l.stock_actual, 0) stock_actual


        FROM fac_local_producto l
        INNER JOIN fac_catalogo a ON a.id_catalogo = l.id_catalogo
        INNER JOIN fac_marca m ON m.id_marca = a.id_marca
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = a.id_unidad_medida
        WHERE l.id_local = :local
        AND";
        
        $busqueda = "";

        foreach ( $this->_form->term as $valor) {
            if ($valor != "") {
                $busqueda .= " a.catalogo LIKE '%" . $valor . "%' AND";
            }
        }

        $busqueda = substr($busqueda, 0, -3);

        $query .= $busqueda;
        
        $parms = [
            ':local' => $this->_idLocal
        ];

        return $this->getRows($query, $parms);
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
                c.logo,
                (SELECT valor FROM app_parametro WHERE codigo = 'FACTWIDTHTICKET') width_ticket,
                (SELECT valor FROM app_parametro WHERE codigo = 'FACTOBSTICKET') pie_ticket
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
                (SELECT valor * 100 FROM app_parametro WHERE codigo = 'APPIGV') igv,
                v.id_venta,
                p.id_tipo_documento_identidad,
                td.abreviatura tipo_doc_identidad,
                p.documento_identidad,
                e.razon_social,
                e.email_principal,
                CONCAT(e.telefono,' ',e.celular) telefono,
                ifnull(v.direccion_entidad,e.direccion_fiscal) direccion_fiscal,
                DATE_FORMAT(v.fecha_emision,'%d-%m-%Y') fecha_emision,
                v.fecha_emision fecha_comprobante,
                IF(v.fecha_vencimiento = '0000-00-00',v.fecha_emision,v.fecha_vencimiento) fecha_vencimiento,
                t.codigo tipo_comprobante,
                er.serie,
                v.numero_documento,
                tm.codigo tipo_moneda,
                tm.tipo_moneda tipo_moneda_name,
                v.total_gravada,
                v.total_exonerada,
                v.total_inafecta,
                v.total_gratuita,
                v.total_igv,
                v.total_venta,
                v.numero_guia_remitente_tmp,
                v.numero_guia_transportista,
                v.orden_compra,
                v.observaciones,
                t.id_tipo_comprobante,
                t.tipo_comprobante name_tipo_comprobante,
                v.hash_cpe,
                tm.simbolo,
                '' total_letra,
                c.caja,
                pp.nombre_completo vendedor,
                fp.forma_pago,
                v.tipo_cambio,
                v.pagado,
                v.id_entidad,
                v.recibido,
                v.vuelto
        FROM fac_venta v
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        INNER JOIN app_persona p ON p.id_persona = e.id_persona
        INNER JOIN fac_serie er ON er.id_serie = v.id_serie
        INNER JOIN fac_tipo_comprobante t ON t.id_tipo_comprobante = er.id_tipo_comprobante
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN app_tipo_documento_identidad td ON td.id_tipo_documento_identidad = p.id_tipo_documento_identidad
        INNER JOIN fac_local_caja aa ON aa.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = aa.id_caja
        INNER JOIN app_usuario u ON u.id_usuario = v.usuario_crea
        INNER JOIN app_persona pp ON pp.id_persona = u.id_persona
        INNER JOIN fac_forma_pago fp ON fp.id_forma_pago = v.id_forma_pago
        WHERE v.id_venta = :key
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
                v.id_tipo_igv,
                v.precio_unitario,
                v.sub_total,
                v.total_igv,
                v.total,
                u.codigo u_medida,
                u.codigo umedida,
                0 descuento,
                (vv.igv * 100) igv,
                c.codigo_interno
        FROM fac_venta_detalle v
        INNER JOIN fac_local_producto l ON l.id_local_producto = v.id_local_producto
        INNER JOIN fac_venta vv ON vv.id_venta = v.id_venta
        INNER JOIN fac_catalogo c ON c.id_catalogo = l.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        WHERE v.id_venta = :key
        ";
        $parms = [
            ':key' => $id
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qGetIdGuia() {
        $query = "SELECT id_gruia_remision FROM fac_gruia_remision WHERE id_venta = :key;";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qFileGuia() {
        $query = "SELECT name_file_sunat FROM fac_gruia_remision WHERE id_gruia_remision = :key;";
        $parms = [
            ':key' => $this->_form->_keyGuia
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qHeadGuia($id) {
        $query = "
        SELECT 
		v.id_motivo_traslado_guia,
                mt.motivo_traslado_guia,
		er.serie,
		v.numero_documento,
		e.razon_social razon_social_destinatario,
                e.direccion_fiscal direccion_drestinatario,		
                p.id_tipo_documento_identidad id_tipo_documento_identidad_destinatario,
                td.abreviatura tipo_doc_identidad_destinatario,
                p.documento_identidad documento_identidad_destinatario,                
                DATE_FORMAT(v.fecha_traslado,'%d-%m-%Y') fecha_traslado,
                v.fecha_traslado fecha_guia,
                t.codigo tipo_comprobante,
                t.tipo_comprobante name_tipo_comprobante,                
                v.observaciones,                
                v.hash_cpe,
                tdd.abreviatura tipo_doc_identidad_transportista,
                tt.numero_documento numero_documento_transportista,
                tt.placa placa_vehiculo,
                tdi.id_tipo_documento_identidad id_tipo_documento_identidad_transporte,
                tdi.abreviatura tipo_doc_identidad_transporte,
                tr.numero_documento numero_documento_transporte,
                tr.razon_social razon_social_transporte,
                v.num_bultos,
                v.modalidad_transporte,
                v.punto_partida,
                v.punto_llegada,
                tt.id_transportista,
                v.id_transportista_vehiculo,
                v.enviado_sunat
        FROM fac_gruia_remision v
        INNER JOIN fac_venta vv ON vv.id_venta = v.id_venta
        INNER JOIN fac_entidad e ON e.id_entidad = vv.id_entidad
        INNER JOIN app_persona p ON p.id_persona = e.id_persona
        INNER JOIN fac_serie er ON er.id_serie = v.id_serie
        INNER JOIN fac_tipo_comprobante t ON t.id_tipo_comprobante = er.id_tipo_comprobante
        INNER JOIN app_tipo_documento_identidad td ON td.id_tipo_documento_identidad = p.id_tipo_documento_identidad
        INNER JOIN fact_transportista_vehiculo tt ON tt.id_transportista_vehiculo = v.id_transportista_vehiculo
        INNER JOIN app_tipo_documento_identidad tdd ON tdd.id_tipo_documento_identidad = tt.id_tipo_documento_identidad
        INNER JOIN fact_transportista tr ON tr.id_transportista = tt.id_transportista
        INNER JOIN app_tipo_documento_identidad tdi ON tdi.id_tipo_documento_identidad = tr.id_tipo_documento_identidad
        INNER JOIN fac_motivo_traslado_guia mt ON mt.id_motivo_traslado_guia = v.id_motivo_traslado_guia
        WHERE v.id_gruia_remision = :key
        ";
        $parms = [
            ':key' => $id
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qDetailGuia($id) {
        $query = "
        SELECT
                v.id_local_producto id_catalogo,
                c.catalogo,
                v.cantidad,
                u.codigo u_medida,
                v.peso
        FROM fac_gruia_remision_detalle v
        INNER JOIN fac_local_producto l ON l.id_local_producto = v.id_local_producto
        INNER JOIN fac_catalogo c ON c.id_catalogo = l.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        WHERE v.id_gruia_remision = :key;
        ";
        $parms = [
            ':key' => $id
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qUdpdateRespuestaSunatGuia() {
        $query = "
        UPDATE fac_gruia_remision SET
            enviado_sunat = :estado,
            code_respuesta_sunat = :code,
            descripcion_sunat_cdr = :descripcion,
            name_file_sunat = :file,
            hash_cdr = :hcdr,
            hash_cpe = :hcpe
        WHERE id_gruia_remision = :id ; 
        ";
   
        $parms = [
            ':id' => $this->_form->_keyGuia,
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

    protected function qUdpdateRespuestaSunat() {
        $query = "
        UPDATE fac_venta SET
            enviado_sunat = :estado,
            code_respuesta_sunat = :code,
            descripcion_sunat_cdr = :descripcion,
            name_file_sunat = :file,
            hash_cdr = :hcdr,
            hash_cpe = :hcpe
        WHERE id_venta = :id ; 
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
                CONCAT(t.simbolo,' ',v.total_venta) total_venta,
                w.id_tipo_comprobante,
                v.name_file_sunat,
                c.ruc
        FROM fac_venta v
        INNER JOIN fac_serie w ON w.id_serie = v.id_serie
        INNER JOIN app_tipo_moneda t ON t.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN fac_cliente c ON c.id_cliente = v.id_cliente
        WHERE v.id_venta = :key
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
        FROM fac_venta v
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        INNER JOIN fac_cliente c ON c.id_cliente = v.id_cliente
        INNER JOIN fac_serie d ON d.id_serie = v.id_serie
        WHERE v.id_venta = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qHaveGuide() {
        $query = "
        SELECT COUNT(*) total FROM fac_gruia_remision WHERE id_venta = :key
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
        return ['result' => 1];
    }

    protected function qRespuestaBajaSunat() {
        $query = "
        SELECT 
                v.numero_baja,
                v.descripcion_sunat_cdr,
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

    protected function qPedido() {
        $query = "
        SELECT 
                b.id_local_producto,
                c.catalogo,
                b.cantidad,
                b.precio_unitario,
                b.sub_total,
                b.total,
                a.total_pedido,
                u.codigo umedida
        FROM fac_nota_pedido a
        INNER JOIN fac_nota_pedido_detalle b ON b.id_nota_pedido = a.id_nota_pedido
        INNER JOIN fac_local_producto lp ON lp.id_local_producto = b.id_local_producto
        INNER JOIN fac_catalogo c ON c.id_catalogo = lp.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        WHERE a.numero_pedido = :numero;
        ";
        $parms = [
            ':numero' => $this->_form->_numPedido
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qDetailBox() {
        $query = "
        SELECT
            *
        FROM(
            -- sin anular
            SELECT 
                    v.id_tipo_moneda,
                    t.tipo_moneda,
                    v.id_forma_pago,
                    f.forma_pago,
                    SUM(v.total_venta) total
            FROM fac_venta v
            INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
            INNER JOIN fac_forma_pago f ON f.id_forma_pago = v.id_forma_pago
            INNER JOIN app_tipo_moneda t ON t.id_tipo_moneda = v.id_tipo_moneda
            WHERE v.usuario_crea = :user
            AND v.id_local_caja = :id
            AND v.anulado = 0
            AND v.pagado = 1
            AND v.liquidado = 0
            GROUP BY v.id_tipo_moneda,v.id_forma_pago
            UNION
            -- anulados
            SELECT 
                    v.id_tipo_moneda,
                    t.tipo_moneda,
                    'A' id_forma_pago,
                    'ANULADOS' forma_pago,
                    CONCAT('-',SUM(v.total_venta)) total
            FROM fac_venta v
            INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
            INNER JOIN fac_forma_pago f ON f.id_forma_pago = v.id_forma_pago
            INNER JOIN app_tipo_moneda t ON t.id_tipo_moneda = v.id_tipo_moneda
            WHERE v.usuario_crea = :user
            AND v.id_local_caja = :id
            AND v.anulado = 1
            AND v.liquidado = 0
            GROUP BY v.id_tipo_moneda
            UNION
            -- creditos
            SELECT 
                    v.id_tipo_moneda,
                    t.tipo_moneda,
                    'C' id_forma_pago,
                    'CREDITO' forma_pago,
                    SUM(v.total_venta) total
            FROM fac_venta v
            INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
            INNER JOIN app_tipo_moneda t ON t.id_tipo_moneda = v.id_tipo_moneda
            WHERE v.usuario_crea = :user
            AND v.id_local_caja = :id
            AND v.pagado = 0
            AND v.anulado = 0
            AND v.liquidado = 0
            GROUP BY v.id_tipo_moneda
            UNION
            -- la caja ingresos
		SELECT	
			'1' id_tipo_moneda,
			'SOL' tipo_moneda,
			'KI' id_forma_pago,
			'CAJA INGRESOS' forma_pago,
			SUM(v.importe) total
		FROM fac_local_caja_detalle v
		WHERE v.usuario_crea = :user
		AND v.id_local_caja = :id
		AND v.liquidado = 0
		AND v.tipo = 'I'
		GROUP BY v.id_local_caja
		UNION
            -- la caja egresos
		SELECT	
			'1' id_tipo_moneda,
			'SOL' tipo_moneda,
			'KE' id_forma_pago,
			'CAJA EGRESOS' forma_pago,
			CONCAT('-',SUM(v.importe)) total
		FROM fac_local_caja_detalle v
		WHERE v.usuario_crea = :user
		AND v.id_local_caja = :id
		AND v.liquidado = 0
		AND v.tipo = 'E'
		GROUP BY v.id_local_caja
        ) o
        ORDER BY o.id_tipo_moneda;
        ";
        $parms = [
            ':id' => $this->_form->_keyLocalCaja,
            ':user' => $this->_usuario
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qFechasVentaCloseCaja() {
        $query = "
        SELECT 
		GROUP_CONCAT(DISTINCT DATE_FORMAT(v.fecha_emision, '%d-%m-%Y')) fecha
        FROM fac_venta v
        WHERE v.usuario_crea = :usuario
        AND v.id_local_caja = :id
        AND v.liquidado = 0";
        $parms = [
            ':id' => $this->_form->_keyLocalCaja,
            ':usuario' => $this->_usuario
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qOpenCaja() {
        $query = "CALL sp_facturacion_venta_aperturar_caja(:id,:persona,:importe,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':id' => $this->_form->_idLocalCaja,
            ':persona' => $this->_idPersona,
            ':importe' => $this->_form->_importe,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function spCloseCaja() {
        $query = "CALL sp_facturacion_venta_cerrar_caja(:id,:persona,:observaciones,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':id' => $this->_form->_keyLocalCaja,
            ':persona' => $this->_idPersona,
            ':observaciones' => $this->_form->txt_observaciones,
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
    
    protected function qtNumGuia() {
        $query = "
        SELECT
                (numero_actual + 1) numero
        FROM fac_serie
        WHERE id_serie = :serie";
        $parms = [
            ':serie' => $this->_form->_serie
        ];

        return $this->getRow($query, $parms);
    }

}
