<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        23-11-2018 04:11:07 
* Descripcion : ClienteModel.php
* ---------------------------------------
*/ 

namespace Cotizar\Cliente\Models;
  
class ClienteModel extends \Vendor\DataBase {
    
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
    
    public function spGrid(){
        $query = "CALL sp_cotizacion_cliente_grid (:idRol,:local,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport,:user);";
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
        $data = $this->getRows($query,$parms);
       
        return $data;
    }
    
    protected function qGetProducto() {
        $query = "
        SELECT
                " . $this->_form->f . " fila,
                l.id_local_producto id,
                a.catalogo value,
                l.precio_publico precio,
                l.precio_ferreteria precio_ferreteria,
                l.precio_distribuidor precio_distribuidor,
                u.codigo unidad_medida,
                l.precio_compra_real
        FROM fac_local_producto l
        INNER JOIN fac_catalogo a ON a.id_catalogo = l.id_catalogo
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
    
    protected function spMantenimiento() {
        $query = "CALL sp_cotizacion_cliente_mantenimiento ("
                . ":flag,"
                . ":key,"
                . ":local,"
                . ":persona,"
                . ":tipo_moneda,"
                . ":tipo_cambio,"
                . ":hhbbproducto,"
                . ":cantidad,"
                . ":precio,"
                . ":totalUnitario,"
                . ":observaciones,"
                . ":total,"
                . ":usuario,"
                . ":ipPublica,"
                . ":ipLocal,"
                . ":navegador,"
                . ":hostname"
                . "); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':local' => @$this->_idLocal,
            ':persona' => @$this->_form->lst_cliente,
            ':tipo_moneda' => @$this->_form->lst_tipo_moneda,
            ':tipo_cambio' => @$this->_form->txt_tipo_cambio,
            ':hhbbproducto' => @implode(',', $this->_form->hhbbproducto), //[]
            ':cantidad' => @implode(',', $this->_form->txt_cantidad), //[]
            ':precio' => @implode(',', $this->_form->txt_precio_unitario), //[]
            ':totalUnitario' => @implode(',', $this->_form->txt_total_unitario), //[]
            ':observaciones' => @$this->_form->txt_observaciones,
            ':total' => @$this->_form->txt_total,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
       
        return $this->getRow($query, $parms);
    }
    
    protected function qHead($id) {
        $query = "
        SELECT
                t.abreviatura tipo_doc_identidad,
                p.documento_identidad,
                e.razon_social,
                c.total,
                c.numero,
                CAST(c.fecha_crea AS DATE) fecha,
                c.observaciones,
                c.id_entidad,
                (SELECT logo FROM fac_cliente) logo,
                c.id_tipo_moneda,
                c.tipo_cambio
        FROM fac_cotizacion c
        INNER JOIN fac_entidad e ON e.id_entidad = c.id_entidad
        INNER JOIN app_persona p ON p.id_persona = e.id_persona
        INNER JOIN app_tipo_documento_identidad t ON t.id_tipo_documento_identidad = p.id_tipo_documento_identidad
        WHERE c.id_cotizacion = :id ;
        ";
        $parms = [
            ':id' => $id
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qDetail($id) {
        $query = "
        SELECT
                k.catalogo,
                c.precio_unitario,
                c.cantidad,
                c.total_unitario,
                c.id_local_producto,
                p.precio_publico precio,
                p.precio_compra_real
        FROM fac_cotizacion_detalle c 
        INNER JOIN fac_local_producto p ON p.id_local_producto = c.id_local_producto
        INNER JOIN fac_catalogo k ON k.id_catalogo = p.id_catalogo
        WHERE c.id_cotizacion = :id
        ORDER BY k.catalogo ;
        ";
        $parms = [
            ':id' => $id
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qCuentas() {
        $query = "
        SELECT
                CONCAT(b.banco,' ',c.tipo_cuenta_banco,' ',d.tipo_moneda) banco,
                a.cuenta_banco
        FROM fac_cliente_cuenta_banco a
        INNER JOIN app_banco b ON b.id_banco = a.id_banco
        INNER JOIN app_tipo_cuenta_banco c ON c.id_tipo_cuenta_banco = a.id_tipo_cuenta_banco	
        INNER JOIN app_tipo_moneda d ON d.id_tipo_moneda = a.id_tipo_moneda
        WHERE a.activo = :activo
        ";
        $parms = [
            ':activo' => 1
        ];

        return $this->getRows($query, $parms);
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
        ";
        $parms = [];

        return $this->getRow($query, $parms);
    }
    
}