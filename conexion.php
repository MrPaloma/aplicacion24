<?php
require_once 'config/Config.php';

class Conexion
{
    public static function conectar()
    {
        $link = null;
        try {
            $link = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
            $link->exec("SET CHARACTER set utf8");
            $link->exec("SET NAMES UTF-8");
            $link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //Catch all errors on exceptions
        } catch (PDOException $e) {
            
                echo "Error de conexion: " . $e->getMessage();
            
            die();
        } finally {
            return $link;
        }
    }
}