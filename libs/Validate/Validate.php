<?php
/*
 *   Creado por:         David
 *   Fecha:              2016
 */

namespace Libs;

use DateTime;

class Validate {
    
    private $_alias;                            /*alias para los elementos*/
    private $_labels = array();
    private $_rules = array();
    private $_field;
    private $_message;
    private $_form;
    private $_messages = array(
        "required"=>"{label} es requerido.{br}",
        "email"=>"{label} no es un email válida.{br}",
        "url"=>"{label} no es una url válida.{br}",
        "date"=>"{label} no es una fecha válida.{br}",
        "time"=>'{label} no es una hora válida.{br}',
        "number"=>"{label} no es un número válido.{br}",
        "decimal"=>"{label} no es un número decimal válido.{br}",
        "integer"=>"{label} no es un número entero válido.{br}",
        "equalto"=>"Introduzca el mismo valor de nuevo, en {label}.{br}",
        "noequalto"=>"Introduzca un valor diferente en {label}.{br}",
        "maxlength"=>"{label} debe contener como máximo {n} caracteres.{br}",
        "minlength"=>"{label} debe contener como minimo {n} caracteres.{br}",
        "rangelength"=>"{label} debe contener entre {i} y {f} caracteres de longitud.{br}",
        "range"=>"{label} debe ser entre {i} y {f}.{br}",
        "max"=>"{label} debe ser menor o igual a {n}.{br}",
        "min"=>"{label} debe ser mayor o igual a {n}.{br}",
        "lengthchar"=>"{label} debe contener {n} caracteres.{br}",
        "lesstimeto"=> "{label} debe ser menor que hora final.{br}",
        "greatertimeto"=> "{label} debe ser mayor que hora inicial.{br}",
        "lessdateto"=> "{label} debe ser menor o igual que fecha final.{br}",
        "greaterdateto"=> "{label} debe ser mayor o igual que fecha inicial.{br}",
        "nospace"=> "{label} no debe tener espacios en blanco.{br}",
        "letterlower"=> "{label} al menos debe tener una letra minúscula.{br}",
        "letterupper"=> "{label} al menos debe tener una letra mayúscula.{br}",
        "letternumber"=> "{label} al menos debe tener un número.{br}"        
    );

    public function __construct() {
        $this->_form = Obj()->Vendor->Request->allForm()->post();
        $this->_alias = $this->_form->_alias; /*viene del Ajax.js*/
    }
    
    /*
     * Carga los elementos a validar
     */
    public function filter($field) {
        $this->_field   = $field['field'];   /*guardo elemento q se esta configurando sus reglas*/ // se quito el $this->_alias porque en Request no se toma en cuenta
        
        /*se guarda los labels*/
        $this->_labels[$this->_field] = $field['label'];
        return $this;
    }
    
    /*
     * Carga los elementos enviados via ajax a validar
     */
    public function filterJS($field) {
        $this->_field   = $field['field'];   /*guardo elemento q se esta configurando sus reglas*/
        
        /*se guarda los labels*/
        $this->_labels[$this->_field] = $field['label'];
        return $this;
    }
    
    /*
     * Carga las reglas de cada elemento a validar
     */
    public function rule($obj) {
        $this->_rules[$this->_field][] = $obj;
        
        return $this;
    }

    /*
     * Verifica si todos los elemntos se validaron
     */
    public function isTrue($obj=[]){
        $this->_message = '';
        
        if(count($obj)){
            $this->_message =$obj.'{br}';
        }
        if($this->validator()){
            return true;
        }
        return false;
    }
    
    /*
     * Agregar mensajes
     */
    public function addMessages($m){
        $this->_message .=$m.'{br}';
    }
    
    /*
     * Rretorna los mensajes de error
     */
    public function messages(){
        return str_replace('{br}', '<br>', $this->_message) ;
    }
    
    /*
     * Ejecuta cada una de las reglas
     */
    private function validator() {
        $element = '';  /*elemento del formulario a validar*/
        $error   = array();
        /*se recorre array que se configuro en el filter de la opcion a validar*/
        foreach ($this->_rules as $key => $value) {
            $element = $key;
            /*se recorre las reglas del elemento*/
            foreach($value as $rule){
                $ru = explode(':', $rule['rule']);
                
                $regla  = trim(strtolower($ru[0]));           /*la regla para validar*/
                $params = isset($ru[1])?$ru[1]:null;    /*los parametros*/
                
                /*se ejecuta validacion segun la regla enviada y guardo los errores*/
                $error[] = $this->$regla($element,trim($regla),trim($params));      
            }
        }
       
        /*verfificar si existe algun error*/
        foreach ($error as $value) {
            if(!$value){
                return false;
            }
        }
        return true;
    }
    
