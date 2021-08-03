/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        24-09-2018 06:09:51 
 * Descripcion : ReporteVentaRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.ReporteVentaRsc = class ReporteVentaRsc extends Resource {

    constructor() {
        super();

        this._setDocumentos = (data) => {
            let h = '', cssnulo, t = 0;
            $.each(data, (i, v) => {
                cssnulo = (v.anulado == 1) ? 'text-decoration: line-through;color:red;' : '';
                h += `
                <tr>
                    <td style="width: 80px;${cssnulo}">${v.serie}-${v.numero_documento}</td>
                    <td style="width: 150px;${cssnulo}">${v.razon_social}</td>
                    <td style="width: 80px;${cssnulo}" class="text-center">${v.fecha_emision}</td>
                    <td style="width: 68px;${cssnulo}" class="text-right">${Tools.formatNumber(v.total_venta)}</td>
                </tr>`;
                t += parseFloat(v.total_venta);
            });
            $(`#${this._alias}tb_productos`).find('tbody').html(h);
            $(`#${this._alias}d_total`).html(Tools.formatNumber(t));
        };

        this._setChartCategoriaConsolidado = (data) => {
            let cols = [];

            $.each(data, (i, v) => {
                cols.push({
                    categoria: v.categoria,
                    total: v.total,
                    color: Tools.randomColor()
                });
            });

            var chart = AmCharts.makeChart(`${this._alias}chart_cat_consolidado`, {
                "type": "serial",
                "theme": "light",
                "marginRight": 70,
                "dataProvider": cols,
                "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": APP_ETIQUET._110
                    }],
                "startDuration": 1,
                "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]</b>",
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "total"
                    }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "categoria",
                "categoryAxis": {
                    "gridPosition": "start",
                    "labelRotation": 45
                },
                "export": {
                    "enabled": true
                }

            });
        };

    }
    //boton para reporte de ventas por local
    addBtnBuscar01() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_bus_01`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteVentaAx.searchVentaLocal'}]}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}btn_bus_02`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'button', evts: [{click: 'Obj.Facturacion.ReporteVentaAx.searchVentaGeneral'}]}]
        });
    }

    //boton para reporte de detalle de ventas
    addBtnBuscarDetalle() {
        $.fn.appButton.get({
            container: `#${this._alias}d_btn_bus`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'button'}]
        }, (oSettings) => {
            $(`#${this._alias}d_btn_bus`).find('button').click((e) => {
                this.totalesLocal($(e.currentTarget), _tk_);
            });
        });
    }

    //valida fechas de ventas por local
    validaFechas01() {
        if ($(`#${this._alias}txt_desde`).val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._031
            });
            return false;
        }

        if ($(`#${this._alias}txt_hasta`).val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._031
            });
            return false;
        }
        return true;
    }

    setVentasLocal(tk, data) {
        let h = '';
        if (data.length == 0) {
            h = `<div class="alert alert-info text-center"><i class="fa fa-info"></i> ${APP_ETIQUET.no_registros}</div>`;
        } else {
            $.each(data, (i, v) => {
                h += `
                <div class="col-lg-3 col-md-6" style="margin-bottom: 10px">
                    <div class="panel panel-green">
                        <div class="panel-heading padding-10">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-shopping-cart fa-4x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge">${Tools.formatNumber(v.total)}</div>
                                    <div>${v.local}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="panel-footer">
                            <span class="pull-left"><a href="javascript:;" class="foot_a _detalle" data-k="${v.id_local}" data-name="${v.local}">${APP_ETIQUET._085}</a></span>
                            <span class="pull-right"><i class="fa fa-check _detalle" data-k="${v.id_local}" data-name="${v.local}"></i></span>
                            <div class="clearfix"></div>

                            <span class="pull-left hide"><a href="javascript:;" class="foot_a _vendedor" data-k="${v.id_local}" data-name="${v.local}">${APP_ETIQUET._086}</a></span>
                            <span class="pull-right hide"><i class="fa fa-check"></i></span>
                            <div class="clearfix hide"></div>
                        </div>
                        
                    </div>
                </div>`;
            });
        }
        $(`#${this._alias}d_venta_local`).html(h);
        $(`#${this._alias}d_venta_local`).find('.foot_a').each((i, v) => {
            $(v).data('k', $(v).data('k'));
            $(v).removeAttr('data-k');
        });
        $(`#${this._alias}d_venta_local`).find('._detalle').click((e) => {
            this._formDetalle(tk, $(e.currentTarget), $(e.currentTarget).data('name'));
        });
        $(`#${this._alias}d_venta_local`).find('._vendedor').click((e) => {
            this._formDetalleVendedor(tk, $(e.currentTarget), $(e.currentTarget).data('name'));
        });
    }

    setTotalesLocal(f, dataAll) {
        let data = dataAll.totales;
        $(`#${this._alias}d_bruto`).html(Tools.formatNumber(data.total_venta_bruta));
        $(`#${this._alias}d_neta`).html(Tools.formatNumber(data.total_venta_neta));
        $(`#${this._alias}d_igv`).html(Tools.formatNumber(data.total_igv));
        $(`#${this._alias}d_utilidad`).html(Tools.formatNumber(data.total_utilidad));
        if (f == 1) {
            $(`#${this._alias}txt_desde_d`).val($(`#${this._alias}txt_desde`).val());
            $(`#${this._alias}txt_hasta_d`).val($(`#${this._alias}txt_hasta`).val());
        } else if (f == 1) {
            $(`#${this._alias}txt_desde_d`).val($(`#${this._alias}txt_desde_d`).val());
            $(`#${this._alias}txt_hasta_d`).val($(`#${this._alias}txt_hasta_d`).val());
        }
        this._setDocumentos(dataAll.documentos);

        this._setChartCategoriaConsolidado(dataAll.categorias_consolidado);

    }

    getListBoxs() {
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
                    default: null
                }
            ]
        });
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

    setVentas(data) {
        this.setVentasGeneral(data.ventaGeneral);
        this.setVentasPagado(data.ventasEfectivoPagado);
        this.setVentasCredito(data.ventasEfectivoCredito);
        this.setCajaChica(data.cajaChica);
        this.setPorCobrar(data.porCobrar);
        this.setPorPagar(data.porPagar);
    }

    setPorCobrar(data) {
        let h = '', t1 = 0, t2 = 0;
        $.each(data, function (a, b) {
            h += `
            <tr>
                <td>${b.razon_social}</td>
                <td style="text-align: center">${b.fecha_emision}</td>
                <td style="text-align: right">${b.deuda}</td>
                <td style="text-align: right">${b.saldo}</td>
            </tr>`;
            t1 += parseFloat(b.deuda);
            t2 += parseFloat(b.saldo);
        });
        h += `
        <tr>
            <td colspan="2" style="text-align: right"><b>${APP_ETIQUET._017}</b></td>
            <td style="text-align: right">${Tools.formatNumber(t1)}</td>
            <td style="text-align: right">${Tools.formatNumber(t2)}</td>
        </tr>`;
        $(`#${this._alias}tb_x_cobrar`).html(h);
    }

    setPorPagar(data) {
        let h = '', t1 = 0, t2 = 0;
        $.each(data, function (a, b) {
            h += `
            <tr>
                <td>${b.razon_social}</td>
                <td style="text-align: center">${b.fecha_compra}</td>
                <td style="text-align: right">${b.deuda}</td>
                <td style="text-align: right">${b.saldo}</td>
            </tr>`;
            t1 += parseFloat(b.deuda);
            t2 += parseFloat(b.saldo);
        });
        h += `
        <tr>
            <td colspan="2" style="text-align: right"><b>${APP_ETIQUET._017}</b></td>
            <td style="text-align: right">${Tools.formatNumber(t1)}</td>
            <td style="text-align: right">${Tools.formatNumber(t2)}</td>
        </tr>`;
        $(`#${this._alias}tb_x_pagar`).html(h);
    }

    setCajaChica(data) {
        let h = '', tm = 'x', arr;

        let getDocs = function (data) {
            let f = '', t = 0;
            $.each(data, function (a, b) {
                f += `
                <tr>
                    <td></td>
                    <td></td>
                    <td>${b.concepto}</td>
                    <td style="text-align: center">${b.fecha}</td>
                    <td style="text-align: right">${b.importe}</td>
                </tr>`;
                t += parseFloat(b.importe);
            });
            return {row: f, total: t};
        };

        let getTipoIngreso = function (data) {
            let hh = '', tmp = 'x', ob, rs;
            $.each(data, function (a, b) {
                if (tmp != b.tipo) {
                    ob = $.grep(data, function (e) {
                        return e.tipo == b.tipo;
                    });
                    rs = getDocs(ob);
                    hh += `
                    <tr>
                        <td></td>
                        <td colspan="4"><b>${(b.tipo == 'I') ? APP_ETIQUET._235 : APP_ETIQUET._236}</b></td>
                    </tr>
                    ${rs.row}
                    <tr>
                        <td colspan="4" style="text-align: right"><b>${APP_ETIQUET._017}</b></td>
                        <td style="text-align: right"><b>${Tools.formatNumber(rs.total)}</b></td>
                    </tr>`;
                }
                tmp = b.tipo;
            });
            return hh;
        };

        $.each(data, function (a, b) {

            if (tm != b.id_local_caja) {
                arr = $.grep(data, function (e) {
                    return e.id_local_caja == b.id_local_caja
                });
                h += `
                <tr>
                    <td colspan="5"><b>${b.caja}</b></td>
                </tr>
                ${getTipoIngreso(arr)}`;
            }
            tm = b.id_local_caja;
        });

        $(`#${this._alias}tb_box_litle`).html(h);
    }

    setVentasPagado(data) {
        let h = '';

        $.each(data, function (a, b) {
            h += `
            <tr>
                <td style="width: 200px;padding: 5px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;">${b.tipo_moneda}</td>
                <td style="width: 100px;padding: 5px;border-bottom:1px solid #ccc;text-align: right">${Tools.formatNumber(b.total_venta)}</td>
            </tr>`;
        });
        $(`#${this._alias}tb_pagado`).html(h);
    }

    setVentasCredito(data) {
        let h = '';

        $.each(data, function (a, b) {
            h += `
            <tr>
                <td style="width: 200px;padding: 5px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;">${b.tipo_moneda}</td>
                <td style="width: 100px;padding: 5px;border-bottom:1px solid #ccc;text-align: right">${Tools.formatNumber(b.total_venta)}</td>
            </tr>`;
        });
        $(`#${this._alias}tb_credito`).html(h);
    }

    setVentasGeneral(data) {
        let h = 'x', tmp = 'x', arr;

        let getDocs = function (data) {
            let ah = '', st = '', t = 0, cn;
            $.each(data, function (a, b) {
                if (b.anulado == 1) {
                    st = 'text-decoration: line-through;color:red;';
                }
                cn = (b.pagado == 1) ? 'Pagado' : 'Crédito';
                ah += `
                <tr>
                    <td></td>
                    <td></td>
                    <td style="${st}text-align:center">${b.num_doc}</td>
                    <td style="${st}">${b.razon_social}</td>
                    <td style="${st}text-align:center">${b.fecha_emision}</td>
                    <td style="${st}">${cn}</td>
                    <td style="${st}text-align:right">${b.total_venta}</td>
                </tr>`;
                if (b.anulado == 0) {
                    t += parseFloat(b.total_venta);
                }
            });
            return {row: ah, total: Tools.formatNumber(t)};
        };

        let getRgByMoneda = function (data) {
            let hh = '', tm = 'x', arfp, rs;
            $.each(data, function (a, b) {
                if (tm != b.id_forma_pago) {
                    arfp = $.grep(data, function (e) {
                        return e.id_forma_pago == b.id_forma_pago;
                    });
                    rs = getDocs(arfp);
                    hh += `
                    <tr>
                        <td></td>
                        <td colspan="6"><b>${b.forma_pago}</b></td>
                    </tr>
                    ${rs.row}
                    <tr>
                        <td colspan="6" style="text-align:right"><b>${APP_ETIQUET._017}</b></td>
                        <td style="text-align:right"><b>${rs.total}</b></td>
                    </tr>`;
                }
                tm = b.id_forma_pago;
            });
            return hh;
        };

        $.each(data, function (a, b) {
            arr = $.grep(data, function (e) {
                return e.id_tipo_moneda == b.id_tipo_moneda;
            })
            if (tmp != b.id_tipo_moneda) {
                h += `
                <tr>
                    <td colspan="7"><b>${b.tipo_moneda}</b></td>
                </tr>
                ${getRgByMoneda(arr)}`;
            }
            tmp = b.id_tipo_moneda;
        });

        $(`#${this._alias}tb_vg`).html(h);
    }

};