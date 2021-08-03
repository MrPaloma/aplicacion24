"use strict";
$$.System.BotonRsc = class BotonRsc extends Resource {

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

    setBoton(obj) {
        var data = obj.data;
        Tools.setDataForm(this._formEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.nboton, callback: () => {
                        Tools.tagsInput(obj);
                    }},
                {item: 'txt_icono', value: data.icono},
                {item: 'txt_alias', value: data.alias},
                {item: 'txt_css', value: data.css},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }
 
};  