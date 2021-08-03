<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super  User  
* Fecha:        07-02-2019 16:02:26 
* Descripcion : MovimientoAlmacenModel.php
* ---------------------------------------
*/ 

namespace Facturacion\MovimientoAlmacen\Models;
  
class MovimientoAlmacenModel extends \Vendor\DataBase {
    
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
    
    public function spGrid() {
        $query = "CALL sp_facturacion_movimiento_almacen_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];
        $data = $this->getRows($query, $parms);

        return $data;
    }
    
    protected function spMantenimiento() {
        $query = "CALL sp_facturacion_movimiento_almacen_mantenimiento (:flag,:key,:fecha,:origen,:destino,:observacion,:producto,:cantidad,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':fecha' => @$this->_form->txt_fecha,
            ':origen' => @$this->_form->lst_origen,
            ':destino' => @$this->_form->lst_destino,
            ':observacion' => @$this->_form->txt_observacion,
            ':producto' => @implode(',', $this->_form->hhidproducto),//[]
            ':cantidad' => @implode(',',$this->_form->txt_cantidad),//[]
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
                a.id_catalogo id,
                CONCAT(c.catalogo,' ',u.unidad_medida,' ','(Stock: ',a.stock_actual,')') value,
                a.stock_actual
        FROM fac_local_producto a
        INNER JOIN fac_catalogo c ON c.id_catalogo = a.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        WHERE a.id_local = :local
        AND a.stock_actual > 0
        AND c.catalogo LIKE '%" . $this->_form->term . "%';
        ";
        $parms = [
            ':local' => $this->_form->_idLocal
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qDetalle() {
        $query = "
         SELECT
                c.catalogo,
                d.cantidad,
                l1.local origen,
                l2.local destino,
                a.fecha
        FROM fac_movimiento_almacen_detalle d
        INNER JOIN fac_movimiento_almacen a ON a.id_movimiento_almacen = d.id_movimiento_almacen
        INNER JOIN fac_local l1 ON l1.id_local = a.id_local_origen
        INNER JOIN fac_local l2 ON l2.id_local = a.id_local_destino
        INNER JOIN fac_catalogo c ON c.id_catalogo = d.id_catalogo
         WHERE d.id_movimiento_almacen = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRows($query, $parms);
    }
    
}