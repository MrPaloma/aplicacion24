/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        25-09-2018 06:09:53 
 * Descripcion : NotaPedidoAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.NotaPedidoAx = class NotaPedidoAx extends $$.Facturacion.NotaPedidoRsc {

    constructor() {
        super();
        this._controller = 'notaPedido:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.NotaPedidoTour;
        this._idFormIndex = `#${this._alias}formIndex`;

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
                    this.addButtons();
                    if (Tools.chekMobile()) {
                        $(`#${this._alias}d_responsive`).addClass('table-responsive');
                    }
                }
            });
        };

        this._post = (tk) => {
            this.send({
                flag: 1,
                token: tk,
                element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`,
                context: this,
                form: this._idFormIndex,
                response: (data) => {
                    if (data.ok_error != 'error') {
                        Tools.notify().alert({
                            content: `<span class="MsgTitle"><i class="fa fa-file-text" style="color:orange"></i> ${APP_ETIQUET._088}:  <span style="color:orange"><strong>${data.num_pedido}</strong></span> </span>`
                        });
                        this.main(tk);
                    }else{
                        Tools.notify().error({
                            content: APP_ETIQUET.comuniquese
                        });
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

    post(tk) {
        if (!this.validaProductos()) {
            return false;
        }
        Tools.notify().confirm({
            content: APP_MSN._033,
            yes: () => {
                this._post(tk);
            }
        });
    }

    addItem(btn, tk) {
        this.addProducto();
    }

};