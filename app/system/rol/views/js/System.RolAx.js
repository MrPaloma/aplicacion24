"use strict";
$$.System.RolAx = class RolAx extends $$.System.RolRsc {

    constructor() {
        super();
        this._controller = 'rol:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._keyRol = null;
        this._idRolOpcion = null;
        this._formNew = `#${this._alias}formNew`;
        this._formEdit = `#${this._alias}formEdit`;
        this._tour = Obj.System.RolTour;
        this._gridRol; /*es usado en TOUR*/

        this._formIndex = (tk) => {
            this.send({
                token: tk,
                context: this,
                dataType: 'text',
                tour: true,
                success: (obj) => {
                    $(this._dmain).append(obj.data);
                },
                final: (obj) => {
                    this._grid(tk);
                    Tools.addTourMain.call(this);
                }
            });
        };

        this._grid = (tk) => {
            $(`#${this._alias}grid_rol`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                        button: APP_BTN.NEW,
                        event: 'Obj.System.RolAx.formNew'
                    }],
                pOrderField: 'nrol asc',
                pDisplayLength: 10,
                sExport: {
                    buttons: {
                        excel: true
                    }
                },
                tColumns: [
                    {title: APP_ETIQUET.nombres, field: 'nrol', width: 450, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'activo', width: 100, class: "text-center", sortable: true,
                        filter: {
                            type: "select",
                            dataClient: [{etiqueta: "Activo", value: "1"}, {etiqueta: "Inactivo", value: "0"}],
                            options: {label: "etiqueta", value: "value"}
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
                                    button: APP_BTN.PRW,
                                    ajax: {
                                        fn: "Obj.System.RolAx.formView",
                                        serverParams: ["id_rol", "nrol"]
                                    }
                                }, {
                                    button: APP_BTN.ACC,
                                    ajax: {
                                        fn: "Obj.System.RolAx.formAccesos",
                                        serverParams: ["id_rol", "nrol"]
                                    }
                                }, {
                                    button: APP_BTN.DUP,
                                    ajax: {
                                        fn: "Obj.System.RolAx.postClonar",
                                        serverParams: "id_rol"
                                    }
                                }, {
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.System.RolAx.formEdit",
                                        serverParams: "id_rol"
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.System.RolAx.postDelete",
                                        serverParams: "id_rol"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridRol = o.oTable;
                }
            });
        };

        this._findRol = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyRol', value: this._keyRol});
                },
                success: (obj) => {
                    this.setRol(obj);
                }
            });
        };

        this._getAccess = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyRol', value: this._keyRol});
                },
                success: (obj) => {
                    this.setAccess(obj.data);
                }
            });
        };

        this._getAccessPreview = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyRol', value: this._keyRol});
                },
                success: (obj) => {
                    this.setAccessPreview(obj.data);
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
                    sData.push({name: '_keyRol', value: id});
                },
                success: (obj) => {
                    Tools.execMessage(obj.data);
                    if (obj.data.ok_error != 'error') {
                        Tools.refreshGrid(this._gridRol);
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

    formNew(btn, tk) {
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            success: (obj) => {
                $(this._dmain).append(obj.data);
            },
            final: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormNew();
                Tools.tagsInput(obj);
                Tools.addTourModal.call(this, `#${this._alias}foot_btns`, () => {
                    this._tour.formNew.call(this);
                });
            }
        });
    }

    formEdit(btn, id, tk) {
        this._keyRol = id;
        this.send({
            element: btn,
            gifProcess: true,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            success: (obj) => {
                $(this._dmain).append(obj.data);
                this._findRol(tk);
            },
            final: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate();
                Tools.addTourModal.call(this, `#${this._alias}foot_btns`, () => {
                    this._tour.formNew.call(this);
                });
            }
        });
    }

    formAccesos(btn, id, name, tk) {
        this._keyRol = id;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            success: (obj) => {
                $(this._dmain).append(obj.data);
            },
            final: (obj) => {
                Tools.addTourModal.call(this, `#${this._alias}foot_btns`, () => {
                    this._tour.formAccesos.call(this);
                });
                $(`#${this._alias}formAccesos`).find('h4').find('span').html(name);
                this._getAccess(tk);
            }
        });
    }

    formView(btn, id, name, tk) {
        this._keyRol = id;
        this.send({
            element: btn,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            success: (obj) => {
                $(this._dmain).append(obj.data);
            },
            final: (obj) => {
                this.addButtonsFormView();
                Tools.addTourModal.call(this, `#${this._alias}foot_btns`, () => {
                    this._tour.formView.call(this);
                });
                $(`#${this._alias}sp_name_rol`).html(Tools.traslate(name));
                this._getAccessPreview(tk);
            }
        });
    }

    postNew(tk) {
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._formNew,
            success: (obj) => {
                Tools.execMessage(obj.data);
                if (obj.data.ok_error != 'error') {
                    Tools.refreshGrid(this._gridRol);
                    Tools.closeModal(this._formNew);
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
            form: this._formEdit,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyRol', value: this._keyRol});
            },
            success: (obj) => {
                Tools.execMessage(obj.data);
                if (obj.data.ok_error != 'error') {
                    this._keyRol = null;
                    Tools.refreshGrid(this._gridRol);
                    Tools.closeModal(this._formEdit);
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

    postOpcion(opt, tk) {
        this._idRolOpcion = null;
        let idOpcion = $(opt).data('k');
        let flag = ($(opt).is(':checked')) ? 1 : 2;
        let din = $(opt).data('in');
        let btn = $(opt).parent().parent().parent('li').find('button');

        this.send({
            flag: flag,
            token: tk,
            context: this,
            gifProcess: true,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyRol', value: this._keyRol});
                sData.push({name: '_idOpcion', value: idOpcion});
            },
            success: (obj) => {
                if (obj.data.ok_error != 'error') {
                    Tools.execMessage(obj.data);
                    if (flag == 1) {//activar boton CONFIGURACION y agregarle su evento click
                        btn.prop('disabled', false);
                        btn.data('irm', obj.data.id_rolmenu);
                        btn.data('in', din);
                        //agregando eventos a botones habilitados
                        this._addEvtBtnConf.call(this);
                    } else if (flag == 2) {//desactivar boton CONFIGURACION y quitar su evento click
                        btn.prop('disabled', true);
                        btn.removeData('k');
                        btn.off('click');
                        $('.d_evts').html('');//se quita lista de botones
                    }
                }
            }
        });
    }
    
    postClonar(btn, id, tk){
        this.send({
            token: tk,
            context: this,
            gifProcess: true,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyRol', value: id});
            },
            success: (obj) => {
                if (obj.data.ok_error != 'error') {
                    Tools.execMessage(obj.data);
                    Tools.refreshGrid(this._gridRol);
                }
            }
        });
    }

    getEventsOpcion(btn, tk) {
        let indice = $(btn).data('in');
        this._idRolOpcion = $(btn).data('irm');//se carga en memoria para enviarlo al momento de agregar los botones

        this.send({
            token: tk,
            context: this,
            element: btn,
            serverParams: (sData, obj) => {
                sData.push({name: '_idRolOpcion', value: this._idRolOpcion});
            },
            success: (obj) => {
                this.renderEvents.call(this, obj.data, indice);
            }
        });
    }

    postEvent(flag, idBoton, tk) {
        this.send({
            flag: flag,
            token: tk,
            context: this,
            gifProcess: true,
            serverParams: (sData, obj) => {
                sData.push({name: '_idRolOpcion', value: this._idRolOpcion});
                sData.push({name: '_idBoton', value: idBoton});
            },
            success: (obj) => {
                if (obj.data.ok_error != 'error') {
                    Tools.execMessage(obj.data);
                }
            }
        });
    }

    printAccess(btn, tk) {
        Tools.printArea({
            area: `#${this._alias}area_print`,
            css: 'li{display:block !important;}'
        });
    }

}; 