/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Art  
 * Fecha:        30-12-2018 01:12:26 
 * Descripcion : TransportistaAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.TransportistaAx = class TransportistaAx extends $$.Facturacion.TransportistaRsc {

    constructor() {
        super();
        this._controller = 'transportista:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.TransportistaTour;
        this._idGrid = null;
        this._idFormNew = `#${this._alias}formNew`;
        this._idFormEdit = `#${this._alias}formEdit`;
        this._idFormNewVehiculo = `#${this._alias}formNewVehiculo`;
        this._idFormEditVehiculo = `#${this._alias}formEditVehiculo`;
        this._key = null;
        this._keyVehiculo = null;
        this._idGridVh = null;

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
                        event: 'Obj.Facturacion.TransportistaAx.formNew'
                    }],
                pOrderField: 'razon_social asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.num_doc, field: 'numero_documento', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 550, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'activo', width: 120, class: "text-center", sortable: true, filter: {
                            type: "select",
                            dataClient: [{etiqueta: "Activo", value: "1"}, {etiqueta: "Inactivo", value: "0"}],
                            options: {label: "etiqueta", value: "value"}
                        },
                        fnReplace: (fila, row) => {
                            let e = `<label class="label label-danger">${APP_ETIQUET.inactivo}</label>`;
                            if (row.activo == 1) {
                                e = `<label class="label label-success">${APP_ETIQUET.activo}</label>`;
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
                                    button: APP_BTN.VHC,
                                    ajax: {
                                        fn: "Obj.Facturacion.TransportistaAx.formVehiculos",
                                        serverParams: ["id_transportista","razon_social"]
                                    }
                                }, {
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.Facturacion.TransportistaAx.formEdit",
                                        serverParams: "id_transportista"
                                    }
                                },{
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Facturacion.TransportistaAx.postDelete",
                                        serverParams: "id_transportista"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGrid = o.oTable;
                }
            });
        };

        this._findTransporte = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.setTransporte(this._idFormEdit,data);
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
        
        this._formVehiculos = (btn, tk, t) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-VHC${APP_CONTAINER_TABS}`).html(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._gridVehiculos(tk);
                    $(`#${this._alias}d_t_name`).html(`${t}`);
                }
            });
        };
        
        this._gridVehiculos = (tk) => {
            $(`#${this._alias}gridVehiculos`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                        button: APP_BTN.NEW,
                        event: 'Obj.Facturacion.TransportistaAx.formNewVehiculo'
                    }],
                pOrderField: 'chofer asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.num_doc, field: 'numero_documento', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._176, field: 'chofer', width: 400, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._177, field: 'placa', width: 100, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'activo', width: 120, class: "text-center", sortable: true, filter: {
                            type: "select",
                            dataClient: [{etiqueta: "Activo", value: "1"}, {etiqueta: "Inactivo", value: "0"}],
                            options: {label: "etiqueta", value: "value"}
                        },
                        fnReplace: (fila, row) => {
                            let e = `<label class="label label-danger">${APP_ETIQUET.inactivo}</label>`;
                            if (row.activo == 1) {
                                e = `<label class="label label-success">${APP_ETIQUET.activo}</label>`;
                            }
                            return e;
                        }}
                ],
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                    sData.push({name: '_transportista', value: this._key});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.Facturacion.TransportistaAx.formEditVehiculo",
                                        serverParams: "id_transportista_vehiculo"
                                    }
                                },{
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Facturacion.TransportistaAx.postDeleteVehiculo",
                                        serverParams: "id_transportista_vehiculo"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGridVh = o.oTable;
                }
            });
        };

        this._findVehiculo = (tk)=>{
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyVehiculo', value: this._keyVehiculo});
                },
                response: (data) => {
                    this.setVehiculo(this._idFormEditVehiculo,data);
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
                this.getListBoxs(this._idFormNew);
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
                this._findTransporte(tk);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate();
            }
        });
    }

    postNew(tk) {
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._idFormNew,
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    Tools.refreshGrid(this._idGrid);
                    Tools.closeModal(this._idFormNew);
                }
            }
        });
    }
    
    postEdit(tk) {
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
                    this._key = null;
                    Tools.refreshGrid(this._idGrid);
                    Tools.closeModal(this._idFormEdit);
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
    
    formVehiculos(btn, id, t, tk) {
        this._key = id;
        Tools.addTab({
            context: this,
            id: `${this._alias}-VHC`,
            label: `${APP_ETIQUET._169}: ${t}`,
            fnCallback: () => {
                this._formVehiculos(btn, tk, t);
            }
        });
    }
    
    formNewVehiculo(btn, tk) {
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
                this.getListBoxs(this._idFormNewVehiculo);
            }
        });
    } 
    
    formEditVehiculo(btn, id, tk){
        this._keyVehiculo = id;
        this.send({
            element: btn,
            gifProcess: true,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
                this._findVehiculo(tk);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate();
            }
        });
    }

    postNewVehiculo(tk) {
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._idFormNewVehiculo,
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: this._key});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    Tools.refreshGrid(this._idGridVh);
                    Tools.closeModal(this._idFormNewVehiculo);
                }
            }
        });
    }
    
    postEditVehiculo(tk) {
        this.send({
            flag: 2,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
            context: this,
            form: this._idFormEditVehiculo,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyVehiculo', value: this._keyVehiculo});
                sData.push({name: '_key', value: this._key});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    Tools.refreshGrid(this._idGridVh);
                    Tools.closeModal(this._idFormEditVehiculo);
                }
            }
        });
    }
    
};