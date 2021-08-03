"use strict";
$$.System.BotonAx = class BotonAx extends $$.System.BotonRsc {

    constructor() {
        super();
        this._controller = 'boton:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._keyBoton = null;
        this._formNew = `#${this._alias}formNew`;
        this._formEdit = `#${this._alias}formEdit`;
        this._tour = Obj.System.BotonTour;
        this._gridBoton; /*es usado en TOUR*/

        this._formIndex = (tk) => {
            this.send({
                token: tk,
                context: this,
                dataType: 'text',
                tour: true,
                success: (obj) => {
                    $(this._dmain).append(obj.data);
                },
                final: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._grid(tk);
                    Tools.addTourMain.call(this);
                }
            });
        };

        this._grid = (tk) => {
            $(`#${this._alias}grid_boton`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                        button: APP_BTN.NEW,
                        event: 'Obj.System.BotonAx.formNew'
                    }],
                pOrderField: 'nboton asc',
                tRegsLength: [5, 10, 25, 50, 100],
                //tToggleColumn: true,
                pDisplayLength: 10,
                sExport: {
                    buttons: {
                        excel: true,
                        pdf: true
                    }
                },
                /*sCheckbox: {
                 serverValues: ['sexo', 'persona'],
                 clientValues: ['qwerty', $('#txtinput').val()],
                 attrServerValues: ['sexo', 'persona']
                 fnReplace: (i, row) => {
                 return '<input id="_chk_' + i + '" name="_chk[]" type="checkbox" value="' + row.sexo + '" class="chkG"> ..';
                 }
                 },*/
                tColumns: [
                    {title: APP_ETIQUET.nombres, field: 'nboton', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.theme, field: 'css', width: 40, class: "text-center",
                        fnReplace: (fila, row) => {
                            return `<button type="button" class="${row.css}"><i class="${row.icono}"></i></button>`;
                        }},
                    {title: APP_ETIQUET.alias, field: 'alias', width: 80, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'activo', width: 80, class: "text-center", sortable: true, totalizer: true,
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
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.System.BotonAx.formEdit",
                                        serverParams: "id_boton"
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.System.BotonAx.postDelete",
                                        serverParams: "id_boton"
                                    }
                                }/*, {
                                 button: APP_BTN.DEL,
                                 ajax: {
                                 fn: "Obj.System.BotonAx.postDelete",
                                 serverParams: "id_boton"
                                 },
                                 fnReplace: function (i, row) {
                                 return '<i class="fa fa-edit"></i> se manipulo boton en [ul]';
                                 }
                                 }*/]
                        }]
                },
                fnCallback: (o) => {
                    this._gridBoton = o.oTable;
                    //se aumento alto de <td> para que se vea mejor el diseño del boton, esto es cuando se ejecuta el scroll
                    /*setTimeout(() => {
                     $(`#${this._gridBoton}`).find('tbody').find('td').css({
                     height: '44px'
                     });
                     }, 5)*/
                }
            });
        };

        this._findBoton = (tk) => {
            this.send({
                token: tk,
                context: this,
                decodeHtmlEntities: true,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyBoton', value: this._keyBoton});
                },
                success: (obj) => {
                    this.setBoton(obj);
                }
            });
        };

        this._postDelete = (btn, tk, idBtn) => {
            this.send({
                flag: 3,
                token: tk,
                context: this,
                element: btn,
                gifProcess: true,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyBoton', value: idBtn});
                },
                success: (obj) => {
                    Tools.execMessage(data);
                    if (obj.data.ok_error != 'error') {
                        Tools.refreshGrid(this._gridBoton);
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

    formEdit(btn, idBtn, tk) {
        this._keyBoton = idBtn;
        this.send({
            element: btn,
            gifProcess: true,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            success: (obj) => {
                $(this._dmain).append(obj.data);
                this._findBoton(tk);
            },
            final: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate();
                Tools.addTourModal.call(this, `#${this._alias}foot_btns`, () => {
                    this._tour.formNew.call(this);
                });
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
                    Tools.refreshGrid(this._gridBoton);
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
                sData.push({name: '_keyBoton', value: this._keyBoton});
            },
            success: (obj) => {
                Tools.execMessage(obj.data);
                if (obj.data.ok_error != 'error') {
                    this._keyBoton = null;
                    Tools.refreshGrid(this._gridBoton);
                    Tools.closeModal(this._formEdit);
                }
            }
        });
    }

    postDelete(btn, idBtn, tk) {
        Tools.notify().confirm({
            content: APP_MSN.you_sure_delete,
            yes: () => {
                this._postDelete(btn, tk, idBtn);
            }
        });
    }

}; 