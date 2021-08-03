/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Adm  
 * Fecha:        01-02-2019 06:02:44 
 * Descripcion : CajaChicaAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.CajaChicaAx = class CajaChicaAx extends $$.Facturacion.CajaChicaRsc {

    constructor() {
        super();
        this._controller = 'cajaChica:';
        this._alias = Exe.getAlias();
        this._gridV = null;
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.CajaChicaTour;
        this._idFormIndex = `#${this._alias}formIndex`;
        this._idFormIngreso = `#${this._alias}formIngreso`;
        this._idFormEgreso = `#${this._alias}formEgreso`;

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
                    this.addBtns();
                    this._getChekOpenCaja(tk);
                    Tools.todayDate(`#${this._alias}txt_fecha_in`);
                    Tools.todayDate(`#${this._alias}txt_fecha_e`);
                    this._gridi(tk);
                    this._gride(tk);

                }
            });
        };

        this._gridi = (tk) => {
            $(`#${this._alias}CJAp1`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                    button: APP_BTN.NEW,
                    event: 'Obj.Facturacion.CajaChicaAx.formIngreso'
                }],
                pOrderField: 'fecha desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET._003, field: 'fecha', width: 100, class: "text-center", sortable: true, filter: {type: 'date'}},
                    {title: APP_ETIQUET.razon_social, field: 'concepto', width: 300, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._017, field: 'importe', width: 100, class: "text-right", sortable: true, filter: {type: 'text'}},   
                ],
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                fnCallback: (o) => {
                    this._gridV = o.oTable;
                }
            });
        };

        this._gride = (tk) => {
            $(`#${this._alias}CJAp2`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                    button: APP_BTN.NEW,
                    event: 'Obj.Facturacion.CajaChicaAx.formEgreso'
                }],
                pOrderField: 'fecha desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET._003, field: 'fecha', width: 100, class: "text-center", sortable: true, filter: {type: 'date'}},
                    {title: APP_ETIQUET.razon_social, field: 'concepto', width: 300, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._017, field: 'importe', width: 100, class: "text-right", sortable: true, filter: {type: 'text'}},   
                ],
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                fnCallback: (o) => {
                    this._gridV = o.oTable;
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
                    } else {
                        store.set('ID_CAJA', null);
                    }
                }
            });
        };

        this._postEgreso = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
                context: this,
                form: this._idFormEgreso,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_tipo', value: 'E'});
                    sData.push({name: '_tipo_e', value: $(`input[name='${this._alias}rd_egreso']:checked`).val()})
                    sData.push({name: '_personal', value: $(`#${this._alias}lst_personal`).val()});

                    sData.push({name: '_fecha', value: $(`#${this._alias}txt_fecha_e`).val()});
                    sData.push({name: '_importe', value: $(`#${this._alias}txt_importe_e`).val()});
                    sData.push({name: '_concepto', value: $(`#${this._alias}txt_concepto_e`).val()});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error != 'error') {
                        this._clearCaja();
                        Tools.refreshGrid(this._gridV);
                        Tools.closeModal(this._idFormEgreso);
                    }
                }
            });
        };

        

        this._postIngreso = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
                context: this,
                form: this._idFormIngreso,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_tipo', value: 'I'});
                    sData.push({name: '_fecha', value: $(`#${this._alias}txt_fecha_in`).val()});
                    sData.push({name: '_importe', value: $(`#${this._alias}txt_importe_in`).val()});
                    sData.push({name: '_concepto', value: $(`#${this._alias}txt_concepto_in`).val()});

                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error != 'error') {
                        this._clearCaja();
                        Tools.refreshGrid(this._gridV);
                        Tools.closeModal(this._idFormIngreso);
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

    postIngreso(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }

        if ($.isEmptyObject($(`#${this._alias}txt_fecha_in`).val())) {
            Tools.notify().smallMsn({
                content: APP_MSN._062
            });
            return false;
        }
        if (!$.isNumeric($(`#${this._alias}txt_importe_in`).val())) {
            Tools.notify().smallMsn({
                content: APP_MSN._063
            });
            return false;
        }
        if ($.isEmptyObject($(`#${this._alias}txt_concepto_in`).val())) {
            Tools.notify().smallMsn({
                content: APP_MSN._064
            });
            return false;
        }

        Tools.notify().confirm({
            content: APP_MSN._065,
            yes: () => {
                this._postIngreso(tk);
            }
        });
    }

    postEgreso(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().alert({
                content: APP_MSN._053
            });
            return false;
        }
        if ($.isEmptyObject($(`#${this._alias}txt_fecha_e`).val())) {
            Tools.notify().smallMsn({
                content: APP_MSN._062
            });
            return false;
        }
        if (!$.isNumeric($(`#${this._alias}txt_importe_e`).val())) {
            Tools.notify().smallMsn({
                content: APP_MSN._063
            });
            return false;
        }
        if ($.isEmptyObject($(`#${this._alias}txt_concepto_e`).val())) {
            Tools.notify().smallMsn({
                content: APP_MSN._064
            });
            return false;
        }

        Tools.notify().confirm({
            content: APP_MSN._065,
            yes: () => {
                this._postEgreso(tk);
            }
        });
    }

    formEgreso(btn, tk) {
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
                this.addButtonsFormEgreso();
                this.getListBoxs(this._idFormEgreso);
                
            }
        });
    }

    formIngreso(btn, tk) {
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
                this.addButtonsFormIngreso();
            }
        });
    }

};