/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        29-11-2018 07:11:20 
* Descripcion : CajaRsc.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.CajaRsc = class CajaRsc extends Resource {
    
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
    
    setCaja(data) {
        Tools.setDataForm(this._formEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.caja},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }
    
};