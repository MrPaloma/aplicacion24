/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Adm  
 * Fecha:        30-01-2019 06:01:17 
 * Descripcion : ModificaStockRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.ModificaStockRsc = class ModificaStockRsc extends Resource {

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

        this._evtAutocomplete = (tk) => {
            this._file = 0;
            $(`#${this._alias}txt_producto`).autocomplete({
                source: (request, response) => {
                    if ($(`#${this._alias}lst_local`).val().length == 0) {
                        Tools.notify().smallMsn({
                            content: APP_MSN._059
                        });
                        $(`#${this._alias}txt_producto`).removeClass('ui-autocomplete-loading');
                        return false;
                    }
                    $.ajax({
                        type: "POST",
                        url: "facturacion/modificaStock/getProducto",
                        dataType: "json",
                        data: {
                            term: request.term,
                            _qn: Tools.en(tk),
                            _alias: this._alias,
                            _idLocal: $(`#${this._alias}lst_local`).val()
                        },
                        success: function (data) {
                            response(data);
                        }
                    });
                },
                minLength: 2,
                select: (event, ui) => {
                    //$(`#${this._alias}hhbbproducto${ui.item.fila}`).val(ui.item.id);
                    //this._getUnidadProducto(ui.item);
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
                <div class="col-lg-5">
                    <input type="hidden" name="${this._alias}hhidproducto[]" value="${p.id}"/> 
                    <input type="text" class="form-control input-xs" id="txt_nproducto" name="txt_nproducto[]" value="${p.value}" disabled="true"/> 
                </div>
                <div class="text-primary col-lg-1">
                    <p>${p.stock_actual}</p>
                </div>
                <div class="text-danger col-lg-1">
                    <p id="${this._alias}txt_stock_actual${this._file}"></p>
                </div>
                <div class="col-lg-2">
                    <select class="form-control input-xs _operacion" id="${this._alias}lst_operacion${this._file}" name="${this._alias}lst_operacion[]">
                        <option value="A">${APP_ETIQUET._221}</option>
                        <option value="R">${APP_ETIQUET._222}</option>
                    </select>
                </div>
                <div class="col-lg-2">
                    <input type="text" class="form-control input-xs _cantidad" id="${this._alias}txt_cantidad${this._file}" name="${this._alias}txt_cantidad[]" placeholder="${APP_ETIQUET._013}" autocomplete="off"/> 
                </div>
                
                <div class="col-lg-1">
                     <button type="button" class="btn btn-danger btn-xs" onclick="$(this).parent().parent().remove();"><i class="fa fa-trash"></i></button>
                </div>
            </div>`;
            $(`#${this._alias}d_productos`).append(d);
            //stock
            $(`#${this._alias}lst_operacion${this._file}`).data('stock', { sa: p.stock_actual, f: this._file });

            $(`#${this._alias}txt_cantidad${this._file}`).data('stock', { sa: p.stock_actual, f: this._file });
            this._clearAuto();

            
            $(`#${this._alias}d_productos`).find('._operacion').change(function () {
                
                let stock = parseFloat($(this).data('stock').sa);
                let fila = parseFloat($(this).data('stock').f);

                if ($(this).val() == "A") {
                   
                    let valor = stock + parseFloat($(`#MDF__txt_cantidad${fila}`).val());
                    $(`#MDF__txt_stock_actual${fila}`).text(valor);

                }
                else if ($(this).val() == "R") {

                    let valor = stock - parseFloat($(`#MDF__txt_cantidad${fila}`).val());
                    $(`#MDF__txt_stock_actual${fila}`).text(valor);

                }
            });

            $(`#${this._alias}d_productos`).find('._cantidad').keyup(function () {
                if ($.isNumeric($(this).val())) {

                    let stock = parseFloat($(this).data('stock').sa);
                    let fila = parseFloat($(this).data('stock').f);

                    if ($(`#MDF__lst_operacion${fila}`).val() == "A") {
                        
                        let valor = stock + parseFloat($(this).val());
                        $(`#MDF__txt_stock_actual${fila}`).text(valor);

                    }
                    else if ($(`#MDF__lst_operacion${fila}`).val() == "R") {
    
                        let valor = stock - parseFloat($(this).val());
                        $(`#MDF__txt_stock_actual${fila}`).text(valor);
                    }
                }
            });
        };
        
        this._validaCantidad = () =>{
            let rs = true;
            
            $(`#${this._alias}d_productos`).find('._cantidad').each(function(){
                $(this).css({
                    border: '1px solid #ccc',
                    background: '#fff'
                });
                if(!$.isNumeric(this.value)){
                    $(this).css({
                        border: '1px solid #990000',
                        background: '#F6CEE3'
                    });
                    rs = false;
                }
            });
            if(!rs){
                Tools.notify().smallMsn({
                    content: APP_MSN._041
                });
            }
            return rs;
        };

        this._clearAuto = () => {
            setTimeout(() => {
                $(`#${this._alias}txt_producto`).val('');
                $(`#${this._alias}txt_producto`).removeClass('ui-autocomplete-loading');
            }, 100);
        };
        
        
    }

    addButtonsFormNew() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
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

    getListBoxs(form) {
        $(form).appList({
            items: [
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
                    default: '9'
                }
            ]
        });
    }
    
    //preview update
    
    addButtonsPrint() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.IMP, type: 'button', evts: [{click: 'Obj.Facturacion.ModificaStockAx.printDetalle'}]}
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
                <td class="text-center">${b.operacion}</td>
                <td class="text-center">${b.cantidad}</td>
            </tr>`;
            t += parseFloat(b.cantidad);
        });
        $(`#${this._alias}d_detalle`).html(h);
        $(`#${this._alias}d_titems`).html(Tools.formatNumber(t, 2));
        $(`#${this._alias}d_local`).html(data[0].local);
        $(`#${this._alias}d_fecha`).html(data[0].fecha);
    }

};