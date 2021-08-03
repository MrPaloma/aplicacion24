/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super  User  
 * Fecha:        07-02-2019 16:02:26 
 * Descripcion : MovimientoAlmacenRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.MovimientoAlmacenRsc = class MovimientoAlmacenRsc extends Resource {

    constructor() {
        super();

        this._file = 0;

        this._duplicateProduct = (p) => {
            let rs = false;
            $(`#${this._alias}d_productos`).find('input:hidden').each(function () {
                if (this.value == p.id) {
                    rs = true;
                }
            });
            return rs;
        };

        this._clearAuto = () => {
            setTimeout(() => {
                $(`#${this._alias}txt_producto`).val('');
                $(`#${this._alias}txt_producto`).removeClass('ui-autocomplete-loading');
            }, 100);
        };

        this._evtAutocomplete = (tk) => {
            this._file = 0;
            $(`#${this._alias}txt_producto`).autocomplete({
                source: (request, response) => {
                    if ($(`#${this._alias}lst_origen`).val().length == 0) {
                        Tools.notify().smallMsn({
                            content: APP_MSN._066
                        });
                        $(`#${this._alias}txt_producto`).removeClass('ui-autocomplete-loading');
                        return false;
                    }
                    $.ajax({
                        type: "POST",
                        url: "facturacion/movimientoAlmacen/getProducto",
                        dataType: "json",
                        data: {
                            term: request.term,
                            _qn: Tools.en(tk),
                            _alias: this._alias,
                            _idLocal: $(`#${this._alias}lst_origen`).val()
                        },
                        success: function (data) {
                            response(data);
                        }
                    });
                },
                minLength: 2,
                select: (event, ui) => {
                    if (this._duplicateProduct(ui.item)) {
                        this._clearAuto();
                        return false;
                    }
                    this._setProducto(ui.item);
                }
            });
        };

        this._setProducto = (p) => {
            this._file++;
            /*hhidproducto = almacena el id_local_producto y id_unidad_medida*/
            let d = `
            <div class="form-group">
                <div class="col-lg-8">
                    <input type="hidden" name="${this._alias}hhidproducto[]" value="${p.id}"/> 
                    <input type="text" class="form-control input-xs" id="txt_nproducto" name="txt_nproducto[]" value="${p.value}" disabled="true"/> 
                </div>
                <div class="col-lg-2">
                    <input type="text" class="form-control input-xs _cantidad" id="${this._alias}txt_cantidad${this._file}" name="${this._alias}txt_cantidad[]" placeholder="${APP_ETIQUET._013}" autocomplete="off"/> 
                </div>
                <div class="col-lg-2">
                     <button type="button" class="btn btn-danger btn-xs" onclick="$(this).parent().parent().remove();"><i class="fa fa-trash"></i></button>
                </div>
            </div>`;
            $(`#${this._alias}d_productos`).append(d);
            $(`#${this._alias}txt_cantidad${this._file}`).data('stock', p.stock_actual);
            this._clearAuto();
            $(`#${this._alias}d_productos`).find('._cantidad').keyup(function () {
                if ($.isNumeric($(this).val())) {
                    let stock = parseFloat($(this).data('stock'));
                    if (parseFloat($(this).val()) > stock) {
                        Tools.notify().smallMsn({
                            content: APP_MSN._067
                        });
                        $(this).val('');
                    }
                }
            });
        };

        this._validaCantidad = () => {
            let rs = true;

            $(`#${this._alias}d_productos`).find('._cantidad').each(function () {
                $(this).css({
                    border: '1px solid #ccc',
                    background: '#fff'
                });
                if (!$.isNumeric(this.value)) {
                    $(this).css({
                        border: '1px solid #990000',
                        background: '#F6CEE3'
                    });
                    rs = false;
                }
            });
            if (!rs) {
                Tools.notify().smallMsn({
                    content: APP_MSN._041
                });
            }
            return rs;
        };

    }

    addButtonsFormNew() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }

    addButtonsPrint() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.MovimientoAlmacenAx.printDetalle'}]}
            ]
        });
    }

    getListBoxs(form) {
        $(form).appList({
            items: [
                {
                    data: 'local',
                    container: `#${this._alias}d_origen`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_origen`,
                        name: `${this._alias}lst_origen`,
                        class: 'form-control'
                    },
                    default: null
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_origen`).change((e) => {
                    this.getLocalDestino(form, e.currentTarget.value);
                });
            }
        });
    }

    getLocalDestino(form, l) {
        $(form).appList({
            items: [
                {
                    data: 'local2',
                    container: `#${this._alias}d_destino`,
                    params: l,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_destino`,
                        name: `${this._alias}lst_destino`,
                        class: 'form-control'
                    },
                    default: null
                }
            ]
        });
    }

    setDetalle(data) {
        let h = '', i = 0, t = 0;
        $.each(data, function (a, b) {
            i++;
            h += `
            <tr>
                <td class="text-center">${i}</td>
                <td>${b.catalogo}</td>
                <td class="text-center">${b.cantidad}</td>
            </tr>`;
            t += parseFloat(b.cantidad);
        });
        $(`#${this._alias}d_detalle`).html(h);
        $(`#${this._alias}d_titems`).html(Tools.formatNumber(t, 2));
        $(`#${this._alias}d_origen`).html(data[0].origen);
        $(`#${this._alias}d_destino`).html(data[0].destino);
        $(`#${this._alias}d_fecha`).html(data[0].fecha);
    }

};