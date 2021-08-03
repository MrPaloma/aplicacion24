/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Super 
* Fecha:        10-09-2018 17:09:53 
* Descripcion : NotaVentaRsc.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.NotaVentaRsc = class NotaVentaRsc extends Resource {
    
    constructor() {
        
        super();
        this._fila = 0;
        this._lastValues = [];
        
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
        
    }
    
    
    addButtons() {
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
            container: `#${this._alias}btn_add`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ITADD, type: 'button', evts: [{click: 'Obj.Facturacion.NotaVentaAx.addItem'}]}]
        });
    }
    
    
    
    getListBoxs(form,data) {
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
                    default: data[0].pagado
                }
            ],
            callback: () => {
                this.getSerieCliente(form, '8',data);
                $(`#${this._alias}lst_tipo_doc`).change((e) => {
                    this.getSerieCliente(form, e.currentTarget.value,data);
                });

                for (let i = 0; i< data.length; i++) {
                    this.addItem();
                }
                
                this.addProducto();
                this.setVenta(data);
            }
            
        });
        
    }

    getListBoxsNV(form,data) {
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
                    default: data[0].id_forma_pago
                }
            ],
            callback: () => {
                this.getSerieCliente(form, '8',data);
                $(`#${this._alias}lst_tipo_doc`).change((e) => {
                    this.getSerieCliente(form, e.currentTarget.value,data);
                });

                for (let i = 0; i< data.length; i++) {
                    this.addItem();
                }
                
                this.addProducto();
                this.setVentaNV(data);
            }
            
        });
        
    }
    
    //Devolucion Update
    getListBoxsD(form,data) {
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
                    default: data[0].id_forma_pago
                }
            ],
            callback: () => {
                this.getSerieCliente(form, '8',data);
                $(`#${this._alias}lst_tipo_doc`).change((e) => {
                    this.getSerieCliente(form, e.currentTarget.value,data);
                });

                for (let i = 0; i< data.length; i++) {
                    this.addProductoD();
                }
                
                this.setVentaD(data);
            }
            
        });
        
    }
    
    //Anular Update
    getListBoxsA(form,data) {
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
                    default: data[0].id_forma_pago
                }
            ],
            callback: () => {
                this.getSerieCliente(form, '8',data);
                $(`#${this._alias}lst_tipo_doc`).change((e) => {
                    this.getSerieCliente(form, e.currentTarget.value,data);
                });

                for (let i = 0; i< data.length; i++) {
                    this.addProducto();
                }
                
                this.setVentaA(data);
            }
            
        });
        
    }
    
    getSerieCliente(form, td,data) {
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
                    default: data[0].id_entidad
                }
            ],
            callback: () => {
                if (data[0].id_entidad != 8) {

                    this.getDirecciones(form, data[0].id_entidad);
                    $(`#${this._alias}lst_cliente`).change((e) => {
                        this.getDirecciones(form, e.currentTarget.value);
                    });
                    //this._getNumeroDocActual('17', 'txt_num_doc');
                    $(`#${this._alias}lst_serie`).change((e) => {
                        this._getNumeroDocActual(e.currentTarget.value, 'txt_num_doc');
                    });
                }
                else{
                    //this._getNumeroDocActual('17', 'txt_num_doc');
                    $(`#${this._alias}lst_serie`).change((e) => {
                        this._getNumeroDocActual(e.currentTarget.value, 'txt_num_doc');
                    });
                    $(`#${this._alias}lst_cliente`).change((e) => {
                        this.getDirecciones(form, e.currentTarget.value);
                    });
                }
                
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
            <td>
                <input id="${this._alias}hhbbproducto${this._fila}" name="${this._alias}hhbbproducto[]" type="hidden" value="${idProducto}">
                <section style="margin-bottom: 0px; width:165px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_producto${this._fila}" name="${this._alias}txt_producto[]" type="text" class="input-xs" value="${producto}" placeholder="${APP_ETIQUET.search_sensitive}">
                    </label>
                </section>
            </td>
            <td class="text-center _um">${um}</td>
            <td>
                <section  style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_cantidad${this._fila}" name="${this._alias}txt_cantidad[]" type="text" class="input-xs _calcula" value="${cantidad}" autocomplete="off">
                    </label>
                </section>
            </td>
             <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_stock${this._fila}" name="${this._alias}txt_stock[]" type="text" class="input-xs" readonly=readonly value="${stock}">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px; width:170px;" id="${this._alias}lst_tipo_afecta${this._fila}"><label class="select">${tigv}</label></section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_precio${this._fila}" name="${this._alias}txt_precio[]" type="text" class="input-xs _calcula valid" value="${precio}" autocomplete="off">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_subtotal${this._fila}" name="${this._alias}txt_subtotal[]" type="text" class="input-xs lv-disabled" readonly="true" value="${stotal}">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_total_unitario${this._fila}" name="${this._alias}txt_total_unitario[]" type="text" class="input-xs lv-disabled" readonly="true" value="${total}">
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
                                "<div class='col-xs-1'>" + item.precio_compra + "</div>" + 
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
        console.log(this._fila);
    }
    
    //Devolucion Update
    addProductoD(data = false) {

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
            <td>
                <input id="${this._alias}hhbbproducto${this._fila}" name="${this._alias}hhbbproducto[]" type="hidden" value="${idProducto}">
                <section style="margin-bottom: 0px; width:165px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_producto${this._fila}" name="${this._alias}txt_producto[]" type="text" class="input-xs" value="${producto}" placeholder="${APP_ETIQUET.search_sensitive}">
                    </label>
                </section>
            </td>
            <td class="text-center _um">${um}</td>
            <td>
                <section  style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_cantidad${this._fila}" name="${this._alias}txt_cantidad[]" type="text" class="input-xs _calcula" value="${cantidad}" autocomplete="off">
                    </label>
                </section>
            </td>
             <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_stock${this._fila}" name="${this._alias}txt_stock[]" type="text" class="input-xs" readonly=readonly value="${stock}">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px; width:170px;" id="${this._alias}lst_tipo_afecta${this._fila}"><label class="select">${tigv}</label></section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_precio${this._fila}" name="${this._alias}txt_precio[]" type="text" class="input-xs _calcula valid" value="${precio}" autocomplete="off">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_subtotal${this._fila}" name="${this._alias}txt_subtotal[]" type="text" class="input-xs lv-disabled" readonly="true" value="${stotal}">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input style="font-size:15px; height:35px" id="${this._alias}txt_total_unitario${this._fila}" name="${this._alias}txt_total_unitario[]" type="text" class="input-xs lv-disabled" readonly="true" value="${total}">
                    </label>                                                                                                    
                </section>                
            </td>

            <td class="text-center" style="vertical-align: middle;">
                <div class="btn-group">
                    <button class="btn btn-default btn-xs dropdown-toggle dropleft" data-toggle="dropdown" title="Acciones" aria-expanded="true">
                        <i class="fa fa-gear fa-lg"></i> 
                        <span class="caret">
                        </span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li>
                            <a type="button" id="${this._alias}btn_devolucion${this._fila}" data-toggle="modal" data-target="#${this._alias}myModal${this._fila}">
                                <i class="fa fa-plus"></i> 
                                <label id="cursorDevolucion">Devolución</label>
                            </a>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>`;

        // a este modal le falta los tr-language
        let modal =`<div class="modal" id="${this._alias}myModal${this._fila}" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Devolución</h5>
            </div>
            <div class="modal-body">
                <div class="form-group" >
                    <label class="col-lg-3 control-label tr-language" data-tr="">Cantidad de productos</label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="${this._alias}txt_cantidad_productos${this._fila}" name="${this._alias}txt_cantidad_productos[]" readonly="true"/> 
                    </div>
                </div>
                <div class="form-group" >
                    <label class="col-lg-3 control-label tr-language" data-tr="">Cantidad a devolver</label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="${this._alias}txt_cantidad_devolver${this._fila}" name="${this._alias}txt_cantidad_devolver[]"/> 
                    </div>
                </div>
                <div class="form-group" >
                    <label class="col-lg-3 control-label tr-language" data-tr="">Observaciones</label>
                    <div class="col-lg-5">
                        <textarea type="text" class="form-control" id="${this._alias}txt_observacion${this._fila}" name="${this._alias}txt_observacion[]"></textarea> 
                    </div>
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="CierraPopup(${this._alias}myModal${this._fila})">Cerrar</button>
            </div>
          </div>
        </div>
      </div>`;


        $('#cursorDevolucion').css('cursor', 'pointer');
        $(`#${this._alias}modales`).append(modal);  

        $(`#${this._alias}tb_detail`).append(tr);
        $(`#${this._alias}tr_${this._fila}`).find('select').chosen();
        $(`#${this._alias}tr_${this._fila}`).find('.chosen-container').css({width: '100%'});

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
                                "<div class='col-xs-1'>" + item.precio_compra + "</div>" + 
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

                let pv_min = parseFloat(Math.min(parseFloat(ui.item.precio_publico), parseFloat(ui.item.precio_ferreteria), parseFloat(ui.item.precio_distribuidor))), pv_max = parseFloat(Math.max(parseFloat(ui.item.precio_publico), parseFloat(ui.item.precio_ferreteria), parseFloat(ui.item.precio_distribuidor)))
                
                $(`#${this._alias}txt_precio${ui.item.fila}`).attr('type', 'number')
                $(`#${this._alias}txt_precio${ui.item.fila}`).attr('max', pv_max)
                $(`#${this._alias}txt_precio${ui.item.fila}`).attr('min', pv_min)

                let pre = $(`#${this._alias}txt_precio${ui.item.fila}`)
        
                $(`#${this._alias}txt_precio${ui.item.fila}`).keypress( function(e) {

                    if ( e.keyCode === 13 && parseFloat(pre.val()) >= pv_min && parseFloat(pre.val()) <= pv_max) {
                        
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
        console.log(this._fila);
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
        
        Tools.setDataForm(this._idFormNotaVenta, {
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
    
    addButtonsFormUpdate() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.UPD, type: 'submit'}]
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

    setIGV(data,i){
        $(this._formEdit).appList({
            items: [
                {
                    container: `#${this._alias}lst_tipo_afecta`+i,
                    required: true,
                    optionSelec: false,
                    attr: {
                        id: `${this._alias}lst_tipo_igv`+i,
                        name: `${this._alias}lst_tipo_igv[]`,
                        class: 'form-control _calcula_lst'
                    },
                    default: data[i].id_tipo_igv
                },
            ],   
        });
    }

    setVenta(data) {
        let b = 0;        
        for (let i = 0; i < data.length; i++) {

            $(`#${this._alias}tr_${i+1}`).find('._calcula_lst').val(data[i].id_tipo_igv);
            
            $(`#${this._alias}tr_${i+1}`).find('._calcula_lst option[value='+ data[i].id_tipo_igv +']').attr("selected",true);
            

            
            b = $(`#${this._alias}tr_${i+1}`).find('._calcula_lst').val();
            console.log(b);
            
            Tools.setDataForm(this._formEdit, {
                alias: this._alias,
                elements: [
                    //Datos info
                    {item: 'txt_num_doc', value: data[i].numero_documento},
                    {item: 'lst_cliente', value: data[i].id_entidad, default: data[i].id_entidad},
                    {item: 'txt_fecha_vencimiento', value: data[i].fecha_emision, default: data[i].fecha_emision},
                    {item: 'lst_tipo_moneda', value: data[i].id_tipo_moneda, default: data[i].id_tipo_moneda},
                    {item: 'lst_forma_pago', value: data[i].id_forma_pago, default: data[i].id_forma_pago},
                    {item: 'rd_pagado', value: data[i].pagado},

                    //Datos productos

                    
                    {item: 'hhbbproducto'+(i+1), value: data[i].id_local_producto},
                    {item: 'txt_producto'+(i+1), value: data[i].catalogo},
                    {item: 'txt_cantidad'+(i+1), value: data[i].cantidad},

                    //{item: 'lst_tipo_afecta'+(i+1), value: data[i].id_tipo_igv, default: data[i].id_tipo_igv},
                    {item: 'txt_precio'+(i+1), value: data[i].precio_unitario},
                    {item: 'txt_subtotal'+(i+1), value: data[i].sub_total},
                    {item: 'txt_total_unitario'+(i+1), value: data[i].total},

                    //Datos total
                    {item: 'txt_exonerada', value: data[i].total_exonerada},
                    {item: 'txt_inafecta', value: data[i].total_inafecta},
                    {item: 'txt_gravada', value: data[i].total_gravada},
                    {item: 'txt_igv', value: data[i].total_igv},
                    {item: 'txt_gratuita', value: data[i].total_gratuita},
                    {item: 'txt_total', value: data[i].total_venta},
                    
                ]
            }); 

                     
        }
    }

    setVentaNV(data) {
        let b = 0;        
        for (let i = 0; i < data.length; i++) {

            $(`#${this._alias}tr_${i+1}`).find('._calcula_lst').val(data[i].id_tipo_igv);
            
            $(`#${this._alias}tr_${i+1}`).find('._calcula_lst option[value='+ data[i].id_tipo_igv +']').attr("selected",true);
            

            
            b = $(`#${this._alias}tr_${i+1}`).find('._calcula_lst').val();
            console.log(b);
            
            Tools.setDataForm(this._formEditNV, {
                alias: this._alias,
                elements: [
                    //Datos info
                    {item: 'txt_num_doc', value: data[i].numero_documento},
                    {item: 'lst_cliente', value: data[i].id_entidad, default: data[i].id_entidad},
                    {item: 'txt_fecha_vencimiento', value: data[i].fecha_emision, default: data[i].fecha_emision},
                    {item: 'lst_tipo_moneda', value: data[i].id_tipo_moneda, default: data[i].id_tipo_moneda},
                    {item: 'lst_forma_pago', value: data[i].id_forma_pago, default: data[i].id_forma_pago},
                    {item: 'rd_pagado', value: data[i].pagado},

                    //Datos productos

                    
                    {item: 'hhbbproducto'+(i+1), value: data[i].id_local_producto},
                    {item: 'txt_producto'+(i+1), value: data[i].catalogo},
                    {item: 'txt_cantidad'+(i+1), value: data[i].cantidad},
                    {item: 'txt_stock'+(i+1), value: data[i].stock_actual},

                    //{item: 'lst_tipo_afecta'+(i+1), value: data[i].id_tipo_igv, default: data[i].id_tipo_igv},
                    {item: 'txt_precio'+(i+1), value: data[i].precio_unitario},
                    {item: 'txt_subtotal'+(i+1), value: data[i].sub_total},
                    {item: 'txt_total_unitario'+(i+1), value: data[i].total},

                    //Datos total
                    {item: 'txt_exonerada', value: data[i].total_exonerada},
                    {item: 'txt_inafecta', value: data[i].total_inafecta},
                    {item: 'txt_gravada', value: data[i].total_gravada},
                    {item: 'txt_igv', value: data[i].total_igv},
                    {item: 'txt_gratuita', value: data[i].total_gratuita},
                    {item: 'txt_total', value: data[i].total_venta},
                    
                ]
            }); 

                     
        }

    }
    
    //Devolucion Update
    setVentaD(data) {
        let b = 0;        
        for (let i = 0; i < data.length; i++) {

            $(`#${this._alias}tr_${i+1}`).find('._calcula_lst').val(data[i].id_tipo_igv);
            
            $(`#${this._alias}tr_${i+1}`).find('._calcula_lst option[value='+ data[i].id_tipo_igv +']').attr("selected",true);
            

            
            b = $(`#${this._alias}tr_${i+1}`).find('._calcula_lst').val();
            console.log(b);
            
            Tools.setDataForm(this._formDevolucion, {
                alias: this._alias,
                elements: [
                    //Datos info
                    {item: 'txt_num_doc', value: data[i].numero_documento},
                    {item: 'lst_cliente', value: data[i].id_entidad, default: data[i].id_entidad},
                    {item: 'txt_fecha_vencimiento', value: data[i].fecha_emision, default: data[i].fecha_emision},
                    {item: 'lst_tipo_moneda', value: data[i].id_tipo_moneda, default: data[i].id_tipo_moneda},
                    {item: 'lst_forma_pago', value: data[i].id_forma_pago, default: data[i].id_forma_pago},
                    {item: 'rd_pagado', value: data[i].pagado},

                    //Datos productos
                    {item: 'txt_cantidad_productos'+(i+1), value: data[i].cantidad},
                    
                    
                    {item: 'hhbbproducto'+(i+1), value: data[i].id_local_producto},
                    {item: 'txt_producto'+(i+1), value: data[i].catalogo},
                    {item: 'txt_cantidad'+(i+1), value: data[i].cantidad},
                    {item: 'txt_stock'+(i+1), value: data[i].stock_actual},

                    //{item: 'lst_tipo_afecta'+(i+1), value: data[i].id_tipo_igv, default: data[i].id_tipo_igv},
                    {item: 'txt_precio'+(i+1), value: data[i].precio_unitario},
                    {item: 'txt_subtotal'+(i+1), value: data[i].sub_total},
                    {item: 'txt_total_unitario'+(i+1), value: data[i].total},

                    //Datos total
                    {item: 'txt_exonerada', value: data[i].total_exonerada},
                    {item: 'txt_inafecta', value: data[i].total_inafecta},
                    {item: 'txt_gravada', value: data[i].total_gravada},
                    {item: 'txt_igv', value: data[i].total_igv},
                    {item: 'txt_gratuita', value: data[i].total_gratuita},
                    {item: 'txt_total', value: data[i].total_venta},
                    
                ]
            }); 

                     
        }

    }
    
    //Anular Update
    setVentaA(data) {
        let b = 0;        
        for (let i = 0; i < data.length; i++) {

            $(`#${this._alias}tr_${i+1}`).find('._calcula_lst').val(data[i].id_tipo_igv);
            
            $(`#${this._alias}tr_${i+1}`).find('._calcula_lst option[value='+ data[i].id_tipo_igv +']').attr("selected",true);
            

            
            b = $(`#${this._alias}tr_${i+1}`).find('._calcula_lst').val();
            console.log(b);
            console.log(data[i].catalogo);
            
            
            
            Tools.setDataForm(this._formAnular, {
                alias: this._alias,
                elements: [
                    //Datos info
                    {item: 'txt_num_doc', value: data[i].numero_documento},
                    {item: 'lst_cliente', value: data[i].id_entidad, default: data[i].id_entidad},
                    {item: 'txt_fecha_vencimiento', value: data[i].fecha_emision, default: data[i].fecha_emision},
                    {item: 'lst_tipo_moneda', value: data[i].id_tipo_moneda, default: data[i].id_tipo_moneda},
                    {item: 'lst_forma_pago', value: data[i].id_forma_pago, default: data[i].id_forma_pago},
                    {item: 'rd_pagado', value: data[i].pagado},

                    //Datos productos
                    {item: 'txt_cantidad_productos'+(i+1), value: data[i].cantidad},
                    
                    
                    {item: 'hhbbproducto'+(i+1), value: data[i].id_local_producto},
                    {item: 'txt_producto'+(i+1), value: data[i].catalogo},
                    {item: 'txt_cantidad'+(i+1), value: data[i].cantidad},
                    {item: 'txt_stock'+(i+1), value: data[i].stock_actual},

                    //{item: 'lst_tipo_afecta'+(i+1), value: data[i].id_tipo_igv, default: data[i].id_tipo_igv},
                    {item: 'txt_precio'+(i+1), value: data[i].precio_unitario},
                    {item: 'txt_subtotal'+(i+1), value: data[i].sub_total},
                    {item: 'txt_total_unitario'+(i+1), value: data[i].total},

                    //Datos total
                    {item: 'txt_exonerada', value: data[i].total_exonerada},
                    {item: 'txt_inafecta', value: data[i].total_inafecta},
                    {item: 'txt_gravada', value: data[i].total_gravada},
                    {item: 'txt_igv', value: data[i].total_igv},
                    {item: 'txt_gratuita', value: data[i].total_gratuita},
                    {item: 'txt_total', value: data[i].total_venta},
                    
                ]
            }); 

                     
        }

    }
    
    //Ticket Update
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
    
    addButtonPrintTk() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_print_tk`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.NotaVentaAx.printTicket'}]}]
        });
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
};