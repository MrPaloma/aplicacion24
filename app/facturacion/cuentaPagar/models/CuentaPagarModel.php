<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        21-09-2018 05:09:23 
* Descripcion : CuentaPagarModel.php
* ---------------------------------------
*/ 

namespace Facturacion\CuentaPagar\Models;
  
class CuentaPagarModel extends \Vendor\DataBase {
    
    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_idCliente;
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
        $this->_idPersona = Obj()->Vendor->Session->get('app_idPersona');

        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }
    
    //--------------------------------------------
    protected function spGrid() {
        $query = "CALL sp_facturacion_ctapagar_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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


    protected function qFindPago() {
        $query = "
        SELECT
                c.id_cta_pagar,
                c.deuda,
                c.saldo,
                v.fecha_compra,
                v.txt_serie serie,
                v.id_compra,
                p.razon_social,
                tm.simbolo,
                v.tipo_cambio,
                concat(v.txt_serie,'-',v.numero_documento) numero_documento,
                p.id_proveedor
        FROM fac_cta_pagar c
        INNER JOIN fac_compra v ON v.id_compra = c.id_compra
        INNER JOIN fac_proveedor p ON p.id_proveedor = v.id_proveedor
        INNER JOIN app_tipo_moneda tm ON tm.id_tipo_moneda = v.id_tipo_moneda
        WHERE v.id_compra = :key
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }
    //--------------------------------------
    protected function qGetProveedor() {
        $query = "
        SELECT  DISTINCT
                e.id_proveedor id,
                CONCAT(p.documento_identidad,' ',e.razon_social) value
        FROM fac_cta_pagar c 
        INNER JOIN fac_compra v ON v.id_compra = c.id_compra
        INNER JOIN fac_proveedor e ON e.id_proveedor = v.id_proveedor
        INNER JOIN app_persona p ON p.id_persona = e.id_persona
        WHERE e.id_cliente = :cliente
        AND (
                p.documento_identidad = '" . $this->_form->term . "'
                OR e.razon_social LIKE '%" . $this->_form->term . "%'
        );
        ";
        $parms = [
            ':cliente' => $this->_idCliente
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qGetCuenta() {
        $query = "
        SELECT
                c.id_cta_pagar,
                c.deuda,
                c.saldo,
                v.fecha_compra,
                v.txt_serie serie,
                v.numero_documento,
                v.id_compra
        FROM fac_cta_pagar c
        INNER JOIN fac_compra v ON v.id_compra = c.id_compra
        WHERE v.id_proveedor = :proveedor
        AND c.saldo > 0
        ORDER BY v.fecha_compra
        ";
        $parms = [
            ':proveedor' => $this->_form->_idProveedor
        ];

        return $this->getRows($query, $parms);
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
    
    protected function gGetPagos() {
        $query = "
        SELECT
                id_cta_pagar_pago,
                fecha_pago,
                importe_pago,
                id_cta_pagar
        FROM fac_cta_pagar_pago
        WHERE id_cta_pagar = :key
        ORDER BY fecha_pago DESC;
        ";
        $parms = [
            ':key' => $this->_form->_ketCta
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function spPagar() {
        $query = "CALL sp_facturacion_ctapagar_mantenimiento (:flag,:key,:keyCaja,:ketCta,:importe,:fecha,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':keyCaja' => @$this->_form->_keyCaja,
            ':ketCta' => @$this->_form->_ketCta,
            ':importe' => @$this->_form->txt_importe,
            ':fecha' => @$this->_form->txt_fecha,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
         
        return $this->getRow($query, $parms);
    }
    
}