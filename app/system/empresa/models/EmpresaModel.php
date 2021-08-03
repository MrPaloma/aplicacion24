<?php

namespace System\Empresa\Models;

class EmpresaModel extends \Vendor\DataBase {

    protected $_form;
    protected $_file;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_pFilterCols;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        $this->_file = Obj()->Vendor->Request->allForm()->file();
        $this->_usuario = Obj()->Vendor->Session->get('app_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('app_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('app_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('app_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('app_hostName');

        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }

    public function spGrid() {
        $query = "CALL sp_system_empresa_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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
        $query = "CALL sp_system_empresa_cuenta_mantenimiento (:flag,:key,:cuenta,:banco,:tipo_cuenta_banco,:tipo_moneda,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_keyCuenta,
            ':cuenta' => @$this->_form->txt_cuenta,
            ':banco' => @$this->_form->lst_banco,
            ':tipo_cuenta_banco' =>  @$this->_form->lst_tipo_cuenta_banco,
            ':tipo_moneda' => @$this->_form->lst_tipo_moneda,
            ':activo' => @($this->_form->chk_activo)?$this->_form->chk_activo:0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,  
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        
        return $this->getRow($query, $parms);
    }

    protected function qFindEmpresa() {
        $query = "
        SELECT
            c.ruc,
            c.razon_social,
            c.nombre_comercial,
            c.ubigeo_codigo,
            c.email,
            c.telefono,
            c.direccion,
            c.logo,
            c.pass_firma,
            (
                    SELECT 
                            ubigeo_nombre 
                    FROM app_ubigeo 
                    WHERE id_ubigeo = (
                            SELECT parent FROM app_ubigeo 
                                    WHERE id_ubigeo = (SELECT parent FROM app_ubigeo 
                            WHERE ubigeo_codigo = c.ubigeo_codigo)
                    )
            ) departamento,
            (
                    SELECT 
                            ubigeo_nombre 
                    FROM app_ubigeo 
                    WHERE id_ubigeo = (
                            SELECT 
                                    parent 
                            FROM app_ubigeo 
                            WHERE ubigeo_codigo = c.ubigeo_codigo)
            ) provincia,
            (
                    SELECT ubigeo_nombre FROM app_ubigeo 
                    WHERE ubigeo_codigo = c.ubigeo_codigo
            ) distrito
    FROM fac_cliente c
    LIMIT 1;
        ";
        $parms = [];

        return $this->getRow($query, $parms);
    }

    protected function qFindCuenta() {
        $query = "
        select
                a.id_banco,
                a.id_tipo_cuenta_banco,
                a.cuenta_banco,
                a.activo,
                a.id_tipo_moneda
        from fac_cliente_cuenta_banco a
        where a.id_cliente_cuenta = :id";
        $parms = [
            ':id' => $this->_form->_keyCuenta
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function qParams($c) {
        $query = "
        SELECT
                valor
        FROM app_parametro
        WHERE codigo = :codigo;";
        $parms = [
            ':codigo' => $c
        ];

        return $this->getRow($query, $parms);
    }

    protected function qEditParam() {
        $query = "
        UPDATE app_parametro SET
                valor = '" . $this->_form->_valor . "'
        WHERE codigo = '" . $this->_form->_codigo . "';";
        $parms = [];

        $this->execute($query, $parms);
        return ['result' => 1];
    }
    
    protected function qEditTicket() {
        $query = "
        UPDATE app_parametro SET
                valor = '" . $this->_form->_width_ticket . "'
        WHERE codigo = 'FACTWIDTHTICKET';";
        $parms = [];

        $this->execute($query, $parms);
        
        $query = "
        UPDATE app_parametro SET
                valor = '" . $this->_form->_pie_ticket . "'
        WHERE codigo = 'FACTOBSTICKET';";
        $parms = [];

        $this->execute($query, $parms);
        return ['result' => 1];
    }

    protected function qEdit() {
        $query = "
        UPDATE fac_cliente SET
                " . $this->_form->_field . " = '" . $this->_form->_dato . "'
        WHERE id_cliente = :id;";
        $parms = [
            ':id' => 3
        ];

        $this->execute($query, $parms);
        return ['result' => 1];
    }

    protected function qUpdateFile($file) {
        $query = "
        UPDATE fac_cliente SET
            logo = :file
        WHERE id_cliente = :id ; 
        ";
        $parms = [
            ':id' => 3,
            ':file' => $file
        ];

        $this->execute($query, $parms);
    }

}
