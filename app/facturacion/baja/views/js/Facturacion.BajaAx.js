/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        16-09-2018 17:09:58 
 * Descripcion : BajaAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.BajaAx = class BajaAx extends $$.Facturacion.BajaRsc {

    constructor() {
        super();
        this._controller = 'baja:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.BajaTour;
        this._idGrid = null;
        this._idFormBaja = `#${this._alias}formBaja`;
        this._idFormPDF = `#${this._alias}formPDF`;
        this._idVentaAfectado = null;

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
                        event: 'Obj.Facturacion.BajaAx.formBaja'
                    }],
                pOrderField: 'numero_baja desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.local, field: 'local', width: 120, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._047, field: 'numero_baja', width: 80, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._048, field: 'fecha_anulacion', width: 50, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._027, field: 'documento_afectado', width: 80, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._034, field: 'motivo', width: 250, sortable: true, filter: {type: 'text'}},
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
                        }}
                ],
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.ESNT,
                                    ajax: {
                                        fn: "Obj.Facturacion.BajaAx.sendDocSunaht",
                                        serverParams: ["id_baja", "enviado_sunat", "numero_baja"]
                                    }
                                }, {
                                    button: APP_BTN.PDF,
                                    ajax: {
                                        fn: "Obj.Facturacion.BajaAx.getPDF",
                                        serverParams: ["id_baja", "enviado_sunat"]
                                    }
                                }, {
                                    button: APP_BTN.XML,
                                    ajax: {
                                        fn: "Obj.Facturacion.BajaAx.getXML",
                                        serverParams: ["id_baja", "enviado_sunat"]
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGrid = o.oTable;
                }
            });
        };

        this._getNumeroDocActual = () => {
            this.send({
                token: _tk_,
                context: this,
                response: (data) => {
                    $(`#${this._alias}txt_num_doc_baja`).val(data.numero_actual);
                }
            });
        };

        this._formBaja = (btn, tk) => {
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
                    this._getNumeroDocActual();
                    this.getListBoxs(this._idFormBaja);
                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }
                }
            });
        };

        this._postComunicacionBaja = (tk, tipo_comprobante) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.ANC}`,
                context: this,
                form: this._idFormBaja,
                serverParams: (sData, obj) => {
                    sData.push({name: '_tipoComprobante', value: tipo_comprobante});
                },
                response: (data) => {
                    if (data.response == 'OK') {
                        Tools.closeTab(`${this._alias}-NWV`);
                        this.formRespuestaSunaht(tk, data);
                        Tools.refreshGrid(this._idGrid);
                    } else {
                        Tools.notify().error({
                            title: APP_ETIQUET._029,
                            content: JSON.stringify(data)
                        });
                    }
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
                    $(`#${this._alias}p_enviando_sunat`).hide();
                    if (data.response == 'OK') {
                        this.formRespuestaSunaht(tk, data);
                        Tools.refreshGrid(this._idGrid);
                    } else {
                        Tools.notify().error({
                            title: APP_ETIQUET._029,
                            content: JSON.stringify(data)
                        });
                    }
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

    formBaja(btn, tk) {
        Tools.addTab({
            context: this,
            id: `${this._alias}-NWV`,
            label: APP_ETIQUET._049,
            fnCallback: () => {
                this._formBaja(btn, tk);
            }
        });
    }

    verDocumento(btn, tk) {
        if (!this.validaDoc()) {
            return false;
        }
        this.send({
            element: btn,
            token: tk,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_serie', value: $(`#${this._alias}lst_serie`).val()});
                sData.push({name: '_numDoc', value: $(`#${this._alias}txt_num_doc`).val()});
            },
            response: (data) => {
                Tools.forceDownload({
                    path: data.file,
                    name: 'pdfTMP.pdf'
                });
            }
        });
    }

    postBaja(tk) {
        if($(`#${this._alias}lst_serie`).val() == 11){
            Tools.notify().alert({
                content: APP_MSN._032
            });
            return false;
        }
        if (!this.validaDoc()) {
            return false;
        }

        this.send({
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.ANC}`,
            token: tk,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_serie', value: $(`#${this._alias}lst_serie`).val()});
                sData.push({name: '_numDoc', value: $(`#${this._alias}txt_num_doc`).val()});
            },
            response: (data) => {
                if (data.enviado_sunat == 0) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._024
                    });
                } else if (data.anulado == 1) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._021
                    });
                } else if (data.dias_transcurridos > data.dias_habiles) {
                    Tools.notify().alert({
                        content: APP_MSN._026
                    });
                } else {
                    Tools.notify().confirm({
                        content: APP_MSN._008,
                        yes: () => {
                            this._postComunicacionBaja(tk, data.tipo_comprobante);
                        }
                    });
                }
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
                $(`#${this._alias}d_doc`).html(rs.numero_documento);

                $(`#${this._alias}a_pdf`).click((e) => {
                    this.getPDF($(e.currentTarget), rs.id_baja, null, tk);
                });
                $(`#${this._alias}a_xml`).attr('href', `${Tools.getWs().rootDocs}${rs.ruc}/${rs.name_file_sunat}.XML`);
            }
        });
    }

    sendDocSunaht(btn, id, envioSunat, numeroDocumento, tk) {
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
                }
            });
        }
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
//                Tools.forceDownload({
//                    path: data.file,
//                    name: 'tmpBaja.pdf'
//                });
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
            gifProcess: true,
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

};