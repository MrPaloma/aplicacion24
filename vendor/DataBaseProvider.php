<?php

namespace Vendor;

use PDO,
    Exception;

$GLOBALS['DB'] = null;

class DataBaseProvider {

    private static $_instancias = [];
    
    public function __construct() {
        self::$_instancias[] = $this;
        if(count(self::$_instancias) == 1){
            $GLOBALS['DB'] = new \PDO(
                self::dns(), 
                DB_USER, 
                DB_PASS
            );
            $GLOBALS['DB']->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
         
            if(DB_MOTOR == 'mysql'){
                $GLOBALS['DB']->exec("set names ".DB_CHARSET);
            }
            if(DB_MOTOR == 'sql'){
                $GLOBALS['DB']->setAttribute(PDO::SQLSRV_ATTR_ENCODING, PDO::SQLSRV_ENCODING_UTF8);
            }
            
            return $GLOBALS['DB'];
        }else{
            return $GLOBALS['DB'];
        }
    }
    
    private static function dns(){
        switch (strtolower(DB_MOTOR)) {
            case 'mysql':
                $dsn = 'mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME.';';
                break;
            case 'sql':
                $dsn = 'sqlsrv:Server='.DB_HOST.';Database='.DB_NAME.';MultipleActiveResultSets=false';
                break;
            case 'oracle':
                $dsn = 'oci:dbname='.DB_NAME.';';
                break;
            case 'pgsql':
                $dsn = 'pgsql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME.';';
                break;
        }
        return $dsn;
    }
    
    final protected function configCall($query) {
        $sp = str_replace('CALL', SP_CALL, $query);
        $sp = str_replace('(', SP_INI, $sp);
        $sp = str_replace(')', SP_FIN, $sp);
        
        return $sp;
    }
    
}
