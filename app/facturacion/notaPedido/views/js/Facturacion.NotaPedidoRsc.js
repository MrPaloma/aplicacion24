/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        25-09-2018 06:09:53 
 * Descripcion : NotaPedidoRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.NotaPedidoRsc = class NotaPedidoRsc extends Resource {

    constructor() {
        super();
        this._fila = 0;

        this._calculaTotales = () => {
            let cant, precio, precioSIGV, st, t, tigv, igv = parseFloat(store.get('IGV')), tGravada = 0, tIGV = 0, tTotal = 0;

            $(`#${this._alias}tb_detail`).find('tr').each(function () {
                cant = parseFloat($(this).find('td').eq(2).find('input').val());
                precio = parseFloat($(this).find('td').eq(3).find('input').val());  //precio de item con IGV

                precio = (!$.isNumeric(precio)) ? 0 : precio;
                cant = (!$.isNumeric(cant)) ? 0 : cant;

                precioSIGV = precio / (1 + igv); // precio de item sin IGV

                t = cant * precio;

                st = precioSIGV * cant;
                tigv = t - st;

                tIGV += tigv;
                tGravada += st;
                tTotal += t;

                $(this).find('td').eq(4).find('input').val(st.toFixed(2));
                $(this).find('td').eq(5).find('input').val(t.toFixed(2));
            });

            $(`#${this._alias}txt_total`).val(tTotal.toFixed(2));
        };

    }

    addButtons() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_add`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ITADD, type: 'button', evts: [{click: 'Obj.Facturacion.NotaPedidoAx.addItem'}]}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
        this._fila = 0;
        this.addProducto();
    }

    addProducto() {
        this._fila++;

        let tr = `
        <tr id="${this._alias}tr_${this._fila}">
            <td>
                <input id="${this._alias}hhbbproducto${this._fila}" name="${this._alias}hhbbproducto[]" type="hidden">
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_producto${this._fila}" name="${this._alias}txt_producto[]" type="text" class="input-xs">
                    </label>
                </section>
            </td>
            <td class="text-center _um"></td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_cantidad${this._fila}" name="${this._alias}txt_cantidad[]" type="text" class="input-xs _calcula" autocomplete="off">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_precio${this._fila}" name="${this._alias}txt_precio[]" type="text" class="input-xs lv-disabled" readonly="true">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_subtotal${this._fila}" name="${this._alias}txt_subtotal[]" type="text" class="input-xs lv-disabled" readonly="true">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_total_unitario${this._fila}" name="${this._alias}txt_total_unitario[]" type="text" class="input-xs lv-disabled" readonly="true">
                    </label>                                                                                                    
                </section>                
            </td>
            <td>
                <btn class="btn btn-danger" style="padding-left:3px;padding-right:3px"><i class="fa fa-trash"></i></button>
            </td>
        </tr>`;

        $(`#${this._alias}tb_detail`).append(tr);
        $(`#${this._alias}tr_${this._fila}`).find('select').chosen();
        $(`#${this._alias}tr_${this._fila}`).find('.chosen-container').css({width: '100%'});

        let fila = this._fila;
        $(`#${this._alias}txt_producto${this._fila}`).autocomplete({
            source: (request, response) => {
                $.ajax({
                    type: "POST",
                    url: "facturacion/notaPedido/getProducto",
                    dataType: "json",
                    data: {
                        term: request.term, _qn: Tools.en(_tk_), _alias: this._alias, f: fila
                    },
                    success: function (data) {
                        response(data);
                    }
                });
            },
            minLength: 2,
            select: (event, ui) => {
                $(`#${this._alias}txt_precio${ui.item.fila}`).val(ui.item.precio);
                $(`#${this._alias}hhbbproducto${ui.item.fila}`).val(ui.item.id);
                $(`#${this._alias}tr_${ui.item.fila}`).find('._um').html(ui.item.unidad_medida);
                $(`#${this._alias}txt_cantidad${this._fila}`).focus();
            }
        });
        $(`#${this._alias}txt_producto${this._fila}`).focus();

        $(`#${this._alias}tr_${this._fila}`).find('._calcula').keyup((e) => {
            if (!$.isNumeric($(e.currentTarget).val()) && $(e.currentTarget).val().length > 0) {
                $(e.currentTarget).val(0);
            }
            this._calculaTotales();
        });
        $(`#${this._alias}tr_${this._fila}`).find('.btn-danger').click((e) => {
            $(e.currentTarget).parent().parent('tr').remove();
            this._calculaTotales();
        });

    }
    
    validaProductos() {
        let rs = true;
        $(`#${this._alias}tb_detail`).find('tr').find('input._calcula').each(function () {
            $(this).css({border: '1px solid #ccc'});
            if ($(this).val().length == 0) {
                $(this).css({border: '1px solid #990000'});
                rs = false;
            }
        });
        if (!rs) {
            Tools.notify().smallMsn({
                content: APP_MSN._011
            });
        }

        if (rs) {
            $(`#${this._alias}tb_detail`).find('tr').find('input:hidden').each(function () {
                $(this).parent().find('input:text').css({border: '1px solid #ccc'});
                if ($(this).val().length == 0) {
                    $(this).parent().find('input:text').css({border: '1px solid #990000'});
                    rs = false;
                }
            });
            if (!rs) {
                Tools.notify().smallMsn({
                    content: APP_MSN._029
                });
            }
        }
        return rs;
    }
    

};