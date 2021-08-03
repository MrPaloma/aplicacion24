"use strict";
Exe.require({require: {system: 'init::System.InitTour'}, run: false});
$$.System.InitRsc = class InitRsc extends Resource {

    constructor() {
        super();

        this._setChartSalesToday = (data, tk) => {
            let cols = [];
            $.each(data, (i, v) => {
                cols.push({
                    hora: `${v.hora}:00`,
                    tb: v.total,
                    tl: v.total
                });
            });
            var chart = AmCharts.makeChart(`${this._alias}chart_tventas`, {
                "type": "serial",
                "addClassNames": true,
                "theme": "light",
                "autoMargins": false,
                "marginLeft": 70,
                "marginRight": 8,
                "marginTop": 10,
                "marginBottom": 60,
                "balloon": {
                    "adjustBorderColor": false,
                    "horizontalPadding": 0,
                    "verticalPadding": 8,
                    "color": "#ffffff"
                },
                "legend": {
                    "horizontalGap": 10,
                    "maxColumns": 1,
                    "position": "bottom",
                    "useGraphSettings": true,
                    "markerSize": 10
                },
                "dataProvider": cols,
                "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": APP_ETIQUET._123
                    }],
                "startDuration": 1,
                "graphs": [{
                        "alphaField": "alpha",
                        "balloonText": "<span style='font-size:12px;'>[[title]] en [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                        "fillAlphas": 1,
                        "title": APP_ETIQUET._118,
                        "type": "column",
                        "valueField": "tb",
                        "dashLengthField": "dashLengthColumn"
                    }, {
                        "id": "graph2",
                        "balloonText": "<span style='font-size:12px;'>[[title]] en [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                        "bullet": "round",
                        "lineThickness": 3,
                        "bulletSize": 7,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#FFFFFF",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 3,
                        "fillAlphas": 0,
                        "lineAlpha": 1,
                        "title": APP_ETIQUET._118,
                        "valueField": "tl",
                        "dashLengthField": "dashLengthLine"
                    }],
                "categoryField": "hora",
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisAlpha": 0,
                    "tickLength": 0,
                    "labelRotation": 45
                },
                "depth3D": 20,
                "angle": 30,
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "listeners": [{
                        "event": "clickGraphItem",
                        "method": (event) => {
                            console.log(event.item.category);
                        }
                    }],
                "export": {
                    "enabled": true
                }
            });
        };

        this._setChartCurrentWeek = (data, tk) => {
            let cols = [];
            $.each(data, (i, v) => {
                cols.push({
                    dia: v.dia,
                    tb: v.total,
                    tl: v.total
                });
            });

            var chart = AmCharts.makeChart(`${this._alias}chart_tventas`, {
                "type": "serial",
                "addClassNames": true,
                "theme": "light",
                "autoMargins": false,
                "marginLeft": 70,
                "marginRight": 8,
                "marginTop": 10,
                "marginBottom": 60,
                "balloon": {
                    "adjustBorderColor": false,
                    "horizontalPadding": 0,
                    "verticalPadding": 8,
                    "color": "#ffffff"
                },
                "legend": {
                    "horizontalGap": 10,
                    "maxColumns": 1,
                    "position": "bottom",
                    "useGraphSettings": true,
                    "markerSize": 10
                },
                "dataProvider": cols,
                "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": APP_ETIQUET._124
                    }],
                "startDuration": 1,
                "graphs": [{
                        "alphaField": "alpha",
                        "balloonText": "<span style='font-size:12px;'>[[title]] en [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                        "fillAlphas": 1,
                        "title": APP_ETIQUET._118,
                        "type": "column",
                        "valueField": "tb",
                        "dashLengthField": "dashLengthColumn"
                    }, {
                        "id": "graph2",
                        "balloonText": "<span style='font-size:12px;'>[[title]] en [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                        "bullet": "round",
                        "lineThickness": 3,
                        "bulletSize": 7,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#FFFFFF",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 3,
                        "fillAlphas": 0,
                        "lineAlpha": 1,
                        "title": APP_ETIQUET._118,
                        "valueField": "tl",
                        "dashLengthField": "dashLengthLine"
                    }],
                "categoryField": "dia",
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisAlpha": 0,
                    "tickLength": 0,
                    "labelRotation": 45
                },
                "depth3D": 20,
                "angle": 30,
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "listeners": [{
                        "event": "clickGraphItem",
                        "method": (event) => {
                            console.log(event.item.category);
                        }
                    }],
                "export": {
                    "enabled": true
                }
            });
        };

        this._setDashboardAdministrador = (data, tk) => {
            let cols = [];
            $.each(data.ventasMensuales, (i, v) => {
                cols.push({
                    mes: v.mes,
                    tb: v.total,
                    tl: v.total
                });
            });
            var chart = AmCharts.makeChart(`${this._alias}chart_tventas`, {
                "type": "serial",
                "addClassNames": true,
                "theme": "light",
                "autoMargins": false,
                "marginLeft": 70,
                "marginRight": 8,
                "marginTop": 10,
                "marginBottom": 80,
                "balloon": {
                    "adjustBorderColor": false,
                    "horizontalPadding": 0,
                    "verticalPadding": 8,
                    "color": "#ffffff"
                },
                "legend": {
                    "horizontalGap": 10,
                    "maxColumns": 1,
                    "position": "bottom",
                    "useGraphSettings": true,
                    "markerSize": 10
                },
                "dataProvider": cols,
                "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": APP_ETIQUET._117
                    }],
                "startDuration": 1,
                "graphs": [{
                        "alphaField": "alpha",
                        "balloonText": "<span style='font-size:12px;'>[[title]] en [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                        "fillAlphas": 1,
                        "title": APP_ETIQUET._118,
                        "type": "column",
                        "valueField": "tb",
                        "dashLengthField": "dashLengthColumn"
                    }, {
                        "id": "graph2",
                        "balloonText": "<span style='font-size:12px;'>[[title]] en [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                        "bullet": "round",
                        "lineThickness": 3,
                        "bulletSize": 7,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#FFFFFF",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 3,
                        "fillAlphas": 0,
                        "lineAlpha": 1,
                        "title": APP_ETIQUET._118,
                        "valueField": "tl",
                        "dashLengthField": "dashLengthLine"
                    }],
                "categoryField": "mes",
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisAlpha": 0,
                    "tickLength": 0,
                    "labelRotation": 45
                },
                "depth3D": 20,
                "angle": 30,
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "listeners": [{
                        "event": "clickGraphItem",
                        "method": (event) => {
                            console.log(event.item.category);
                        }
                    }],
                "export": {
                    "enabled": true
                }
            });
        };

        this._setPagarCobrar = (data) => {
            $(`#${this._alias}d_por_pagar`).html(Tools.formatNumber(data.porPagar.monto));
            $(`#${this._alias}d_por_cobrar`).html(Tools.formatNumber(data.porCobrar.monto));
            $(`#${this._alias}d_proveedor_total`).html(data.proveedor.total);
            $(`#${this._alias}d_marca_total`).html(data.marca.total);
            $(`#${this._alias}d_producto_total`).html(data.productos.total);
            $(`#${this._alias}d_cliente_total`).html(data.clientes.total);
            $(`#${this._alias}d_ventadia_total`).html(Tools.formatNumber(data.ventasdia.total));
            $(`#${this._alias}d_comprames_total`).html(Tools.formatNumber(data.comprames.total));
        };
    }

    addTour() {
        $('#btnTour').click(function () {
            Obj.System.InitTour.home();
        });
    }

    validate() {
        $("#LG__formLogin").validate({
            // Rules for form validation
            rules: {
                LG__txtUser: {
                    required: true,
                    minlength: 3
                },
                LG__txtClave: {
                    required: true,
                    minlength: 3
                }
            },
            // No cambie el código de abajo
            errorPlacement: (error, element) => {
                error.insertAfter(element.parent());
            },
            submitHandler: () => {
                this.postLogin();
            }
        });
    }

    addEvtsPanelConfigRsc(context) {
        var v;
        $('#smart-fixed-header').click(function () {
            v = ($(this).is(':checked')) ? 1 : 0;
            context.appTheme(1, v);
        });
        $('#smart-fixed-navigation').click(function () {
            v = ($(this).is(':checked')) ? 1 : 0;
            context.appTheme(2, v);
        });
        $('#smart-fixed-ribbon').click(function () {
            v = ($(this).is(':checked')) ? 1 : 0;
            context.appTheme(3, v);
        });

        $('#smart-fixed-footer').click(function () {
            v = ($(this).is(':checked')) ? 1 : 0;
            context.appTheme(4, v);
        });
        $('#smart-fixed-container').click(function () {
            v = ($(this).is(':checked')) ? 1 : 0;
            context.appTheme(5, v);
        });
        $('#smart-rtl').click(function () {
            v = ($(this).is(':checked')) ? 1 : 0;
            context.appTheme(6, v);
        });
        $('#smart-topmenu').click(function () {
            v = ($(this).is(':checked')) ? 1 : 0;
            context.appTheme(7, v);
        });
        $('#colorblind-friendly').click(function () {
            v = ($(this).is(':checked')) ? 1 : 0;
            context.appTheme(8, v);
        });
        $('#smart-style-0').click(function () {
            v = ($(this).data('value') == 1) ? 0 : 1;
            $(this).data('value', v);
            context.appTheme(9, v);
        });
        $('#smart-style-1').click(function () {
            context.appTheme(10, 1);
        });
        $('#smart-style-2').click(function () {
            context.appTheme(11, 1);
        });
        $('#smart-style-3').click(function () {
            context.appTheme(12, 1);
        });
        $('#smart-style-4').click(function () {
            context.appTheme(13, 1);
        });
        $('#smart-style-5').click(function () {
            context.appTheme(14, 1);
        });
        $('#smart-style-6').click(function () {
            context.appTheme(15, 1);
        });
    }

    inactividadRsc() {
        setTimeout(function () {
            $(document).idleTimeout({
                redirectUrl: 'Obj.System.InitAx.logOut(null);',
                idleTimeLimit: 1800, // 'No activity' time limit in seconds. 1800 = 30 Minutes, DEBE VENIR DE LA DB
                dialogTitle: 'Advertencia de cierre de sesión',
                dialogText: 'Como ha estado inactivo, su sesión está a punto de caducar.',
                dialogTimeRemaining: 'Tiempo restante',
                dialogStayLoggedInButton: 'Continuar',
                dialogLogOutNowButton: 'Salir'
            });
        }, 1500);
    }

    evts(tk) {
        $(`#${this._alias}m_pagar`).off('click').click(function () {
            $('#li_86').find('a').click();
        });
        $(`#${this._alias}m_cobrar`).off('click').click(function () {
            $('#li_85').find('a').click();
        });
        $(`#${this._alias}m_proveedor`).off('click').click(function () {
            $('#li_82').find('a').click();
        });
        $(`#${this._alias}m_marca`).off('click').click(function () {
            $('#li_92').find('a').click();
        });
        $(`#${this._alias}m_productos`).off('click').click(function () {
            $('#li_72').find('a').click();
        });
        $(`#${this._alias}m_clientes`).off('click').click(function () {
            $('#li_77').find('a').click();
        });
        $(`#${this._alias}m_ventasdia`).off('click').click(function () {
            $('#li_68').find('a').click();
        });

        $(`#${this._alias}m_comprames`).off('click').click(function () {
            $('#li_67').find('a').click();
        });
        $(`#${this._alias}m_vender`).off('click').click(function () {
            $('#li_68').find('a').click();
        });
        $(`#${this._alias}m_pedidos`).off('click').click(function () {
            window.open('http://pedidos.fkike.com/', '_blank');
        });

        $(`#${this._alias}rd_mensual`).off('click').click((e) => {
            this._infoDashboardAdministrador(tk, $(e.currentTarget));
        });
        $(`#${this._alias}rd_semana`).off('click').click((e) => {
            this._currentWeek(tk, $(e.currentTarget));
        });
        $(`#${this._alias}rd_hoy`).off('click').click((e) => {
            this._salesToday(tk, $(e.currentTarget));
        });
    }

};  