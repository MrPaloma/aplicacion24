/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        13-10-2018 05:10:03 
* Descripcion : MarcaRsc.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.MarcaRsc = class MarcaRsc extends Resource {
    
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
    
    setMarca(data) {
        Tools.setDataForm(this._formEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.marca},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }
    
};