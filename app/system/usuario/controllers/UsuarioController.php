<?php

/**
 *
 * @author DC
 */

namespace System\Usuario\Controllers;

use \Vendor\Controller;

class UsuarioController extends \System\Usuario\Models\UsuarioModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del UsuarioModel */
        $this->__cConstruct();  /* constructor del System\Usuario\Controllers */
    }

    public function index() {
        
    }

    public function grid() {
        echo json_encode($this->spGrid());
    }

    private function _sendMailAccessUser($data) {
        $body = file_get_contents('files' . DS . 'mails' . DS . 'accesUser.phtml');

        /* reemplazando titulos */
        $body = str_replace("{USER}", $data['email'], $body);
        $body = str_replace("{LOGO}", Obj()->Vendor->Session->get('app_logo'), $body);
        $body = str_replace("{CLAVE}", $data['clave'], $body);

        Obj()->Libs->PHPMailer->setFrom(MAIL_REMITENTE_APP, APP_COMPANY);
        Obj()->Libs->PHPMailer->Subject = 'Accesos';
        Obj()->Libs->PHPMailer->CharSet = 'UTF-8';
        //contenido del correo
        Obj()->Libs->PHPMailer->msgHTML($body, ROOT);
        Obj()->Libs->PHPMailer->AltBody = 'Accesos de Usuario';

        //correos y nombres de destinatario
        Obj()->Libs->PHPMailer->addAddress($data['email'], 'Accesos a 3VFact');
        Obj()->Libs->PHPMailer->addBCC(MAIL_DEVELOPER, 'Accesos a 3VFact');
        //enviando
        Obj()->Libs->PHPMailer->send();
    }

    public function postNew() {
        $data = $this->spMantenimiento();
        if ($data['ok_error'] == 'ok' && DB_ENTORNO == 'P') {
            $this->_sendMailAccessUser($data);
        }
        echo json_encode($data);
    }

    public function postEdit() {
        $data = $this->spMantenimiento();
        if ($data['ok_error'] == 'ok') {
            //recargar app_idLocal con el local editado
            Obj()->Vendor->Session->set('app_idLocal', $this->_form->lst_local);
        }
        echo json_encode($this->spMantenimiento());
    }

    public function postDelete() {
        echo json_encode($this->spMantenimiento());
    }
    
    public function postNewPass() {
        $data = $this->spMantenimiento();
        if ($data['ok_error'] == 'ok' && DB_ENTORNO == 'P') {
            $this->_sendMailAccessUser($data);
        }
        echo json_encode($data);
    }

    public function postAddSerie() {
        $this->_form->_clientePersona = $this->_form->_keyUsuario;
        $rs = $this->spMantenimientoSeries();
        $data = [
            'mensaje' => $rs['mensaje'],
            'ok_error' => $rs['ok_error'],
            'series' => $this->qGetSeries()
        ];

        echo json_encode($data);
    }

    public function postRemoveSerie() {
        $this->_form->_clientePersona = $this->_form->_keyUsuario;
        $rs = $this->spMantenimientoSeries();
        $data = [
            'mensaje' => $rs['mensaje'],
            'ok_error' => $rs['ok_error'],
            'series' => $this->qGetSeries()
        ];

        echo json_encode($data);
    }

    public function findUsuario() {
        $data = [
            'user' => $this->qFindUsuario(),
            'roles' => $this->qFindRoles()
        ];
        echo json_encode($data);
    }

    public function getSeries() {
        echo json_encode($this->qGetSeries());
    }

    public function getRoles() {
        echo json_encode($this->qRoles());
    }

}