    private function required($element,$regla,$params) {
        if(is_array($this->_form->$element)){
            $error = false;
            foreach ($this->_form->$element as $key => $value) {
                if(!empty($value)){
                    $error = true;
                }
            }
            if(!$error){
                $this->addMsn($element,$regla);
            }
            return $error;
        }else{
            if(!$this->_form->$element){
                $this->addMsn($element,$regla);
                return false;
            }else{
                return true;
            }
        }
    }
    
    private function email($element,$regla,$params) {
        if (!preg_match('{^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$}',$this->_form->$element) && $this->_form->$element){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function url($element,$regla,$params) {
        if (!filter_var($this->_form->$element, FILTER_VALIDATE_URL) && $this->_form->$element) {
            $this->addMsn($element,$regla);
            return false;
        } else {
            return true;
        }
    }
    
    private function min($element,$regla,$params) {
        if((int)$this->_form->$element < $params && $this->_form->$element){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function max($element,$regla,$params) {
        if((int)$this->_form->$element > $params && $this->_form->$element){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function lengthchar($element,$regla,$params) {
        if(strlen($this->_form->$element) != $params && $this->_form->$element){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function number($element,$regla,$params) {
        if(is_array($this->_form->$element)){
            $error = true;
            foreach ($this->_form->$element as $key => $value) {
                if (!filter_var($value, FILTER_VALIDATE_FLOAT) && !empty($value)) {
                    $error = false;
                }
            }
            if(!$error){
                $this->addMsn($element,$regla);
            }
            return $error;
        }else{
            if (!filter_var($this->_form->$element, FILTER_VALIDATE_FLOAT) && $this->_form->$element) {
                $this->addMsn($element,$regla);
                return false;
            } else {
                return true;
            }
        }
    }
    
    private function decimal($element,$regla,$params) {
        if (!filter_var($this->_form->$element, FILTER_VALIDATE_FLOAT) && $this->_form->$element) {
            $this->addMsn($element,$regla);
            return false;
        } else {
            return true;
        }
    }
    
    private function integer($element,$regla,$params) {
        if (!filter_var($this->_form->$element, FILTER_VALIDATE_INT) && $this->_form->$element) {
            $this->addMsn($element,$regla);
            return false;
        } else {
            return true;
        }
    }
    
    private function date($element,$regla,$params) {
        $fech = str_replace('-', '*', $this->_form->$element);
        $fech = str_replace('.', '*', $fech);
        $fech = str_replace('/', '*', $fech);
    
        $fe = explode('*', $fech);
        
        $dia = null;
        $mes = null;
        $ani = null;
            
        /*verifico si es formato ddmmY o Ymmdd*/
        if(strlen($fe[0]) == 4){        /*Ymmdd*/
            $dia = $fe[2];
            $mes = isset($fe[1])?$fe[1]:'99';
            $ani = isset($fe[0])?$fe[0]:'99';
        }elseif(strlen($fe[0]) == 2){   /*ddmmY*/
            $dia = $fe[0];
            $mes = isset($fe[1])?$fe[1]:'99';
            $ani = isset($fe[2])?$fe[2]:'99';
        }
        
        /*verificar si son numeros*/
//        if(!filter_var($mes.$dia.$ani, FILTER_VALIDATE_INT)){
//            $this->addMsn($element,$regla);
//            return false;
//        }
        
        if((!checkdate($mes,$dia,$ani) || (strlen($dia) != 2 || strlen($mes) != 2 || strlen($ani) != 4)) && $this->_form->$element){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function time($element,$regla,$params) {
        $pattern="/^(0[1-9]|1\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/";

        if(!preg_match($pattern,$this->_form->$element) && $this->_form->$element){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function maxlength($element,$regla,$params) {
        if(strlen($this->_form->$element) > $params && $this->_form->$element){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function minlength($element,$regla,$params) {
        if(strlen($this->_form->$element) < $params && $this->_form->$element){
            $this->addMsn($element,$regla,$params);
            return false;
        }else{
            return true;
        }
    }
    
    private function range($element,$regla,$params) {
        $pr = explode(',', $params);
        $ini = $pr[0];
        $fin = $pr[1];
        
        if(((int)$this->_form->$element >= $ini && (int)$this->_form->$element <= $fin)){
            return true;
        }else{
            $this->addMsn($element,$regla,$ini,$fin);
            return false;
        }
    }
    
    private function rangelength($element,$regla,$params) {
        $pr = explode(',', $params);
        $ini = $pr[0];
        $fin = $pr[1];

        if(strlen($this->_form->$element) >= $ini && strlen($this->_form->$element) <= $fin){
            return true;
        }elseif($this->_form->$element){
            $this->addMsn($element,$regla,$ini,$fin);
            return false;
        }
    }
    
    private function equalto($element,$regla,$params) {
        if($this->_form->$element !== $this->_form->$params){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    private function noequalto($element,$regla,$params) {
        if($this->_form->$element === $this->_form->$params && $this->_form->$element){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    
    /*
     * valida que un campo tipo hora sea menor que otro campo tipo hora 
     */
    private function lesstimeto($element,$regla,$params) {
        $date1 = new DateTime($this->_form->$element);
        $date2 = new DateTime($this->_form->$params);

        if($date1 < $date2 && !empty($this->_form->$params)){
            return true;
        }else{
            $this->addMsn($element,$regla,$params);
            return false;
        }
    }
    
    /*
     * valida que un campo tipo hora sea mayor que otro campo tipo hora 
     */
    private function greatertimeto($element,$regla,$params) {
        $date1 = new DateTime($this->_form->$element);
        $date2 = new DateTime($this->_form->$params);

        if($date1 > $date2){
            return true;
        }else{
            $this->addMsn($element,$regla,$params);
            return false;
        }
    }
    
    /*
     * valida que un campo tipo fecha sea menor o igual que otro campo tipo fecha 
     */
    private function lessdateto($element,$regla,$params) {
        $date1 = new DateTime($this->_form->$element);
        $date2 = new DateTime($this->_form->$params);

        if($date1 <= $date2 && !empty($this->_form->$params)){
            return true;
        }else{
            $this->addMsn($element,$regla,$params);
            return false;
        }
    }
    
    /*
     * valida que un campo tipo fecha sea mayor o igual que otro campo tipo fecha 
     */
    private function greaterdateto($element,$regla,$params) {
        $date1 = new DateTime($this->_form->$element);
        $date2 = new DateTime($this->_form->$params);

        if($date1 >= $date2){
            return true;
        }else{
            $this->addMsn($element,$regla,$params);
            return false;
        }
    }
    
    /*
     * valida que un campo no tenga espacios en blanco
     */
    private function nospace($element,$regla,$params) {
        if (strpos($this->_form->$element,' ')){
            $this->addMsn($element,$regla);
            return false;
        }else{
            return true;
        }
    }
    /*
     * valida que un campo tenga al menos una letra minuscula
     */
    private function letterlower($element,$regla,$params){
        if (!preg_match('"[a-z]"',$this->_form->$element)){
           $this->addMsn($element,$regla);
            return false;
         }else{
             return true;
         }
    }
    /*
     * valida que un campo tenga al menos una letra mayuscula
     */
    private function letterupper($element,$regla,$params){
        if (!preg_match('"[A-Z]"',$this->_form->$element)){
           $this->addMsn($element,$regla);
            return false;
         }else{
             return true;
         }
    }
    /*
     * valida que un campo tenga al menos un numero
     */
    private function letternumber($element,$regla,$params){
        if (!preg_match('"[0-9]"',$this->_form->$element)){
           $this->addMsn($element,$regla);
            return false;
         }else{
             return true;
         }
    }
        
    /*
     * Carga los mensajes de error 
     */
    private function addMsn($element,$regla,$params1='',$params2=''){
        if(!empty($params1) && empty($params2)){
            $m = str_replace('{label}', $this->_labels[$element], $this->_messages[$regla]) ;
            $m = str_replace('{n}', $params1, $m) ;
            
            $this->_message .= $m;
        }elseif(!empty ($params2)) {
            $m = str_replace('{label}', $this->_labels[$element], $this->_messages[$regla]) ;
            $m = str_replace('{i}', $params1, $m) ;
            $m = str_replace('{f}', $params2, $m) ;
            
            $this->_message .= $m;
        }else{
            $this->_message .= str_replace('{label}', $this->_labels[$element], $this->_messages[$regla]) ;
        }
    }
    
}
