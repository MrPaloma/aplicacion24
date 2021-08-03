/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 20:09:30 
 * Descripcion : VentaAx.js
 * ---------------------------------------
 */
"use strict";

Exe.include([
    {nm: 'facturacion', ob: 'cliente', alias: 'CLI__'},
    {nm: 'facturacion', ob: 'catalogo', alias: 'CATA__'}
]);

$$.Facturacion.VentaAx = class VentaAx extends $$.Facturacion.VentaRsc {

    constructor() {
        super();
        this._controller = 'venta:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.VentaTour;
        this._gridV = null;
        this._idFormNewVenta = `#${this._alias}formNewVenta`;
        this._idFormEditVenta = `#${this._alias}formEditVenta`;
        this._idFormAnular = `#${this._alias}formAnular`;
        this._idFormPDF = `#${this._alias}formPDF`;
        this._idFormTicket = `#${this._alias}formTicket`;
        this._idFormCaja = `#${this._alias}formCaja`;
        this._idFormCloseCashbox = `#${this._alias}formCloseCashbox`;
        this._idFormGuia = `#${this._alias}formGuia`;
        this._idFormEditGuia = `#${this._alias}formEditGuia`;
        this._key = null;
        this._tipoComprobante = null;
        this._numDoc = null;
        this._idSerie = null;
        this._enviadoGuiaSunat = 0;
        this._keyGuia = null;
       
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
        
setTimeout(()=>{

         $('#BCTXT_VENT__NEW').click();
         $('html').addClass('hidden-menu-mobile-lock')
         $('body').addClass('hidden-menu')
         
     },1000)
        
        

        this._grid = (tk) => {
            $(`#${this._alias}grid`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                        button: APP_BTN.NEW,
                        event: 'Obj.Facturacion.VentaAx.formNewVenta'
                    }],
                pOrderField: 'fecha_emision desc',
                pDisplayLength: 10,
                tColumns: [

                    {title: APP_ETIQUET.local, field: 'local', width: 120, sortable: true, filter: {type: 'text'}},
                    
                    {title: APP_ETIQUET._026, field: 'numero_documento', width: 100, class: "text-center", valign: 'middle', sortable: true, filter: {type: 'text'},
                        fnReplace: (fila, row) => {
                            let e = 'label-success';
                            if (row.id_tipo_comprobante == '1') {//factura
                                e = 'label-default';
                            }
                            if (row.id_tipo_comprobante =='2') {//boleta
                                e = 'bg-color-purple';
                            }
                            return `<label class="label ${e}">${row.numero_documento}</label>`;
                        }},
                    
                    {title: APP_ETIQUET.tipo_doc, field: 'tipo_doc_identidad', width: 50, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._027, field: 'documento_identidad', width: 80, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 250, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._003, field: 'fecha_emision', width: 100, class: "text-center", sortable: true, filter: {type: 'date'}},
                    {title: APP_ETIQUET._017, field: 'total_venta', width: 100, class: "text-right", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._029, field: 'respuesta_sunat', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._028, field: 'enviado_sunat', width: 80, class: "text-center", sortable: true,
                        filter: {
                            type: "select",
                            dataClient: [{etiqueta: APP_ETIQUET.e_si, value: "1"}, {etiqueta: APP_ETIQUET.e_no, value: "0"}],
                            options: {label: "etiqueta", value: "value"}
                        },
                        fnReplace: (fila, row) => {
                            let e = `<label class="label label-danger">${APP_ETIQUET.e_no}</label>`;
                            if (row.enviado_sunat == 1) {
                                e = `<label class="label label-success">${APP_ETIQUET.e_si}</label>`;
                            }
                            return e;
                        }},
                    {title: APP_ETIQUET._113, field: 'anulado', width: 80, class: "text-center", sortable: true,
                        filter: {
                            type: "select",
                            dataClient: [{etiqueta: APP_ETIQUET.e_si, value: "1"}, {etiqueta: APP_ETIQUET.e_no, value: "0"}],
                            options: {label: "etiqueta", value: "value"}
                        },
                        fnReplace: (fila, row) => {
                            let e = `<label class="label label-danger">${APP_ETIQUET.e_no}</label>`;
                            if (row.anulado == 1) {
                                e = `<label class="label label-success">${APP_ETIQUET.e_si}</label>`;
                            }
                            return e;
                        }},
                        {title: APP_ETIQUET._264, field: 'vendedor', width: 150, sortable: true, filter: {type: 'text'}},
                ],
                sExport: {
                    buttons: {excel: true},
                    columns: [
                        {title: APP_ETIQUET._026, field: 'numero_documento', width: 30},
                        {title: APP_ETIQUET.tipo_doc, field: 'tipo_doc_identidad', width: 50},
                        {title: APP_ETIQUET._027, field: 'documento_identidad', width: 30},
                        {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 50},
                        {title: APP_ETIQUET._003, field: 'fecha_emision', width: 20},
                        {title: APP_ETIQUET._017, field: 'total_venta', width: 30, type: 'number'}
                    ]
                },
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: this.getAxions()
                        }]
                },
                fnCallback: (o) => {
                    this._gridV = o.oTable;
                }
            });
        };

        this._formNewVenta = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-NWV${APP_CONTAINER_TABS}`).html(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this.addButtons();
                    this.addBtnOpenBox();
                    this.getListBoxs(this._idFormNewVenta);

                    this._getChekOpenCaja(tk);

                    $(this._idFormNewVenta).find('input:text').keypress(function (e) {
                        if (e.keyCode === 13)
                            return false;
                    });

                    $(`#${this._alias}chk_guia`).click((e) => {
                        $(`#${this._alias}_guia_remitente`).hide();
                        if ($(e.currentTarget).is(':checked')) {
                            $(`#${this._alias}_guia_remitente`).show();
                        }
                    });
                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }
                    Tools.maxDate(`#${this._alias}txt_fecha_emision`);
                    Tools.todayDate(`#${this._alias}txt_fecha_vencimiento`);

                    $(`#${this._alias}txt_numero_pedido`).keyup((e) => {
                        if (e.keyCode == 13 && $.isNumeric($(e.currentTarget).val())) {
                            this._getPedido(tk, $(e.currentTarget).val());
                            return false;
                        }
                    });

                    Tools.addTourTab.call(this, `#${this._alias}tool_btn`, () => {
                        this._tour.formNewVenta.call(this);
                    }, 'NWV');

                    setTimeout(() => {
                        this._evts();
                    }, 1500);
                    this._evtVuelto();
                    this._evtTypeChange();
                }
            });
        };

        this._formEditVenta = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-NWV${APP_CONTAINER_TABS}`).html(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this.addButtons();
                    this.addBtnOpenBox();
                    this.getListBoxsEdit(this._idFormEditVenta);

                    this._getChekOpenCaja(tk);
                    this._getVenta(tk);

                    $(this._idFormEditVenta).find('input:text').keypress(function (e) {
                        if (e.keyCode === 13)
                            return false;
                    });

                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }
                    Tools.maxDate(`#${this._alias}txt_fecha_emision`);
                    //Tools.todayDate(`#${this._alias}txt_fecha_vencimiento`);

                    /*$(`#${this._alias}txt_numero_pedido`).keyup((e) => {
                        if (e.keyCode == 13 && $.isNumeric($(e.currentTarget).val())) {
                            this._getPedido(tk, $(e.currentTarget).val());
                            return false;
                        }
                    });*/

                    /*setTimeout(() => {
                        this._evts();
                    }, 1500);*/
                    this._evtVuelto();
                    //this._evtTypeChange();
                }
            });
        };

        this._formGuia = (btn, tk) => {
            this.send({
                element: btn,
                gifProcess: true,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-FG${APP_CONTAINER_TABS}`).html(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._getDataGuia(tk);
                    this.getListBoxsGuia();
                    this.addButtonSaveG();
                    $(this._idFormGuia).find('input:text').keypress(function (e) {
                        if (e.keyCode === 13)
                            return false;
                    });
                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }
                    Tools.todayDate(`#${this._alias}txt_fecha_traslado`);
                    Tools.minDate(`#${this._alias}txt_fecha_traslado`);
                }
            });
        };

        this._formEditGuia = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-FG${APP_CONTAINER_TABS}`).html(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._getDataEditGuia(tk);
                    this.addButtonUpdateG();
                    $(this._idFormGuia).find('input:text').keypress(function (e) {
                        if (e.keyCode === 13)
                            return false;
                    });
                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }
                    //Tools.todayDate(`#${this._alias}txt_fecha_traslado`);
                    Tools.minDate(`#${this._alias}txt_fecha_traslado`);
                }
            });
        };

        this._getDataGuia = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.setDataGuia(this._idFormGuia, data);
                }
            });
        };
        
        this._getVenta = (tk) => {
            this.loadingServer();
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this._setVenta(this._idFormEditVenta, data);
                    this.finishServer();
                }
            });
        };

        this._getDataEditGuia = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.setDataEditGuia(this._idFormEditGuia, data);
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
                        this.setBoxOpened(data.caja);
                    }else{
                        store.set('ID_CAJA', null);
                    }
                }
            });
        };

        this._getNumeroDocActual = (id, el) => {
            this.send({
                token: _tk_,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: id});
                },
                response: (data) => {
                    $(`#${this._alias}${el}`).val(data.numero_actual);
                }
            });
        };

        this._getPedido = (tk, n) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_numPedido', value: n});
                },
                response: (data) => {
                    this.setPedido(data);
                }
            });
        };

        this._getDetailBox = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                },
                response: (data) => {
                    this.setDetailCaja(data);
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

        this._formTicket = (tk, dataDoc, autoPrint = true) => {
            this.send({
                token: tk,
                context: this,
                modal: true,
                dataType: 'text',
                response: (data) => {
                    $(APP_MAIN_MODALS).append(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this.addButtonPrintTk();
                    this.setTicket(dataDoc, autoPrint);
                }
            });
        };

        this._postVenta = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GNC}`,
                context: this,
                form: this._idFormNewVenta,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                },
                response: (data) => {
                    if (data.rs.ok_error == 'ok') {
                        this.clearVenta(this._idFormNewVenta, data);

                        this.addProducto();

                        Tools.notify().ok({
                            content: APP_MSN.operacion_ok
                        });

                        if (data.rs.tipo_formato == 'PDF') {
                            this._formPDF(tk, data);
                        } else if (data.rs.tipo_formato == 'TIK') {
                            this._formTicket(tk, data.file);
                        } else {
                            //si no tiene formato configurado, mostrar aviso
                            Tools.notify().alert({
                                content: APP_ETIQUET._049
                            });
                        }

                        //enviar a la sunat
                        Tools.refreshGrid(this._gridV);
                        $("html, body").animate({scrollTop: 0}, 100);
                    }
                }
            });
        };
        
        this._postEditVenta = (tk) => {
            this.send({
                flag: 2,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GNC}`,
                context: this,
                form: this._idFormEditVenta,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error == 'ok') {
                        Tools.closeTab(`${this._alias}-NWV`);
                        //enviar a la sunat
                        Tools.refreshGrid(this._gridV);
                        $("html, body").animate({scrollTop: 0}, 100);
                    }
                }
            });
        };

        this._postGuia = (tk) => {
            let env = $(`#${this._alias}lst_enviar_sunat`).val();
            this.send({
                flag: 1,
                token: tk,
                element: `${this._idFormGuia} #${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
                context: this,
                form: this._idFormGuia,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});//id_venta
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error == 'ok') {
                        this._key = null;
                        //se cierra para recargar el form editar
                        Tools.closeTab(`${this._alias}-FG`);

                        if (env == 1) {
                            this._sendGuiaSunaht(tk, data);
                        }
                        //this._formPDF(tk, data);
                        $("html, body").animate({scrollTop: 0}, 100);
                    }
                }
            });
        };

        this._postEditGuia = (tk) => {
            let env = $(`#${this._alias}lst_enviar_sunat`).val();
            this.send({
                flag: 2,
                token: tk,
                element: `${this._idFormEditGuia} #${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
                context: this,
                form: this._idFormEditGuia,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyGuia', value: this._keyGuia});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error == 'ok') {
                        this._key = null;
                        //se cierra para recargar el form editar
                        Tools.closeTab(`${this._alias}-FG`);

                        if (env == 1) {
                            this._sendGuiaSunaht(tk, data);
                        }
                        //this._formPDF(tk, data);
                        $("html, body").animate({scrollTop: 0}, 100);
                    }
                }
            });
        };

        this._sendGuiaSunaht = (tk, data) => {
            Tools.notify().myNoty({
                content: `${APP_ETIQUET._032} ${data.num_doc}`
            });

            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyGuia', value: data.id_guia});
                },
                response: (data) => {
                    //enviar a la sunat
                    if (data.response == 'OK') {
                        this.formRespuestaSunahtGuia(tk, data);
                    } else {
                        Tools.notify().alert({
                            title: APP_ETIQUET._029,
                            content: JSON.stringify(data)
                        });
                    }

                    Tools.notify().myNoty().close();
                }
            });
        };

        this._sendDocSunaht = (btn, tk, id) => {
            $(`#${this._alias}p_enviando_sunat`).fadeIn();
            this.send({
                token: tk,
                element: btn,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: id});
                },
                response: (data) => {
                    //enviar a la sunat
                    if (data.response == 'OK') {
                        this.formRespuestaSunaht(tk, data);
                        $(`#${this._alias}p_enviando_sunat`).hide();

                        //this.postRespuestaSunaht(data, data.id_venta, data.ruc,tk);
                        Tools.refreshGrid(this._gridV);
                    } else {
                        Tools.notify().alert({
                            title: APP_ETIQUET._029,
                            content: JSON.stringify(data)
                        });
                        $(`#${this._alias}p_enviando_sunat`).hide();
                    }
                }
            });
        };

        this._postComunicacionBaja = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.ANC}`,
                context: this,
                form: this._idFormAnular,
                serverParams: (sData, obj) => {
                    sData.push({name: '_tipoComprobante', value: this._tipoComprobante});
                    sData.push({name: '_serie', value: this._idSerie});
                    sData.push({name: '_numDoc', value: this._numDoc});
                },
                response: (data) => {
                    if (data.response == 'OK') {
                        this.formRespuestaBajaSunaht(tk, data);
                        $(`#${this._alias}p_baja_sunat`).hide();
                        Tools.refreshGrid(this._gridV);
                    } else if (data.response == 'BOL_NO') {
                        Tools.notify().error({
                            title: APP_ETIQUET._029,
                            content: APP_MSN._032
                        });
                        $(`#${this._alias}p_baja_sunat`).hide();
                    } else {
                        Tools.notify().error({
                            title: APP_ETIQUET._029,
                            content: JSON.stringify(data)
                        });
                        $(`#${this._alias}p_baja_sunat`).hide();
                    }
                }
            });
        };

        this._getNumGuia = (tk, td) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_serie', value: td});
                },
                response: (data) => {
                    $(`#${this._alias}txt_num_doc_g`).val(data.numero);
                }
            });
        };

        this._haveGuide = (btn, tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    Tools.addTab({
                        context: this,
                        id: `${this._alias}-FG`,
                        label: `${APP_ETIQUET._164}: ${this._numDoc}`,
                        fnCallback: () => {
                            if (data.have.total == 0) {
                                this._formGuia(btn, tk);
                            } else {
                                this._keyGuia = data.id_guia;
                                this._formEditGuia(btn, tk);
                            }
                        }
                    });
                }
            });
        };

        this._postDeleteVenta = (btn, tk, id) => {
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
                        Tools.refreshGrid(this._gridV);
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

    formNewVenta(btn, tk) {
        Tools.addTab({
            context: this,
            id: `${this._alias}-NWV`,
            label: APP_ETIQUET._001,
            fnCallback: () => {
                this._formNewVenta(btn, tk);
            }
        });
    }

    formEditVenta(btn, id, num_doc, envioSunat, liquidado, tk) {
        if (envioSunat == 1) {
            Tools.notify().smallMsn({
                content: APP_MSN._057
            });
            return false;
        }
        if (liquidado == 1) {
            Tools.notify().smallMsn({
                content: APP_MSN._059
            });
            return false;
        }
        this._key = id;//id_venta
        Tools.addTab({
            context: this,
            id: `${this._alias}-NWV`,
            label: `${APP_ETIQUET._204}: ${num_doc}`,
            fnCallback: () => {
                this._formEditVenta(btn, tk);
            }
        });
    }

    formGuia(btn, id, num_doc, tk) {
        this._enviadoGuiaSunat = 0;
        this._key = id;//id_venta
        this._numDoc = num_doc;
        this._haveGuide(btn, tk);
    }

    postVenta(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().msn({
                content: APP_MSN._048
            });
            return false;
        }
        if (!this.validaProductos()) {
            return false;
        }
        if (!this.validaTipoCambio()) {
            return false;
        }
       
        this._postVenta(tk);
            
        
    }
    
    postEditVenta(tk) {
        if ($.isEmptyObject(store.get('ID_CAJA'))) {
            Tools.notify().msn({
                content: APP_MSN._048
            });
            return false;
        }
        if (!this.validaProductos()) {
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._008,
            yes: () => {
                this._postEditVenta(tk);
            }
        });
    }

    postGuia(tk) {
        Tools.notify().confirm({
            content: APP_MSN._051,
            yes: () => {
                this._postGuia(tk);
            }
        });
    }

    postEditGuia(tk) {
        if (this._enviadoGuiaSunat == 1) {
            Tools.notify().smallMsn({
                content: APP_MSN._015
            });
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._051,
            yes: () => {
                this._postEditGuia(tk);
            }
        });
    }

    formRespuestaSunahtGuia(tk, rs) {
        this.send({
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                $(`#${this._alias}d_doc`).html(rs.numero_documento);
                $(`#${this._alias}a_pdf`).click((e) => {
                    this._keyGuia = rs.id_guia;
                    this.getPDFGuia($(e.currentTarget), tk);
                });
                $(`#${this._alias}a_xml`).attr('href', `${Tools.getWs().rootDocs}${rs.ruc}/${rs.name_file_sunat}.XML`);
            }
        });
    }

    formRespuestaSunaht(tk, rs) {
        this.send({
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                if (rs.id_tipo_comprobante == 1) {
                    $(`#${this._alias}d_title`).html(APP_ETIQUET._030);
                } else if (rs.id_tipo_comprobante == 2) {
                    $(`#${this._alias}d_title`).html(APP_ETIQUET._031);
                }
                $(`#${this._alias}d_doc`).html(rs.numero_documento);
                $(`#${this._alias}d_monto`).html(rs.total_venta);
                $(`#${this._alias}a_pdf`).click((e) => {
                    this.getPDF($(e.currentTarget), rs.id_venta, 1, tk);
                });
                $(`#${this._alias}a_xml`).attr('href', `${Tools.getWs().rootDocs}${rs.ruc}/${rs.name_file_sunat}.XML`);
            }
        });
    }

    getPDFGuia(btn, tk) {
        this.send({
            element: btn,
            token: tk,
            context: this,
            gifProcess: true,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_keyGuia', value: this._keyGuia});
            },
            response: (data) => {
                this._formPDF(tk, data);
            }
        });
    }

    getPDF(btn, id, envioSunat, tk) {
        this.send({
            element: btn,
            token: tk,
            context: this,
            gifProcess: true,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                this._formPDF(tk, data);
            }
        });
    }

    getTICKET(btn, id, envioSunat, tk) {
        this.send({
            element: btn,
            token: tk,
            context: this,
            gifProcess: true,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                this._formTicket(tk, data, false);
            }
        });
    }

    getPDFBaja(btn, id, tk) {
        this.send({
            element: btn,
            token: tk,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                Tools.forceDownload({
                    path: data.file,
                    name: 'pdfTMP.pdf'
                });
            }
        });
    }

    getXML(btn, id, envioSunat, tk) {
        if (envioSunat == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._016
            });
            return false;
        }
        this.send({
            element: btn,
            token: tk,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                Tools.forceDownload({
                    path: `${Tools.getWs().rootDocs}${data.ruc}/${data.name_file_sunat}.XML`,
                    name: 'xmlTMP.xml'
                });
            }
        });
    }

    getXMLGuia(btn, tk) {
        if (this._enviadoGuiaSunat == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._016
            });
            return false;
        }
        this.send({
            element: btn,
            token: tk,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_keyGuia', value: this._keyGuia});
            },
            response: (data) => {
                Tools.forceDownload({
                    path: `${Tools.getWs().rootDocs}${data.company.ruc}/${data.file.name_file_sunat}.XML`,
                    name: 'xmlTMP.xml'
                });
            }
        });
    }

    getCDR(btn, id, envioSunat, tk) {
        if (envioSunat == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._016
            });
            return false;
        }
        this.send({
            element: btn,
            token: tk,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                Tools.forceDownload({
                    path: `${Tools.getWs().rootDocs}${data.ruc}/R-${data.name_file_sunat}.XML`,
                    name: 'cdrTMP.xml'
                });
            }
        });
    }

    sendCliente(btn, id, envioSunat, tk) {
        if (envioSunat == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._016
            });
            return false;
        }
        this.send({
            element: btn,
            token: tk,
            context: this,
            gifProcess: true,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                if (data.ok_error == 'ok') {
                    Tools.notify().ok({
                        content: APP_MSN._013
                    });
                } else if (data.ok_error == 'error') {
                    Tools.notify().ok({
                        content: APP_MSN.comuniquese
                    });
                } else if (data.ok_error == 'nomail') {
                    Tools.notify().alert({
                        content: APP_MSN._043
                    });
                }
            }
        });
    }

    formAnular(...prm) {
        let btn = prm[0], id = prm[1], envioSunat = prm[2], anulado = prm[3], numero_documento = prm[4],
                dias_transcurridos = prm[5], dias_habiles = prm[6], id_tipo_comprobante = prm[7],
                id_serie = prm[8], num_doc = prm[9], tiene_pago = prm[10], tk = prm[11];

        if (envioSunat == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._016
            });
            return false;
        }
        if (tiene_pago > 0) {
            Tools.notify().alert({
                content: APP_MSN._028
            });
            return false;
        }
        if (anulado == 1) {
            Tools.notify().alert({
                content: APP_MSN._021
            });
            return false;
        }
        if (dias_transcurridos > dias_habiles) {
            Tools.notify().alert({
                content: APP_MSN._026
            });
            return false;
        }
        this._key = id;
        this._tipoComprobante = id_tipo_comprobante;
        this._idSerie = id_serie;
        this._numDoc = num_doc;
        this.send({
            element: btn,
            token: tk,
            gifProcess: true,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonAnular();
                $(`#${this._alias}d_doc`).html(numero_documento);
                $(`#${this._alias}sp_baja_doc`).html(numero_documento);
            }
        });

    }

    postBaja(tk) {
        Tools.notify().confirm({
            content: APP_MSN._008,
            yes: () => {
                this._postComunicacionBaja(tk);
            }
        });
    }

    formRespuestaBajaSunaht(tk, rs) {
        this.send({
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(APP_MAIN_MODALS).append(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                Tools.closeModal(this._idFormAnular);
                $(`#${this._alias}a_pdf`).click((e) => {
                    this.getPDFBaja($(e.currentTarget), rs.id_baja, tk);
                });
                $(`#${this._alias}a_xml`).attr('href', `${Tools.getWs().rootDocs}${rs.ruc}/${rs.name_file_sunat}.XML`);
                $(`#${this._alias}d_doc_a`).html(rs.numero_documento);
            }
        });
    }

    formCaja(btn, tk) {
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
                this.addButtonSave();
                this.getLstCajas(this._idFormCaja);
            }
        });
    }

    formDetalle(btn, tk) {
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
                this._getDetailBox(tk);
                this.addButtonPrint();
            }
        });
    }

    formCloseCashbox(btn, tk) {
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
                this.addButtonSave();
                this._getDetailBox(tk);
            }
        });
    }

    postOpenCaja(tk) {
        this.send({
            token: tk,
            context: this,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            serverParams: (sData, obj) => {
                sData.push({name: '_idLocalCaja', value: $(`#${this._alias}lst_caja`).val()});
                sData.push({name: '_importe', value: $(`#${this._alias}txt_importe`).val()});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    store.set('ID_CAJA', $(`#${this._alias}lst_caja`).val());
                    Tools.closeModal(this._idFormCaja);
                    //aqui quitar el boton APERTURAR
                    this.setBoxOpened($(`#${this._alias}lst_caja option:selected`).text());
                }
            }
        });
    }

    sendDocSunaht(btn, id, envioSunat, numeroDocumento, tk) {
        if (numeroDocumento.substr(0, 1) == 'N') {
            Tools.notify().smallMsn({
                content: APP_MSN._056
            });
            return false;
        }
        if (envioSunat == 1) {
            Tools.notify().smallMsn({
                content: APP_MSN._015
            });
        } else {
            Tools.notify().confirm({
                content: APP_MSN._014,
                yes: () => {
                    this._sendDocSunaht(btn, tk, id);
                    $(`#${this._alias}sp_num_doc`).html(numeroDocumento);
                    $("html, body").animate({scrollTop: 0}, 100);
                }
            });
        }
    }

    postCloseCaja(tk) {
        this.send({
            token: tk,
            context: this,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            form: this._idFormCloseCashbox,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyLocalCaja', value: store.get('ID_CAJA')});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    store.set('ID_CAJA', null);
                    Tools.closeModal(this._idFormCloseCashbox);
                    //aqui quitar el boton APERTURAR
                    this.setBoxClosed();
                }
            }
        });
    }

    postDeleteVenta(btn, id, envioSunat, liquidado, tk) {
        if (envioSunat == 1) {
            Tools.notify().smallMsn({
                content: APP_MSN._057
            });
            return false;
        }
        if (liquidado == 1) {
            Tools.notify().smallMsn({
                content: APP_MSN._058
            });
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN.you_sure_delete,
            yes: () => {
                this._postDeleteVenta(btn, tk, id);
            }
        });
    }

    addItem(btn, tk) {
        this.addProducto();
    }

    printDetalleCaja(btn, tk) {
        Tools.printArea({
            area: `#${this._alias}d_detail`,
            overrideElementCSS: [
                'public/theme/default/css/bootstrap.min.css',
                'public/theme/default/css/smartadmin-production.min.css'
            ],
            css: '.liquidar{padding: 30px}'
        });
    }

    printTicket(btn, tk) {
        Tools.printTicket({
            area: `#${this._alias}d_ticket`,
            overrideElementCSS: [
                'public/css/generic.css'
            ],
            css: 'table{font-size: 12px} .text-center{text-align:center} .text-right{text-align:right}'
        });
    }

    closeGuia(btn, tk) {
        Tools.closeTab(`${this._alias}-FG`);
    }

};