/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        10-09-2018 18:09:43 
 * Descripcion : LocalAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.LocalAx = class LocalAx extends $$.Facturacion.LocalRsc {

    constructor() {
        super();
        this._controller = 'local:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.LocalTour;
        this._idUbigeo = null;
        this._gridLocal = null;
        this._formNew = `#${this._alias}formNew`;
        this._formEdit = `#${this._alias}formEdit`;
        this._idFormListaProductos = `#${this._alias}formListaProductos`;
        this._idFormStockInicial = `#${this._alias}formStockInicial`;
        this._idFormCajas = `#${this._alias}formCajas`;
        this._idFormGanancia = `#${this._alias}formGanancia`;
        this._key = null;
        this._idGridProductos = null;
        this._idGridLista = null;

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
                        event: 'Obj.Facturacion.LocalAx.formNew'
                    }],
                    
                pOrderField: 'local asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.local, field: 'local', width: 200, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.direccion, field: 'direccion', width: 400, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.productos, field: 'all_productos', class: "text-center", width: 80, sortable: true, totalizer: true, filter: {type: 'text'}},
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
                                    button: APP_BTN.ASSCB,
                                    ajax: {
                                        fn: "Obj.Facturacion.LocalAx.formCajas",
                                        serverParams: ["id_local", "local"]
                                    }
                                }, {
                                    button: APP_BTN.PRD,
                                    ajax: {
                                        fn: "Obj.Facturacion.LocalAx.formProductos",
                                        serverParams: ["id_local", "local"]
                                    }
                                }, {
                                    button: APP_BTN.EDT,
                                    ajax: {
                                        fn: "Obj.Facturacion.LocalAx.formEdit",
                                        serverParams: "id_local"
                                    }
                                }, {
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Facturacion.LocalAx.postDelete",
                                        serverParams: "id_local"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._gridLocal = o.oTable;
                }
            });
        };

        this._gridProductos = (tk) => {
            $(`#${this._alias}gridProductos`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                tButtons: [{
                        button: APP_BTN.ADD,
                        event: 'Obj.Facturacion.LocalAx.formListaProductos'
                    }/*, {
                     button: APP_BTN.GAN,
                     event: 'Obj.Facturacion.LocalAx.formGanancia'
                     }*/],
                pOrderField: 'catalogo asc',
                pDisplayLength: 10,
                tColumns: [
                    {title: APP_ETIQUET.codigo_interno, field: 'codigo', width: 200, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.producto, field: 'catalogo', width: 200, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._116, field: 'marca', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.categoria, field: 'categoria', width: 150, sortable: true, filter: {type: 'text'}},
                      /*   {title: APP_ETIQUET._101, field: 'aplica_igv', width: 70, class: 'text-center', sortable: true, filter: {type: 'text'},
                      fnReplace: (fila, row) => {
                           let e = `<label class="label label-danger">${row.aplica_igv_txt}</label>`;
                           if (row.aplica_igv == 1) {
                               e = `<label class="label label-success">${row.aplica_igv_txt}</label>`;
                           }
                           return e;
                        }},*/
                    {title: APP_ETIQUET._058, field: 'precio_compra_real', width: 100, class: 'text-right', sortable: true, filter: {type: 'text'}, totalizer: true,
                        fnReplace: (fila, row) => {
                            return `
                            <div class="input">
                                <label">
                                    <input id="${this._alias}${fila}txt_precio_compra_real" name="${this._alias}txt_precio_compra_real[]" class="form-control text-right" data-info="_PCR_" data-k="${row.id_local_producto}" type="text" value="${row.precio_compra_real}" onclick="this.select()">
                                </label>
                            </div>`;
                        }},
                    /*{title: APP_ETIQUET._099, field: 'precio_compra', width: 80, sortable: true, filter: {type: 'text'}, totalizer: true
                     fnReplace: (fila, row) => {
                     return `
                     <div class="input">
                     <label">
                     <input id="${this._alias}${fila}txt_precio_compra" name="${this._alias}txt_precio_compra[]" class="form-control text-right" data-info="_PC_" data-k="${row.id_local_producto}" type="text" value="${row.precio_compra}" onclick="this.select()">
                     </label>
                     </div>`;
                     }},*/
                    
                    // PRECIO DE VENTA PARA EL PUBLICO
                    {title: APP_ETIQUET._287, field: 'ganancia_publico', width: 80, sortable: true, filter: {type: 'text'}, totalizer: true,
                    fnReplace: (fila, row) => {
                        return `
                        <div class="input">
                            <label">
                                <input id="${this._alias}${fila}txt_ganancia_publico" name="${this._alias}txt_ganancia_publico[]" class="form-control" data-info="_PGPUB_" data-k="${row.id_local_producto}" type="text" value="${row.ganancia_publico}" onclick="this.select()">
                            </label>
                        </div>`;
                    }},

                    {title: APP_ETIQUET._290, field: 'precio_publico', class: "text-right", width: 80, sortable: true, filter: {type: 'text'}, totalizer: true,
                    fnReplace: (fila, row) => {
                        return `
                        <div class="input">
                            <label">
                                <input id="${this._alias}${fila}txt_precio_publico" name="${this._alias}txt_precio_publico[]" class="form-control" data-info="_PVPUB_" data-k="${row.id_local_producto}" type="text" value="${row.precio_publico}" onclick="this.select()">
                            </label>
                        </div>`;
                    }},
                    
                    // PRECIO DE VENTA DE FERRETERIA
                    {title: APP_ETIQUET._288, field: 'ganancia_ferreteria', width: 80, sortable: true, filter: {type: 'text'}, totalizer: true,
                        fnReplace: (fila, row) => {
                            return `
                            <div class="input">
                                <label">
                                    <input id="${this._alias}${fila}txt_ganancia_ferreteria" name="${this._alias}txt_ganancia_ferreteria[]" class="form-control" data-info="_PGFER_" data-k="${row.id_local_producto}" type="text" value="${row.ganancia_ferreteria}" onclick="this.select()">
                                </label>
                            </div>`;
                    }},

                    {title: APP_ETIQUET._291, field: 'precio_ferreteria', class: "text-right", width: 80, sortable: true, filter: {type: 'text'}, totalizer: true,
                    fnReplace: (fila, row) => {
                        return `
                        <div class="input">
                            <label">
                                <input id="${this._alias}${fila}txt_precio_ferreteria" name="${this._alias}txt_precio_ferreteria[]" class="form-control" data-info="_PVFER_" data-k="${row.id_local_producto}" type="text" value="${row.precio_ferreteria}" onclick="this.select()">
                            </label>
                        </div>`;
                    }},
                    
                    // PRECIO DE VENTA DISTRIBUIDOR
                    {title: APP_ETIQUET._289, field: 'ganancia_distribuidor', width: 80, sortable: true, filter: {type: 'text'}, totalizer: true,
                        fnReplace: (fila, row) => {
                            return `
                            <div class="input">
                                <label">
                                    <input id="${this._alias}${fila}txt_ganancia_distribuidor" name="${this._alias}txt_ganancia_distribuidor[]" class="form-control" data-info="_PGDIS_" data-k="${row.id_local_producto}" type="text" value="${row.ganancia_distribuidor}" onclick="this.select()">
                                </label>
                            </div>`;
                        }},

                    {title: APP_ETIQUET._292, field: 'precio_distribuidor', class: "text-right", width: 80, sortable: true, filter: {type: 'text'}, totalizer: true,
                    fnReplace: (fila, row) => {
                        return `
                        <div class="input">
                            <label">
                                <input id="${this._alias}${fila}txt_precio_distribuidor" name="${this._alias}txt_precio_distribuidor[]" class="form-control" data-info="_PVDIS_" data-k="${row.id_local_producto}" type="text" value="${row.precio_distribuidor}" onclick="this.select()">
                            </label>
                        </div>`;
                    }},
                                        
                    {title: APP_ETIQUET._055, field: 'stock_minimo', width: 80, sortable: true, filter: {type: 'text'},
                        fnReplace: (fila, row) => {
                            return `
                            <div class="input">
                                <label">
                                    <input id="${this._alias}${fila}txt_stock_minimo" name="${this._alias}txt_stock_minimo[]" class="form-control" data-info="_SM_" data-k="${row.id_local_producto}" type="text" value="${row.stock_minimo}" onclick="this.select()">
                                </label>
                            </div>`;
                        }},
                    {title: APP_ETIQUET._056, field: 'stock_actual', width: 80, sortable: true, class: 'text-right', filter: {type: 'text'}, totalizer: true,
                        fnReplace: (fila, row) => {
                            var css='';
                            if (row.stock_actual <=0)  {
                                css='background-color:#DB4A67; color:white; padding-top:5px; padding-left:5px; padding-bottom:5px; padding-right:5px; border-radius:3px;';
                            } if (row.stock_actual > 0 && row.stock_actual <= 5) {
                                css='background-color:#3B9FDB; color:white; padding-top:5px; padding-left:5px; padding-bottom:5px; padding-right:5px; border-radius:3px;';
                            }

                            return `
                           <div> <b style="${css}">${row.stock_actual}</b></div>`;
                        }}
//                    {title: APP_ETIQUET._056, field: 'stock_actual', width: 80, sortable: true, filter: {type: 'text'},
//                        fnReplace: (fila, row) => {
//                            return `
//                            <div class="input">
//                                <label">
//                                    <input id="${this._alias}${fila}txt_stock_actual" name="${this._alias}txt_stock_actual[]" class="form-control" data-info="_SA_" data-k="${row.id_local_producto}" type="text" value="${row.stock_actual}" onclick="this.select()">
//                                </label>
//                            </div>`;
//                        }}
                ],
                sExport: {
                    buttons: {
                        excel: true
                    },
                    columns: [
                        {title: APP_ETIQUET.codigo_interno, field: 'codigo', width: 200, sortable: true, filter: {type: 'text'}},
                        {title: APP_ETIQUET.producto, field: 'catalogo', width: 200, sortable: true, filter: {type: 'text'}},
                        {title: APP_ETIQUET._116, field: 'marca', width: 150, sortable: true, filter: {type: 'text'}},
                        {title: APP_ETIQUET.categoria, field: 'categoria', width: 150, sortable: true, filter: {type: 'text'}},
                        {title: APP_ETIQUET._056, field: 'stock_actual', width: 80, sortable: true, filter: {type: 'text'}},
                        
                    ]
                },
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                    sData.push({name: '_key', value: this._key});
                },
                sAxions: {
                    /*se genera group buttons*/
                    group: [{
                            buttons: [{
                                    button: APP_BTN.DEL,
                                    ajax: {
                                        fn: "Obj.Facturacion.LocalAx.postDeleteProducto",
                                        serverParams: "id_local_producto"
                                    }
                                }]
                        }]
                },
                fnCallback: (o) => {
                    this._idGridProductos = o.oTable;
                    this._evtGrid();
                    this._marcaNegativos(this._idGridProductos);
                }
            });
        };

        this._findLocal = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.setLocal(data);
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
                        Tools.refreshGrid(this._gridLocal);
                    }
                }
            });
        };

        this._postDeleteProducto = (btn, tk, id) => {
            this.send({
                flag: 2,
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
                        Tools.refreshGrid(this._idGridProductos);
                    }
                }
            });
        };

        this._formProductos = (btn, tk, local) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(`#${this._alias}-PRL${APP_CONTAINER_TABS}`).html(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._gridProductos(tk);
                    $(`#${this._alias}d_local_name`).html(`${APP_ETIQUET.local} ${local}:`);
                }
            });
        };

        this._gridListaProductos = (tk) => {
            $(`#${this._alias}gridListaProductos`).fullgrid({
                oContext: this,
                tAlias: this._alias,
                pOrderField: 'catalogo asc',
                pDisplayLength: 20,
                tNumbers: false,
                tButtons: [{
                        button: APP_BTN.APR,
                        event: 'Obj.Facturacion.LocalAx.formStockInicial'
                    }],
                tColumns: [
                    {title: APP_ETIQUET.producto, field: 'catalogo', width: 200, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.categoria, field: 'categoria_add', width: 150, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET.u_medida, field: 'unidad_medida', width: 80, sortable: true, filter: {type: 'text'}},
                    {title: APP_ETIQUET._090, field: 'categoria', width: 80, sortable: true,
                        fnReplace: (fila, row) => {
                            return `
                            <div class="input">
                                <label">
                                    <input id="${this._alias}${fila}txt_stock" name="${this._alias}txt_stock[]" class="form-control text-right" type="text" onclick="this.select()" disabled="true">
                                </label>
                            </div>`;
                        }},
                ],
                sCheckbox: {
                    serverValues: ['id_catalogo']
                },
                fnServerParams: (sData) => {
                    sData.push({name: '_qn', value: Tools.en(tk)});
                    sData.push({name: '_key', value: this._key});
                },
                fnCallback: (o) => {
                    this._idGridLista = o.oTable;
                    let tr, chk;
                    $(`#${this._idGridLista}`).find('tbody').find('input:checkbox').click((e) => {
                        chk = $(e.currentTarget);
                        tr = chk.parent().parent('tr');
                        tr.find('td').eq(4).find('input:text').val('').attr('disabled', true);
                        if (chk.is(':checked')) {
                            tr.find('td').eq(4).find('input:text').attr('disabled', false).keyup(function () {
                                if (!$.isNumeric(this.value)) {
                                    this.value = '';
                                }
                            });
                        }
                    });
                    Tools.noSubmit(this._idFormListaProductos);
                }
            });
        };

        this._postDataProducto = (input, tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: input.data('k')});
                    sData.push({name: '_type', value: input.data('info')});
                    sData.push({name: '_dato', value: input.val()});
                },
                response: (data) => {
                    if (data.ok_error == 1) {
                        Tools.refreshGrid(this._idGridProductos);
                    }
                }
            });
        };

        this._getCajas = (tk) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    this.setCajas(data);
                }
            });
        };

        this._postRemoveCaja = (btn, tk) => {
            this.send({
                flag: 2,
                token: tk,
                context: this,
                element: btn,
                form: this._idFormCajas,
                serverParams: (sData, obj) => {
                    sData.push({name: '_key', value: this._key});
                },
                response: (data) => {
                    Tools.execMessage(data);
                    this.setCajas(data.cajas);
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
                this._findLocal(tk);
                Tools.noSubmit(this._formEdit);
            }
        });
    }

    formStockInicial(btn, tk) {
        if ($(`#${this._idGridLista}`).find('tbody').find('input:text').length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._035
            });
            return false;
        }

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
                this.addButtonsFormSI();
            }
        });
    }

    formProductos(btn, id, local, tk) {
        this._key = id;
        this._local = local;
        Tools.addTab({
            context: this,
            id: `${this._alias}-PRL`,
            label: `${APP_ETIQUET.local} ${local}`,
            fnCallback: () => {
                this._formProductos(btn, tk, local);
            }
        });
    }

    formListaProductos(btn, tk) {
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
                this._gridListaProductos(tk);
            }
        });
    }

    formGanancia(btn, tk) {
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
                $(`#${this._alias}b_local`).html(this._local);
            }
        });
    }

    formCajas(btn, id, name, tk) {
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
            finally: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormCaja();
                this._getCajas(tk);
                $(`#${this._alias}d_name`).html(name);
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
                    Tools.closeModal(this._formNew);
                    this._idUbigeo = null;

                    if ($('._local').length > 0) {//recargar en lst
                        Tools.addOption('._local', data, () => {
                            $('._local').val(data.id);
                            $('._local').trigger("chosen:updated");
                        });
                    }
                    if ($(`#${this._gridLocal}`).length > 0) {
                        Tools.refreshGrid(this._gridLocal);
                    }
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
                    Tools.refreshGrid(this._gridLocal);
                    Tools.closeModal(this._formEdit);
                    this._idUbigeo = null;
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

    postDeleteProducto(btn, id, tk) {
        Tools.notify().confirm({
            content: APP_MSN.you_sure_delete,
            yes: () => {
                this._postDeleteProducto(btn, tk, id);
            }
        });
    }

    postProductos(tk) {
        if ($(`#${this._idGridLista}`).find('input:checkbox:checked').length == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._027
            });
            return false;
        }
        var st = true;
        $(`#${this._idGridLista}`).find('tbody').find('input:text:enabled').each(function () {
            $(this).css({
                border: '1px solid #ccc'
            });
            if (!$.isNumeric($(this).val())) {
                $(this).css({
                    border: '1px solid red'
                });
                st = false;
            }
        });
        if (!st) {
            Tools.notify().smallMsn({
                content: APP_MSN._034
            });
            return false;
        }



        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._idFormListaProductos,
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: this._key});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    Tools.refreshGrid(this._idGridProductos);
                    Tools.closeModal(this._idFormListaProductos);
                }
            }
        });
    }

    postAllProductos(tk) {
        this.send({
            flag: 3,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.XONT}`,
            context: this,
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: this._key});
                sData.push({name: '_stockInicial', value: $(`#${this._alias}txt_stock_inicial`).val()});
            },
            response: (data) => {
                Tools.execMessage(data);
                if (data.ok_error != 'error') {
                    Tools.refreshGrid(this._idGridProductos);
                    Tools.closeModal(this._idFormListaProductos);
                    Tools.closeModal(this._idFormStockInicial);
                }
            }
        });
    }

    postAllGanancia(tk) {
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: this._key});
                sData.push({name: '_gan_pub', value: $(`#${this._alias}txt_ganancia_publico`).val()});
                sData.push({name: '_gan_fer', value: $(`#${this._alias}txt_ganancia_ferreteria`).val()});
                sData.push({name: '_gan_dis', value: $(`#${this._alias}txt_ganancia_distribuidor`).val()});
            },
            response: (data) => {
                if (data == 1) {
                    Tools.notify().ok({
                        content: APP_MSN.operacion_ok
                    });
                    Tools.refreshGrid(this._idGridProductos);
                    Tools.closeModal(this._idFormGanancia);
                    console.log('putamadre')
                } else {
                    Tools.notify().error({
                        content: APP_MSN.comuniquese
                    });
                }
            }
        });
    }

    postAddCaja(btn, tk) {
        if ($(this._idFormCajas).find('input:checkbox:checked').length == 0) {
            Tools.notify().error({
                content: APP_MSN._046
            });
            return false;
        }
        this.send({
            flag: 1,
            token: tk,
            element: btn,
            context: this,
            form: this._idFormCajas,
            serverParams: (sData, obj) => {
                sData.push({name: '_key', value: this._key});
            },
            response: (data) => {
                Tools.execMessage(data);
                this.setCajas(data.cajas);
            }
        });
    }

    postRemoveCaja(btn, tk) {
        if ($(this._idFormCajas).find('input:checkbox:checked').length == 0) {
            Tools.notify().confirm({
                content: APP_MSN._047,
                yes: () => {
                    this._postRemoveCaja(btn, tk);
                }
            });
        } else {
            this._postRemoveCaja(btn, tk);
        }
    }

};