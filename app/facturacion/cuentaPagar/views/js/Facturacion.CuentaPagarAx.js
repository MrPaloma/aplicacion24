/* 
* ---------------------------------------
* --------- CREATED BY LV ----------
* Autor:        Admin A Art A 
* Fecha:        21-09-2018 05:09:24 
* Descripcion : CuentaPagarAx.js
* ---------------------------------------
*/ 
"use strict";

$$.Facturacion.CuentaPagarAx = class CuentaPagarAx extends $$.Facturacion.CuentaPagarRsc {

    constructor() {
        super();
        this._controller = 'cuentaPagar:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.CuentaPagarTour;
        this._idFormPDF = `#${this._alias}formPDF`;
        this._idFormPagar = `#${this._alias}formPagar`;
        this._ketCta = null;

        this._gridV = null;
        this._key = null;
        //-----------------------------------------------------------------------
        this._formIndex = (tk) => {
            this.send({
                token: tk,
                context: this,
                dataType: 'text',
                tour: true,
                response: (data) => {
                    $(this._dmain).append(data);
                },
                finally: (data) => {
                    //escriba aqui, se ejecutara una vez haya cargado el HTML
                    //Tools.addTourMain.call(this);
                    this._grid(tk);
                }
            });
        };

        this._grid = (tk) => {
            $(`#${this._alias}grid`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                pOrderField: 'fecha_compra desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET._026, field: 'numero_documento', width: 80, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 250, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._003, field: 'fecha_compra', width: 100, class: "text-center", sortable: true, filter: {type: 'date'}},
                    {title: APP_ETIQUET._006, field: 'tipo_cambio', width: 30, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._067, field: 'deuda', width: 100, class: "text-right", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.total_soles, field: 'total_soles', width: 30, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'saldo', width: 30, class: "text-center", sortable: true,
                    filter: {
                        type: "select",
                        dataClient: [{etiqueta: APP_ETIQUET._070, value: "0"}, {etiqueta: APP_ETIQUET._071, value: "1"}],
                        options: {label: "etiqueta", value: "value"}
                    },
                    fnReplace: (fila, row) => {
                        let e = `<label class="label label-danger" style="color: #fff;font-weight: bold;text-align: center;font-size: 11px;">${APP_ETIQUET._070}</label>`;
                        if (row.saldo == 0) {
                            e = `<label class="label label-success" style="color: #fff;font-weight: bold;text-align: center;font-size: 11px;">${APP_ETIQUET._071}</label>`;
                        }
                        return e;
                    }}
                ],
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.PGR,
                                    ajax: {
                                        fn: "Obj.Facturacion.CuentaPagarAx.formPagar",
                                        serverParams: "id_compra"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridV = o.oTable;
                }
            });
        };

        this._formPagar = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-PAG${APP_CONTAINER_TABS}`).html(data);
                    this._findPago(tk);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/

                }
            });
        };

        this._findPago = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.addButtons();
                    this._getChekOpenCaja(tk);
                    this._idProveedor = data.id_proveedor;
                    this._getCuenta(tk);
                                        
                    $(`#${this._alias}btn_close`).click(() => {
                        if (!$.isEmptyObject(this._ketCta)) {
                            this.evtBtnCancelar();
                        }
                    });

                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }

                    Tools.maxDate(`#${this._alias}txt_fecha`);
                    this.setPago(data); 

                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/

                }
            });
        };
        
        //---------------------------------------------
        this._formIndex2 = (tk) => {
            this.send({
                token: tk,
                context: this,
                dataType: 'text',
                tour: true,
                response: (data) => {
                    $(this._dmain).append(data);
                },
                finally: (data) => {
                    //escriba aqui, se ejecutara una vez haya cargado el HTML
                    //Tools.addTourMain.call(this);
                    this.addButtons();
                    this._getChekOpenCaja(tk);
                    $(`#${this._alias}txt_proveedor`).autocomplete({
                        source: (request, response) => {
                            $.ajax({
                                type: "POST",
                                url: "facturacion/cuentaPagar/getProveedor",
                                dataType: "json",
                                data: {
                                    term: request.term, _qn: Tools.en(_tk_), _alias: this._alias
                                },
                                success: function (data) {
                                    response(data);
                                }
                            });
                        },
                        minLength: 2,
                        select: (event, ui) => {
                            this._idProveedor = ui.item.id;
                            this._getCuenta(tk);
                        }
                    });
                    
                    $(`#${this._alias}btn_close`).click(() => {
                        if (!$.isEmptyObject(this._ketCta)) {
                            this.evtBtnCancelar();
                        }
                    });

                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }

                    Tools.maxDate(`#${this._alias}txt_fecha`);
                }
            });
        };
        
        this._getCuenta = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_idProveedor', value: this._idProveedor});
                },
                response: (data) => {
                    this.setCuenta(data);
                    console.log(data);
                }
            });
        };
        
        this._getChekOpenCaja = (tk) => {
            this.send({
                token: tk,
                context: this,
                response: (data) => {
                    if (data) {
                        store.set('ID_CAJA', data.id_local_caja);
                    }else{
                        store.set('ID_CAJA', null);
                    }
                }
            });
        };
        
        this._formPDF = (tk, doc) => {
            this.send({
                token: tk,
                context: this,
                modal: true,
                dataType: 'text',
                response: (data) => {
                    $(APP_MAIN_MODALS).append(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    Tools.viewPDF({
                        form: this._idFormPDF,
                        element: `#${this._alias}d_pdf`,
                        file: doc.file,
                        height: 650
                    });
                }
            });
        };
        
        this._getPagos = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_ketCta', value: this._ketCta});
                },
                response: (data) => {
                    this.setPagos(data);
                }
            });
        };
        
        this._postDeletePago = (btn, tk, id) => {
            this.send({
                flag: 2,
                token: tk,
                context: this,
                element: btn,
                gifProcess: true,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: id});
                    sData.push({name: '_ketCta', value: this._ketCta});
                    sData.push({name: '_keyCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_idProveedor', value: this._idProveedor});
                },
                response: (data) => {
                    Tools.execMessage(data.rs);

                    this.evtBtnCancelar();
                    this.setCuenta(data.dataCuenta);
                    this.setPagos(data.dataPagos);
                }
            });
        };
        
    }
    
    main(tk) {
        Tools.addTab({
            context: this,
            id: this._alias,
            label: Exe.getTitle(),
            breadCrumb: Exe.getRoot(),
            fnCallback: () => {
                this._formIndex(tk);
            }
        });
    }
        
    getPDF(tk, id) {
        this.send({
            gifProcess: true,
            token: tk,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                this._formPDF(tk, data);
            }
        });
    }
    
    postDeletePago(btn, tk, id) {
        Tools.notify().confirm({
            content: APP_MSN.you_sure_delete,
            yes: () => {
                this._postDeletePago(btn, tk, id);
            }
        });
    }
    
    postPago(tk) {
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._idFormPagar,
            serverParams: (sData, obj) => {
                sData.push({name: '_idProveedor', value: this._idProveedor});
                sData.push({name: '_ketCta', value: this._ketCta});
                sData.push({name: '_keyCaja', value: store.get('ID_CAJA')});
            },
            response: (data) => {
                Tools.execMessage(data.rs);
                this.evtBtnCancelar();
                this.setCuenta(data.dataCuenta);
                this.setPagos(data.dataPagos);
            }
        });
    }

    //-----------------------------------
    formPagar(btn, id, tk) {
        this._key = id;
        Tools.addTab({
            context: this,
            id: `${this._alias}-PAG`,
            label: APP_ETIQUET.pagar_cuenta,
            fnCallback: () => {
                this._formPagar(btn, tk);
            }
        });
    }
    
};