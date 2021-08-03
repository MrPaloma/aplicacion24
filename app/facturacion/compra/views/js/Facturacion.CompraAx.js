/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 20:09:46 
 * Descripcion : CompraAx.js
 * ---------------------------------------
 */
"use strict";
Exe.include([
    {nm: 'facturacion', ob: 'proveedor', alias: 'PRO__'},
    {nm: 'facturacion', ob: 'catalogo', alias: 'CATA__'}
]);

$$.Facturacion.CompraAx = class CompraAx extends $$.Facturacion.CompraRsc {

    constructor() {
        super();
        this._controller = 'compra:';
        this._alias = Exe.getAlias();
        this._alias1 = typeof(Exe.include());
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.CompraTour;
        this._gridV = null;
        this._idFormNewCompra = `#${this._alias}formNewCompra`;
        this._idFormPDF = `#${this._alias}formPDF`;
        this._formEdit = `#${this._alias}formEdit`;
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
            console.log(this._alias1)
            $(`#${this._alias}grid`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                        button: APP_BTN.NEW,
                        event: 'Obj.Facturacion.CompraAx.formNewCompra'
                    }],
                pOrderField: 'fecha_compra desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET._026, field: 'numero_documento', width: 80, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.tipo_comprobante, field: 'tipo_comprobante', width: 80, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.tipo_doc, field: 'tipo_doc_identidad', width: 20, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._027, field: 'documento_identidad', width: 60, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 210, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._003, field: 'fecha_compra', width: 100, class: "text-center", sortable: true, filter: {type: 'date'}},
                    {title: APP_ETIQUET._017, field: 'total_compra', width: 100, class: "text-right", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._006, field: 'tipo_cambio', width: 20, class: "text-right", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.total_soles, field: 'total_soles', width: 100, class: "text-right", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'pagado', width: 30, class: "text-center", sortable: true,
                    filter: {
                        type: "select",
                        dataClient: [{etiqueta: APP_ETIQUET._070, value: "0"}, {etiqueta: APP_ETIQUET._071, value: "1"}],
                        options: {label: "etiqueta", value: "value"}
                    },
                    fnReplace: (fila, row) => {
                        let e = `<label class="label label-danger" style="color: #fff;font-weight: bold;text-align: center;font-size: 11px;">${APP_ETIQUET._070}</label>`;
                        if (row.pagado == 1) {
                            e = `<label class="label label-success" style="color: #fff;font-weight: bold;text-align: center;font-size: 11px;">${APP_ETIQUET._071}</label>`;
                        }
                        return e;
                    }}
                ],
                sExport: {
                    buttons: {excel: true},
                    columns: [
                        {title: APP_ETIQUET._026, field: 'numero_documento', width: 30},
                        {title: APP_ETIQUET.tipo_doc, field: 'tipo_doc_identidad', width: 50},
                        {title: APP_ETIQUET._027, field: 'documento_identidad', width: 30},
                        {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 50},
                        {title: APP_ETIQUET._003, field: 'fecha_compra', width: 20},
                        {title: APP_ETIQUET._017, field: 'total_compra', width: 30, type: 'number'}
                    ]
                },
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.Facturacion.CompraAx.formEdit",
                                        serverParams: "id_compra"
                                    }
                                },{
                                    button: APP_BTN.PDF,
                                    ajax: {
                                        fn: "Obj.Facturacion.CompraAx.getPDF",
                                        serverParams: ["id_compra"]
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridV = o.oTable;
                }
            });
        };

        this._formNewCompra = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-NWC${APP_CONTAINER_TABS}`).html(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this.addButtons();
                    this.getListBoxs(this._idFormNewCompra);
                    this._getChekOpenCaja(tk);

                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }
                    Tools.maxDate(`#${this._alias}txt_fecha_compra`);

                    setTimeout(() => {
                        this._evts();
                        this._evtTypeChange();
                    }, 500);
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

        this._postCompra = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
                context: this,
                form: this._idFormNewCompra,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyCaja', value: store.get('ID_CAJA')});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error != 'error') {
                        Tools.refreshGrid(this._gridV);
                        Tools.closeTab(`${this._alias}-NWC`);
                        $("html, body").animate({scrollTop: 0}, 100);
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

        //funciones para el modal editar compra 
        this._findCompra = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.addButtonse();
                    this.getListBoxse(this._formEdit,data);   
                    console.log(this._fila);
                    for (let i = 0; i< data.length; i++) {
                        this.addIteme();
                    }
                    this.setCompra(data); 
                    Tools.maxDate(`#${this._alias}etxt_fecha_compra`);
                    
                    setTimeout(() => {
                        this._eevts();
                        this._eevtTypeChange();
                    }, 500);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._getChekOpenCaja(tk);
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
                    sData.push({name: '_keyCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error != 'error') {
                        this._key = null;
                        Tools.refreshGrid(this._gridV);
                        Tools.closeModal(this._formEdit);
                    }
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

    formNewCompra(btn, tk) {
        Tools.addTab({
            context: this,
            id: `${this._alias}-NWC`,
            label: APP_ETIQUET._081,
            fnCallback: () => {
                this._formNewCompra(btn, tk);
            }
        });
    }

    postCompra(tk) {
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
                this._postCompra(tk);
            }
        });
    }

    getPDF(btn, id, tk) {
        this.send({
            element: btn,
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

    addItem(btn, tk) {
        this.addProducto();
    }


    // Funcionas para el modal editar compra

    addIteme(btn, tk) {
        this.addProductoe();
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
                this._findCompra(tk);

            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate();
                
            }
        });
    }

    postEdit(tk) {

        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }
        if (!this.validaProductose()) {
            return false;
        }
        if (!this.validaTipoCambioe()) {
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._030,
            yes: () => {
                
                if ($(`#${this._alias}etxt_tipo_cambio`).val() == "") {
                    $(`#${this._alias}etxt_tipo_cambio`).val(1)
                }

                console.log($(`#${this._alias}etxt_tipo_cambio`).val())

                this._postEdit(tk);
            }
        });
    }

    

};