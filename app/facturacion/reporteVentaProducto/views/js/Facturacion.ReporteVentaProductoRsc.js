/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 17:09:53 
* Descripcion : ReporteVentaProductoRsc.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.ReporteVentaProductoRsc = class ReporteVentaProductoRsc extends Resource {
    
    constructor() {
        
        super();
        this._fila = 0;
        this._lastValues = [];
        
    }
};