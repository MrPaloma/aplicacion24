<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 17:09:53 
* Descripcion : NotaVentaModel.php
* ---------------------------------------
*/ 

namespace Facturacion\NotaVenta\Models;
  
class NotaVentaModel extends \Vendor\DataBase {
    
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
        $this->_idPersona = Obj()->Vendor->Session->get('app_idPersona');

        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }
    
    protected function spGrid() {
        $query = "CALL sp_facturacion_notaventa_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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

    protected function convertirNotaVenta() {
        $query = "UPDATE fac_venta
                    SET id_serie = 10
                    WHERE id_venta = :key";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->execute($query, $parms);
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
    
    protected function qFindVenta() {
        $query = "
        SELECT
            v.numero_documento,
            v.fecha_emision,
            v.id_forma_pago,
            v.id_tipo_moneda,
            v.pagado,
            v.id_entidad,
            v.total_exonerada,
            v.total_inafecta,
            v.total_gravada,
            v.total_igv,
            v.total_gratuita,
            v.total_venta,
            
            c.id_catalogo,
            c.catalogo,

            d.cantidad,

            d.id_tipo_igv,
            d.precio_unitario,
            d.sub_total,
            d.total,
            p.id_local_producto,
            p.stock_actual

           
        FROM fac_venta_detalle d
        INNER JOIN fac_venta v ON d.id_venta = v.id_venta
        INNER JOIN fac_local_producto p ON p.id_local_producto = d.id_local_producto
        INNER JOIN fac_catalogo c ON c.id_catalogo = p.id_catalogo
        WHERE d.id_venta = :key;
        
        ";
        $parms = [
            ':key' => $this->_form->_key
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

    protected function recuperar() {
        $query = "
        SELECT 
            d.cantidad,
            p.id_local_producto,
            p.stock_actual,
            v.id_serie,
            v.numero_documento
        FROM fac_venta_detalle d
        INNER JOIN fac_local_producto p ON p.id_local_producto = d.id_local_producto
        INNER JOIN fac_venta v ON v.id_venta = d.id_venta
        WHERE d.id_venta = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        $recuperar = $this->getRows($query, $parms);

        foreach ($recuperar as $value) {
            $stock_actual = $value['stock_actual'] + $value['cantidad'];
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

    protected function borrark() {
        
        $query = "
        SELECT 
            d.cantidad,
            p.id_local_producto,
            p.stock_actual,
            v.id_serie,
            v.numero_documento
        FROM fac_venta_detalle d
        INNER JOIN fac_local_producto p ON p.id_local_producto = d.id_local_producto
        INNER JOIN fac_venta v ON v.id_venta = d.id_venta
        WHERE d.id_venta = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        $recuperar = $this->getRow($query, $parms);

        $query1 ="
        DELETE FROM fac_kardex
        WHERE numero_documento = :numero_documento AND id_serie = :id_serie
        ";
        $parms1 = [
            ':id_serie' => $recuperar['id_serie'],
            ':numero_documento' => $recuperar['numero_documento']
        ];

        $this->execute($query1, $parms1);

    }

    protected function borrarVenta() {
        
        
        $query = "
        DELETE FROM fac_venta 
        WHERE id_venta = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        $this->execute($query, $parms);

    }

    protected function updateVenta() {
        $query = "
        SELECT
            concat(serie,'-',(numero_actual + 1)) numero_actual
        FROM fac_serie
        WHERE id_serie = 10
        ";
        $parms = [
            
        ];

        $factura = $this->getRows($query, $parms);
        
        foreach ($factura as $value) {
            $numero_actual = $value['numero_actual'];
            $query1 = "
            UPDATE fac_venta SET
            factura = :numero_actual
            WHERE id_venta = :key
            ";
            $parms1 = [
                ':key' => $this->_form->_key,
                ':numero_actual' => $numero_actual
            ];

            $this->execute($query1, $parms1);
        }

            
    }

    protected function updateSerie() {
        //Update a la serie
        $query = "
        UPDATE fac_serie SET
        numero_actual = numero_actual - 1 
        WHERE id_serie = :serie
        ";
        $parms = [
            ':serie' => @$this->_form->lst_serie
        ];

        $this->execute($query, $parms);

        //Extraer el ultimo numero de venta
        $query1 = "
        SELECT MAX(id_venta) AS id_venta 
        FROM fac_venta
        ";
        $parms1 = [
            
        ];

        $resultado = $this->getRow($query1, $parms1);

        // Hacer update al ultimo numero de venta por el actual
        $query2 = "
        UPDATE fac_venta SET
        numero_documento = :numero_documento
        WHERE id_venta = :id_venta
        ";
        $parms2 = [
            ':numero_documento' => @$this->_form->txt_num_doc,
            ':id_venta' => $resultado['id_venta']
        ];

        $this->execute($query2, $parms2);

        // Seleccionar el numero actual de serie
        $query3 = "
        SELECT
            numero_actual + 1 AS numero_actual
        FROM fac_serie
        WHERE id_serie = :serie
        ";
        $parms3 = [
            ':serie' => @$this->_form->lst_serie
        ];

        //Hacer update al kardex
        $nro = $this->getRow($query3, $parms3);
        $query4 = "
        UPDATE fac_kardex SET
        numero_documento = :numero_documento
        WHERE id_serie = 17 AND numero_documento = :nro
        ";
        $parms4 = [
            ':numero_documento' => @$this->_form->txt_num_doc,
            ':nro' => $nro['numero_actual']
        ];

        $this->execute($query4, $parms4);

            
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
    
    //Update devolucion
    protected function updateProductos() {
        
        $total = count(@$this->_form->hhbbproducto);
        //devolver
        $devolver = @$this->_form->txt_cantidad_devolver;
        $observacion = @$this->_form->txt_observacion;
        $contador = 0;
        //producto
        $id_producto = @$this->_form->hhbbproducto;
        $cantidad = @$this->_form->txt_cantidad;
        $precio = @$this->_form->txt_precio;
        $tipo_igv = @$this->_form->lst_tipo_igv;
        $total_unitario = @$this->_form->txt_total_unitario;
        $sub_total = @$this->_form->txt_subtotal;

        for ($i=0; $i < $total; $i++) { 

            if ($devolver[$i] != 0) {

                # Agregar Kardex devolucion
                $query ="
                SELECT k.precio_promedio 
                FROM fac_kardex k 
                WHERE k.id_local_producto = :id_local_producto 
                AND k.tipo_movimiento = 'I' 
                AND k.tipo_documento IN ('C','M') 
                ORDER BY k.fecha_crea DESC LIMIT 1
                ";
                $parms = [
                    ':id_local_producto' => $id_producto[$i]
                ];

                $precio_promedio = $this->getRow($query, $parms);
                $total_unitariok = $precio[$i] * $devolver[$i];
                
                
                $query ="
                INSERT INTO fac_kardex(
                    id_local_producto,
                    id_serie,
                    numero_documento,
                    tipo_movimiento,
                    tipo_documento,
                    descripcion,
                    cantidad,
                    precio_unitario,
                    total_unitario,
                    precio_promedio,
                    usuario_crea,
                    fecha_crea,
                    ip_publica_crea,
                    ip_local_crea,
                    navegador_crea,
                    hostaname_crea
                )VALUE(
                    :id_local_producto,
                    :serie,
                    :numero_documento,
                    'I',
                    'C',
                    'Devolucion',
                    :cantidad,  
                    :precio_unitario,
                    :total_unitario,
                    :precio_promedio,
                    :usuario,
                    NOW(),
                    :ipPublica,
                    :ipLocal,
                    :navegador, 
                    :hostname
                )
                ";
                $parms = [
                    ':id_local_producto' => $id_producto[$i],
                    ':serie' => @$this->_form->lst_serie,
                    ':numero_documento' => @$this->_form->txt_num_doc,
                    ':cantidad' => $devolver[$i],
                    ':precio_unitario' => $precio[$i],
                    ':total_unitario' => $total_unitariok,
                    ':precio_promedio' => $precio_promedio['precio_promedio'],
                    ':usuario' => $this->_usuario,
                    ':ipPublica' => $this->_ipPublica,
                    ':ipLocal' => $this->_ipLocal,
                    ':navegador' => $this->_navegador,
                    ':hostname' => $this->_hostName
                ];

                $this->execute($query, $parms);
            
                # devolver local producto                   
                $query ="
                UPDATE fac_local_producto SET 
                stock_actual = stock_actual + :stock_actual 
                WHERE id_local_producto= :id_local_producto
                ";
                $parms = [
                    ':stock_actual' => $devolver[$i],
                    ':id_local_producto' => $id_producto[$i]
                ];

                $this->execute($query, $parms);

                # restamos el total venta
                if ($tipo_igv[$i] == "10") {

                    # Gravada
                    $igv = (($total_unitario[$i] - $sub_total[$i])/$cantidad[$i])*$devolver[$i];
                    $gravada = ($sub_total[$i]/$cantidad[$i])*$devolver[$i];
                    $total_venta = $devolver[$i]*$precio[$i];


                    $query ="
                    UPDATE fac_venta SET 
                    total_gravada = total_gravada - :gravada,
                    total_igv = total_igv - :igv,
                    total_venta = total_venta - :total_venta
                    WHERE id_venta= :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':gravada' => $gravada,
                        ':igv' => $igv,
                        ':total_venta' => $total_venta 
                    ];

                    $this->execute($query, $parms);
                }
                elseif ($tipo_igv[$i] == "20") {
                    
                    # Exonerada
                    $exonerada = $devolver[$i]*$precio[$i];
                    $total_venta = $devolver[$i]*$precio[$i];
                    $query ="
                    UPDATE fac_venta SET 
                    total_exonerada = total_exonerada - :exonerada,
                    total_venta = total_venta - :total_venta
                    WHERE id_venta= :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':exonerada' => $exonerada,
                        ':total_venta' => $total_venta
                    ];

                    $this->execute($query, $parms);

                }
                elseif ($tipo_igv[$i] == "30" || $tipo_igv[$i] == "40") {
                    # Inafecto and Exportacion
                    $inafecta = $devolver[$i]*$precio[$i];
                    $total_venta = $devolver[$i]*$precio[$i];
                    $query ="
                    UPDATE fac_venta SET 
                    total_inafecta = total_inafecta - :inafecta,
                    total_venta = total_venta - :total_venta
                    WHERE id_venta= :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':inafecta' => $inafecta,
                        ':total_venta' => $total_venta
                    ];

                    $this->execute($query, $parms);

                }
                else {

                    # Gratuita
                    $gratuita = $devolver[$i]*$precio[$i];
                    $query ="
                    UPDATE fac_venta SET 
                    total_gratuita = total_gratuita - :gratuita
                    WHERE id_venta= :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':gratuita' => $gratuita
                    ];

                    $this->execute($query, $parms);
                }

                # Update Utilidad
                $query = "
                SELECT 
                    precio_compra_real 
                FROM fac_local_producto 
                WHERE id_local_producto = :id_local_producto;
                ";
                $parms = [
                    ':id_local_producto' => $id_producto[$i]
                ];
        
                $recuperar = $this->getRow($query, $parms);

                $total_utilidad = ($precio[$i] - $recuperar['precio_compra_real'])* $devolver[$i];

                $query ="
                UPDATE fac_venta SET 
                total_utilidad = total_utilidad - :total_utilidad
                WHERE id_venta= :key
                ";
                $parms = [
                    ':key' => $this->_form->_key,
                    ':total_utilidad' => $total_utilidad 
                ];

                $this->execute($query, $parms);

                # Update Kardex

                # Agregar el Update devolver
                $query ="
                INSERT INTO fac_devolucion(
                    id_local_producto, 
                    id_serie, 
                    numero_documento, 
                    cantidad, 
                    observacion
                    ) 
                VALUES (
                    :id_local_producto,
                    :id_serie,
                    :numero_documento,
                    :cantidad,
                    :observacion
                )
                ";
                $parms = [
                    ':id_local_producto' => $id_producto[$i],
                    ':id_serie' => @$this->_form->lst_serie,
                    ':numero_documento' => @$this->_form->txt_num_doc,
                    ':cantidad' => $devolver[$i],
                    ':observacion' => $observacion[$i]
                ];

                $this->execute($query, $parms);

                #Si devolver es igual a cantidad se elimina el detalle venta
                if ($devolver[$i] == $cantidad[$i]) {                 
                    
                    $contador = $contador + 1;
                    
                    if ($total == $contador) {
                        # Anulamos la nota venta con un update
                        $query = "
                        UPDATE fac_venta SET
                        factura = 'Anulado'
                        WHERE id_venta = :key
                        ";
                        $parms = [
                            ':key' => $this->_form->_key
                        ];

                        $this->execute($query, $parms);

                        $query ="
                        UPDATE fac_venta_detalle SET 
                        cantidad = 0,
                        precio_unitario = 0,
                        sub_total = 0,
                        total_igv = 0,
                        total = 0
                        WHERE id_venta = :key 
                        AND id_local_producto = :id_local_producto
                        ";
                        $parms = [
                            ':key' => $this->_form->_key,
                            ':id_local_producto' => $id_producto[$i]
                        ];

                        $this->execute($query, $parms);
                        
                    }
                    else{

                        # delete detalle venta
                        $query ="
                        DELETE FROM fac_venta_detalle 
                        WHERE id_venta = :key 
                        AND id_local_producto = :id_local_producto
                        ";
                        $parms = [
                            ':key' => $this->_form->_key,
                            ':id_local_producto' => $id_producto[$i]
                        ];
                    }

                } else {

                    # update detalle venta
                    $query ="
                    UPDATE fac_venta_detalle
                    SET cantidad = cantidad - :devolver
                    WHERE id_venta = :key 
                    AND id_local_producto = :id_local_producto
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':devolver' => $devolver[$i],
                        ':id_local_producto' => $id_producto[$i]
                    ];

                    $this->execute($query, $parms);

                    # restamos el total venta detalle
                    if ($tipo_igv[$i] == "10") {

                        # Gravada
                        $igv = (($total_unitario[$i] - $sub_total[$i])/$cantidad[$i])*$devolver[$i];
                        $gravada = ($sub_total[$i]/$cantidad[$i])*$devolver[$i];
                        $total_venta = $devolver[$i]*$precio[$i];


                        $query ="
                        UPDATE fac_venta_detalle SET 
                        sub_total = sub_total - :gravada,
                        total_igv = total_igv - :igv,
                        total = total - :total_venta
                        WHERE id_venta= :key
                        AND id_local_producto = :id_local_producto
                        ";
                        $parms = [
                            ':key' => $this->_form->_key,
                            ':gravada' => $gravada,
                            ':igv' => $igv,
                            ':total_venta' => $total_venta ,
                            ':id_local_producto' => $id_producto[$i]
                        ];

                        $this->execute($query, $parms);

                    } else {

                        # Gravada
                        $gravada = $devolver[$i]*$precio[$i];
                        $total_venta = $devolver[$i]*$precio[$i];


                        $query ="
                        UPDATE fac_venta_detalle SET 
                        sub_total = sub_total - :gravada,
                        total = total - :total_venta
                        WHERE id_venta= :key
                        AND id_local_producto = :id_local_producto
                        ";
                        $parms = [
                            ':key' => $this->_form->_key,
                            ':gravada' => $gravada,
                            ':total_venta' => $total_venta,
                            ':id_local_producto' => $id_producto[$i]
                        ];

                        $this->execute($query, $parms);

                    }

                }
                
            }

        }
  
    }
    
    //Update Anular
    protected function anularProductos() {
        
        $total = count(@$this->_form->hhbbproducto);
        //devolver
        $devolver = @$this->_form->txt_cantidad;
        $contador = 0;
        //producto
        $id_producto = @$this->_form->hhbbproducto;
        $cantidad = @$this->_form->txt_cantidad;
        $precio = @$this->_form->txt_precio;
        $tipo_igv = @$this->_form->lst_tipo_igv;
        $total_unitario = @$this->_form->txt_total_unitario;
        $sub_total = @$this->_form->txt_subtotal;

        for ($i=0; $i < $total; $i++) { 

            if ($devolver[$i] != 0) {

                # Agregar Kardex devolucion
                $query ="
                SELECT k.precio_promedio 
                FROM fac_kardex k 
                WHERE k.id_local_producto = :id_local_producto 
                AND k.tipo_movimiento = 'I' 
                AND k.tipo_documento IN ('C','M') 
                ORDER BY k.fecha_crea DESC LIMIT 1
                ";
                $parms = [
                    ':id_local_producto' => $id_producto[$i]
                ];

                $precio_promedio = $this->getRow($query, $parms);
                $total_unitariok = $precio[$i] * $devolver[$i];
                
                
                $query ="
                INSERT INTO fac_kardex(
                    id_local_producto,
                    id_serie,
                    numero_documento,
                    tipo_movimiento,
                    tipo_documento,
                    descripcion,
                    cantidad,
                    precio_unitario,
                    total_unitario,
                    precio_promedio,
                    usuario_crea,
                    fecha_crea,
                    ip_publica_crea,
                    ip_local_crea,
                    navegador_crea,
                    hostaname_crea
                )VALUE(
                    :id_local_producto,
                    :serie,
                    :numero_documento,
                    'I',
                    'C',
                    'Anulado',
                    :cantidad,  
                    :precio_unitario,
                    :total_unitario,
                    :precio_promedio,
                    :usuario,
                    NOW(),
                    :ipPublica,
                    :ipLocal,
                    :navegador, 
                    :hostname
                )
                ";
                $parms = [
                    ':id_local_producto' => $id_producto[$i],
                    ':serie' => @$this->_form->lst_serie,
                    ':numero_documento' => @$this->_form->txt_num_doc,
                    ':cantidad' => $devolver[$i],
                    ':precio_unitario' => $precio[$i],
                    ':total_unitario' => $total_unitariok,
                    ':precio_promedio' => $precio_promedio['precio_promedio'],
                    ':usuario' => $this->_usuario,
                    ':ipPublica' => $this->_ipPublica,
                    ':ipLocal' => $this->_ipLocal,
                    ':navegador' => $this->_navegador,
                    ':hostname' => $this->_hostName
                ];

                $this->execute($query, $parms);
            
                # devolver local producto                   
                $query ="
                UPDATE fac_local_producto SET 
                stock_actual = stock_actual + :stock_actual 
                WHERE id_local_producto= :id_local_producto
                ";
                $parms = [
                    ':stock_actual' => $devolver[$i],
                    ':id_local_producto' => $id_producto[$i]
                ];

                $this->execute($query, $parms);

                # restamos el total venta
                if ($tipo_igv[$i] == "10") {

                    # Gravada
                    $igv = (($total_unitario[$i] - $sub_total[$i])/$cantidad[$i])*$devolver[$i];
                    $gravada = ($sub_total[$i]/$cantidad[$i])*$devolver[$i];
                    $total_venta = $devolver[$i]*$precio[$i];


                    $query ="
                    UPDATE fac_venta SET 
                    total_gravada = total_gravada - :gravada,
                    total_igv = total_igv - :igv,
                    total_venta = total_venta - :total_venta
                    WHERE id_venta= :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':gravada' => $gravada,
                        ':igv' => $igv,
                        ':total_venta' => $total_venta 
                    ];

                    $this->execute($query, $parms);
                }
                elseif ($tipo_igv[$i] == "20") {
                    
                    # Exonerada
                    $exonerada = $devolver[$i]*$precio[$i];
                    $total_venta = $devolver[$i]*$precio[$i];
                    $query ="
                    UPDATE fac_venta SET 
                    total_exonerada = total_exonerada - :exonerada,
                    total_venta = total_venta - :total_venta
                    WHERE id_venta= :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':exonerada' => $exonerada,
                        ':total_venta' => $total_venta
                    ];

                    $this->execute($query, $parms);

                }
                elseif ($tipo_igv[$i] == "30" || $tipo_igv[$i] == "40") {
                    # Inafecto and Exportacion
                    $inafecta = $devolver[$i]*$precio[$i];
                    $total_venta = $devolver[$i]*$precio[$i];
                    $query ="
                    UPDATE fac_venta SET 
                    total_inafecta = total_inafecta - :inafecta,
                    total_venta = total_venta - :total_venta
                    WHERE id_venta= :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':inafecta' => $inafecta,
                        ':total_venta' => $total_venta
                    ];

                    $this->execute($query, $parms);

                }
                else {

                    # Gratuita
                    $gratuita = $devolver[$i]*$precio[$i];
                    $query ="
                    UPDATE fac_venta SET 
                    total_gratuita = total_gratuita - :gratuita
                    WHERE id_venta= :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key,
                        ':gratuita' => $gratuita
                    ];

                    $this->execute($query, $parms);
                }

                # Update Utilidad
                $query = "
                SELECT 
                    precio_compra_real 
                FROM fac_local_producto 
                WHERE id_local_producto = :id_local_producto;
                ";
                $parms = [
                    ':id_local_producto' => $id_producto[$i]
                ];
        
                $recuperar = $this->getRow($query, $parms);

                $total_utilidad = ($precio[$i] - $recuperar['precio_compra_real'])* $devolver[$i];

                $query ="
                UPDATE fac_venta SET 
                total_utilidad = total_utilidad - :total_utilidad
                WHERE id_venta= :key
                ";
                $parms = [
                    ':key' => $this->_form->_key,
                    ':total_utilidad' => $total_utilidad 
                ];

                $this->execute($query, $parms);


                # Anulamos la nota venta con un update
                $query ="
                UPDATE fac_venta_detalle SET 
                cantidad = 0,
                precio_unitario = 0,
                sub_total = 0,
                total_igv = 0,
                total = 0
                WHERE id_venta = :key 
                AND id_local_producto = :id_local_producto
                ";
                $parms = [
                    ':key' => $this->_form->_key,
                    ':id_local_producto' => $id_producto[$i]
                ];

                $this->execute($query, $parms);
                #Si devolver es igual a cantidad se elimina el detalle venta
               
                $contador = $contador + 1;
                
                if ($total == $contador) {
                    # Anulamos la nota venta con un update
                    $query = "
                    UPDATE fac_venta SET
                    factura = 'Anulado'
                    WHERE id_venta = :key
                    ";
                    $parms = [
                        ':key' => $this->_form->_key
                    ];

                    $this->execute($query, $parms);
                    
                }

                
            }

        }
  
    }
    
}