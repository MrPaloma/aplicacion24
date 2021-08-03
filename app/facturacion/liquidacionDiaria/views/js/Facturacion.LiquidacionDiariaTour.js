/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        02-12-2018 06:12:52 
* Descripcion : LiquidacionDiariaTour.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.LiquidacionDiariaTour = class LiquidacionDiariaTour {

    main() {
        var tour = new Tour({
            steps: [
                {
                    element: `#ELEMENTO AL QUE SE LE APLICA EL TOUR`,
                    content: 'CONTENIDO DESDE ARRAY JS: APP_TOUR',
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }
            ]
        });
        tour.init();
        tour.restart();
    }
    
}