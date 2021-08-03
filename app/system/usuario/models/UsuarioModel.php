<?php

namespace System\Usuario\Models;

class UsuarioModel extends \Vendor\DataBase {

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
        $query = "CALL sp_system_usuario_grid (:cliente,:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
        $parms = [
            ":cliente" => @$this->_idCliente,
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
        $query = "CALL sp_system_usuario_mantenimiento (:cliente,:flag,:key,:pnombre,:snombre,:apaterno,:amaterno,:celular,:email,:roles,:local,:clave,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname,:pKey); ";
        $parms = [
            ':cliente' => $this->_idCliente,
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_keyUsuario,
            ':pnombre' => @$this->_form->txt_primer_nombre,
            ':snombre' => @$this->_form->txt_segundo_nombre,
            ':apaterno' => @$this->_form->txt_apellido_paterno,
            ':amaterno' => @$this->_form->txt_apellido_materno,
            ':celular' => @$this->_form->txt_celular,
            ':email' => @$this->_form->txt_email,
            ':roles' => @implode(',', $this->_form->chk_rol),
            ':local' => @$this->_form->lst_local,
            ':clave' => @$this->_form->txt_contrasenia,
            ':activo' => @($this->_form->chk_activo) ? $this->_form->chk_activo : 0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName,
            ':pKey' => APP_PASS_KEY
        ];
        return $this->getRow($query, $parms);
    }

    protected function spMantenimientoSeries() {
        $query = "CALL sp_system_usuario_mantenimiento_serie (:flag,:key,:series,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => $this->_form->_keyUsuario,
            ':series' => isset($this->_form->chk_serie) ? implode(',', $this->_form->chk_serie) : '',
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        return $this->getRow($query, $parms);
    }

    protected function qFindUsuario() {
        $query = "
        SELECT
                p.apellido_paterno,
                p.apellido_materno,
                p.primer_nombre,
                p.segundo_nombre,
                p.celular,
                p.email,
                p.activo,
                c.id_local
        FROM fac_cliente_persona c
        INNER JOIN app_persona p ON p.id_persona = c.id_persona
        WHERE c.id_cliente_persona = :key;
        ";
        $parms = [
            ':key' => $this->_form->_keyUsuario
        ];

        return $this->getRow($query, $parms);
    }

    protected function qFindRoles() {
        $query = "
        SELECT
                u.id_rol
        FROM fac_cliente_persona c
        INNER JOIN app_usuario p ON p.id_persona = c.id_persona
        INNER JOIN app_rol_usuario u ON u.id_usuario = p.id_usuario
        WHERE c.id_cliente_persona = :key;
        ";
        $parms = [
            ':key' => $this->_form->_keyUsuario
        ];

        return $this->getRows($query, $parms);
    }

    protected function qGetSeries() {
        $query = "
        SELECT
                e.id_serie,
                e.serie,
                (SELECT COUNT(*) FROM fac_serie_persona f WHERE f.id_serie = e.id_serie AND f.id_cliente_persona = :clientePersona) marcado
        FROM fac_serie e
        WHERE e.id_cliente = :cliente
        AND e.activo = 1
        ORDER BY 3,LEFT(e.serie,1);
        ";
        $parms = [
            ':clientePersona' => $this->_form->_clientePersona,
            ':cliente' => $this->_idCliente
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qRoles() {
        if(DB_ENTORNO == 'D'){
            $query = "
            SELECT
                    r.id_rol,
                    r.nrol,
                    (SELECT COUNT(*) FROM app_rol_usuario u WHERE u.id_rol = r.id_rol AND u.id_usuario = :user) marcado
            FROM app_rol r
            WHERE r.activo = 1
            AND r.eliminado = 0
            ORDER BY 2;
            ";
        }else{
            $query = "
            SELECT
                    r.id_rol,
                    r.nrol,
                    (SELECT COUNT(*) FROM app_rol_usuario u WHERE u.id_rol = r.id_rol AND u.id_usuario = :user) marcado
            FROM app_rol r
            WHERE r.activo = 1
            AND r.eliminado = 0
            AND r.id_rol != 1
            ORDER BY 2;
            ";
        }
        $parms = [
            ':user' => @$this->_form->_keyUsuario
        ];

        return $this->getRows($query, $parms);
    }

}
