/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        24-09-2018 06:09:02 
 * Descripcion : ReporteProductoAx.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.ReporteProductoAx = class ReporteProductoAx extends $$.Facturacion.ReporteProductoRsc {

    constructor() {
        super();
        this._controller = 'reporteProducto:';
        this._alias = Exe.getAlias();
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/
        this._tour = Obj.Facturacion.ReporteProductoTour;
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
                    this.getListBoxs(tk);
                    this.addButtonsPrint();
                    Tools.dateRange(`#${this._alias}txt_desde`, `#${this._alias}txt_hasta`, 1);
                    Tools.dateRange(`#${this._alias}txt_desde2`, `#${this._alias}txt_hasta2`, 1);
                }
            });
        };

        this._getProductosLocal = (tk, local) => {
            this.send({
                token: tk,
                context: this,
                serverParams: (sData, obj) => {
                    sData.push({name: '_keyLocal', value: local});
                },
                response: (data) => {
                    $(`#${this._alias}sp_title`).html($(`#${this._alias}lst_local option:selected`).text());
                    this.setProductosLocal(data);
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
    
    printAll(btn, tk) {
        let container = $(`#${this._alias}d_printer`);
        Tools.printArea({
            area: container,
            overrideElementCSS: [
                'public/theme/default/css/bootstrap.min.css',
                'public/theme/default/css/smartadmin-production.min.css'
            ]
        });
    }

    printAll5(btn, tk) {
        let container = $(`#${this._alias}d_printer5`);
        Tools.printArea({
            area: container,
            overrideElementCSS: [
                'public/theme/default/css/bootstrap.min.css',
                'public/theme/default/css/smartadmin-production.min.css'
            ]
        });
    }

    printAll7(btn, tk) {
        let container = $(`#${this._alias}d_printer7`);
        Tools.printArea({
            area: container,
            overrideElementCSS: [
                'public/theme/default/css/bootstrap.min.css',
                'public/theme/default/css/smartadmin-production.min.css'
            ]
        });
    }

    searchMasVendidos(){
        let cl = $(`#${this._alias}lst_local2`).val();
        let can = $(`#${this._alias}lst_numero2`).val();
        let des = $(`#${this._alias}txt_desde2`).val();
        let has = $(`#${this._alias}txt_hasta2`).val();

        if ($.isEmptyObject(cl)) {
            Tools.notify().smallMsn({
                content: APP_MSN._070
            });
            return false;
        }
        if ($.isEmptyObject(can)) {
            Tools.notify().smallMsn({
                content: APP_MSN._070
            });
            return false;
        }
        if (!this.validaFechas02()) {
            return false;
        }

        let data = {
            local: cl,
            cantidad: can,
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
              var table = $(`#RPTPR__tb_productos2`);
              var rows = "";
              //table.find("tbody tr").remove();
              data.forEach(function (pro, i) {
                rows += "<tr><td>"+(i+1)+"</td><td>"+pro.catalogo+"</td><td>"+parseInt(pro.ventas)+"</td></tr>";
              });

              table.html(rows);
            }
          });
        
    }

    searchStock0(){
        let cl = $(`#${this._alias}lst_local3`).val();
        let can = $(`#${this._alias}lst_numero3`).val();

        if ($.isEmptyObject(cl)) {
            Tools.notify().smallMsn({
                content: APP_MSN._066
            });
            return false;
        }
        if ($.isEmptyObject(can) || can == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._069
            });
            return false;
        }

        let data = {
            function: 'reporteStock0',
            local: cl,
            cantidad: can,
        };

        $.ajax({
            url: "ajax.php",
            type: "POST",
            data: data,
            success: function(html){
              var data = JSON.parse(html);
              console.log(data);
              var table = $(`#RPTPR__tb_productos3`);
              var rows = "";
              //table.find("tbody tr").remove();
              
              data.forEach(function (pro, i) {
                rows += "<tr><td>"+pro.codigo_interno+"</td><td>"+pro.catalogo+"</td><td>"+pro.precio_publico+"</td><td>"+pro.stock_actual+"</td></tr>";
              });
              localStorage.setItem('searchStock0', JSON.stringify(data))
              table.html(rows);
            }
          });
    }

    searchStock6(){
        let cl = $(`#${this._alias}lst_local4`).val();
        let can = $(`#${this._alias}lst_numero4`).val();

        if ($.isEmptyObject(cl)) {
            Tools.notify().smallMsn({
                content: APP_MSN._066
            });
            return false;
        }
        if ($.isEmptyObject(can) || can == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._069
            });
            return false;
        }

        let data = {
            function: 'reporteStock6',
            local: cl,
            cantidad: can,
        };

        $.ajax({
            url: "ajax.php",
            type: "POST",
            data: data,
            success: function(html){
              var data = JSON.parse(html);
              console.log(data);
              var table = $(`#RPTPR__tb_productos4`);
              var rows = "";
              //table.find("tbody tr").remove();
              
              data.forEach(function (pro, i) {
                rows += "<tr><td>"+pro.codigo_interno+"</td><td>"+pro.catalogo+"</td><td>"+pro.precio_publico+"</td><td>"+pro.stock_actual+"</td></tr>";
              });

              localStorage.setItem('searchStock6', JSON.stringify(data))

              table.html(rows);
            }
          });
    }

    searchVendidos(){
        let cl = $(`#${this._alias}lst_local5`).val();
        let can = $(`#${this._alias}lst_numero5`).val();

        console.log($(`#${this._alias}lst_local5`))
        console.log($(`#${this._alias}lst_local5`))
        console.log(cl)
        console.log(can)

        if ($.isEmptyObject(cl)) {
            Tools.notify().smallMsn({
                content: APP_MSN._066
            });
            return false;
        }
        if ($.isEmptyObject(can) || can == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._069
            });
            return false;
        }

        let data = {
            function: 'reporteVendidos',
            local: cl,
            cantidad: can,
        };

        $.ajax({
            url: "ajax.php",
            type: "POST",
            data: data,
            success: function(html){
              var data = JSON.parse(html);
              console.log(data);
              var table = $(`#RPTPR__tb_productos5`);
              var rows = "";
                //table.find("tbody tr").remove();
              localStorage.setItem('reporte_general_productos', JSON.stringify(data))

              data.forEach(function (pro, i) {
                rows += "<tr><td>"+pro.codigo+"</td>" + 
                            "<td>" + pro.catalogo + "</td>" +
                            "<td>" + pro.marca + "</td>" +
                            "<td>" + pro.categoria + "</td>" + 
                            "<td>" + pro.proveedor + "</td>" + 
                            "<td>" + pro.ubicacion + "</td>" + 
                            "<td>" + pro.nx_caja + "</td>" + 
                            "<td>" + pro.stock + "</td>" + 
                            "<td>" + pro.p_pub + "</td>" + 
                            "<td>" + pro.p_fer + "</td>" + 
                            "<td>" + pro.p_dis + "</td>" + 
                            "<td>" + pro.p_com + "</td>" + 
                            "<td>Han pasado " + pro.dias_pasados + " Dias</td>"
                if ( pro.estado == 1 ) {
                    rows += "<td>Activo</td></tr>"
                } else {
                    rows += "<td>Inactivo</td></tr>"
                }
                            
              });

             table.html(rows);
            }
          });
    }

    searchUtilidades(){
        let cl = $(`#${this._alias}lst_local7`).val();
        let can = $(`#${this._alias}lst_numero7`).val();

        console.log($(`#${this._alias}lst_local7`))
        console.log($(`#${this._alias}lst_local7`))
        console.log(cl)
        console.log(can)

        if ($.isEmptyObject(cl)) {
            Tools.notify().smallMsn({
                content: APP_MSN._066
            });
            return false;
        }
        if ($.isEmptyObject(can) || can == 0) {
            Tools.notify().smallMsn({
                content: APP_MSN._069
            });
            return false;
        }

        let data = {
            function: 'reporteUtilidades',
            local: cl,
            cantidad: can,
        };

        $.ajax({
            url: "ajax.php",
            type: "POST",
            data: data,
            success: function(html){
              var data = JSON.parse(html);
              console.log(data);
              var table = $(`#RPTPR__tb_productos7`);
              var rows = "";
                //table.find("tbody tr").remove();
              localStorage.setItem('reporte_utilidad_productos', JSON.stringify(data))

              data.forEach(function (pro, i) {
                rows += "<tr><td>"+pro.fecha+"</td>" + 
                            "<td>" + pro.catalogo + "</td>" +
                            "<td>" + pro.marca + "</td>" +
                            "<td>" + pro.categoria + "</td>" + 
                            "<td>" + pro.stock + "</td>" + 
                            "<td>" + pro.cantidad + "</td>" +
                            "<td>" + pro.pc_unitario + "</td>" +
                            "<td>" + pro.pv_unitario + "</td>" +
                            "<td>" + pro.total + "</td>" + 
                            "<td>" + pro.utilidad + "</td>"
              });

                let sumatoria = 0;

                data.forEach(function (pro, i) {
                    sumatoria += (parseFloat(pro.stock))
                });
                $(`#total_stock`).html(sumatoria)
                
                sumatoria = 0;
                data.forEach(function (pro, i) {
                    sumatoria += (parseFloat(pro.cantidad))
                });
                $(`#total_cantidad`).html(sumatoria)

                sumatoria = 0;
                data.forEach(function (pro, i) {
                    sumatoria += (parseFloat(pro.pc_unitario))
                });
                $(`#total_p_compra`).html(sumatoria)

                sumatoria = 0;
                data.forEach(function (pro, i) {
                    sumatoria += (parseFloat(pro.pv_unitario))
                });
                $(`#total_p_venta`).html(sumatoria)

                sumatoria = 0;
                data.forEach(function (pro, i) {
                    sumatoria += (parseFloat(pro.total))
                });
                $(`#total_total`).html(sumatoria)

                sumatoria = 0;
                data.forEach(function (pro, i) {
                    sumatoria += (parseFloat(pro.utilidad))
                });
                $(`#total_utilidad`).html(sumatoria)

                table.html(rows);
            }
          });
    }

};