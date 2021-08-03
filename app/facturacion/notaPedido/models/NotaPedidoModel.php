<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        25-09-2018 06:09:53 
* Descripcion : NotaPedidoModel.php
* ---------------------------------------
*/ 

namespace Facturacion\NotaPedido\Models;
  
class NotaPedidoModel extends \Vendor\DataBase {
    
    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_idCliente;
    private $_pFilterCols;
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
        $this->_idLocal = Obj()->Vendor->Session->get('app_idLocal');
        
        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }
    
    protected function qGetProducto() {
        $query = "
        SELECT
                " . $this->_form->f . " fila,
                l.id_local_producto id,
                a.catalogo value,
                l.precio_publico precio,
                u.codigo unidad_medida
        FROM fac_local_producto l
        INNER JOIN fac_catalogo a ON a.id_catalogo = l.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = a.id_unidad_medida
        WHERE l.id_local = :local
        AND a.catalogo LIKE '%" . $this->_form->term . "%';
        ";
        $parms = [
            ':local' => $this->_idLocal
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function spMantenimiento() {
        $query = "CALL sp_facturacion_notapedido_mantenimiento ("
                . ":clienteApp,"
                . ":flag,"
                . ":key,"
                . ":hhbbproducto,"
                . ":cantidad,"
                . ":precio,"
                . ":subtotal,"
                . ":totalUnitario,"
                . ":gravada,"
                . ":igv,"
                . ":totalVenta,"
                . ":local,"
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
            ':hhbbproducto' => @implode(',', $this->_form->hhbbproducto), //[]
            ':cantidad' => @implode(',', $this->_form->txt_cantidad), //[]
            ':precio' => @implode(',', $this->_form->txt_precio), //[]
            ':subtotal' => @implode(',', $this->_form->txt_subtotal), //[]
            ':totalUnitario' => @implode(',', $this->_form->txt_total_unitario), //[]
            ':gravada' => @$this->_form->txt_gravada,
            ':igv' => @$this->_form->txt_igv,
            ':totalVenta' => @$this->_form->txt_total,
            ':local' => $this->_idLocal,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }
    
}