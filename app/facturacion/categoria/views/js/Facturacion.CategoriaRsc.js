/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 18:09:57 
* Descripcion : CategoriaRsc.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.CategoriaRsc = class CategoriaRsc extends Resource {
    
    constructor() {
        super();
    }
    
    addButtonsFormNew() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }
    
    addButtonsFormUpdate() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.UPD, type: 'submit'}]
        });
    }
    
    setCategoria(data) {
        Tools.setDataForm(this._formEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.categoria},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }
    
};