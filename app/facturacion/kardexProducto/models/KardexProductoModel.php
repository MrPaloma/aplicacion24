<?php
/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        26-09-2018 19:09:26 
* Descripcion : KardexProductoModel.php
* ---------------------------------------
*/ 

namespace Facturacion\KardexProducto\Models;
  
class KardexProductoModel extends \Vendor\DataBase {
    
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
    
    protected function qHead() {
        $query = "
        SELECT
                a.id_local_producto,
                c.catalogo,
                u.unidad_medida,
                a.stock_actual,
                a.precio_compra,
                a.precio_venta
        FROM fac_local_producto a
        INNER JOIN fac_catalogo c ON c.id_catalogo = a.id_catalogo
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        WHERE a.id_local_producto = :id
        ";
        $parms = [
            ':id' => $this->_form->lst_producto
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qDetail() {
        $query = "
        select 
                convert(k.fecha_crea,date) fecha,
                k.tipo_movimiento,
                k.tipo_documento,
                k.descripcion,
                (select serie from fac_serie f where f.id_serie = k.id_serie) serie,
                k.numero_documento,
                k.cantidad,
                k.precio_unitario,
                k.total_unitario,
                k.precio_promedio
        from fac_kardex k
        where k.id_local_producto = :id
        ";
        $parms = [
            ':id' => $this->_form->lst_producto
        ];

        return $this->getRows($query, $parms);
    }
    
}