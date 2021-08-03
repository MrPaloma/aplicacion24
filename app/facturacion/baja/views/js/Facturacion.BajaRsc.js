/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        16-09-2018 17:09:58 
 * Descripcion : BajaRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.BajaRsc = class BajaRsc extends Resource {

    constructor() {
        super();
    }

    addButtons() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_ver`,
            notext: true,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.FVER, type: 'button', evts: [{click: 'Obj.Facturacion.BajaAx.verDocumento'}]}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ANC, type: 'submit'}]
        });
    }

    getListBoxs(form) {
        $(form).appList({
            items: [
                {
                    data: 'serie_baja',
                    params: store.get('ID_PERSONA'),
                    container: `#${this._alias}d_serie`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_serie`,
                        name: `${this._alias}lst_serie`,
                        class: 'form-control'
                    },
                    default: null
                }
            ]
        });
    }

    validaDoc() {
        if ($(`#${this._alias}lst_serie`).val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._017
            });
            return false;
        }
        if ($(`#${this._alias}txt_num_doc`).val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._018
            });
            $(`#${this._alias}txt_num_doc`).focus();
            return false;
        }
        return true;
    }

};