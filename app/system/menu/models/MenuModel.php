<?php

namespace System\Menu\Models;

class MenuModel extends \Vendor\DataBase {

    protected $_form;
    private $_usuario;
    private $_navegador;
    private $_ipPublica;
    private $_ipLocal;
    private $_hostName;

    public function __construct() {
        parent::__construct();
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        $this->_usuario = Obj()->Vendor->Session->get('app_idUsuario');
        $this->_navegador = Obj()->Vendor->Session->get('app_navegador');
        $this->_ipPublica = Obj()->Vendor->Session->get('app_ipPublica');
        $this->_ipLocal = Obj()->Vendor->Session->get('app_ipLocal');
        $this->_hostName = Obj()->Vendor->Session->get('app_hostName');
    }

    protected function qMenu() {
        $query = "
        SELECT 
            m.id_menu,
            m.parent,
            m.nombre_menu,
            m.icono,
            m.alias,
            m.evt_ajax,
            m.activo
        FROM app_menu m
        WHERE m.eliminado = :eliminado
        ORDER BY m.orden;
        ";
        $parms = [
            ':eliminado' => 0
        ];

        return $this->getRows($query, $parms);
    }
    
    protected function qFindMenu() {
        $query = "
        SELECT 
            m.parent,
            m.nombre_menu,
            m.icono,
            m.alias,
            m.evt_ajax,
            m.activo
        FROM app_menu m
        WHERE m.id_menu = :key;
        ";
        $parms = [
            ':key' => $this->_form->_keyMenu
        ];

        return $this->getRow($query, $parms);
    }

    protected function ordenar() {

        $query = "CALL sp_mnuOrdenar (:ordenElements,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':ordenElements' => $this->_form->_ordenElements,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];

        return $this->getRow($query, $parms);   /* devuelve un registro */
    }
    
    protected function mantenimiento() {
        $query = "CALL sp_mnuMantenimiento (:flag,:key,:parent,:icono,:nmenu,:alias,:js,:activo,:usuario,:ipPublica,:ipLocal,:navegador,:hostname); ";
        $parms = [
            ':flag' => $this->_form->_flag,
            ':key' => @$this->_form->_keyMenu,
            ':parent' => @$this->_form->_parent,
            ':icono' => @$this->_form->txt_icono,
            ':nmenu' =>  @$this->_form->txt_descripcion,
            ':alias' => @$this->_form->txt_alias,
            ':js' => @$this->_form->txt_ajax,
            ':activo' => @($this->_form->chk_activo)?$this->_form->chk_activo:0,
            ':usuario' => $this->_usuario,
            ':ipPublica' => $this->_ipPublica,
            ':ipLocal' => $this->_ipLocal,
            ':navegador' => $this->_navegador,
            ':hostname' => $this->_hostName
        ];
        
        return $this->getRow($query, $parms);
    }

}
