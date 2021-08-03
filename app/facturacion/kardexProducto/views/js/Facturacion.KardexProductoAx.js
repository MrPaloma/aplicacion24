/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        26-09-2018 19:09:26 
 * Descripcion : KardexProductoAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.KardexProductoAx = class KardexProductoAx extends $$.Facturacion.KardexProductoRsc {

    constructor() {
        super();
        this._controller = 'kardexProducto:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.KardexProductoTour;
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
                    this.getListBoxs();
                    this.addButtons();
                    if (Tools.chekMobile()) {
                        $(`.d_responsive`).addClass('table-responsive');
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

    search(tk) {
        this.send({
            token: tk,
            context: this,
            form: this._idFormIndex,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.SERCH}`,
            response: (data) => {
                this.setKardex(data);
            }
        });
    }

};