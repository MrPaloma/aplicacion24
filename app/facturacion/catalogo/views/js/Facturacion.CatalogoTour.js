/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:25 
* Descripcion : CatalogoTour.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.CatalogoTour = class CatalogoTour {

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