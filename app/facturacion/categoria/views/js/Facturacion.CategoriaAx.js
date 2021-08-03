/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 18:09:57 
 * Descripcion : CategoriaAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.CategoriaAx = class CategoriaAx extends $$.Facturacion.CategoriaRsc {

    constructor() {
        super();
        this._controller = 'categoria:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.CategoriaTour;
        this._gridCat = null;
        this._formNew = `#${this._alias}formNew`;
        this._formEdit = `#${this._alias}formEdit`;
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
                        event: 'Obj.Facturacion.CategoriaAx.formNew'
                    }],
                pOrderField: 'categoria asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.descripcion, field: 'categoria', width: 550, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.estado, field: 'activo', width: 80, class: "text-center", sortable: true, filter: {type: 'text'},
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
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.Facturacion.CategoriaAx.formEdit",
                                        serverParams: "id_categoria"
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Facturacion.CategoriaAx.postDelete",
                                        serverParams: "id_categoria"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridCat = o.oTable;
                }
            });
        };

        this._findCategoria = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.setCategoria(data);
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
                        Tools.refreshGrid(this._gridCat);

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
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormNew();
                setTimeout(() => {
                    $(`#${this._alias}txt_descripcion`).focus();
                }, 300);
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
                this._findCategoria(tk);
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
            form: this._formNew,
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    if ($('._categoria').length > 0) {//recargar en lst
                        Tools.addOption('._categoria', data);
                    }
                    if ($(`#${this._gridCat}`).length > 0) {
                        Tools.refreshGrid(this._gridCat);
                    }
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
                sData.push({name: '_key', value: this._key});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    this._key = null;
                    Tools.refreshGrid(this._gridCat);
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

};