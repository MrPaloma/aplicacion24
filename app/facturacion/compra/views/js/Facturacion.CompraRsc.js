/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 20:09:46 
 * Descripcion : CompraRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.CompraRsc = class CompraRsc extends Resource {

    constructor() {
        super();
        this._fila = 0;
        
        this._eevtTypeChange = () => {
            let el;
            $(`#${this._alias}etxt_tipo_cambio`).keyup((e) => {
                el = $(e.currentTarget);
                if (!$.isNumeric(el.val())) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._055
                    });
                    el.val('');
                    return false;
                }
            });
        };

        this._evtTypeChange = () => {
            let el;
            $(`#${this._alias}etxt_tipo_cambio`).keyup((e) => {
                el = $(e.currentTarget);
                if (!$.isNumeric(el.val())) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._055
                    });
                    el.val('');
                    return false;
                }
            });
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
            });
            
            $(`#${this._alias}formNewCompra`).mouseover(()=>{
                this._calculaTotales();
            });
            
        };

        this._eevts = () => { 
            $(`#${this._alias}elst_tipo_moneda`).change((e) => {
                if ([2, 3].includes(parseInt($(e.currentTarget).val()))) {
                    $(`#${this._alias}etxt_tipo_cambio`).removeAttr('disabled');
                    $(`#${this._alias}etxt_tipo_cambio`).removeClass('lv-disabled');
                } else {
                    $(`#${this._alias}etxt_tipo_cambio`).val('');
                    $(`#${this._alias}etxt_tipo_cambio`).addClass('lv-disabled');
                    $(`#${this._alias}etxt_tipo_cambio`).attr('disabled', true);
                }
            });
            
            $(`#${this._alias}formNewCompra`).mouseover(()=>{
                this._calculaTotales();
            });
            
        };
        
        this._changeMoney = () => {
            let tm = $(`#${this._alias}lst_tipo_moneda`).val();
            let tc = $(`#${this._alias}txt_tipo_cambio`).val();
            let punitario, nwp, preal,iprecio;
            tc = (tc.length == 0) ? 0 : tc;


            $(`#${this._alias}tb_detail`).find('tr').each(function () {
                iprecio = $(this).find('td:eq(4)').find('input:text');
                preal = iprecio.data('precio');
                punitario = iprecio.data('precio');
                
                if ([2, 3].includes(parseInt(tm)) && tc > 0) {
                    nwp = parseFloat(punitario) * parseFloat(tc);
                } else {
                    nwp = parseFloat(preal);
                }
              
                //si preal tiene valor, quiere decir que el producto ya esta en la bandeja detalle
                if (tc) {
                    iprecio.val(nwp.toFixed(2));
                }
            });
        };

        this._calculaTotales = () => {
            let cant, precio, precioSIGV, st, st1, t, sm, tigv, igv = parseFloat(store.get('IGV')),
                    tGravada = 0, tIGV = 0, tTotal = 0, total_tc = 0,aplicaIGV, tc = 0;

            $(`#${this._alias}tb_detail`).find('tr').each(function () {
                aplicaIGV = parseFloat($(this).find('td').eq(2).find('select').val());
                cant = parseFloat($(this).find('td').eq(3).find('input').val());
                precio = parseFloat($(this).find('td').eq(4).find('input').val());  //precio de item con IGV

                
                precio = (!$.isNumeric(precio)) ? 0 : precio;
                cant = (!$.isNumeric(cant)) ? 0 : cant;
                precioSIGV = precio / (1 + igv); // precio de item sin IGV

                t = cant * precio;

                st = (aplicaIGV == 0) ? cant * precio : cant * precioSIGV;
                tigv = t - st;

                tIGV += tigv;
                tGravada += st;
                tTotal += t;

                $(this).find('td').eq(5).find('input').val(st.toFixed(2));
                $(this).find('td').eq(6).find('input').val(t);
            });

            switch($(`#${this._alias}lst_tipo_moneda`).val()){
                case '1':
                    sm = 'S/.'
                    break;
                case '2':
                    sm = '$'
                    break;
                case '3':
                    sm = '€'
                    break;
            }

            $(`#${this._alias}txt_igv`).val(tIGV.toFixed(2));
            $(`#${this._alias}txt_gravada`).val(tGravada.toFixed(2));
            $(`#${this._alias}txt_total`).val(tTotal.toFixed(2));
        };  

        //funciones para editar compra
        this._calculaTotalese = () => {
            let cant, precio, precioSIGV, st, t, tigv, igv = parseFloat(store.get('IGV')),
                    tGravada = 0, tIGV = 0, tTotal = 0, aplicaIGV, tc = 0, sm;

            $(`#${this._alias}etb_detail`).find('tr').each(function () {
                aplicaIGV = parseFloat($(this).find('td').eq(2).find('select').val());
                cant = parseFloat($(this).find('td').eq(3).find('input').val());
                precio = parseFloat($(this).find('td').eq(4).find('input').val());  //precio de item con IGV

                
                precio = (!$.isNumeric(precio)) ? 0 : precio;
                cant = (!$.isNumeric(cant)) ? 0 : cant;
                precioSIGV = precio / (1 + igv); // precio de item sin IGV

                t = cant * precio;

                st = (aplicaIGV == 0) ? cant * precio : cant * precioSIGV;
                tigv = t - st;

                tIGV += tigv;
                tGravada += st;
                tTotal += t;

                $(this).find('td').eq(5).find('input').val(st.toFixed(2));
                $(this).find('td').eq(6).find('input').val(t);
            });

            switch($(`#${this._alias}lst_tipo_moneda`).val()){
                case '1':
                    sm = 'S/.'
                    break;
                case '2':
                    sm = '$'
                    break;
                case '3':
                    sm = '€'
                    break;
            }

            $(`#${this._alias}etxt_igv`).val(tIGV.toFixed(2));
            $(`#${this._alias}etxt_gravada`).val(tGravada.toFixed(2));
            $(`#${this._alias}etxt_total`).val(tTotal.toFixed(2));
        }; 

    }
    
    

    addButtons() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_add`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ITADD, type: 'button', evts: [{click: 'Obj.Facturacion.CompraAx.addItem'}]}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
        
        $.fn.appButton.get({
            container: `#${this._alias}btn_nw_prov`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.AGPR, type: 'button', evts: [{click: 'Obj.Facturacion.ProveedorAx.formNew'}]}]
        }, (o) => {
            $(`#${PREBTNCTXT}${this._alias}${APP_BTN.AGPR}`).css({
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
                    default: null
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
                    data: 'proveedor_capp',
                    container: `#${this._alias}d_proveedor`,
                    params: store.get('ID_CLIENTE_APP'),
                    required: true,
                    attr: {
                        id: `${this._alias}lst_proveedor`,
                        name: `${this._alias}lst_proveedor`,
                        class: 'form-control _proveedor'
                    },
                    default: null
                },
                {
                    data: 'local',
                    container: `#${this._alias}d_local`,
                    params: store.get('ID_CLIENTE_APP'),
                    required: true,
                    attr: {
                        id: `${this._alias}lst_local`,
                        name: `${this._alias}lst_local`,
                        class: 'form-control'
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
//                $(`#${this._alias}lst_tipo_doc`).change((e) => {
//                    this.getSerie(form, e.currentTarget.value);
//                });

                this._fila = 0;
                this.addProducto();
                
            }
        });
    }

    getSerie(form, td) {
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
                    default: null
                }
            ]
        });
    }

    addProducto() {
        this._fila++;

        let tr = `
        <tr id="${this._alias}tr_${this._fila}">
            <td>
                <input id="${this._alias}hhbbproducto${this._fila}" name="${this._alias}hhbbproducto[]" type="hidden">
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}txt_producto${this._fila}" name="${this._alias}txt_producto[]" type="text" class="input-xs" placeholder="${APP_ETIQUET.search_sensitive}">
                    </label>
                </section>
            </td>
            <td class="text-center _um"></td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="select">
                        <select id="${this._alias}lst_aplica_igv${this._fila}" name="${this._alias}lst_aplica_igv[]"><option value="1">${APP_ETIQUET.e_si}</option><option value="0">${APP_ETIQUET.e_no}</option></select>
                    </label>
                </section>
            </td>                    
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
                        <input id="${this._alias}txt_precio${this._fila}" name="${this._alias}txt_precio[]" type="text" class="input-xs _calcula _precio" autocomplete="off">
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
                        <input id="${this._alias}txt_total_unitario${this._fila}" name="${this._alias}txt_total_unitario[]" type="text" class="input-xs lv-disabled">
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
                            <a type="button" id="${this._alias}btn_md_ganancias${this._fila}" data-toggle="modal" data-target="#${this._alias}myModal${this._fila}">
                                <i class="fa fa-plus"></i> 
                                <label id="cursorGanancia">Ganancias</label>
                            </a>
                        </li>
                    </ul>
                </div>
            </td>
            <td>
                <btn class="btn btn-danger" style="padding-left:3px;padding-right:3px"><i class="fa fa-trash"></i></button>
            </td>
            
            
        </tr>
        `;
        
        // a este modal le falta los tr-language
        let modal = 
        `<div class="modal" id="${this._alias}myModal${this._fila}" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Ganancias en soles de : <span id="${this._alias}producto_nombre_ganancias${this._fila}"><span></h5>
            </div>
            <div class="modal-body">
                <table class="" id="tabla-ganancias">
                    <thead>
                    <tr>
                        <th scope="col">Precio Compra</th>
                        <th scope="col">Precio Publico</th>
                        <th scope="col">Precio Ferreteria</th>
                        <th scope="col">Precio Distribuidor</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <input id="${this._alias}txt_precio_compra${this._fila}" name="${this._alias}txt_precio_compra[]" type="text" class="form-control _precio _calcula" readonly="true" >
                        </td>
                        <td>
                            <input id="${this._alias}txt_pv_pub${this._fila}" name="${this._alias}txt_pv_pub[]" type="text" class="form-control input-xs">
                        </td>
                        <td>
                            <input id="${this._alias}txt_pv_fer${this._fila}" name="${this._alias}txt_pv_fer[]" type="text" class="form-control input-xs">
                        </td>
                        <td>
                            <input id="${this._alias}txt_pv_dis${this._fila}" name="${this._alias}txt_pv_dis[]" type="text" class="form-control input-xs">
                        </td>
                    </tr>
                    <tr>
                        <td style:"font-weight: bold;">% De ganancia</td>
                        <td>
                            <input id="${this._alias}txt_ganancia_pub${this._fila}" name="${this._alias}txt_ganancia_pub[]" type="text" class="form-control">
                        </td>
                        <td>
                            <input id="${this._alias}txt_ganancia_fer${this._fila}" name="${this._alias}txt_ganancia_fer[]" type="text" class="form-control">
                        </td>
                        <td>
                            <input id="${this._alias}txt_ganancia_dis${this._fila}" name="${this._alias}txt_ganancia_dis[]" type="text" class="form-control">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>`

        $('#cursorGanancia').css('cursor', 'pointer')
        $(`#${this._alias}tb_detail`).append(tr);

        // parte de mi codigo donde agrego el modal y la interaccion con el precio de compra
        $(`#${this._alias}modales`).append(modal);

        let btnModalGanancias = $(`#${this._alias}btn_md_ganancias${this._fila}`)
        let pc = $(`#${this._alias}txt_precio${this._fila}`)
        let pcm = $(`#${this._alias}txt_precio_compra${this._fila}`)
        let gpub = $(`#${this._alias}txt_ganancia_pub${this._fila}`)
        let gfer = $(`#${this._alias}txt_ganancia_fer${this._fila}`)
        let gdis = $(`#${this._alias}txt_ganancia_dis${this._fila}`)
        let pvpub = $(`#${this._alias}txt_pv_pub${this._fila}`)
        let pvfer = $(`#${this._alias}txt_pv_fer${this._fila}`)
        let pvdis = $(`#${this._alias}txt_pv_dis${this._fila}`)
        let total = $(`#${this._alias}txt_total_unitario${this._fila}`)
        let cant = $(`#${this._alias}txt_cantidad${this._fila}`)
        let aplicaIGV = $(`#${this._alias}lst_aplica_igv${this._fila}`)
        let st = $(`#${this._alias}txt_subtotal${this._fila}`)
        gpub.val(0)
        gfer.val(0)
        gdis.val(0)

        // CALCULAR LOS PRECIOS PARA EL MODAL GANANCIAS

        btnModalGanancias.click(() => {
            let tc = $(`#COM__txt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }
            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        });

        // CALCULA EL PRECIO, DESDE EL TOTAL

        total.keyup(function() {
            let tc = $(`#COM__txt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }

            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        });

        pc.keyup(function() {
            let tc = $(`#COM__txt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }

            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        });

        cant.keyup(function() {
            let tc = $(`#COM__txt_tipo_cambio`).val();
        
            if (tc == "") {
                tc = 1
            }
            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        });

        $('#COM__d_tipo_moneda').change(function(){

            let tc = $(`#COM__txt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }

            console.log($(tc))

            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        })

        // CALCULA EL PRECIO, DESDE EL TOTAL

        total.keyup(function() { 

            let tigv, tIGV, tGravada, tTotal, subtotal

            let igv = parseFloat(store.get('IGV'))

            pc.val(parseFloat(parseFloat(total.val()) / parseFloat(cant.val())))

            let precioSIGV = parseFloat(pc.val()) / (1 + parseFloat(igv));

            if (aplicaIGV.val() == 0) {
                subtotal = parseFloat(cant.val()) * parseFloat(pc.val())
            } else {
                subtotal = parseFloat(cant.val()) * parseFloat(precioSIGV)
            }

            st.val(parseFloat(subtotal).toFixed(2))
            

            
            
        });
        
        // AÑADE UN CAMPO MÁS, AL DAR ENTER EN EL TOTAL

        total.keypress( function(e) {

            if ( e.keyCode === 13) {
                
                e.preventDefault();
                $('#BCTXT_COM__ITADD').click();

            }
            console.log(e.keyCode);
        });


        gpub.keyup(function() {
            let valor = parseFloat(pcm.val()) * ( 1 + parseFloat(gpub.val()) / 100 )
            pvpub.val(parseFloat(valor).toFixed(2));
        })

        gfer.keyup(function() {
            let valor = parseFloat(pcm.val()) * ( 1 + parseFloat(gfer.val()) / 100 )
            pvfer.val(parseFloat(valor).toFixed(2));
        })

        gdis.keyup(function() {
            let valor = parseFloat(pcm.val()) * ( 1 + parseFloat(gdis.val()) / 100 )
            pvdis.val(parseFloat(valor).toFixed(2));
        })

        pvpub.keyup(function() {
            let valor = 100 * ( ( parseFloat(pvpub.val()) / parseFloat(pcm.val()) ) - 1 )
            gpub.val(parseFloat(valor).toFixed(2));
        })

        pvfer.keyup(function() {
            let valor = 100 * ( ( parseFloat(pvfer.val()) / parseFloat(pcm.val()) ) - 1 )
            gfer.val(parseFloat(valor).toFixed(2));
        })

        pvdis.keyup(function() {
            let valor = 100 * ( ( parseFloat(pvdis.val()) / parseFloat(pcm.val()) ) - 1 )
            gdis.val(parseFloat(valor).toFixed(2));
        })



        $(`#${this._alias}tr_${this._fila}`).find('select').chosen();
        $(`#${this._alias}tr_${this._fila}`).find('.chosen-container').css({width: '100%'});
        
        
        
        $.widget("custom.autocomplete", $.ui.autocomplete, {
            
            _resizeMenu: function() {
                this.menu.element.outerWidth( 400 );
            }
            
          });
        let fila = this._fila;
        $(`#${this._alias}txt_producto${this._fila}`).autocomplete({
            source: (request, response) => {
                console.log(request.term.split(" "));
                $.ajax({
                    type: "POST",
                    url: "facturacion/compra/getProducto",
                    dataType: "json",
                    data: {
                        term: request.term.split(" "), _qn: Tools.en(_tk_), _alias: this._alias, f: fila, local: $('#COM__lst_local').val()
                    },
                    success: function (data) {
                        response(data);
                    }
                })
               
            },
            minLength: 2,
            select: (event, ui) => {
                $(`#${this._alias}hhbbproducto${ui.item.fila}`).val(ui.item.id);
                $(`#${this._alias}tr_${ui.item.fila}`).find('._um').html(ui.item.unidad_medida);
                $(`#${this._alias}tr_${ui.item.fila}`).find('td').eq(3).find('input:text').focus();
                
                $(`#${this._alias}producto_nombre_ganancias${this._fila}`).html(ui.item.value);

                $(`#${this._alias}txt_pv_pub${this._fila}`).val(ui.item.precio_publico);
                $(`#${this._alias}txt_pv_dis${this._fila}`).val(ui.item.precio_distribuidor);
                $(`#${this._alias}txt_pv_fer${this._fila}`).val(ui.item.precio_ferreteria);

                $(`#${this._alias}customers2${ui.item.fila}`).remove();
                $.ajax({
                    type: "POST",
                    url: "facturacion/compra/getUltimasCompras",
                    dataType: "json",
                    data: {
                        id_catalogo : ui.item.id, _qn: Tools.en(_tk_), _alias: this._alias, f: ui.item.fila
                    },
                    success: function (compras) {
                        let registros = ''

                        console.log(compras[0]['cantidad'])
                        console.log(typeof(compras[0]['cantidad']))

                        if ( compras[0]['cantidad'] == 0 ) {
                            registros += `<tr  class="d-flex"> 
                                                <td colspan="10">Usted aun no realizo ninguna compra de este producto para este local</td>
                                            </tr>`
                        } else{

                            compras.forEach( function(compra, index) {
                                registros += `<tr  class="d-flex">

                                    <td class="col-2">` + compra.tipo_comprobante + `</td>
                                    <td class="col-2">` + compra.fecha + `</td>
                                    <td class="col-2">` + compra.proveedor + `</td>
                                    <td class="col-1">` + compra.cantidad + `</td>
                                    <td class="col-4">` + compra.value + `</td>
                                    <td class="col-3">` + compra.precio_unitario + `</td>
                                    <td class="col-3">` + compra.sub_total + `</td>
                                    <td class="col-1">` + compra.total + `</td>`

                                console.log(compra.tipo_cambio)

                                if ( compra.tipo_cambio === null ) {
                                    registros += `<td class="col-1">1</td>` +
                                                    `<td class="col-1">` + compra.simbolo + ` ` + compra.total + `</td></tr>`
                                }else {
                                    registros += `<td class="col-1">` + compra.tipo_cambio + `</td>` +
                                                    `<td class="col-1">` + compra.simbolo + ` ` + compra.total / compra.tipo_cambio + `</td></tr>`
                                }
                                
                            });
                        }

                        $(`#${compras[0]['alias']}ultimas_compras${compras[0]['fila']}`).append(registros)
                    }
                });

                $(`#${this._alias}tablas-compras`).append(`<div class="container customers2" id="${this._alias}customers2${this._fila}">

                    <button type="button" id="${this._alias}cerrar_tabla${this._fila}" class="close"><span>×</span><span class="sr-only"></span></button>
                    <table class="table table-sm" id="${this._alias}compra_tabla${this._fila}">
                        <thead>
                        <tr  class="d-flex">
                            <th class="col-2">Comprobante</th>
                            <th class="col-3">Fecha</th>
                            <th class="col-2">Proveedor</th>
                            <th class="col-1">Cantidad</th>
                            <th class="col-4">Producto</th>
                            <th class="col-1">P/U(S/.)</th>
                            <th class="col-1">Precio(S/.)</th>
                            <th class="col-1">Importe(S/.)</th>
                            <th class="col-1">Tipo Cambio</th>
                            <th class="col-1">Importe</th>
                        </tr>
                        </thead>
                        <tbody id="${this._alias}ultimas_compras${this._fila}"> 
                        </tbody>
                    </table>
                    <script>
                        document.getElementById('${this._alias}cerrar_tabla${this._fila}').addEventListener('click', function(){
                        document.getElementById('${this._alias}customers2${this._fila}').remove()});
                        
                        $('#${this._alias}customers2${this._fila}').draggable();
                        
                    </script>
                </div>
                `);

                
            }
        });

        $(`#${this._alias}txt_producto${this._fila}`).focus();
        $(`#${this._alias}tr_${this._fila}`).find('._calcula').keyup((e) => {
            if (!$.isNumeric($(e.currentTarget).val()) && $(e.currentTarget).val().length > 0) {
                $(e.currentTarget).val(0);
            }
            this._calculaTotales();
        });


        $(`#${this._alias}tr_${this._fila}`).find('._precio').keyup((e) => {
            if (!$.isNumeric($(e.currentTarget).val()) && $(e.currentTarget).val().length > 0) {
                $(e.currentTarget).val(0);
            }
            $(e.currentTarget).data('precio',$(e.currentTarget).val());
        });
        
        $(`#${this._alias}tr_${this._fila}`).find('.btn-danger').click((e) => {
            $(e.currentTarget).parent().parent('tr').remove();
            this._calculaTotales();
        });
        $(`#${this._alias}tr_${this._fila}`).find('select').change((e) => {
            this._calculaTotales();
        });

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

    /*--------------------------------------------------------
    -----------nuevas funciones para modal editar-------------
    ----------------------------------------------------------*/

    addProductoe() {
        this._fila++;

        let tr = `
        <tr id="${this._alias}tr_${this._fila}">
            <td>
                <input id="${this._alias}ehhbbproducto${this._fila}" name="${this._alias}ehhbbproducto[]" type="hidden">
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}etxt_producto${this._fila}" name="${this._alias}etxt_producto[]" type="text" class="input-xs" placeholder="${APP_ETIQUET.search_sensitive}">
                    </label>
                </section>
            </td>
            <td class="text-center _um"></td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="select">
                        <select id="${this._alias}elst_aplica_igv${this._fila}" name="${this._alias}elst_aplica_igv[]"><option value="1">${APP_ETIQUET.e_si}</option><option value="0">${APP_ETIQUET.e_no}</option></select>
                    </label>
                </section>
            </td>                    
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}etxt_cantidad${this._fila}" name="${this._alias}etxt_cantidad[]" type="text" class="input-xs _calcula" autocomplete="off">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}etxt_precio${this._fila}" name="${this._alias}etxt_precio[]" type="text" class="input-xs _calcula _precio" autocomplete="off">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}etxt_subtotal${this._fila}" name="${this._alias}etxt_subtotal[]" type="text" class="input-xs lv-disabled" readonly="true">
                    </label>
                </section>
            </td>
            <td>
                <section style="margin-bottom: 0px;">
                    <label class="input">
                        <input id="${this._alias}etxt_total_unitario${this._fila}" name="${this._alias}etxt_total_unitario[]" type="text" class="input-xs lv-disabled">
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
                            <a type="button" id="${this._alias}ebtn_md_ganancias${this._fila}" data-toggle="modal" data-target="#${this._alias}myModal${this._fila}">
                                <i class="fa fa-plus"></i> 
                                <label id="cursorGanancia">Ganancias</label>
                            </a>
                        </li>
                    </ul>
                </div>
            </td>
            <td>
                <btn class="btn btn-danger" style="padding-left:3px;padding-right:3px"><i class="fa fa-trash"></i></button>
            </td>
            
            
        </tr>
        `;
        
        // a este modal le falta los tr-language
        let modal =`<div class="modal" id="${this._alias}myModal${this._fila}" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Ganancias en soles de : <input id="${this._alias}eproducto_nombre_ganancias${this._fila}" type="text" class="form-control" readonly="true"></h5>
            </div>
            <div class="modal-body">
                <table class="" id="tabla-ganancias">
                    <thead>
                    <tr>
                        <th scope="col">Precio Compra</th>
                        <th scope="col">Precio Publico</th>
                        <th scope="col">Precio Ferreteria</th>
                        <th scope="col">Precio Distribuidor</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <input id="${this._alias}etxt_precio_compra${this._fila}" name="${this._alias}etxt_precio_compra[]" type="text" class="form-control _precio _calcula" readonly="true" >
                        </td>
                        <td>
                            <input id="${this._alias}etxt_pv_pub${this._fila}" name="${this._alias}etxt_pv_pub[]" type="text" class="form-control input-xs">
                        </td>
                        <td>
                            <input id="${this._alias}etxt_pv_fer${this._fila}" name="${this._alias}etxt_pv_fer[]" type="text" class="form-control input-xs">
                        </td>
                        <td>
                            <input id="${this._alias}etxt_pv_dis${this._fila}" name="${this._alias}etxt_pv_dis[]" type="text" class="form-control input-xs">
                        </td>
                    </tr>
                    <tr>
                        <td style:"font-weight: bold;">% De ganancia</td>
                        <td>
                            <input id="${this._alias}etxt_ganancia_pub${this._fila}" name="${this._alias}etxt_ganancia_pub[]" type="text" class="form-control">
                        </td>
                        <td>
                            <input id="${this._alias}etxt_ganancia_fer${this._fila}" name="${this._alias}etxt_ganancia_fer[]" type="text" class="form-control">
                        </td>
                        <td>
                            <input id="${this._alias}etxt_ganancia_dis${this._fila}" name="${this._alias}etxt_ganancia_dis[]" type="text" class="form-control">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="CierraPopup(${this._alias}myModal${this._fila})">Cerrar</button>
            </div>
          </div>
        </div>
      </div>`;


        $('#cursorGanancia').css('cursor', 'pointer')
        $(`#${this._alias}etb_detail`).append(tr);

        // parte de mi codigo donde agrego el modal y la interaccion con el precio de compra
        $(`#${this._alias}modales`).append(modal);  

        let myModal = $(`#${this._alias}myModal${this._fila}`);
        let btnModalGanancias = $(`#${this._alias}ebtn_md_ganancias${this._fila}`)
        let pc = $(`#${this._alias}etxt_precio${this._fila}`)
        let pcm = $(`#${this._alias}etxt_precio_compra${this._fila}`)
        let gpub = $(`#${this._alias}etxt_ganancia_pub${this._fila}`)
        let gfer = $(`#${this._alias}etxt_ganancia_fer${this._fila}`)
        let gdis = $(`#${this._alias}etxt_ganancia_dis${this._fila}`)
        let pvpub = $(`#${this._alias}etxt_pv_pub${this._fila}`)
        let pvfer = $(`#${this._alias}etxt_pv_fer${this._fila}`)
        let pvdis = $(`#${this._alias}etxt_pv_dis${this._fila}`)
        let total = $(`#${this._alias}etxt_total_unitario${this._fila}`)
        let cant = $(`#${this._alias}etxt_cantidad${this._fila}`)
        let aplicaIGV = $(`#${this._alias}elst_aplica_igv${this._fila}`)
        let st = $(`#${this._alias}etxt_subtotal${this._fila}`)
        
        gpub.val(0)
        gfer.val(0)
        gdis.val(0)

        // CALCULAR LOS PRECIOS PARA EL MODAL GANANCIAS

        btnModalGanancias.click(() => {
            let tc = $(`#COM__etxt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }
            
            console.log(tc)
            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
            
            console.log(event.pageX)
            
            myModal$.css('top', event.pageX - 100 + "px");
        });

        // CALCULAR LOS PRECIOS PARA DESDE PU

        total.keyup(function() {
            let tc = $(`#COM__etxt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }
            
            console.log(tc)

            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        });

        pc.keyup(function() {
            let tc = $(`#COM__etxt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }
            
            console.log(tc)

            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        });

        cant.keyup(function() {
            let tc = $(`#COM__etxt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }
            
            console.log(tc)
            
            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        });
        
        $('#COM__ed_tipo_moneda').change(function(){

            let tc = $(`#COM__etxt_tipo_cambio`).val();
            
            if (tc == "") {
                tc = 1
            }

            console.log($(tc))

            pcm.val(parseFloat(pc.val() * tc).toFixed(2))
            // pvpub.val(parseFloat((pc.val()) * ( 1 + parseFloat(gpub.val()) / 100 ) * tc).toFixed(2));
            // pvfer.val(parseFloat((pc.val()) * ( 1 + parseFloat(gfer.val()) / 100 ) * tc).toFixed(2));
            // pvdis.val(parseFloat((pc.val()) * ( 1 + parseFloat(gdis.val()) / 100 ) * tc).toFixed(2));
            pc.data('precio',pc.val());
        })

        // CALCULA EL PRECIO, DESDE EL TOTAL

        total.keyup(function() { 

            let tigv, tIGV, tGravada, tTotal, subtotal

            let igv = parseFloat(store.get('IGV'))

            pc.val(parseFloat(parseFloat(total.val()) / parseFloat(cant.val())))

            let precioSIGV = parseFloat(pc.val()) / (1 + parseFloat(igv));

            if (aplicaIGV.val() == 0) {
                subtotal = parseFloat(cant.val()) * parseFloat(pc.val())
            } else {
                subtotal = parseFloat(cant.val()) * parseFloat(precioSIGV)
            }

            st.val(parseFloat(subtotal).toFixed(2))
            

            
            
        });
        
        // AÑADE UN CAMPO MÁS, AL DAR ENTER EN EL TOTAL

        total.keypress( function(e) {

            if ( e.keyCode === 13) {
                
                e.preventDefault();
                $('#BCTXT_COM__ITADD').click();

            }
            console.log(e.keyCode);
        });

        gpub.keyup(function() {
            let valor = parseFloat(pcm.val()) * ( 1 + parseFloat(gpub.val()) / 100 )
            pvpub.val(parseFloat(valor).toFixed(2));
        })

        gfer.keyup(function() {
            let valor = parseFloat(pcm.val()) * ( 1 + parseFloat(gfer.val()) / 100 )
            pvfer.val(parseFloat(valor).toFixed(2));
        })

        gdis.keyup(function() {
            let valor = parseFloat(pcm.val()) * ( 1 + parseFloat(gdis.val()) / 100 )
            pvdis.val(parseFloat(valor).toFixed(2));
        })

        pvpub.keyup(function() {
            let valor = 100 * ( ( parseFloat(pvpub.val()) / parseFloat(pcm.val()) ) - 1 )
            gpub.val(parseFloat(valor).toFixed(2));
        })

        pvfer.keyup(function() {
            let valor = 100 * ( ( parseFloat(pvfer.val()) / parseFloat(pcm.val()) ) - 1 )
            gfer.val(parseFloat(valor).toFixed(2));
        })

        pvdis.keyup(function() {
            let valor = 100 * ( ( parseFloat(pvdis.val()) / parseFloat(pcm.val()) ) - 1 )
            gdis.val(parseFloat(valor).toFixed(2));
        })



        $(`#${this._alias}tr_${this._fila}`).find('select').chosen();
        $(`#${this._alias}tr_${this._fila}`).find('.chosen-container').css({width: '100%'});
        
        
        
        $.widget("custom.autocomplete", $.ui.autocomplete, {
            
            _resizeMenu: function() {
                this.menu.element.outerWidth( 400 );
            }
            
          });
        let fila = this._fila;
        $(`#${this._alias}etxt_producto${this._fila}`).autocomplete({
            source: (request, response) => {
                console.log(request.term.split(" "));
                $.ajax({
                    type: "POST",
                    url: "facturacion/compra/getProducto",
                    dataType: "json",
                    data: {
                        term: request.term.split(" "), _qn: Tools.en(_tk_), _alias: this._alias, f: fila, local: $('#COM__elst_local').val()
                    },
                    success: function (data) {
                        response(data);
                    }
                })
               
            },
            minLength: 2,
            select: (event, ui) => {
                $(`#${this._alias}ehhbbproducto${ui.item.fila}`).val(ui.item.id);
                $(`#${this._alias}tr_${ui.item.fila}`).find('._um').html(ui.item.unidad_medida);
                $(`#${this._alias}tr_${ui.item.fila}`).find('td').eq(3).find('input:text').focus();
                
                $(`#${this._alias}eproducto_nombre_ganancias${ui.item.fila}`).val(ui.item.value);

                $(`#${this._alias}etxt_pv_pub${this._fila}`).val(ui.item.precio_publico);
                $(`#${this._alias}etxt_pv_dis${this._fila}`).val(ui.item.precio_distribuidor);
                $(`#${this._alias}etxt_pv_fer${this._fila}`).val(ui.item.precio_ferreteria);

                $(`#${this._alias}ecustomers2${ui.item.fila}`).remove();
                
                $.ajax({
                    type: "POST",
                    url: "facturacion/compra/getUltimasCompras",
                    dataType: "json",
                    data: {
                        id_catalogo : ui.item.id, _qn: Tools.en(_tk_), _alias: this._alias, f: ui.item.fila
                    },
                    success: function (compras) {
                        let registros = ''

                        console.log(compras[0]['cantidad'])
                        console.log(typeof(compras[0]['cantidad']))

                        if ( compras[0]['cantidad'] == 0 ) {
                            registros += `<tr  class="d-flex"> 
                                                <td colspan="10">Usted aun no realizo ninguna compra de este producto para este local</td>
                                            </tr>`
                        } else{

                            compras.forEach( function(compra, index) {
                                registros += `<tr  class="d-flex">

                                    <td class="col-2">` + compra.tipo_comprobante + `</td>
                                    <td class="col-2">` + compra.fecha + `</td>
                                    <td class="col-2">` + compra.proveedor + `</td>
                                    <td class="col-1">` + compra.cantidad + `</td>
                                    <td class="col-4">` + compra.value + `</td>
                                    <td class="col-3">` + compra.precio_unitario + `</td>
                                    <td class="col-3">` + compra.sub_total + `</td>
                                    <td class="col-1">` + compra.total + `</td>`

                                console.log(compra.tipo_cambio)

                                if ( compra.tipo_cambio === null ) {
                                    registros += `<td class="col-1">1</td>` +
                                                    `<td class="col-1">` + compra.simbolo + ` ` + compra.total + `</td></tr>`
                                }else {
                                    registros += `<td class="col-1">` + compra.tipo_cambio + `</td>` +
                                                    `<td class="col-1">` + compra.simbolo + ` ` + compra.total / compra.tipo_cambio + `</td></tr>`
                                }
                                
                            });
                        }

                        $(`#${compras[0]['alias']}ultimas_compras${compras[0]['fila']}`).append(registros)
                    }
                });

                $(`#${this._alias}tablas-compras`).append(`<div class="container customers2" id="${this._alias}ecustomers2${this._fila}">

                    <button type="button" id="${this._alias}cerrar_tabla${this._fila}" class="close"><span>×</span><span class="sr-only"></span></button>
                    <table class="table table-sm" id="${this._alias}compra_tabla${this._fila}">
                        <thead>
                        <tr  class="d-flex">
                            <th class="col-2">Comprobante</th>
                            <th class="col-3">Fecha</th>
                            <th class="col-2">Proveedor</th>
                            <th class="col-1">Cantidad</th>
                            <th class="col-4">Producto</th>
                            <th class="col-1">P/U(S/.)</th>
                            <th class="col-1">Precio(S/.)</th>
                            <th class="col-1">Importe(S/.)</th>
                            <th class="col-1">Tipo Cambio</th>
                            <th class="col-1">Importe</th>
                        </tr>
                        </thead>
                        <tbody id="${this._alias}ultimas_compras${this._fila}"> 
                        </tbody>
                    </table>
                    <script>
                        document.getElementById('${this._alias}cerrar_tabla${this._fila}').addEventListener('click', function(){
                        document.getElementById('${this._alias}ecustomers2${this._fila}').remove()});
                        
                       $('#${this._alias}ecustomers2${this._fila}').draggable();
                        
                    </script>
                </div>
                `);

                
            }
        });

        $(`#${this._alias}etxt_producto${this._fila}`).focus();
        $(`#${this._alias}tr_${this._fila}`).find('._calcula').keyup((e) => {
            if (!$.isNumeric($(e.currentTarget).val()) && $(e.currentTarget).val().length > 0) {
                $(e.currentTarget).val(0);
            }
            this._calculaTotalese();
        });


        $(`#${this._alias}tr_${this._fila}`).find('._precio').keyup((e) => {
            if (!$.isNumeric($(e.currentTarget).val()) && $(e.currentTarget).val().length > 0) {
                $(e.currentTarget).val(0);
            }
            $(e.currentTarget).data('precio',$(e.currentTarget).val());
        });
        
        $(`#${this._alias}tr_${this._fila}`).find('.btn-danger').click((e) => {
            $(e.currentTarget).parent().parent('tr').remove();
            this._calculaTotalese();
        });
        $(`#${this._alias}tr_${this._fila}`).find('select').change((e) => {
            this._calculaTotalese();
        });

    }

    getListBoxse(form,data) {
        $(form).appList({
            items: [
                {
                    data: 'tipo_doc_venta',
                    container: `#${this._alias}ed_tipo_doc`,
                    required: true,
                    attr: {
                        id: `${this._alias}elst_tipo_doc`,
                        name: `${this._alias}elst_tipo_doc`,
                        class: 'form-control'
                    },
                    default: data[0].id_tipo_comprobante
                },
                {
                    data: 'tipo_moneda',
                    container: `#${this._alias}ed_tipo_moneda`,
                    required: true,
                    optionSelec: false,
                    attr: {
                        id: `${this._alias}elst_tipo_moneda`,
                        name: `${this._alias}elst_tipo_moneda`,
                        class: 'form-control'
                    },
                    default: data[0].id_tipo_moneda
                },
                {
                    data: 'proveedor_capp',
                    container: `#${this._alias}ed_proveedor`,
                    params: store.get('ID_CLIENTE_APP'),
                    required: true,
                    attr: {
                        id: `${this._alias}elst_proveedor`,
                        name: `${this._alias}elst_proveedor`,
                        class: 'form-control _proveedor'
                    },
                    default: data[0].id_proveedor
                },
                {
                    data: 'local',
                    container: `#${this._alias}ed_local`,
                    params: store.get('ID_CLIENTE_APP'),
                    required: true,
                    attr: {
                        id: `${this._alias}elst_local`,
                        name: `${this._alias}elst_local`,
                        class: 'form-control'
                    },
                    default: data[0].id_local
                },
                {
                    data: 'forma_pago',
                    container: `#${this._alias}ed_forma_pago`,
                    required: true,
                    optionSelec: false,
                    attr: {
                        id: `${this._alias}elst_forma_pago`,
                        name: `${this._alias}elst_forma_pago`,
                        class: 'form-control'
                    },
                    default: data[0].id_forma_pago,
                }
            ]
        });
        this._fila = 0;
        this.addProductoe();
        
    }

    addButtonse() {
        $.fn.appButton.get({
            container: `#${this._alias}ebtn_add`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ITADD, type: 'button', evts: [{click: 'Obj.Facturacion.CompraAx.addIteme'}]}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }

    addButtonsFormUpdate() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.UPD, type: 'submit'}]
        });
    }

    setCompra(data) {

        for (let i = 0; i < data.length; i++) {
            console.log("Aplica igv N"+i+": "+data[i].aplica_igv);
            Tools.setDataForm(this._formEdit, {
                alias: this._alias,
                elements: [
                    //Datos info
                    {item: 'elst_tipo_doc', value: data[i].id_tipo_comprobante, default: data[i].id_tipo_comprobante},
                    {item: 'etxt_serie', value: data[i].txt_serie},
                    {item: 'etxt_num_doc', value: data[i].numero_documento},
                    {item: 'etxt_fecha_compra', value: data[i].fecha_compra, default: data[i].fecha_compra},
                    {item: 'elst_local', value: data[i].id_local, default: data[i].id_local},
                    {item: 'elst_tipo_moneda', value: data[i].id_tipo_moneda, default: data[i].id_tipo_moneda},
                    {item: 'elst_proveedor', value: data[i].id_proveedor, default: data[i].id_proveedor},
                    {item: 'etxt_guia_remitente', value: data[i].numero_guia_remision},
                    {item: 'etxt_orden_compra', value: data[i].orden_compra},
                    {item: 'etxt_tipo_cambio', value: data[i].tipo_cambio == 1 ? '' : data[i].tipo_cambio},

                    {item: 'elst_forma_pago', value: data[i].id_forma_pago, default: data[i].id_forma_pago},
                    {item: 'etxt_observaciones', value: data[i].observaciones},
                    {item: 'etxt_gravada', value: data[i].total_gravada},
                    {item: 'etxt_igv', value: data[i].total_igv},
                    {item: 'etxt_total', value: data[i].total_compra},
                    //Datos productos
                    {item: 'ehhbbproducto'+(i+1), value: data[i].id_catalogo},
                    {item: 'etxt_producto'+(i+1), value: data[i].catalogo},
                    {item: 'etxt_cantidad'+(i+1), value: data[i].cantidad},
                    {item: 'etxt_precio'+(i+1), value: data[i].precio_unitario},
                    {item: 'elst_aplica_igv'+(i+1), value: 0},
                    {item: 'etxt_precio_compra'+(i+1), value: data[i].precio_compra_real},
                    {item: 'etxt_subtotal'+(i+1), value: data[i].sub_total},
                    {item: 'etxt_total_unitario'+(i+1), value: data[i].total},
                    {item: 'eproducto_nombre_ganancias'+(i+1), value: data[i].catalogo},
                    {item: 'etxt_pv_pub'+(i+1), value: data[i].precio_publico},
                    {item: 'etxt_pv_fer'+(i+1), value: data[i].precio_ferreteria},
                    {item: 'etxt_pv_dis'+(i+1), value: data[i].precio_distribuidor},
                    {item: 'etxt_ganancia_pub'+(i+1), value: data[i].ganancia_publico},
                    {item: 'etxt_ganancia_fer'+(i+1), value: data[i].ganancia_ferreteria},
                    {item: 'etxt_ganancia_dis'+(i+1), value: data[i].ganancia_distribuidor},
                ]
            });   
            
            $(`#COM__erd_pagado${data[i].pagado}`).attr('checked', true);  
        }
    }

    validaTipoCambioe() {
        let rs = true;
        if ($(`#${this._alias}elst_tipo_moneda`).val() != 1 && $(`#${this._alias}etxt_tipo_cambio`).val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._012
            });
            $(`#${this._alias}etxt_tipo_cambio`).focus();
            return false;
        }
        return rs;
    }

    validaProductose() {
        let rs = true;
        $(`#${this._alias}etb_detail`).find('tr').find('input.input-xs').each(function () {
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
            $(`#${this._alias}etb_detail`).find('tr').find('input:hidden').each(function () {
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