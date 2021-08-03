/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 17:09:36 
 * Descripcion : ClienteAx.js
 * ---------------------------------------
 */
"use strict";
$$.Facturacion.ClienteAx = class ClienteAx extends $$.Facturacion.ClienteRsc {

    constructor() {
        super();
        this._controller = 'cliente:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.ClienteTour;
        this._gridEntidad = null;
        this._formNew = `#${this._alias}formNew`;
        this._formEdit = `#${this._alias}formEdit`;
        this._key = null;
        this._idUbigeo = null;
        const token = "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9ybGFuZG8ubmNhbGx1cGVAZ21haWwuY29tIn0.2fbHSjhs-WRSmFGEUYsP9t-6hdJWUn9OWOWkGxUAMaA";
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
                        event: 'Obj.Facturacion.ClienteAx.formNew'
                    }],
                pOrderField: 'razon_social asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.tipo_doc, field: 'abreviatura', width: 100, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.num_doc, field: 'documento_identidad', width: 100, class: "text-center", sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.razon_social, field: 'razon_social', width: 300, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.celular, field: 'celular', width: 100, class: "text-center", sortable: true, filter: {type: 'text'}},
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
                                        fn: "Obj.Facturacion.ClienteAx.formEdit",
                                        serverParams: "id_entidad"
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Facturacion.ClienteAx.postDelete",
                                        serverParams: "id_entidad"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridEntidad = o.oTable;
                }
            });
        };
        this._findCliente = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.setCliente(data);
                    this.getListBoxs(this._formEdit, data);
                }
            });
        };

        this._extraerDahtaEsSalud = (btn, tk, doc) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_numDoc', value: doc});
                },
                response: (data) => {
                    if (data.success) {
                        this._setDataEsSalud(data.result);
                    } else {
                        Tools.notify().smallMsn({
                            content: APP_MSN._042
                        });
                        $(`#${this._alias}txt_razon_social`).val('');
                    }
                }
            });
        };


        
        this._extraerDahtaSunaht = (btn, tk, doc) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_numDoc', value: doc});
                },
                response: (data) => {
                    if (data.success) {
                        this._setDataSunat(data.result);
                    } else {
                        Tools.notify().smallMsn({
                            content: APP_MSN._042
                        });
                        $(`#${this._alias}txt_razon_social`).val('');
                    }
                }
            });
        };

        this._extraerDataDNI = async (doc) => {

            try {
                const rePost = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${doc}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9ybGFuZG8ubmNhbGx1cGVAZ21haWwuY29tIn0.2fbHSjhs-WRSmFGEUYsP9t-6hdJWUn9OWOWkGxUAMaA`)
                const data = await rePost.json()
                if (data.success === false) {
                    Tools.notify().smallMsn({
                        content: data.message
                    });
                } else {
                    let razon_social = data.nombres + " " + data.apellidoPaterno + " " + data.apellidoMaterno;
                    $(`#${this._alias}txt_razon_social`).val(razon_social);
                }
            } catch (error) {
                Tools.notify().smallMsn({
                    content: error
                });
            } 

        }

        this._extraerDataRUC = (doc) => {
            let path = 'https://dniruc.apisperu.com/api/v1/ruc/' + doc + token;

            fetch(path)
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    Tools.notify().smallMsn({
                        content: data.message
                    });
                } else {
                    $(`#${this._alias}txt_razon_social`).val(data.razonSocial);
                    $(`#${this._alias}txt_direccion_fiscal`).val(data.direccion);
                }
            }).catch(function(e) {
                Tools.notify().smallMsn({
                    content: e
                });
            });
        }

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
                    if (data.ok_error != 'error') {
                        Tools.refreshGrid(this._gridEntidad);
                        Tools.execMessage(data);
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
                this.getListBoxs(this._formNew);
                this.setUbigeo();
                Tools.noSubmit(this._formNew);
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
                this._findCliente(tk);
                Tools.noSubmit(this._formEdit);
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
            serverParams: (sData, obj) => {
                sData.push({name: '_ubigeo', value: this._idUbigeo});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    if ($('._cliente').length > 0) {//recargar en lst
                        Tools.addOption('._cliente', data, () => {
                            $('._cliente').val(data.id);
                            $('._cliente').trigger("chosen:updated");
                            $('._cliente').change();
                        });
                    }
                    if ($(`#${this._gridEntidad}`).length > 0) {
                        Tools.refreshGrid(this._gridEntidad);
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
                sData.push({name: '_ubigeo', value: this._idUbigeo});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    this._key = null;
                    Tools.refreshGrid(this._gridEntidad);
                    Tools.closeModal(this._formEdit);
                }
            }
        });
    }

    extraerDahtos(btn, tk) {
        let tdoc = $(`#${this._alias}lst_tipo_doc`).val();
        let doc = $(`#${this._alias}txt_num_doc`);

        if (tdoc.length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._036
            });
            return false;
        }

        if (doc.val().length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._037
            });
            doc.focus();
            return false;
        }
        switch (parseInt(tdoc)) {
            case 1:
                if (!$.isNumeric(doc.val())) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._041
                    });
                    doc.focus();
                    return false;
                }
                if (doc.val().length != 8) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._038
                    });
                    doc.focus();
                    return false;
                }

                $(`#${this._alias}txt_razon_social`).val("");
                $(`#${this._alias}txt_direccion_fiscal`).val("");

                this._extraerDataDNI(doc.val());
                break;
            case 6:
                if (!$.isNumeric(doc.val())) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._041
                    });
                    doc.focus();
                    return false;
                }
                if (doc.val().length != 11) {
                    Tools.notify().smallMsn({
                        content: APP_MSN._039
                    });
                    doc.focus();
                    return false;
                }
                
                $(`#${this._alias}txt_razon_social`).val("");
                $(`#${this._alias}txt_direccion_fiscal`).val("");

                this._extraerDataRUC(doc.val());
                break;
            default:
                Tools.notify().smallMsn({
                    content: APP_MSN._040
                });
                break;
        }
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