/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Adm  
 * Fecha:        30-01-2019 06:01:17 
 * Descripcion : ModificaStockAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.ModificaStockAx = class ModificaStockAx extends $$.Facturacion.ModificaStockRsc {

    constructor() {
        super();
        this._controller = 'modificaStock:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.ModificaStockTour;
        this._idGrid = null;
        this._idFormNew = `#${this._alias}formNew`;
        this._idFormReset = `#${this._alias}formReset`;
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
                        button: APP_BTN.RST,
                        event: 'Obj.Facturacion.ModificaStockAx.formReset' //Resetear stock
                    },{
                        button: APP_BTN.NEW,
                        event: 'Obj.Facturacion.ModificaStockAx.formNew'
                    }],
                pOrderField: 'fecha_ajuste asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.local, field: 'local', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._018, field: 'observacion', width: 350, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._073, field: 'fecha_ajuste', width: 80,class:'text-center', sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.user, field: 'usuario', width: 150, sortable: true, filter: {type: 'text'}}
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
                                        fn: "Obj.Facturacion.ModificaStockAx.formDetalle",
                                        serverParams: "id_ajuste_sotck"
                                    },
                                },{
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Facturacion.ModificaStockAx.postDelete",
                                        serverParams: "id_ajuste_sotck"
                                    },
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGrid = o.oTable;
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
        
        //preview update
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
            }
        });
    }
    
    formReset(btn, tk) {
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
                this.getListBoxs(this._idFormReset);
            }
        });
    }
    
    postReset(tk){
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._idFormReset,
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    Tools.refreshGrid(this._idGrid);
                    Tools.closeModal(this._idFormReset);
                }
            }
        });
    }
    
    postModicacion(tk){
        if($(`#${this._alias}d_productos`).find('._cantidad').length == 0){
            Tools.notify().smallMsn({
                content: APP_MSN._029
            });
            return false;
        }
        if(!this._validaCantidad()){
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
    
    postDelete(btn, id, tk) {
        Tools.notify().confirm({
            content: APP_MSN.you_sure_delete,
            yes: () => {
                this._postDelete(btn, tk, id);
            }
        });
    }
    
    
    //preview update
    
    formDetalle(btn, id, tk) {
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
                this.addButtonsPrint();
                this._getDetalle(tk, id);
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