/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Art  
 * Fecha:        02-12-2018 06:12:52 
 * Descripcion : LiquidacionDiariaRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.LiquidacionDiariaRsc = class LiquidacionDiariaRsc extends Resource {

    constructor() {
        super();

        this._getDocs = (data, o) => {
            let hh = '', tt = 0;
            $.each(data, (i, v) => {
                if (v.id_tipo_moneda == o.id_tipo_moneda && v.id_caja == o.id_caja) {
                    hh += `
                        <tr>   
                            <td></td>
                            <td></td>
                            <td>${v.serie}-${v.numero_documento}</td>
                            <td>${v.razon_social}</td>
                            
                            <td class="text-center">${v.fecha_emision}</td>
                            <td class="text-right">${Tools.formatNumber(v.total_venta)}</td>
                        </tr>`;
                    tt += parseFloat(v.total_venta);
                }
            });
            hh += `
                <tr>    
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right"><b>${APP_ETIQUET._017}</b></td>
                    <td class="text-right">${Tools.formatNumber(tt)}</td>
                </tr>`;

            return hh;
        };

        this._setDocs = (data) => {
            let h = '';

            let getMonedas = (data, cj) => {
                let hhh = '';
                $.each(data.monedas, (i, v) => {
                    if (v.id_caja == cj) {
                        hhh += `
                        <tr style="background:#eee">
                            <td></td>
                            <td colspan="5"><b>${v.tipo_moneda}</b></td>
                        </tr>
                        ${this._getDocs(data.ventas, v)}`;
                    }
                });
                return hhh;
            };


            $.each(data.cajas, (i, v) => {
                h += `
                <tr style="background:#eee">
                    <td colspan="6"><b>${v.caja}</b></td>
                </tr>
                ${getMonedas(data, v.id_caja)}`;
            });

            if (h.length == 0) {
                h = `<tr><td colspan="6"><div class="alert alert-info text-center"><i class="fa fa-info"></i> ${APP_ETIQUET.no_registros}</div></td></tr>`;
            }
            return h;
        };

        this._setLiquidacion = (data) => {
            let h = '';

            let getMonedas = (data, cj) => {
                let hh = '';

                let getNoAnulados = (data, o) => {
                    let d = '';
                    $.each(data, (i, v) => {
                        if (v.id_caja == o.id_caja && v.id_tipo_moneda == o.id_tipo_moneda) {
                            d += `
                            <tr>
                                <td data-fm="${v.id_forma_pago}" data-mn="${v.id_tipo_moneda}" data-cj="${o.id_caja}" data-nmn="${o.tipo_moneda}"><a class="_fpago" href="javascript:;">${v.forma_pago}</a></td><td class="text-right">${Tools.formatNumber(v.total)}</td>
                            </tr>`;
                        }
                    });
                    return d;
                };

                $.each(data.monedas, (i, v) => {
                    if (v.id_caja == cj) {
                        hh += `
                        <div class="pull-left col-md-4">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <td colspan="2">${v.tipo_moneda}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${getNoAnulados(data.liquidacion, v)}
                                </tbody>
                            </table>
                        </div>`;
                    }
                });
                return hh;
            };

            $.each(data.cajas, (i, v) => {
                h += `
                <div class="col-lg-12">
                    <div class="panel panel-warning">
                        <div class="panel-heading">
                            <i class="fa fa-lg fa-fw fa-cube"></i> ${v.caja}
                            <div class="pull-right">
                            </div>
                        </div>
                        <div class="panel-body">
                            <div class="text-left">
                                ${getMonedas(data, v.id_caja)}
                            </div>
                        </div>
                    </div>
                </div>`;
            });

            if (h.length == 0) {
                h = `<div class="alert alert-info text-center"><i class="fa fa-info"></i> ${APP_ETIQUET.no_registros}</div>`;
            }

            return h;
        };

    }

    addButtonsForm() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SED, type: 'submit'}]
        });

        $.fn.appButton.get({
            container: `#${this._alias}btn_print_1, #${this._alias}btn_print_2, #${this._alias}btn_print_3`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.LiquidacionDiariaAx.printLiks'}]}
            ]
        }, (o) => {
            $(`#${this._alias}btn_print_1, #${this._alias}btn_print_2, #${this._alias}btn_print_3`).find('button').off('click').click((e) => {
                Obj.Facturacion.LiquidacionDiariaAx.printLiks($(e.currentTarget));
            });
        });
    }

    addButtonsPrintD() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_print_m`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.LiquidacionDiariaAx.printDetalle'}]}
            ]
        });
    }

    getLst(form) {
        $(form).appList({
            items: [
                {
                    data: 'users',
                    params: store.get('ID_LOCAL'),
                    container: `#${this._alias}d_users`,
                    attr: {
                        id: `${this._alias}lst_user`,
                        name: `${this._alias}lst_user`,
                        class: 'form-control'
                    },
                    default: null
                }
            ]
        });
    }

    setVentas(data) {
        $(`#${this._alias}tb_general`).html(this._setDocs(data.general));
        $(`#${this._alias}tb_anulados`).html(this._setDocs(data.anulados));
        $(`#${this._alias}d_lik`).html(this._setLiquidacion(data.liquidacion));

        $(`#${this._alias}d_lik`).find('._fpago').click((e) => {
            let fp = $(e.currentTarget).parent().data('fm');
            let tm = $(e.currentTarget).parent().data('mn');
            let cj = $(e.currentTarget).parent().data('cj');
            let nmn = $(e.currentTarget).parent().data('nmn');
            this._formDetalle(_tk_, fp, tm, cj, nmn, $(e.currentTarget).html());
        });
    }

    setTitle() {
        let fi = $(`#${this._alias}txt_desde`).val();
        let ff = $(`#${this._alias}txt_hasta`).val();

        let t = `(${fi} ${APP_ETIQUET._145} ${ff})`;
        if (fi == ff) {
            t = `(${fi})`;
        }

        $(`#${this._alias}d_fecha1`).html(t);
        $(`#${this._alias}d_fecha2`).html(t);
        $(`#${this._alias}d_fecha3`).html(t);
    }

    setUserLogin() {
        let cb = `
        <select class="form-control" id="${this._alias}lst_user" name="${this._alias}lst_user">
            <option value="${store.get('ID_USUARIO')}">${$('#show-shortcut').html()}</option>
        </select> `;
        $(`#${this._alias}d_users`).html(cb);
        $(`#${this._alias}lst_user`).chosen();
    }

    setDetalle(data) {
        let h = '', t = 0;
        $.each(data, function (i, v) {
            h += `
            <tr>
                <td>${v.concepto}</td>
                <td class="text-center">${v.fecha}</td>
                <td class="text-right">${Tools.formatNumber(v.importe)}</td>
            </tr>`;
            t += parseFloat(v.importe);
        });
        $(`#${this._alias}tb_detail_m`).html(h);
        $(`#${this._alias}d_total_m`).html(Tools.formatNumber(t));
    }

};