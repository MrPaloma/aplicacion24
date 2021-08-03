/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        24-09-2018 06:09:02 
 * Descripcion : ReporteProductoRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.ReporteProductoRsc = class ReporteProductoRsc extends Resource {

    constructor() {
        super();

        this._productosCategoria = (data) => {
            let h = '';
            $.each(data, (i, v) => {
                h += `
                <tr class="tr_${v.id_categoria}" style="display:">
                    <td></td>
                    <td>${v.catalogo}</td>
                    <td class="text-right">${Tools.formatNumber(v.precio_publico)}</td>
                    <td class="text-right">${v.stock_actual}</td>
                    <td>${v.unidad_medida}</td>
                </tr>`;
            });
            return h;
        };
    }
    
    addButtonsPrint() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_ip`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteProductoAx.printAll'}]}
            ]
        });

        $.fn.appButton.get({
            container: `#${this._alias}btn_ip5`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteProductoAx.printAll5'}]}
            ]
        });

        $.fn.appButton.get({
            container: `#${this._alias}btn_ip7`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteProductoAx.printAll7'}]}
            ]
        });

        //boton para reporte de ventas por local
        $.fn.appButton.get({
            container: `#${this._alias}btn_bus_02`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteProductoAx.searchMasVendidos'}]}]
        });

        //boton FORM 3
        $.fn.appButton.get({
            container: `#${this._alias}btn_bus_03`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteProductoAx.searchStock0'}]}]
        });

         //boton FORM 4
         $.fn.appButton.get({
            container: `#${this._alias}btn_bus_04`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteProductoAx.searchStock6'}]}]
        });

        //boton FORM 5
        $.fn.appButton.get({
            container: `#${this._alias}btn_bus_05`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteProductoAx.searchVendidos'}]}]
        });

        //boton FORM 7
        $.fn.appButton.get({
            container: `#${this._alias}btn_bus_07`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteProductoAx.searchUtilidades'}]}]
        });
    
    }

    getListBoxs(tk) {
        $(this._idFormIndex).appList({
            items: [
                {
                    data: 'local',
                    container: `#${this._alias}d_local`,
                    attr: {
                        id: `${this._alias}lst_local`,
                        name: `${this._alias}lst_local`,
                        class: 'form-control'
                    },
                    default: '9'
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_local`).change((e) => {
                    this._getProductosLocal(tk, e.currentTarget.value);
                });
            }
        });
        // form 2
        $(this._idFormIndex).appList({
            items: [
                {
                    data: 'local',
                    container: `#${this._alias}d_local2`,
                    attr: {
                        id: `${this._alias}lst_local2`,
                        name: `${this._alias}lst_local2`,
                        class: 'form-control'
                    },
                    default: '9'
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_local2`).change((e) => {
                    // this._getProductosLocal(tk, e.currentTarget.value);
                });
            }
        });
        // form 3
        $(this._idFormIndex).appList({
            items: [
                {
                    data: 'local',
                    container: `#${this._alias}d_local3`,
                    attr: {
                        id: `${this._alias}lst_local3`,
                        name: `${this._alias}lst_local3`,
                        class: 'form-control'
                    },
                    default: '9'
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_local3`).change((e) => {
                    // this._getProductosLocal(tk, e.currentTarget.value);
                });
            }
        });
        // form 4
        $(this._idFormIndex).appList({
            items: [
                {
                    data: 'local',
                    container: `#${this._alias}d_local4`,
                    attr: {
                        id: `${this._alias}lst_local4`,
                        name: `${this._alias}lst_local4`,
                        class: 'form-control'
                    },
                    default: '9'
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_local4`).change((e) => {
                    // this._getProductosLocal(tk, e.currentTarget.value);
                });
            }
        });
        // form 5
        $(this._idFormIndex).appList({
            items: [
                {
                    data: 'local',
                    container: `#${this._alias}d_local5`,
                    attr: {
                        id: `${this._alias}lst_local5`,
                        name: `${this._alias}lst_local5`,
                        class: 'form-control'
                    },
                    default: '9'
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_local5`).change((e) => {
                    this._getProductosLocal(tk, e.currentTarget.value);
                });
            }
        });
        // form 7
        $(this._idFormIndex).appList({
            items: [
                {
                    data: 'local',
                    container: `#${this._alias}d_local7`,
                    attr: {
                        id: `${this._alias}lst_local7`,
                        name: `${this._alias}lst_local7`,
                        class: 'form-control'
                    },
                    default: '9'
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_local7`).change((e) => {
                    this._getProductosLocal(tk, e.currentTarget.value);
                });
            }
        });
    }

    setProductosLocal(data) {
        let h = '', productos = [];

        $.each(data.categorias, (i, v) => {
            productos = $.grep(data.productos, function (e,i) {
                return e.id_categoria == v.id_categoria;
            });
            h += `
            <tr>
                <td colspan="5"><a href="javascript:;" onclick="$('.tr_${v.id_categoria}').toggle();"><b>${v.categoria}</b></a></td>
            </tr>
            ${this._productosCategoria(productos)}`;
        });
        
        if(data.categorias.length == 0){
            h = `
            <tr>
                <td colspan="5"><div class="alert alert-info text-center"><i class="fa fa-info"></i> ${APP_ETIQUET.no_registros}</div></td>
            </tr>`;
        }
        $(`#${this._alias}tb_productos`).html(h);
    }

    validaFechas02() {
        if ($(`#${this._alias}txt_desde2`).val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._031
            });
            return false;
        }

        if ($(`#${this._alias}txt_hasta2`).val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._031
            });
            return false;
        }
        return true;
    }

    

};