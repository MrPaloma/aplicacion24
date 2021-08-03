/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 20:09:30 
 * Descripcion : VentaRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.VentaRsc = class VentaRsc extends Resource {

    constructor() {
        super();
        this._fila = 0;
        this._lastValues = [];
        this._tmpData = null;

        this._calculaTotales = () => {
            let tipoIgv, cant, precio, precioSIGV, st, t, tigv, igv = parseFloat(store.get('IGV')), tExonerada = 0, tInafecta = 0, tGravada = 0, tIGV = 0, tGratuita = 0, tTotal = 0;

            $(`#${this._alias}tb_detail`).find('tr').each(function () {
                cant = parseFloat($(this).find('td').eq(2).find('input').val());
              precio = parseFloat($(this).find('td').eq(5).find('input').val());  //precio de item con IGV
                tipoIgv = $(this).find('td').eq(4).find('select').val();

                precio = (!$.isNumeric(precio)) ? 0 : precio;
                cant = (!$.isNumeric(cant)) ? 0 : cant;

                precioSIGV = precio / (1 + igv); // precio de item sin IGV



                t = cant * precio;



                switch (parseInt(tipoIgv)) {
                    case 10: //Gravado - Operación Onerosa
                        st = precioSIGV * cant;
                        tigv = t - st;

                        tIGV += tigv;
                        tGravada += st;
                        tTotal += t;
                        break;
                    case 11: //[Gratuita] Gravado – Retiro por premio
                        st = t;
                        tGratuita += t;
                        break;
                    case 12: //[Gratuita] Gravado – Retiro por donación
                        st = t;
                        tGratuita += t;
                        break;
                    case 13: //[Gratuita] Gravado – Retiro
                        st = t;
                        tGratuita += t;
                        break;
                    case 14: //[Gratuita] Gravado – Retiro por publicidad
                        st = t;
                        tGratuita += t;
                        break;
                    case 15: //[Gratuita] Gravado – Bonificaciones
                        st = t;
                        tGratuita += t;
                        break;
                    case 16: //[Gratuita] Gravado – Retiro por entrega a trabajadores
                        st = t;
                        tGratuita += t;
                        break;
                    case 20: //Exonerado - Operación Onerosa
                        st = t;
                        tExonerada += t;
                        tTotal += t;
                        break;
                    case 30: //Inafecto - Operación Onerosa
                        st = t;
                        tInafecta += t;
                        tTotal += t;
                        break;
                    case 31: //[Gratuita] Inafecto – Retiro por Bonificación
                        st = t;
                        tGratuita += t;
                        break;
                    case 32: //[Gratuita] Inafecto – Retiro
                        st = t;
                        tGratuita += t;
                        break;
                    case 33: //[Gratuita] Inafecto – Retiro por Muestras Médicas
                        st = t;
                        tGratuita += t;
                        break;
                    case 34: //[Gratuita] Inafecto - Retiro por Convenio Colectivo
                        st = t;
                        tGratuita += t;
                        break;
                    case 35: //[Gratuita] Inafecto – Retiro por premio
                        st = t;
                        tGratuita += t;
                        break;
                    case 36: //[Gratuita] Inafecto - Retiro por publicidad
                        st = t;
                        tGratuita += t;
                        break;
                    case 40: //Exportación
                        st = t;
                        tInafecta += t;
                        tTotal += t;
                        break;

                }

                $(this).find('td').eq(6).find('input').val(st.toFixed(2));
                $(this).find('td').eq(7).find('input').val(t.toFixed(2));
            });

            $(`#${this._alias}txt_exonerada`).val(tExonerada.toFixed(2));
            $(`#${this._alias}txt_inafecta`).val(tInafecta.toFixed(2));
            $(`#${this._alias}txt_gratuita`).val(tGratuita.toFixed(2));
            $(`#${this._alias}txt_igv`).val(tIGV.toFixed(2));
            $(`#${this._alias}txt_gravada`).val(tGravada.toFixed(2));
            $(`#${this._alias}txt_total`).val(tTotal.toFixed(2));
        };

        this._setDetailGuia = (data) => {
            let detail = data.detail, h = '';
            let n = 0;
            $.each(detail, function (i, v) {
                n++;
                h += `
                <tr>
                    <td class="text-center">${n}</td>
                    <td>${v.catalogo}</td>
                    <td class="text-center">${v.u_medida}</td>
                    <td class="text-center">${v.cantidad}</td>
                </tr>
                `;
            });
            $(`#${this._alias}tb_detail_guia`).html(h);
        };

        this._evts = () => {
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
                iprecio = $(this).find('td:eq(4)').find('input:text');
                preal = iprecio.data('pu');
                punitario = iprecio.data('pu');

                if ([2, 3].includes(parseInt(tm)) && tc > 0) {
                    nwp = parseFloat(punitario) / parseFloat(tc);
                } else {
                    nwp = parseFloat(preal);
                }

                //si preal tiene valor, quiere decir que el producto ya esta en la bandeja detalle
                if (preal) {
                    iprecio.val(nwp.toFixed(2));
                }
            });
            this._calculaTotales();
        };

        this._evtVuelto = () => {
            let v = $(`#${this._alias}txt_vuelto`);
            let t = $(`#${this._alias}txt_total`);

            $(`#${this._alias}txt_recibido`).keyup(function () {
                if ($.isNumeric(this.value)) {
                    v.val((parseFloat(this.value) - parseFloat(t.val())).toFixed(2));
                } else {
                    v.val(0);
                }
            });
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

        this._setVenta = (form, data) => {
            let head = data.head;

            Tools.setDataForm(form, {
                alias: this._alias,
                elements: [
                    {item: 'txt_tipo_doc', value: head.name_tipo_comprobante},
                    {item: 'txt_serie', value: head.serie},
                    {item: 'txt_num_doc', value: head.numero_documento},
                    {item: 'txt_fecha_vencimiento', value: head.fecha_vencimiento},
                    {item: 'txt_tipo_moneda', value: head.tipo_moneda_name},
                    {item: 'txt_cliente', value: `${head.documento_identidad} ${head.razon_social}`},
                    {item: 'txt_forma_pago', value: head.forma_pago},
                    {item: 'txt_orden_compra', value: head.orden_compra},
                    {item: 'txt_tipo_cambio', value: head.tipo_cambio},
                    {item: 'txt_guia_transportista', value: head.numero_guia_transportista}
                ]
            });
            $(`#${this._alias}rd_pagado${head.pagado}`).prop('checked', true);
            this.setPedido(data.detail);
            this.getDirecciones(form, head.id_entidad, head);
        };

    }

    addButtons() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_add`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ITADD, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.addItem'}]}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GNC, type: 'submit'}]
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
        $.fn.appButton.get({
            container: `#${this._alias}btn_nw_prod`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.PRADD, type: 'button', evts: [{click: 'Obj.Facturacion.CatalogoAx.formNew'}]}]
        }, (o) => {
            $(`#${PREBTNCTXT}${this._alias}${APP_BTN.PRADD}`).css({
                padding: '5px'
            });
        });

    }

    addBtnOpenBox() {
        $(`#sp_btnapc`).html('');
        $.fn.appButton.get({
            container: `#sp_btnapc`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ABRE, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.formCaja'}]}]
        }, (o) => {
            $(`#${PREBTNCTXT}${this._alias}${APP_BTN.ABRE}`).css({
                padding: '5px'
            });
        });
    }

    addButtonAnular() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ANC, type: 'submit'}]
        });
    }

    addButtonSave() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }

    addButtonSaveG() {
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn_g`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.CLS, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.closeGuia'}]},
                {keybtn: APP_BTN.GRB, type: 'submit'}
            ]
        });
    }

    addButtonUpdateG() {
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn_g`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.CLS, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.closeGuia'}]},
                {keybtn: APP_BTN.UPD, type: 'submit'},
                {keybtn: APP_BTN.PDF, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.getPDFGuia'}]},
                {keybtn: APP_BTN.XML, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.getXMLGuia'}]}
            ]
        });
    }

    addButtonPrint() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.printDetalleCaja'}]}]
        });
    }

    addButtonPrintTk() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_print_tk`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.printTicket'}]}]
        });
    }

    getListBoxs(form) {
        $(form).appList({
            items: [
                {
                    data: 'tipo_doc_venta',
                    container: `#${this._alias}d_tipo_doc`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_tipo_doc`,
                        name: `${this._alias}lst_tipo_doc`,
                        class: 'form-control'
                    },
                    default: '8'
                },
                {
                    data: 'tipo_moneda',
                    container: `#${this._alias}d_tipo_moneda`,
                    required: true,
                    optionSelec: false,
                    attr: {
                        id: `${this._alias}lst_tipo_moneda`,
                        name: `${this._alias}lst_tipo_moneda`,
                        class: 'form-control'
                    },
                    default: null
                },
                {
                    data: 'serie_guia_remision_user',
                    container: `#${this._alias}d_serie_guia_remision`,
                    params: store.get('ID_PERSONA'),
                    required: true,
                    optionSelec: false,
                    attr: {
                        id: `${this._alias}lst_serie_guia_remision`,
                        name: `${this._alias}lst_serie_guia_remision`,
                        class: 'form-control'
                    },
                    default: null
                },
                {
                    data: 'tipo_igv',
                    container: `#${this._alias}d_tipo_igv`,
                    required: true,
                    optionSelec: false,
                    attr: {
                        name: `${this._alias}lst_tipo_igv[]`,
                        class: 'form-control _calcula_lst'
                    },
                    default: null
                },
                {
                    data: 'forma_pago',
                    container: `#${this._alias}d_forma_pago`,
                    required: true,
                    optionSelec: false,
                    attr: {
                        id: `${this._alias}lst_forma_pago`,
                        name: `${this._alias}lst_forma_pago`,
                        class: 'form-control'
                    },
                    default: '008'
                }
            ],
            callback: () => {
                this.getSerieCliente(form, '8');
                $(`#${this._alias}lst_tipo_doc`).change((e) => {
                    this.getSerieCliente(form, e.currentTarget.value);
                });

                $(`#${this._alias}lst_serie_guia_remision`).change((e) => {
                    this._getNumeroDocActual(e.currentTarget.value, 'txt_guia_remitente');
                });
                this._fila = 0;
                this.addProducto();
                $(`#${this._alias}lst_serie_guia_remision`).change();
            }
        });

        
        
    }

    getListBoxsEdit(form) {
        $(form).appList({
            items: [
                {
                    data: 'tipo_igv',
                    container: `#${this._alias}d_tipo_igv`,
                    required: true,
                    optionSelec: false,
                    attr: {
                        name: `${this._alias}lst_tipo_igv[]`,
                        class: 'form-control _calcula_lst'
                    },
                    default: null
                }
            ]
        });
    }

    getSerieCliente(form, td) {
        $(form).appList({
            items: [
                {
                    data: 'serie_user',
                    params: `${td}*${store.get('ID_PERSONA')}`,
                    container: `#${this._alias}d_serie`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_serie`,
                        name: `${this._alias}lst_serie`,
                        class: 'form-control'
                    },
                    default: '17'
                },
                {
                    data: 'cliente_capp',
                    container: `#${this._alias}d_cliente`,
                    params: td,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_cliente`,
                        name: `${this._alias}lst_cliente`,
                        class: 'form-control _cliente'
                    },
                    default: '8'
                }
            ],
            callback: () => {
                this._getNumeroDocActual('17', 'txt_num_doc');
                $(`#${this._alias}lst_serie`).change((e) => {
                    this._getNumeroDocActual(e.currentTarget.value, 'txt_num_doc');
                });
                $(`#${this._alias}lst_cliente`).change((e) => {
                    this.getDirecciones(form, e.currentTarget.value);
                });
            }
        });
    }

    getDirecciones(form, id, data) {
        $(form).appList({
            items: [
                {
                    data: 'direcciones',
                    params: id,
                    container: `#${this._alias}d_direccion`,
                    optionSelec: false,
                    attr: {
                        id: `${this._alias}lst_direccion`,
                        name: `${this._alias}lst_direccion`,
                        class: 'form-control'
                    },
                    default: (data) ? data.direccion_fiscal : null
                }
            ]
        });
    }

    addProducto(data = false) {

        let idProducto = '', producto = '', um = '', cantidad = 1, precio = 0, stotal = 0, total = 0, stock=0;

        if (data) {
            idProducto = data.id_local_producto;
            producto = data.catalogo;
            um = data.umedida;
            cantidad = data.cantidad;
            precio = data.precio_unitario;
            stotal = data.sub_total;
            total = data.total;
            stock= data.stock_actual;

        }

        this._fila++;

        this._lastValues[this._fila] = '';
        
        let tigv = $(`#${this._alias}d_tipo_igv`).html();
        let tr = `
        <tr id="${this._alias}tr_${this._fila}">
            <td style="width:60%;">
                <input id="${this._alias}hhbbproducto${this._fila}" name="${this._alias}hhbbproducto[]" type="hidden" value="${idProducto}">
                <section style="margin-bottom: 0px; width:100%;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_producto${this._fila}" name="${this._alias}txt_producto[]" type="text" class="input-xs" value="${producto}" placeholder="${APP_ETIQUET.search_sensitive}">
                    </label>
                </section>
            </td>
            <td class="text-center _um" style="width:2%;">${um}</td>
            <td style="width:2%;">
                <section  style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:12px; height:35px" id="${this._alias}txt_cantidad${this._fila}" name="${this._alias}txt_cantidad[]" type="text" class="input-xs _calcula" value="${cantidad}" autocomplete="off">
                    </label>
                </section>
            </td>
             <td style="width:5%;">
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:12px; height:35px" id="${this._alias}txt_stock${this._fila}" name="${this._alias}txt_stock[]" type="text" class="input-xs" readonly=readonly value="${stock}">
                    </label>
                </section>
            </td>
            <td style="width:10%;">
                <section style="margin-bottom: 0px;" id="${this._alias}lst_tipo_afecta${this._fila}"><label class="select">${tigv}</label></section>
            </td>
            <td style="width:7%;">
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:12px; height:35px" id="${this._alias}txt_precio${this._fila}" name="${this._alias}txt_precio[]" type="text" class="input-xs _calcula valid" value="${precio}" autocomplete="off">
                    </label>
                </section>
            </td>
            <td style="width:7%;">
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:12px; height:35px" id="${this._alias}txt_subtotal${this._fila}" name="${this._alias}txt_subtotal[]" type="text" class="input-xs lv-disabled" readonly="true" value="${stotal}">
                    </label>
                </section>
            </td>
            <td style="width:7%;">
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:12px; height:35px" id="${this._alias}txt_total_unitario${this._fila}" name="${this._alias}txt_total_unitario[]" type="text" class="input-xs lv-disabled" readonly="true" value="${total}">
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
        
        // ENTER PARA PASAR AL SIGUIENTE INPUT
        
        

        let fila = this._fila;

        $(`#${this._alias}txt_producto${this._fila}`).bind( "input", (e) => {
          /*if(this.isLector(this._lastValues[fila],e.target.value)){
            console.log('lector');
            this._tmpData = this._fila;
          }else{

             this._tmpData = null;
          }*/
          this._tmpData = this._fila;
          this._lastValues[fila] = e.target.value;
        });
        
        $.widget("custom.tablecomplete", $.ui.autocomplete, {
            
            _resizeMenu: function() {
                this.menu.element.outerWidth( (70 * screen.width) / 100 );
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
                marca: "Marca",
                unidad_medida: "UNID",
                precio_compra: "PC",
                precio_publico: "PP",
                precio_ferreteria: "PF",
                precio_distribuidor: "PD",
                stock_actual: "Stock",
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
                                "<div class='col-xs-1'>" + item.marca + "</div>" + 
                                "<div class='col-xs-1'>" + item.unidad_medida + "</div>" + 
                                "<div class='col-xs-1' style='color: rgb(255, 82, 82); font-weight: bold;'>" + item.precio_compra + "</div>" + 
                                "<div class='col-xs-1'>" + item.precio_publico + "</div>" + 
                                "<div class='col-xs-1'>" + item.precio_ferreteria + "</div>" + 
                                "<div class='col-xs-1'>" + item.precio_distribuidor + "</div>" + 
                                "<div class='col-xs-1'>" + item.stock_actual + "</div>" +
                            "</div>";
                                
                                 
              $li.html($content);
        
        
              return $li.appendTo(ul);
            },
        
            
          });
          

          var autocomplete = $(`#${this._alias}txt_producto${this._fila}`).tablecomplete({
            source: (request, response) => {
                $.ajax({
                    type: "POST",
                    url: "facturacion/venta/getProducto",
                    dataType: "json",
                    data: {
                        term: request.term.split(" "), _qn: Tools.en(_tk_), _alias: this._alias, f: fila
                    },
                    success: (data) =>  {
                        response(data);
                        if (data.length > 0 && this._tmpData != null) {
                            if (request.term == data[0].codigo) {
                                console.log('lector ok')
                                $(`#${this._alias}txt_producto${this._tmpData}`).data('ui-autocomplete').menu.element.children().first().click();
                                /*$('#BCTXT_VENT__ITADD').click();
                                $(`#${this._alias}txt_producto${this._fila + 1}`).focus();*/
                            }
                        }
                        /*if (data.length > 0 && this._tmpData != null){
                            $(`#${this._alias}txt_producto${this._tmpData}`).data('ui-autocomplete').menu.element.children().first().click();
                            $('#BCTXT_VENT__ITADD').click();
                            $(`#${this._alias}txt_producto${this._fila + 1}`).focus();
                        }*/
                    }
                });
            },
            minLength: 2,
            autoFocus: true,
            select: (event, ui) => {
               /* if (ui.item.stock_actual > 0 && ui.item.stock_actual <= 5) {
                    Tools.notify().alert({
                        content: `${APP_MSN._068} ${ui.item.value}`
                    });
                    
                } else if (ui.item.stock_actual <= 0 ){ 
                     Tools.notify().alert({
                        content: `${ui.item.value} ${APP_MSN._068}`
                    });
                    $(`#${this._alias}txt_producto${ui.item.fila}`).val('');
                    return false; //para que es esto? limpia
                }*/
                // $(`#${this._alias}txt_precio${ui.item.fila}`).data('pu', ui.item.precio_publico);//para el tipo de cambio

                let pv_min = parseFloat(ui.item.precio_compra)
                
                $(`#${this._alias}txt_precio${ui.item.fila}`).attr('type', 'number')
                //$(`#${this._alias}txt_precio${ui.item.fila}`).attr('max', pv_max)
                $(`#${this._alias}txt_precio${ui.item.fila}`).attr('min', pv_min)

                let pre = $(`#${this._alias}txt_precio${ui.item.fila}`)
        
                $(`#${this._alias}txt_precio${ui.item.fila}`).keypress( function(e) {

                    if ( e.keyCode === 13 && parseFloat(pre.val()) >= pv_min) {
                        
                        e.preventDefault();
                        $('#BCTXT_VENT__ITADD').click();
                    }
                    console.log(e.keyCode);
                })
                $(`#${this._alias}hhbbproducto${ui.item.fila}`).val(ui.item.id);
                $(`#${this._alias}txt_precio${ui.item.fila}`).val(ui.item.precio_publico);
                $(`#${this._alias}txt_stock${ui.item.fila}`).val(ui.item.stock_actual);
                $(`#${this._alias}tr_${ui.item.fila}`).find('._um').html(ui.item.unidad_medida);
                $(`#${this._alias}tr_${ui.item.fila}`).find('td').eq(2).find('input:text').focus().select();
                
                // $('#BCTXT_VENT__ITADD').click();
                
                this._calculaTotales();
            }
        });

        $(`#${this._alias}txt_producto${this._fila}`).focus();

        $(`#${this._alias}tr_${this._fila}`).find('._calcula').keyup((e) => {
            if (!$.isNumeric($(e.currentTarget).val()) && $(e.currentTarget).val().length > 0) {
                $(e.currentTarget).val(0);
            }
            this._calculaTotales();
        });
        $(`#${this._alias}tr_${this._fila}`).find('._calcula_lst').change((e) => {
            this._calculaTotales();
        });
        $(`#${this._alias}tr_${this._fila}`).find('.btn-danger').click((e) => {
            $(e.currentTarget).parent().parent('tr').remove();
            this._calculaTotales();
        });

    }

    isLector(lastValue, newValue) {
        if (newValue.length - lastValue.length > 1) {
            return true;
        } else {
            return false;
        }
    }



    /*validaGuia() {
     if ($(`#${this._alias}chk_guia`).is(':checked') && $(`#${this._alias}txt_guia_remitente`).val().length == 0) {
     Tools.notify().smallMsn({
     content: APP_MSN._009
     });
     $(`#${this._alias}txt_guia_remitente`).focus();
     return false;
     }
     if (!$.isNumeric($(`#${this._alias}txt_guia_remitente`).val()) && $(`#${this._alias}txt_guia_remitente`).val().length > 0) {
     Tools.notify().smallMsn({
     content: APP_MSN._010
     });
     $(`#${this._alias}txt_guia_remitente`).focus();
     return false;
     }
     return true;
     }*/

    validaProductos() {
        var alias  = this._alias;
       
        var cont = 0;
        $(`#${this._alias}tb_detail`).find('tr').find('input.input-xs').each(function (i, v) {
            $(this).css({border: '1px solid #ccc'});
            if(cont == 0 && $(this).val().length == 0){
                return;
            }
            if ($(this).val().length == 0) {
                var id = $(this)[0].id;
                console.log(`${alias}tr_` + id.substr(id.length - 1))
                $(`#${alias}tr_` + id.substr(id.length - 1)).remove();
            }
            cont++;
        });

        
        let rs = true;
        $(`#${this._alias}tb_detail`).find('tr').find('input.input-xs').each(function (i, v) {
            $(this).css({border: '1px solid #ccc'});
            if ($(this).val().length == 0) {
                //$(this).css({border: '1px solid #990000'});
                //rs = false;
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

    validaTipoCambio() {
        let rs = true;
        if ($(`#${this._alias}lst_tipo_moneda`).val() != 1 && $(`#${this._alias}txt_tipo_cambio`).val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._012
            });
            $(`#${this._alias}txt_tipo_cambio`).focus();
            return false;
        }
        return rs;
    }

    setPedido(data) {
        this._fila = 0;
        $(`#${this._alias}tb_detail`).html('');
        $.each(data, (i, v) => {
            this.addProducto(v);
        });
        this._calculaTotales();
    }

    getLstCajas(form) {
        $(form).appList({
            items: [
                {
                    data: 'cajas_closed',
                    params: store.get('ID_LOCAL'),
                    container: `#${this._alias}d_cajas`,
                    attr: {
                        id: `${this._alias}lst_caja`,
                        name: `${this._alias}lst_caja`,
                        class: 'form-control'
                    },
                    default: store.get('ID_CAJA')
                }
            ]
        });
    }

    setBoxOpened(b) {
        $(`#${this._alias}sp_caja`).html(`<b>${b}</b> <span id="${this._alias}btn_openbox"></span>`);
        $.fn.appButton.get({
            container: `#${this._alias}btn_openbox`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.SED, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.formDetalle'}]},
                {keybtn: APP_BTN.CCSH, type: 'button', evts: [{click: 'Obj.Facturacion.VentaAx.formCloseCashbox'}]}
            ]
        }, (o) => {
            $(`#${PREBTNCTXT}${this._alias}${APP_BTN.SED}, #${PREBTNCTXT}${this._alias}${APP_BTN.CCSH}`).css({
                padding: '5px'
            });
        });
    }

    setBoxClosed() {
        $(`#${this._alias}sp_caja`).html(`<b>${APP_ETIQUET._132}</b>`);
        this.addBtnOpenBox()
    }

    setDetailCaja(data) {
        let h = '', tm = 'x';

        let getDetail = (data, tm) => {
            let hh = '';
            $.each(data, (i, v) => {
                if (v.id_tipo_moneda == tm) {
                    hh += `
                    <tr>
                        <td style="width: 250px">${v.forma_pago}</td><td class="text-right">${v.total}</td>
                    </tr>`;
                }
            });
            return hh;
        };

        $.each(data.detail, (i, v) => {
            if (tm != v.id_tipo_moneda) {
                h += `
                <table class="table table-hover">
                    <thead>
                        <th colspan="2">${v.tipo_moneda}</th>
                    </thead>
                    <tbody>${getDetail(data.detail, v.id_tipo_moneda)}</tbody>
                </table>`;
            }
            tm = v.id_tipo_moneda;
        });

        $(`#${this._alias}d_liquidar`).html(h);
        $(`#${this._alias}d_fecha`).html(`(${data.fecha.fecha})`);
    }

    clearVenta(form, data) {
        Tools.setDataForm(form, {
            alias: this._alias,
            elements: [
                {item: 'txt_num_doc', value: data.rs.num_doc},
                {item: 'txt_numero_pedido', value: ''},
                {item: 'txt_fecha_vencimiento', value: ''},
                {item: 'lst_tipo_moneda', value: '1', type: 'select'},
                {item: 'lst_cliente', value: '8', type: 'select'},
                {item: 'lst_forma_pago', value: '008', type: 'select'},
                {item: 'txt_orden_compra', value: ''},
                {item: 'txt_tipo_cambio', value: ''},
                {item: 'lst_direccion', value: '', type: 'select'},
                {item: 'txt_guia_remitente_tmp', value: ''},
                {item: 'txt_guia_transportista', value: ''},
                {item: 'tb_detail', type: 'html', value: ''},
                {item: 'txt_observaciones', value: ''},
                {item: 'txt_exonerada', value: '0.00'},
                {item: 'txt_inafecta', value: '0.00'},
                {item: 'txt_gravada', value: '0.00'},
                {item: 'txt_igv', value: '0.00'},
                {item: 'txt_gratuita', value: '0.00'},
                {item: 'txt_total', value: '0.00'},
                {item: 'txt_tipo_cambio', value: ''},
                {item: 'txt_recibido', value: ''},
                {item: 'txt_vuelto', value: ''},
                {item: 'rd_pagado1', value: 1, type: 'radio'}
            ]
        });
    }

    getProductos(data) {
        let h = '';
        $.each(data, function (i, v) {
            h += `
            <tr>
        
                <td class="text-left" style="font-size: 112.1%; width:100%" colspan="5">${v.catalogo}</td>
                </tr>
                <tr>
                <td class="text-left" style="min-width: 70%;font-size: 112.1%;">${v.codigo_interno}</td>
                <td class="text-left" style="min-width: 70%;font-size: 112.1%;">${v.cantidad}</td>
                <td class="text-left" style="min-width: 70%;font-size: 112.1%;">${v.u_medida}</td>
                               
                <td class="text-left" style="width: 59%;font-size: 112.1%;text-align: center !important;">${v.precio_unitario}</td>
                
                <td class="text-left" style="font-size: 112.1%; text-align: right !important;">${Tools.formatNumber(v.total)}</td>
            
         

            </tr>`;



        });
        return h;
    }

    setTicket(dataDoc, autoPrint) {
        let fechas =moment().format('DD/MM/YYYY');
        let horas =moment().format('h:mm:ss a');
        let company = dataDoc.company;
        let head = dataDoc.head;
        APP_ETIQUET._022 = 'OP. GRAVADA';
        APP_ETIQUET._023 = 'IGV 18%';
        APP_ETIQUET._017 ='IMPORTE TOTAL';

        APP_ETIQUET._146='TOTAL';        
        APP_ETIQUET._021='OP. INAFECTA'; 
        APP_ETIQUET._020='OP. EXONERADA'; 
        var label_tipo_comprobante='', pago='';   //************


        console.log(head);


        switch(head.id_tipo_comprobante){ 

            case '1':
            label_tipo_comprobante='Factura';
            break;
            case '2':
            label_tipo_comprobante='Boleta';
            break;
            case '8':
            label_tipo_comprobante='Nota de venta';
            break;
        }

        switch(head.pagado){
            case '1':
            pago='PAGADO';
            break;
            default:
            pago='CREDITO';
        }
        

        let h = `

        <div class="area_print" style="font-size:10px;" >
            
            <div class="text-center"><b>${APP_ETIQUET.razon_social.toUpperCase()}:</b></div> 
            <div class="text-center">${company.razon_social}</div>
            <div class="text-center"><b>${APP_ETIQUET._037.toUpperCase()}:</b> ${company.ruc}</div>
            <div class="text-center"><b>${APP_ETIQUET.direccion.toUpperCase()}:</b></div>                                                                                                        
            <div class="text-center">${company.direccion}</div>
            <div class="text-center"><b>TELÉFONOS:</b></div> 
            <div class="text-center">${company.telefono}</div><br>
            
            <div class="text-center"><b>${head.name_tipo_comprobante} ${APP_ETIQUET._151}: ${head.serie}-${head.numero_documento}</b></div>
            =========================================
            <div><b>FECHA:</b> ${head.fecha_emision} ${horas}</div>
            <div><b>${head.caja}:</b> ${head.vendedor}</div>
            ========================================
            <div><b>DATOS DEL CLIENTE:</b> </div>
            <div><b>${APP_ETIQUET.cliente.toUpperCase()}:</b> ${head.razon_social}</div>
            <div><b>${head.tipo_doc_identidad}:</b> ${head.documento_identidad}</div> 
            <div><b>OBS.:</b> ${head.observaciones}</div>    
            =========================================
            <div><b>${APP_ETIQUET._079.toUpperCase()}:</b> ${head.forma_pago}</div>    
            <div><b>ESTADO:</b> ${pago}</div>    
            =========================================
           
          <div style="line-height:0;"></div>
        
            <table style="table-layout: fixed;">

                <thead >
                    <tr >
                        <th style="font-size: 11.2px;text-align: left! important;" colspan="4">${APP_ETIQUET._154.toUpperCase()}</th>
                    </tr>
                    <tr>
                        <th style="font-size: 11.2px;text-align: left! important;width: 70%;">${APP_ETIQUET.codigo_interno.toUpperCase()}</th>
                        <th style="font-size: 11.2px;text-align: left! important;width: 70%;">${APP_ETIQUET._153.toUpperCase()}</th>  
                        <th style="font-size: 11.2px;text-align: left! important;width: 70%;">${APP_ETIQUET._095.toUpperCase()}</th>    
                        <th style="font-size: 11.2px;text-align: center !important;white-space: nowrap">${APP_ETIQUET._015.toUpperCase()}</th>    
                        <th style="width: 85px; font-size: 11.2px;text-align: right !important;">${APP_ETIQUET._146.toUpperCase()}</th> 
                    </tr> 

                </thead> 
                <tr >
                        <th style="font-weight:normal; line-height:0.3; text-align:left! important" colspan="4">==================================</th>
                    </tr>



                <tbody style="font-size: 8px;">${this.getProductos(dataDoc.detail)}</tbody> 



               <tfoot style="font-size: 10px;">`; 
        if (head.tipo_comprobante == '01' || head.tipo_comprobante =='03' || head.tipo_comprobante == null ) {
            h += `
                    
                     <tr >
                        
                    </tr> 




                
                    <tr>
                        
                        
                    </tr>`;
        }
        h += `
                    <tr>
                        <td colspan="4" class="text-right"><b>${APP_ETIQUET._017}</b></td> 
                        <td class="text-right"><b style="white-space: nowrap;">${head.simbolo} ${Tools.formatNumber(head.total_venta)}</b></td>
                    </tr> 
                                                                                                              
                </tfoot>                                                                                               
            </table>
            
            =========================================
<b class="text-center" style="font-weight: bold;">${APP_ETIQUET._152.toUpperCase()}: ${head.total_letra}</b>
           <div style="line-height:0.6;"> =========================================</div> 

            <div >  
                <b style=>${APP_ETIQUET._213.toUpperCase()}: ${head.simbolo} ${(/null/g.test(head.recibido)) ? '0.00' : head.recibido}</b>
            </div>      
            <div>  
                <b style=>${APP_ETIQUET._214.toUpperCase()}: ${head.simbolo} ${(/null/g.test(head.vuelto)) ? '0.00' : head.vuelto}</b>
            </div >                                                                                                        
            <div style="line-height:0.6;">=========================================</div>                                                                                                   
            <div class="text-center">
                Representación impresa de la ${label_tipo_comprobante} Electrónica. 
            </div>
                <hr>
            <div class="text-center">
                
            <img style="width:40%" src="${dataDoc.qr}" />
            </div>`;

        if (!/null/.test(head.hash_cpe)) {
            h += `
            <div>
                <b>${APP_ETIQUET._155.toUpperCase()}: ${head.hash_cpe}</b>
            </div>`;
        }
        h += `
            <hr>
              <div class="text-center">
                ${company.pie_ticket}
            </div>
                
        </div>`;
        $(`#${this._alias}d_ticket`).attr('style', `width: ${company.width_ticket}mm`);
        $(`#${this._alias}d_ticket`).html(h);
        if (autoPrint) {
            this.printTicket(null, null);
        }
    }

    getAxions() {
        let ax = [{
                button: APP_BTN.ESNT,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.sendDocSunaht",
                    serverParams: ["id_venta", "enviado_sunat", "numero_documento"]
                }
            }, {
                button: APP_BTN.TIK,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.getTICKET",
                    serverParams: ["id_venta", "enviado_sunat"]
                }
            }, {
                button: APP_BTN.PDF,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.getPDF",
                    serverParams: ["id_venta", "enviado_sunat"]
                }
            },{
                button: APP_BTN.XML,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.getXML",
                    serverParams: ["id_venta", "enviado_sunat"]
                }
            },{
                button: APP_BTN.CDR,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.getCDR",
                    serverParams: ["id_venta", "enviado_sunat"]
                }
            }, {
                button: APP_BTN.ENCL,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.sendCliente",
                    serverParams: ["id_venta", "enviado_sunat"]
                }
            }, {
                button: APP_BTN.GRM,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.formGuia",
                    serverParams: ["id_venta", "numero_documento"]
                }
            }, {
                button: APP_BTN.ANC,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.formAnular",
                    serverParams: ["id_venta", "enviado_sunat", "anulado", "numero_documento", "dias_transcurridos", "dias_habiles", "id_tipo_comprobante", "id_serie", "num_doc", "tiene_pago"]
                }
            },{
                button: APP_BTN.DEL,
                ajax: {
                    fn: "Obj.Facturacion.VentaAx.postDeleteVenta",
                    serverParams: ["id_venta", "enviado_sunat", "liquidado"]
                }
            }];
        if (store.get('FORMATO_VENTA') == 'PDF') {
            ax = [{
                    button: APP_BTN.ESNT,
                    ajax: {
                        fn: "Obj.Facturacion.VentaAx.sendDocSunaht",
                        serverParams: ["id_venta", "enviado_sunat", "numero_documento"]
                    }
                }, {
                    button: APP_BTN.PDF,
                    ajax: {
                        fn: "Obj.Facturacion.VentaAx.getPDF",
                        serverParams: ["id_venta", "enviado_sunat"]
                    }
                }, {
                    button: APP_BTN.XML,
                    ajax: {
                        fn: "Obj.Facturacion.VentaAx.getXML",
                        serverParams: ["id_venta", "enviado_sunat"]
                    }
                }, {
                    button: APP_BTN.CDR,
                    ajax: {
                        fn: "Obj.Facturacion.VentaAx.getCDR",
                        serverParams: ["id_venta", "enviado_sunat"]
                    }
                }, {
                    button: APP_BTN.ENCL,
                    ajax: {
                        fn: "Obj.Facturacion.VentaAx.sendCliente",
                        serverParams: ["id_venta", "enviado_sunat"]
                    }
                }, {
                    button: APP_BTN.GRM,
                    ajax: {
                        fn: "Obj.Facturacion.VentaAx.formGuia",
                        serverParams: ["id_venta", "numero_documento"]
                    }
                }, {
                    button: APP_BTN.ANC,
                    ajax: {
                        fn: "Obj.Facturacion.VentaAx.formAnular",
                        serverParams: ["id_venta", "enviado_sunat", "anulado", "numero_documento", "dias_transcurridos", "dias_habiles", "id_tipo_comprobante", "id_serie", "num_doc", "tiene_pago"]
                    }
                }, {
                    button: APP_BTN.DEL,
                    ajax: {
                        fn: "Obj.Facturacion.VentaAx.postDeleteVenta",
                        serverParams: ["id_venta", "enviado_sunat", "liquidado"]
                    }
                }];
        }
        return ax;
    }

    setDataGuia(form, data) {
        let head = data.head;
        Tools.setDataForm(form, {
            alias: this._alias,
            elements: [
                {item: 'txt_ruc', value: head.documento_identidad},
                {item: 'txt_razon_social', value: head.razon_social},
                {item: 'lb_tipodoc', type: 'html', value: head.tipo_doc_identidad},
                {item: 'txt_llegada', value: head.direccion_fiscal},
                {item: 'txt_partida', value: data.company.direccion}
            ]
        });
        this._setDetailGuia(data);
    }

    setDataEditGuia(form, data) {
        let head = data.head;
        Tools.setDataForm(form, {
            alias: this._alias,
            elements: [
                {item: 'txt_ruc', value: head.documento_identidad_destinatario},
                {item: 'txt_razon_social', value: head.razon_social_destinatario},
                {item: 'lb_tipodoc', type: 'html', value: head.tipo_doc_identidad_destinatario},
                {item: 'txt_llegada', value: head.punto_llegada},
                {item: 'txt_partida', value: head.punto_partida},
                {item: 'txt_serie_g', value: head.serie},
                {item: 'txt_num_doc_g', value: head.numero_documento},
                {item: 'txt_fecha_traslado', value: head.fecha_guia},
                {item: 'txt_nbulto', value: head.num_bultos},
                {item: 'lst_modalidad_transporte', type: 'select', value: head.modalidad_transporte},
                {item: 'txt_gobservaciones', value: head.observaciones}
            ]
        });
        this._setDetailGuia(data);
        this.getListBoxsEditGuia(form, data);
        this._enviadoGuiaSunat = head.enviado_sunat;
        if (this._enviadoGuiaSunat == 1) {
            $(`#${this._alias}d_send_sunat`).removeAttr('class').addClass('col-12');
            $(`#${this._alias}d_send_sunat`).html(`<div class="alert alert-info"><i class="fa fa-info"></i> ${APP_ETIQUET._191}</div>`);
        }
    }

    getListBoxsEditGuia(form, data) {
        $(form).appList({
            items: [
                {
                    data: 'transportista',
                    container: `#${this._alias}d_transportista`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_transportista`,
                        name: `${this._alias}lst_transportista`,
                        class: 'form-control'
                    },
                    default: data.head.id_transportista
                },
                {
                    data: 'conductor',
                    container: `#${this._alias}d_conductor`,
                    params: data.head.id_transportista,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_conductor`,
                        name: `${this._alias}lst_conductor`,
                        class: 'form-control'
                    },
                    default: data.head.id_transportista_vehiculo
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_transportista`).change((e) => {
                    this.getConductor(e.currentTarget.value);
                });
            }
        });
    }

    getListBoxsGuia() {
        $(this._idFormGuia).appList({
            items: [
                {
                    data: 'transportista',
                    container: `#${this._alias}d_transportista`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_transportista`,
                        name: `${this._alias}lst_transportista`,
                        class: 'form-control'
                    },
                    default: null
                },
                {
                    data: 'serie_g',
                    container: `#${this._alias}d_serie_g`,
                    params: store.get('ID_PERSONA'),
                    required: true,
                    attr: {
                        id: `${this._alias}lst_serie_g`,
                        name: `${this._alias}lst_serie_g`,
                        class: 'form-control'
                    },
                    default: null
                }
            ],
            callback: () => {
                $(`#${this._alias}lst_transportista`).change((e) => {
                    this.getConductor(e.currentTarget.value);
                });

                $(`#${this._alias}lst_serie_g`).change((e) => {
                    this._getNumGuia(_tk_, e.currentTarget.value);
                });
            }
        });
    }

    getConductor(t) {
        $(this._idFormGuia).appList({
            items: [
                {
                    data: 'conductor',
                    container: `#${this._alias}d_conductor`,
                    params: t,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_conductor`,
                        name: `${this._alias}lst_conductor`,
                        class: 'form-control'
                    },
                    default: null
                }
            ]
        });
    }

};