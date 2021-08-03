/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        26-09-2018 19:09:26 
 * Descripcion : KardexProductoRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.KardexProductoRsc = class KardexProductoRsc extends Resource {

    constructor() {
        super();

        this._setUnidades = (data) => {
            let h = '', cI = '', cS = '', nDoc = '', saldoC = 0;

            if (data.detail.length > 0) {
                $.each(data.detail, (i, v) => {
                    cI = (v.tipo_movimiento == 'I') ? v.cantidad : '';
                    cS = (v.tipo_movimiento == 'S') ? v.cantidad : '';
                    nDoc = (/null/g.test(v.serie)) ? (/null/g.test(v.numero_documento))?'':v.numero_documento : `${v.serie}-${v.numero_documento}`;

                    if (v.tipo_movimiento == 'I') {/*cuando es ingreso se suma para los totales*/
                        saldoC += parseFloat(v.cantidad);
                    } else if (v.tipo_movimiento == 'S') {/*se resta para los totales*/
                        saldoC -= parseFloat(v.cantidad);
                    }

                    h += `
                <tr>
                    <td class="text-center">${v.fecha}</td>
                    <td>${v.descripcion}</td>
                    <td class="text-center">${nDoc}</td>
                    <td class="text-right">${cI}</td>
                    <td class="text-right">${cS}</td>
                    <td class="text-right">${saldoC}</td>
                </tr>`;
                });
            } else {
                h = `<tr><td colspan="6"><div class="alert alert-info text-center"><i class="fa fa-info"></i> ${APP_ETIQUET.no_registros}</div></td></tr>`;
            }

            $(`#${this._alias}tb_unidad`).html(h);
        };

        this._setValorizado = (data) => {
            let h = '', cI = '', cS = '', nDoc = '', vuI = 0, vtI = 0, vuS = 0, vtS = 0,
                    saldoC = 0, saldoVU = 0, saldoVT = 0;

            if (data.detail.length > 0) {
                $.each(data.detail, (i, v) => {
                    cS = (v.tipo_movimiento == 'S') ? v.cantidad : '';
                    vuS = (v.tipo_movimiento == 'S') ? v.precio_unitario : '';
                    vtS = (v.tipo_movimiento == 'S') ? v.total_unitario : '';

                    cI = (v.tipo_movimiento == 'I') ? v.cantidad : '';
                    vuI = (v.tipo_movimiento == 'I') ? v.precio_unitario : '';
                    vtI = (v.tipo_movimiento == 'I') ? v.total_unitario : '';

                    nDoc = (/null/g.test(v.serie)) ? '' : `${v.serie}-${v.numero_documento}`;

                    saldoVU = v.precio_promedio;
                    if (v.tipo_movimiento == 'I') {/*cuando es ingreso se sua para los totales*/
                        saldoC += parseFloat(v.cantidad);
                        saldoVT = parseFloat(saldoC) * parseFloat(saldoVU);
                    } else if (v.tipo_movimiento == 'S') {/*se resta para los totales*/
                        saldoC -= parseFloat(v.cantidad);
                        saldoVT = parseFloat(saldoC) * parseFloat(saldoVU);
                    }

                    h += `
                <tr>
                    <td class="text-center">${v.fecha}</td>
                    <td>${v.descripcion}</td>
                    <td class="text-center">${nDoc}</td>
                    <td class="text-right">${cI}</td>
                    <td class="text-right">${vuI}</td>
                    <td class="text-right">${(vtI == '') ? '' : Tools.formatNumber(vtI)}</td>
                    <td class="text-right">${cS}</td>
                    <td class="text-right">${vuS}</td>
                    <td class="text-right">${(vtS == '') ? '' : Tools.formatNumber(vtS)}</td>
                    <td class="text-right">${saldoC}</td>
                    <td class="text-right">${Tools.formatNumber(parseFloat(saldoVU))}</td>
                    <td class="text-right">${Tools.formatNumber(saldoVT)}</td>
                </tr>`;
                });
            } else {
                h = `<tr><td colspan="12"><div class="alert alert-info text-center"><i class="fa fa-info"></i> ${APP_ETIQUET.no_registros}</div></td></tr>`;
            }

            $(`#${this._alias}tb_valorizado`).html(h);
        };

    }

    getListBoxs() {
        $(this._idFormIndex).appList({
            items: [
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
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_local`).change((e) => {
                    this.getProductos(e.currentTarget.value);

                    $(`#${this._alias}tb_unidad`).html(`
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>`);
                    $(`#${this._alias}tb_valorizado`).html(`
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    `);

                    Tools.setDataForm(this._idFormIndex, {
                        alias: this._alias,
                        elements: [
                            {item: 'txt_id_u', value: ''},
                            {item: 'txt_decripcion_u', value: ''},
                            {item: 'txt_umedida_u', value: ''},
                            {item: 'txt_id_v', value: ''},
                            {item: 'txt_decripcion_v', value: ''},
                            {item: 'txt_umedida_v', value: ''},
                            {item: 'txt_preciocompra_v', value: ''},
                            {item: 'txt_precioventa_v', value: ''},
                            {item: 'txt_inventario_v', value: ''}
                        ]
                    });
                });
            }
        });
    }

    getProductos(id) {
        $(this._idFormIndex).appList({
            items: [
                {
                    data: 'producto_local',
                    container: `#${this._alias}d_producto`,
                    required: true,
                    params: id,
                    attr: {
                        id: `${this._alias}lst_producto`,
                        name: `${this._alias}lst_producto`,
                        class: 'form-control'
                    },
                    default: null
                }
            ]
        });
    }

    addButtons() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_search`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.SERCH, type: 'submit'}]
        });
    }

    setKardex(data) {
        let head = data.head;
        Tools.setDataForm(this._idFormIndex, {
            alias: this._alias,
            elements: [
                {item: 'txt_id_u', value: head.id_local_producto},
                {item: 'txt_decripcion_u', value: head.catalogo},
                {item: 'txt_umedida_u', value: head.unidad_medida},
                {item: 'txt_id_v', value: head.id_local_producto},
                {item: 'txt_decripcion_v', value: head.catalogo},
                {item: 'txt_umedida_v', value: head.unidad_medida},
                {item: 'txt_preciocompra_v', value: Tools.formatNumber(head.precio_compra)},
                {item: 'txt_precioventa_v', value: Tools.formatNumber(head.precio_venta)},
                {item: 'txt_inventario_v', value: head.stock_actual}
            ]
        });
        this._setUnidades(data);
        this._setValorizado(data);
    }

};