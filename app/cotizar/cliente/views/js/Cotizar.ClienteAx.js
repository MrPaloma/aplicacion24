/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Art  
 * Fecha:        23-11-2018 04:11:07 
 * Descripcion : ClienteAx.js
 * ---------------------------------------
 */
"use strict";
Exe.include([
    {nm: 'facturacion', ob: 'cliente', alias: 'CLI__'}
]);
$$.Cotizar.ClienteAx = class ClienteAx extends $$.Cotizar.ClienteRsc {

    constructor() {
        super();
        this._controller = 'cliente:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Cotizar.ClienteTour;
        this._idFormNew = `#${this._alias}formNew`;
        this._idFormEdit = `#${this._alias}formEdit`;
        this._idFormPDF = `#${this._alias}formPDF`;
        this._idFormSendMail = `#${this._alias}formSendMail`;
        this._idGrid = null;
        this._key = null;

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
                tButtons: [{
                        button: APP_BTN.NEW,
                        event: 'Obj.Cotizar.ClienteAx.formNew'
                    }],
                pOrderField: 'numero desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.local, field: 'local', width: 120, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._047, field: 'numero', width: 70, sortable: true, class: "text-center", filter: {type: 'text'}},
                    {title: APP_ETIQUET.tipo_doc, field: 'tipo_documento_identidad', width: 40, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.num_doc, field: 'documento_identidad', width: 80, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.cliente, field: 'razon_social', width: 300, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._073, field: 'fecha_crea', width: 80, sortable: true, class: "text-center", filter: {type: 'text'}}
                ],
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.PDF,
                                    ajax: {
                                        fn: "Obj.Cotizar.ClienteAx.getPDF",
                                        serverParams: "id_cotizacion"
                                    }
                                }, {
                                    button: APP_BTN.EMA,
                                    ajax: {
                                        fn: "Obj.Cotizar.ClienteAx.formSendMail",
                                        serverParams: "id_cotizacion"
                                    }
                                }, {
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.Cotizar.ClienteAx.formEdit",
                                        serverParams: "id_cotizacion"
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Cotizar.ClienteAx.postDelete",
                                        serverParams: "id_cotizacion"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGrid = o.oTable;
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

        this._postDelete = (btn, tk, id) => {
            this.send({
                flag: 3,
                token: tk,
                context: this,
                element: btn,
                gifProcess: true,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: id});
                },
                response: (data) => {
                    Tools.execMessage(data);

                    if (data.ok_error != 'error') {
                        Tools.refreshGrid(this._idGrid);
                    }
                }
            });
        };

        this._find = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                finally: (data) => {
                    this.setCotizacion(data);
                    this.getListBoxs(this._idFormEdit, data.head, true);
                    $(`#${this._alias}n_coti`).html(data.head.numero);
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

    formNew(btn, tk) {
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
                this.addButtonItem();
                this._fila = 0;
                this.addProducto();
                this.getListBoxs(this._idFormNew);
                setTimeout(() => {
                    this._evtsTC();
                }, 1500);
                this._evtTypeChange();
            }
        });
    }

    formEdit(btn, id, tk) {
        this._key = id;
        this.send({
            element: btn,
            gifProcess: true,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate();
                this.addButtonItem();
                this._find(tk);
            }
        });
    }

    formSendMail(btn, id, tk) {
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
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsMail();
            }
        });
    }

    getPDF(btn, id, tk) {
        this.send({
            token: tk,
            gifProcess: true,
            context: this,
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                console.log(data);
                this._formPDF(tk, data);
            }
        });
    }

    addItem(btn, tk) {
        this.addProducto();
    }

    postNew(tk) {
        if (!this.validaProductos()) {
            return false;
        }

        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._idFormNew,
            response: (data) => {
                Tools.execMessage(data.rs);
                if (data.rs.ok_error != 'error') {
                    Tools.refreshGrid(this._idGrid);
                    Tools.closeModal(this._idFormNew);
                    this._formPDF(tk, data.doc);
                }
            }
        });
    }

    postEdit(tk) {
        if (!this.validaProductos()) {
            return false;
        }

        this.send({
            flag: 2,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
            context: this,
            form: this._idFormEdit,
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: this._key});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    Tools.refreshGrid(this._idGrid);
                    Tools.closeModal(this._idFormEdit);
                }
            }
        });
    }

    postEmail(tk) {
        this.send({
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.EMA}`,
            context: this,
            form: this._idFormSendMail,
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: this._key});
            },
            response: (data) => {
                if (data.result == 1) {
                    Tools.notify().ok({
                        content: APP_MSN._044
                    });
                    Tools.closeModal(this._idFormSendMail);
                } else if (data.result == 2) {
                    Tools.notify().error({
                        content: APP_MSN._045
                    });
                } else {
                    Tools.notify().error({
                        content: APP_MSN.comuniquese
                    });
                }
            }
        });
    }

    postDelete(btn, id, tk) {
        Tools.notify().confirm({
            content: APP_MSN.you_sure_delete,
            yes: () => {
                this._postDelete(btn, tk, id);
            }
        });
    }

};