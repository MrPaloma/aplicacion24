/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super  User  
* Fecha:        07-02-2019 16:02:26 
* Descripcion : MovimientoAlmacenTour.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.MovimientoAlmacenTour = class MovimientoAlmacenTour {

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