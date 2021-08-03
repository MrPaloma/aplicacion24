<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        12-09-2018 20:09:46 
* Descripcion : CompraModel.php
* ---------------------------------------
*/ 

namespace Facturacion\Compra\Models;
  
class CompraModel extends \Vendor\DataBase {
    
    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_idCliente;
    private $_pFilterCols;
    private $_idLocal;
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
        $this->_idPersona = Obj()->Vendor->Session->get('app_idPersona');

        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }
    
    protected function spGrid() {
        $query = "CALL sp_facturacion_compra_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
    
    protected function qGetProducto() {
        $query = "
        SELECT
                " . $this->_form->f . " fila,
                a.id_catalogo id,
                a.catalogo value,
                u.codigo unidad_medida,
                lp.precio_publico,
                lp.precio_distribuidor,
                lp.precio_ferreteria
        FROM fac_catalogo a 
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = a.id_unidad_medida
        inner join fac_categoria ca on ca.id_categoria = a.id_categoria
        inner join fac_local_producto lp on a.id_catalogo = lp.id_catalogo
        WHERE ca.id_cliente = :cliente AND lp.id_local = " . $this->_form->local . " 
        AND";

        $busqueda = "";

        foreach ( $this->_form->term as $valor) {
            if ($valor != "") {
                $busqueda .= " a.catalogo LIKE '%" . $valor .  "%' AND";
            }
        }

        $busqueda = substr($busqueda, 0, -3);
        $busqueda = $busqueda . " group by a.id_catalogo, a.catalogo, u.codigo, lp.precio_publico, lp.precio_distribuidor, lp.precio_ferreteria";
        $query .= $busqueda;
        
        $parms = [
            ':cliente' => $this->_idCliente
        ];

        $result = $this->getRows($query, $parms);

        return $result;
    }

    protected function qGetUltimasCompras() {
        $query = " SELECT 
                    " . $this->_form->f . " fila, 
                    '" . $this->_form->_alias . "' alias,
                    true cantidad,
                    a.id_catalogo id,
                    u.codigo unidad_medida,
                    tc.tipo_comprobante tipo_comprobante,
                    DATE(cd.fecha_crea) fecha,
                    p.razon_social proveedor,
                    cd.cantidad cantidad,
                    a.catalogo value,
                    cd.sub_total sub_total,
                    cd.total total,
                    cd.precio_unitario precio_unitario,
                    m.simbolo simbolo,
                    c.tipo_cambio tipo_cambio
                    FROM fac_catalogo a 
                    INNER JOIN fac_unidad_medida u 
                    ON u.id_unidad_medida = a.id_unidad_medida
                    inner join fac_categoria ca 
                    on ca.id_categoria = a.id_categoria
                    inner join fac_local_producto lp
                    on lp.id_catalogo = a.id_catalogo
                    inner join fac_compra_detalle cd
                    on lp.id_local_producto = cd.id_local_producto
                    inner join fac_compra c
                    on cd.id_compra = c.id_compra
                    inner join fac_proveedor p
                    on c.id_proveedor = p.id_proveedor
                    inner join fac_tipo_comprobante tc
                    on c.id_tipo_comprobante = tc.id_tipo_comprobante
                    inner join app_tipo_moneda m
                    on c.id_tipo_moneda = m.id_tipo_moneda
                    WHERE ca.id_cliente = :cliente AND a.id_catalogo = " . $this->_form->id_catalogo . " ORDER BY cd.fecha_crea DESC";

                    $parms = [
                        ':cliente' => $this->_idCliente
                    ];
                    
                    $result = $this->getRows($query, $parms);

                    $count = count($result);

                    if ( $count == 0 ) {
                        $query = " SELECT 
                                " . $this->_form->f . " fila, 
                                '" . $this->_form->_alias . "' alias,
                                false cantidad";

                        $parms = [
                            
                        ];
                        $result = $this->getRows($query, $parms);
                    }

                    return $result;
    }
    
    protected function spMantenimiento() {

        $query = "CALL sp_facturacion_compra_mantenimiento ("
                . ":clienteApp,"
                . ":flag,"
                . ":key,"
                . ":keyCaja,"
                . ":tipo_doc,"
                . ":serie,"
                . ":num_doc,"
                . ":fecha_compra,"
                . ":tipo_moneda,"
                . ":tipo_cambio,"
                . ":orden_compra,"
                . ":proveedor,"
                . ":guia_remitente,"
                . ":hhbbproducto,"
                . ":cantidad,"
                . ":tipo_igv,"
                . ":precio,"
                . ":subtotal,"
                . ":totalUnitario,"
                . ":aplica_igv,"
                . ":observaciones,"
                . ":gravada,"
                . ":igv,"
                . ":totalCompra,"
                . ":pagado,"
                . ":formaPago,"
                . ":local,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname,"
                . ":pvpub,"
                . ":gpub,"
                . ":pvfer,"
                . ":gfer,"
                . ":pvdis,"
                . ":gdis"
                . "); ";
        $parms = [
            ':clienteApp' => @$this->_idCliente,
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':keyCaja' => @$this->_form->_keyCaja,
            ':tipo_doc' => @$this->_form->lst_tipo_doc,
            ':serie' => @$this->_form->txt_serie,
            ':num_doc' => @$this->_form->txt_num_doc,
            ':fecha_compra' => @$this->_form->txt_fecha_compra,
            ':tipo_moneda' => @$this->_form->lst_tipo_moneda,
            ':tipo_cambio' => @$this->_form->txt_tipo_cambio,
            ':orden_compra' => @$this->_form->txt_orden_compra,
            ':proveedor' => @$this->_form->lst_proveedor,
            ':guia_remitente' => @$this->_form->txt_guia_remitente_tmp,
            ':hhbbproducto' => @implode(',', $this->_form->hhbbproducto), //[]
            ':cantidad' => @implode(',', $this->_form->txt_cantidad), //[]
            ':tipo_igv' => @implode(',', $this->_form->lst_tipo_igv), //[]
            ':precio' => @implode(',', $this->_form->txt_precio), //[]
            ':subtotal' => @implode(',', $this->_form->txt_subtotal), //[]
            ':totalUnitario' => @implode(',', $this->_form->txt_total_unitario), //[]
            ':aplica_igv' => @implode(',', $this->_form->lst_aplica_igv), //[]
            ':observaciones' => @$this->_form->txt_observaciones,
            ':gravada' => @$this->_form->txt_gravada,
            ':igv' => @$this->_form->txt_igv,
            ':totalCompra' => @$this->_form->txt_total,
            ':pagado' => @($this->_form->rd_pagado)?$this->_form->rd_pagado:0,
            ':formaPago' => @$this->_form->lst_forma_pago,
            ':local' => @$this->_form->lst_local,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName,
            ':pvpub' => @implode(',', $this->_form->txt_pv_pub),
            ':gpub' => @implode(',', $this->_form->txt_ganancia_pub),
            ':pvfer' => @implode(',', $this->_form->txt_pv_fer),
            ':gfer' => @implode(',', $this->_form->txt_ganancia_fer),
            ':pvdis' => @implode(',', $this->_form->txt_pv_dis),
            ':gdis' => @implode(',', $this->_form->txt_ganancia_dis)
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qDocCompraHead() {
        $query = "
        SELECT 
                c.id_compra,
                c.txt_serie serie,
                c.numero_documento,
                t.tipo_moneda,
                c.tipo_cambio,
                t.codigo,
                t.simbolo,
                p.documento_identidad,
                pr.razon_social,
                c.fecha_compra,
                c.total_gravada,
                c.total_igv,
                c.total_compra,
                tc.tipo_comprobante
        FROM fac_compra c
        INNER JOIN app_tipo_moneda t ON t.id_tipo_moneda = c.id_tipo_moneda
        INNER JOIN fac_proveedor pr ON pr.id_proveedor = c.id_proveedor
        INNER JOIN app_persona p ON p.id_persona = pr.id_persona
        INNER JOIN fac_tipo_comprobante tc ON tc.id_tipo_comprobante = c.id_tipo_comprobante
        WHERE c.id_compra = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key
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
    
    protected function qDocCompraDetail() {
        $query = "
        select 
                c.catalogo,
                d.cantidad,
                d.precio_unitario,
                d.sub_total,
                d.total
        from fac_compra_detalle d
        inner join fac_local_producto p on p.id_local_producto = d.id_local_producto
        inner join fac_catalogo c on c.id_catalogo = p.id_catalogo
        where d.id_compra = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRows($query, $parms);
    }
    
    //funciones para el modal editar compra
    protected function qFindCompra() {
        $query = "
        SELECT 
            fc.id_tipo_comprobante,
            fc.txt_serie,
            fc.numero_documento,
            fc.fecha_compra,
            p.id_local,
            fc.id_tipo_moneda,
            fc.id_proveedor,
            fc.numero_guia_remision,
            fc.orden_compra,
            fc.tipo_cambio,
            fc.pagado,
            fc.id_forma_pago,
            fc.observaciones,
            fc.total_gravada,
            fc.total_igv,
            fc.total_compra,

            c.id_catalogo,
            c.catalogo,
            ud.codigo,
            d.cantidad,
            d.precio_unitario,
            d.sub_total,
            d.total,
            d.aplica_igv,
            p.precio_compra_real,
            p.precio_publico,
            p.precio_ferreteria,
            p.precio_distribuidor,
            p.ganancia_publico,
            p.ganancia_ferreteria,
            p.ganancia_distribuidor
        FROM fac_compra_detalle d
        INNER JOIN fac_compra fc ON d.id_compra = fc.id_compra
        INNER JOIN fac_local_producto p ON p.id_local_producto = d.id_local_producto
        INNER JOIN fac_catalogo c ON c.id_catalogo = p.id_catalogo
        INNER JOIN fac_unidad_medida ud ON ud.id_unidad_medida = c.id_unidad_medida
        WHERE d.id_compra = :key;
        
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRows($query, $parms);
    }


    protected function recuperar() {
        $query = "
        SELECT 
            d.cantidad,
            p.id_local_producto,
            p.stock_actual
        FROM fac_compra_detalle d
        INNER JOIN fac_local_producto p ON p.id_local_producto = d.id_local_producto
        WHERE d.id_compra = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        $recuperar = $this->getRows($query, $parms);

        foreach ($recuperar as $value) {
            $stock_actual = $value['stock_actual'] - $value['cantidad'];
            $id_local_producto = $value['id_local_producto'];
            $query1 ="
            UPDATE fac_local_producto SET 
            stock_actual = :stock_actual
            WHERE id_local_producto= :id_local_producto
            ";
            $parms1 = [
                ':stock_actual' => $stock_actual,
                ':id_local_producto' => $id_local_producto
            ];

            $this->execute($query1, $parms1);
        }

    }

    protected function borrarcd() {
        $query = "
        DELETE FROM fac_compra_detalle 
        WHERE id_compra = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        $this->execute($query, $parms);

    }

    protected function borrarc() {
        $query = "
        DELETE FROM fac_compra 
        WHERE id_compra = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        $this->execute($query, $parms);

    }

    protected function borrark() {
        $query = "
        SELECT concat(txt_serie,'-',numero_documento) numero_documento FROM fac_compra
        WHERE id_compra = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        $recuperar = $this->getRows($query, $parms);

        foreach ($recuperar as $value) {
            $numero_documento = $value['numero_documento'];
            
            $query1 = "
            DELETE FROM fac_Kardex 
            WHERE numero_documento = :numero_documento
            ";
            $parms1 = [
                ':numero_documento' => $numero_documento
            ];

            $this->execute($query1, $parms1);
            
            //borrar la compra de caja chica
            //caja chica
            $concepto = "Compra con doc. ref.: ".$value['numero_documento'];
            $query = "
            DELETE FROM fac_local_caja_detalle
            WHERE concepto = :concepto
            ";
            $parms = [
                ':concepto' => $concepto
            ];

            $this->execute($query, $parms);
        }

    }


    protected function spMantenimientoe() {

        $query = "CALL sp_facturacion_compra_mantenimiento ("
                . ":clienteApp,"
                . ":flag,"
                . ":key,"
                . ":keyCaja,"
                . ":tipo_doc,"
                . ":serie,"
                . ":num_doc,"
                . ":fecha_compra,"
                . ":tipo_moneda,"
                . ":tipo_cambio,"
                . ":orden_compra,"
                . ":proveedor,"
                . ":guia_remitente,"
                . ":hhbbproducto,"
                . ":cantidad,"
                . ":tipo_igv,"
                . ":precio,"
                . ":subtotal,"
                . ":totalUnitario,"
                . ":aplica_igv,"
                . ":observaciones,"
                . ":gravada,"
                . ":igv,"
                . ":totalCompra,"
                . ":pagado,"
                . ":formaPago,"
                . ":local,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname,"
                . ":pvpub,"
                . ":gpub,"
                . ":pvfer,"
                . ":gfer,"
                . ":pvdis,"
                . ":gdis"
                . "); ";
        $parms = [
            ':clienteApp' => @$this->_idCliente,
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':keyCaja' => @$this->_form->_keyCaja,
            ':tipo_doc' => @$this->_form->elst_tipo_doc,
            ':serie' => @$this->_form->etxt_serie,
            ':num_doc' => @$this->_form->etxt_num_doc,
            ':fecha_compra' => @$this->_form->etxt_fecha_compra,
            ':tipo_moneda' => @$this->_form->elst_tipo_moneda,
            ':tipo_cambio' => @$this->_form->etxt_tipo_cambio,
            ':orden_compra' => @$this->_form->etxt_orden_compra,
            ':proveedor' => @$this->_form->elst_proveedor,
            ':guia_remitente' => @$this->_form->etxt_guia_remitente_tmp,
            ':hhbbproducto' => @implode(',', $this->_form->ehhbbproducto), //[]
            ':cantidad' => @implode(',', $this->_form->etxt_cantidad), //[]
            ':tipo_igv' => @implode(',', $this->_form->elst_tipo_igv), //[]
            ':precio' => @implode(',', $this->_form->etxt_precio), //[]
            ':subtotal' => @implode(',', $this->_form->etxt_subtotal), //[]
            ':totalUnitario' => @implode(',', $this->_form->etxt_total_unitario), //[]
            ':aplica_igv' => @implode(',', $this->_form->elst_aplica_igv), //[]
            ':observaciones' => @$this->_form->etxt_observaciones,
            ':gravada' => @$this->_form->etxt_gravada,
            ':igv' => @$this->_form->etxt_igv,
            ':totalCompra' => @$this->_form->etxt_total,
            ':pagado' => @($this->_form->erd_pagado)?$this->_form->erd_pagado:0,
            ':formaPago' => @$this->_form->elst_forma_pago,
            ':local' => @$this->_form->elst_local,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName,
            ':pvpub' => @implode(',', $this->_form->etxt_pv_pub),
            ':gpub' => @implode(',', $this->_form->etxt_ganancia_pub),
            ':pvfer' => @implode(',', $this->_form->etxt_pv_fer),
            ':gfer' => @implode(',', $this->_form->etxt_ganancia_fer),
            ':pvdis' => @implode(',', $this->_form->etxt_pv_dis),
            ':gdis' => @implode(',', $this->_form->etxt_ganancia_dis)
        ];

        return $this->getRow($query, $parms);
    }

}