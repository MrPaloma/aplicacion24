"use strict";
$$.System.InitAx = class InitAx extends $$.System.InitRsc {

    constructor() {
        super();
        this._controller = 'init:';
        this._alias = 'LG__';
        this._formLogin = `#${this._alias}formLogin`;
        this._dmain = `#${this._alias}${APP_CONTAINER_TABS}`; /*contenedor principal de opcion*/

        this._logOut = () => {
            this.send({
                token: _tk_,
                flag: 1,
                encrypt: true,
                context: this,
                success: (obj) => {
                    location.reload(true);
                }
            });
        };

        this._formDashBoard = (tk) => {
            this.send({
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(this._dmain).html(data);
                },
                final: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                }
            });
        };

        this._formDashBoardAdministrador = (tk) => {
            this.send({
                token: tk,
                context: this,
                dataType: 'text',
                response: (data) => {
                    $(this._dmain).html(data);
                },
                final: (obj) => {/*se ejecuta una vez que se cargo el HTML en success*/
                    this._infoDashboardAdministrador(tk);
                    //cada 5 minutos se debe actualizar la info
                    setInterval(() => {
                        this._infoDashboardAdministrador(tk);
                    }, 300000);
                    this.evts(tk);
                }
            });
        };

        this._infoDashboardAdministrador = (tk, btn = null) => {
            this.send({
                token: tk,
//                gifProcess: (btn) ? false : true,
                element: btn,
                context: this,
                response: (data) => {
                    this._setDashboardAdministrador(data, tk);
                    this._setPagarCobrar(data);
                }
            });
        };

        this._currentWeek = (tk, btn) => {
            this.send({
                token: tk,
                element: btn,
                context: this,
                response: (data) => {
                    this._setChartCurrentWeek(data, tk);
                }
            });
        };

        this._salesToday = (tk, btn) => {
            this.send({
                token: tk,
                element: btn,
                context: this,
                response: (data) => {
                    this._setChartSalesToday(data, tk);
                }
            });
        };

        this._initShorCut = () => {
            let m = '';
            switch (parseInt(APP_IDROL)) {
                case 2://administrador
                    m = `
                    <li>
                        <a href="javascript:;" onclick="$('#li_104').find('a').click()" class="jarvismetro-tile big-cubes bg-color-blue"> <span class="iconbox"> <i class="fa fa-building fa-4x"></i> <span>${APP_ETIQUET._148}</span> </span> </a>
                    </li>`;
                    break;
                case 5://vendedor
                    m = `
                    <li>
                        <a href="javascript:;" onclick="$('#li_105').find('a').click()" class="jarvismetro-tile big-cubes bg-color-pinkDark"> <span class="iconbox"> <i class="fa fa-user fa-4x"></i> <span>${APP_ETIQUET._147}</span> </span> </a>
                    </li>`;
                    break;
            }
            $('#shortcut').find('ul').html(m);
        };

    }

    main(tk) {
        this.addTour();
    }

    validaLogin() {
        this.validate();
    }

    postLogin() {
        _sys_sg = 'cnhdte4258udjft~~{[]__...zswfr214';/*solo para el login sera esta cadena*/
        this.send({
            token: _sys_sg, /*solo para el login sera 1*/
            flag: 1,
            element: '#btn_entrar',
            encrypt: true,
            form: this._formLogin,
            context: this,
            success: (obj) => {
                if (obj.data.result == 1) {
                    let row = obj.data.data;
                    localStorage.setItem('__', obj.data.rdm);

                    /*carga de los parametros*/
                    store.set('ID_CLIENTE_APP', row.id_cliente); //cliente del app, es unico para todo el sistema, es el que paga la mensualidad
                    store.set('ID_PERSONA', row.id_persona); //persona logueada
                    store.set('ID_USUARIO', row.id_usuario); //usuario logueado
                    store.set('IGV', row.igv); //igv ejm: 0.18
                    store.set('ID_LOCAL', row.id_local);
                    store.set('LOGO', obj.data.logo);
                    store.set('FORMATO_VENTA', row.formato_doc_venta);//formato del documento de venta

                    Tools.notify().ok({
                        content: APP_MSN.login_ok
                    });
                    location.reload(true);
                } else if (obj.data.result == 2) {
                    $("#login,.logo").effect('shake');
                    Tools.notify().error({
                        content: APP_MSN.login_fail
                    });
                } else if (obj.data.result == 3) {
                    $("#login,.logo").effect('shake');
                    Tools.notify().error({
                        content: APP_MSN.error_horario
                    });
                }
            }
        });
    }

    logOut(u) {
        if (!$.isEmptyObject(u)) {
            Tools.notify().confirm({
                content: `<span class="MsgTitle"><i class="fa fa-sign-out" style="color:orange"></i> ${APP_MSN.msn_logout} <span style="color:orange"><strong>${u}</strong></span> ?</span><p>${APP_MSN.msn_seguridad_logout}</p>`,
                yes: () => {
                    this._logOut();
                }
            });
        } else {
            this._logOut(); //se cierra desde ventana de inactividad
        }
    }

    formDashBoard() {
        Tools.addTab({
            context: this,
            id: this._alias,
            label: 'Panel',
            fnCallback: () => {
                switch (parseInt(APP_IDROL)) {
                    case 2:
                        this._formDashBoardAdministrador(_tk_);
                        break;
                    default:
                        this._formDashBoard(_tk_);
                        break;
                }
                setTimeout(()=>{
                    this._initShorCut();
                },1500);
            }
        });
    }

    postChangeLanguage(elm) {
        this.send({
            flag: 1,
            token: _tk_,
            gifProcess: true,
            context: this,
            serverParams: (sData) => {
                sData.push({name: '_language', value: $(elm).data('lang')});
            },
            success: (obj) => {
                location.reload(true);
            }
        });
    }

    postChangeRol(idrol) {
        this.send({
            token: _tk_,
            gifProcess: true,
            context: this,
            serverParams: (sData) => {
                sData.push({name: '_idRol', value: idrol});
            },
            success: (obj) => {
                //si rol es 4=> developer,cargar app developer
                if (idrol == 4) {
                    location.href = `${window.location.href}developer`;
                } else {
                    location.reload(true);
                }
            }
        });
    }

    addEvtsPanelConfig() {
        this.addEvtsPanelConfigRsc(this);
    }

    inactividad() {
        this.inactividadRsc();
    }

    appTheme(f, v) {
        this.send({
            token: _tk_,
            flag: f,
            context: this,
            serverParams: (sData) => {
                sData.push({name: '_value', value: v});
            },
            success: (obj) => {
                if (f == 7) {
                    location.reload();
                }
            }
        });
    }

}; 