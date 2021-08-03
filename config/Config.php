<?php

define('BASE_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/aplicacion24/');             #raiz del proyecto
define('DEFAULT_APP_FOLDER', 'app');                                            #carpeta donde se alojan los modulos de la aplicacion
define('DEFAULT_MODULE', 'system');                                             #modulo por defecto, actua como NAMESPACE
define('DEFAULT_CONTROLLER', 'init');                                           #controlador por defecto
define('DEFAULT_METHOD', 'index');                                              #metodo por defecto

define('APP_KEY', 'cnxtpFXNKHrdxCClokAZEW');                                       #llave para AES
define('APP_PASS_KEY', 'ojfc&dzvxxd5q#ar||rDbPKA1spU75JmRD|N79I'); #
define('APP_TMP_TK', 'cnhdte4258udjft~~{[]__...zswfr214');                      #debe ser igual a _sys_sg en postLogin(), valor solo validos al momento dellogin, luego seran aleatorios

/*==================BASE DE DATOS==============================*/
define('DB_ENTORNO', 'D');                                                   #D=DESARROLLO, P=PRODUCCION
define('DB_MOTOR', 'mysql');

define('DB_HOST', 'localhost');
define('DB_PASS', '');
define('DB_USER', 'root');
define('DB_NAME', 'db_luis');

define('DB_PORT', '3306');
define('DB_CHARSET', 'UTF8');
define('DB_COLLATION', 'utf8_general_ci');

