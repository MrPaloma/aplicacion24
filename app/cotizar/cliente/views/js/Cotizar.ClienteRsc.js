/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Art  
 * Fecha:        23-11-2018 04:11:07 
 * Descripcion : ClienteRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Cotizar.ClienteRsc = class ClienteRsc extends Resource {

    constructor() {
        super();
        this._fila = 0;

        this._calculaTotales = () => {
            let cant, precio, precioSIGV, st, t, tigv, igv = parseFloat(store.get('IGV')), tTotal = 0;

            $(`#${this._alias}tb_detail`).find('tr').each(function () {
                cant = parseFloat($(this).find('td').eq(1).find('input').val());
                precio = parseFloat($(this).find('td').eq(2).find('input').val());  //precio de item con IGV

                precio = (!$.isNumeric(precio)) ? 0 : precio;
                cant = (!$.isNumeric(cant)) ? 0 : cant;

                precioSIGV = precio / (1 + igv); // precio de item sin IGV

                t = cant * precio;
                tTotal += t;

                $(this).find('td').eq(3).find('input').val(t.toFixed(2));
            });

            $(`#${this._alias}txt_total`).val(tTotal.toFixed(2));
        };

        this._evtsTC = () => {
            $(`#${this._alias}lst_tipo_moneda`).change((e) => {
                if ([2, 3].includes(parseInt($(e.currentTarget).val()))) {
                    $(`#${this._alias}txt_tipo_cambio`).removeAttr('disabled');
                    $(`#${this._alias}txt_tipo_cambio`).removeClass('lv-disabled');
                } else {
                    $(`#${this._alias}txt_tipo_cambio`).val('');
                    $(`#${this._alias}txt_tipo_cambio`).addClass('lv-disabled');
                    $(`#${this._alias}txt_tipo_cambio`).attr('disabled', true);
                }
                this._changeMoney();
            });
        };

        this._changeMoney = () => {
            let tm = $(`#${this._alias}lst_tipo_moneda`).val();
            let tc = $(`#${this._alias}txt_tipo_cambio`).val();
            let punitario, nwp, preal, iprecio;
            tc = (tc.length == 0) ? 0 : tc;

            $(`#${this._alias}tb_detail`).find('tr').each(function () {
                iprecio = $(this).find('td:eq(2)').find('input:text');
                preal = iprecio.data('preal');
                punitario = iprecio.val();
//iprecio.data('pu')
                if ([2, 3].includes(parseInt(tm))) {
                    if(tc > 0){
                        nwp = parseFloat(punitario) / parseFloat(tc);
                    }else{
                        nwp = parseFloat(punitario);
                    }
                } else {
                    nwp = parseFloat(punitario);
                }

                //si preal tiene valor, quiere decir que el producto ya esta en la bandeja detalle
                if (preal) {
                    iprecio.val(nwp.toFixed(2));
                }
            });
            this._calculaTotales();
        };

        this._evtTypeChange = () => {
            let el;
            $(`#${this._alias}txt_tipo_cambio`).keyup((e) => {
                el = $(e.currentTarget);
                if (!$.isNumeric(el.val())) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._055
                    });
                    el.val('');
                    return false;
                }
                this._changeMoney();
            });
        };

    }

    addButtonsFormNew() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}btn_nw_cliente`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.CLADD, type: 'button', evts: [{click: 'Obj.Facturacion.ClienteAx.formNew'}]}]
        }, (o) => {
            $(`#${PREBTNCTXT}${this._alias}${APP_BTN.CLADD}`).css({
                padding: '5px'
            });
        });
    }

    addButtonsMail() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.EMA, type: 'submit'}]
        });
    }

    addButtonsFormUpdate() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.UPD, type: 'submit'}]
        });
    }

    addButtonItem() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_add`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ITADD, type: 'button', evts: [{click: 'Obj.Cotizar.ClienteAx.addItem'}]}]
        });
    }

    addProducto(data = false) {
        let idProducto = '', producto = '', cantidad = 1, precio = 0, total = 0,precio_compra_real=0,precio2=0;

        if (data) {
            idProducto = data.id_local_producto;
            producto = data.catalogo;
            cantidad = data.cantidad;
            precio = data.precio_unitario;
            total = data.total_unitario;
            precio_compra_real = data.precio_compra_real;
            precio2 = data.precio;
        }
        
        this._fila++;

        let tr = `
        <tr id="${this._alias}tr_${this._fila}">
            <td>
                <input id="${this._alias}hhbbproducto${this._fila}" name="${this._alias}hhbbproducto[]" type="hidden" value="${idProducto}">
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_producto${this._fila}" name="${this._alias}txt_producto[]" type="text" class="input-xs" value="${producto}" placeholder="${APP_ETIQUET.search_sensitive}">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_cantidad${this._fila}" name="${this._alias}txt_cantidad[]" type="text" class="input-xs _calcula" autocomplete="off" value="${cantidad}">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_precio_unitario${this._fila}" data-pu="${precio2}" data-preal="${precio_compra_real}" name="${this._alias}txt_precio_unitario[]" type="text" class="input-xs _calcula _preal" value="${precio}">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_total_unitario${this._fila}" name="${this._alias}txt_total_unitario[]" type="text" class="input-xs" readonly="true" value="${total}">
                    </label>
                </section>
            </td>
            <td>
                <btn id="${this._alias}btn_del${this._fila}" class="btn btn-danger" style="padding-left:3px;padding-right:3px"><i class="fa fa-trash"></i></button>
            </td>
        </tr>`;

        $(`#${this._alias}tb_detail`).append(tr);
        $(`#${this._alias}tr_${this._fila}`).find('select').chosen();
        $(`#${this._alias}tr_${this._fila}`).find('.chosen-container').css({width: '100%'});

        let fila = this._fila;


        $.widget("custom.tablecomplete", $.ui.autocomplete, {
            
            _resizeMenu: function() {
                this.menu.element.outerWidth((70 * screen.width) / 100);
            }
            
        });
       
        $.widget("custom.tablecomplete", $.ui.autocomplete, {
            _create: function() {
              this._super();
              this.widget().menu("option", "items", "> li:not(.ui-autocomplete-header)");
            },
            _renderMenu(ul, items) {
              var self = this;
              ul.addClass("container");
              let header = {
                value: "Producto",
                // marca: "Marca",
                // unidad_medida: "UNID",
                precio_compra_real: "PC",
                precio: "PP",
                precio_ferreteria: "PF",
                precio_distribuidor: "PD",
                // stock_actual: "Stock",
                isheader: true
              };
              self._renderItemData(ul, header);
              $.each(items, function(index, item) {
                self._renderItemData(ul, item);
              });
        
            },
            _renderItemData(ul, item) {
              return this._renderItem(ul, item).data("ui-autocomplete-item", item);
            },
            _renderItem(ul, item) {
              var $li = $("<li class='ui-menu-item' role='presentation'></li>");
              if (item.isheader)
                $li = $("<li class='ui-autocomplete-header' role='presentation'  style='font-weight:bold !important;'></li>");
              var $content = "<div class='row ui-menu-item-wrapper table-complete-ul'>" + 
                                "<div class='col-xs-5'>" + item.value + "</div>" + 
                                // "<div class='col-xs-1'>" + item.marca + "</div>" + 
                                // "<div class='col-xs-1'>" + item.unidad_medida + "</div>" + 
                                "<div class='col-xs-1' style='color: rgb(255, 82, 82); font-weight: bold;'>" + item.precio_compra_real + "</div>" + 
                                "<div class='col-xs-1'>" + item.precio + "</div>" + 
                                "<div class='col-xs-1'>" + item.precio_ferreteria + "</div>" + 
                                "<div class='col-xs-1'>" + item.precio_distribuidor + "</div>" + 
                                // "<div class='col-xs-1'>" + item.stock_actual + "</div>" +
                            "</div>";
                                
                                 
              $li.html($content);
        
        
              return $li.appendTo(ul);
            },
        
            
          });


        $(`#${this._alias}txt_producto${this._fila}`).tablecomplete({
            source: (request, response) => {
                $.ajax({
                    type: "POST",
                    url: "cotizar/cliente/getProducto",
                    dataType: "json",
                    data: {
                        term: request.term.split(" "), _qn: Tools.en(_tk_), _alias: this._alias, f: fila
                    },
                    success: function (data) {
                        console.log(data)
                        response(data);
                    }
                });
            },
            minLength: 2,
            select: (event, ui) => {
                //agregar data-preal para control del precio
                $(`#${this._alias}txt_precio_unitario${ui.item.fila}`).data('preal', ui.item.precio_compra_real);
                $(`#${this._alias}txt_precio_unitario${ui.item.fila}`).data('pu', ui.item.precio);
                $(`#${this._alias}txt_precio_unitario${ui.item.fila}`).val(ui.item.precio);
                $(`#${this._alias}hhbbproducto${ui.item.fila}`).val(ui.item.id);
                $(`#${this._alias}tr_${ui.item.fila}`).find('td').eq(1).find('input:text').focus();
                //this._calculaTotales();
                this._changeMoney();
            }
        });
        $(`#${this._alias}txt_producto${this._fila}`).focus();

        $(`#${this._alias}tr_${this._fila}`).find('._calcula').keyup((e) => {
            if (!$.isNumeric($(e.currentTarget).val()) && $(e.currentTarget).val().length > 0) {
                $(e.currentTarget).val(0);
            }
            this._calculaTotales();
        });

        $(`#${this._alias}tr_${this._fila}`).find('._preal').blur((e) => {
            let preal = parseFloat($(e.currentTarget).data('preal'));
            let pnew = parseFloat($(e.currentTarget).val());
            //si el precio ingresado es menor q el precio real (costo), no debe permitirle ingresar
            if (pnew < preal && $(`#${this._alias}lst_tipo_moneda`).val() == 1) {// solo cuando es en soles
                Tools.notify().alert({
                    content: APP_MSN._052
                });
                $(e.currentTarget).val('');
                return false;
            }
            //this._calculaTotales();
            this._changeMoney();           
        });

        $(`#${this._alias}tr_${this._fila}`).find('.btn-danger').click((e) => {
            $(e.currentTarget).parent().parent('tr').remove();
            this._calculaTotales();
        });
    }

    getListBoxs(form, data = false, d = false) {
        let at = {
            id: `${this._alias}lst_cliente`,
            name: `${this._alias}lst_cliente`,
            class: 'form-control _cliente'
        };
        let tm = {
            id: `${this._alias}lst_tipo_moneda`,
            name: `${this._alias}lst_tipo_moneda`,
            class: 'form-control'
        };
        if (d) {
            at = {
                id: `${this._alias}lst_cliente`,
                name: `${this._alias}lst_cliente`,
                class: 'form-control',
                disabled: true
            };
            tm = {
                id: `${this._alias}lst_tipo_moneda`,
                name: `${this._alias}lst_tipo_moneda`,
                class: 'form-control',
                disabled: true
            };
        }
        $(form).appList({
            items: [
                {
                    data: 'cliente_all',
                    container: `#${this._alias}d_cliente`,
                    required: true,
                    attr: at,
                    default: (data) ? data.id_entidad : null
                },
                {
                    data: 'tipo_moneda',
                    container: `#${this._alias}d_tipo_moneda`,
                    required: true,
                    optionSelec: false,
                    attr: tm,
                    default: (data) ? data.id_tipo_moneda : null
                }
            ]
        });
    }

    validaProductos() {
        let rs = true;
        $(`#${this._alias}tb_detail`).find('tr').find('input.input-xs').each(function () {
            $(this).css({border: '1px solid #ccc'});
            if ($(this).val().length == 0) {
                $(this).css({border: '1px solid #990000'});
                rs = false;
            }
        });
        if (!rs) {
            Tools.notify().msn({
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
                Tools.notify().msn({
                    content: APP_MSN._029
                });
            }
        }
        if ($(`#${this._alias}tb_detail`).find('tr').find('input.input-xs').length == 0) {
            Tools.notify().msn({
                content: APP_MSN._029
            });
        }
        return rs;
    }

    setCotizacion(data) {
        console.log(data.head)
        console.log('aaaaaaaaaaa')
        let row = data.head;
        Tools.setDataForm(this._idFormEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_total', value: row.total},
                {item: 'txt_tipo_cambio', value: row.tipo_cambio},
                {item: 'txt_observaciones', value: row.observaciones}
            ]
        });

        this._fila = 0;
        $(`#${this._alias}tb_detail`).html('');
        $.each(data.detail, (i, v) => {
            this.addProducto(v);
            console.log(v);
            console.log(i);

        });
    }

};