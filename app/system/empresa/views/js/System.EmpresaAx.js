"use strict";
$$.System.EmpresaAx = class EmpresaAx extends $$.System.EmpresaRsc {

    constructor() {
        super();
        this._controller = 'empresa:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._keyBoton = null;
        this._idFormIndex = `#${this._alias}formIndex`;
        this._idFormNew = `#${this._alias}formNew`;
        this._idFormEdit = `#${this._alias}formEdit`;
        this._tour = Obj.System.EmpresaTour;
        this._idGrid = null;
        this._keyCuenta = null;

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
                    this.addBtnExaminar(tk);
                    this.addBtnSave();
                    this._findEmpresa(tk);
                    this.evtWrite(tk);
                    this._getParams(tk);
                    this._gridCuentas(tk);
//                    Tools.addTourMain.call(this);
                }
            });
        };
        
        this._gridCuentas = (tk) => {
            $(`#${this._alias}grid_cuenta`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                        button: APP_BTN.NEW,
                        event: 'Obj.System.EmpresaAx.formNew'
                    }],
                pOrderField: 'banco asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET._161, field: 'banco', width: 450, sortable: true},
                    {title: APP_ETIQUET._069, field: 'cuenta_banco', width: 450, sortable: true},
                    {title: APP_ETIQUET._005, field: 'tipo_moneda', width: 450, sortable: true},
                    {title: APP_ETIQUET._162, field: 'tipo_cuenta_banco', width: 450, sortable: true},
                    {title: APP_ETIQUET.estado, field: 'activo', width: 80, class: "text-center", sortable: true,
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
                                        fn: "Obj.System.EmpresaAx.formEdit",
                                        serverParams: "id_cliente_cuenta"
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.System.EmpresaAx.postDelete",
                                        serverParams: "id_cliente_cuenta"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGrid = o.oTable;
                }
            });
        };

        this._findEmpresa = (tk) => {
            this.send({
                token: tk,
                context: this,
                response: (data) => {
                    this.setData(data);
                }
            });
        };
        
        this._findCuenta = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyCuenta', value: this._keyCuenta});
                },
                response: (data) => {
                    this.setCuenta(data);
                }
            });
        };

        this._getParams = (tk) => {
            this.send({
                token: tk,
                context: this,
                response: (data) => {
                    this.setParams(data);
                }
            });
        };

        this._postChangeLogo = (tk, input) => {
            this._tieneEntrega = 1;//una vez que graba el primer documento, el exp ya cuenta con una entrega en la db
            input.upload({
                token: tk,
                url: 'system/empresa/postUpload',
                data: {
                    _alias: this._alias
                },
                sizeLimit: 5000, 
                success: (data) => {
                    if (data.result == 1) {
                        Tools.notify().ok({
                            content: APP_MSN.upload_ok
                        });
                        $(`#${this._alias}d_img_logo`).html(`<img src="public/img/${data.archivo}" style="width: 100%" />`);
                        store.set('LOGO', `public/img/${data.archivo}`);
                    } else {
                        Tools.notify().error({
                            content: data.result
                        });
                    }
                }
            });
        };

        this._postParam = (tk, c, v) => {
            this.send({
                token: tk,
                gifProcess: true,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_codigo', value: c});
                    sData.push({name: '_valor', value: v});
                },
                response: (data) => {
                    if (data.result == 1) {
                        Tools.notify().ok({
                            content: APP_MSN.save_ok
                        });
                        if (['TIK', 'PDF'].includes(v)) {
                            store.set('FORMATO_VENTA', v);
                            this.activeTicketDeign(v);
                        }
                    }
                }
            });
        };

        this._postEmpresa = (tk, el) => {
            this.send({
                token: tk,
                gifProcess: true,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_field', value: el.data('field')});
                    sData.push({name: '_dato', value: el.val()});
                },
                response: (data) => {
                    if (data.result == 1) {
                        Tools.notify().ok({
                            content: APP_MSN.save_ok
                        });
                        el.parent().addClass('hide');
                        el.parent().parent().find('._view').removeClass('hide');
                        el.parent().parent().find('._view').find('span').html(el.val());
                    }
                }
            });
        };

        this._postUbigeo = (tk, ubi) => {
            let el = $(`#${this._alias}d_ubi`);
            this.send({
                token: tk,
                gifProcess: true,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_field', value: 'ubigeo_codigo'});
                    sData.push({name: '_dato', value: ubi});
                },
                response: (data) => {
                    if (data.rs.result == 1) {
                        Tools.notify().ok({
                            content: APP_MSN.save_ok
                        });
                        el.parent().addClass('hide');
                        el.parent().parent().find('._view').removeClass('hide');
                        el.parent().parent().find('._view').find('span').html(`${data.empresa.departamento} - ${data.empresa.provincia} - ${data.empresa.distrito}`);
                    }
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
                    sData.push({name: '_keyCuenta', value: id});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    if (data.ok_error != 'error') {
                        Tools.refreshGrid(this._idGrid);
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

    examinar(btn, tk) {
        $(`#${this._alias}file_logo`).click();
    }

    postSaveTicket(btn, tk) {
        let a = $(`#${this._alias}txt_width`).val();
        
        if ($.isEmptyObject(a)) {
            Tools.notify().alert({
                content: APP_MSN._050
            });
            return false;
        }

        this.send({
            token: tk,
            element: btn,
            context: this,
            serverParams: (sData, obj) => {
                sData.push({name: '_width_ticket', value: a});
                sData.push({name: '_pie_ticket', value: $(`#${this._alias}txt_pie_ticket`).val()});
            },
            response: (data) => {
                if (data.result == 1) {
                    Tools.notify().ok({
                        content: APP_MSN.save_ok
                    });
                }
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
                $(this._dmain).append(data);
            },
            finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormNew();
                this.getListBoxs(this._idFormNew);
            }
        });
    }
    
    formEdit(btn, id, tk) {
        this._keyCuenta = id;
        this.send({
            element: btn,
            gifProcess: true,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            response: (data) => {
                $(this._dmain).append(data);
                this._findCuenta(tk);
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
            form: this._idFormNew,
            success: (obj) => {
                Tools.execMessage(obj.data);
                if (obj.data.ok_error != 'error') {
                    Tools.refreshGrid(this._idGrid);
                    Tools.closeModal(this._idFormNew);
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
            form: this._idFormEdit,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyCuenta', value: this._keyCuenta});
            },
            success: (obj) => {
                Tools.execMessage(obj.data);
                if (obj.data.ok_error != 'error') {
                    this._keyCuenta = null;
                    Tools.refreshGrid(this._idGrid);
                    Tools.closeModal(this._idFormEdit);
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