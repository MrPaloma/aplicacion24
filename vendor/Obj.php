<?php

namespace Vendor;

final class Obj {

    public static function run($namespace) {
        /*se retorna el array convertido en una clase*/
        return (object)Registry::$data[$namespace];
    }

}
