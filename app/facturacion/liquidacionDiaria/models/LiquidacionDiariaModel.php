<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        02-12-2018 06:12:51 
* Descripcion : LiquidacionDiariaModel.php
* ---------------------------------------
*/ 

namespace Facturacion\LiquidacionDiaria\Models;
  
class LiquidacionDiariaModel extends \Vendor\DataBase {
    
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
    
    protected function qVentas($a) {
        $query = "
        SELECT 
                c.id_caja,
                c.caja,
                d.serie,
                v.numero_documento,
                v.id_tipo_moneda,
                tm.tipo_moneda,
                v.fecha_emision,
                v.total_venta,
                e.razon_social,
                f.catalogo
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN fac_serie d ON d.id_serie = v.id_serie
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        INNER JOIN fac_venta_detalle j ON j.id_venta = v.id_venta
        INNER JOIN fac_local_producto p ON j.id_local_producto = p.id_local_producto
        INNER JOIN fac_catalogo f ON f.id_catalogo = p.id_catalogo
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        AND v.anulado = :anulado
        ORDER BY c.id_caja,v.id_tipo_moneda,v.fecha_emision;
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta),
            ':anulado' => $a
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qMonedas($a) {
        $query = "
        SELECT 	DISTINCT
                lc.id_caja,
                v.id_tipo_moneda,
                tm.tipo_moneda
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN fac_serie d ON d.id_serie = v.id_serie
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        WHERE v.usuario_crea =  :user
        AND v.anulado = :anulado
        AND v.fecha_emision BETWEEN :desde AND :hasta;
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta),
            ':anulado' => $a
        ];

        return $this->getRows($query, $parms);
    }      
    
    protected function qCajas($a) {
        $query = "
        SELECT 	DISTINCT
                c.id_caja,
                c.caja
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        AND v.anulado = :anulado
        ORDER BY c.id_caja;
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta),
            ':anulado' => $a
        ];

        return $this->getRows($query, $parms);
    }   
    
    protected function qCajasAll() {
        $query = "
        SELECT 	DISTINCT
                c.id_caja,
                c.caja
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        ORDER BY c.id_caja;
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta)
        ];

        return $this->getRows($query, $parms);
    }   
    
    protected function qMonedasAll() {
        $query = "
        SELECT 	DISTINCT
                lc.id_caja,
                v.id_tipo_moneda,
                tm.tipo_moneda
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN fac_serie d ON d.id_serie = v.id_serie
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN fac_entidad e ON e.id_entidad = v.id_entidad
        WHERE v.usuario_crea =  :user
        AND v.fecha_emision BETWEEN :desde AND :hasta;
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qLiquidacion() {
        $query = "
        -- sin anular
        SELECT 
                c.id_caja,
                v.id_tipo_moneda,
                v.id_forma_pago,
                f.forma_pago,
                SUM(v.total_venta) total
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN fac_forma_pago f ON f.id_forma_pago = v.id_forma_pago
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        AND v.anulado = 0
        AND v.pagado = 1
        GROUP BY c.id_caja,v.id_tipo_moneda,v.id_forma_pago
        UNION
        -- anulados
        SELECT 
                c.id_caja,
                v.id_tipo_moneda,
                'A' id_forma_pago,
                'ANULADOS' forma_pago,
                CONCAT('-',SUM(v.total_venta)) total
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        INNER JOIN fac_forma_pago f ON f.id_forma_pago = v.id_forma_pago
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        AND v.anulado = 1
        GROUP BY c.id_caja,v.id_tipo_moneda
        UNION
        -- creditos
        SELECT 
                c.id_caja,
                v.id_tipo_moneda,
                'C' id_forma_pago,
                'CREDITO' forma_pago,
                SUM(v.total_venta) total
        FROM fac_venta v
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        AND v.pagado = 0
        AND v.anulado = 0
        GROUP BY c.id_caja,v.id_tipo_moneda
        UNION
        -- la caja ingresos
        SELECT
	    l.id_caja,
            '1' id_tipo_moneda,
            'KI' id_forma_pago,
            'CAJA INGRESOS' forma_pago,
            SUM(v.importe) total
        FROM fac_local_caja_detalle v
        INNER JOIN fac_local_caja l ON l.id_local_caja = v.id_local_caja
        WHERE v.usuario_crea = :user
        AND v.fecha BETWEEN :desde AND :hasta
        AND v.tipo = 'I'
        GROUP BY v.id_local_caja
        UNION
        -- la caja egresos
        SELECT
	    l.id_caja,
            '1' id_tipo_moneda,
            'KE' id_forma_pago,
            'CAJA EGRESOS' forma_pago,
            CONCAT('-',SUM(v.importe)) total
        FROM fac_local_caja_detalle v
        INNER JOIN fac_local_caja l ON l.id_local_caja = v.id_local_caja
        WHERE v.usuario_crea = :user
        AND v.fecha BETWEEN :desde AND :hasta
        AND v.tipo = 'E'
        GROUP BY v.id_local_caja
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qCaja($t) {
        $query = "
        SELECT
	    v.concepto,
	    v.importe,
	    v.fecha
        FROM fac_local_caja_detalle v
        INNER JOIN fac_local_caja l ON l.id_local_caja = v.id_local_caja
        WHERE v.usuario_crea = :user
        AND v.fecha BETWEEN :desde AND :hasta
        AND v.tipo = '${t}'
        AND l.id_caja = :caja
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':caja' => $this->_form->_caja,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qCreditos() {
        $query = "
        SELECT 
                CONCAT(h.serie,'-',v.numero_documento) concepto,
                v.fecha_emision fecha,
                v.total_venta importe
        FROM fac_venta v
        INNER JOIN fac_serie h ON h.id_serie = v.id_serie
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        AND v.pagado = 0
        AND v.anulado = 0
        AND v.id_tipo_moneda = :moneda
        AND c.id_caja = :caja
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':moneda' => $this->_form->_tipoMoneda,
            ':caja' => $this->_form->_caja,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qAnulados() {
        $query = "
        SELECT 
                CONCAT(h.serie,'-',v.numero_documento) concepto,
                v.fecha_emision fecha,
                v.total_venta importe
        FROM fac_venta v
        INNER JOIN fac_serie h ON h.id_serie = v.id_serie
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        AND v.anulado = 1
        AND v.id_tipo_moneda = :moneda
        AND c.id_caja = :caja
        ";
        $parms = [
            ':user' => $this->_form->lst_user,
            ':moneda' => $this->_form->_tipoMoneda,
            ':caja' => $this->_form->_caja,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta)
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qFormaPago() {
        $query = "
        SELECT 
                CONCAT(h.serie,'-',v.numero_documento) concepto,
                v.fecha_emision fecha,
                v.total_venta importe
        FROM fac_venta v
        INNER JOIN fac_serie h ON h.id_serie = v.id_serie
        INNER JOIN fac_local_caja lc ON lc.id_local_caja = v.id_local_caja
        INNER JOIN fac_caja c ON c.id_caja = lc.id_caja
        WHERE v.usuario_crea = :user
        AND v.fecha_emision BETWEEN :desde AND :hasta
        AND v.anulado = 0
        AND v.pagado = 1
        AND v.id_forma_pago = :formaPago
        AND v.id_tipo_moneda = :moneda
        AND c.id_caja = :caja
        ";
        $parms = [
            ':formaPago' => $this->_form->_formaPago,
            ':moneda' => $this->_form->_tipoMoneda,
            ':caja' => $this->_form->_caja,
            ':user' => $this->_form->lst_user,
            ':desde' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_desde),
            ':hasta' => Obj()->Vendor->Tools->dateFormatServer($this->_form->txt_hasta)
        ];

        return $this->getRows($query, $parms);
    }

}