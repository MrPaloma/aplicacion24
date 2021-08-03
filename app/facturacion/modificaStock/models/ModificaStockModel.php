<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Adm  
* Fecha:        30-01-2019 06:01:17 
* Descripcion : ModificaStockModel.php
* ---------------------------------------
*/ 

namespace Facturacion\ModificaStock\Models;
  
class ModificaStockModel extends \Vendor\DataBase {
    
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
        $query = "CALL sp_facturacion_modifica_stock_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
        $query = "CALL sp_facturacion_modifica_stock_mantenimiento (:flag,:key,:local,:observacion,:producto,:cantidad,:operacion,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':local' => @$this->_form->lst_local,
            ':observacion' => @$this->_form->txt_observacion,
            ':producto' => @implode(',', $this->_form->hhidproducto),//[]
            ':cantidad' => @implode(',',$this->_form->txt_cantidad),//[]
            ':operacion' => @implode(',',$this->_form->lst_operacion),//[]
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
            a.id_local_producto id,
            CONCAT(c.catalogo,' ',u.unidad_medida,' ','(Stock: ',a.stock_actual,')') value,
            u.unidad_medida,
            a.stock_actual
        FROM fac_local_producto a
        INNER JOIN fac_catalogo c ON c.id_catalogo = a.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        WHERE a.id_local = :local
        AND c.catalogo LIKE '%" . $this->_form->term . "%' OR c.codigo_interno LIKE '%{" . $this->_form->term . "}%';
        ";
        $parms = [
            ':local' => $this->_form->_idLocal
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function volver_cero() {

        $observacion = "Re-Stock";
        $producto = array();
        $stock_actual = array();
        $operacion = array();
        
        //jalare stock actual y esa cantidad lo enviare como cantidad a la consulta preparada en resta

        $query = "
        SELECT 
            id_local_producto,
            stock_actual
        FROM fac_local_producto 
        WHERE id_local = :local
        AND stock_actual != 0";
        $parms = [
            ':local' => @$this->_form->lst_local
        ];
        $resultado = $this->getRows($query, $parms);
        
        $total = count($resultado);

        for ($i=0; $i < $total; $i++) { 
            array_push($producto, $resultado[$i]['id_local_producto']);
            if ($resultado[$i]['stock_actual']>0) {
                array_push($stock_actual, $resultado[$i]['stock_actual']);
                array_push($operacion, "R");
            }
            else {
                array_push($stock_actual, -$resultado[$i]['stock_actual']);
                array_push($operacion, "A");
            }
        }

        
        $query = "CALL sp_facturacion_modifica_stock_mantenimiento (:flag,:key,:local,:observacion,:producto,:cantidad,:operacion,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag, 
            ':key' => @$this->_form->_key,
            ':local' => @$this->_form->lst_local,
            ':observacion' => $observacion,
            ':producto' => @implode(',', $producto),//[]
            ':cantidad' => @implode(',', $stock_actual),//[]
            ':operacion' => @implode(',', $operacion),//[]
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        
        return $this->getRow($query, $parms);
    }
    
    //preview update
    protected function qDetalle() {
        $query = "
        SELECT
        	c.catalogo catalogo,
        	if(asd.operacion = 'A', 'Aumento de Stock', 'Disminución de Stock') as operacion,
            asd.cantidad cantidad,
            asd.stock_anterior stock_anterior,
            lp.stock_actual stock_actual,
            l.local local,
            asd.fecha_crea fecha
        FROM fac_ajuste_stock_detalle asd 
        INNER JOIN fac_local_producto lp ON asd.id_local_producto = lp.id_local_producto
        INNER JOIN fac_catalogo c ON lp.id_catalogo = c.id_catalogo
        INNER JOIN fac_local l ON lp.id_local = l.id_local
        WHERE asd.id_ajuste_stock = :key;
        ";
        $parms = [
            ':key' => @$this->_form->_key
        ];

        return $this->getRows($query, $parms);
    }
}