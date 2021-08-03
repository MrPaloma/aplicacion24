/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        21-09-2018 05:09:33 
 * Descripcion : CuentaCobrarAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.CuentaCobrarAx = class CuentaCobrarAx extends $$.Facturacion.CuentaCobrarRsc {

    constructor() {
        super();
        this._controller = 'cuentaCobrar:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.CuentaCobrarTour;
        this._idEntidad = null;
        this._idFormPDF = `#${this._alias}formPDF`;
        this._idFormIndex = `#${this._alias}formIndex`;
        this._idFormObservacion = `#${this._alias}formObservacion`;
        this._ketCta = null;
        this._keyPago = null;

        this._idFormCobrar = `#${this._alias}formCobrar`;
        
        //--------------------------------------------------------------------------------------
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
                pOrderField: 'fecha_emision desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.local, field: 'local', width: 120, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._026, field: 'numero_documento', width: 50, class: "text-center", valign: 'middle', sortable: true, filter: {type: 'text'},
                        fnReplace: (fila, row) => {
                            let e = 'label-success';
                            if (row.id_tipo_comprobante == '1') {//factura
                                e = 'label-default';
                            }
                            if (row.id_tipo_comprobante =='2') {//boleta
                                e = 'bg-color-purple';
                            }
                            return `<label class="label ${e}">${row.numero_documento}</label>`;
                        }}, 
                
                    {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 300, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._003, field: 'fecha_emision', width: 100, class: "text-center", sortable: true, filter: {type: 'date'}},
                    {title: APP_ETIQUET._017, field: 'total_venta', width: 100, class: "text-right", sortable: true, filter: {type: 'text'}},
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
                                    fn: "Obj.Facturacion.CuentaCobrarAx.formCobrar",
                                    serverParams: "id_venta"
                                }
                            }]
                    }]
                },
                fnCallback: (o) => {
                    this._gridV = o.oTable;
                }
            });
        };


        this._formCobrar = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-COB${APP_CONTAINER_TABS}`).html(data);
                    this._findCobrar(tk);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/

                }
            });
        };

        this._findCobrar = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.addButtons();
                    this._getChekOpenCaja(tk);
                    this._idEntidad = data.id_entidad;
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
                    this.setCobrar(data); 

                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/

                }
            });
        };

        //---------------------------------------------------------------------------
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
                    $(`#${this._alias}txt_cliente`).autocomplete({
                        source: (request, response) => {
                            $.ajax({
                                type: "POST",
                                url: "facturacion/cuentaCobrar/getCliente",
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
                            this._idEntidad = ui.item.id;
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
        
        this._getCuenta = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_idEntidad', value: this._idEntidad});
                },
                response: (data) => {
                    this.setCuenta(data);
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

        this._getPDF = (tk, idVenta) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: idVenta});
                },
                response: (data) => {
                    Tools.viewPDF({
                        form: this._idFormPDF,
                        element: `#${this._alias}d_pdf`,
                        file: data.file
                    });
                }
            });
        };

        this._postDeletePago = (tk) => {
            this.send({
                flag: 2,
                token: tk,
                context: this,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
                gifProcess: true,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._keyPago});
                    sData.push({name: '_ketCta', value: this._ketCta});
                    sData.push({name: '_idEntidad', value: this._idEntidad});
                    sData.push({name: '_keyCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_observacion', value: $(`#${this._alias}txt_observacion`).val()});
                },
                response: (data) => {
                    Tools.execMessage(data.rs);
                    this._keyPago = null;
                    this.evtBtnCancelar();
                    this.setCuenta(data.dataCuenta);
                    this.setPagos(data.dataPagos);
                    Tools.closeModal(this._idFormObservacion);
                }
            });
        };

        this._formObservacion = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                modal: true,
                dataType: 'text',
                response: (data) => {
                    $(APP_MAIN_MODALS).append(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this.addButtonsFormNew();
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

    formPDF(tk, idVenta) {
        this.send({
            gifProcess: true,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this._getPDF(tk, idVenta);
            }
        });
    }

    postPago(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._idFormCobrar,
            serverParams: (sData, obj) => {
                sData.push({name: '_idEntidad', value: this._idEntidad});
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

    postDeletePago(btn, tk, id) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }
        this._keyPago = id;
        this._formObservacion(btn, tk);
    }

    postPagoDelete(tk) {
        Tools.notify().confirm({
            content: APP_MSN.you_sure_delete,
            yes: () => {
                this._postDeletePago(tk);
            }
        });
    }

    //---------------------------------------------------------------------

    formCobrar(btn, id, tk) {
        this._key = id;
        Tools.addTab({
            context: this,
            id: `${this._alias}-COB`,
            label: APP_ETIQUET.cobrar_cuenta,
            fnCallback: () => {
                this._formCobrar(btn, tk);
            }
        });
    }

};