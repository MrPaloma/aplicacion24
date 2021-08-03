/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        21-09-2018 05:09:33 
* Descripcion : CuentaCobrarTour.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.CuentaCobrarTour = class CuentaCobrarTour {

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