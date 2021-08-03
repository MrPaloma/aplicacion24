/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Adm  
 * Fecha:        01-02-2019 06:02:44 
 * Descripcion : CajaChicaRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.CajaChicaRsc = class CajaChicaRsc extends Resource {

    constructor() {
        super();

        this._clearCaja = () => {
            $(this._idFormIndex)[0].reset();
            Tools.todayDate(`#${this._alias}txt_fecha_in`);
            Tools.todayDate(`#${this._alias}txt_fecha_e`);
        };
    }

    addBtns() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_in`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'button', evts: [{click: 'Obj.Facturacion.CajaChicaAx.postIngreso'}]}]
        });
    }

    getListBoxs(form) {
        $(form).appList({
            items: [
                {
                    data: 'personal',
                    container: `#${this._alias}d_personal`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_personal`,
                        name: `${this._alias}lst_personal`,
                        class: 'form-control _personal'
                    },
                    default: null
                }
            ]
        });
    }

    addButtonsFormEgreso() {
        $.fn.appButton.get({
            container: `#${this._alias}efoot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }

    addButtonsFormIngreso() {
        $.fn.appButton.get({
            container: `#${this._alias}ifoot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }

};