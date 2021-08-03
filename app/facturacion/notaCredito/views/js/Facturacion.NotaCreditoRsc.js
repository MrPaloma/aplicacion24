/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 17:09:42 
 * Descripcion : NotaCreditoRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.NotaCreditoRsc = class NotaCreditoRsc extends Resource {

    constructor() {
        super();

        this._calculaTotales = () => {
            let chk, cant, precio, precioSIGV, st, t, tigv, igv = parseFloat(store.get('IGV')), tGravada = 0, tIGV = 0, tTotal = 0;

            $(`#${this._alias}tb_detail`).find('tr').each(function () {
                chk = $(this).find('._active');

                if (chk.is(':checked')) {

                    cant = parseFloat($(this).find('td').eq(3).find('input').val());
                    precio = parseFloat($(this).find('td').eq(5).find('input').val());  //precio de item con IGV

                    precio = precio / cant;
                    
                    precioSIGV = precio / (1 + igv); // precio de item sin IGV

                    t = cant * precio;
                    st = precioSIGV * cant;
                    tigv = t - st;

                    tIGV += tigv;
                    tGravada += st;
                    tTotal += t;


                    $(this).find('td').eq(6).find('input').val(st.toFixed(2));
                    $(this).find('td').eq(7).find('input').val(t.toFixed(2));
                } else {
                    $(this).find('td').eq(6).find('input').val('');
                    $(this).find('td').eq(7).find('input').val('');
                }

            });

            $(`#${this._alias}txt_igv`).val(tIGV.toFixed(2));
            $(`#${this._alias}txt_gravada`).val(tGravada.toFixed(2));
            $(`#${this._alias}txt_total`).val(tTotal.toFixed(2));
        };

    }

    addButtons() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_ver`,
            notext: true,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.FVER, type: 'button', evts: [{click: 'Obj.Facturacion.NotaCreditoAx.verFactura'}]}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}btn_dale`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.XONT, type: 'button', evts: [{click: 'Obj.Facturacion.NotaCreditoAx.getFactura'}]}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GNC, type: 'submit'}]
        });
    }

    getListBoxs(form) {
        $(form).appList({
            items: [
                {
                    data: 'tipo_nota_credito',
                    container: `#${this._alias}d_tipo_nota_credito`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_tipo_nota_credito`,
                        name: `${this._alias}lst_tipo_nota_credito`,
                        class: 'form-control'
                    },
                    default: null
                },
                {
                    data: 'serie_n',
                    params: `3*${store.get('ID_PERSONA')}`,
                    container: `#${this._alias}d_serie_nc`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_nc_cerie`,
                        name: `${this._alias}lst_nc_cerie`,
                        class: 'form-control'
                    },
                    default: null
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_nc_cerie`).change((e) => {
                    this._getNumeroDocActual(e.currentTarget.value);
                    this.getSerie(form,e.currentTarget.value);
                });
            }
        });
    }
    
    getSerie(form,td){
        $(form).appList({
            items: [
                {
                    data: 'doc_user_notas',
                    params: `${td}*${store.get('ID_PERSONA')}`,
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

    setDocumento(data) {
        let head = data.head;
        let detail = data.detail;

        if (detail.length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._019
            });
            $(`#${this._alias}tb_detail`).html('');
        } else {
            let tr = '', fila = 0;
            $.each(detail, (i, v) => {
                fila++;
                tr += `
                <tr id="${this._alias}tr_${fila}">
                    <td>
                        <section style="margin-bottom: 0px;">
                            <label class="checkbox">
                                <input id="${this._alias}chk_enviar${fila}" name="${this._alias}chk_enviar[]" type="checkbox" value="${v.id_catalogo}" class="_active">
                                <i></i>
                            </label>
                        </section>
                    </td>
                    <td>
                        <input id="${this._alias}txt_venta_detalle${fila}" name="${this._alias}txt_venta_detalle[]" type="hidden" value="${v.id_venta_detalle}" disabled="true">
                        <section style="margin-bottom: 0px;">
                            <label class="input">
                                <input id="${this._alias}txt_producto${fila}" name="${this._alias}txt_producto[]" type="text" class="input-xs lv-disabled" value="${v.catalogo}" disabled="true">
                            </label>
                        </section>
                    </td>
                    <td class="text-center">${v.u_medida}</td>
                    <td>
                        <section style="margin-bottom: 0px;">
                            <label class="input">
                                <input id="${this._alias}txt_cantidad${fila}" name="${this._alias}txt_cantidad[]" type="text" class="input-xs lv-disabled" value="${v.cantidad}" disabled="true">
                            </label>
                        </section>
                    </td>
                    <td>
                        <section style="margin-bottom: 0px;">
                            <label class="input">
                                <input id="${this._alias}txt_precio_facturado${fila}" name="${this._alias}txt_precio_facturado[]" type="text" class="input-xs lv-disabled" value="${v.total}" disabled="true">
                            </label>
                        </section>
                    </td>
                    <td>
                        <section style="margin-bottom: 0px;">
                            <label class="input">
                                <input id="${this._alias}txt_precio${fila}" name="${this._alias}txt_precio[]" type="text" class="input-xs _calcula lv-disabled" autocomplete="off" value="${v.total}" disabled="true">
                            </label>
                        </section>
                    </td>
                    <td>
                        <section style="margin-bottom: 0px;">
                            <label class="input">
                                <input id="${this._alias}txt_subtotal${fila}" name="${this._alias}txt_subtotal[]" type="text" class="input-xs lv-disabled" disabled="true">
                            </label>
                        </section>
                    </td>
                    <td>
                        <section style="margin-bottom: 0px;">
                            <label class="input">
                                <input id="${this._alias}txt_total_unitario${fila}" name="${this._alias}txt_total_unitario[]" type="text" class="input-xs lv-disabled" disabled="true">
                            </label>
                        </section>
                    </td>
                </tr>`;
            });
            $(`#${this._alias}tb_detail`).html(tr);

            $(`#${this._alias}tb_detail`).find('._calcula').keyup((e) => {
                if (!$.isNumeric($(e.currentTarget).val())) {
                    $(e.currentTarget).val(0);
                }
                this._calculaTotales();
            });

            let chk, trCk, precioF;
            $(`#${this._alias}tb_detail`).find('._active').click((e) => {
                chk = $(e.currentTarget);
                trCk = chk.parent().parent().parent().parent('tr');
                precioF = trCk.find('td').eq(4).find('input:text').val();

                trCk.find('._calcula').attr({
                    disabled: true
                }).addClass('lv-disabled').val(precioF);
                //cambiamos readonly por disabled para no enviarlo en el form - ventadetalle, cantidad, subtotal, totalunitario
                trCk.find('td').eq(1).find('input:hidden').removeAttr('readonly').attr('disabled', true);
                trCk.find('td').eq(3).find('input').removeAttr('readonly').attr('disabled', true);
                trCk.find('td').eq(6).find('input').removeAttr('readonly').attr('disabled', true);
                trCk.find('td').eq(7).find('input').removeAttr('readonly').attr('disabled', true);

                if (chk.is(':checked')) {
                    trCk.find('._calcula').attr({
                        disabled: false
                    }).removeClass('lv-disabled');
                    //cambiamos disabled por readonly para poder enviarlo en el form - ventadetalle, cantidad, subtotal, totalunitario
                    trCk.find('td').eq(1).find('input:hidden').removeAttr('disabled').attr('readonly', true);
                    trCk.find('td').eq(3).find('input').removeAttr('disabled').attr('readonly', true);
                    trCk.find('td').eq(6).find('input').removeAttr('disabled').attr('readonly', true);
                    trCk.find('td').eq(7).find('input').removeAttr('disabled').attr('readonly', true);
                }
                this._calculaTotales();
            });
            $(`#${this._alias}chk_all_enviar`).off('click').click((e) => {
                $(`#${this._alias}tb_detail`).find('._active').click();
            });

        }
        $(`#${this._alias}chk_all_enviar`).prop('checked', false);
        $(`#${this._alias}txt_igv`).val('');
        $(`#${this._alias}txt_gravada`).val('');
        $(`#${this._alias}txt_total`).val('');
        Tools.setDataForm(this._idFormNotaCredito, {
            alias: this._alias,
            elements: [
                {item: 'txt_razon_social', value: head.razon_social},
                {item: 'txt_ruc', value: head.documento_identidad},
                {item: 'txt_fecha_emision', value: head.fecha_emision},
                {item: 'txt_direccion', value: head.direccion_fiscal},
                {item: 'txt_tipo_doc_afectado', value: head.tipo_comprobante},
                {item: 'txt_num_doc_afectado', value: `${head.serie}-${head.numero_documento}`},
                {item: 'txt_tipo_moneda', value: head.moneda}
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
    
    addButtonAnular() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ANC, type: 'submit'}]
        });
    }

};