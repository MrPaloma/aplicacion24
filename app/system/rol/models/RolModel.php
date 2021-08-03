<?php

namespace System\Rol\Models;

class RolModel extends \Vendor\DataBase {

    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;
    private $_pFilterCols;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        $this->_usuario = Obj()->Vendor->Session->get('app_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('app_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('app_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('app_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('app_hostName');

        $this->_pFilterCols = @htmlspecialchars(trim(Obj()->Libs->AesCtr->de($this->_form->pFilterCols)), ENT_QUOTES);
    }

    public function spGrid() {
        $query = "CALL sp_system_rol_grid (:iDisplayStart,:iDisplayLength,:pOrder,:pFilterCols,:sExport);";
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

    protected function qFindRol() {
        $query = "
        SELECT 
            nrol,
            activo
        FROM app_rol
        WHERE id_rol = :key;
        ";
        $parms = [
            ':key' => $this->_form->_keyRol
        ];

        return $this->getRow($query, $parms);
    }

    protected function qGetEventsOpcion() {
        $query = "
        SELECT 
                b.id_boton,
                b.nboton,
                (SELECT COUNT(*) FROM app_boton_rol_menu c WHERE c.id_boton = b.id_boton AND c.id_rolmenu = :key ) assigned
        FROM app_boton b
        WHERE b.activo = :activo
        ORDER BY 2;";
        $parms = [
            ':key' => $this->_form->_idRolOpcion,
            ':activo' => 1
        ];

        return $this->getRows($query, $parms);
    }

    protected function qGetAccess() {
        $query = "
        SELECT 
            m.id_menu,
            m.parent,
            m.nombre_menu,
            m.alias,
            m.activo,
            (SELECT COUNT(*) FROM app_menu d WHERE d.parent = m.id_menu) childs,
            (SELECT COUNT(*) FROM app_rol_menu r WHERE r.id_rol = :key AND r.id_menu = m.id_menu) assigned,
            (SELECT id_rolmenu FROM app_rol_menu r WHERE r.id_rol = :key AND r.id_menu = m.id_menu) id_rolmenu
        FROM app_menu m
        WHERE m.activo = :activo;
        ";
        $parms = [
            ':key' => $this->_form->_keyRol,
            ':activo' => 1
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qGetAccessPreview() {
        $query = "
        SELECT
            k.*,
            b.alias alias_btn,
            b.nboton
        FROM
        (
            SELECT 
                rm.id_rolmenu,
                rm.id_menu,
                m.parent,
                m.nombre_menu,
                m.alias,
                m.orden,
                (SELECT COUNT(*) FROM app_menu d WHERE d.parent = m.id_menu) childs
            FROM app_rol_menu rm
            INNER JOIN app_menu m ON m.id_menu = rm.id_menu
            WHERE rm.id_rol = :key
            AND m.eliminado = :eliminado
            AND m.activo = '1'
            UNION
            SELECT 
                0 id_rolmenu,
                mm.id_menu,
                mm.parent,
                mm.nombre_menu,
                mm.alias,
                mm.orden,
                (SELECT COUNT(*) FROM app_menu d WHERE d.parent = mm.id_menu) childs
            FROM app_rol_menu rm
            INNER JOIN app_menu m ON m.id_menu = rm.id_menu
            INNER JOIN app_menu mm ON mm.id_menu = m.parent
            WHERE rm.id_rol = :key
            AND m.eliminado = :eliminado
            AND mm.activo = :activo
            UNION
            SELECT 
                0 id_rolmenu,
                mmm.id_menu,
                mmm.parent,
                mmm.nombre_menu,
                mmm.alias,
                mmm.orden,
                (SELECT COUNT(*) FROM app_menu d WHERE d.parent = mmm.id_menu) childs
            FROM app_rol_menu rm
            INNER JOIN app_menu m ON m.id_menu = rm.id_menu
            INNER JOIN app_menu mm ON mm.id_menu = m.parent
            INNER JOIN app_menu mmm ON mmm.id_menu = mm.parent
            WHERE rm.id_rol = :key
            AND m.eliminado = :eliminado
            AND mmm.activo = :activo
            UNION
            SELECT 
                0 id_rolmenu,
                mmmm.id_menu,
                mmmm.parent,
                mmmm.nombre_menu,
                mmmm.alias,
                mmmm.orden,
                (SELECT COUNT(*) FROM app_menu d WHERE d.parent = mmmm.id_menu) childs
            FROM app_rol_menu rm
            INNER JOIN app_menu m ON m.id_menu = rm.id_menu
            INNER JOIN app_menu mm ON mm.id_menu = m.parent
            INNER JOIN app_menu mmm ON mmm.id_menu = mm.parent
            INNER JOIN app_menu mmmm ON mmmm.id_menu = mmm.parent
            WHERE rm.id_rol = :key
            AND m.eliminado = :eliminado
            AND mmmm.activo = :activo
            UNION
            SELECT 
                0 id_rolmenu,
                mmmmm.id_menu,
                mmmmm.parent,
                mmmmm.nombre_menu,
                mmmmm.alias,
                mmmmm.orden,
                (SELECT COUNT(*) FROM app_menu d WHERE d.parent = mmmmm.id_menu) childs
            FROM app_rol_menu rm
            INNER JOIN app_menu m ON m.id_menu = rm.id_menu
            INNER JOIN app_menu mm ON mm.id_menu = m.parent
            INNER JOIN app_menu mmm ON mmm.id_menu = mm.parent
            INNER JOIN app_menu mmmm ON mmmm.id_menu = mmm.parent
            INNER JOIN app_menu mmmmm ON mmmmm.id_menu = mmmm.parent
            WHERE rm.id_rol = :key
            AND m.eliminado = :eliminado
            AND mmmmm.activo = :activo
        )k
        LEFT JOIN app_boton_rol_menu bm ON bm.id_rolmenu = k.id_rolmenu
        LEFT JOIN app_boton b ON b.id_boton = bm.id_boton
        ORDER BY k.orden;
        ";
        $parms = [
            ':key' => $this->_form->_keyRol,
            ':eliminado' => 0,
            ':activo' => 1
        ];

        return $this->getRows($query, $parms);
    }

    protected function spMantenimiento() {
        $query = "CALL sp_system_rol_mantenimiento (:flag,:key,:nrol,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_keyRol,
            ':nrol' => @$this->_form->txt_descripcion,
            ':activo' => @($this->_form->chk_activo) ? $this->_form->chk_activo : 0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }

    protected function spMantenimientoOpcion() {
        $query = "CALL sp_system_rol_mantenimiento_opcion (:flag,:key,:idOpcion,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_keyRol,
            ':idOpcion' => @$this->_form->_idOpcion,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function spMantenimientoOpcionBoton() {
        $query = "CALL sp_system_rol_mantenimiento_opcion_boton (:flag,:idRolOpcion,:idBoton,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':idRolOpcion' => @$this->_form->_idRolOpcion,
            ':idBoton' => @$this->_form->_idBoton,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }
    
    protected function spClonar() {
        $query = "CALL sp_system_rol_mantenimiento_clonar (:keyRol,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':keyRol' => @$this->_form->_keyRol,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);
    }

}
