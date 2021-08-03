<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 17:09:53 
* Descripcion : ReporteDetalladoModel.php
* ---------------------------------------
*/ 

namespace Facturacion\ReporteDetallado\Models;
  
class ReporteDetalladoModel extends \Vendor\DataBase {
    
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
        $query = "CALL sp_facturacion_reporte_detallado_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
}