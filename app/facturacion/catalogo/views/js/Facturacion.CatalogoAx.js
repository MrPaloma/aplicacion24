/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 18:09:25 
 * Descripcion : CatalogoAx.js
 * ---------------------------------------
 */
"use strict";

Exe.include([
    {nm: 'facturacion', ob: 'categoria', alias: 'CATE__'},
    {nm: 'facturacion', ob: 'marca', alias: 'MARK__'}
]);

$$.Facturacion.CatalogoAx = class CatalogoAx extends $$.Facturacion.CatalogoRsc {

    constructor() {
        super();
        this._controller = 'catalogo:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.CatalogoTour;
        this._gridCata = null;
        this._formNew = `#${this._alias}formNew`;
        this._formEdit = `#${this._alias}formEdit`;
        this._gridCata = null;

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
                        event: 'Obj.Facturacion.CatalogoAx.formNew'
                    }],
                pOrderField: 'catalogo asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.codigo_interno, field: 'codigo_interno', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.codigo_barra, field: 'codigo_barra', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.codigo_referencia, field: 'codigo_referencia', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.descripcion, field: 'catalogo', width: 300, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.tipo, field: 'tipo', width: 100, sortable: true, filter: {
                            type: "select",
                            dataClient: [{etiqueta: APP_ETIQUET.bien, value: "B"}, {etiqueta: APP_ETIQUET.servicio, value: "S"}],
                            options: {label: "etiqueta", value: "value"}
                        }},
                        
                    {title: APP_ETIQUET._116, field: 'marca', width: 150, sortable: true, filter: {type: 'text'}},
                    
                    {title: APP_ETIQUET.categoria, field: 'categoria', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.u_medida, field: 'unidad_medida', width: 150, sortable: true, filter: {type: 'text'}},
                    
                    {title: APP_ETIQUET.ubicacion, field: 'ubicacion', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.caja, field: 'nxcaja', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._058, field: 'precio_venta_cigv', class: "text-right", width: 80, sortable: true, filter: {type: 'text'}},
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
                                        fn: "Obj.Facturacion.CatalogoAx.formEdit",
                                        serverParams: "id_catalogo"
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Facturacion.CatalogoAx.postDelete",
                                        serverParams: "id_catalogo"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridCata = o.oTable;
                }
            });
        };

        this._findCatalogo = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.setCatalogo(data);
                    this.getListBoxs(this._formEdit, data);
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
                        Tools.refreshGrid(this._gridCata);
                    }
                }
            });
        };


        this._getRandomInt = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
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
                console.log(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormNew();
                this.addButtonsFormNewCat();

                this.getListBoxs(this._formNew);
                setTimeout(() => {
                    $(`#${this._alias}txt_descripcion`).focus();
                }, 300);

                // var number = this._getRandomInt(100000,999999);
                // $(`#${this._alias}txt_codinterno`).val(number);
                
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
                this._findCatalogo(tk);
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
                    Tools.refreshGrid(this._gridCata);
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
                    Tools.refreshGrid(this._gridCata);
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