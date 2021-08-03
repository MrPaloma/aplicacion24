/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super  User  
 * Fecha:        07-02-2019 16:02:26 
 * Descripcion : MovimientoAlmacenAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.MovimientoAlmacenAx = class MovimientoAlmacenAx extends $$.Facturacion.MovimientoAlmacenRsc {

    constructor() {
        super();
        this._controller = 'movimientoAlmacen:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.MovimientoAlmacenTour;
        this._idGrid = null;
        this._idFormNew = `#${this._alias}formNew`;
        this._idFormDetalle = `#${this._alias}formDetalle`;

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
                        event: 'Obj.Facturacion.MovimientoAlmacenAx.formNew'
                    }],
                pOrderField: 'fecha desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET._216, field: 'origen', width: 200, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._217, field: 'destino', width: 200, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._003, field: 'fecha', width: 100, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._220, field: 'num_producto', width: 70, class: "text-center", sortable: true, filter: {type: 'text'}}
                ],
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.SED,
                                    ajax: {
                                        fn: "Obj.Facturacion.MovimientoAlmacenAx.formDetalle",
                                        serverParams: ["id_movimiento_almacen"]
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGrid = o.oTable;
                }
            });
        };

        this._getDetalle = (tk, id) => {
            this.send({
                token: tk,
                context: this,
                form: this._idFormIndex,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: id});
                },
                response: (data) => {
                    this.setDetalle(data);
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
                this._evtAutocomplete(tk);
                Tools.todayDate(`#${this._alias}txt_fecha`);
            }
        });
    }

    formDetalle(btn, id, tk) {
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
                this.addButtonsPrint();
                this._getDetalle(tk, id);
            }
        });
    }

    postMovimiento(tk) {
        if ($(`#${this._alias}d_productos`).find('._cantidad').length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._029
            });
            return false;
        }
        if (!this._validaCantidad()) {
            return false;
        }
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

    printDetalle(btn, tk) {
        let container = $(`#${this._alias}d_movi`);

        Tools.printArea({
            area: container,
            overrideElementCSS: [
                'public/theme/default/css/bootstrap.min.css',
                'public/theme/default/css/smartadmin-production.min.css'
            ]
        });
    }

};