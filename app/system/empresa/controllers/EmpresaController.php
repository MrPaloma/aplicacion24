<?php

/**
 *
 * @author DC
 */

namespace System\Empresa\Controllers;

use \Vendor\Controller;
use System\Empresa\Filters\EmpresaFilter;

class EmpresaController extends \System\Empresa\Models\EmpresaModel {

    use Controller {
        Controller::__construct as private __cConstruct;
    }
    use EmpresaFilter {
        EmpresaFilter::__construct as private __fConstruct;
    }

    public function __construct() {
        parent::__construct();  /* constructor del EmpresaModel */
        $this->__cConstruct();  /* constructor del System\Empresa\Controllers */
        $this->__fConstruct();  /* constructor del EmpresaFilter */
    }

    public function index() {
        
    }
    
    public function gridCuentas() {        
        echo json_encode($this->spGrid());
    }
    
    public function postNew() {
        echo json_encode($this->spMantenimiento());
    }

    public function postEdit() {
        echo json_encode($this->spMantenimiento());
    }

    public function postDelete() {
        echo json_encode($this->spMantenimiento());
    }

    public function findEmpresa() {
        echo json_encode($this->qFindEmpresa());
    }
    
    public function findCuenta() {
        echo json_encode($this->qFindCuenta());
    }
    
    public function getParams() {
        $data = [
            'lst1' => $this->qParams('APPEMIDOCFORMAT'),
            'lst2' => $this->qParams('APPGANACIAPROD'),
            'width_ticket' => $this->qParams('FACTWIDTHTICKET'),
            'pie_ticket' => $this->qParams('FACTOBSTICKET')
        ];
        echo json_encode($data);
    }

    public function postEmpresa() {
        echo json_encode($this->qEdit());
    }
    
    public function postParam() {
        echo json_encode($this->qEditParam());
    }
    
    public function postSaveTicket() {
        echo json_encode($this->qEditTicket());
    }
    
    public function postUbigeo() {
        $data = [
            'rs' => $this->qEdit(),
            'empresa' => $this->qFindEmpresa()
        ];
        echo json_encode($data);
    }

    public function postUpload() {
        $data = [];

        if ($this->_file) {

            $inputFile = $this->_file->file_logo;

            $root = ROOT . 'public' . DS . 'img' . DS; //ruta donde se va alojar el archivo

            $ext = explode('.', $inputFile['name']);

            $ext = array_pop($ext);

            $nvoNom = 'logo_' . uniqid('fae') . '.' . strtolower($ext);

            Obj()->Vendor->Tools->deleteFile($root . $nvoNom);

            Obj()->Libs->Upload->upload($inputFile);

            Obj()->Libs->Upload->allowed = [
                'image/jpg',
                'image/jpeg',
                'image/png'
            ];

            if (Obj()->Libs->Upload->uploaded) {
                Obj()->Libs->Upload->file_new_name_body = explode('.', $nvoNom)[0]; //se quita la extension

                Obj()->Libs->Upload->Process($root);

                if (Obj()->Libs->Upload->processed) {

                    Obj()->Libs->Upload->Clean();

                    $this->qUpdateFile($nvoNom);
                    
                    Obj()->Vendor->Session->set('app_logo', BASE_URL . 'public/img/' . $nvoNom);

                    $data = ['result' => 1, 'archivo' => $nvoNom];
                } else {
                    $data = ['result' => Obj()->Libs->Upload->error];
                }
            } else {
                $data = ['result' => Obj()->Libs->Upload->error];
            }
        }

        echo json_encode($data);
    }

}
