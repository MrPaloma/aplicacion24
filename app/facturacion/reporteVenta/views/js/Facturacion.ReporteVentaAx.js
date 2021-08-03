/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        24-09-2018 06:09:51 
 * Descripcion : ReporteVentaAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.ReporteVentaAx = class ReporteVentaAx extends $$.Facturacion.ReporteVentaRsc {

    constructor() {
        super();
        this._controller = 'reporteVenta:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.ReporteVentaTour;
        this._idFormIndex = `#${this._alias}formIndex`;
        this._keyLocal = null;

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
                    $(`#${this._alias}accordion`).accordion();
                    this.addBtnBuscar01();
                    this.getListBoxs();
                    Tools.dateRange(`#${this._alias}txt_desde`, `#${this._alias}txt_hasta`, 1);
                    Tools.dateRange(`#${this._alias}txt_desde2`, `#${this._alias}txt_hasta2`, 1);
                    Tools.dateRange(`#${this._alias}txt_desde3`, `#${this._alias}txt_hasta3`, 1);
                    $(`#${this._alias}btn_excel`).click((e) => {
                        window.open('data:application/vnd.ms-excel,' + encodeURIComponent($(`#${this._alias}tb_all`).html()));
                    });
                }
            });
        };

        this._formDetalle = (tk, btn, local) => {
            this._keyLocal = btn.data('k');
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
                    $(`#${this._alias}sp_name`).html(local);
                    this._getTotalesLocal(btn, tk);
                    this.addBtnBuscarDetalle();
                    Tools.dateRange(`#${this._alias}txt_desde_d`, `#${this._alias}txt_hasta_d`);
                }
            });
        };

        this._formDetalleVendedor = (tk, btn, local) => {
            this._keyLocal = btn.data('k');
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
                    $(`#${this._alias}sp_name`).html(local);
                }
            });
        };

        this._getTotalesLocal = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                gifProcess: true,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocal', value: this._keyLocal});
                    sData.push({name: '_desde', value: $(`#${this._alias}txt_desde`).val()});
                    sData.push({name: '_hasta', value: $(`#${this._alias}txt_hasta`).val()});
                },
                response: (data) => {
                    this.setTotalesLocal(1, data);
                }
            });
        };

        this._getTotalesLocalDos = (btn, tk) => {
            this.send({
                element: btn,
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocal', value: this._keyLocal});
                    sData.push({name: '_desde', value: $(`#${this._alias}txt_desde_d`).val()});
                    sData.push({name: '_hasta', value: $(`#${this._alias}txt_hasta_d`).val()});
                },
                response: (data) => {
                    this.setTotalesLocal(2, data);
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

    searchVentaLocal(btn, tk) {
        if (!this.validaFechas01()) {
            return false;
        }
        this.send({
            token: tk,
            element: btn,
            context: this,
            form: this._formEdit,
            serverParams: (sData, obj) => {
                sData.push({name: '_desde', value: $(`#${this._alias}txt_desde`).val()});
                sData.push({name: '_hasta', value: $(`#${this._alias}txt_hasta`).val()});
            },
            response: (data) => {
                this.setVentasLocal(tk, data);
            }
        });
    }

    searchVentaGeneral(btn, tk) {
        let cl = $(`#${this._alias}lst_local`).val();
        if ($.isEmptyObject(cl)) {
            Tools.notify().smallMsn({
                content: APP_MSN._070
            });
            return false;
        }
        if (!this.validaFechas02()) {
            return false;
        }
        this.send({
            token: tk,
            element: btn,
            context: this,
            form: this._formEdit,
            serverParams: (sData, obj) => {
                sData.push({name: '_local', value: cl});
                sData.push({name: '_desde', value: $(`#${this._alias}txt_desde2`).val()});
                sData.push({name: '_hasta', value: $(`#${this._alias}txt_hasta2`).val()});
            },
            response: (data) => {
                this.setVentas(data);
            }
        });
    }

    totalesLocal(btn, tk) {
        if (!this.validaFechas01()) {
            return false;
        }
        this._getTotalesLocalDos(btn, tk);
    }

    searchMasVendidos(){
        let cl = $(`#${this._alias}lst_local3`).val();
        let des = $(`#${this._alias}txt_desde3`).val();
        let has = $(`#${this._alias}txt_hasta3`).val();

        if ($.isEmptyObject(cl)) {
            Tools.notify().smallMsn({
                content: APP_MSN._070
            });
            return false;
        }
       
        if (!this.validaFechas03()) {
            return false;
        }

        let data = {
            function: 'ReporteVedendores',
            local: cl,
            desde: des,
            hasta: has
        };

        $.ajax({
            url: "ajax.php",
            type: "POST",
            data: data,
            success: function(html){
              var data = JSON.parse(html);
              console.log(data);
              var table = $(`#RPTV__tb_productos3`);
              var rows = "";
              //table.find("tbody tr").remove();
              data.forEach(function (ven, i) {
                  rows += "<tr><td>"+(i+1)+"</td><td>"+ven.nombre_completo+"</td><td>"+ven.total+"</td></tr>";
              });
              table.html(rows);
            }
          });
        
    }

};