/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 17:09:53 
* Descripcion : ReporteDetalladoRsc.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.ReporteDetalladoRsc = class ReporteDetalladoRsc extends Resource {
    
    constructor() {
        
        super();
        this._fila = 0;
        this._lastValues = [];
        
    }
};