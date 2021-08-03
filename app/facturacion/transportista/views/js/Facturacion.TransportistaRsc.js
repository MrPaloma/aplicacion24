/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin  Art  
* Fecha:        30-12-2018 01:12:26 
* Descripcion : TransportistaRsc.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.TransportistaRsc = class TransportistaRsc extends Resource {
    
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
    
    getListBoxs(form, data = false) {
        $(form).appList({
            items: [
                {
                    data: 'tipo_documento_identidad',
                    container: `#${this._alias}d_tipo_doc`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_tipo_doc`,
                        name: `${this._alias}lst_tipo_doc`,
                        class: 'form-control'
                    },
                    default: (data) ? data.id_tipo_documento_identidad : null
                }
            ]
        });
    }
    
    setTransporte(form,data){
        Tools.setDataForm(form, {
            alias: this._alias,
            elements: [
                {item: 'txt_num_doc', value: data.numero_documento},
                {item: 'txt_razon_social', value: data.razon_social},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
        this.getListBoxs(form, data);
    }
    
    setVehiculo(form,data){
        Tools.setDataForm(form, {
            alias: this._alias,
            elements: [
                {item: 'txt_num_doc', value: data.numero_documento},
                {item: 'txt_placa', value: data.placa},
                {item: 'txt_apellidos', value: data.apellidos},
                {item: 'txt_nombres', value: data.nombres},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
        this.getListBoxs(form, data);
    }
    
};