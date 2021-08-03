"use strict";
Exe.include([
    {nm: 'facturacion', ob: 'local', alias: 'LOC__'}
]);
$$.System.UsuarioAx = class UsuarioAx extends $$.System.UsuarioRsc {

    constructor() {
        super();
        this._controller = 'usuario:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._keyUsuario = null;
        this._formNew = `#${this._alias}formNew`;
        this._formEdit = `#${this._alias}formEdit`;
        this._idFormSeries = `#${this._alias}formSeries`;
        this._idFormChangePass = `#${this._alias}formChangePass`;
        this._tour = Obj.System.UsuarioTour;
        this._gridUsuario; /*es usado en TOUR*/
        this._idUser = null;

        this._formIndex = (tk) => {
            this.send({
                token: tk,
                context: this,
                dataType: 'text',
                tour: true,
                response: (data) => {
                    $(this._dmain).append(data);
                },
                finally: (obj) => {
                    this._grid(tk);
//                    Tools.addTourMain.call(this);
                }
            });
        };

        this._grid = (tk) => {
            $(`#${this._alias}grid`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                        button: APP_BTN.NEW,
                        event: 'Obj.System.UsuarioAx.formNew'
                    }],
                pOrderField: 'nombre_completo asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.apellidos_nombres, field: 'nombre_completo', width: 300, sortable: true, filter: {type: 'text'}},
              
                    {title: APP_ETIQUET.email, field: 'email', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.celular, field: 'celular', width: 100, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'activo', width: 100, class: "text-center", sortable: true,
                        filter: {
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
                        }
                    }
                ],
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.ASER,
                                    ajax: {
                                        fn: "Obj.System.UsuarioAx.formSeries",
                                        serverParams: ["id_cliente_persona", "nombre_completo"]
                                    }
                                }, {
                                    button: APP_BTN.KCV,
                                    ajax: {
                                        fn: "Obj.System.UsuarioAx.formChangePass",
                                        serverParams: ["id_usuario", "nombre_completo"]
                                    }
                                }, {
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.System.UsuarioAx.formEdit",
                                        serverParams: ["id_cliente_persona", "id_usuario"]
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.System.UsuarioAx.postDelete",
                                        serverParams: "id_cliente_persona"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridUsuario = o.oTable;
                }
            });
        };

        this._findUsuario = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyUsuario', value: this._keyUsuario});
                },
                response: (data) => {
                    this.setUsuario(data);
                    this.getListBoxs(this._formEdit, data.user);
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
                    sData.push({name: '_keyUsuario', value: id});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error != 'error') {
                        Tools.refreshGrid(this._gridUsuario);
                    }
                }
            });
        };

        this._getSeries = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_clientePersona', value: this._keyUsuario});
                },
                response: (data) => {
                    this.setSeries(data);
                }
            });
        };

        this._postRemoveSerie = (btn, tk) => {
            this.send({
                flag: 2,
                token: tk,
                context: this,
                element: btn,
                form: this._idFormSeries,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyUsuario', value: this._keyUsuario});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    this.setSeries(data.series);
                }
            });
        };

        this._getRoles = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyUsuario', value: this._idUser});
                },
                response: (data) => {
                    this.setRoles(data);
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
        this._idUser = null;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormNew();
                this.getListBoxs(this._formNew);
                this._getRoles(tk);
            }
        });
    }

    formEdit(btn, id, isUser, tk) {
        this._keyUsuario = id;
        this._idUser = isUser;
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
            finally: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate();
                this._findUsuario(tk);
                this._getRoles(tk);
            }
        });
    }

    formSeries(btn, id, name, tk) {
        this._keyUsuario = id;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormSeries();
                this._getSeries(tk);
                $(`#${this._alias}d_name`).html(name);
            }
        });
    }
    
    formChangePass(btn, id, name, tk) {
        this._keyUsuario = id;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormNew();
                $(`#${this._alias}d_name`).html(name);
            }
        });
    }

    postNew(tk) {
        if ($(this._formNew).find('._roles').find('input:checkbox:checked').length == 0) {
            Tools.notify().error({
                content: APP_MSN.sel_rol
            });
            return false;
        }
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._formNew,
            response: (data) => {
                if (data.ok_error == 'error') {
                    Tools.execMessage(data);

                } else {
                    Tools.notify().alert({
                        content: APP_MSN._060
                    });
                    Tools.refreshGrid(this._gridUsuario);
                    Tools.closeModal(this._formNew);
                }
            }
        });
    }

    postEdit(tk) {
        if ($(this._formEdit).find('._roles').find('input:checkbox:checked').length == 0) {
            Tools.notify().error({
                content: APP_MSN.sel_rol
            });
            return false;
        }
        this.send({
            flag: 2,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
            context: this,
            form: this._formEdit,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyUsuario', value: this._keyUsuario});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    this._keyUsuario = null;
                    Tools.refreshGrid(this._gridUsuario);
                    Tools.closeModal(this._formEdit);
                    //recargar store.set('ID_LOCAL', row.id_local); con el local editado
                    store.set('ID_LOCAL', $(`#${this._alias}lst_local`).val());
                }
            }
        });
    }
    
    postNewPass(tk){
        this.send({
            flag: 4,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._idFormChangePass,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyUsuario', value: this._keyUsuario});
            },
            response: (data) => {
                if (data.ok_error == 'error') {
                    Tools.execMessage(data);

                } else {
                    Tools.notify().alert({
                        content: APP_MSN.change_pass_ok
                    });
                    this._keyUsuario = null;
                    Tools.closeModal(this._idFormChangePass);
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

    postAddSerie(btn, tk) {
        if ($(this._idFormSeries).find('input:checkbox:checked').length == 0) {
            Tools.notify().error({
                content: APP_MSN.sel_serie
            });
            return false;
        }
        this.send({
            flag: 1,
            token: tk,
            element: btn,
            context: this,
            form: this._idFormSeries,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyUsuario', value: this._keyUsuario});
            },
            response: (data) => {
                Tools.execMessage(data);
                this.setSeries(data.series);
            }
        });
    }

    postRemoveSerie(btn, tk) {
        if ($(this._idFormSeries).find('input:checkbox:checked').length == 0) {
            Tools.notify().confirm({
                content: APP_MSN._007,
                yes: () => {
                    this._postRemoveSerie(btn, tk);
                }
            });
        } else {
            this._postRemoveSerie(btn, tk);
        }
    }

}; 