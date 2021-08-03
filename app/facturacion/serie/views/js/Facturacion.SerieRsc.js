/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 18:09:32 
 * Descripcion : SerieRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.SerieRsc = class SerieRsc extends Resource {

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

    setSerie(data) {
        Tools.setDataForm(this._formEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_serie', value: data.serie},
                {item: 'txt_numero_actual', value: data.numero_actual},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }

    getListBoxs(form, data = false) {
        $(form).appList({
            items: [
                {
                    data: 'tipo_comprobante',
                    container: `#${this._alias}d_tipo_comprobante`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_tipo_comprobante`,
                        name: `${this._alias}lst_tipo_comprobante`,
                        class: 'form-control'
                    },
                    default: (data) ? data.id_tipo_comprobante : null
                }
            ]
        });
    }

    validaLetra() {
        let td = $(`#${this._alias}lst_tipo_comprobante`).val();
        let sr = $(`#${this._alias}txt_serie`).val().substr(0, 1);
        let rs = true;

        if (td == 1) {//factura
            if (sr.toLowerCase() != 'f') {
                Tools.notify().smallMsn({
                    content: APP_MSN._001
                });
                rs = false;
            }
        }
        if (td == 2) {//boleta
            if (sr.toLowerCase() != 'b') {
                Tools.notify().smallMsn({
                    content: APP_MSN._002
                });
                rs = false;
            }
        }
        if (td == 3 || td == 4) {//nota de credito, nota de debito
            if (sr.toLowerCase() == 'f' || sr.toLowerCase() == 'b') {
                rs = true;
            } else {
                Tools.notify().smallMsn({
                    content: APP_MSN._003
                });
                rs = false;
            }
        }
        if (td == 5) {//retencion
            if (sr.toLowerCase() != 'r') {
                Tools.notify().smallMsn({
                    content: APP_MSN._004
                });
                rs = false;
            }
        }
        if (td == 6) {//percepcion
            if (sr.toLowerCase() != 'p') {
                Tools.notify().smallMsn({
                    content: APP_MSN._005
                });
                rs = false;
            }
        }
        if (td == 7) {//guia remision
            if (sr.toLowerCase() != 't') {
                Tools.notify().smallMsn({
                    content: APP_MSN._006
                });
                rs = false;
            }
        }
        return rs;
    }

};