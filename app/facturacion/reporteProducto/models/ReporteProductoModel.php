<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        24-09-2018 06:09:02 
 * Descripcion : ReporteProductoModel.php
 * ---------------------------------------
 */

namespace Facturacion\ReporteProducto\Models;

class ReporteProductoModel extends \Vendor\DataBase {

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

    protected function qCategoriaLocal() {
        $query = "
        SELECT 
                distinct
                c.id_categoria,
                ct.categoria
        FROM fac_local_producto lp
        INNER JOIN fac_catalogo c ON c.id_catalogo = lp.id_catalogo
        INNER JOIN fac_categoria ct ON ct.id_categoria = c.id_categoria
        WHERE lp.id_local = :local
        AND lp.eliminado = 0
        order by ct.categoria;
        ";
        $parms = [
            ':local' => $this->_form->_keyLocal
        ];

        return $this->getRows($query, $parms);
    }

    protected function qProductoCategoriaLocal() {
        $query = "
        SELECT 
                c.id_categoria,
                c.catalogo,
                lp.precio_publico,
                lp.stock_actual,
                u.unidad_medida,
                lp.activo
        FROM fac_local_producto lp
        INNER JOIN fac_catalogo c ON c.id_catalogo = lp.id_catalogo
        INNER JOIN fac_categoria ct ON ct.id_categoria = c.id_categoria
        INNER JOIN fac_unidad_medida u ON u.id_unidad_medida = c.id_unidad_medida
        WHERE lp.id_local = :local
        AND lp.eliminado = 0
        AND lp.activo = 1
        ORDER BY c.catalogo;
        ";
        $parms = [
            ':local' => $this->_form->_keyLocal
        ];

        return $this->getRows($query, $parms);
    }

}
