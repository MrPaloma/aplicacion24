/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 17:09:53 
 * Descripcion : NotaVentaAx.js
 * ---------------------------------------
 */
"use strict";
Exe.include([
    {nm: 'facturacion', ob: 'cliente', alias: 'CLI__'},

]);

$$.Facturacion.NotaVentaAx = class NotaVentaAx extends $$.Facturacion.NotaVentaRsc {

    constructor() {
        super();
        this._controller = 'notaVenta:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.NotaVentaTour;
        this._idGrid = null;
        this._idFormTicket = `#${this._alias}formTicket`;
        this._idFormNotaVenta = `#${this._alias}formNotaVenta`;
        this._idFormPDF = `#${this._alias}formPDF`;
        this._idConvertirNV = `#${this._alias}convertirNV`;
        this._formEdit = `#${this._alias}formEdit`;
        this._formEditNV = `#${this._alias}formEditNV`;
        this._formDevolucion = `#${this._alias}formDevolucion`;
        this._formAnular = `#${this._alias}formAnular`;
        this._key = null;
        this._tipoComprobante = null;
        this._numDoc = null;
        this._idSerie = null;

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
                pOrderField: 'id_venta desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET._026, field: 'numero_comprobante', class: "text-center", width: 80, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._027, field: 'numero_documento', class: "text-center", width: 120, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.razon_social, field: 'razon_social', class: "text-center", width: 120, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._003, field: 'fecha', class: "text-center", width: 120, sortable: true, filter: {type: 'date'}},
                    {title: APP_ETIQUET._017, field: 'total_detalle', class: "text-center", width: 120, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'factura', width: 30, class: "text-center", sortable: true,
                    filter: {
                        type: "select",
                        dataClient: [{etiqueta: APP_ETIQUET._070, value: "0"}, {etiqueta: APP_ETIQUET._071, value: "1"}],
                        options: {label: "etiqueta", value: "value"}
                    },
                    fnReplace: (fila, row) => {
                        let e = `<label class="label label-success" style="color: #fff;font-weight: bold;text-align: center;font-size: 11px;">${row.factura}</label>`;
                        if (row.factura == 0) {
                            e = `<label class="label label-default" style="color: #fff;font-weight: bold;text-align: center;font-size: 11px;">${APP_ETIQUET._070}</label>`;
                        }
                        if (row.factura == 'Anulado') {
                            e = `<label class="label label-danger" style="color: #fff;font-weight: bold;text-align: center;font-size: 11px;">${row.factura}</label>`;
                        }
                        return e;
                    }}
                    
                ],
                sExport: {
                    buttons: {excel: true},
                    columns: [
                        {title: APP_ETIQUET._026, field: 'numero_comprobante', width: 80},
                        {title: APP_ETIQUET._027, field: 'numero_documento', width: 120},
                        {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 120},
                        {title: APP_ETIQUET._003, field: 'fecha', width: 120},
                        {title: APP_ETIQUET._017, field: 'total_detalle', width: 120},
                    ]
                },
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.TIK,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaVentaAx.getTICKET",
                                        serverParams: ["id_venta"]
                                    }
                                },{
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaVentaAx.formEditNV",
                                        serverParams: ["id_venta"]
                                    }
                                },{
                                    button: APP_BTN.PDF,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaVentaAx.getPDF",
                                        serverParams: ["id_venta"]
                                    }
                                },{
                                    button: APP_BTN.TNV,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaVentaAx.formEdit",
                                        serverParams: ["id_venta"]
                                    }
                                },{
                                    button: APP_BTN.DPRO,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaVentaAx.formDevolucion",
                                        serverParams: ["id_venta"]
                                    }
                                },{
                                    button: APP_BTN.ANC,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaVentaAx.formAnular",
                                        serverParams: ["id_venta"]
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGrid = o.oTable;
                }
            });
        };

        this._convertirNV = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    console.log(data)
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/

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

        this._findVenta = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.addButtons();
                    this._fila = 0;

                    this.getListBoxs(this._formEdit,data); 
                    // for (let i = 0; i< data.length; i++) {
                    //     this.addItem();
                    // }
                    // this.setVenta(data)
                    
                    Tools.maxDate(`#${this._alias}txt_fecha_vencimiento`);
                    
                    // setTimeout(() => {
                    //     this._eevts();
                    //     this._eevtTypeChange();
                    // }, 500);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._getChekOpenCaja(tk);
                    
                    
                }
            });
        };

        this._findVentaNV = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.addButtons();
                    this._fila = 0;

                    this.getListBoxsNV(this._formEditNV,data); 
                    // for (let i = 0; i< data.length; i++) {
                    //     this.addItem();
                    // }
                    // this.setVenta(data)
                    
                    Tools.maxDate(`#${this._alias}txt_fecha_vencimiento`);
                    
                    // setTimeout(() => {
                    //     this._eevts();
                    //     this._eevtTypeChange();
                    // }, 500);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._getChekOpenCaja(tk);
                    
                    
                }
            });
        };
        
        //Devolucion Update
        this._findDevolucion = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.addButtons();
                    this._fila = 0;

                    this.getListBoxsD(this._formDevolucion,data); 
                    // for (let i = 0; i< data.length; i++) {
                    //     this.addItem();
                    // }
                    // this.setVenta(data)
                    
                    Tools.maxDate(`#${this._alias}txt_fecha_vencimiento`);
                    
                    // setTimeout(() => {
                    //     this._eevts();
                    //     this._eevtTypeChange();
                    // }, 500);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._getChekOpenCaja(tk);
                    
                    
                }
            });
        };
        
        //Anular Update
        this._findAnular = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.addButtons();
                    this._fila = 0;

                    this.getListBoxsA(this._formAnular,data); 
                    // for (let i = 0; i< data.length; i++) {
                    //     this.addItem();
                    // }
                    // this.setVenta(data)
                    
                    Tools.maxDate(`#${this._alias}txt_fecha_vencimiento`);
                    
                    // setTimeout(() => {
                    //     this._eevts();
                    //     this._eevtTypeChange();
                    // }, 500);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._getChekOpenCaja(tk);
                    
                    
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

        this._getNumeroDocActual = (id, el) => {
            this.send({
                token: _tk_,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: id});
                },
                response: (data) => {
                    $(`#${this._alias}${el}`).val(data.numero_actual);
                }
            });
        };

        this._postEdit = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
                context: this,
                form: this._formEdit,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error == 'ok') {
                        this._key = null;
                        Tools.refreshGrid(this._idGrid);
                        Tools.closeModal(this._formEdit);
                    }
                }
            });
        };

        this._postEditNV = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
                context: this,
                form: this._formEditNV,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error == 'ok') {
                        this._key = null;
                        Tools.refreshGrid(this._idGrid);
                        Tools.closeModal(this._formEditNV);
                    }
                }
            });
        };
        
        //Devolucion Update
        this._postDevolucion = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
                context: this,
                form: this._formDevolucion,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error == 'ok') {
                        this._key = null;
                        Tools.refreshGrid(this._idGrid);
                        Tools.closeModal(this._formDevolucion);
                    }
                }
            });
        };
        
        //Anular Update
        this._postAnular = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
                context: this,
                form: this._formAnular,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error == 'ok') {
                        this._key = null;
                        Tools.refreshGrid(this._idGrid);
                        Tools.closeModal(this._formAnular);
                    }
                }
            });
        };
        
        //Ticket Update
        this._formTicket = (tk, dataDoc, autoPrint = true) => {
            this.send({
                token: tk,
                context: this,
                modal: true,
                dataType: 'text',
                response: (data) => {
                    $(APP_MAIN_MODALS).append(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this.addButtonPrintTk();
                    this.setTicket(dataDoc, autoPrint);
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


    getPDF(btn, id, tk) {
        this.send({
            element: btn,
            token: tk,
            context: this,
            gifProcess: true,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                this._formPDF(tk, data);
            }
        });
    }

    convertirNV(btn, id, tk) {
        this.send({
            element: btn,
            token: tk,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {

                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    this._key = null;
                    Tools.refreshGrid(this._idGrid);
                    $("html, body").animate({scrollTop: 0}, 100);
                }
            }
        });
    }

    formEdit(btn, id, tk) {
        this._key = id;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            gifProcess: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
                this._findVenta(tk);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate(); 
            }
        });
    }

    formEditNV(btn, id, tk) {
        this._key = id;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            gifProcess: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
                this._findVentaNV(tk);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate(); 
            }
        });
    }
    
    //Devolucion Update
    formDevolucion(btn, id, tk) {
        this._key = id;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            gifProcess: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
                this._findDevolucion(tk);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate(); 
            }
        });
    }
    
    //Anular Update
    formAnular(btn, id, tk) {
        this._key = id;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            gifProcess: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
                this._findAnular(tk);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate(); 
            }
        });
    }

    addItem(btn, tk) {
        this.addProducto();
    }

    postEdit(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }
        if (!this.validaProductos()) {
            return false;
        }
        if (!this.validaTipoCambio()) {
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._030,
            yes: () => {
                this._postEdit(tk);
            }
        });
    }

    postEditNV(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }
        if (!this.validaProductos()) {
            return false;
        }
        if (!this.validaTipoCambio()) {
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._030,
            yes: () => {
                this._postEditNV(tk);
            }
        });
    }
    
    //Devolucion Update
    postDevolucion(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }
        if (!this.validaProductos()) {
            return false;
        }
        if (!this.validaTipoCambio()) {
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._030,
            yes: () => {
                this._postDevolucion(tk);
            }
        });
    }
    
    //Anular Update
    postAnular(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }
        if (!this.validaProductos()) {
            return false;
        }
        if (!this.validaTipoCambio()) {
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._030,
            yes: () => {
                this._postAnular(tk);
            }
        });
    }
    
    //Ticket Update
    getTICKET(btn, id, tk) {
        this.send({
            element: btn,
            token: tk,
            context: this,
            gifProcess: true,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                this._formTicket(tk, data, false);
            }
        });
    }
    
    printTicket(btn, tk) {
        Tools.printTicket({
            area: `#${this._alias}d_ticket`,
            overrideElementCSS: [
                'public/css/generic.css'
            ],
            css: 'table{font-size: 12px} .text-center{text-align:center} .text-right{text-align:right}'
        });
    }

};