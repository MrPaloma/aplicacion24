/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 18:09:25 
 * Descripcion : CatalogoRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.CatalogoRsc = class CatalogoRsc extends Resource {

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

    addButtonsFormNewCat() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_nw_cat`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.KTADD, type: 'button', evts: [{click: 'Obj.Facturacion.CategoriaAx.formNew'}]}]
        });
        
        $.fn.appButton.get({
            container: `#${this._alias}btn_nw_marca`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.MCADD, type: 'button', evts: [{click: 'Obj.Facturacion.MarcaAx.formNew'}]}]
        });
    }
    
    addButtonsFormNewCatSave() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns_cat`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }
    
    addButtonsFormNewMarcaSave() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns_marca`,
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

    setCatalogo(data) {
        Tools.setDataForm(this._formEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.catalogo},
                {item: 'txt_codinterno', value: data.codigo_interno},
                {item: 'txt_codbarra', value: data.codigo_barra},
                {item: 'txt_codreferencia', value: data.codigo_referencia},
                {item: 'lst_tipo', value: data.tipo, type: 'select'},
                {item: 'txt_precio_venta', value: data.precio_venta_cigv},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'},
                {item: 'txt_ubicacion', value: data.ubicacion},
                {item: 'txt_nxcaja', value: data.nxcaja}
            ]
        });
    }

    getListBoxs(form, data = false) {
        $(form).appList({
            items: [
                {
                    data: 'categoria',
                    container: `#${this._alias}d_categoria`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_categoria`,
                        name: `${this._alias}lst_categoria`,
                        class: 'form-control _categoria'
                    },
                    default: (data) ? data.id_categoria : null
                },
                {
                    data: 'umedida',
                    container: `#${this._alias}d_umedida`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_umedida`,
                        name: `${this._alias}lst_umedida`,
                        class: 'form-control'
                    },
                    default: (data) ? data.id_unidad_medida : '1'
                },
                {
                    data: 'marca',
                    container: `#${this._alias}d_marca`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_marca`,
                        name: `${this._alias}lst_marca`,
                        class: 'form-control _marca'
                    },
                    default: (data) ? data.id_marca : null
                },
                {
                    data: 'local',
                    container: `#${this._alias}d_local`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_local`,
                        name: `${this._alias}lst_local`,
                        class: 'form-control'
                    },
                    default: null
                },
            ]
        });

    }

};