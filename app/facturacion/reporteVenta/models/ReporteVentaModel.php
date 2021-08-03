<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        24-09-2018 06:09:51 
 * Descripcion : ReporteVentaModel.php
 * ---------------------------------------
 */

namespace Facturacion\ReporteVenta\Models;

class ReporteVentaModel extends \Vendor\DataBase {

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

    protected function qVentasLocal() {
        $query = "
        SELECT
                v.id_local,
                l.local,
                SUM(v.total_venta) total
        FROM fac_venta v
        INNER JOIN fac_local l ON l.id_local = v.id_local
        WHERE v.fecha_emision BETWEEN :desde AND :hasta
        AND v.anulado = 0
        GROUP BY v.id_local;
        ";
        $parms = [
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }

    protected function qTotalesLocal() {
        $query = "
        SELECT 
                SUM(total_venta) total_venta_bruta,
                SUM(total_gravada) total_venta_neta,
                SUM(total_igv) total_igv,  
                SUM(total_utilidad) total_utilidad
        FROM fac_venta v
        WHERE v.id_local = :local
        AND v.anulado = 0
        AND v.eliminado = 0
        AND v.fecha_emision BETWEEN :desde AND :hasta 
        ";
        $parms = [
            ':local' => $this->_form->_keyLocal,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qDocumentosLocal() {
        $query = "
        SELECT 
                d.serie,
                v.numero_documento,
                e.razon_social,
                v.fecha_emision,
                v.total_venta,
                total_gravada,
                total_igv,  
                total_utilidad,
                v.anulado
        FROM fac_venta v
        INNER JOIN fac_serie d ON d.id_serie = v.id_serie
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        WHERE v.id_local = :local
        AND v.fecha_emision BETWEEN :desde AND :hasta 
        ORDER BY v.fecha_crea ASC;
        ";
        $parms = [
            ':local' => $this->_form->_keyLocal,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qCategoriasLocal() {
        $query = "
        SELECT  
		ct.id_categoria,
		ct.categoria,
                SUM(v.total_venta) total,
                SUM(d.total) t
        FROM fac_venta v
        INNER JOIN fac_venta_detalle d ON d.id_venta = v.id_venta
        INNER JOIN fac_local_producto lp ON lp.id_local_producto = d.id_local_producto
        INNER JOIN fac_catalogo c ON c.id_catalogo = lp.id_catalogo
        INNER JOIN fac_categoria ct ON ct.id_categoria = c.id_categoria
        WHERE v.id_local = :local
        AND v.anulado = 0
        AND v.fecha_emision BETWEEN :desde AND :hasta 
        GROUP BY ct.id_categoria
        ORDER BY ct.categoria;
        ";
        $parms = [
            ':local' => $this->_form->_keyLocal,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qVentasGeneral() {
        $query = "
        SELECT 
                v.id_local_caja,
                c.caja,
                v.id_tipo_moneda,
                tm.tipo_moneda,
                v.id_forma_pago,
                f.forma_pago,
                CONCAT(er.serie,'-',v.numero_documento) num_doc,
                e.razon_social,
                v.fecha_emision,
                IF(v.anulado = 1,CONCAT('-',v.total_venta),v.total_venta) total_venta,
                v.anulado,
                v.pagado,
                pp.nombre_completo vendedor
              
        FROM fac_venta v 
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN fac_forma_pago f ON f.id_forma_pago = v.id_forma_pago
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        INNER JOIN fac_serie er ON er.id_serie = v.id_serie
        INNER JOIN app_usuario AS uu ON uu.id_usuario = v.usuario_crea
        INNER JOIN app_persona AS pp ON pp.id_persona = uu.id_persona

        WHERE v.id_local = :local
        AND v.fecha_emision BETWEEN :desde AND :hasta
        
        ORDER BY v.id_tipo_moneda,v.id_forma_pago,v.fecha_emision;
        
        -- ORDER BY v.id_local_caja,v.id_tipo_moneda,v.id_forma_pago,v.fecha_emision
        ";
        $parms = [
            ':local' => $this->_form->_local,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qVentasEfectivoPagado() {
        $query = "
        SELECT 
                v.id_local_caja,
                c.caja,
                v.id_tipo_moneda,
                tm.tipo_moneda,
                SUM(v.total_venta) total_venta
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        WHERE v.id_local = :local
        AND v.id_forma_pago = :forma_pago
        AND v.pagado = 1
        AND v.anulado = 0
        AND v.fecha_emision BETWEEN :desde AND :hasta
        GROUP BY v.id_tipo_moneda
        ORDER BY v.id_tipo_moneda;
        ";
        $parms = [
            ':forma_pago' => '008',
            ':local' => $this->_form->_local,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qVentasEfectivoCredito() {
        $query = "
        SELECT 
                v.id_local_caja,
                c.caja,
                v.id_tipo_moneda,
                tm.tipo_moneda,
                SUM(v.total_venta) total_venta
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        WHERE v.id_local = :local
        AND v.id_forma_pago = :forma_pago
        AND v.pagado = 0
        AND v.anulado = 0
        AND v.fecha_emision BETWEEN :desde AND :hasta
        GROUP BY v.id_tipo_moneda
        ORDER BY v.id_tipo_moneda;
        ";
        $parms = [
            ':forma_pago' => '008',
            ':local' => $this->_form->_local,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qCajaChica() {
        $query = "
        SELECT
                a.id_local_caja,
                c.caja,
                b.concepto,
                b.importe,
                b.fecha,
                b.tipo
        FROM fac_local_caja a
        INNER JOIN fac_local_caja_detalle b ON b.id_local_caja = a.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = a.id_caja
        WHERE a.id_local = :local
        AND b.fecha BETWEEN :desde AND :hasta
        ORDER BY a.id_local_caja,b.tipo,b.fecha;
        ";
        $parms = [
            ':local' => $this->_form->_local,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qPorCobrar() {
        $query = "
        SELECT 
                v.id_entidad,
                e.razon_social,
                SUM(a.deuda) deuda,
                SUM(a.saldo) saldo,
                v.fecha_emision
        FROM fac_cta_entidad a
        INNER JOIN fac_venta v ON v.id_venta = a.id_venta
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        WHERE a.saldo > 0
        AND v.id_local = :local
        AND v.fecha_emision BETWEEN :desde AND :hasta
        GROUP BY v.id_entidad
        ORDER BY e.razon_social;
        ";
        $parms = [
            ':local' => $this->_form->_local,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qPorPagar() {
        $query = "
        SELECT 
                v.id_proveedor,
                e.razon_social,
                SUM(a.deuda) deuda,
                SUM(a.saldo) saldo,
                v.fecha_compra
        FROM fac_cta_pagar a
        INNER JOIN fac_compra v ON v.id_compra = a.id_compra
        INNER JOIN fac_proveedor e ON e.id_proveedor = v.id_proveedor
        INNER JOIN fac_local_caja c ON c.id_local_caja = v.id_local_caja
        WHERE a.saldo > 0
        and c.id_local = :local
        and v.fecha_compra between :desde and :hasta
        GROUP BY v.id_proveedor
        ORDER BY v.fecha_compra;
        ";
        $parms = [
            ':local' => $this->_form->_local,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->_hasta)
        ];

        return $this->getRows($query, $parms);
    }

}
