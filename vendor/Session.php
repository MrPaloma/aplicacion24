<?php

namespace Vendor;

/**
 * Description of Session
 *
 * @author David
 */
class Session {
    
    public static function init(){
        session_start();
    }
    
    public static function destroy($session = false){
        if($session){
            if(is_array($session)){
                foreach ($session as $se) {
                    if(isset($_SESSION[$se])){
                        unset($_SESSION[$se]);
                    }
                }
            }else{
                if(isset($_SESSION[$session])){
                    unset($_SESSION[$session]);
                }
            }
        }else{
            session_destroy();
        }
    }
    
    public static function set($clave,$valor){
        $_SESSION[$clave] = $valor;
    }
    
    public static function get($clave){
        if(isset($_SESSION[$clave])){
            return $_SESSION[$clave];
        }
        return false;
    }
    
    public static function getPermiso($clave){
        foreach (Session::get('sys_access') as $value) {
            if($value['option'] == $clave){
                return array(
                    'action'=>$value['action'],
                    'permission'=>$value['permission'],
                    'icon'=>$value['icon'],
                    'theme'=>$value['theme']
                );
                exit;
            }
        }
    }
    
}
