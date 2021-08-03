/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 17:09:42 
 * Descripcion : NotaCreditoAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.NotaCreditoAx = class NotaCreditoAx extends $$.Facturacion.NotaCreditoRsc {

    constructor() {
        super();
        this._controller = 'notaCredito:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.NotaCreditoTour;
        this._gridNT = null;
        this._idFormNotaCredito = `#${this._alias}formNotaCredito`;
        this._idVentaAfectado = null;
        this._idFormAnular = `#${this._alias}formAnular`;
        this._idFormPDF = `#${this._alias}formPDF`;
        this._key = null;
        this._tipoComprobante = null;
        this._numDoc = null;
        this._idSerie = null;

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
                        event: 'Obj.Facturacion.NotaCreditoAx.formNotaCredito'
                    }],
                pOrderField: 'numero_documento desc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.local, field: 'local', width: 120, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._026, field: 'numero_documento', width: 80, sortable: true, filter: {type: 'text'}},
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
                                        fn: "Obj.Facturacion.NotaCreditoAx.sendDocSunaht",
                                        serverParams: ["id_nota_credito", "enviado_sunat", "numero_documento"]
                                    }
                                }, {
                                    button: APP_BTN.PDF,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaCreditoAx.getPDF",
                                        serverParams: ["id_nota_credito", "enviado_sunat"]
                                    }
                                }, {
                                    button: APP_BTN.XML,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaCreditoAx.getXML",
                                        serverParams: ["id_nota_credito", "enviado_sunat"]
                                    }
                                }, {
                                    button: APP_BTN.CDR,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaCreditoAx.getCDR",
                                        serverParams: ["id_nota_credito", "enviado_sunat"]
                                    }
                                }, {
                                    button: APP_BTN.ENCL,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaCreditoAx.sendCliente",
                                        serverParams: ["id_nota_credito", "enviado_sunat"]
                                    }
                                }, {
                                    button: APP_BTN.ANC,
                                    ajax: {
                                        fn: "Obj.Facturacion.NotaCreditoAx.formAnular",
                                        serverParams: ["id_nota_credito", "enviado_sunat", "anulado", "numero_documento", "dias_transcurridos", "dias_habiles", "id_tipo_comprobante", "id_serie", "num_doc"]
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridNT = o.oTable;
                }
            });
        };

        this._getNumeroDocActual = (id) => {
            this.send({
                token: _tk_,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: id});
                },
                response: (data) => {
                    $(`#${this._alias}txt_num_doc_nc`).val(data.numero_actual);
                }
            });
        };

        this._formNotaCredito = (btn, tk) => {
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
                    this.getListBoxs(this._idFormNotaCredito);
                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }
                }
            });
        };

        this._postNotaCredito = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GNC}`,
                context: this,
                form: this._idFormNotaCredito,
                serverParams: (sData, obj) => {
                    sData.push({name: '_idVentaAfectado', value: this._idVentaAfectado});
                },
                response: (data) => {
                    if (data.rs.ok_error == 'ok') {
                        //enviar a la sunat
                        this._sendDocSunaht(null, tk, data.rs.id_nota_credito);
                        Tools.refreshGrid(this._gridNT);
                        Tools.closeTab(`${this._alias}-NWV`);
                        $(`#${this._alias}sp_num_doc`).html(`${data.head.serie}-${data.head.numero_documento}`);
                        $("html, body").animate({scrollTop: 0}, 100);
                    }
                }
            });
        };

        this._sendDocSunaht = (btn, tk, id) => {
            $("html, body").animate({scrollTop: 0}, 100);
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
                        Tools.refreshGrid(this._gridNT);
                    } else {
                        Tools.notify().error({
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
                        Tools.closeModal(this._idFormAnular);
                        this.formRespuestaBajaSunaht(tk, data);
                        $(`#${this._alias}p_baja_sunat`).hide();
                        Tools.refreshGrid(this._gridNT);
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

    formNotaCredito(btn, tk) {
        Tools.addTab({
            context: this,
            id: `${this._alias}-NWV`,
            label: APP_ETIQUET._033,
            fnCallback: () => {
                this._formNotaCredito(btn, tk);
            }
        });
    }

    getFactura(btn, tk) {
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
                if (data.head.enviado_sunat == 0) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._024
                    });
                } else if (data.head.anulado == 1) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._021
                    });
                } else if (data.head.tiene_nota_credito == 1) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._022 + data.head.num_nota_credito
                    });
                } else {
                    this._idVentaAfectado = data.head.id_venta;
                    this.setDocumento(data);
                }
            }
        });
    }

    verFactura(btn, tk) {
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

    postNotaCredito(tk) {
        if ($(`#${this._alias}tb_detail`).find('input:checkbox:checked').length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._020
            });
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._008,
            yes: () => {
                this._postNotaCredito(tk);
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
                $(`#${this._alias}d_monto`).html(rs.total_venta);

                $(`#${this._alias}a_pdf`).click((e) => {
                    this.getPDF($(e.currentTarget), rs.id_nota_credito, null, tk);
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
            gifProcess: true,
            context: this,
            dataType: 'json',
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: id});
            },
            response: (data) => {
                this._formPDF(tk, data);
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
            gifProcess: true,
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

    formAnular(btn, id, envioSunat, anulado, numero_documento, dias_transcurridos, dias_habiles, id_tipo_comprobante, id_serie, num_doc, tk) {
        if (envioSunat == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._016
            });
            return false;
        }
        if (anulado == 1) {
            Tools.notify().smallMsn({
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
                $(`#${this._alias}d_doc_a`).html(rs.numero_documento);

                $(`#${this._alias}a_pdf`).click((e) => {
                    this.getPDFBaja($(e.currentTarget), rs.id_baja, tk);
                });
                $(`#${this._alias}a_xml`).attr('href', `${Tools.getWs().rootDocs}${rs.ruc}/${rs.name_file_sunat}.XML`);
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

};