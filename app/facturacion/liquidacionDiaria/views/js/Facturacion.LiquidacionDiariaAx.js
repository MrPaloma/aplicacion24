/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin  Art  
 * Fecha:        02-12-2018 06:12:51 
 * Descripcion : LiquidacionDiariaAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.LiquidacionDiariaAx = class LiquidacionDiariaAx extends $$.Facturacion.LiquidacionDiariaRsc {

    constructor() {
        super();
        this._controller = 'liquidacionDiaria:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.LiquidacionDiariaTour;
        this._idFormIndex = `#${this._alias}formIndex`;
        this._idFormDetalle = `#${this._alias}formDetalle`;

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
                    Tools.dateRange(`#${this._alias}txt_desde`, `#${this._alias}txt_hasta`, 1);
                    this.addButtonsForm();

                    if (APP_IDROL == 2) {//solo el administrador puede ver todos los usuarios
                        this.getLst(this._idFormIndex);
                    } else {
                        //se carga el usuario logueado
                        this.setUserLogin();
                    }
                }
            });
        };

        this._formDetalle = (tk, fp, tm, cj, nmn, t) => {
            this.loadingServer();
            this.send({
                token: tk,
                context: this,
                modal: true,
                dataType: 'text',
                response: (data) => {
                    $(APP_MAIN_MODALS).append(data);
                },
                finally: (data) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    $(`#${this._alias}sp_title_m`).html(`${t} - ${nmn}`);
                    this.addButtonsPrintD();
                    this._getDetalle(tk, fp, tm, cj);
                }
            });
        };

        this._getDetalle = (tk, fp, tm, cj) => {
            this.send({
                token: tk,
                context: this,
                form: this._idFormIndex,
                serverParams: (sData, obj) => {
                    sData.push({name: '_formaPago', value: fp});
                    sData.push({name: '_tipoMoneda', value: tm});
                    sData.push({name: '_caja', value: cj});
                },
                response: (data) => {
                    this.setDetalle(data);
                    this.finishServer();
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

    getLiquidacion(tk) {
        this.send({
            token: tk,
            context: this,
            form: this._idFormIndex,
            element: `#${PREBTNCTXT}${this._alias}${APP_BTN.SED}`,
            response: (data) => {
                this.setVentas(data);
                this.setTitle();
            }
        });
    }

    printLiks(btn, tk) {
        let container = $(btn).parent().parent().find('.table-responsive');

        Tools.printArea({
            area: container,
            overrideElementCSS: [
                'public/theme/default/css/bootstrap.min.css',
                'public/theme/default/css/smartadmin-production.min.css'
            ]
        });
    }

    printDetalle(btn, tk) {
        let container = $(`#${this._alias}d_detalle_m`);

        Tools.printArea({
            area: container,
            overrideElementCSS: [
                'public/theme/default/css/bootstrap.min.css',
                'public/theme/default/css/smartadmin-production.min.css'
            ]
        });
    }

};