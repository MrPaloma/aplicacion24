<?php

/*
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 18:09:43 
 * Descripcion : LocalModel.php
 * ---------------------------------------
 */

namespace Facturacion\Local\Models;

class LocalModel extends \Vendor\DataBase {

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
        $query = "CALL sp_facturacion_local_grid (:idCliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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

    public function spGridProductos() {
        $query = "CALL sp_facturacion_localproductos_grid (:local,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":local" => @$this->_form->_key,
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];
        $data = $this->getRows($query, $parms);

        return $data;
    }

    public function spGridListaProductos() {
        $query = "CALL sp_facturacion_catalogoactivos_grid (:cliente,:key,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":cliente" => @$this->_idCliente,
            ":key" => @$this->_form->_key,
            ":iDisplayStart" => @$this->_form->pDisplayStart,
            ":iDisplayLength" => @$this->_form->pDisplayLength,
            ":pOrder" => $this->_form->pOrder,
            ":pFilterCols" => $this->_pFilterCols,
            ":sExport" => @$this->_form->_sExport
        ];
        $data = $this->getRows($query, $parms);

        return $data;
    }

    protected function mantenimiento() {
        $query = "CALL sp_facturacion_local_mantenimiento (:cliente,:flag,:key,:local,:codigo,:ubigeo,:direccion,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':cliente' => $this->_idCliente,
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':local' => @$this->_form->txt_descripcion,
            ':codigo' => @$this->_form->txt_codigo,
            ':ubigeo' => @$this->_form->_ubigeo,
            ':direccion' => @$this->_form->txt_direccion,
            ':activo' => @($this->_form->chk_activo) ? $this->_form->chk_activo : 0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }

    public function spMantenimientoProductos() {
        $query = "CALL sp_facturacion_localproducto_mantenimiento (:flag,:key,:productos,:stock,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_key,
            ':productos' => isset($this->_form->gridListaProductos_fg_chk) ? implode(',', $this->_form->gridListaProductos_fg_chk) : '',
            ':stock' => @isset($this->_form->txt_stock) ? implode(',', $this->_form->txt_stock) : @$this->_form->_stockInicial,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }
    
    public function qMantenimientoGananciaProductos() {
        $query = "
        UPDATE fac_local_producto SET
                ganancia_publico = :gan_pub,
                precio_publico = precio_compra * ( 1 + :gan_pub/100 ),
                ganancia_ferreteria = :gan_fer,
                precio_ferreteria = precio_compra * ( 1 + :gan_fer/100 ),
                ganancia_distribuidor = :gan_dis,
                precio_distribuidor = precio_compra * ( 1 + :gan_dis/100 )
        WHERE id_local = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':gan_pub' => $this->_form->_gan_pub,
            ':gan_fer' => $this->_form->_gan_fer,
            ':gan_dis' => $this->_form->_gan_dis,
        ];

        $this->execute($query, $parms);
        return 1;
    }

    protected function qFindLocal() {
        $query = "
        SELECT 
                local,
                codigo,
                ubigeo_codigo,
                direccion,
                activo
        FROM fac_local
        WHERE id_local  = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key
        ];

        return $this->getRow($query, $parms);
    }

    protected function spUpdateProducto($cp) {
        $query = "
        UPDATE fac_local_producto SET
                ${cp} = :dato
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }
    
    protected function spUpdateProductoPCR() {
        $query = "
        UPDATE fac_local_producto SET
                precio_compra_real = :dato,
                precio_publico = :dato * ( 1 + ganancia_publico/100),
                precio_ferreteria = :dato * ( 1 + ganancia_ferreteria/100 ),
                precio_distribuidor = :dato * ( 1 + ganancia_distribuidor/100 )
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }

    protected function spUpdateProductoPC() {
        $query = "
        UPDATE fac_local_producto SET
                precio_compra = :dato,
                precio_publico = :dato * ( 1 + ganancia_publico/100),
                precio_ferreteria = :dato * ( 1 + ganancia_ferreteria/100 ),
                precio_distribuidor = :dato * ( 1 + ganancia_distribuidor/100 )
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }

    protected function spUpdateProductoPGPUB() {
        $query = "
        UPDATE fac_local_producto SET
                ganancia_publico = :dato,
                precio_publico = precio_compra_real * (1 + :dato/100)
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }

    protected function spUpdateProductoPGFER() {
        $query = "
        UPDATE fac_local_producto SET
                ganancia_ferreteria = :dato,
                precio_ferreteria = precio_compra_real * (1 + :dato/100)
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }

    protected function spUpdateProductoPGDIS() {
        $query = "
        UPDATE fac_local_producto SET
                ganancia_distribuidor = :dato,
                precio_distribuidor = precio_compra_real * (1 + :dato/100)
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }
    
    protected function spUpdateProductoPVPUB() {
        $query = "
        UPDATE fac_local_producto SET
                precio_publico = :dato,
                ganancia_publico = 100 * ((precio_publico / precio_compra_real) - 1)
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }

    protected function spUpdateProductoPVFER() {
        $query = "
        UPDATE fac_local_producto SET
                precio_ferreteria = :dato,
                ganancia_ferreteria = 100 * ((precio_ferreteria / precio_compra_real) - 1)
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }

    protected function spUpdateProductoPVDIS() {
        $query = "
        UPDATE fac_local_producto SET
                precio_distribuidor = :dato,
                ganancia_distribuidor = 100 * ((precio_distribuidor / precio_compra_real) - 1)
        WHERE id_local_producto = :key;
        ";
        $parms = [
            ':key' => $this->_form->_key,
            ':dato' => $this->_form->_dato
        ];

        $this->execute($query, $parms);
        return 1;
    }

    protected function qGetCajas() {
        $query = "
        SELECT
                c.id_caja,
                c.caja,
                (SELECT COUNT(*) FROM fac_local_caja k WHERE k.id_caja = c.id_caja AND k.id_local = :id) marcado
        FROM fac_caja c
        WHERE c.activo = 1;
        ";
        $parms = [
            ':id' => $this->_form->_key
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function spMantenimientoCajas() {
        $query = "CALL sp_facturacion_localproducto_mantenimiento_cajas (:flag,:key,:cajas,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => $this->_form->_key,
            ':cajas' => isset($this->_form->chk_caja) ? implode(',', $this->_form->chk_caja) : '',
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        return $this->getRow($query, $parms);
    }

}
