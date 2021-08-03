"use strict";
$$.System.MenuAx = class MenuAx extends $$.System.MenuRsc {

    constructor() {
        super();
        this._controller = 'menu:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._keyMenu = null;
        this._parent = 0;
        this._formNewMenu = `#${this._alias}formNewMenu`;
        this._formEditMenu = `#${this._alias}formEditMenu`;
        this._tour = Obj.System.MenuTour;

        this._getMenu = (tk) => {
            this.send({
                token: tk,
                context: this,
                success: (obj) => {
                    this.renderMenu(obj.data);
                }
            });
        };

        this._formIndex = (tk) => {
            this.send({
                token: tk,
                context: this,
                dataType: 'text',
                success: (obj) => {
                    $(this._dmain).append(obj.data);
                },
                final: (obj) => {/* final() se ejecuta una vez que se cargo el HTML en success*/
                    this.addBtnNew();
                    $(`#${this._alias}d_menu`).html(`<div class="text-center">${Tools.spinner().main}</div>`);
                    this._getMenu(tk);
                    //Tools.addTourMain.call(this);
                }
            });
        };

        this._findMenu = (tk) => {
            this.send({
                token: tk,
                context: this,
                decodeHtmlEntities: true,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyMenu', value: this._keyMenu});
                },
                success: (obj) => {
                    this.setMenu(obj);
                }
            });
        };

        this._postDelete = (btn, tk) => {
            this._keyMenu = $(btn).parent().parent().parent('div').data('keymnu') || $(btn).parent('div').data('k');
            this.send({
                flag: 3,
                token: tk,
                context: this,
                element: btn,
                gifProcess: true,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyMenu', value: this._keyMenu});
                },
                success: (obj) => {
                    Tools.execMessage(obj.data);
                    if (obj.data.ok_error != 'error') {
                        this._keyMenu = null;
                        this._getMenu(tk);
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

    postOrdenarMenu(elements, tk) {
        this.send({
            token: tk,
            context: this,
            serverParams: function (sData, obj) {
                sData.push({name: '_ordenElements', value: elements});
            }
        });
    }

    formNewMenu(btn, tk) {
        let prt = $(btn).parent().parent().parent('._prt');
        this._parent = $(btn).parent('div').data('k') || 0;
        if (prt.length == 1) {
            this._parent = prt.data('keymnu');
        }

        this.send({
            element: btn,
            gifProcess: true,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            success: (obj) => {
                $(this._dmain).append(obj.data);
            },
            final: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/                
                this.addButtonsFormNew();
                Tools.tagsInput(obj);
            }
        });
    }

    formEditMenu(btn, tk) {
        this._keyMenu = $(btn).parent().parent().parent('div').data('keymnu') || $(btn).parent('div').data('k');

        this.send({
            element: btn,
            gifProcess: true,
            token: tk,
            context: this,
            modal: true,
            dataType: 'text',
            success: (obj) => {
                $(this._dmain).append(obj.data);
                this._findMenu(tk);
            },
            final: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                this.addButtonsFormUpdate();
            }
        });
    }

    postNewMenu(tk) {
        this.send({
            flag: 1,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
            context: this,
            form: this._formNewMenu,
            serverParams: (sData, obj) => {
                sData.push({name: '_parent', value: this._parent});
            },
            success: (obj) => {
                Tools.execMessage(obj.data);
                if (obj.data.ok_error != 'error') {
                    this._parent = 0;
                    Tools.closeModal(this._formNewMenu);
                    this._getMenu(tk);
                }
            }
        });
    }

    postEditMenu(tk) {
        this.send({
            flag: 2,
            token: tk,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.UPD}`,
            context: this,
            form: this._formEditMenu,
            serverParams: (sData, obj) => {
                sData.push({name: '_keyMenu', value: this._keyMenu});
            },
            success: (obj) => {
                Tools.execMessage(obj.data);
                if (obj.data.ok_error != 'error') {
                    this._keyMenu = null;
                    Tools.closeModal(this._formEditMenu);
                    this._getMenu(tk);
                }
            }
        });
    }

    postDelete(btn, tk) {
        Tools.notify().confirm({
            content: APP_MSN.you_sure_delete,
            yes: () => {
                this._postDelete(btn, tk);
            }
        });
    }

}; 